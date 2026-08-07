import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Layers, Shield, TestTube, Globe, Cpu, BookOpen, Loader2, Share2, RefreshCw } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const DIMENSIONS = [
  {
    key: 'frontend', label: 'Frontend', icon: <Code2 size={18} />, color: '#3b82f6',
    questions: [
      { q: 'How comfortable are you with React / Vue / Angular?', weight: 3 },
      { q: 'Can you build responsive layouts without a framework?', weight: 2 },
      { q: 'Do you understand CSS Grid and Flexbox deeply?', weight: 2 },
      { q: 'Have you worked with state management (Redux, Zustand)?', weight: 3 },
    ]
  },
  {
    key: 'backend', label: 'Backend', icon: <Layers size={18} />, color: '#a855f7',
    questions: [
      { q: 'Can you build REST APIs from scratch?', weight: 3 },
      { q: 'Do you understand databases (SQL or NoSQL)?', weight: 3 },
      { q: 'Have you implemented authentication (JWT, OAuth)?', weight: 2 },
      { q: 'Do you know how to handle async operations properly?', weight: 2 },
    ]
  },
  {
    key: 'security', label: 'Security', icon: <Shield size={18} />, color: '#ef4444',
    questions: [
      { q: 'Do you know about XSS, CSRF, and SQL injection?', weight: 3 },
      { q: 'Do you use environment variables for secrets?', weight: 2 },
      { q: 'Do you validate and sanitize user input?', weight: 3 },
      { q: 'Do you know how HTTPS and TLS work?', weight: 2 },
    ]
  },
  {
    key: 'testing', label: 'Testing', icon: <TestTube size={18} />, color: '#10b981',
    questions: [
      { q: 'Do you write unit tests for your code?', weight: 3 },
      { q: 'Have you used testing frameworks (Jest, Vitest, Mocha)?', weight: 2 },
      { q: 'Do you write integration or E2E tests?', weight: 3 },
      { q: 'Do you practice test-driven development (TDD)?', weight: 2 },
    ]
  },
  {
    key: 'devops', label: 'DevOps', icon: <Globe size={18} />, color: '#f59e0b',
    questions: [
      { q: 'Have you deployed an app to cloud (Vercel, AWS, GCP)?', weight: 3 },
      { q: 'Do you know how CI/CD pipelines work?', weight: 3 },
      { q: 'Can you use Docker to containerize an app?', weight: 2 },
      { q: 'Do you understand environment management?', weight: 2 },
    ]
  },
  {
    key: 'systemDesign', label: 'System Design', icon: <Cpu size={18} />, color: '#06b6d4',
    questions: [
      { q: 'Can you design a scalable microservices architecture?', weight: 3 },
      { q: 'Do you understand caching strategies (Redis, CDN)?', weight: 2 },
      { q: 'Can you design a database schema for a complex app?', weight: 3 },
      { q: 'Do you understand load balancing and horizontal scaling?', weight: 2 },
    ]
  },
  {
    key: 'documentation', label: 'Docs & Comms', icon: <BookOpen size={18} />, color: '#f97316',
    questions: [
      { q: 'Do you write clear READMEs for your projects?', weight: 2 },
      { q: 'Do you add inline comments to complex logic?', weight: 2 },
      { q: 'Can you explain your technical decisions clearly?', weight: 3 },
      { q: 'Do you document APIs (Swagger, Postman)?', weight: 3 },
    ]
  },
]

const ANSWER_OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'Somewhat', value: 1 },
  { label: 'Mostly yes', value: 2 },
  { label: 'Absolutely', value: 3 },
]

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'
  if (score >= 60) return 'var(--text-primary)'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

const getDNALabel = (score) => {
  if (score >= 80) return 'Expert'
  if (score >= 60) return 'Proficient'
  if (score >= 40) return 'Developing'
  if (score >= 20) return 'Beginner'
  return 'Unexplored'
}

export default function SkillDNA() {
  const [step, setStep] = useState('intro') // intro | quiz | results
  const [dimIndex, setDimIndex] = useState(0)
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [scores, setScores] = useState(null)

  const currentDim = DIMENSIONS[dimIndex]
  const currentQ = currentDim?.questions[qIndex]
  const totalQuestions = DIMENSIONS.reduce((s, d) => s + d.questions.length, 0)
  const answeredCount = Object.keys(answers).length

  const handleAnswer = (value) => {
    const key = `${dimIndex}_${qIndex}`
    const newAnswers = { ...answers, [key]: { value, weight: currentQ.weight, dimKey: currentDim.key } }
    setAnswers(newAnswers)

    // Next question
    if (qIndex < currentDim.questions.length - 1) {
      setQIndex(qIndex + 1)
    } else if (dimIndex < DIMENSIONS.length - 1) {
      setDimIndex(dimIndex + 1)
      setQIndex(0)
    } else {
      // Calculate scores
      const dimScores = {}
      DIMENSIONS.forEach(dim => {
        const dimAnswers = Object.values(newAnswers).filter(a => a.dimKey === dim.key)
        const totalWeight = dim.questions.reduce((s, q) => s + q.weight, 0)
        const earned = dimAnswers.reduce((s, a) => s + (a.value * a.weight), 0)
        const maxEarned = totalWeight * 3
        dimScores[dim.key] = Math.round((earned / maxEarned) * 100)
      })
      setScores(dimScores)
      setStep('results')
    }
  }

  const progress = answeredCount / totalQuestions

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* INTRO */}
        {step === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
              background: 'var(--border)', border: '1px solid var(--border)',
              borderRadius: 20, marginBottom: 20,
            }}>
              <Cpu size={14} style={{ color: 'var(--text-primary)' }} />
              <span style={{ fontSize: 13, color: '#69F0AE', fontWeight: 600 }}>28 Questions • ~5 Minutes • Free</span>
            </div>

            <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
              Discover Your<br />
              <span style={{ background: 'linear-gradient(135deg, var(--text-primary), #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Tech Skill DNA
              </span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text-muted)', marginBottom: 40, maxWidth: 460, margin: '0 auto 40px' }}>
              Answer 28 honest questions. Get your personal skill radar across 7 engineering dimensions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 40 }}>
              {DIMENSIONS.map((d) => (
                <div key={d.key} className="glass-card" style={{ padding: '14px 12px', textAlign: 'center' }}>
                  <div style={{ color: d.color, marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{d.icon}</div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{d.label}</p>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={() => setStep('quiz')}
              style={{ padding: '14px 40px', fontSize: 16, fontWeight: 700 }}
            >
              Start Assessment →
            </button>
          </motion.div>
        )}

        {/* QUIZ */}
        {step === 'quiz' && currentDim && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress bar */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {currentDim.label} — Question {qIndex + 1}/{currentDim.questions.length}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{Math.round(progress * 100)}% done</span>
              </div>
              <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', background: currentDim.color, borderRadius: 2 }}
                />
              </div>
            </div>

            {/* Dimension badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${currentDim.color}20`, border: `1px solid ${currentDim.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentDim.color,
              }}>
                {currentDim.icon}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: currentDim.color }}>{currentDim.label}</span>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${dimIndex}-${qIndex}`}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 36, lineHeight: 1.3 }}>
                  {currentQ.q}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ANSWER_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '16px 20px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                        border: '1px solid var(--border)', background: 'rgba(15,23,36,0.7)',
                        color: 'var(--text-primary)', fontSize: 15, fontWeight: 500,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = currentDim.color
                        e.currentTarget.style.background = `${currentDim.color}10`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.background = 'rgba(15,23,36,0.7)'
                      }}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* RESULTS */}
        {step === 'results' && scores && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
                Your Skill DNA 🧬
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                Here's your honest engineering profile
              </p>
            </div>

            {/* Radar Chart */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={DIMENSIONS.map(d => ({ dimension: d.label, score: scores[d.key] || 0 }))}>
                  <PolarGrid stroke="rgba(168,85,247,0.15)" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#8b9cc8', fontSize: 12 }} />
                  <Radar name="Score" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Score cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
              {DIMENSIONS.map((dim) => {
                const score = scores[dim.key] || 0
                const color = dim.color
                return (
                  <motion.div
                    key={dim.key}
                    className="glass-card"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ padding: '16px 18px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ color }}>{dim.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{dim.label}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        style={{ height: '100%', background: color, borderRadius: 3 }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{getDNALabel(score)}</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color }}>{score}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Strongest + Weakest */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              {[
                {
                  label: '💪 Strongest Skill',
                  dim: DIMENSIONS.find(d => d.key === Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]),
                  score: Math.max(...Object.values(scores)),
                  border: 'rgba(16,185,129,0.3)',
                },
                {
                  label: '🎯 Focus Area',
                  dim: DIMENSIONS.find(d => d.key === Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0]),
                  score: Math.min(...Object.values(scores)),
                  border: 'rgba(245,158,11,0.3)',
                },
              ].map((item, i) => item.dim && (
                <div key={i} className="glass-card" style={{ padding: 20, borderColor: item.border }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{item.label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: item.dim.color }}>{item.dim.icon}</span>
                    <span style={{ fontWeight: 700 }}>{item.dim.label}</span>
                    <span style={{ marginLeft: 'auto', fontWeight: 900, color: item.dim.color, fontSize: 20 }}>{item.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Share + Retry */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))}>
                <Share2 size={15} /> Share My DNA
              </button>
              <button className="btn-secondary" onClick={() => {
                setStep('intro'); setDimIndex(0); setQIndex(0); setAnswers({}); setScores(null)
              }}>
                <RefreshCw size={15} /> Retake
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
