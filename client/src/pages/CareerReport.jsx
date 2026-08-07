import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, RefreshCw, TrendingUp, DollarSign, AlertTriangle, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../components/layout/Sidebar'
import { api } from '../lib/api'
import { getScoreColor, formatCurrency } from '../lib/utils'

// ── Role Card ──────────────────────────────────────────────────
const RoleCard = ({ role, fit, score, reasoning, delay }) => (
  <motion.div
    className="glass-card"
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    style={{
      padding: '18px 20px',
      border: fit ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.15)',
      background: fit ? 'rgba(16,185,129,0.04)' : 'rgba(15,23,36,0.7)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {fit
          ? <CheckCircle2 size={20} style={{ color: '#10b981' }} />
          : <XCircle size={20} style={{ color: '#ef4444' }} />
        }
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: fit ? '#10b981' : 'var(--text-primary)' }}>
            {role}
          </p>
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: getScoreColor(score),
            background: `${getScoreColor(score)}18`,
            padding: '2px 8px', borderRadius: 6,
          }}>
            {score}%
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{reasoning}</p>
      </div>
    </div>
  </motion.div>
)

// ── Salary Card ────────────────────────────────────────────────
const SalaryCard = ({ title, min, max, currency, flag }) => (
  <div className="glass-card" style={{ padding: 22 }}>
    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{flag} {title}</p>
    <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
      {formatCurrency(min, currency)}
      <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}> – </span>
      {formatCurrency(max, currency)}
    </p>
    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>per year</p>
  </div>
)

export default function CareerReport() {
  const queryClient = useQueryClient()

  const { data: report, isLoading } = useQuery({
    queryKey: ['report'],
    queryFn: () => api.get('/api/report').then(r => r.data),
  })

  const generateMutation = useMutation({
    mutationFn: () => api.post('/api/report/generate').then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['report'])
      toast.success('Career report generated!')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to generate report'),
  })

  const fitted = report?.roleRecommendations?.filter(r => r.fit) || []
  const notFitted = report?.roleRecommendations?.filter(r => !r.fit) || []

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Career Report
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              AI-powered assessment based on your analyzed repositories.
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            style={{ padding: '9px 18px', fontSize: 13 }}
          >
            <RefreshCw size={14} style={{ animation: generateMutation.isPending ? 'spin 1s linear infinite' : 'none' }} />
            Regenerate Report
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 80, borderRadius: 12 }} />)}
          </div>
        ) : !report ? (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
            <Award size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No report generated yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Analyze at least one repository first, then generate your career report.
            </p>
            <button className="btn-primary" onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
              <RefreshCw size={15} /> Generate My Report
            </button>
          </div>
        ) : (
          <>
            {/* Overall score banner */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '24px 28px', marginBottom: 24,
                background: 'linear-gradient(135deg, var(--border) 0%, rgba(168,85,247,0.04) 100%)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Overall Score</p>
                <div style={{ fontSize: 56, fontWeight: 900, color: getScoreColor(report.overallScore), lineHeight: 1 }}>
                  {report.overallScore}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>/100</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Score Breakdown
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {Object.entries(report.scores || {}).map(([key, value]) => (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: getScoreColor(value) }}>{value}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${value}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                          style={{ height: '100%', background: getScoreColor(value), borderRadius: 2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Role Recommendations */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Role Recommendations</h2>

              {fitted.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: '#10b981', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} /> Ready for these roles ({fitted.length})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {fitted.map((r, i) => (
                      <RoleCard key={r.role} {...r} delay={i * 0.06} />
                    ))}
                  </div>
                </div>
              )}

              {notFitted.length > 0 && (
                <div>
                  <p style={{ fontSize: 13, color: '#ef4444', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <XCircle size={14} /> Not ready yet ({notFitted.length})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {notFitted.map((r, i) => (
                      <RoleCard key={r.role} {...r} delay={fitted.length * 0.06 + i * 0.06} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Salary Estimates */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarSign size={18} style={{ color: '#10b981' }} /> Estimated Salary Range
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <SalaryCard
                  title="India (On-site)"
                  flag="🇮🇳"
                  min={report.salaryEstimate?.india?.min}
                  max={report.salaryEstimate?.india?.max}
                  currency="INR"
                />
                <SalaryCard
                  title="Remote Global"
                  flag="🌍"
                  min={report.salaryEstimate?.remoteGlobal?.min}
                  max={report.salaryEstimate?.remoteGlobal?.max}
                  currency="USD"
                />
              </div>
            </div>

            {/* Technical Gaps */}
            {report.technicalGaps?.length > 0 && (
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={16} style={{ color: '#f59e0b' }} /> Technical Gaps
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {report.technicalGaps.map((gap, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                      <span className={`badge ${gap.priority === 'high' ? 'badge-red' : gap.priority === 'medium' ? 'badge-yellow' : 'badge-blue'}`} style={{ fontSize: 10, flexShrink: 0, marginTop: 1 }}>
                        {gap.priority}
                      </span>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{gap.skill}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{gap.description}</p>
                      </div>
                    </div>
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
