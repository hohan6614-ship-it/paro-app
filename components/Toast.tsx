'use client'
import { useToast, type ToastType } from '@/context/ToastContext'

const STYLE: Record<ToastType, { bg: string; border: string; color: string; icon: string }> = {
  success: { bg: '#f0faf4', border: '#86efac', color: '#15803d', icon: '✓' },
  error:   { bg: '#fef2ee', border: '#f5c9bc', color: 'var(--highlight)', icon: '⚠' },
  info:    { bg: 'var(--surface)', border: 'var(--border)', color: 'var(--muted)', icon: 'ℹ' },
}

export default function Toast() {
  const { toasts, dismissToast } = useToast()
  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-[500] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        const s = STYLE[t.type]
        return (
          <div key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg pointer-events-auto"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color,
              minWidth: '240px', maxWidth: '360px',
              animation: 'slideInRight 0.2s ease' }}>
            <span className="shrink-0 font-bold">{s.icon}</span>
            <p className="text-sm flex-1 leading-snug" style={{ color: 'var(--text)' }}>{t.message}</p>
            <button onClick={() => dismissToast(t.id)}
              className="text-xs shrink-0 opacity-40 hover:opacity-80">✕</button>
          </div>
        )
      })}
    </div>
  )
}
