import { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import Badge from '../components/Badge.jsx'

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const PLAN_DEFS = [
  {
    id: 'free',
    name: 'FREE',
    defaultPrice: 0,
    accent: '#6B7280',
    accentBg: '#F3F4F6',
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
    name: 'MAX',
    defaultPrice: 20,
    accent: '#C62828',
    accentBg: '#FFEBEE',
    badge: 'Más popular',
    features: [
      'Todo lo del FREE',
      'ScienceIA ilimitado para análisis de videos',
      'Análisis biomecánico ilimitado',
      'IA analiza cada entrenamiento',
      'Explicación en lenguaje simple por IA',
    ],
  },
  {
    id: 'max_plicometro',
    name: 'MAX + Plicómetro',
    defaultPrice: 40,
    accent: '#4C1D95',
    accentBg: '#EDE9FE',
    badge: 'Completo',
    features: [
      'Todo lo del MAX',
      'Plicómetro físico incluido',
      'Medición de IMC con Bluetooth',
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

  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      border: `1px solid ${plan.id === 'max' ? plan.accent : 'var(--border)'}`,
      boxShadow: plan.id === 'max'
        ? '0 4px 24px rgba(198,40,40,0.10), 0 1px 4px rgba(0,0,0,0.04)'
        : 'var(--shadow-sm)',
      padding: '24px',
      flex: 1,
      minWidth: 240,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = plan.id === 'max'
          ? '0 8px 32px rgba(198,40,40,0.14), 0 2px 8px rgba(0,0,0,0.06)'
          : 'var(--shadow-card-hover)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = plan.id === 'max'
          ? '0 4px 24px rgba(198,40,40,0.10), 0 1px 4px rgba(0,0,0,0.04)'
          : 'var(--shadow-sm)'
      }}
    >
      {/* Plan header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: 99,
            background: plan.accentBg,
            color: plan.accent,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}>
            {plan.name}
          </div>
          {plan.badge && (
            <div style={{
              padding: '3px 10px',
              borderRadius: 99,
              background: plan.id === 'max' ? plan.accent : plan.accentBg,
              color: plan.id === 'max' ? '#fff' : plan.accent,
              fontSize: 11,
              fontWeight: 600,
            }}>
              {plan.badge}
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 20 }}>
        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: plan.accent }}>$</span>
            <input
              type="number"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              min={0}
              style={{
                width: 80,
                fontSize: 28,
                fontWeight: 700,
                border: `1.5px solid ${plan.accent}`,
                borderRadius: 8,
                padding: '2px 8px',
                color: plan.accent,
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
              autoFocus
            />
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>/mes</span>
            <button className="btn btn-success btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? '...' : 'Guardar'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setDraft(price) }}>
              ✕
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontSize: 36,
              fontWeight: 700,
              color: plan.accent,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}>
              ${price}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>/mes</span>
            <button
              onClick={() => { setEditing(true); setDraft(price) }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-tertiary)', padding: '2px 4px',
                display: 'flex', marginLeft: 4,
                transition: 'color 0.12s',
              }}
              title="Editar precio"
              onMouseEnter={e => e.currentTarget.style.color = plan.accent}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              <IconEdit />
            </button>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: 'var(--border-light)', marginBottom: 18 }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: plan.accentBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: plan.accent, flexShrink: 0, marginTop: 1,
            }}>
              <IconCheck />
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f}</span>
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

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card-static" style={{ flex: 1, minWidth: 240, height: 320 }}>
              <div className="skeleton" style={{ height: '100%', borderRadius: 'var(--radius-card)' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Plan cards */}
      <div>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Planes disponibles
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Haz clic en el precio para editarlo. Los cambios se guardan en Firestore.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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

      {/* Pending payments */}
      <div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Pagos pendientes
            </h2>
            {payments.length > 0 && (
              <span style={{
                background: 'var(--primary)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 99,
              }}>
                {payments.length}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Aprueba o rechaza los pagos registrados por los usuarios.
          </p>
        </div>

        <div className="card-static" style={{ overflow: 'hidden' }}>
          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 16px', color: 'var(--text-tertiary)', fontSize: 13 }}>
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
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: '50%',
                              background: 'var(--primary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
                            }}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500, fontSize: 13.5 }}>{name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{email}</td>
                        <td><Badge variant={p.plan} /></td>
                        <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${p.amount}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {parseDate(p.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                        </td>
                        <td><Badge variant="pending" /></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn-success btn-sm"
                              style={{ opacity: actionLoading === p.id ? 0.6 : 1 }}
                              onClick={() => approvePayment(p)}
                              disabled={actionLoading === p.id}
                            >
                              Aprobar
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ opacity: actionLoading === p.id ? 0.6 : 1 }}
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
