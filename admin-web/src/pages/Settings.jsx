import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '../firebase.js'
import { AuthContext } from '../App.jsx'

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" />
  </svg>
)

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const card = {
  background: '#fff',
  borderRadius: 12,
  padding: 28,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  marginBottom: 20,
}

export default function Settings() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState(null)

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login', { replace: true })
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwMsg(null)

    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'Las contraseñas no coinciden.' })
      return
    }
    if (newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' })
      return
    }

    setPwLoading(true)
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, newPassword)
      setPwMsg({ type: 'success', text: 'Contraseña actualizada correctamente.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (err) {
      const msgs = {
        'auth/wrong-password': 'La contraseña actual es incorrecta.',
        'auth/weak-password': 'La nueva contraseña es muy débil.',
        'auth/invalid-credential': 'La contraseña actual es incorrecta.',
      }
      setPwMsg({ type: 'error', text: msgs[err.code] || 'Error al cambiar la contraseña.' })
    } finally {
      setPwLoading(false)
    }
  }

  const initial = (user?.name || user?.email || 'A').charAt(0).toUpperCase()

  return (
    <div style={{ maxWidth: 640 }}>

      {/* Profile card */}
      <div style={card}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 20 }}>
          Perfil del Administrador
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#4A90E2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 26, fontWeight: 700,
          }}>
            {initial}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#333' }}>{user?.name || 'Administrador'}</div>
            <span className="badge badge-admin" style={{ marginTop: 6 }}>Admin</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f8f8f8', borderRadius: 10 }}>
            <span style={{ color: '#4A90E2' }}><IconUser /></span>
            <div>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Nombre</div>
              <div style={{ fontSize: 14, color: '#333' }}>{user?.name || '—'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f8f8f8', borderRadius: 10 }}>
            <span style={{ color: '#4A90E2' }}><IconMail /></span>
            <div>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Email</div>
              <div style={{ fontSize: 14, color: '#333' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f8f8f8', borderRadius: 10 }}>
            <span style={{ color: '#4A90E2' }}><IconShield /></span>
            <div>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>UID</div>
              <div style={{ fontSize: 12, color: '#999', fontFamily: 'monospace' }}>{user?.uid}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Password card */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showPasswordForm ? 20 : 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#333' }}>Seguridad</h3>
          {!showPasswordForm && (
            <button
              className="btn btn-primary"
              onClick={() => { setShowPasswordForm(true); setPwMsg(null) }}
            >
              Cambiar contraseña
            </button>
          )}
        </div>

        {pwMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
            background: pwMsg.type === 'success' ? '#E8F5E9' : '#FFEBEE',
            color: pwMsg.type === 'success' ? '#2E7D32' : '#C62828',
            border: `1px solid ${pwMsg.type === 'success' ? '#C8E6C9' : '#FFCDD2'}`,
          }}>
            {pwMsg.text}
          </div>
        )}

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Contraseña actual
              </label>
              <input
                className="input-field"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Nueva contraseña
              </label>
              <input
                className="input-field"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Confirmar nueva contraseña
              </label>
              <input
                className="input-field"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { setShowPasswordForm(false); setPwMsg(null) }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={pwLoading}
                style={{ opacity: pwLoading ? 0.7 : 1 }}
              >
                {pwLoading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Logout card */}
      <div style={card}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 12 }}>Sesión</h3>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>
          Cerrar sesión del panel de administración.
        </p>
        <button
          className="btn btn-danger"
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <IconLogout />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
