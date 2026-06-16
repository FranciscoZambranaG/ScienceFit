import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import Badge from '../components/Badge.jsx'
import Modal from '../components/Modal.jsx'

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const IconBlock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)
const IconUnlock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
)

const PLAN_OPTIONS = [
  { value: 'free', label: 'FREE' },
  { value: 'max', label: 'MAX' },
  { value: 'max_plicometro', label: 'MAX + Plicómetro' },
]

const AVATAR_COLORS = ['#C62828', '#1565C0', '#2E7D32', '#6A1B9A', '#E65100', '#00695C']

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

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [changingPlan, setChangingPlan] = useState(null)
  const [newPlan, setNewPlan] = useState('')

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => {
        const da = parseDate(a.createdAt) || new Date(0)
        const db2 = parseDate(b.createdAt) || new Date(0)
        return db2 - da
      })
      setUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleBlock = async (userId, currentBlocked) => {
    setActionLoading(userId)
    try {
      await updateDoc(doc(db, 'users', userId), { blocked: !currentBlocked })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, blocked: !currentBlocked } : u))
      if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, blocked: !currentBlocked }))
    } catch (err) {
      console.error('Error toggling block:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const applyPlanChange = async (userId) => {
    if (!newPlan) return
    setActionLoading(userId)
    try {
      await updateDoc(doc(db, 'users', userId), { plan: newPlan })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u))
      setChangingPlan(null)
      setNewPlan('')
    } catch (err) {
      console.error('Error changing plan:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Usuarios
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: 8 }}>
              {filtered.length}
            </span>
          </h2>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex', pointerEvents: 'none' }}>
            <IconSearch />
          </span>
          <input
            className="input-field"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            style={{ paddingLeft: 36, width: 280 }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card-static" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '8px 0' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: 7 }} />
                  <div className="skeleton skeleton-text" style={{ width: '50%', height: 11 }} />
                </div>
                <div className="skeleton skeleton-text" style={{ width: 55 }} />
                <div className="skeleton skeleton-text" style={{ width: 70 }} />
                <div className="skeleton skeleton-text" style={{ width: 90 }} />
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
                  <th>Rol</th>
                  <th>Plan</th>
                  <th>Días</th>
                  <th>Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '48px 16px', fontSize: 13 }}>
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : filtered.map((u, idx) => {
                  const days = getDaysRemaining(u.planExpiry)
                  const daysUrgent = days !== null && days < 7 && days >= 0
                  const daysExpired = days !== null && days < 0

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: u.blocked ? '#D1D5DB' : AVATAR_COLORS[idx % AVATAR_COLORS.length],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                          }}>
                            {(u.name || u.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500, fontSize: 13.5 }}>{u.name || '—'}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                      <td><Badge variant={u.role || 'usuario'} /></td>
                      <td>
                        {changingPlan === u.id ? (
                          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                            <select
                              value={newPlan}
                              onChange={e => setNewPlan(e.target.value)}
                              className="input-field"
                              style={{ height: 32, padding: '0 8px', width: 130, fontSize: 12 }}
                            >
                              <option value="">Seleccionar...</option>
                              {PLAN_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => applyPlanChange(u.id)}
                              disabled={!newPlan}
                            >OK</button>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => { setChangingPlan(null); setNewPlan('') }}
                            >✕</button>
                          </div>
                        ) : (
                          <Badge variant={u.plan || 'free'} />
                        )}
                      </td>
                      <td>
                        {days !== null ? (
                          <span style={{
                            fontSize: 13, fontWeight: 600,
                            fontVariantNumeric: 'tabular-nums',
                            color: daysExpired ? 'var(--danger)' : daysUrgent ? 'var(--warning)' : 'var(--text-secondary)',
                          }}>
                            {daysExpired ? 'Vencido' : `${days}d`}
                          </span>
                        ) : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {parseDate(u.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                      </td>
                      <td><Badge variant={u.blocked ? 'blocked' : 'active'} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(u)}>
                            <IconEye /> Ver
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
                            onClick={() => { setChangingPlan(u.id); setNewPlan(u.plan || 'free') }}
                          >
                            Plan
                          </button>
                          <button
                            className={`btn btn-sm ${u.blocked ? 'btn-success' : 'btn-danger'}`}
                            style={{ opacity: actionLoading === u.id ? 0.6 : 1 }}
                            onClick={() => toggleBlock(u.id, u.blocked)}
                            disabled={actionLoading === u.id}
                          >
                            {u.blocked ? <IconUnlock /> : <IconBlock />}
                            {u.blocked ? 'Des.' : 'Bloquear'}
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

      {/* User detail modal */}
      {selectedUser && (
        <Modal
          title={null}
          onClose={() => setSelectedUser(null)}
          footer={
            <>
              <button
                className={`btn ${selectedUser.blocked ? 'btn-success' : 'btn-danger'}`}
                onClick={() => toggleBlock(selectedUser.id, selectedUser.blocked)}
                disabled={actionLoading === selectedUser.id}
              >
                {selectedUser.blocked ? <><IconUnlock /> Desbloquear</> : <><IconBlock /> Bloquear</>}
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>Cerrar</button>
            </>
          }
        >
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0,
            }}>
              {(selectedUser.name || selectedUser.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {selectedUser.name || '—'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{selectedUser.email}</div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['Rol',         <Badge key="r" variant={selectedUser.role || 'usuario'} />],
              ['Estado',      <Badge key="s" variant={selectedUser.blocked ? 'blocked' : 'active'} />],
              ['Plan',        <Badge key="p" variant={selectedUser.plan || 'free'} />],
              ['Plan status', <Badge key="ps" variant={selectedUser.planStatus || 'active'} />],
              ['Registro',    parseDate(selectedUser.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) || '—'],
              ['Género',      selectedUser.gender || '—'],
              ['Nivel',       selectedUser.level || selectedUser.fitnessLevel || '—'],
              ['UID',         <span key="uid" style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{selectedUser.id}</span>],
            ].map(([label, value]) => (
              <div key={label} style={{
                background: 'var(--surface)',
                borderRadius: 10,
                padding: '11px 14px',
                border: '1px solid var(--border-light)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {label}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
