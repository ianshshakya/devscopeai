import { useState } from 'react'
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
    color: '#10b981',
    link: '/scan',
    cta: 'Scan Now'
  },
  {
    icon: <Flame size={22} />, title: 'GitHub Roast',
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
    color: '#3b82f6',
    link: '/quiz',
    cta: 'Take Test'
  },
]

const steps = [
  {
    n: '01', title: 'Enter GitHub Username',
    desc: 'Start instantly without registration. Explore public scanner, GitHub roaster, roadmaps, and quizzes completely free.',
    icon: <GithubIcon size={24} />,
  },
  {
    n: '02', title: 'Analyze Project Metrics',
    desc: 'We fetch details on your repository structures, active commits, languages distribution, and profile data.',
    icon: <Code2 size={24} />,
  },
  {
    n: '03', title: 'Get Your Developer Score',
    desc: 'Evaluate where you stand against market standards with clear pathways to close skill gaps and level up.',
    icon: <Zap size={24} />,
  },
]

const testimonials = [
  {
    name: 'Arjun Sharma', role: 'CS Final Year',
    text: 'DevScope told me exactly what was missing from my GitHub. Fixed those gaps and landed a frontend internship within 3 weeks.',
    score: 82, avatar: 'AS',
  },
  {
    name: 'Priya Nair', role: 'Bootcamp Graduate',
    text: 'I had 10 projects on GitHub but zero confidence. This platform gave me a 74/100 and told me to learn testing. It was right.',
    score: 74, avatar: 'PN',
  },
  {
    name: 'Rohan Mehta', role: 'Self-Taught Developer',
    text: 'The roadmap alone is worth it. It knew I was doing too much CSS and not enough architecture. Now interviewing at startups.',
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
    features: ['Everything in Pro', 'ATS Resume Analyzer', 'AI Recruiter Interview Simulation', 'Salary Negotiation Guides', 'Verified Profile Share Badge'],
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
    a: 'Our models analyze actual public repository code structure and developer habits. The Roast points to genuine gaps in your profile.',
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
      className="minimal-card"
      style={{
        padding: 24,
        maxWidth: 680,
        margin: '0 auto',
      }}
    >
      {/* Tabs list */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24, overflowX: 'auto' }}>
        {[
          { id: 'scan', label: 'SCANNER' },
          { id: 'roast', label: 'ROAST' },
          { id: 'dna', label: 'SKILL DNA' },
          { id: 'roadmap', label: 'ROADMAP' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="mono"
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'var(--text-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: 'var(--text-primary)', fontSize: 16 }}>
                    JD
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 500, fontSize: 16, margin: 0, color: 'var(--text-primary)' }}>Jane Dev</h4>
                    <p className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>@janedev</p>
                  </div>
                </div>
                <span className="badge badge-primary mono" style={{ fontSize: 12 }}>88/100 READY</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                <div style={{ padding: 16, textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                  <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', margin: '0 0 8px' }}>STARS</p>
                  <p className="mono" style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>142</p>
                </div>
                <div style={{ padding: 16, textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                  <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', margin: '0 0 8px' }}>ACTIVE REPOS</p>
                  <p className="mono" style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>7</p>
                </div>
                <div style={{ padding: 16, textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                  <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', margin: '0 0 8px' }}>TOP LANG</p>
                  <p className="mono" style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>TypeScript</p>
                </div>
              </div>
              <div style={{ padding: '16px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 400, margin: 0 }}>✓ Recommended Role Fit: Mid-Level Software Engineer</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'roast' && (
            <motion.div
              key="roast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h4 style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>ROAST REPORT</h4>
                <span className="mono badge" style={{ fontSize: 10 }}>README_AVOIDER</span>
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6, fontFamily: 'monospace' }}>
                "Your repos are like ghost towns. 12 projects and the only documentation is the autogenerated Vite template saying 'Hello World'..."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div className="mono" style={{ fontSize: 24, fontWeight: 500, color: 'var(--text-primary)' }}>32%</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Recruiter Shortlist Chance. Add READMEs and clean project descriptions to survive!
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'dna' && (
            <motion.div
              key="dna" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { dimension: 'Frontend', score: 85 },
                      { dimension: 'Backend', score: 70 },
                      { dimension: 'Security', score: 40 },
                      { dimension: 'Testing', score: 25 },
                      { dimension: 'DevOps', score: 30 },
                      { dimension: 'Design', score: 60 },
                    ]}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'monospace' }} />
                      <Radar name="Score" dataKey="score" stroke="#ffffff" fill="#ffffff" fillOpacity={0.1} strokeWidth={1.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 style={{ fontWeight: 500, fontSize: 16, color: 'var(--text-primary)', marginBottom: 12, margin: 0 }}>SKILL DNA MAP</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                    Your primary strength is <strong>Frontend</strong>, followed closely by <strong>Backend</strong> capabilities.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: 'var(--text-muted)' }}>STRONGEST:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Frontend (85%)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: 'var(--text-muted)' }}>FOCUS AREA:</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Testing (25%)</span>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span className="mono badge" style={{ fontSize: 11 }}>ROADMAP PREVIEW</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Junior Front-End → Full Stack</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 60, top: 12, bottom: 12, width: 1, background: 'var(--border)' }} />

                {[
                  { month: 'Month 1', title: 'State management', desc: 'Store architecture, slices & action payloads.' },
                  { month: 'Month 2', title: 'Database schema', desc: 'Design schemas, foreign keys & REST controllers.' },
                  { month: 'Month 3', title: 'App Containers', desc: 'Write Dockerfiles, configure actions & deploy.' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 2 }}>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', width: 60, flexShrink: 0, textAlign: 'right', marginTop: 2 }}>{item.month}</span>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: idx === 0 ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: 8, marginLeft: -27 }} />
                    <div>
                      <h5 style={{ fontSize: 14, fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{item.title}</h5>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{item.desc}</p>
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
        border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
        transition: 'border-color 0.2s',
        borderColor: open ? 'var(--border-strong)' : 'var(--border)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left', padding: '20px 24px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          color: 'var(--text-primary)', fontSize: 15, fontWeight: 500,
        }}
      >
        {q}
        <ChevronRight
          size={18}
          style={{
            color: open ? 'var(--text-primary)' : 'var(--text-muted)', flexShrink: 0,
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
            <div style={{ padding: '0 24px 20px', color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '160px 24px 100px', position: 'relative',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge" style={{ marginBottom: 32, padding: '6px 16px', fontSize: 12 }}>
              <Zap size={14} style={{ marginRight: 6 }} /> AI Developer Career Intelligence
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 500, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.04em' }}
          >
            Know If You're Actually <br />
            <span className="gradient-text">Job Ready.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.6 }}
          >
            Instant public developer scanner, GitHub roaster, skill DNA quiz, and career path planner.
            <span style={{ color: 'var(--text-primary)' }}> No signup required.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ maxWidth: 480, margin: '0 auto 40px' }}
          >
            <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: 12 }}>
              <input
                type="text"
                value={scanUsername}
                onChange={e => setScanUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className="input-field mono"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>
                Scan
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <button onClick={login} className="btn-primary">
                <GithubIcon size={16} /> GitHub Sync
              </button>
            )}
            <Link to="/roadmap-gen" className="btn-secondary">
              <Map size={16} /> Roadmap Planner
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Interactive Widget ───────────────────────────────── */}
      <section style={{ padding: '0 24px 120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <InteractiveConsole />
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" style={{ padding: '120px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Tools to level up
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: 18 }}>
              Interactive assessments, portfolio checkers, and personalized roadmaps.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="minimal-card-hover"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ padding: 32, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-primary)', marginBottom: 24
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 500, fontSize: 18, marginBottom: 12, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 32, flex: 1 }}>{f.desc}</p>
                <Link to={f.link} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  {f.cta} <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, letterSpacing: '-0.02em' }}>
              How it works
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                className="minimal-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ padding: 32, display: 'flex', alignItems: 'flex-start', gap: 24 }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
                }}>
                  {step.icon}
                </div>
                <div>
                  <p className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{step.n}</p>
                  <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '120px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Simple pricing
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>
              Start free. Upgrade when you need more.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className="minimal-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  padding: 40,
                  background: plan.highlighted ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                  borderColor: plan.highlighted ? 'var(--border-strong)' : 'var(--border)',
                }}
              >
                {plan.badge && (
                  <div className="badge badge-primary" style={{ marginBottom: 24 }}>
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8, color: 'var(--text-primary)' }}>{plan.name}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>{plan.description}</p>
                
                <div style={{ marginBottom: 40 }}>
                  <span style={{ fontSize: 48, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                    {plan.price}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 15, marginLeft: 8 }}>{plan.period}</span>
                </div>

                <button
                  onClick={login}
                  className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', marginBottom: 40 }}
                >
                  {plan.cta}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'var(--text-primary)' }}>
                      <Check size={18} color="var(--text-primary)" />
                      {f}
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'var(--text-muted)' }}>
                      <X size={18} />
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
      <section id="faq" style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, letterSpacing: '-0.02em' }}>
              FAQ
            </h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section style={{ padding: '0 24px 120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="minimal-card"
          style={{
            maxWidth: 800, margin: '0 auto', textAlign: 'center',
            padding: '80px 40px', background: 'var(--bg-secondary)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 24, color: 'var(--text-primary)' }}>
            Ready to start?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Find out what your GitHub profile says about your skills.
          </p>
          <button onClick={login} className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
            Analyze My GitHub
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
