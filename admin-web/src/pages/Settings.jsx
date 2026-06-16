import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '../firebase.js'
import { AuthContext } from '../App.jsx'

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 500,
        color: 'var(--text-secondary)', textTransform: 'uppercase',
        letterSpacing: '0.06em', marginBottom: 8,
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-tertiary)', display: 'flex', pointerEvents: 'none',
        }}>
          <IconLock />
        </span>
        <input
          className="input-field"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingLeft: 42, paddingRight: 44 }}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', padding: 2,
            transition: 'color 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
        >
          {show ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError] = useState('')

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)

    if (newPassword.length < 6) {
      setPwError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Las contraseñas no coinciden.')
      return
    }

    setPwLoading(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPassword)
      setPwSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPwSuccess(false), 4000)
    } catch (err) {
      const msgs = {
        'auth/wrong-password':         'La contraseña actual es incorrecta.',
        'auth/invalid-credential':     'La contraseña actual es incorrecta.',
        'auth/too-many-requests':      'Demasiados intentos. Intenta más tarde.',
        'auth/requires-recent-login':  'Sesión expirada. Cierra e inicia sesión de nuevo.',
      }
      setPwError(msgs[err.code] || 'Error al cambiar la contraseña.')
    } finally {
      setPwLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>

      {/* Profile card */}
      <div className="card-static page-enter" style={{ padding: '28px 28px' }}>
        <div style={{ marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconUser /> Perfil
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 24, fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {displayName}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
              {user?.email}
            </div>
          </div>
          <div style={{
            padding: '4px 12px', borderRadius: 99,
            background: 'var(--primary-light)', color: 'var(--primary)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          }}>
            ADMIN
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 22 }}>
          {[
            ['Rol',    'Administrador'],
            ['Email',  user?.email || '—'],
            ['UID',    <span key="uid" style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-tertiary)', wordBreak: 'break-all' }}>{user?.uid}</span>],
          ].map(([label, value]) => (
            <div key={label} style={{
              background: 'var(--surface)', borderRadius: 10,
              padding: '12px 14px', border: '1px solid var(--border-light)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                {label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Security card */}
      <div className="card-static page-enter-1" style={{ padding: '28px 28px' }}>
        <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconLock /> Seguridad
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Cambia tu contraseña de acceso al panel.
          </p>
        </div>

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PasswordField
            label="Contraseña actual"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Tu contraseña actual"
          />
          <PasswordField
            label="Nueva contraseña"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Mínimo 6 caracteres"
          />
          <PasswordField
            label="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repite la nueva contraseña"
          />

          {pwError && (
            <div style={{
              background: 'var(--danger-light)',
              border: '1px solid #FECACA',
              borderRadius: 10,
              padding: '10px 14px',
              color: 'var(--danger)',
              fontSize: 13,
              fontWeight: 500,
            }}>
              {pwError}
            </div>
          )}

          {pwSuccess && (
            <div style={{
              background: 'var(--success-light)',
              border: '1px solid #BBF7D0',
              borderRadius: 10,
              padding: '10px 14px',
              color: 'var(--success)',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <IconCheck /> Contraseña actualizada correctamente.
            </div>
          )}

          <div style={{ paddingTop: 4 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pwLoading || !currentPassword || !newPassword || !confirmPassword}
              style={{ minWidth: 160 }}
            >
              {pwLoading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>

      {/* Session card */}
      <div className="card-static page-enter-2" style={{ padding: '22px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Sesión activa</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
              Cierra sesión en este dispositivo.
            </div>
          </div>
          <button
            className="btn btn-soft-danger"
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 7 }}
          >
            <IconLogout /> Cerrar sesión
          </button>
        </div>
      </div>

    </div>
  )
}
