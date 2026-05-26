const VARIANTS = {
  free:           'badge-free',
  max:            'badge-max',
  max_plicometro: 'badge-max_plicometro',
  active:         'badge-active',
  pending:        'badge-pending',
  cancelled:      'badge-cancelled',
  rejected:       'badge-rejected',
  blocked:        'badge-blocked',
  admin:          'badge-admin',
  coach:          'badge-coach',
  usuario:        'badge-usuario',
  approved:       'badge-active',
}

const LABELS = {
  free:           'FREE',
  max:            'MAX',
  max_plicometro: 'MAX + Plicómetro',
  active:         'Activo',
  pending:        'Pendiente',
  cancelled:      'Cancelado',
  rejected:       'Rechazado',
  blocked:        'Bloqueado',
  admin:          'Admin',
  coach:          'Coach',
  usuario:        'Usuario',
  approved:       'Aprobado',
}

export default function Badge({ variant, label, style }) {
  const cls = VARIANTS[variant] || 'badge-usuario'
  const text = label ?? LABELS[variant] ?? variant
  return (
    <span className={`badge ${cls}`} style={style}>
      {text}
    </span>
  )
}
