import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { db } from '../firebase.js'
import StatCard from '../components/StatCard.jsx'

const IconUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
)

const IconWorkout = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h1v11h-1z" /><path d="M16.5 6.5h1v11h-1z" />
    <path d="M3 8.5h4" /><path d="M3 15.5h4" />
    <path d="M17 8.5h4" /><path d="M17 15.5h4" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
)

const IconAI = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="4" />
    <circle cx="8" cy="10" r="2" /><circle cx="16" cy="10" r="2" />
    <path d="M8 16s1.5 2 4 2 4-2 4-2" />
  </svg>
)

const IconActive = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const tooltipStyle = {
  borderRadius: 8,
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  fontSize: 13,
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

      // Users
      const usersSnap = await getDocs(collection(db, 'users'))
      const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Workouts — collection named 'rutinas' per spec (change to 'workouts' if needed)
      let workoutsData = []
      try {
        const wSnap = await getDocs(collection(db, 'rutinas'))
        workoutsData = wSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        if (workoutsData.length === 0) {
          const wSnap2 = await getDocs(collection(db, 'workouts'))
          workoutsData = wSnap2.docs.map(d => ({ id: d.id, ...d.data() }))
        }
      } catch { /* empty */ }

      // IA queries
      let iaCount = 0
      try {
        const iaSnap = await getDocs(collection(db, 'iaAnalysis'))
        iaCount = iaSnap.size
      } catch { /* collection may not exist */ }

      // Active today
      const activeToday = usersData.filter(u => {
        const d = parseDate(u.createdAt)
        return d && d.toISOString().split('T')[0] === todayStr
      }).length

      // Charts
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

      // Recent users (last 5)
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, color: '#999' }}>
        Cargando datos...
      </div>
    )
  }

  const card = {
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatCard icon={<IconUsers />}   value={stats.totalUsers}    label="Total Usuarios"            accent="#4A90E2" />
        <StatCard icon={<IconWorkout />} value={stats.totalWorkouts} label="Entrenamientos Registrados" accent="#D32F2F" />
        <StatCard icon={<IconAI />}      value={stats.iaCount}       label="Consultas IA"               accent="#7B1FA2" />
        <StatCard icon={<IconActive />}  value={stats.activeToday}   label="Usuarios Activos Hoy"       accent="#2E7D32" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Line chart */}
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 20 }}>
            Usuarios Registrados — Últimos 7 días
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={usersChart} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="Usuarios"
                stroke="#4A90E2"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#4A90E2', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 20 }}>
            Entrenamientos por Día — Últimos 7 días
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={workoutsChart} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Rutinas" fill="#D32F2F" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users table */}
      <div style={card}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 20 }}>
          Últimos 5 Usuarios Registrados
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha de Registro</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999', padding: 32 }}>Sin usuarios registrados</td></tr>
              ) : recentUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: '#4A90E2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>
                        {(u.name || u.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name || '—'}</span>
                    </div>
                  </td>
                  <td style={{ color: '#666' }}>{u.email}</td>
                  <td style={{ color: '#666' }}>
                    {parseDate(u.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                  </td>
                  <td>
                    <span className={`badge ${u.blocked ? 'badge-blocked' : 'badge-active'}`}>
                      {u.blocked ? 'Bloqueado' : 'Activo'}
                    </span>
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
