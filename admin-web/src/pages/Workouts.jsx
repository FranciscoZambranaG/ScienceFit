import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase.js'
import Modal from '../components/Modal.jsx'

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

const IconDumbbell = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const card = {
  background: '#fff',
  borderRadius: 'var(--radius-card)',
  boxShadow: 'var(--shadow)',
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

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Entrenamientos
          </h2>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{filtered.length}</span>
        </div>

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex', pointerEvents: 'none' }}>
            <IconSearch />
          </span>
          <input
            className="input-field"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Usuario o nombre..."
            style={{ paddingLeft: 32, width: 260 }}
          />
        </div>
      </div>

      <div style={card}>
        {loading ? (
          <div style={{ padding: '8px 0' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '13px 16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}><div className="skeleton skeleton-text" style={{ width: '40%' }} /></div>
                <div className="skeleton skeleton-text" style={{ width: 90 }} />
                <div className="skeleton skeleton-text" style={{ width: 70 }} />
                <div className="skeleton skeleton-text" style={{ width: 60 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Ejercicios</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '48px 16px', fontSize: 13 }}>
                      {workouts.length === 0 ? 'No hay entrenamientos registrados' : 'No se encontraron resultados'}
                    </td>
                  </tr>
                ) : filtered.map(w => {
                  const exs = getExercises(w)
                  return (
                    <tr key={w.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
                          }}>
                            {getUserName(w.userId).charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13.5 }}>{getUserName(w.userId)}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500, fontSize: 13.5 }}>{w.name || w.nombre || 'Entrenamiento'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
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
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => setSelected(w)}
                        >
                          <IconEye /> Ver
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
          title={selected.name || selected.nombre || 'Detalle del entrenamiento'}
          onClose={() => setSelected(null)}
          footer={
            <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cerrar</button>
          }
        >
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            {getUserName(selected.userId)} · {parseDate(selected.fecha || selected.date)?.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) || '—'}
          </p>

          {getExercises(selected).length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '24px 0', fontSize: 13 }}>
              Sin ejercicios registrados
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {getExercises(selected).map((ex, i) => (
                <div key={i} style={{
                  background: 'var(--bg)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13.5 }}>
                      {ex.name || ex.nombre || `Ejercicio ${i + 1}`}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {ex.sets && <span>{ex.sets} series</span>}
                      {(ex.reps || ex.repeticiones) && <span>{ex.reps || ex.repeticiones} reps</span>}
                      {(ex.weight || ex.peso) && <span>{ex.weight || ex.peso} kg</span>}
                      {ex.rir !== undefined && <span>RIR {ex.rir}</span>}
                      {(ex.muscleGroup || ex.grupoMuscular) && (
                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '1px 7px', borderRadius: 4, fontWeight: 500 }}>
                          {ex.muscleGroup || ex.grupoMuscular}
                        </span>
                      )}
                    </div>
                  </div>
                  {(ex.videoUrl || ex.video) && (
                    <a href={ex.videoUrl || ex.video} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
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
