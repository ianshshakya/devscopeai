import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Shield, TrendingUp, Code2, ChevronRight, Check, X, Star, ArrowRight, BookOpen, Users, Award } from 'lucide-react'

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
  },
  {
    icon: <TrendingUp size={22} />, title: 'Career Readiness Score',
    desc: '7-dimension scoring: code quality, architecture, testing, security, and more.',
    color: '#10b981',
  },
  {
    icon: <Award size={22} />, title: 'Role Recommendations',
    desc: 'Know exactly which roles you qualify for today — frontend, backend, full-stack, DevOps.',
    color: '#f59e0b',
  },
  {
    icon: <BookOpen size={22} />, title: 'Personalized Roadmap',
    desc: 'AI-generated learning path with milestones, resources, and project ideas to close your gaps.',
    color: '#a855f7',
  },
  {
    icon: <Users size={22} />, title: 'Peer Comparison',
    desc: 'See where you rank against thousands of other developers on the platform.',
    color: '#06b6d4',
  },
  {
    icon: <Shield size={22} />, title: 'Security Insights',
    desc: 'Identify security vulnerabilities and patterns that matter to real hiring teams.',
    color: '#ef4444',
  },
]

const steps = [
  {
    n: '01', title: 'Connect GitHub',
    desc: 'One-click OAuth. We only read your public repositories — nothing is modified.',
    icon: <GithubIcon size={28} />,
  },
  {
    n: '02', title: 'Select Repositories',
    desc: 'Choose which projects to analyze. We recommend your 3 best projects.',
    icon: <Code2 size={28} />,
  },
  {
    n: '03', title: 'Get Your Report',
    desc: 'Receive your engineering review, score breakdown, and career roadmap in minutes.',
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
    features: ['1 Repository Analysis', 'Basic Score Breakdown', 'Role Fitness Check', 'Community Access'],
    missing: ['AI Deep Review', 'Career Roadmap', 'Unlimited Analyses', 'PDF Reports'],
    cta: 'Get Started Free', highlighted: false,
  },
  {
    name: 'Pro', price: '₹499', period: '/month',
    description: 'For serious job seekers',
    features: ['Unlimited Analyses', 'Full AI Review', 'Career Roadmap', 'Peer Comparison', 'Priority Support'],
    missing: ['Resume Review', 'Interview Predictor', 'PDF Reports'],
    cta: 'Start Pro Trial', highlighted: true, badge: 'Most Popular',
  },
  {
    name: 'Premium', price: '₹999', period: '/month',
    description: 'Complete career toolkit',
    features: ['Everything in Pro', 'Resume AI Review', 'Interview Predictor', 'PDF Reports', 'Hiring Insights', 'Salary Negotiation Guide'],
    missing: [],
    cta: 'Go Premium', highlighted: false,
  },
]

const faqs = [
  {
    q: 'Does DevScope access my private repositories?',
    a: 'No. We only request access to your public repositories. Your private code stays private.',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'Our analysis is powered by DeepSeek/GPT-4 and combines structural code metrics with AI judgment. Think of it as a thorough code review by a senior engineer.',
  },
  {
    q: 'How long does analysis take?',
    a: 'Most analyses complete in 30-90 seconds depending on repository size. Complex projects may take up to 3 minutes.',
  },
  {
    q: 'Can I analyze private repos?',
    a: 'With the Pro plan, you can connect private repositories by granting expanded GitHub permissions.',
  },
  {
    q: 'What tech stacks are supported?',
    a: 'Any language and framework. JavaScript/TypeScript, Python, Java, Go, Rust, Flutter, and more. Our AI understands 40+ languages.',
  },
  {
    q: 'How is the salary estimate calculated?',
    a: 'Based on your role fit scores matched against current market data for India and Remote positions. Updated quarterly.',
  },
]

// ─── Sample Analysis Mockup ────────────────────────────────────
const SampleAnalysis = () => (
  <div className="glass-card p-6 max-w-2xl mx-auto">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <GithubIcon size={16} style={{ color: '#8b9cc8' }} />
          <span style={{ color: '#8b9cc8', fontSize: 13 }}>github.com/user/</span>
          <span style={{ color: '#f0f4ff', fontSize: 13, fontWeight: 600 }}>e-commerce-app</span>
        </div>
        <p style={{ color: '#4a5578', fontSize: 12 }}>React • Node.js • MongoDB</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>78</div>
        <div style={{ fontSize: 11, color: '#8b9cc8' }}>Overall Score</div>
      </div>
    </div>
    {[
      { label: 'Code Quality', score: 82, color: '#10b981' },
      { label: 'Architecture', score: 75, color: '#10b981' },
      { label: 'Documentation', score: 68, color: '#f59e0b' },
      { label: 'Testing', score: 45, color: '#ef4444' },
      { label: 'Security', score: 72, color: '#10b981' },
    ].map(({ label, score, color }) => (
      <div key={label} style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: '#8b9cc8' }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color }}>{score}/100</span>
        </div>
        <div style={{ height: 6, background: 'rgba(99,130,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }} whileInView={{ width: `${score}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ height: '100%', background: color, borderRadius: 3 }}
          />
        </div>
      </div>
    ))}
    <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8 }}>
      <p style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginBottom: 4 }}>✓ Role Match: Junior React Developer</p>
      <p style={{ fontSize: 12, color: '#8b9cc8' }}>Add unit tests to your React components to unlock Mid-Level Frontend Developer.</p>
    </div>
  </div>
)

// ─── FAQ Item ──────────────────────────────────────────────────
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
  const [activeFaq, setActiveFaq] = useState(null)

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

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge badge-blue" style={{ display: 'inline-flex', marginBottom: 24, fontSize: 13 }}>
              <Zap size={13} /> AI-Powered Engineering Assessment
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em' }}
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
            Connect your GitHub. Get an AI-powered engineering review, career roadmap, and hiring readiness score.{' '}
            <strong style={{ color: 'var(--text-primary)' }}>Free to start.</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ fontSize: 16, padding: '14px 28px' }}>
                <Zap size={18} /> Go to Dashboard
              </Link>
            ) : (
              <button onClick={login} className="btn-primary" id="hero-cta-login" style={{ fontSize: 16, padding: '14px 28px' }}>
                <GithubIcon size={18} /> Analyze My GitHub
              </button>
            )}
            <a href="#sample" className="btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }}>
              View Sample Report <ChevronRight size={16} />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}
          >
            No credit card required · Free plan available · 2,400+ developers analyzed
          </motion.p>

          {/* Hero code preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ marginTop: 64 }}
          >
            <SampleAnalysis />
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
            <p className="section-label" style={{ marginBottom: 12 }}>What we analyze</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Everything a recruiter actually{' '}
              <span className="gradient-text">looks at</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', fontSize: 17 }}>
              We go beyond GitHub activity and LeetCode scores to analyze what engineering teams actually care about.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card-hover"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ padding: 28 }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, marginBottom: 16,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
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

      {/* ── Sample Analysis ───────────────────────────────────── */}
      <section id="sample" style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ marginBottom: 48 }}
          >
            <p className="section-label" style={{ marginBottom: 12 }}>Live demo</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              What your report <span className="gradient-text">looks like</span>
            </h2>
          </motion.div>
          <SampleAnalysis />
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section id="testimonials" style={{ padding: '100px 24px' }}>
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
      <section id="pricing" style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
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
      <section id="faq" style={{ padding: '100px 24px' }}>
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
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
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
