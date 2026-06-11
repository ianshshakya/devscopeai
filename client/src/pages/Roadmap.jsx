import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Map, CheckCircle2, RefreshCw, ExternalLink, BookOpen, Code2, Play } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../components/layout/Sidebar'
import { api } from '../lib/api'

const RESOURCE_ICONS = {
  course: <Play size={13} />,
  article: <BookOpen size={13} />,
  project: <Code2 size={13} />,
  book: <BookOpen size={13} />,
  video: <Play size={13} />,
}

const RESOURCE_COLORS = {
  course: '#6366f1',
  article: '#06b6d4',
  project: '#10b981',
  book: '#f59e0b',
  video: '#a855f7',
}

const DIFFICULTY_COLORS = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function Roadmap() {
  const queryClient = useQueryClient()

  const { data: roadmap, isLoading } = useQuery({
    queryKey: ['roadmap'],
    queryFn: () => api.get('/api/roadmap').then(r => r.data),
  })

  const generateMutation = useMutation({
    mutationFn: () => api.post('/api/roadmap/generate').then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['roadmap'])
      toast.success('Roadmap generated!')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Generate your career report first'),
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '32px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Your Roadmap</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              AI-generated learning path tailored to your current skill gaps.
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            style={{ padding: '9px 18px', fontSize: 13 }}
          >
            <RefreshCw size={14} style={{ animation: generateMutation.isPending ? 'spin 1s linear infinite' : 'none' }} />
            Regenerate
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 120, borderRadius: 12 }} />)}
          </div>
        ) : !roadmap ? (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
            <Map size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No roadmap yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Generate your Career Report first, then create your personalized roadmap.
            </p>
            <button className="btn-primary" onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
              Generate My Roadmap
            </button>
          </div>
        ) : (
          <>
            {/* Summary banner */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: 24, marginBottom: 28, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}
            >
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Current Level</p>
                <p style={{ fontSize: 17, fontWeight: 700 }}>{roadmap.currentLevel}</p>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 20 }}>→</div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Target Role</p>
                <p style={{ fontSize: 17, fontWeight: 700, color: '#818cf8' }}>{roadmap.targetRole}</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Estimated Timeline</p>
                <p style={{ fontSize: 20, fontWeight: 800 }}>{roadmap.estimatedTotalWeeks} weeks</p>
              </div>
            </motion.div>

            {/* Milestones */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Learning Milestones</h2>
              <div style={{ position: 'relative' }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute', left: 19, top: 0, bottom: 0, width: 2,
                  background: 'linear-gradient(to bottom, #6366f1, rgba(99,102,241,0.1))',
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {(roadmap.milestones || []).sort((a, b) => a.order - b.order).map((milestone, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      style={{ paddingLeft: 52, position: 'relative' }}
                    >
                      {/* Circle node */}
                      <div style={{
                        position: 'absolute', left: 0, top: 12,
                        width: 40, height: 40, borderRadius: '50%',
                        background: milestone.completed ? '#10b981' : 'rgba(99,102,241,0.15)',
                        border: `2px solid ${milestone.completed ? '#10b981' : 'rgba(99,102,241,0.4)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: milestone.completed ? 'white' : '#818cf8', fontWeight: 700, fontSize: 13,
                      }}>
                        {milestone.completed ? <CheckCircle2 size={18} /> : milestone.order}
                      </div>

                      <div className="glass-card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{milestone.title}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{milestone.description}</p>
                          </div>
                          <span className="badge badge-blue" style={{ flexShrink: 0, marginLeft: 12 }}>
                            {milestone.estimatedWeeks}w
                          </span>
                        </div>

                        {milestone.skills?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                            {milestone.skills.map((skill, j) => (
                              <span key={j} className="badge badge-purple" style={{ fontSize: 11 }}>{skill}</span>
                            ))}
                          </div>
                        )}

                        {milestone.resources?.length > 0 && (
                          <div>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                              Resources
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {milestone.resources.map((res, j) => (
                                <a
                                  key={j}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '6px 10px', borderRadius: 6,
                                    background: `${RESOURCE_COLORS[res.type] || '#6366f1'}10`,
                                    border: `1px solid ${RESOURCE_COLORS[res.type] || '#6366f1'}25`,
                                    color: RESOURCE_COLORS[res.type] || '#818cf8',
                                    textDecoration: 'none', fontSize: 13, fontWeight: 500,
                                    transition: 'all 0.15s',
                                  }}
                                >
                                  {RESOURCE_ICONS[res.type] || <BookOpen size={13} />}
                                  <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{res.title}</span>
                                  <ExternalLink size={11} style={{ flexShrink: 0 }} />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Projects */}
            {roadmap.suggestedProjects?.length > 0 && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Suggested Projects</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {roadmap.suggestedProjects.map((project, i) => (
                    <motion.div
                      key={i}
                      className="glass-card-hover"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ padding: 20 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700 }}>{project.title}</h3>
                        <span style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 5, fontWeight: 600,
                          color: DIFFICULTY_COLORS[project.difficulty],
                          background: `${DIFFICULTY_COLORS[project.difficulty]}15`,
                          border: `1px solid ${DIFFICULTY_COLORS[project.difficulty]}30`,
                        }}>
                          {project.difficulty}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{project.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(project.techStack || []).map((tech, j) => (
                          <span key={j} className="badge badge-blue" style={{ fontSize: 11 }}>{tech}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
