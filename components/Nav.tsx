'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50"
      style={{ background: 'rgba(248,244,236,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: '56px' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-lg font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</span>
          <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--muted2)', letterSpacing: '0.04em' }}>국악 크리에이티브 마켓</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/search"
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{ color: pathname.startsWith('/search') ? 'var(--action)' : 'var(--muted)', background: pathname.startsWith('/search') ? '#e8f4f3' : 'transparent' }}>
            탐색
          </Link>
          <Link href="/search?tab=commission"
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:text-[--action]"
            style={{ color: 'var(--muted)' }}>
            의뢰
          </Link>
        </nav>
      </div>
    </header>
  )
}
