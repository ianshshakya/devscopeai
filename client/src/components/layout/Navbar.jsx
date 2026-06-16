import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Menu, X } from 'lucide-react'
import { useAuth } from '../../lib/authContext'

const GithubIcon = ({ size = 18, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const { user, login, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = { pathname: typeof window !== 'undefined' ? window.location.pathname : '/' }
  const isDashboard = location.pathname !== '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        top: scrolled ? 12 : 0,
        left: scrolled ? '5%' : 0,
        right: scrolled ? '5%' : 0,
        zIndex: 1000,
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        background: scrolled ? 'rgba(11, 17, 30, 0.75)' : 'rgba(8, 11, 18, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: scrolled ? '1px solid rgba(0, 230, 118, 0.2)' : '1px solid rgba(255,255,255,0.03)',
        borderRadius: scrolled ? 16 : 0,
        boxShadow: scrolled ? '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 230, 118, 0.05)' : 'none',
      }}
    >
      {/* Logo */}
      <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #00E676, #00C853)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(0, 230, 118, 0.25)',
        }}>
          <Zap size={14} fill="#080B12" color="#080B12" />
        </div>
        <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          DevScope <span style={{ color: '#00E676' }}>AI</span>
        </span>
      </Link>

      {/* Desktop nav links (landing only) */}
      {!isDashboard && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.15s ease',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00E676';
                e.target.style.textShadow = '0 0 8px rgba(0,230,118,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--text-secondary)';
                e.target.style.textShadow = 'none';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Dashboard quick links */}
      {isDashboard && user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/analysis', label: 'Analysis' },
            { to: '/report', label: 'Report' },
            { to: '/roadmap', label: 'Roadmap' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                color: location.pathname === link.to ? '#00E676' : 'var(--text-secondary)',
                textDecoration: 'none',
                background: location.pathname === link.to ? 'rgba(0,230,118,0.08)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Auth buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={user.avatar}
              alt={user.username}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                border: '2px solid var(--border-strong)',
              }}
            />
            <button
              onClick={logout}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: 13 }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: 13 }}
            id="nav-cta"
          >
            <GithubIcon size={14} color="#080B12" /> Connect GitHub
          </button>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 4 }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </motion.nav>
  )
}
