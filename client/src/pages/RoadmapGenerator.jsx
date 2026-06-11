import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, ArrowRight, Plus, Trash2, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import Navbar from '../components/layout/Navbar'

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'React Developer', 'Node.js Developer', 'Python Developer',
  'Flutter Developer', 'Mobile Developer', 'DevOps Engineer',
  'Data Scientist', 'ML Engineer', 'UI/UX Designer',
  'Junior Developer', 'Software Engineer', 'Tech Lead',
]

const MONTH_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#6366f1']

export default function RoadmapGenerator() {
  const [currentRole, setCurrentRole] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!currentRole.trim() || !targetRole.trim()) {
      setError('Please fill in both fields')
      return
    }
    setError('')
    setLoading(true)
    setRoadmap(null)
    try {
      const res = await api.post('/api/public/roadmap', { currentRole, targetRole })
      setRoadmap(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate roadmap. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 20, marginBottom: 20,
          }}>
            <Map size={14} style={{ color: '#818cf8' }} />
            <span style={{ fontSize: 13, color: '#818cf8', fontWeight: 600 }}>Free • No Login Required</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
            Career Roadmap<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Generator
            </span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
            Enter where you are and where you want to be. Get a month-by-month AI learning plan.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ padding: 32, marginBottom: 32 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'end', marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                I am currently a...
              </label>
              <input
                list="current-roles"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="e.g. Junior React Developer"
                className="input-field"
                style={{ width: '100%' }}
              />
              <datalist id="current-roles">
                {ROLES.map(r => <option key={r} value={r} />)}
              </datalist>
            </div>

            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ArrowRight size={18} style={{ color: '#818cf8' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                I want to become a...
              </label>
              <input
                list="target-roles"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer"
                className="input-field"
                style={{ width: '100%' }}
              />
              <datalist id="target-roles">
                {ROLES.map(r => <option key={r} value={r} />)}
              </datalist>
            </div>
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}

          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16, fontWeight: 700 }}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} /> Generating your roadmap...</>
            ) : (
              <><Map size={18} /> Generate My Roadmap</>
            )}
          </button>
        </motion.div>

        {/* Roadmap Result */}
        <AnimatePresence>
          {roadmap && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Summary */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32,
              }}>
                {[
                  { label: 'From', value: roadmap.currentRole, color: '#6366f1' },
                  { label: 'Duration', value: `${roadmap.totalMonths} months`, color: '#10b981' },
                  { label: 'To', value: roadmap.targetRole, color: '#a855f7' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="glass-card"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ padding: 20, textAlign: 'center' }}
                  >
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Salary Impact */}
              {roadmap.salaryImpact && (
                <div className="glass-card" style={{ padding: 20, marginBottom: 28, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>💰 Expected Salary Impact</p>
                  {roadmap.salaryImpact.india && (
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                      🇮🇳 India: <strong>{roadmap.salaryImpact.india.from}</strong> → <strong style={{ color: '#10b981' }}>{roadmap.salaryImpact.india.to}</strong>
                    </p>
                  )}
                  {roadmap.salaryImpact.global && (
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                      🌍 Remote: <strong>{roadmap.salaryImpact.global.from}</strong> → <strong style={{ color: '#10b981' }}>{roadmap.salaryImpact.global.to}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Timeline */}
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Your Month-by-Month Plan</h2>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 23, top: 0, bottom: 0, width: 2,
                  background: 'linear-gradient(to bottom, #6366f1, rgba(99,102,241,0.05))',
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {(roadmap.milestones || []).map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ paddingLeft: 56, position: 'relative' }}
                    >
                      {/* Month circle */}
                      <div style={{
                        position: 'absolute', left: 0, top: 14,
                        width: 48, height: 48, borderRadius: '50%',
                        background: `${MONTH_COLORS[i % MONTH_COLORS.length]}20`,
                        border: `2px solid ${MONTH_COLORS[i % MONTH_COLORS.length]}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column',
                      }}>
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', lineHeight: 1 }}>MON</span>
                        <span style={{ fontSize: 16, fontWeight: 900, color: MONTH_COLORS[i % MONTH_COLORS.length], lineHeight: 1 }}>{m.month}</span>
                      </div>

                      <div className="glass-card" style={{ padding: 22 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{m.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{m.description}</p>

                        {m.skills?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                            {m.skills.map((s, j) => (
                              <span key={j} className="badge badge-purple" style={{ fontSize: 11 }}>{s}</span>
                            ))}
                          </div>
                        )}

                        {m.resources?.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {m.resources.map((r, j) => (
                              <a key={j} href={r.url} target="_blank" rel="noopener noreferrer"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
                                  padding: '6px 10px', borderRadius: 6, textDecoration: 'none',
                                  background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
                                  color: '#818cf8', transition: 'all 0.15s',
                                }}>
                                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{r.title}</span>
                                <span className="badge badge-blue" style={{ fontSize: 10 }}>{r.type}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key Projects */}
              {roadmap.keyProjects?.length > 0 && (
                <div style={{ marginTop: 36 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>🏗 Portfolio Projects to Build</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    {roadmap.keyProjects.map((p, i) => (
                      <motion.div
                        key={i}
                        className="glass-card-hover"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ padding: 20 }}
                      >
                        <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{p.title}</h4>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{p.description}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {(p.techStack || []).map((t, j) => (
                            <span key={j} className="badge badge-blue" style={{ fontSize: 11 }}>{t}</span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share + Reset */}
              <div style={{ display: 'flex', gap: 12, marginTop: 36, justifyContent: 'center' }}>
                <button className="btn-primary" onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied!')
                }}>
                  Share Roadmap
                </button>
                <button className="btn-secondary" onClick={() => { setRoadmap(null); setCurrentRole(''); setTargetRole('') }}>
                  Generate Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
