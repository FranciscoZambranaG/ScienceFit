import { useContext } from 'react'
import { AuthContext } from '../App.jsx'

const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
      background: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingInline: 24,
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>Admin</span>
          <span style={{ color: 'var(--border)', fontSize: 16, lineHeight: 1 }}>/</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{currentPage}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <button
            style={{
              width: 34, height: 34,
              borderRadius: 8,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
              transition: 'background 0.12s, border-color 0.12s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--border-light)'
              e.currentTarget.style.borderColor = '#D1D5DB'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <IconBell />
          </button>
          <div style={{
            position: 'absolute', top: 7, right: 7,
            width: 6, height: 6,
            background: 'var(--primary)',
            borderRadius: '50%',
            border: '1.5px solid var(--white)',
          }} />
        </div>

        <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 4px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {user?.name || 'Administrador'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
              {user?.email}
            </div>
          </div>
          <div style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
            letterSpacing: '0.01em',
          }}>
            {initial}
          </div>
        </div>
      </div>
    </header>
  )
}
