import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import Badge from '../components/Badge.jsx'
import Modal from '../components/Modal.jsx'
import StatCard from '../components/StatCard.jsx'

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
)
const IconRevenue = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)
const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const PLAN_OPTIONS = [
  { value: 'free', label: 'FREE' },
  { value: 'max', label: 'MAX' },
  { value: 'max_plicometro', label: 'MAX + Plicómetro' },
]

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
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [changePlanModal, setChangePlanModal] = useState(null)
  const [newPlan, setNewPlan] = useState('')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'))
      const all = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.plan && u.plan !== 'free')
      all.sort((a, b) => {
        const da = parseDate(a.planExpiry) || new Date(0)
        const db2 = parseDate(b.planExpiry) || new Date(0)
        return da - db2
      })
      setSubs(all)
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
      if (base < new Date()) base.setTime(new Date().getTime())
      const newExpiry = new Date(base)
      newExpiry.setDate(newExpiry.getDate() + 30)
      await updateDoc(doc(db, 'users', userId), {
        planExpiry: Timestamp.fromDate(newExpiry),
      })
      setSubs(prev => prev.map(u =>
        u.id === userId ? { ...u, planExpiry: { toDate: () => newExpiry } } : u
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
      await updateDoc(doc(db, 'users', userId), {
        planStatus: 'cancelled',
      })
      setSubs(prev => prev.map(u =>
        u.id === userId ? { ...u, planStatus: 'cancelled' } : u
      ))
    } catch (err) {
      console.error('Cancel error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const applyPlanChange = async (userId) => {
    if (!newPlan) return
    setActionLoading(userId)
    try {
      await updateDoc(doc(db, 'users', userId), { plan: newPlan })
      setSubs(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u))
      setChangePlanModal(null)
      setNewPlan('')
    } catch (err) {
      console.error('Plan change error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const now = new Date()
  const thisWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const activeCount   = subs.filter(u => u.planStatus === 'active').length
  const pendingCount  = subs.filter(u => u.planStatus === 'pending').length
  const expiringCount = subs.filter(u => {
    const exp = parseDate(u.planExpiry)
    return exp && exp > now && exp <= thisWeek && u.planStatus === 'active'
  }).length
  const monthlyRevenue = subs
    .filter(u => u.planStatus === 'active')
    .reduce((acc, u) => {
      const prices = { max: 20, max_plicometro: 40 }
      return acc + (prices[u.plan] || 0)
    }, 0)

  const filtered = subs.filter(u => {
    const matchSearch = !search ||
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
    const matchPlan = !planFilter || u.plan === planFilter
    return matchSearch && matchPlan
  })

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card-static" style={{ flex: 1, minWidth: 180, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '50%', height: 32, marginBottom: 8, borderRadius: 6 }} />
                <div className="skeleton skeleton-text" style={{ width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card-static" style={{ height: 300 }}>
          <div className="skeleton" style={{ height: '100%', borderRadius: 'var(--radius-card)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Stat cards */}
      <div className="page-enter" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <StatCard icon={<IconUsers />}   value={activeCount}    label="Suscripciones activas"   accent="#C62828" />
        <StatCard icon={<IconRevenue />} value={monthlyRevenue} label="Ingresos estimados / mes"  accent="#16A34A" />
        <StatCard icon={<IconWarning />} value={expiringCount}  label="Vencen esta semana"        accent="#D97706" />
        <StatCard icon={<IconClock />}   value={pendingCount}   label="Pendientes de pago"        accent="#7c3aed" />
      </div>

      {/* Table */}
      <div className="page-enter-1">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Suscripciones
              <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: 8 }}>
                {filtered.length}
              </span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={planFilter}
              onChange={e => setPlanFilter(e.target.value)}
              className="input-field"
              style={{ height: 40, padding: '0 12px', width: 160, fontSize: 13 }}
            >
              <option value="">Todos los planes</option>
              {PLAN_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex', pointerEvents: 'none' }}>
                <IconSearch />
              </span>
              <input
                className="input-field"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar usuario..."
                style={{ paddingLeft: 36, width: 220, height: 40 }}
              />
            </div>
          </div>
        </div>

        <div className="card-static" style={{ overflow: 'hidden' }}>
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
                  <th>Días</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '52px 16px', fontSize: 13 }}>
                      No hay suscripciones que coincidan
                    </td>
                  </tr>
                ) : filtered.map(u => {
                  const days = getDaysRemaining(u.planExpiry)
                  const isUrgent  = days !== null && days >= 0 && days < 7
                  const isExpired = days !== null && days < 0
                  const prices = { max: 20, max_plicometro: 40, free: 0 }

                  return (
                    <tr key={u.id} className={isExpired ? 'row-danger' : isUrgent ? 'row-warning' : ''}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: u.planStatus === 'cancelled' ? '#D1D5DB' : 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
                          }}>
                            {(u.name || u.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500, fontSize: 13.5 }}>{u.name || '—'}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                      <td><Badge variant={u.plan || 'free'} /></td>
                      <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        ${prices[u.plan] ?? 0}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {parseDate(u.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {parseDate(u.planExpiry)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                      </td>
                      <td>
                        <span style={{
                          fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                          color: isExpired ? 'var(--danger)' : isUrgent ? 'var(--warning)' : 'var(--text-secondary)',
                        }}>
                          {days === null ? '—' : isExpired ? 'Vencido' : `${days}d`}
                        </span>
                      </td>
                      <td><Badge variant={u.planStatus || 'active'} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
                            onClick={() => { setChangePlanModal(u); setNewPlan(u.plan || 'free') }}
                          >
                            Plan
                          </button>
                          <button
                            className="btn btn-success btn-sm"
                            style={{ opacity: actionLoading === u.id ? 0.6 : 1 }}
                            onClick={() => extendSubscription(u.id, u.planExpiry)}
                            disabled={actionLoading === u.id}
                          >
                            +30d
                          </button>
                          <button
                            className="btn btn-soft-danger btn-sm"
                            style={{ opacity: actionLoading === u.id ? 0.6 : 1 }}
                            onClick={() => cancelSubscription(u.id)}
                            disabled={actionLoading === u.id || u.planStatus === 'cancelled'}
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
        </div>
      </div>

      {/* Change plan modal */}
      {changePlanModal && (
        <Modal
          title="Cambiar plan"
          onClose={() => { setChangePlanModal(null); setNewPlan('') }}
          footer={
            <>
              <button
                className="btn btn-primary"
                onClick={() => applyPlanChange(changePlanModal.id)}
                disabled={!newPlan || actionLoading === changePlanModal.id}
              >
                {actionLoading === changePlanModal.id ? 'Guardando...' : 'Aplicar cambio'}
              </button>
              <button className="btn btn-ghost" onClick={() => { setChangePlanModal(null); setNewPlan('') }}>
                Cancelar
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 17, fontWeight: 700, flexShrink: 0,
            }}>
              {(changePlanModal.name || changePlanModal.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {changePlanModal.name || '—'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                {changePlanModal.email}
              </div>
            </div>
          </div>

          <div>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 500,
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: 8,
            }}>
              Nuevo plan
            </label>
            <select
              value={newPlan}
              onChange={e => setNewPlan(e.target.value)}
              className="input-field"
              style={{ width: '100%' }}
            >
              <option value="">Seleccionar plan...</option>
              {PLAN_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              Plan actual: <strong style={{ color: 'var(--text-primary)' }}>{changePlanModal.plan?.toUpperCase() || 'FREE'}</strong>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
