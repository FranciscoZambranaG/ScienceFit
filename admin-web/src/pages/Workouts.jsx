import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase.js'
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

const IconDumbbell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h1v11h-1z" /><path d="M16.5 6.5h1v11h-1z" />
    <path d="M3 8.5h4" /><path d="M3 15.5h4" />
    <path d="M17 8.5h4" /><path d="M17 15.5h4" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
)

const parseDate = (val) => {
  if (!val) return null
  if (val.toDate) return val.toDate()
  return new Date(val)
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'))
      const map = {}
      usersSnap.docs.forEach(d => { map[d.id] = d.data() })
      setUsersMap(map)

      let data = []
      try {
        const snap = await getDocs(collection(db, 'rutinas'))
        data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch { /* empty */ }

      if (data.length === 0) {
        const snap2 = await getDocs(collection(db, 'workouts'))
        data = snap2.docs.map(d => ({ id: d.id, ...d.data() }))
      }

      data.sort((a, b) => {
        const da = parseDate(a.fecha || a.date) || new Date(0)
        const db2 = parseDate(b.fecha || b.date) || new Date(0)
        return db2 - da
      })
      setWorkouts(data)
    } catch (err) {
      console.error('Error loading workouts:', err)
    } finally {
      setLoading(false)
    }
  }

  const getUserName = (userId) => {
    const u = usersMap[userId]
    return u?.name || u?.email || (userId?.slice(0, 8) + '...') || '—'
  }

  const getExercises = (w) => w.exercises || w.ejercicios || []

  const filtered = workouts.filter(w => {
    const name = getUserName(w.userId)
    return name.toLowerCase().includes(search.toLowerCase()) ||
      (w.name || w.nombre || '').toLowerCase().includes(search.toLowerCase())
  })

  const card = { background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Todos los entrenamientos
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
            placeholder="Buscar por usuario o nombre..."
            style={{ paddingLeft: 34, width: 260 }}
          />
        </div>
      </div>

      <div style={card}>
        {loading ? (
          <div style={{ padding: '16px' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}><div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: 6 }} /></div>
                <div className="skeleton skeleton-text" style={{ width: 80 }} />
                <div className="skeleton skeleton-text" style={{ width: 70 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre / Tipo</th>
                  <th>Ejercicios</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>
                    {workouts.length === 0 ? 'No hay entrenamientos registrados' : 'No se encontraron resultados'}
                  </td></tr>
                ) : filtered.map(w => {
                  const exs = getExercises(w)
                  return (
                    <tr key={w.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                          }}>
                            {getUserName(w.userId).charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13 }}>{getUserName(w.userId)}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{w.name || w.nombre || 'Entrenamiento'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                          <IconDumbbell />
                          <span>{exs.length} ejercicio{exs.length !== 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {parseDate(w.fecha || w.date)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) || '—'}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '5px 10px', fontSize: 12 }}
                          onClick={() => setSelected(w)}
                        >
                          <IconEye /> Ver detalle
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <Modal
          onClose={() => setSelected(null)}
          footer={<button className="btn btn-ghost" onClick={() => setSelected(null)}>Cerrar</button>}
        >
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {selected.name || selected.nombre || 'Detalle del Entrenamiento'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {getUserName(selected.userId)} · {parseDate(selected.fecha || selected.date)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) || '—'}
            </p>
          </div>

          {getExercises(selected).length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 24 }}>Sin ejercicios registrados</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {getExercises(selected).map((ex, i) => (
                <div key={i} style={{
                  background: 'var(--cream)',
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderLeft: '3px solid var(--primary)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                      {ex.name || ex.nombre || `Ejercicio ${i + 1}`}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {ex.sets && <span>{ex.sets} series</span>}
                      {(ex.reps || ex.repeticiones) && <span>{ex.reps || ex.repeticiones} reps</span>}
                      {(ex.weight || ex.peso) && <span>{ex.weight || ex.peso} kg</span>}
                      {ex.rir !== undefined && <span>RIR {ex.rir}</span>}
                      {(ex.muscleGroup || ex.grupoMuscular) && (
                        <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '1px 8px', borderRadius: 4 }}>
                          {ex.muscleGroup || ex.grupoMuscular}
                        </span>
                      )}
                    </div>
                  </div>
                  {(ex.videoUrl || ex.video) && (
                    <a href={ex.videoUrl || ex.video} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600 }}>
                      Ver video
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
