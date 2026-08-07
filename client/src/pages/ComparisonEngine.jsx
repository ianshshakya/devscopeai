import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart3, Trophy, TrendingUp, Users } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import { api } from '../lib/api'
import { getScoreColor } from '../lib/utils'

const DIMENSION_LABELS = {
  codeQuality: 'Code Quality',
  architecture: 'Architecture',
  maintainability: 'Maintainability',
  scalability: 'Scalability',
  documentation: 'Documentation',
  testing: 'Testing',
  security: 'Security',
  frontend: 'Frontend',
  backend: 'Backend',
}

const getPercentileLabel = (p) => {
  if (p >= 90) return 'Top 10%'
  if (p >= 80) return 'Top 20%'
  if (p >= 70) return 'Top 30%'
  if (p >= 60) return 'Top 40%'
  if (p >= 50) return 'Top 50%'
  return `Bottom ${100 - p}%`
}

const getPercentileColor = (p) => {
  if (p >= 80) return '#10b981'
  if (p >= 60) return '#f59e0b'
  if (p >= 40) return '#f97316'
  return '#ef4444'
}

export default function ComparisonEngine() {
  const { data, isLoading } = useQuery({
    queryKey: ['comparison'],
    queryFn: () => api.get('/api/comparison').then(r => r.data),
  })

  const dimensions = Object.entries(DIMENSION_LABELS)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '32px' }}>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            How You Compare
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Your scores vs. {data?.totalUsersCompared || 0} other developers on the platform.
          </p>
        </motion.div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[...Array(6)].map((_, i) => <div key={i} className="shimmer" style={{ height: 72, borderRadius: 12 }} />)}
          </div>
        ) : data?.error ? (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
            <BarChart3 size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No comparison data yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Analyze at least one repository to see how you compare.</p>
          </div>
        ) : (
          <>
            {/* Top stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
              {[
                {
                  icon: <Trophy size={20} />,
                  label: 'Best Category',
                  value: (() => {
                    const top = Object.entries(data?.percentiles || {}).sort((a, b) => b[1] - a[1])[0]
                    return top ? `${DIMENSION_LABELS[top[0]]} (${getPercentileLabel(top[1])})` : '—'
                  })(),
                  color: '#f59e0b',
                },
                {
                  icon: <TrendingUp size={20} />,
                  label: 'Overall Ranking',
                  value: (() => {
                    const overall = data?.userScores?.overall || 0
                    const avg = data?.platformAverages?.overall || 50
                    const diff = overall - avg
                    return diff >= 0 ? `+${diff} above average` : `${diff} below average`
                  })(),
                  color: 'var(--text-primary)',
                },
                {
                  icon: <Users size={20} />,
                  label: 'Developers Compared',
                  value: (data?.totalUsersCompared || 0).toLocaleString(),
                  color: '#10b981',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="glass-card"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ padding: 20 }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: stat.color, marginBottom: 12,
                  }}>
                    {stat.icon}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{stat.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Comparison bars */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ padding: 28 }}
            >
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>Skill Percentiles</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {dimensions.map(([key, label], i) => {
                  const userScore = data?.userScores?.[key] || 0
                  const platformAvg = data?.platformAverages?.[key] || 50
                  const percentile = data?.percentiles?.[key] || 50
                  const color = getPercentileColor(percentile)

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            You: <strong style={{ color: getScoreColor(userScore) }}>{userScore}</strong>
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            Avg: <strong style={{ color: 'var(--text-secondary)' }}>{platformAvg}</strong>
                          </span>
                          <span style={{
                            fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                            color, background: `${color}15`, border: `1px solid ${color}25`,
                          }}>
                            {getPercentileLabel(percentile)}
                          </span>
                        </div>
                      </div>

                      {/* Dual bar */}
                      <div style={{ position: 'relative', height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                        {/* Platform average */}
                        <div style={{
                          position: 'absolute', left: 0, top: 0, height: '100%',
                          width: `${platformAvg}%`, background: 'var(--border)', borderRadius: 5,
                        }} />
                        {/* User score */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${userScore}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 + i * 0.04 }}
                          style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: color, borderRadius: 5, opacity: 0.85 }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>0</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>100</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: 20, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <div style={{ width: 20, height: 6, background: 'var(--text-primary)', borderRadius: 3 }} />
                  Your Score
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <div style={{ width: 20, height: 6, background: 'var(--border)', borderRadius: 3 }} />
                  Platform Average
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  )
}
