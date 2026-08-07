import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, GitBranch, FileText, Map, BarChart3, LogOut, Zap, Crown, ChevronRight } from 'lucide-react'
import { useAuth } from '../../lib/authContext'

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { to: '/analysis', icon: <GitBranch size={17} />, label: 'Analysis' },
  { to: '/report', icon: <FileText size={17} />, label: 'Career Report' },
  { to: '/roadmap', icon: <Map size={17} />, label: 'Roadmap' },
  { to: '/compare', icon: <BarChart3 size={17} />, label: 'Compare' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside style={{
      width: 240, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-primary) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: "none",
          }}>
            <Zap size={16} fill="var(--bg-primary)" color="var(--bg-primary)" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            DevScope <span style={{ color: 'var(--text-primary)' }}>AI</span>
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '16px 12px' }}>
        <p className="section-label" style={{ padding: '0 12px', marginBottom: 8 }}>Navigation</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Upgrade Banner */}
      {user?.plan === 'free' && (
        <div style={{
          margin: '0 12px 12px', padding: '16px',
          background: 'linear-gradient(135deg, var(--border), rgba(59,130,246,0.04))',
          border: '1px solid var(--border)', borderRadius: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Crown size={14} color="#f59e0b" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Upgrade to Pro</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
            Unlimited analyses, AI reviews & roadmaps
          </p>
          <button className="btn-primary" style={{ padding: '7px 12px', fontSize: 12, width: '100%', justifyContent: 'center' }}>
            Upgrade — ₹499/mo
          </button>
        </div>
      )}

      {/* User profile */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {user?.avatar && (
          <img src={user.avatar} alt={user.username} style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '2px solid var(--border-strong)',
          }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.displayName || user?.username}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{user?.username}</p>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', padding: 4, borderRadius: 4,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  )
}
