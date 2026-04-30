'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createSupabaseAuth } from '@/lib/supabase-auth'
import { useState, useRef, useEffect } from 'react'

const AVATAR_COLORS = [
  { bg: '#FEF4E4', color: '#8A5A2B' },
  { bg: '#E6F4F2', color: '#1E7C73' },
  { bg: '#FBEEE9', color: '#C45532' },
  { bg: '#EDECE8', color: '#3D3530' },
]

function getAvatarStyle(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]
}

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const nickname = (user?.user_metadata?.nickname as string | undefined) ?? user?.email?.split('@')[0] ?? ''
  const userType = user?.user_metadata?.user_type as string | undefined
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const avatarStyle = getAvatarStyle(nickname)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    setDropdownOpen(false)
    const supabase = createSupabaseAuth()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isSearch = pathname.startsWith('/search')
  const isCommission = pathname.includes('/commission') && !pathname.includes('/my')

  return (
    <header className="sticky top-0 z-50"
      style={{ background: 'rgba(248,244,236,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: '56px' }}>

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-lg font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</span>
          <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--muted2)', letterSpacing: '0.04em' }}>국악 크리에이티브 마켓</span>
        </Link>

        {/* 우측 */}
        <div className="flex items-center gap-1">
          <Link href="/search"
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{ color: isSearch ? 'var(--action)' : 'var(--muted)', background: isSearch ? '#e8f4f3' : 'transparent' }}>
            탐색
          </Link>
          <Link href="/search?tab=commission"
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{ color: isCommission ? 'var(--action)' : 'var(--muted)', background: isCommission ? '#e8f4f3' : 'transparent' }}>
            의뢰
          </Link>

          {/* 인증 영역 */}
          {!loading && (
            <div className="flex items-center gap-2 ml-2 pl-2" style={{ borderLeft: '1px solid var(--border)' }}>
              {user ? (
                /* 로그인 상태: 아바타 + 드롭다운 */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(p => !p)}
                    className="flex items-center gap-2 rounded-full px-1 py-1 transition-all hover:bg-[var(--surface2)]"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={nickname}
                        className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: avatarStyle.bg, color: avatarStyle.color }}>
                        {nickname[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium hidden sm:block mr-1" style={{ color: 'var(--text)' }}>
                      {nickname}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" style={{ color: 'var(--muted2)', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* 드롭다운 */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-lg overflow-hidden z-50"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

                      {/* 사용자 정보 */}
                      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                        <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{nickname}</p>
                        {userType && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{userType}</p>
                        )}
                      </div>

                      {/* 메뉴 */}
                      <div className="py-1">
                        <NavDropdownItem href="/saved" icon="♡" label="내 저장함" onClick={() => setDropdownOpen(false)} />
                        <NavDropdownItem href="/my/inquiries" icon="✉" label="내 문의 내역" onClick={() => setDropdownOpen(false)} />
                        <NavDropdownItem href="/my/profile" icon="⚙" label="프로필 설정" onClick={() => setDropdownOpen(false)} />
                      </div>

                      <div style={{ borderTop: '1px solid var(--border)' }}>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface2)]"
                          style={{ color: 'var(--highlight)' }}>
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 비로그인 상태 */
                <>
                  <Link href="/login"
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{ color: 'var(--muted)' }}>
                    로그인
                  </Link>
                  <Link href="/signup" className="btn-primary text-xs px-4 py-1.5">
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

function NavDropdownItem({ href, icon, label, onClick }: {
  href: string; icon: string; label: string; onClick: () => void
}) {
  return (
    <Link href={href} onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface2)]"
      style={{ color: 'var(--text)' }}>
      <span style={{ color: 'var(--muted2)' }}>{icon}</span>
      {label}
    </Link>
  )
}
