import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

const IconBlock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)

const IconUnlock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
)

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const parseDate = (val) => {
  if (!val) return null
  if (val.toDate) return val.toDate()
  return new Date(val)
}

const roleBadge = (role) => {
  const map = { admin: 'badge-admin', coach: 'badge-coach', usuario: 'badge-usuario' }
  return <span className={`badge ${map[role] || 'badge-usuario'}`}>{role || 'usuario'}</span>
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

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
      console.error('Error updating user:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const card = { background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#333' }}>
            Todos los usuarios
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: '#999' }}>({filtered.length})</span>
          </h2>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>
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

      {/* Table */}
      <div style={card}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>Cargando usuarios...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: 40 }}>No se encontraron usuarios</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id}>
                    {/* Avatar + Name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: u.blocked ? '#e0e0e0' : '#4A90E2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0,
                        }}>
                          {(u.name || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ color: '#666' }}>{u.email}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td style={{ color: '#666', fontSize: 13 }}>
                      {parseDate(u.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                    </td>
                    <td>
                      <span className={`badge ${u.blocked ? 'badge-blocked' : 'badge-active'}`}>
                        {u.blocked ? 'Bloqueado' : 'Activo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '6px 10px', fontSize: 12 }}
                          onClick={() => setSelectedUser(u)}
                          title="Ver detalle"
                        >
                          <IconEye /> Ver
                        </button>
                        <button
                          className={`btn ${u.blocked ? 'btn-success' : 'btn-danger'}`}
                          style={{ padding: '6px 10px', fontSize: 12, opacity: actionLoading === u.id ? 0.6 : 1 }}
                          onClick={() => toggleBlock(u.id, u.blocked)}
                          disabled={actionLoading === u.id}
                          title={u.blocked ? 'Desbloquear' : 'Bloquear'}
                        >
                          {u.blocked ? <IconUnlock /> : <IconBlock />}
                          {u.blocked ? 'Desbloquear' : 'Bloquear'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', background: '#4A90E2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 20, fontWeight: 700,
                }}>
                  {(selectedUser.name || selectedUser.email || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#333' }}>{selectedUser.name || '—'}</div>
                  <div style={{ fontSize: 13, color: '#999' }}>{selectedUser.email}</div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', color: '#aaa', padding: 4 }}>
                <IconClose />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['Rol', roleBadge(selectedUser.role)],
                ['Estado', <span className={`badge ${selectedUser.blocked ? 'badge-blocked' : 'badge-active'}`}>{selectedUser.blocked ? 'Bloqueado' : 'Activo'}</span>],
                ['ID', <span style={{ fontSize: 11, color: '#999', fontFamily: 'monospace' }}>{selectedUser.id}</span>],
                ['Registro', parseDate(selectedUser.createdAt)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) || '—'],
                ['Género', selectedUser.gender || '—'],
                ['Nivel', selectedUser.level || selectedUser.fitnessLevel || '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ background: '#f8f8f8', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#999', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 14, color: '#333' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                className={`btn ${selectedUser.blocked ? 'btn-success' : 'btn-danger'}`}
                onClick={() => toggleBlock(selectedUser.id, selectedUser.blocked)}
                disabled={actionLoading === selectedUser.id}
              >
                {selectedUser.blocked ? <><IconUnlock /> Desbloquear</> : <><IconBlock /> Bloquear</>}
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
