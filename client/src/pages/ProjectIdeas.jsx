import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Code2, Globe, Server, Smartphone, Loader2, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'
import Navbar from '../components/layout/Navbar'

const SKILL_LEVELS = [
  { value: 'beginner', label: '🌱 Beginner', desc: '0–6 months experience' },
  { value: 'intermediate', label: '🚀 Intermediate', desc: '6 months – 2 years' },
  { value: 'advanced', label: '⚡ Advanced', desc: '2+ years experience' },
]

const ROLES = [
  { value: 'Frontend Developer', icon: <Code2 size={16} />, color: '#00E676' },
  { value: 'Backend Developer', icon: <Server size={16} />, color: '#a855f7' },
  { value: 'Full Stack Developer', icon: <Globe size={16} />, color: '#10b981' },
  { value: 'Mobile Developer', icon: <Smartphone size={16} />, color: '#f59e0b' },
  { value: 'DevOps Engineer', icon: <Globe size={16} />, color: '#06b6d4' },
]

const TECH_STACKS = {
  'Frontend Developer': ['JavaScript, React, CSS', 'TypeScript, Next.js', 'Vue.js, Nuxt', 'Svelte, SvelteKit'],
  'Backend Developer': ['Node.js, Express, MongoDB', 'Python, Django, PostgreSQL', 'Java, Spring Boot', 'Go, Gin'],
  'Full Stack Developer': ['React, Node.js, MongoDB', 'Next.js, PostgreSQL', 'Vue.js, Laravel', 'React, Django'],
  'Mobile Developer': ['React Native', 'Flutter, Dart', 'Swift (iOS)', 'Kotlin (Android)'],
  'DevOps Engineer': ['Docker, Kubernetes, AWS', 'GCP, Terraform', 'CI/CD, GitHub Actions'],
}

const DIFFICULTY_COLORS = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' }

export default function ProjectIdeas() {
  const [skillLevel, setSkillLevel] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [techStack, setTechStack] = useState('')
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState(null)
  const [error, setError] = useState('')

  const stackOptions = TECH_STACKS[targetRole] || []

  const handleGenerate = async () => {
    if (!skillLevel || !targetRole || !techStack) {
      setError('Please fill in all fields')
      return
    }
    setError('')
    setLoading(true)
    setIdeas(null)
    try {
      const res = await api.post('/api/public/project-ideas', { skillLevel, targetRole, techStack })
      setIdeas(res.data.projects || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate ideas. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 20, marginBottom: 20,
          }}>
            <Lightbulb size={14} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>AI-Powered • Free • No Login</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
            Project Idea<br />
            <span style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Generator
            </span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
            Stop wondering what to build. Get 6 impressive portfolio project ideas tailored to your exact situation.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ padding: 32, marginBottom: 40 }}
        >
          {/* Skill Level */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Your Skill Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSkillLevel(level.value)}
                  style={{
                    padding: '14px 16px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    border: skillLevel === level.value ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: skillLevel === level.value ? 'rgba(0,230,118,0.08)' : 'rgba(15,23,36,0.5)',
                    transition: 'all 0.15s',
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{level.label}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{level.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Target Role */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Target Role
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => { setTargetRole(role.value); setTechStack('') }}
                  style={{
                    padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 7,
                    border: targetRole === role.value ? `2px solid ${role.color}` : '1px solid var(--border)',
                    background: targetRole === role.value ? `${role.color}15` : 'rgba(15,23,36,0.5)',
                    color: targetRole === role.value ? role.color : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
                  }}
                >
                  {role.icon} {role.value}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          {stackOptions.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Tech Stack
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {stackOptions.map((stack) => (
                  <button
                    key={stack}
                    onClick={() => setTechStack(stack)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                      border: techStack === stack ? '2px solid #a855f7' : '1px solid var(--border)',
                      background: techStack === stack ? 'rgba(168,85,247,0.1)' : 'rgba(15,23,36,0.5)',
                      color: techStack === stack ? '#c084fc' : 'var(--text-secondary)',
                      fontWeight: 600, transition: 'all 0.15s',
                    }}
                  >
                    {stack}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16, fontWeight: 700 }}
          >
            {loading
              ? <><Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} /> Generating ideas...</>
              : <><Lightbulb size={18} /> Generate 6 Project Ideas</>
            }
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {ideas && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
                🎯 6 Projects Built for You
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {ideas.map((idea, i) => (
                  <motion.div
                    key={i}
                    className="glass-card-hover"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{ padding: 22 }}
                  >
                    {/* Difficulty badge + estimate */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
                        color: DIFFICULTY_COLORS[idea.difficulty],
                        background: `${DIFFICULTY_COLORS[idea.difficulty]}18`,
                        border: `1px solid ${DIFFICULTY_COLORS[idea.difficulty]}30`,
                      }}>
                        {idea.difficulty}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>~{idea.estimatedDays} days</span>
                    </div>

                    <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{idea.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{idea.description}</p>

                    {/* Why it matters */}
                    <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)', marginBottom: 12 }}>
                      <p style={{ fontSize: 12, color: '#69F0AE', fontWeight: 600, marginBottom: 3 }}>💼 Why recruiters love this</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{idea.whyItMatters}</p>
                    </div>

                    {/* Unique twist */}
                    <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', marginBottom: 14 }}>
                      <p style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, marginBottom: 3 }}>✨ Stand-out twist</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{idea.uniqueTwist}</p>
                    </div>

                    {/* Tech stack */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(idea.techStack || []).map((tech, j) => (
                        <span key={j} className="badge badge-blue" style={{ fontSize: 11 }}>{tech}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 36 }}>
                <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
                  <RefreshCw size={15} /> Generate New Ideas
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
