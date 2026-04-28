'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-widest" style={{ color: 'var(--accent)' }}>
          PARO
        </Link>
        <nav className="flex gap-6 text-sm" style={{ color: 'var(--muted)' }}>
          <Link href="/search" className={pathname.startsWith('/search') ? 'text-white' : 'hover:text-white transition-colors'}>
            탐색
          </Link>
          <Link href="/search?tab=commission" className="hover:text-white transition-colors">
            의뢰
          </Link>
        </nav>
      </div>
    </header>
  )
}
