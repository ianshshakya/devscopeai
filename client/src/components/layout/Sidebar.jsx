import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, GitBranch, FileText, Map, BarChart3, LogOut, Settings, Zap, Crown } from 'lucide-react'
import { useAuth } from '../../lib/authContext'

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/analysis', icon: <GitBranch size={18} />, label: 'Analysis' },
  { to: '/report', icon: <FileText size={18} />, label: 'Career Report' },
  { to: '/roadmap', icon: <Map size={18} />, label: 'Roadmap' },
  { to: '/compare', icon: <BarChart3 size={18} />, label: 'Compare' },
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
      width: 220, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '0 12px',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 4px 20px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={14} fill="white" color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>
            DevScope <span style={{ color: '#818cf8' }}>AI</span>
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <p className="section-label" style={{ padding: '0 10px', marginBottom: 8 }}>Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade Banner */}
      {user?.plan === 'free' && (
        <div style={{
          margin: '16px 0', padding: '14px 14px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
          border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Crown size={14} color="#f59e0b" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Upgrade to Pro</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
            Unlimited analyses + AI reviews + Roadmaps
          </p>
          <button className="btn-primary" style={{ padding: '7px 12px', fontSize: 12, width: '100%', justifyContent: 'center' }}>
            Upgrade — ₹499/mo
          </button>
        </div>
      )}

      {/* User profile */}
      <div style={{
        padding: '14px 4px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {user?.avatar && (
          <img src={user.avatar} alt={user.username} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--border-strong)' }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.displayName || user?.username}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{user?.username}</p>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 4 }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  )
}
