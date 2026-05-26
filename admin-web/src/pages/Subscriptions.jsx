import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import Badge from '../components/Badge.jsx'
import Modal from '../components/Modal.jsx'
import StatCard from '../components/StatCard.jsx'

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
)

const IconMoney = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconPending = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const PLAN_OPTIONS = [
  { value: 'max', label: 'MAX ($20/mes)' },
  { value: 'max_plicometro', label: 'MAX + Plicómetro ($40/mes)' },
]

const PLAN_AMOUNTS = { max: 20, max_plicometro: 40 }
const AVATAR_COLORS = ['#C62828', '#1565C0', '#2E7D32', '#6A1B9A', '#E65100', '#00695C', '#C75000']

const parseDate = (val) => {
  if (!val) return null
  if (val.toDate) return val.toDate()
  return new Date(val)
}

const getDaysRemaining = (expiry) => {
  if (!expiry) return null
  const exp = parseDate(expiry)
  if (!exp) return null
  return Math.floor((exp - new Date()) / (1000 * 60 * 60 * 24))
}

export default function Subscriptions() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [changePlanModal, setChangePlanModal] = useState(null)
  const [newPlan, setNewPlan] = useState('')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'))
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const subs = all.filter(u => u.plan === 'max' || u.plan === 'max_plicometro')
      subs.sort((a, b) => {
        const da = parseDate(a.createdAt) || new Date(0)
        const db2 = parseDate(b.createdAt) || new Date(0)
        return db2 - da
      })
      setSubscribers(subs)
    } catch (err) {
      console.error('Subscriptions load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const extendSubscription = async (userId, currentExpiry) => {
    setActionLoading(userId)
    try {
      const base = parseDate(currentExpiry) || new Date()
      const newExpiry = new Date(base)
      newExpiry.setDate(newExpiry.getDate() + 30)
      await updateDoc(doc(db, 'users', userId), {
        planExpiry: Timestamp.fromDate(newExpiry),
        planStatus: 'active',
      })
      setSubscribers(prev => prev.map(u =>
        u.id === userId ? { ...u, planExpiry: Timestamp.fromDate(newExpiry), planStatus: 'active' } : u
      ))
    } catch (err) {
      console.error('Extend error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const cancelSubscription = async (userId) => {
    setActionLoading(userId)
    try {
      await updateDoc(doc(db, 'users', userId), { planStatus: 'cancelled' })
      setSubscribers(prev => prev.map(u => u.id === userId ? { ...u, planStatus: 'cancelled' } : u))
    } catch (err) {
      console.error('Cancel error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const applyPlanChange = async () => {
    if (!newPlan || !changePlanModal) return
    setActionLoading(changePlanModal.id)
    try {
      await updateDoc(doc(db, 'users', changePlanModal.id), { plan: newPlan })
      setSubscribers(prev => prev.map(u => u.id === changePlanModal.id ? { ...u, plan: newPlan } : u))
      setChangePlanModal(null)
      setNewPlan('')
    } catch (err) {
      console.error('Plan change error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const now = new Date()
  const thisWeekEnd = new Date(now)
  thisWeekEnd.setDate(now.getDate() + 7)

  const activeCount = subscribers.filter(u => u.planStatus === 'active').length
  const pendingCount = subscribers.filter(u => u.planStatus === 'pending').length
  const monthlyRevenue = subscribers
    .filter(u => u.planStatus === 'active')
    .reduce((sum, u) => sum + (PLAN_AMOUNTS[u.plan] || 0), 0)
  const expiringThisWeek = subscribers.filter(u => {
    const d = getDaysRemaining(u.planExpiry)
    return d !== null && d >= 0 && d <= 7
  }).length

  const filtered = subscribers.filter(u => {
    const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
    const matchPlan = planFilter === 'all' || u.plan === planFilter
    return matchSearch && matchPlan
  })

  const card = { background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div className="fade-in-up" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatCard icon={<IconUsers />}   value={activeCount}       label="Suscriptores Activos"     accent="#C62828" />
        <StatCard icon={<IconMoney />}   value={monthlyRevenue}    label="Ingresos del Mes (USD)"   accent="#2E7D32" />
        <StatCard icon={<IconClock />}   value={expiringThisWeek}  label="Vencen Esta Semana"       accent="#F57F17" />
        <StatCard icon={<IconPending />} value={pendingCount}      label="Pendientes de Aprobación" accent="#6A1B9A" />
      </div>

      <div className="fade-in-up-1">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Suscripciones
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              ({filtered.length})
            </span>
          </h2>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              className="input-field"
              value={planFilter}
              onChange={e => setPlanFilter(e.target.value)}
              style={{ width: 160 }}
            >
              <option value="all">Todos los planes</option>
              <option value="max">MAX</option>
              <option value="max_plicometro">MAX + Plicómetro</option>
            </select>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B0B0', display: 'flex' }}>
                <IconSearch />
              </span>
              <input
                className="input-field"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar usuario..."
                style={{ paddingLeft: 34, width: 220 }}
              />
            </div>
          </div>
        </div>

        <div style={card}>
          {loading ? (
            <div style={{ padding: 16 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: 6 }} /></div>
                  <div className="skeleton skeleton-text" style={{ width: 60 }} />
                  <div className="skeleton skeleton-text" style={{ width: 80 }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Monto</th>
                    <th>Inicio</th>
                    <th>Vencimiento</th>
                    <th style={{ minWidth: 80 }}>Días</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>
                      No se encontraron suscripciones
                    </td></tr>
                  ) : filtered.map((u, idx) => {
                    const days = getDaysRemaining(u.planExpiry)
                    const isUrgent = days !== null && days < 7 && days >= 0
                    const isExpired = days !== null && days < 0
                    const rowClass = isUrgent ? 'row-warning' : isExpired ? 'row-danger' : ''
                    const startDate = parseDate(u.paymentDate || u.createdAt)
                    const expiryDate = parseDate(u.planExpiry)

                    return (
                      <tr key={u.id} className={rowClass}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                            }}>
                              {(u.name || u.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{u.name || '—'}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                        <td><Badge variant={u.plan} /></td>
                        <td style={{ fontWeight: 600 }}>${PLAN_AMOUNTS[u.plan] || 0}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {startDate?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {expiryDate?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                        </td>
                        <td>
                          {days !== null ? (
                            <span style={{
                              fontSize: 16,
                              fontWeight: 800,
                              color: isExpired ? 'var(--primary)' : isUrgent ? 'var(--warning)' : 'var(--success)',
                              letterSpacing: '-0.02em',
                            }}>
                              {isExpired ? 'Vencido' : `${days}d`}
                            </span>
                          ) : '—'}
                        </td>
                        <td>
                          <Badge variant={u.planStatus || 'active'} />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-success"
                              style={{ padding: '5px 10px', fontSize: 11, opacity: actionLoading === u.id ? 0.6 : 1 }}
                              onClick={() => extendSubscription(u.id, u.planExpiry)}
                              disabled={actionLoading === u.id}
                              title="Extender 30 días"
                            >
                              +30d
                            </button>
                            <button
                              className="btn btn-ghost"
                              style={{ padding: '5px 10px', fontSize: 11, borderColor: 'var(--primary)', color: 'var(--primary)' }}
                              onClick={() => { setChangePlanModal(u); setNewPlan(u.plan) }}
                              title="Cambiar plan"
                            >
                              Plan
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '5px 10px', fontSize: 11, opacity: actionLoading === u.id ? 0.6 : 1 }}
                              onClick={() => cancelSubscription(u.id)}
                              disabled={actionLoading === u.id}
                              title="Cancelar"
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {changePlanModal && (
        <Modal
          title={`Cambiar Plan — ${changePlanModal.name || changePlanModal.email}`}
          onClose={() => { setChangePlanModal(null); setNewPlan('') }}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => { setChangePlanModal(null); setNewPlan('') }}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={applyPlanChange}
                disabled={!newPlan || actionLoading === changePlanModal.id}
              >
                {actionLoading === changePlanModal.id ? 'Guardando...' : 'Guardar cambio'}
              </button>
            </>
          }
        >
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Plan actual: <Badge variant={changePlanModal.plan} />
          </p>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>
            Nuevo plan
          </label>
          <select
            className="input-field"
            value={newPlan}
            onChange={e => setNewPlan(e.target.value)}
          >
            <option value="">Seleccionar plan...</option>
            {PLAN_OPTIONS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </Modal>
      )}
    </div>
  )
}
