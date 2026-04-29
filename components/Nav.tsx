'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50" style={{ background: 'rgba(248,246,242,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 h-15 flex items-center justify-between" style={{ height: '56px' }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-black tracking-[0.15em]" style={{ color: 'var(--accent)' }}>PARO</span>
          <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--muted2)', letterSpacing: '0.05em' }}>국악 크리에이티브 마켓</span>
        </Link>
        <nav className="flex items-center gap-1">
          {[
            { href: '/search', label: '탐색' },
            { href: '/search?tab=commission', label: '의뢰' },
          ].map(({ href, label }) => (
            <Link key={label} href={href}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                color: pathname.startsWith('/search') && href.startsWith('/search') ? 'var(--accent)' : 'var(--muted)',
                background: pathname.startsWith('/search') && href === '/search' ? '#eef0f8' : 'transparent',
              }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
