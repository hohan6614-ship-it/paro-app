'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuth } from '@/lib/supabase-auth'
import { useAuth } from '@/context/AuthContext'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const returnUrl = searchParams.get('returnUrl') ?? '/'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (user) router.replace(returnUrl)
  }, [user, returnUrl, router])

  // URL 파라미터 에러 처리 (OAuth 실패 등)
  useEffect(() => {
    if (searchParams.get('error') === 'auth') {
      setError('인증에 실패했어요. 다시 시도해주세요.')
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createSupabaseAuth()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않아요.')
      } else if (error.message.includes('Too many requests') || error.status === 429) {
        setError('너무 많이 시도했어요. 잠시 후 다시 시도해주세요.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('이메일 인증이 필요해요. 받은 편지함을 확인해주세요.')
      } else {
        setError('로그인 중 오류가 발생했어요.')
      }
    } else {
      router.push(returnUrl)
      router.refresh()
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const supabase = createSupabaseAuth()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnUrl)}` },
    })
    setGoogleLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm flex flex-col gap-7">

        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</Link>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>국악 크리에이티브 마켓</p>
        </div>

        <div className="card p-8 flex flex-col gap-5">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>로그인</h1>

          {/* 구글 로그인 */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex items-center justify-center gap-3 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)',
              opacity: googleLoading ? 0.65 : 1 }}>
            {googleLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--muted)', borderTopColor: 'transparent' }} />
            ) : <GoogleIcon />}
            Google로 계속하기
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--muted2)' }}>또는</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 이메일 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>이메일</label>
              <input type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="hello@example.com" required autoFocus autoComplete="email" />
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>비밀번호</label>
                <Link href="/forgot-password" className="text-xs" style={{ color: 'var(--action)' }}>
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="비밀번호 입력" required autoComplete="current-password"
                  style={{ paddingRight: '42px' }} />
                <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* 로그인 상태 유지 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: 'var(--action)' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>로그인 상태 유지</span>
            </label>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                style={{ background: '#fef2ee', color: 'var(--highlight)', border: '1px solid #f5c9bc' }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}
              style={{ opacity: loading ? 0.65 : 1 }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                  로그인 중...
                </span>
              ) : '로그인'}
            </button>
          </form>

          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: 'var(--action)' }}>회원가입</Link>
          </p>
        </div>

        <Link href="/" className="text-xs text-center" style={{ color: 'var(--muted2)' }}>← 홈으로</Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
