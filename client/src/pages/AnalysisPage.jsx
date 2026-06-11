import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, Star, GitFork, Globe, ChevronDown, ChevronUp, Zap, CheckCircle2, XCircle, Clock, FileCode2, TestTube, Shield, BookOpen, Layers, Code2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../components/layout/Sidebar'
import { api } from '../lib/api'
import { getScoreColor, getScoreLabel, formatNumber, timeAgo } from '../lib/utils'

const CATEGORIES = [
  { key: 'codeQuality', label: 'Code Quality', icon: <Code2 size={16} /> },
  { key: 'architecture', label: 'Architecture', icon: <Layers size={16} /> },
  { key: 'maintainability', label: 'Maintainability', icon: <GitBranch size={16} /> },
  { key: 'scalability', label: 'Scalability', icon: <Globe size={16} /> },
  { key: 'documentation', label: 'Documentation', icon: <BookOpen size={16} /> },
  { key: 'testing', label: 'Testing', icon: <TestTube size={16} /> },
  { key: 'security', label: 'Security', icon: <Shield size={16} /> },
]

// ── Category Score Card ────────────────────────────────────────
const CategoryCard = ({ category, scores, aiReview }) => {
  const [open, setOpen] = useState(false)
  const score = scores?.[category.key] || 0
  const color = getScoreColor(score)
  const explanation = aiReview?.categoryExplanations?.[category.key]

  return (
    <motion.div
      className="glass-card"
      style={{ overflow: 'hidden', border: open ? '1px solid var(--border-strong)' : '1px solid var(--border)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        }}>
          {category.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{category.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color }}>{score}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>/100</span>
              {open ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
            </div>
          </div>
          <div style={{ height: 4, background: 'rgba(99,102,241,0.1)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              style={{ height: '100%', background: color, borderRadius: 2 }}
            />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
              {explanation ? (
                <>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12, marginTop: 12 }}>
                    {explanation.explanation}
                  </p>
                  {explanation.suggestions?.length > 0 && (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Suggestions
                      </p>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {explanation.suggestions.map((s, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <ChevronDown size={14} style={{ color: '#6366f1', marginTop: 2, flexShrink: 0, transform: 'rotate(-90deg)' }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12 }}>
                  No detailed explanation available. Score based on repository metrics.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Status Badge ───────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending: { label: 'Queued', class: 'badge-yellow', icon: <Clock size={11} /> },
    analyzing: { label: 'Analyzing...', class: 'badge-blue', icon: <Zap size={11} /> },
    completed: { label: 'Complete', class: 'badge-green', icon: <CheckCircle2 size={11} /> },
    failed: { label: 'Failed', class: 'badge-red', icon: <XCircle size={11} /> },
  }
  const s = map[status] || map.pending
  return <span className={`badge ${s.class}`}>{s.icon} {s.label}</span>
}

export default function AnalysisPage() {
  const { id: analysisId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch user repos for the selector
  const { data: repos = [], isLoading: reposLoading } = useQuery({
    queryKey: ['user-repos'],
    queryFn: () => api.get('/api/user/repos').then(r => r.data),
    enabled: !analysisId,
  })

  // Fetch specific analysis if ID provided
  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: () => api.get(`/api/analysis/${analysisId}`).then(r => r.data),
    enabled: !!analysisId,
    refetchInterval: (data) => data?.status === 'analyzing' || data?.status === 'pending' ? 3000 : false,
  })

  // Start analysis mutation
  const startMutation = useMutation({
    mutationFn: (repoFullName) => api.post('/api/analysis/start', { repoFullName }).then(r => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['user-stats'])
      navigate(`/analysis/${data._id}`)
      toast.success('Analysis started! This may take up to 2 minutes.')
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to start analysis')
    },
  })

  const filteredRepos = repos.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.language?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ── Repo Selector View ─────────────────────────────────────
  if (!analysisId) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Sidebar />
        <main style={{ marginLeft: 220, flex: 1, padding: '32px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Analyze a Repository
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Select a GitHub repository to get your AI-powered engineering review.
            </p>
          </motion.div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <FileCode2 size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 36 }}
            />
          </div>

          {reposLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shimmer" style={{ height: 72, borderRadius: 10 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredRepos.map((repo) => (
                <motion.div
                  key={repo.id}
                  className="glass-card-hover"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '14px 18px', cursor: 'pointer',
                    border: selectedRepo?.id === repo.id ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--border)',
                    background: selectedRepo?.id === repo.id ? 'rgba(99,102,241,0.06)' : 'rgba(15,23,36,0.7)',
                  }}
                  onClick={() => setSelectedRepo(repo)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <GitBranch size={16} style={{ color: '#818cf8', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{repo.name}</p>
                        {repo.description && (
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>
                            {repo.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      {repo.language && <span className="badge badge-blue" style={{ fontSize: 11 }}>{repo.language}</span>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Star size={11} /> {formatNumber(repo.stars)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <GitFork size={11} /> {formatNumber(repo.forks)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedRepo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'fixed', bottom: 32, right: 32, left: 252,
                background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(99,102,241,0.35)', borderRadius: 14,
                padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Selected repository</p>
                <p style={{ fontWeight: 700, fontSize: 16 }}>{selectedRepo.fullName}</p>
              </div>
              <button
                className="btn-primary"
                onClick={() => startMutation.mutate(selectedRepo.fullName)}
                disabled={startMutation.isPending}
                style={{ padding: '12px 24px', fontSize: 15 }}
              >
                {startMutation.isPending ? (
                  <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Analyzing...</>
                ) : (
                  <><Zap size={16} /> Analyze Now</>
                )}
              </button>
            </motion.div>
          )}
        </main>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Analysis Result View ───────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '32px' }}>
        {analysisLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="shimmer" style={{ height: 32, width: 300, borderRadius: 8 }} />
            <div className="shimmer" style={{ height: 120, borderRadius: 12 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 60, borderRadius: 10 }} />)}
            </div>
          </div>
        ) : !analysis ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <AlertTriangle size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 18, fontWeight: 600 }}>Analysis not found</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8',
                }}>
                  <GitBranch size={20} />
                </div>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{analysis.repoId}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <StatusBadge status={analysis.status} />
                    {analysis.language && <span className="badge badge-blue" style={{ fontSize: 11 }}>{analysis.language}</span>}
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(analysis.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Repo stats */}
              {analysis.status === 'completed' && (
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {[
                    { icon: <Star size={13} />, label: formatNumber(analysis.stars) + ' stars' },
                    { icon: <GitFork size={13} />, label: formatNumber(analysis.forks) + ' forks' },
                    { icon: <FileCode2 size={13} />, label: (analysis.metrics?.totalFiles || 0) + ' files' },
                    { icon: <GitBranch size={13} />, label: (analysis.metrics?.commitCount || 0) + ' commits' },
                  ].map((stat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{stat.icon}</span>
                      {stat.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analyzing progress */}
            {(analysis.status === 'analyzing' || analysis.status === 'pending') && (
              <motion.div
                className="glass-card"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: 40, textAlign: 'center', marginBottom: 24 }}
              >
                <div style={{
                  width: 56, height: 56, border: '4px solid rgba(99,102,241,0.2)',
                  borderTopColor: '#6366f1', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 20px',
                }} />
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Analyzing Repository...</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  AI is reviewing your code structure, patterns, and engineering practices. This takes 30–90 seconds.
                </p>
              </motion.div>
            )}

            {analysis.status === 'failed' && (
              <div className="glass-card" style={{ padding: 28, textAlign: 'center', borderColor: 'rgba(239,68,68,0.3)', marginBottom: 24 }}>
                <XCircle size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
                <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Analysis Failed</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{analysis.errorMessage || 'An unexpected error occurred.'}</p>
              </div>
            )}

            {analysis.status === 'completed' && (
              <>
                {/* Overall score + readiness */}
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, marginBottom: 24 }}>
                  <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Overall Score</p>
                    <div style={{ fontSize: 52, fontWeight: 900, color: getScoreColor(analysis.scores.overall), lineHeight: 1 }}>
                      {analysis.scores.overall}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>/100</p>
                    <p style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: getScoreColor(analysis.scores.overall) }}>
                      {getScoreLabel(analysis.scores.overall)}
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: 24 }}>
                    {/* Strengths & Weaknesses */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                          ✓ Strengths
                        </p>
                        {(analysis.aiReview?.strengths || []).slice(0, 4).map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 7 }}>
                            <CheckCircle2 size={13} style={{ color: '#10b981', marginTop: 2, flexShrink: 0 }} />
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                          ✗ Weaknesses
                        </p>
                        {(analysis.aiReview?.weaknesses || []).slice(0, 4).map((w, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 7 }}>
                            <XCircle size={13} style={{ color: '#ef4444', marginTop: 2, flexShrink: 0 }} />
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{w}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category breakdown */}
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Category Breakdown</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {CATEGORIES.map((cat) => (
                      <CategoryCard
                        key={cat.key}
                        category={cat}
                        scores={analysis.scores}
                        aiReview={analysis.aiReview}
                      />
                    ))}
                  </div>
                </div>

                {/* Missing skills & suggested projects */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="glass-card" style={{ padding: 22 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#f59e0b' }}>⚠ Missing Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(analysis.aiReview?.missingSkills || []).map((skill, i) => (
                        <span key={i} className="badge badge-yellow">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card" style={{ padding: 22 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#818cf8' }}>💡 Suggested Projects</h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(analysis.aiReview?.suggestedProjects || []).map((p, i) => (
                        <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 6 }}>
                          <span style={{ color: '#818cf8' }}>→</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
