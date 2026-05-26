import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { db } from '../firebase.js'
import StatCard from '../components/StatCard.jsx'
import Badge from '../components/Badge.jsx'

const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
)

const IconWorkout = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h1v11h-1z" /><path d="M16.5 6.5h1v11h-1z" />
    <path d="M3 8.5h4" /><path d="M3 15.5h4" />
    <path d="M17 8.5h4" /><path d="M17 15.5h4" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
)

const IconAI = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="4" />
    <circle cx="8" cy="10" r="2" /><circle cx="16" cy="10" r="2" />
    <path d="M8 16s1.5 2 4 2 4-2 4-2" />
  </svg>
)

const IconActive = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const parseDate = (val) => {
  if (!val) return null
  if (val.toDate) return val.toDate()
  return new Date(val)
}

const getLast7Days = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
    }
  })

const AVATAR_COLORS = ['#C62828', '#1565C0', '#2E7D32', '#6A1B9A', '#E65100']

const tooltipStyle = {
  borderRadius: 10,
  border: 'none',
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  fontSize: 13,
  fontFamily: 'Inter, system-ui, sans-serif',
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalWorkouts: 0, iaCount: 0, activeToday: 0 })
  const [usersChart, setUsersChart] = useState([])
  const [workoutsChart, setWorkoutsChart] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const days = getLast7Days()
      const todayStr = new Date().toISOString().split('T')[0]

      const usersSnap = await getDocs(collection(db, 'users'))
      const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      let workoutsData = []
      try {
        const wSnap = await getDocs(collection(db, 'rutinas'))
        workoutsData = wSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        if (workoutsData.length === 0) {
          const wSnap2 = await getDocs(collection(db, 'workouts'))
          workoutsData = wSnap2.docs.map(d => ({ id: d.id, ...d.data() }))
        }
      } catch { /* empty */ }

      let iaCount = 0
      try {
        const iaSnap = await getDocs(collection(db, 'iaAnalysis'))
        iaCount = iaSnap.size
      } catch { /* empty */ }

      const activeToday = usersData.filter(u => {
        const d = parseDate(u.createdAt)
        return d && d.toISOString().split('T')[0] === todayStr
      }).length

      const usersChartData = days.map(({ date, label }) => ({
        label,
        Usuarios: usersData.filter(u => {
          const d = parseDate(u.createdAt)
          return d && d.toISOString().split('T')[0] === date
        }).length,
      }))

      const workoutsChartData = days.map(({ date, label }) => ({
        label,
        Rutinas: workoutsData.filter(w => {
          const d = parseDate(w.fecha || w.date)
          return d && d.toISOString().split('T')[0] === date
        }).length,
      }))

      const sorted = [...usersData].sort((a, b) => {
        const da = parseDate(a.createdAt) || new Date(0)
        const db2 = parseDate(b.createdAt) || new Date(0)
        return db2 - da
      })

      setStats({ totalUsers: usersData.length, totalWorkouts: workoutsData.length, iaCount, activeToday })
      setUsersChart(usersChartData)
      setWorkoutsChart(workoutsChartData)
      setRecentUsers(sorted.slice(0, 5))
    } catch (err) {
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const card = {
    background: '#fff',
    borderRadius: 14,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="stats-row">
          {[1,2,3,4].map(i => (
            <div key={i} style={{ ...card, flex: 1, minWidth: 180, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div className="skeleton skeleton-card" style={{ width: 52, height: 52, borderRadius: 12 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: 8 }} />
                <div className="skeleton skeleton-text" style={{ width: '80%', height: 30 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[1,2].map(i => (
            <div key={i} style={card}>
              <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: 20 }} />
              <div className="skeleton skeleton-card" style={{ height: 240 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div className="stats-row fade-in-up" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatCard icon={<IconUsers />}   value={stats.totalUsers}    label="Total Usuarios"            accent="#C62828" />
        <StatCard icon={<IconWorkout />} value={stats.totalWorkouts} label="Entrenamientos"            accent="#1a1a2e" />
        <StatCard icon={<IconAI />}      value={stats.iaCount}       label="Consultas IA"              accent="#6A1B9A" />
        <StatCard icon={<IconActive />}  value={stats.activeToday}   label="Registros Hoy"             accent="#2E7D32" />
      </div>

      <div className="charts-grid fade-in-up-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '-0.02em' }}>
            Usuarios Registrados — Últimos 7 días
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={usersChart} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C62828" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C62828" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#999', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#999', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="Usuarios"
                stroke="#C62828"
                strokeWidth={2.5}
                fill="url(#gradUsers)"
                dot={{ r: 4, fill: '#C62828', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#C62828' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '-0.02em' }}>
            Entrenamientos por Día — Últimos 7 días
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={workoutsChart} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeec" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#999', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#999', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Rutinas" fill="#C62828" radius={[6, 6, 0, 0]} maxBarSize={40}
                onMouseEnter={(data, index, event) => { if (event?.target) event.target.style.fill = '#8B0000' }}
                onMouseLeave={(data, index, event) => { if (event?.target) event.target.style.fill = '#C62828' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ ...card }} className="fade-in-up-2">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '-0.02em' }}>
          Últimos 5 Usuarios Registrados
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Registro</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: 40 }}>Sin usuarios registrados</td></tr>
              ) : recentUsers.map((u, idx) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>
                        {(u.name || u.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.name || '—'}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td><Badge variant={u.plan || 'free'} /></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                    {parseDate(u.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                  </td>
                  <td>
                    <Badge variant={u.blocked ? 'blocked' : 'active'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
