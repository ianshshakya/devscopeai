import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Shield, TrendingUp, Code2, ChevronRight, Check, X, Star, ArrowRight, BookOpen, Users, Award, Flame, Cpu, Lightbulb, Map } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const GithubIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)
import { useAuth } from '../lib/authContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

// ─── Data ─────────────────────────────────────────────────────
const features = [
  {
    icon: <Code2 size={22} />, title: 'AI Code Review',
    desc: 'Senior engineer-level analysis of your actual project structure, patterns, and practices.',
    color: '#00E676',
    link: '/scan',
    cta: 'Scan Now'
  },
  {
    icon: <Flame size={22} />, title: 'GitHub Roast 🔥',
    desc: 'Get brutally honest, sarcastic but motivating feedback on your GitHub profile and activities.',
    color: '#ef4444',
    link: '/roast',
    cta: 'Get Roasted'
  },
  {
    icon: <Cpu size={22} />, title: 'Tech Skill DNA',
    desc: 'Answer a 5-minute interactive assessment to map your skill radar across 7 engineering dimensions.',
    color: '#a855f7',
    link: '/skill-dna',
    cta: 'Map Skill DNA'
  },
  {
    icon: <Map size={22} />, title: 'Roadmap Generator',
    desc: 'Enter your current role and your dream target role to generate a complete monthly transition plan.',
    color: '#10b981',
    link: '/roadmap-gen',
    cta: 'Generate Roadmap'
  },
  {
    icon: <Lightbulb size={22} />, title: 'Project Idea Generator',
    desc: 'Stuck on what to build? Tell the AI your target role and stack to get 6 highly customized projects.',
    color: '#f59e0b',
    link: '/project-ideas',
    cta: 'Get Ideas'
  },
  {
    icon: <Award size={22} />, title: 'Job Readiness Test',
    desc: 'A comprehensive 15-question core knowledge test covering JS, React, backend, DB, and architecture.',
    color: '#06b6d4',
    link: '/quiz',
    cta: 'Take Test'
  },
]

const steps = [
  {
    n: '01', title: 'Enter GitHub Username / Take Quiz',
    desc: 'Start instantly without registration. Explore public scanner, GitHub roaster, roadmaps, and quizzes completely free.',
    icon: <GithubIcon size={28} />,
  },
  {
    n: '02', title: 'Analyze Project Metrics',
    desc: 'We fetch details on your repository structures, active commits, languages distribution, and profile data.',
    icon: <Code2 size={28} />,
  },
  {
    n: '03', title: 'Get Your Developer Score',
    desc: 'Evaluate where you stand against market standards with clear pathways to close skill gaps and level up.',
    icon: <Zap size={28} />,
  },
]

const testimonials = [
  {
    name: 'Arjun Sharma', role: 'CS Final Year, IIT Delhi',
    text: 'DevScope told me exactly what was missing from my GitHub. Fixed those gaps and landed a frontend internship at a startup within 3 weeks.',
    score: 82, avatar: 'AS',
  },
  {
    name: 'Priya Nair', role: 'Bootcamp Graduate',
    text: 'I had 10 projects on GitHub but zero confidence. This platform gave me a 74/100 and told me to learn testing. It was right.',
    score: 74, avatar: 'PN',
  },
  {
    name: 'Rohan Mehta', role: 'Self-Taught Developer',
    text: 'The roadmap alone is worth it. It knew I was doing too much CSS and not enough architecture. Now interviewing at Series A startups.',
    score: 79, avatar: 'RM',
  },
]

const pricingPlans = [
  {
    name: 'Free', price: '₹0', period: '/month',
    description: 'Start your journey',
    features: ['Public Profile Scanner', 'GitHub Profile Roast', 'Career Roadmap Generator', 'Skill DNA Assessment', 'Job Readiness Quiz'],
    missing: ['AI Code Quality Review', 'Unlimited Repository Deep Dives', 'ATS Resume Analyzer', 'AI Recruiter Interview Feedback'],
    cta: 'Start Free Tools', highlighted: false,
  },
  {
    name: 'Pro', price: '₹499', period: '/month',
    description: 'For serious job seekers',
    features: ['Everything in Free', 'Unlimited Repository Deep Dives', 'Full AI Architecture Reviews', 'Interactive Roadmap Milestones', 'Priority AI Scanning Queue'],
    missing: ['ATS Resume Analyzer', 'AI Recruiter Interview Feedback'],
    cta: 'Go Pro Trial', highlighted: true, badge: 'Most Popular',
  },
  {
    name: 'Premium', price: '₹999', period: '/month',
    description: 'Complete career toolkit',
    features: ['Everything in Pro', 'ATS Resume Analyzer (PDF Upload)', 'AI Recruiter Interview Simulation', 'Salary Negotiation Guides', 'Verified Profile Share Badge'],
    missing: [],
    cta: 'Go Premium', highlighted: false,
  },
]

const faqs = [
  {
    q: 'Does DevScope access my private repositories?',
    a: 'No. Our public tools only request access to public GitHub data. We never touch private source code unless you explicitly authorize private access on a premium tier.',
  },
  {
    q: 'How does the Developer score get calculated?',
    a: 'It combines metrics from repo counts, active recent contributions, stargazers, profile completeness, languages diversity, and repository documentation quality.',
  },
  {
    q: 'How accurate is the AI roast and analysis?',
    a: 'Our models analyze actual public repository code structure and developer habits. The Roast is designed for fun and virality, but its insights point to genuine gaps.',
  },
  {
    q: 'Can I use DevScope without signing in with GitHub?',
    a: 'Yes! Features like Career Roadmap, Skill DNA Quiz, Job Readiness Test, Project Ideas, and Public Profile Scanner are completely login-free.',
  },
]

// ─── Interactive Tab Preview Component ───────────────────────────
const InteractiveConsole = () => {
  const [activeTab, setActiveTab] = useState('scan')

  return (
    <div
      className="cyber-card scanline-container grid-pattern"
      style={{
        padding: 24,
        maxWidth: 680,
        margin: '0 auto',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 230, 118, 0.05)',
        border: '1px solid rgba(0, 230, 118, 0.15)',
      }}
    >
      {/* Cyber Corners */}
      <div className="cyber-corner cyber-corner-tl" style={{ opacity: 1 }} />
      <div className="cyber-corner cyber-corner-tr" style={{ opacity: 1 }} />
      <div className="cyber-corner cyber-corner-bl" style={{ opacity: 1 }} />
      <div className="cyber-corner cyber-corner-br" style={{ opacity: 1 }} />

      {/* Tabs list */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12, marginBottom: 20, overflowX: 'auto', position: 'relative', zIndex: 2 }}>
        {[
          { id: 'scan', label: '📊 SCANNER', color: '#00E676' },
          { id: 'roast', label: '🔥 ROAST', color: '#ef4444' },
          { id: 'dna', label: '🧬 SKILL DNA', color: '#a855f7' },
          { id: 'roadmap', label: '🗺 ROADMAP', color: '#10b981' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="cyber-mono"
            style={{
              padding: '6px 14px', borderRadius: 8, border: activeTab === tab.id ? `1px solid ${tab.color}40` : '1px solid transparent', cursor: 'pointer',
              fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
              background: activeTab === tab.id ? `${tab.color}08` : 'transparent',
              color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              textShadow: activeTab === tab.id ? `0 0 8px ${tab.color}60` : 'none',
              boxShadow: activeTab === tab.id ? `inset 0 0 10px ${tab.color}10` : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div style={{ minHeight: 230, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {activeTab === 'scan' && (
            <motion.div
              key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#69F0AE', fontSize: 16 }}>
                    JD
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: 16, margin: 0, color: '#f8fafc' }}>Jane Dev</h4>
                    <p className="cyber-mono" style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>@janedev · FULL_STACK_DEV</p>
                  </div>
                </div>
                <span className="badge badge-green cyber-mono animate-pulse-glow" style={{ fontSize: 12 }}>88/100 READY</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 12, textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12 }}>
                  <p className="cyber-mono" style={{ fontSize: 9, color: 'var(--text-muted)', margin: '0 0 4px' }}>STARS</p>
                  <p className="cyber-mono" style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b', margin: 0 }}>142</p>
                </div>
                <div style={{ padding: 12, textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12 }}>
                  <p className="cyber-mono" style={{ fontSize: 9, color: 'var(--text-muted)', margin: '0 0 4px' }}>ACTIVE REPOS</p>
                  <p className="cyber-mono" style={{ fontSize: 18, fontWeight: 900, color: '#10b981', margin: 0 }}>7</p>
                </div>
                <div style={{ padding: 12, textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12 }}>
                  <p className="cyber-mono" style={{ fontSize: 9, color: 'var(--text-muted)', margin: '0 0 4px' }}>TOP LANG</p>
                  <p className="cyber-mono" style={{ fontSize: 18, fontWeight: 900, color: '#ec4899', margin: 0 }}>TypeScript</p>
                </div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p style={{ fontSize: 12, color: '#10b981', fontWeight: 600, margin: 0 }}>✓ Recommended Role Fit: Mid-Level Software Engineer</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'roast' && (
            <motion.div
              key="roast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ color: '#ef4444', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, margin: 0, letterSpacing: '0.05em' }}>🔥 ROAST ENGINE REPORT</h4>
                <span className="cyber-mono" style={{ fontSize: 10, color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', padding: '3px 8px', borderRadius: 6 }}>README_AVOIDER</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fca5a5', marginBottom: 16, lineHeight: 1.4, fontFamily: 'monospace' }}>
                "Your repos are like ghost towns. 12 projects and the only documentation is the autogenerated Vite template saying 'Hello World'..."
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ background: '#fca5a5', width: 8, height: 16, display: 'inline-block', marginLeft: 4, verticalAlign: 'middle' }}
                />
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, borderRadius: 10, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div className="cyber-mono" style={{ fontSize: 24, fontWeight: 900, color: '#ef4444' }}>32%</div>
                <p style={{ fontSize: 12, color: 'rgba(255,200,180,0.8)', margin: 0, lineHeight: 1.4 }}>
                  Recruiter Shortlist Chance: <strong style={{ color: '#ef4444' }}>CRITICAL_RISK</strong>. Add READMEs and clean project descriptions to survive!
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'dna' && (
            <motion.div
              key="dna" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'center' }}>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { dimension: 'Frontend', score: 85 },
                      { dimension: 'Backend', score: 70 },
                      { dimension: 'Security', score: 40 },
                      { dimension: 'Testing', score: 25 },
                      { dimension: 'DevOps', score: 30 },
                      { dimension: 'Design', score: 60 },
                    ]}>
                      <PolarGrid stroke="rgba(168,85,247,0.12)" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#8b9cc8', fontSize: 9, fontFamily: 'monospace' }} />
                      <Radar name="Score" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.12} strokeWidth={1.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 14, color: '#c084fc', marginBottom: 8, margin: 0 }}>SKILL DNA MAP</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                    Your primary strength is <strong>Frontend</strong>, followed closely by <strong>Backend</strong> capabilities.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                      <span style={{ color: 'var(--text-muted)' }}>💪 STRONGEST:</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Frontend (85%)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                      <span style={{ color: 'var(--text-muted)' }}>🎯 FOCUS AREA:</span>
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>Testing (25%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span className="cyber-mono" style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>🗺 ROADMAP PREVIEW</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Junior Front-End → Full Stack Engineer</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                {/* Vertical timeline track line */}
                <div style={{ position: 'absolute', left: 45, top: 12, bottom: 12, width: 2, background: 'linear-gradient(180deg, #10b981 30%, rgba(255,255,255,0.04) 90%)' }} />

                {[
                  { month: 'Month 1', title: 'State management (Zustand/Redux)', desc: 'Store architecture, slices & action payloads.' },
                  { month: 'Month 2', title: 'Database schema & APIs (NodeJS)', desc: 'Design schemas, foreign keys & REST controllers.' },
                  { month: 'Month 3', title: 'App Containers (Docker & CI/CD)', desc: 'Write Dockerfiles, configure actions & deploy.' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 2 }}>
                    <span className="cyber-mono" style={{ fontSize: 10, fontWeight: 800, color: '#10b981', width: 56, flexShrink: 0, textAlign: 'right', marginTop: 2 }}>{item.month}</span>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: idx === 0 ? '#10b981' : 'rgba(255,255,255,0.12)', boxShadow: idx === 0 ? '0 0 8px #10b981' : 'none', marginTop: 6, marginLeft: -15 }} />
                    <div>
                      <h5 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#f8fafc' }}>{item.title}</h5>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── FAQ Item Component ──────────────────────────────────────────
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden',
        transition: 'border-color 0.2s',
        borderColor: open ? 'var(--border-strong)' : 'var(--border)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left', padding: '16px 20px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          color: 'var(--text-primary)', fontSize: 15, fontWeight: 500,
        }}
      >
        {q}
        <ChevronRight
          size={18}
          style={{
            color: open ? '#00E676' : 'var(--text-muted)', flexShrink: 0,
            transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'all 0.2s',
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 20px 16px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Landing Page ──────────────────────────────────────────────
export default function LandingPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [scanUsername, setScanUsername] = useState('')

  const handleScanSubmit = (e) => {
    e.preventDefault()
    const trimmed = scanUsername.trim()
    if (trimmed) {
      navigate(`/scan?u=${trimmed}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050711', color: 'var(--text-primary)', overflow: 'hidden' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="grid-pattern"
        style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '140px 24px 80px', position: 'relative', overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 30%, rgba(8,12,30,0.8), #050711)',
        }}
      >
        {/* Ambient glows */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '5%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge badge-green animate-pulse-glow" style={{ display: 'inline-flex', marginBottom: 24, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <Zap size={11} style={{ marginRight: 6 }} /> AI Developer Career Intelligence
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(44px, 7vw, 76px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.04em' }}
          >
            Know If You're Actually{' '}
            <span className="gradient-text">Job Ready.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 'clamp(16px, 2.2vw, 19px)', color: 'var(--text-secondary)', maxWidth: 660, margin: '0 auto 40px', lineHeight: 1.7 }}
          >
            Instant public developer scanner, viral GitHub roaster, skill DNA quiz, and career path planner.
            <strong style={{ color: '#00E676' }}> No signup required.</strong>
          </motion.p>

          {/* Live GitHub Scanner Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ maxWidth: 520, margin: '0 auto 12px' }}
          >
            <form onSubmit={handleScanSubmit} style={{
              display: 'flex', gap: 10, padding: 6,
              background: 'rgba(10, 15, 30, 0.75)',
              border: '1px solid rgba(0, 230, 118, 0.25)',
              borderRadius: 14,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 30px rgba(0, 230, 118, 0.05)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 230, 118, 0.6)';
              e.currentTarget.style.boxShadow = '0 0 45px rgba(0, 230, 118, 0.15)';
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 230, 118, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 230, 118, 0.05)';
            }}
            >
              <input
                type="text"
                value={scanUsername}
                onChange={e => setScanUsername(e.target.value)}
                placeholder="Enter GitHub username to scan..."
                className="cyber-mono"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'white', padding: '10px 14px', fontSize: 14,
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 22px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Scan Free
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="cyber-mono"
            style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}
          >
            <span>[SYS_LOG // READY]</span>
            <span>[ACTIVE_THREADS // 32]</span>
            <span>[TOTAL_SCANS // 24,912]</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ fontSize: 14, padding: '12px 24px' }}>
                <Zap size={15} /> Dashboard
              </Link>
            ) : (
              <button onClick={login} className="btn-primary" id="hero-cta-login" style={{ fontSize: 14, padding: '12px 24px' }}>
                <GithubIcon size={15} /> Full GitHub Sync
              </button>
            )}
            <Link to="/roast" className="btn-secondary" style={{ fontSize: 14, padding: '12px 24px', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; e.currentTarget.style.background = 'rgba(239,68,68,0.03)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; e.currentTarget.style.background = 'transparent' }}
            >
              <Flame size={15} /> Roast Profile
            </Link>
            <Link to="/roadmap-gen" className="btn-secondary" style={{ fontSize: 14, padding: '12px 24px', color: '#86efac', borderColor: 'rgba(16,185,129,0.2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; e.currentTarget.style.background = 'rgba(16,185,129,0.03)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)'; e.currentTarget.style.background = 'transparent' }}
            >
              <Map size={15} /> Roadmap Planner
            </Link>
          </motion.div>

          {/* Interactive Console Widget */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            style={{ marginTop: 48 }}
          >
            <InteractiveConsole />
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 24px', background: '#090b16', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <p className="section-label" style={{ marginBottom: 12 }}>Platform Suite</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              6 features to level up your{' '}
              <span className="gradient-text">skills</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', fontSize: 16 }}>
              Interactive assessments, portfolio checkers, and personalized roadmaps built for the modern engineer.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="cyber-card scanline-container grid-pattern"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(11, 17, 30, 0.5)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${f.color}50`;
                  e.currentTarget.style.boxShadow = `0 15px 35px rgba(0,0,0,0.45), 0 0 25px ${f.color}15`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Cyber Corners */}
                <div className="cyber-corner cyber-corner-tl" />
                <div className="cyber-corner cyber-corner-tr" />
                <div className="cyber-corner cyber-corner-bl" />
                <div className="cyber-corner cyber-corner-br" />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: `${f.color}10`,
                    border: `1px solid ${f.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: f.color, marginBottom: 18,
                    filter: `drop-shadow(0 0 8px ${f.color}20)`,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 8, color: '#f8fafc' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 24 }}>{f.desc}</p>
                </div>

                <Link
                  to={f.link}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700,
                    textDecoration: 'none', color: f.color, alignSelf: 'flex-start',
                    letterSpacing: '0.04em', textTransform: 'uppercase', position: 'relative', zIndex: 2,
                  }}
                >
                  {f.cta} <ArrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <p className="section-label" style={{ marginBottom: 12 }}>Simple process</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              From GitHub to <span className="gradient-text">Career Report</span>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
            {/* Vertical connecting line */}
            <div style={{ position: 'absolute', left: 45, top: 40, bottom: 40, width: 2, background: 'linear-gradient(180deg, rgba(0, 230, 118, 0.3) 0%, rgba(59, 130, 246, 0.05) 100%)', zIndex: 0 }} />

            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                className="cyber-card scanline-container grid-pattern"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: 24, zIndex: 1, background: 'rgba(11, 17, 30, 0.4)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                {/* Cyber Corners */}
                <div className="cyber-corner cyber-corner-tl" />
                <div className="cyber-corner cyber-corner-tr" />
                <div className="cyber-corner cyber-corner-bl" />
                <div className="cyber-corner cyber-corner-br" />

                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#69F0AE',
                  boxShadow: '0 0 10px rgba(0, 230, 118, 0.05)',
                  position: 'relative', zIndex: 2,
                }}>
                  {step.icon}
                </div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <p className="cyber-mono" style={{ fontSize: 10, color: '#00E676', fontWeight: 700, marginBottom: 4 }}>// STEP_{step.n}</p>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: '#f8fafc' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section id="testimonials" style={{ padding: '100px 24px', background: '#090b16', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <p className="section-label" style={{ marginBottom: 12 }}>Real results</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Developers who got <span className="gradient-text">hired</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="cyber-card scanline-container grid-pattern"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ padding: 28, background: 'rgba(11, 17, 30, 0.4)', border: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 230, 118, 0.2)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4), 0 0 15px rgba(0,230,118,0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Cyber Corners */}
                <div className="cyber-corner cyber-corner-tl" />
                <div className="cyber-corner cyber-corner-tr" />
                <div className="cyber-corner cyber-corner-bl" />
                <div className="cyber-corner cyber-corner-br" />

                <div style={{ display: 'flex', gap: 4, marginBottom: 16, position: 'relative', zIndex: 2 }}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13} fill="#f59e0b" color="#f59e0b" style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.2))' }} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 20, position: 'relative', zIndex: 2 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="cyber-mono" style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: '#69F0AE',
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{t.role}</p>
                    </div>
                  </div>
                  <div className="badge badge-green cyber-mono" style={{ fontSize: 11 }}>{t.score}% MATCH</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <p className="section-label" style={{ marginBottom: 12 }}>Simple pricing</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Invest in your <span className="gradient-text">career</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              One good job offer pays for years of DevScope. Start free.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className="cyber-card scanline-container grid-pattern"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  padding: 32, borderRadius: 16, position: 'relative',
                  background: plan.highlighted ? 'rgba(0,230,118,0.03)' : 'rgba(11, 17, 30, 0.4)',
                  border: plan.highlighted ? '1px solid rgba(0,230,118,0.35)' : '1px solid rgba(255,255,255,0.04)',
                  boxShadow: plan.highlighted ? '0 20px 50px rgba(0,0,0,0.55), 0 0 35px rgba(0,230,118,0.08)' : 'none',
                }}
              >
                {/* Cyber Corners */}
                <div className="cyber-corner cyber-corner-tl" style={{ opacity: plan.highlighted ? 1 : 0.3 }} />
                <div className="cyber-corner cyber-corner-tr" style={{ opacity: plan.highlighted ? 1 : 0.3 }} />
                <div className="cyber-corner cyber-corner-bl" style={{ opacity: plan.highlighted ? 1 : 0.3 }} />
                <div className="cyber-corner cyber-corner-br" style={{ opacity: plan.highlighted ? 1 : 0.3 }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  {plan.badge && (
                    <div className="badge badge-green cyber-mono" style={{ marginBottom: 16, fontSize: 10, letterSpacing: '0.05em' }}>
                      {plan.badge}
                    </div>
                  )}
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#f8fafc' }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>{plan.description}</p>
                  <div style={{ marginBottom: 24 }}>
                    <span className="cyber-mono" style={{ fontSize: 40, fontWeight: 900, color: plan.highlighted ? '#69F0AE' : 'var(--text-primary)', textShadow: plan.highlighted ? '0 0 15px rgba(105,240,174,0.3)' : 'none' }}>
                      {plan.price}
                    </span>
                    <span className="cyber-mono" style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 4 }}>{plan.period}</span>
                  </div>

                  <button
                    onClick={login}
                    className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                    style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}
                    id={`pricing-cta-${plan.name.toLowerCase()}`}
                  >
                    {plan.cta}
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                        <Check size={14} color="#10b981" style={{ filter: 'drop-shadow(0 0 3px rgba(16,185,129,0.3))' }} />
                        {f}
                      </div>
                    ))}
                    {plan.missing.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-muted)' }}>
                        <X size={14} color="var(--text-muted)" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '100px 24px', background: '#090b16', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <p className="section-label" style={{ marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Common <span className="gradient-text">questions</span>
            </h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="cyber-card scanline-container grid-pattern"
          style={{
            maxWidth: 760, margin: '0 auto', textAlign: 'center',
            padding: '60px 40px', borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(0,230,118,0.05) 0%, rgba(59,130,246,0.03) 100%)',
            border: '1px solid rgba(0,230,118,0.25)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,230,118,0.06)',
          }}
        >
          {/* Cyber Corners */}
          <div className="cyber-corner cyber-corner-tl" style={{ opacity: 1 }} />
          <div className="cyber-corner cyber-corner-tr" style={{ opacity: 1 }} />
          <div className="cyber-corner cyber-corner-bl" style={{ opacity: 1 }} />
          <div className="cyber-corner cyber-corner-br" style={{ opacity: 1 }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16, color: '#f8fafc' }}>
              Ready to know the truth?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Stop guessing. Start applying with confidence. Your GitHub already tells a story — find out what it says.
            </p>
            <button onClick={login} className="btn-primary" style={{ fontSize: 15, padding: '14px 28px' }} id="bottom-cta">
              <GithubIcon size={18} style={{ marginRight: 8 }} /> Analyze My GitHub for Free
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
