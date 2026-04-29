import { createContext, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase.js'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Users from './pages/Users.jsx'
import Workouts from './pages/Workouts.jsx'
import Settings from './pages/Settings.jsx'

export const AuthContext = createContext(null)

function Layout({ children, currentPage }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-with-sidebar" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 240 }}>
        <TopBar currentPage={currentPage} />
        <main style={{ flex: 1, padding: 32, background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, currentPage }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#666', gap: 12 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
          </circle>
        </svg>
        Cargando...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <Layout currentPage={currentPage}>{children}</Layout>
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (snap.exists() && snap.data().role === 'admin') {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...snap.data() })
          } else {
            setUser(null)
          }
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute currentPage="Dashboard"><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute currentPage="Usuarios"><Users /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute currentPage="Entrenamientos"><Workouts /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute currentPage="Configuración"><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
