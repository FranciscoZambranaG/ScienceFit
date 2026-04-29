import { useContext } from 'react'
import { AuthContext } from '../App.jsx'

export default function TopBar({ currentPage }) {
  const { user } = useContext(AuthContext)
  const initial = (user?.name || user?.email || 'A').charAt(0).toUpperCase()

  return (
    <header style={{
      height: 64,
      background: '#fff',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingInline: 32,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#333' }}>{currentPage}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
            {user?.name || 'Administrador'}
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>{user?.email}</div>
        </div>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: '#4A90E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
        }}>
          {initial}
        </div>
      </div>
    </header>
  )
}
