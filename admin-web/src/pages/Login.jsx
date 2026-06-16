import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
)

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

const GeometricPattern = () => (
  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="geo" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
        <circle cx="0" cy="0" r="1.5" fill="white" />
        <circle cx="48" cy="0" r="1.5" fill="white" />
        <circle cx="0" cy="48" r="1.5" fill="white" />
        <circle cx="48" cy="48" r="1.5" fill="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo)" />
  </svg>
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
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
        'auth/user-not-found':   'No existe una cuenta con ese email.',
        'auth/wrong-password':   'Contraseña incorrecta.',
        'auth/invalid-email':    'El email no es válido.',
        'auth/too-many-requests':'Demasiados intentos. Intenta más tarde.',
        'auth/invalid-credential':'Email o contraseña incorrectos.',
      }
      setError(msgs[err.code] || 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Left panel */}
      <div style={{
        width: '44%',
        background: '#0A0A0F',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 52px 48px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <GeometricPattern />

        {/* Subtle red glow */}
        <div style={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 360,
          height: 360,
          background: 'radial-gradient(circle, rgba(198,40,40,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.1em',
            color: '#C62828',
            marginBottom: 6,
          }}>
            SCIENCEFIT
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 400, letterSpacing: '0.04em' }}>
            Panel de Administración
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              { num: '100+', label: 'Usuarios activos' },
              { num: '500+', label: 'Entrenamientos registrados' },
              { num: '3',    label: 'Planes disponibles' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{
                  fontSize: 38,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {num}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 6, fontWeight: 400 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}>
            © 2025 ScienceFit
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        background: '#F7F7F8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '44px 40px',
          width: '100%',
          maxWidth: 400,
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          animation: 'fadeInUp 0.4s cubic-bezier(0,0,0.2,1) both',
        }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 6,
            }}>
              Iniciar sesión
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400 }}>
              Ingresa con tus credenciales de administrador
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)', display: 'flex', pointerEvents: 'none',
                }}>
                  <IconMail />
                </span>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sciencefit.com"
                  required
                  autoComplete="email"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
              }}>
                Contraseña
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
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-tertiary)', display: 'flex', padding: 0,
                  }}
                >
                  {showPw ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'var(--danger-light)',
                border: '1px solid #FECACA',
                borderRadius: 10,
                padding: '10px 14px',
                color: 'var(--danger)',
                fontSize: 13,
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: 48,
                fontSize: 15,
                justifyContent: 'center',
                marginTop: 4,
              }}
            >
              {loading ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 24 }}>
            Acceso restringido a administradores
          </p>
        </div>
      </div>
    </div>
  )
}
