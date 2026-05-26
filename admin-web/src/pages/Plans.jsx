import { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import Badge from '../components/Badge.jsx'

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const PLAN_DEFS = [
  {
    id: 'free',
    name: 'Plan FREE',
    defaultPrice: 0,
    accent: '#666',
    border: '#9E9E9E',
    features: [
      'Registro de entrenamientos',
      'Ver entrenamientos',
      'Ver rutinas semanales',
      '3 usos del análisis biomecánico',
      '1 prueba gratuita por día de ScienceIA',
      'Visualización de estudios científicos',
    ],
  },
  {
    id: 'max',
    name: 'Plan MAX',
    defaultPrice: 20,
    accent: '#C62828',
    border: '#C62828',
    badge: 'MÁS POPULAR',
    features: [
      'Todo lo del FREE',
      'ScienceIA ilimitado para análisis de videos',
      'Análisis biomecánico ilimitado',
      'IA analiza cada entrenamiento que agregas',
      'Explicación en lenguaje simple por IA',
    ],
  },
  {
    id: 'max_plicometro',
    name: 'Plan MAX + Plicómetro',
    defaultPrice: 40,
    accent: '#1a1a2e',
    border: '#1a1a2e',
    badge: 'COMPLETO',
    features: [
      'Todo lo del MAX',
      'Plicómetro físico incluido',
      'Medición de IMC con conexión Bluetooth',
    ],
  },
]

function PlanCard({ plan, price, onSavePrice }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(price)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSavePrice(plan.id, Number(draft))
    setSaving(false)
    setEditing(false)
  }

  const isGlow = plan.id === 'max'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      border: `2px solid ${plan.border}`,
      flex: 1,
      minWidth: 240,
      boxShadow: isGlow
        ? `0 4px 24px rgba(198,40,40,0.12)`
        : '0 2px 8px rgba(0,0,0,0.06)',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      {plan.badge && (
        <div style={{
          display: 'inline-flex',
          padding: '3px 12px',
          borderRadius: 20,
          background: plan.accent,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          {plan.badge}
        </div>
      )}

      <div style={{ fontSize: 18, fontWeight: 800, color: plan.accent, marginBottom: 8, letterSpacing: '-0.02em' }}>
        {plan.name}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: plan.accent }}>$</span>
            <input
              type="number"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              min={0}
              style={{
                width: 80,
                fontSize: 28,
                fontWeight: 800,
                border: `2px solid ${plan.accent}`,
                borderRadius: 8,
                padding: '2px 8px',
                color: plan.accent,
                outline: 'none',
              }}
              autoFocus
            />
            <span style={{ fontSize: 14, color: '#999' }}>/mes</span>
            <button
              className="btn btn-success"
              style={{ padding: '5px 12px', fontSize: 13 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '...' : 'Guardar'}
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '5px 10px', fontSize: 13 }}
              onClick={() => { setEditing(false); setDraft(price) }}
            >
              X
            </button>
          </div>
        ) : (
          <>
            <span style={{ fontSize: 32, fontWeight: 800, color: plan.accent, letterSpacing: '-0.02em' }}>
              ${price}
            </span>
            <span style={{ fontSize: 14, color: '#999' }}>/mes</span>
            <button
              onClick={() => { setEditing(true); setDraft(price) }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                padding: 4,
                display: 'flex',
                transition: 'color 0.15s',
              }}
              title="Editar precio"
              onMouseEnter={e => e.currentTarget.style.color = plan.accent}
              onMouseLeave={e => e.currentTarget.style.color = '#999'}
            >
              <IconEdit />
            </button>
          </>
        )}
      </div>

      <div style={{ height: 1, background: '#f0f0f0', margin: '16px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: '#2E7D32', flexShrink: 0, marginTop: 1 }}><IconCheck /></span>
            <span style={{ fontSize: 13, color: '#444', lineHeight: 1.4 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const parseDate = (val) => {
  if (!val) return null
  if (val.toDate) return val.toDate()
  return new Date(val)
}

export default function Plans() {
  const [prices, setPrices] = useState({ free: 0, max: 20, max_plicometro: 40 })
  const [payments, setPayments] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [freeSnap, maxSnap, maxPlicSnap] = await Promise.all([
        getDoc(doc(db, 'plans', 'free')).catch(() => null),
        getDoc(doc(db, 'plans', 'max')).catch(() => null),
        getDoc(doc(db, 'plans', 'max_plicometro')).catch(() => null),
      ])

      setPrices({
        free: freeSnap?.data()?.price ?? 0,
        max: maxSnap?.data()?.price ?? 20,
        max_plicometro: maxPlicSnap?.data()?.price ?? 40,
      })

      const usersSnap = await getDocs(collection(db, 'users'))
      const map = {}
      usersSnap.docs.forEach(d => { map[d.id] = d.data() })
      setUsersMap(map)

      const paymentsSnap = await getDocs(collection(db, 'payments'))
      const all = paymentsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      const pending = all
        .filter(p => p.status === 'pending')
        .sort((a, b) => {
          const da = parseDate(a.createdAt) || new Date(0)
          const db2 = parseDate(b.createdAt) || new Date(0)
          return db2 - da
        })
      setPayments(pending)
    } catch (err) {
      console.error('Plans load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrice = async (planId, newPrice) => {
    await setDoc(doc(db, 'plans', planId), { price: newPrice, updatedAt: Timestamp.now() }, { merge: true })
    setPrices(prev => ({ ...prev, [planId]: newPrice }))
  }

  const approvePayment = async (payment) => {
    setActionLoading(payment.id)
    try {
      const thirtyDays = new Date()
      thirtyDays.setDate(thirtyDays.getDate() + 30)

      await updateDoc(doc(db, 'payments', payment.id), { status: 'approved' })
      await updateDoc(doc(db, 'users', payment.userId), {
        planStatus: 'active',
        planExpiry: Timestamp.fromDate(thirtyDays),
      })
      setPayments(prev => prev.filter(p => p.id !== payment.id))
    } catch (err) {
      console.error('Approve error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const rejectPayment = async (payment) => {
    setActionLoading(payment.id)
    try {
      await updateDoc(doc(db, 'payments', payment.id), { status: 'rejected' })
      await updateDoc(doc(db, 'users', payment.userId), { planStatus: 'rejected' })
      setPayments(prev => prev.filter(p => p.id !== payment.id))
    } catch (err) {
      console.error('Reject error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const card = { background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ flex: 1, minWidth: 240, height: 340, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="skeleton skeleton-card" style={{ height: '100%', borderRadius: 16 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Planes disponibles
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          Haz clic en el precio para editarlo. Los cambios se guardan en Firestore.
        </p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {PLAN_DEFS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              price={prices[plan.id] ?? plan.defaultPrice}
              onSavePrice={handleSavePrice}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Pagos Pendientes
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Aprueba o rechaza los pagos registrados por los usuarios.
        </p>

        <div style={card}>
          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
              No hay pagos pendientes
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
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => {
                    const u = usersMap[p.userId] || {}
                    const name = p.userName || u.name || '—'
                    const email = p.userEmail || u.email || '—'
                    return (
                      <tr key={p.id} style={{ animation: 'fadeInUp 0.3s cubic-bezier(0.4,0,0.2,1) both' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: 'var(--primary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: 13, fontWeight: 700,
                            }}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{email}</td>
                        <td><Badge variant={p.plan} /></td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${p.amount}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {parseDate(p.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                        </td>
                        <td><Badge variant="pending" /></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn-success"
                              style={{ padding: '5px 12px', fontSize: 12, opacity: actionLoading === p.id ? 0.6 : 1 }}
                              onClick={() => approvePayment(p)}
                              disabled={actionLoading === p.id}
                            >
                              Aprobar
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '5px 12px', fontSize: 12, opacity: actionLoading === p.id ? 0.6 : 1 }}
                              onClick={() => rejectPayment(p)}
                              disabled={actionLoading === p.id}
                            >
                              Rechazar
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
    </div>
  )
}
