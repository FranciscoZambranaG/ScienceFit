import { useEffect, useState } from 'react'

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!target && target !== 0) return
    if (target === 0) { setCount(0); return }

    const steps = Math.max(1, Math.floor(duration / 16))
    const increment = target / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target, duration])

  return count
}

export default function StatCard({ icon, value, label, accent = '#C62828', trend }) {
  const displayValue = useCountUp(typeof value === 'number' ? value : 0)

  return (
    <div className="card" style={{
      background: '#fff',
      borderRadius: 14,
      padding: '20px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flex: 1,
      minWidth: 180,
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: `${accent}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: accent,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 30,
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {typeof value === 'number' ? displayValue : (value ?? '—')}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>
          {label}
        </div>
        {trend !== undefined && (
          <div style={{
            fontSize: 12,
            color: trend >= 0 ? 'var(--success)' : 'var(--primary)',
            marginTop: 4,
            fontWeight: 600,
          }}>
            {trend >= 0 ? '+' : ''}{trend}% vs ayer
          </div>
        )}
      </div>
    </div>
  )
}
