import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
)

const GeometricPattern = () => (
  <svg
    width="100%"
    height="100%"
    style={{ position: 'absolute', inset: 0, opacity: 0.08 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="1.5" fill="white" />
        <line x1="0" y1="0" x2="60" y2="60" stroke="white" strokeWidth="0.5" />
        <line x1="60" y1="0" x2="0" y2="60" stroke="white" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="1" fill="white" />
        <circle cx="60" cy="0" r="1" fill="white" />
        <circle cx="0" cy="60" r="1" fill="white" />
        <circle cx="60" cy="60" r="1" fill="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo)" />
  </svg>
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const snap = await getDoc(doc(db, 'users', cred.user.uid))
      if (!snap.exists() || snap.data().role !== 'admin') {
        await signOut(auth)
        setError('Acceso denegado. Solo administradores pueden ingresar.')
        setLoading(false)
        return
      }
      navigate('/', { replace: true })
    } catch (err) {
      const msgs = {
        'auth/user-not-found': 'No existe una cuenta con ese email.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-email': 'El email no es válido.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
        'auth/invalid-credential': 'Email o contraseña incorrectos.',
      }
      setError(msgs[err.code] || 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Left panel */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f2040 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <GeometricPattern />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: '0.1em',
            color: '#C62828',
            marginBottom: 8,
          }}>
            SCIENCEFIT
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 48, fontWeight: 400 }}>
            Panel de Administración
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { num: '100+', label: 'Usuarios activos' },
              { num: '500+', label: 'Entrenamientos registrados' },
              { num: '3', label: 'Planes disponibles' },
            ].map(({ num, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#C62828',
                  minWidth: 64,
                  letterSpacing: '-0.02em',
                }}>
                  {num}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        background: '#FAFAF8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '40px 36px',
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          animation: 'fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) both',
        }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: 6,
              letterSpacing: '-0.02em',
            }}>
              Iniciar Sesión
            </h1>
            <p style={{ color: '#6B6B6B', fontSize: 13 }}>
              Ingresa tus credenciales de administrador
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B0B0', display: 'flex' }}>
                  <IconMail />
                </span>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sciencefit.com"
                  required
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B0B0', display: 'flex' }}>
                  <IconLock />
                </span>
                <input
                  className="input-field"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: '#FFEBEE',
                border: '1px solid #FFCDD2',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#C62828',
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading
                  ? 'rgba(198,40,40,0.5)'
                  : 'linear-gradient(135deg, #C62828, #8B0000)',
                color: '#fff',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: loading ? 'none' : '0 2px 12px rgba(198,40,40,0.30)',
                letterSpacing: '0.01em',
                marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.08)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = '' }}
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#C0C0C0', marginTop: 24 }}>
            Acceso restringido a administradores
          </p>
        </div>
      </div>
    </div>
  )
}
