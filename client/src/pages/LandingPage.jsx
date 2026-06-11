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
    color: '#6366f1',
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
    <div className="glass-card" style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
      {/* Tabs list */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20, overflowX: 'auto' }}>
        {[
          { id: 'scan', label: '📊 Scanner', color: '#6366f1' },
          { id: 'roast', label: '🔥 Roast', color: '#ef4444' },
          { id: 'dna', label: '🧬 Skill DNA', color: '#a855f7' },
          { id: 'roadmap', label: '🗺 Roadmap', color: '#10b981' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              background: activeTab === tab.id ? `${tab.color}15` : 'transparent',
              color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div style={{ minHeight: 230, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'scan' && (
            <motion.div
              key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#818cf8', fontSize: 16 }}>
                    JD
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>Jane Dev</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>@janedev · Full Stack Developer</p>
                  </div>
                </div>
                <span className="badge badge-green" style={{ fontSize: 13 }}>88/100 (Excellent)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 600 }}>STARS</p>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#f59e0b', margin: 0 }}>142</p>
                </div>
                <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 600 }}>ACTIVE REPOS</p>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#10b981', margin: 0 }}>7</p>
                </div>
                <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 600 }}>TOP LANG</p>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#ec4899', margin: 0 }}>TypeScript</p>
                </div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
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
                <h4 style={{ color: '#ef4444', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>🔥 GitHub Roast</h4>
                <span style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>THE README AVOIDER</span>
              </div>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#fca5a5', marginBottom: 16, lineHeight: 1.4 }}>
                "Your repos are like ghost towns. 12 projects and the only documentation is the autogenerated Vite template saying 'Hello World'..."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444' }}>32%</div>
                <p style={{ fontSize: 12, color: 'rgba(255,200,180,0.8)', margin: 0, lineHeight: 1.4 }}>
                  Recruiter Shortlist Chance: <strong>NO WAY</strong>. Add READMEs and clean project descriptions to survive!
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
                      <PolarGrid stroke="rgba(168,85,247,0.15)" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#8b9cc8', fontSize: 9 }} />
                      <Radar name="Score" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={1.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 15, color: '#c084fc', marginBottom: 8, margin: 0 }}>Skill DNA Insights</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                    Your primary strength is <strong>Frontend</strong>, followed closely by <strong>Backend</strong> capabilities.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                      <span style={{ color: 'var(--text-muted)' }}>💪 Strongest:</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Frontend (85%)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                      <span style={{ color: 'var(--text-muted)' }}>🎯 Focus Area:</span>
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
                <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>🗺 ROADMAP PREVIEW</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Junior Front-End → Full Stack Engineer</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { month: 'Month 1', title: 'State management (Zustand/Redux)', desc: 'Store architecture, slices & action payloads.' },
                  { month: 'Month 2', title: 'Database schema & APIs (NodeJS)', desc: 'Design schemas, foreign keys & REST controllers.' },
                  { month: 'Month 3', title: 'App Containers (Docker & CI/CD)', desc: 'Write Dockerfiles, configure actions & deploy.' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', width: 56, flexShrink: 0 }}>{item.month}</span>
                    <div>
                      <h5 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{item.title}</h5>
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
            color: 'var(--text-muted)', flexShrink: 0,
            transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s',
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="grid-pattern"
        style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Ambient glows */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge badge-blue" style={{ display: 'inline-flex', marginBottom: 24, fontSize: 13 }}>
              <Zap size={13} /> AI Developer Career platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em' }}
          >
            Know If You're Actually{' '}
            <span className="gradient-text">Job Ready.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.7 }}
          >
            Instant public developer scanner, viral GitHub roaster, skill DNA quiz, and roadmap planner.
            <strong style={{ color: 'var(--text-primary)' }}> No signup required.</strong>
          </motion.p>

          {/* Live GitHub Scanner Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ maxWidth: 500, margin: '0 auto 36px' }}
          >
            <form onSubmit={handleScanSubmit} style={{
              display: 'flex', gap: 10, padding: 6,
              background: 'rgba(15,23,42,0.4)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              backdropFilter: 'blur(8px)',
            }}>
              <input
                type="text"
                value={scanUsername}
                onChange={e => setScanUsername(e.target.value)}
                placeholder="Enter GitHub username to scan..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'white', padding: '10px 14px', fontSize: 15, fontFamily: 'inherit',
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                Scan Free
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ fontSize: 15, padding: '12px 24px' }}>
                <Zap size={16} /> Dashboard
              </Link>
            ) : (
              <button onClick={login} className="btn-primary" id="hero-cta-login" style={{ fontSize: 15, padding: '12px 24px' }}>
                <GithubIcon size={16} /> Full GitHub Sync
              </button>
            )}
            <Link to="/roast" className="btn-secondary" style={{ fontSize: 15, padding: '12px 24px', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.3)' }}>
              <Flame size={15} /> Roast Profile
            </Link>
            <Link to="/roadmap-gen" className="btn-secondary" style={{ fontSize: 15, padding: '12px 24px', color: '#86efac', borderColor: 'rgba(16,185,129,0.3)' }}>
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
      <section id="features" style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
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
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', fontSize: 17 }}>
              Interactive assessments, portfolio checkers, and personalized roadmaps built for the modern engineer.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card-hover"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: f.color, marginBottom: 18,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{f.desc}</p>
                </div>

                <Link
                  to={f.link}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700,
                    textDecoration: 'none', color: f.color, alignSelf: 'flex-start',
                  }}
                >
                  {f.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                className="glass-card"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ padding: 28, display: 'flex', alignItems: 'flex-start', gap: 24 }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8',
                }}>
                  {step.icon}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Step {step.n}</p>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section id="testimonials" style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
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
                className="glass-card-hover"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ padding: 28 }}
              >
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: '#818cf8',
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</p>
                    </div>
                  </div>
                  <div className="badge badge-green">{t.score}/100</div>
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
            <p style={{ color: 'var(--text-secondary)', fontSize: 17 }}>
              One good job offer pays for years of DevScope. Start free.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  padding: 32, borderRadius: 16, position: 'relative',
                  background: plan.highlighted ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,36,0.7)',
                  border: plan.highlighted ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border)',
                  boxShadow: plan.highlighted ? '0 0 40px rgba(99,102,241,0.15)' : 'none',
                }}
              >
                {plan.badge && (
                  <div className="badge badge-blue" style={{ marginBottom: 16, fontSize: 11 }}>
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{plan.description}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: plan.highlighted ? '#818cf8' : 'var(--text-primary)' }}>
                    {plan.price}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{plan.period}</span>
                </div>

                <button
                  onClick={login}
                  className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}
                  id={`pricing-cta-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                      <Check size={15} color="#10b981" />
                      {f}
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-muted)' }}>
                      <X size={15} color="var(--text-muted)" />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
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
      <section style={{ padding: '80px 24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{
            maxWidth: 700, margin: '0 auto', textAlign: 'center',
            padding: '60px 40px', borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Ready to know the truth?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Stop guessing. Start applying with confidence. Your GitHub already tells a story — find out what it says.
          </p>
          <button onClick={login} className="btn-primary" style={{ fontSize: 16, padding: '14px 28px' }} id="bottom-cta">
            <GithubIcon size={18} /> Analyze My GitHub for Free
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
