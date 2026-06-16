import { useEffect } from 'react'

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function Modal({ title, onClose, children, maxWidth = 520, footer }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid var(--border)',
          }}>
            <h2 style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'transparent',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.12s var(--easing), color 0.12s var(--easing)',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--border-light)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-tertiary)'
              }}
            >
              <IconClose />
            </button>
          </div>
        )}

        <div>{children}</div>

        {footer && (
          <div style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
