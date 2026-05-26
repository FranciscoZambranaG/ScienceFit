import { useContext } from 'react'
import { AuthContext } from '../App.jsx'

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export default function TopBar({ currentPage, onMenuClick }) {
  const { user } = useContext(AuthContext)
  const initial = (user?.name || user?.email || 'A').charAt(0).toUpperCase()

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingInline: 28,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="topbar-hamburger"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <IconMenu />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
          <span style={{ fontWeight: 400 }}>Admin</span>
          <span>/</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentPage}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <button style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--cream)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s var(--easing)',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0eeec'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--cream)'}
          >
            <IconBell />
          </button>
          <div style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 7,
            height: 7,
            background: 'var(--primary)',
            borderRadius: '50%',
            border: '1.5px solid #fff',
          }} />
        </div>

        <div style={{
          width: 1,
          height: 24,
          background: 'var(--border)',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {user?.name || 'Administrador'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{user?.email}</div>
          </div>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(198,40,40,0.3)',
          }}>
            {initial}
          </div>
        </div>
      </div>
    </header>
  )
}
