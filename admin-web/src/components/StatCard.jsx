export default function StatCard({ icon, value, label, accent = '#4A90E2' }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '24px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#333', lineHeight: 1.1 }}>
          {value ?? '—'}
        </div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  )
}
