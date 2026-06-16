import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Share2, RefreshCw, GitBranch, Star, MapPin, Eye, Info, Code, Award, Users, ChevronRight, Activity } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import { formatNumber, getScoreColor, getScoreLabel } from '../lib/utils'

const API_URL = import.meta.env.VITE_API_URL

// ── Shimmer skeleton ────────────────────────────────────────────
const Shimmer = ({ h = 20, w = '100%', rounded = 8, style = {} }) => (
  <div className="shimmer" style={{ height: h, width: w, borderRadius: rounded, ...style }} />
)

const ScannerSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div className="glass-card" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
      <Shimmer h={80} w={80} rounded={40} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Shimmer h={24} w="40%" />
        <Shimmer h={16} w="60%" />
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="glass-card" style={{ padding: 20 }}>
          <Shimmer h={40} rounded={8} />
        </div>
      ))}
    </div>
    <div className="glass-card" style={{ padding: 24 }}>
      <Shimmer h={30} w="30%" style={{ marginBottom: 16 }} />
      <Shimmer h={120} rounded={12} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {[1, 2].map(i => <Shimmer key={i} h={150} rounded={16} />)}
    </div>
  </motion.div>
)

// ── Animated score ring ─────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const radius = 52
  const stroke = 6
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference
  const color = getScoreColor(score)

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={65} cy={65} r={radius} fill="none" stroke="rgba(0,230,118,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={65} cy={65} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}
        >
          {score}
        </motion.div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>score</div>
      </div>
    </div>
  )
}

export default function PublicScanner() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [scanData, setScanData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check URL params on load
    const params = new URLSearchParams(window.location.search)
    const userParam = params.get('u') || params.get('username')
    if (userParam) {
      setUsername(userParam)
      performScan(userParam)
    }
  }, [])

  const performScan = async (targetUser) => {
    const trimmed = targetUser.trim().replace(/^@/, '')
    if (!trimmed) {
      toast.error('Enter a GitHub username first!')
      return
    }
    setLoading(true)
    setError(null)
    setScanData(null)
    try {
      const res = await fetch(`${API_URL}/api/public/scan/${trimmed}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'User not found or scan failed')
      }
      const data = await res.json()
      setScanData(data)
      // Update URL without reloading the page
      const newUrl = `${window.location.origin}${window.location.pathname}?u=${trimmed}`
      window.history.pushState({ path: newUrl }, '', newUrl)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleScan = () => {
    performScan(username)
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/scan?u=${scanData?.profile?.username || username}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Shareable link copied! 🔗')
  }

  const handleReset = () => {
    setScanData(null)
    setError(null)
    setUsername('')
    const newUrl = `${window.location.origin}${window.location.pathname}`
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleScan()
  }

  const { profile, metrics, topRepos, score, techProfile } = scanData || {}

  // Calculate languages percentage
  const languageList = metrics?.languages
    ? Object.entries(metrics.languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
    : []

  const totalLangBytes = languageList.reduce((sum, [_, bytes]) => sum + bytes, 0)

  // Curated language colors
  const LANG_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Java: '#b07219',
    PHP: '#4F5D95',
    'C++': '#f34b7d',
    C: '#555555',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* ── Ambient background glows ────────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,230,118,0.1) 0%, transparent 70%)',
      }} />

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 880, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* ── Hero Section ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
            background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)',
            borderRadius: 20, marginBottom: 20,
          }}>
            <Award size={14} style={{ color: '#69F0AE' }} />
            <span style={{ fontSize: 13, color: '#69F0AE', fontWeight: 600 }}>Free • No Login Required</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 14,
            background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 50%, #69F0AE 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Scan Any GitHub Profile
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
            Instant developer career score and repository analysis.
          </p>
        </motion.div>

        {/* ── Username Input Form ──────────────────────────────────── */}
        {!scanData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: 40 }}
          >
            <div style={{
              display: 'flex', gap: 12, padding: 8,
              background: 'rgba(15,23,42,0.4)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none',
                }} />
                <input
                  id="scan-username-input"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter GitHub username (e.g. torvalds)..."
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px 14px 14px 46px',
                    background: 'transparent',
                    border: 'none', outline: 'none',
                    color: 'var(--text-primary)', fontSize: 16,
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <motion.button
                id="scan-profile-btn"
                onClick={handleScan}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #00E676 0%, #00C853 100%)',
                  color: '#080B12', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 20px rgba(0,230,118,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? (
                  <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Search size={16} />
                )}
                {loading ? 'Scanning…' : 'Scan Profile'}
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
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: 32,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍❌</div>
            <p style={{ color: '#ef4444', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Scan Failed</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>{error}</p>
            <button onClick={handleReset} className="btn-secondary" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
              <RefreshCw size={14} /> Try Another User
            </button>
          </motion.div>
        )}

        {/* ── Loading state ────────────────────────────────────────── */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 40 }}>
              <RefreshCw size={36} style={{ color: '#69F0AE', animation: 'spin 1.5s linear infinite' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Fetching public commits, repos, and bio...</p>
            </div>
            <ScannerSkeleton />
          </motion.div>
        )}

        {/* ── Results state ────────────────────────────────────────── */}
        <AnimatePresence>
          {scanData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {/* Profile Card & Score */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'stretch' }}>
                {/* User Info */}
                <div className="glass-card" style={{ padding: 28, display: 'flex', gap: 20, alignItems: 'center' }}>
                  <img
                    src={profile?.avatarUrl}
                    alt={profile?.name || username}
                    style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid rgba(0,230,118,0.3)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {profile?.name || `@${profile?.username}`}
                      </h2>
                      <span className="badge badge-blue" style={{ fontSize: 11 }}>{techProfile}</span>
                    </div>
                    {profile?.username && (
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>@{profile.username}</p>
                    )}
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>
                      {profile?.bio || 'This developer has no bio.'}
                    </p>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      {profile?.location && (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} /> {profile.location}
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(profile?.followers || 0)}</strong> followers
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(profile?.following || 0)}</strong> following
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Overall Developer Score</p>
                  <ScoreRing score={score} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: getScoreColor(score), marginTop: 10 }}>
                    {getScoreLabel(score)}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                  { label: 'Total Repos', value: metrics?.totalRepos || 0, icon: <GitBranch size={16} />, color: '#69F0AE' },
                  { label: 'Total Stars', value: metrics?.totalStars || 0, icon: <Star size={16} />, color: '#f59e0b' },
                  { label: 'Recent Active Repos', value: metrics?.activeRecentRepos || 0, icon: <Activity size={16} />, color: '#10b981' },
                  { label: 'Top Language', value: metrics?.languages ? Object.keys(metrics.languages)[0] || 'N/A' : 'N/A', icon: <Code size={16} />, color: '#ec4899' },
                ].map((item, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: item.color }}>
                      {item.icon}
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {item.label}
                      </span>
                    </div>
                    <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                      {typeof item.value === 'number' ? formatNumber(item.value) : item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Language Breakdown */}
              {languageList.length > 0 && (
                <div className="glass-card" style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Language Distribution</h3>
                  {/* Multi-colored bar */}
                  <div style={{
                    display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden',
                    background: 'rgba(255,255,255,0.05)', marginBottom: 20,
                  }}>
                    {languageList.map(([lang, bytes], idx) => {
                      const pct = ((bytes / totalLangBytes) * 100).toFixed(1)
                      const color = LANG_COLORS[lang] || '#64748b'
                      return (
                        <div
                          key={lang}
                          style={{
                            width: `${pct}%`,
                            background: color,
                            height: '100%',
                          }}
                          title={`${lang}: ${pct}%`}
                        />
                      )
                    })}
                  </div>
                  {/* Legends */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px' }}>
                    {languageList.map(([lang, bytes]) => {
                      const pct = ((bytes / totalLangBytes) * 100).toFixed(1)
                      const color = LANG_COLORS[lang] || '#64748b'
                      return (
                        <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{lang}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Top Repositories */}
              {topRepos && topRepos.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Top Repositories</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    {topRepos.map((repo, idx) => (
                      <div key={idx} className="glass-card-hover" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <GitBranch size={15} style={{ color: '#69F0AE' }} />
                            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                              {repo.name}
                            </h4>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                            {repo.description || 'No repository description.'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Star size={12} style={{ color: '#f59e0b' }} /> {formatNumber(repo.stars)}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <GitBranch size={12} style={{ color: '#10b981' }} /> {formatNumber(repo.forks)}
                            </span>
                          </div>
                          {repo.language && (
                            <span
                              className="badge"
                              style={{
                                fontSize: 10,
                                background: `${LANG_COLORS[repo.language] || '#64748b'}15`,
                                color: LANG_COLORS[repo.language] || '#94a3b8',
                                border: `1px solid ${LANG_COLORS[repo.language] || '#64748b'}25`,
                              }}
                            >
                              {repo.language}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
                <button
                  id="share-scan-btn"
                  onClick={handleShare}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                    borderRadius: 12, border: '1px solid rgba(0,230,118,0.4)',
                    background: 'rgba(0,230,118,0.08)', color: '#69F0AE',
                    cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,230,118,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,230,118,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <Share2 size={15} /> Copy Shareable Link
                </button>
                <button
                  id="scan-another-btn"
                  onClick={handleReset}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                    borderRadius: 12, border: '1px solid var(--border)',
                    background: 'transparent', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <RefreshCw size={15} /> Scan Another User
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
