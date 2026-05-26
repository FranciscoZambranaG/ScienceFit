import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import Badge from '../components/Badge.jsx'
import Modal from '../components/Modal.jsx'

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

const IconBlock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)

const IconUnlock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const diff = Math.floor((exp - new Date()) / (1000 * 60 * 60 * 24))
  return diff
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

  const card = {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Todos los usuarios
          <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
            ({filtered.length})
          </span>
        </h2>

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B0B0', display: 'flex' }}>
            <IconSearch />
          </span>
          <input
            className="input-field"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            style={{ paddingLeft: 34, width: 280 }}
          />
        </div>
      </div>

      <div style={card}>
        {loading ? (
          <div style={{ padding: 48 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}><div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: 6 }} /><div className="skeleton skeleton-text" style={{ width: '60%' }} /></div>
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
                  <th>Rol</th>
                  <th>Plan</th>
                  <th>Días restantes</th>
                  <th>Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>No se encontraron usuarios</td></tr>
                ) : filtered.map((u, idx) => {
                  const days = getDaysRemaining(u.planExpiry)
                  const daysColor = days !== null && days < 7 ? 'var(--primary)' : days !== null && days < 15 ? 'var(--warning)' : 'var(--text-secondary)'

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: u.blocked ? '#e0e0e0' : AVATAR_COLORS[idx % AVATAR_COLORS.length],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                          }}>
                            {(u.name || u.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500 }}>{u.name || '—'}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td><Badge variant={u.role || 'usuario'} /></td>
                      <td>
                        {changingPlan === u.id ? (
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <select
                              value={newPlan}
                              onChange={e => setNewPlan(e.target.value)}
                              className="input-field"
                              style={{ padding: '4px 8px', width: 140, fontSize: 12 }}
                            >
                              <option value="">Seleccionar...</option>
                              {PLAN_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: 12 }}
                              onClick={() => applyPlanChange(u.id)}
                              disabled={!newPlan}
                            >
                              OK
                            </button>
                            <button
                              className="btn btn-ghost"
                              style={{ padding: '4px 8px', fontSize: 12 }}
                              onClick={() => { setChangingPlan(null); setNewPlan('') }}
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <Badge variant={u.plan || 'free'} />
                        )}
                      </td>
                      <td>
                        {days !== null ? (
                          <span style={{ fontWeight: 600, color: daysColor, fontSize: 13 }}>
                            {days > 0 ? `${days}d` : 'Vencido'}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>—</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {parseDate(u.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                      </td>
                      <td>
                        <Badge variant={u.blocked ? 'blocked' : 'active'} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '5px 10px', fontSize: 12 }}
                            onClick={() => setSelectedUser(u)}
                            title="Ver detalle"
                          >
                            <IconEye /> Ver
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '5px 10px', fontSize: 12, borderColor: 'var(--primary)', color: 'var(--primary)' }}
                            onClick={() => { setChangingPlan(u.id); setNewPlan(u.plan || 'free') }}
                            title="Cambiar plan"
                          >
                            Plan
                          </button>
                          <button
                            className={`btn ${u.blocked ? 'btn-success' : 'btn-danger'}`}
                            style={{ padding: '5px 10px', fontSize: 12, opacity: actionLoading === u.id ? 0.6 : 1 }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 22, fontWeight: 700,
            }}>
              {(selectedUser.name || selectedUser.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {selectedUser.name || '—'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{selectedUser.email}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Rol', <Badge key="r" variant={selectedUser.role || 'usuario'} />],
              ['Estado', <Badge key="s" variant={selectedUser.blocked ? 'blocked' : 'active'} />],
              ['Plan', <Badge key="p" variant={selectedUser.plan || 'free'} />],
              ['Plan Status', <Badge key="ps" variant={selectedUser.planStatus || 'active'} />],
              ['UID', <span key="u" style={{ fontSize: 11, color: '#999', fontFamily: 'monospace' }}>{selectedUser.id}</span>],
              ['Registro', parseDate(selectedUser.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) || '—'],
              ['Género', selectedUser.gender || '—'],
              ['Nivel', selectedUser.level || selectedUser.fitnessLevel || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ background: 'var(--cream)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#999', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
