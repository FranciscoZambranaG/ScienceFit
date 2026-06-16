import { useEffect, useState } from 'react'

function useCountUp(target, duration = 1200) {
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

const ICON_BG = {
  '#C62828': '#FFEBEE',
  '#16A34A': '#DCFCE7',
  '#16a34a': '#DCFCE7',
  '#D97706': '#FEF3C7',
  '#d97706': '#FEF3C7',
  '#7c3aed': '#EDE9FE',
  '#2563EB': '#DBEAFE',
  '#1a1a2e': '#E8E8F0',
}

export default function StatCard({ icon, value, label, accent = '#C62828', trend }) {
  const displayValue = useCountUp(typeof value === 'number' ? value : 0)
  const iconBg = ICON_BG[accent] || `${accent}18`

  return (
    <div className="card" style={{
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flex: 1,
      minWidth: 180,
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: iconBg,
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
          fontSize: 32,
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 4,
        }}>
          {typeof value === 'number' ? displayValue : (value ?? '—')}
        </div>
        <div style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          fontWeight: 400,
        }}>
          {label}
        </div>
        {trend !== undefined && (
          <div style={{
            fontSize: 11,
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
