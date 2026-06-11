import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GitBranch, TrendingUp, Shield, TestTube, Code2, Award, ArrowRight, Plus, Clock } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import Sidebar from '../components/layout/Sidebar'
import { api } from '../lib/api'
import { getScoreColor, getScoreLabel, timeAgo } from '../lib/utils'
import { useAuth } from '../lib/authContext'

// ── Animated score number ──────────────────────────────────────
const AnimatedScore = ({ score, size = 'lg' }) => {
  const color = getScoreColor(score)
  const radius = size === 'lg' ? 40 : 28
  const stroke = size === 'lg' ? 4 : 3
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size === 'lg' ? 100 : 70} height={size === 'lg' ? 100 : 70} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size === 'lg' ? 50 : 35} cy={size === 'lg' ? 50 : 35} r={radius} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth={stroke} />
        <motion.circle
          cx={size === 'lg' ? 50 : 35} cy={size === 'lg' ? 50 : 35} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: size === 'lg' ? 24 : 16, fontWeight: 800, color, lineHeight: 1 }}
        >
          {score}
        </motion.div>
        {size === 'lg' && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>/100</div>}
      </div>
    </div>
  )
}

// ── Score Card ─────────────────────────────────────────────────
const ScoreCard = ({ title, score, icon, delay = 0 }) => (
  <motion.div
    className="glass-card-hover"
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}
  >
    <AnimatedScore score={score} size="sm" />
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{title}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: getScoreColor(score) }}>{getScoreLabel(score)}</p>
    </div>
  </motion.div>
)

// ── Custom Radar Tooltip ───────────────────────────────────────
const RadarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card" style={{ padding: '8px 12px', fontSize: 13 }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 2 }}>{payload[0].payload.dimension}</p>
      <p style={{ fontWeight: 700, color: getScoreColor(payload[0].value) }}>{payload[0].value}/100</p>
    </div>
  )
}

// ── Loading Skeleton ───────────────────────────────────────────
const Skeleton = ({ h = 20, w = '100%', style = {} }) => (
  <div className="shimmer" style={{ height: h, width: w, ...style }} />
)

export default function Dashboard() {
  const { user } = useAuth()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => api.get('/api/user/stats').then(r => r.data),
    staleTime: 2 * 60 * 1000,
  })

  const radarData = stats ? [
    { dimension: 'Code Quality', score: stats.avgScores?.codeQuality || 0 },
    { dimension: 'Architecture', score: stats.avgScores?.architecture || 0 },
    { dimension: 'Testing', score: stats.avgScores?.testing || 0 },
    { dimension: 'Security', score: stats.avgScores?.security || 0 },
    { dimension: 'Docs', score: stats.avgScores?.documentation || 0 },
    { dimension: 'Frontend', score: stats.avgScores?.frontend || 0 },
    { dimension: 'Backend', score: stats.avgScores?.backend || 0 },
  ] : []

  const timelineData = stats?.scoreHistory?.slice(-10).reverse().map((h, i) => ({
    name: h.repoName?.slice(0, 12) || `Repo ${i+1}`,
    score: h.score,
  })) || []

  const overallScore = stats?.avgScores?.overall || 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '32px 32px', minWidth: 0 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6 }}>
            Welcome back,
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {user?.displayName || user?.username} 👋
          </h1>
        </motion.div>

        {/* ── Overall Score + Quick Actions ─────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24, alignItems: 'stretch' }}>
          {/* Overall Score */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
          >
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Overall Readiness Score</p>
            {isLoading ? (
              <Skeleton h={100} w={100} style={{ borderRadius: '50%', margin: '0 auto' }} />
            ) : (
              <AnimatedScore score={overallScore} size="lg" />
            )}
            <p style={{ marginTop: 12, fontSize: 15, fontWeight: 700, color: getScoreColor(overallScore) }}>
              {getScoreLabel(overallScore)}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Based on {stats?.analysisCount || 0} repositor{stats?.analysisCount === 1 ? 'y' : 'ies'}
            </p>
          </motion.div>

          {/* Quick Score Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="glass-card" style={{ padding: 20 }}>
                  <Skeleton h={70} style={{ borderRadius: 8 }} />
                </div>
              ))
            ) : (
              <>
                <ScoreCard title="Frontend" score={stats?.avgScores?.frontend || 0} delay={0.1} />
                <ScoreCard title="Backend" score={stats?.avgScores?.backend || 0} delay={0.15} />
                <ScoreCard title="Security" score={stats?.avgScores?.security || 0} delay={0.2} />
                <ScoreCard title="Testing" score={stats?.avgScores?.testing || 0} delay={0.25} />
              </>
            )}
          </div>
        </div>

        {/* ── Charts Row ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Radar Chart */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ padding: 24 }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Skill Radar</h2>
            {isLoading || radarData.length === 0 ? (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isLoading ? <Skeleton h={200} /> : (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Analyze repos to see your radar</p>
                )}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(99,102,241,0.15)" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#8b9cc8', fontSize: 11 }} />
                  <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip content={<RadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Growth Timeline */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ padding: 24 }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Score Timeline</h2>
            {isLoading || timelineData.length === 0 ? (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isLoading ? <Skeleton h={200} /> : (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Analyze multiple repos to see growth</p>
                )}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timelineData}>
                  <CartesianGrid stroke="rgba(99,102,241,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#8b9cc8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#8b9cc8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#0f1724', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: 8, fontSize: 13, color: '#f0f4ff',
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* ── Recent Analyses ────────────────────────────────── */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Recent Analyses</h2>
            <Link to="/analysis" className="btn-primary" style={{ padding: '7px 14px', fontSize: 13 }}>
              <Plus size={15} /> New Analysis
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...Array(3)].map((_, i) => <Skeleton key={i} h={56} />)}
            </div>
          ) : !stats?.recentAnalyses?.length ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <GitBranch size={32} style={{ color: 'var(--text-muted)', marginBottom: 12, margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>No analyses yet</p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
                Connect your GitHub repos to get started
              </p>
              <Link to="/analysis" className="btn-primary">
                <Plus size={15} /> Analyze a Repository
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.recentAnalyses.map((analysis, i) => (
                <motion.div
                  key={analysis._id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                >
                  <Link
                    to={`/analysis/${analysis._id}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: 8, textDecoration: 'none',
                      border: '1px solid var(--border)', transition: 'all 0.15s',
                      background: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-strong)'
                      e.currentTarget.style.background = 'rgba(99,102,241,0.04)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#818cf8', flexShrink: 0,
                      }}>
                        <GitBranch size={16} />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{analysis.repoName}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(analysis.createdAt)}</p>
                          {analysis.language && (
                            <span className="badge badge-blue" style={{ fontSize: 10, padding: '2px 7px' }}>{analysis.language}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 18, fontWeight: 800, color: getScoreColor(analysis.scores?.overall || 0) }}>
                          {analysis.scores?.overall || 0}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>score</p>
                      </div>
                      <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
