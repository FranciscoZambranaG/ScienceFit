import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
)

const IconWorkouts = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h1v11h-1z" /><path d="M16.5 6.5h1v11h-1z" />
    <path d="M3 8.5h4" /><path d="M3 15.5h4" />
    <path d="M17 8.5h4" /><path d="M17 15.5h4" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
)

const IconPlans = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const IconSubscriptions = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const navItems = [
  { to: '/',              label: 'Dashboard',       Icon: IconDashboard,    end: true },
  { to: '/users',         label: 'Usuarios',        Icon: IconUsers },
  { to: '/workouts',      label: 'Entrenamientos',  Icon: IconWorkouts },
  { to: '/plans',         label: 'Planes',          Icon: IconPlans },
  { to: '/subscriptions', label: 'Suscripciones',   Icon: IconSubscriptions },
  { to: '/settings',      label: 'Configuración',   Icon: IconSettings },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <aside className={`sidebar-fixed${isOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div className="sidebar-logo-text">SCIENCEFIT</div>
          <div style={{
            fontSize: 11,
            color: '#4B5563',
            marginTop: 4,
            fontWeight: 500,
            letterSpacing: '0.04em',
          }}>
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
              onClick={() => onClose?.()}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{
          padding: '8px 0 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <button
            onClick={handleLogout}
            className="sidebar-nav-item"
            style={{
              width: 'calc(100% - 16px)',
              margin: '0 8px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.35)',
              textAlign: 'left',
              border: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(220,38,38,0.16)'
              e.currentTarget.style.color = '#FCA5A5'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
            }}
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {isOpen && (
        <div className="sidebar-overlay open" onClick={onClose} />
      )}
    </>
  )
}
