import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Share2, RefreshCw, Flame, Sparkles, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import { formatNumber } from '../lib/utils'

const API_URL = import.meta.env.VITE_API_URL

// ── Loading messages ────────────────────────────────────────────
const LOADING_MSGS = [
  'Reading your commit history...',
  'Judging your variable names...',
  'Counting unfinished projects...',
  'Consulting senior devs...',
  'Scanning for TODO comments...',
  'Measuring spaghetti code density...',
]

// ── Animated score ring for recruitment chance ──────────────────
const RecruitmentRing = ({ chance }) => {
  const radius = 52
  const stroke = 6
  const circumference = 2 * Math.PI * radius
  const dash = (chance / 100) * circumference
  const color = chance >= 70 ? '#10b981' : chance >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={60} cy={60} r={radius} fill="none" stroke="rgba(255,100,50,0.12)" strokeWidth={stroke} />
        <motion.circle
          cx={60} cy={60} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1 }}
        >
          {chance}%
        </motion.div>
        <div style={{ fontSize: 10, color: 'rgba(255,200,150,0.6)', marginTop: 3 }}>chance</div>
      </div>
    </div>
  )
}

// ── Shimmer skeleton ────────────────────────────────────────────
const Shimmer = ({ h = 20, w = '100%', rounded = 8, style = {} }) => (
  <div className="shimmer" style={{ height: h, width: w, borderRadius: rounded, ...style }} />
)

// ── Loading skeleton layout ────────────────────────────────────
const RoastSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div className="glass-card" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
      <Shimmer h={80} w={80} rounded={40} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Shimmer h={24} w="40%" />
        <Shimmer h={16} w="60%" />
      </div>
    </div>
    <Shimmer h={100} rounded={16} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2, 3].map(i => <Shimmer key={i} h={70} rounded={12} />)}
    </div>
    <Shimmer h={160} rounded={16} />
  </motion.div>
)

export default function RoastPage() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [roastData, setRoastData] = useState(null)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  // cycle loading messages
  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => {
        setLoadingMsgIdx(i => (i + 1) % LOADING_MSGS.length)
      }, 2000)
    } else {
      clearInterval(intervalRef.current)
      setLoadingMsgIdx(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [loading])

  const handleRoast = async () => {
    const trimmed = username.trim().replace(/^@/, '')
    if (!trimmed) {
      toast.error('Enter a GitHub username first!')
      return
    }
    setLoading(true)
    setError(null)
    setRoastData(null)
    try {
      const res = await fetch(`${API_URL}/api/public/roast/${trimmed}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'User not found or roast failed')
      }
      const data = await res.json()
      setRoastData(data)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard! 🔥')
  }

  const handleReset = () => {
    setRoastData(null)
    setError(null)
    setUsername('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRoast()
  }

  const { profile, roast, score } = roastData || {}

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* ── Ambient background glow ─────────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(239,68,68,0.12) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)',
      }} />

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            style={{ fontSize: 72, marginBottom: 16, display: 'block', lineHeight: 1 }}
          >
            🔥
          </motion.div>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16,
            background: 'linear-gradient(135deg, #fff 0%, #fca5a5 40%, #ef4444 70%, #f97316 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            GitHub Roast
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,200,180,0.7)', maxWidth: 480, margin: '0 auto' }}>
            Get brutally honest <em>(but kind)</em> AI feedback on your GitHub profile
          </p>
        </motion.div>

        {/* ── Input ───────────────────────────────────────────────── */}
        {!roastData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ marginBottom: 40 }}
          >
            <div style={{
              display: 'flex', gap: 12, padding: 8,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 16,
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,150,100,0.6)', pointerEvents: 'none',
                }} />
                <input
                  id="roast-username-input"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter GitHub username…"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px 14px 14px 42px',
                    background: 'transparent',
                    border: 'none', outline: 'none',
                    color: 'var(--text-primary)', fontSize: 16,
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <motion.button
                id="roast-me-btn"
                onClick={handleRoast}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: loading ? 'rgba(239,68,68,0.3)' : 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  color: 'white', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(239,68,68,0.4)',
                  transition: 'all 0.2s',
                }}
              >
                <Flame size={16} />
                {loading ? 'Roasting…' : 'Roast Me'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Error state ──────────────────────────────────────────── */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: 28, borderRadius: 16, textAlign: 'center',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              marginBottom: 32,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>😬</div>
            <p style={{ color: '#ef4444', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Roast Failed</p>
            <p style={{ color: 'rgba(255,200,180,0.6)', fontSize: 14, marginBottom: 20 }}>{error}</p>
            <button onClick={handleReset} className="btn-secondary" style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444' }}>
              <RefreshCw size={14} /> Try Again
            </button>
          </motion.div>
        )}

        {/* ── Loading skeleton ─────────────────────────────────────── */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Loading message */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
              padding: '32px 0', marginBottom: 32,
            }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ fontSize: 48 }}
              >🔥</motion.div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingMsgIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  style={{ color: 'rgba(255,200,150,0.8)', fontSize: 16, fontWeight: 500 }}
                >
                  {LOADING_MSGS[loadingMsgIdx]}
                </motion.p>
              </AnimatePresence>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}
                  />
                ))}
              </div>
            </div>
            <RoastSkeleton />
          </motion.div>
        )}

        {/* ── Results ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {roastData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >

              {/* Profile card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  padding: 28, borderRadius: 20,
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex', alignItems: 'center', gap: 20,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <img
                  src={profile?.avatarUrl}
                  alt={profile?.username}
                  style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(239,68,68,0.4)' }}
                />
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                    @{profile?.username}
                  </h2>
                  <p style={{ color: 'rgba(255,200,180,0.6)', fontSize: 14, marginBottom: 8 }}>{profile?.bio || 'No bio, mysterious...'}</p>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,200,180,0.7)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(profile?.followers || 0)}</strong> followers
                    </span>
                    <span style={{ fontSize: 13, color: 'rgba(255,200,180,0.7)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(profile?.publicRepos || 0)}</strong> repos
                    </span>
                  </div>
                </div>
                {score && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: score >= 60 ? '#f59e0b' : '#ef4444' }}>{score}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,200,150,0.5)', marginTop: 2 }}>dev score</div>
                  </div>
                )}
              </motion.div>

              {/* Badge */}
              {roast?.badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  style={{
                    padding: '24px 28px', borderRadius: 20, textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(249,115,22,0.15) 100%)',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🔥</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,200,150,0.6)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                    Your Badge
                  </p>
                  <p style={{
                    fontSize: 28, fontWeight: 900,
                    background: 'linear-gradient(135deg, #fbbf24, #ef4444)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {roast.badge}
                  </p>
                </motion.div>
              )}

              {/* Headline */}
              {roast?.headline && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    padding: '20px 24px', borderRadius: 16,
                    background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
                  }}
                >
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#fbbf24', lineHeight: 1.4 }}>
                    "{roast.headline}"
                  </p>
                </motion.div>
              )}

              {/* Roast Lines */}
              {roast?.roastLines?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,150,100,0.6)' }}>
                    The Roast
                  </p>
                  {roast.roastLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.12 }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.06) 100%)',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🔥</span>
                      <p style={{ color: 'rgba(255,220,210,0.9)', fontSize: 15, lineHeight: 1.6 }}>{line}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Verdict */}
              {roast?.verdict && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  style={{
                    padding: 28, borderRadius: 20,
                    background: 'rgba(30,10,10,0.6)', border: '1px solid rgba(239,68,68,0.25)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,150,100,0.6)', marginBottom: 16 }}>
                    Would a recruiter shortlist you?
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                    <RecruitmentRing chance={roast.recruitmentChance ?? 50} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 12 }}>
                        {['YES', 'NO', 'MAYBE'].map(v => (
                          <span
                            key={v}
                            style={{
                              display: 'inline-block', marginRight: 8, marginBottom: 8,
                              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                              background: roast.verdict?.toUpperCase() === v
                                ? v === 'YES' ? 'rgba(16,185,129,0.25)' : v === 'NO' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'
                                : 'rgba(255,255,255,0.05)',
                              color: roast.verdict?.toUpperCase() === v
                                ? v === 'YES' ? '#10b981' : v === 'NO' ? '#ef4444' : '#f59e0b'
                                : 'rgba(255,255,255,0.25)',
                              border: roast.verdict?.toUpperCase() === v
                                ? `1px solid ${v === 'YES' ? 'rgba(16,185,129,0.4)' : v === 'NO' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)'}`
                                : '1px solid transparent',
                            }}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                      <p style={{ color: 'rgba(255,220,210,0.7)', fontSize: 14, lineHeight: 1.6 }}>
                        Verdict: <strong style={{ color: 'var(--text-primary)' }}>{roast.verdict}</strong>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Glow Ups */}
              {roast?.glowUps?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(100,255,180,0.6)' }}>
                    ✨ How to Glow Up
                  </p>
                  {roast.glowUps.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.85 + i * 0.1 }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.04) 100%)',
                        border: '1px solid rgba(16,185,129,0.2)',
                      }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>✨</span>
                      <p style={{ color: 'rgba(167,243,208,0.9)', fontSize: 15, lineHeight: 1.6 }}>{tip}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Encouragement */}
              {roast?.encouragement && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  style={{
                    padding: '24px 28px', borderRadius: 20, textAlign: 'center',
                    background: 'linear-gradient(135deg, var(--border) 0%, rgba(0,200,83,0.12) 100%)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Sparkles size={28} style={{ color: '#69F0AE', marginBottom: 12 }} />
                  <p style={{ fontSize: 17, fontWeight: 600, color: 'rgba(200,255,230,0.9)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    "{roast.encouragement}"
                  </p>
                </motion.div>
              )}

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                style={{ display: 'flex', gap: 12, justifyContent: 'center', paddingTop: 8 }}
              >
                <button
                  id="share-roast-btn"
                  onClick={handleShare}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                    borderRadius: 12, border: '1px solid rgba(239,68,68,0.4)',
                    background: 'rgba(239,68,68,0.1)', color: '#fca5a5',
                    cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <Share2 size={15} /> Share This Roast
                </button>
                <button
                  id="roast-another-btn"
                  onClick={handleReset}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                    borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--border)', color: '#69F0AE',
                    cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <RefreshCw size={15} /> Roast Someone Else
                </button>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty hero CTA prompts ────────────────────────────────── */}
        {!loading && !roastData && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
          >
            {['torvalds', 'gaearon', 'sindresorhus', 'tj'].map(name => (
              <button
                key={name}
                onClick={() => { setUsername(name); }}
                style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 13,
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                  color: 'rgba(255,200,180,0.7)', cursor: 'pointer', fontWeight: 500,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; e.currentTarget.style.color = '#fca5a5' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = 'rgba(255,200,180,0.7)' }}
              >
                <ChevronRight size={12} style={{ display: 'inline', marginRight: 4 }} />
                @{name}
              </button>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
}
