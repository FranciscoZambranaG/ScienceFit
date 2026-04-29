import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
)

const IconWorkouts = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h1v11h-1z" />
    <path d="M16.5 6.5h1v11h-1z" />
    <path d="M3 8.5h4" />
    <path d="M3 15.5h4" />
    <path d="M17 8.5h4" />
    <path d="M17 15.5h4" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
)

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const navItems = [
  { to: '/',            label: 'Dashboard',       Icon: IconDashboard },
  { to: '/users',       label: 'Usuarios',        Icon: IconUsers },
  { to: '/workouts',    label: 'Entrenamientos',   Icon: IconWorkouts },
  { to: '/settings',   label: 'Configuración',    Icon: IconSettings },
]

const linkBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '11px 20px',
  borderRadius: 10,
  margin: '2px 12px',
  color: 'rgba(255,255,255,0.65)',
  transition: 'background 0.15s, color 0.15s',
  fontWeight: 500,
  fontSize: 14,
}

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar-fixed" style={{
      width: 240,
      background: '#1a1a2e',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#4A90E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14,
            color: '#fff',
          }}>
            SF
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>ScienceFit</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 12, overflowY: 'auto' }}>
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              ...linkBase,
              background: isActive ? 'rgba(74,144,226,0.18)' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              borderLeft: isActive ? '3px solid #4A90E2' : '3px solid transparent',
              borderRadius: isActive ? '0 10px 10px 0' : 10,
              margin: isActive ? '2px 12px 2px 0' : '2px 12px',
              paddingLeft: isActive ? 17 : 20,
            })}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 0 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={handleLogout}
          style={{
            ...linkBase,
            width: '100%',
            background: 'transparent',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(211,47,47,0.15)'
            e.currentTarget.style.color = '#ef9a9a'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
          }}
        >
          <IconLogout />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
