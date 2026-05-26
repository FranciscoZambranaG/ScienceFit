import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '../firebase.js'
import { AuthContext } from '../App.jsx'
import Badge from '../components/Badge.jsx'

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
  borderRadius: 14,
  padding: 28,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  marginBottom: 20,
}

const infoRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 16px',
  background: 'var(--cream)',
  borderRadius: 10,
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
    <div className="page-container" style={{ maxWidth: 640 }}>

      <div style={card}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '-0.02em' }}>
          Perfil del Administrador
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 26, fontWeight: 700,
            boxShadow: '0 4px 12px rgba(198,40,40,0.30)',
          }}>
            {initial}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {user?.name || 'Administrador'}
            </div>
            <Badge variant="admin" style={{ marginTop: 6 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={infoRow}>
            <span style={{ color: 'var(--primary)' }}><IconUser /></span>
            <div>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2, letterSpacing: '0.05em' }}>Nombre</div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{user?.name || '—'}</div>
            </div>
          </div>

          <div style={infoRow}>
            <span style={{ color: 'var(--primary)' }}><IconMail /></span>
            <div>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2, letterSpacing: '0.05em' }}>Email</div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{user?.email}</div>
            </div>
          </div>

          <div style={infoRow}>
            <span style={{ color: 'var(--primary)' }}><IconShield /></span>
            <div>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2, letterSpacing: '0.05em' }}>UID</div>
              <div style={{ fontSize: 12, color: '#999', fontFamily: 'monospace' }}>{user?.uid}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showPasswordForm ? 20 : 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Seguridad</h3>
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
            background: pwMsg.type === 'success' ? 'var(--success-light)' : 'var(--primary-light)',
            color: pwMsg.type === 'success' ? 'var(--success)' : 'var(--primary)',
            border: `1px solid ${pwMsg.type === 'success' ? '#C8E6C9' : '#FFCDD2'}`,
            fontWeight: 500,
          }}>
            {pwMsg.text}
          </div>
        )}

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Contraseña actual', val: currentPassword, set: setCurrentPassword, ph: '••••••••' },
              { label: 'Nueva contraseña', val: newPassword, set: setNewPassword, ph: 'Mínimo 6 caracteres' },
              { label: 'Confirmar nueva contraseña', val: confirmPassword, set: setConfirmPassword, ph: 'Repite la nueva contraseña' },
            ].map(({ label, val, set, ph }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                  {label}
                </label>
                <input
                  className="input-field"
                  type="password"
                  value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={ph}
                  required
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" className="btn btn-ghost"
                onClick={() => { setShowPasswordForm(false); setPwMsg(null) }}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={pwLoading}
                style={{ opacity: pwLoading ? 0.7 : 1 }}>
                {pwLoading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div style={card}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Sesión
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Cerrar sesión del panel de administración.
        </p>
        <button className="btn btn-danger" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconLogout />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
