'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  const nickname = user?.user_metadata?.nickname as string | undefined

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50"
      style={{ background: 'rgba(248,244,236,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: '56px' }}>

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-lg font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</span>
          <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--muted2)', letterSpacing: '0.04em' }}>국악 크리에이티브 마켓</span>
        </Link>

        {/* 우측: 탐색 + 인증 */}
        <div className="flex items-center gap-1">
          <Link href="/search"
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{ color: pathname.startsWith('/search') ? 'var(--action)' : 'var(--muted)', background: pathname.startsWith('/search') ? '#e8f4f3' : 'transparent' }}>
            탐색
          </Link>
          <Link href="/search?tab=commission"
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{ color: 'var(--muted)' }}>
            의뢰
          </Link>

          {/* 인증 영역 */}
          {!loading && (
            <div className="flex items-center gap-2 ml-2 pl-2" style={{ borderLeft: '1px solid var(--border)' }}>
              {user ? (
                <>
                  <span className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--text)' }}>
                    {nickname ?? user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{ color: 'var(--muted)' }}>
                    로그인
                  </Link>
                  <Link href="/signup"
                    className="btn-primary text-xs px-4 py-1.5">
                    가입
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
