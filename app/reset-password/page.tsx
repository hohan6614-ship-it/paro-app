'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuth } from '@/lib/supabase-auth'

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

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [showCf, setShowCf]       = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [ready, setReady]         = useState(false)
  const [done, setDone]           = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    const supabase = createSupabaseAuth()
    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) setError('링크가 만료되었거나 유효하지 않아요.')
          else setReady(true)
        })
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setReady(true)
        else setError('유효하지 않은 링크예요. 비밀번호 찾기를 다시 시도해주세요.')
      })
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('비밀번호는 8자 이상이어야 해요.'); return }
    if (password !== confirm) { setError('비밀번호가 일치하지 않아요.'); return }

    setLoading(true)
    const supabase = createSupabaseAuth()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) setError('비밀번호 변경에 실패했어요. 다시 시도해주세요.')
    else {
      setDone(true)
      setTimeout(() => router.push('/'), 2500)
    }
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm card p-8 flex flex-col gap-4 items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: '#e8f4f3', color: 'var(--action)' }}>✓</div>
        <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>비밀번호가 변경됐어요</p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>잠시 후 홈으로 이동해요.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm flex flex-col gap-7">
        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</Link>
        </div>
        <div className="card p-8 flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>새 비밀번호 설정</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>8자 이상의 새 비밀번호를 입력해주세요.</p>
          </div>

          {!ready && error ? (
            <div className="flex flex-col gap-4">
              <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: '#fef2ee', color: 'var(--highlight)', border: '1px solid #f5c9bc' }}>
                ⚠ {error}
              </div>
              <Link href="/forgot-password" className="btn-primary w-full text-center">비밀번호 찾기 다시 시도</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>새 비밀번호</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="8자 이상"
                    autoComplete="new-password" disabled={!ready} style={{ paddingRight: '42px' }} />
                  <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>비밀번호 확인</label>
                <div className="relative">
                  <input type={showCf ? 'text' : 'password'} value={confirm}
                    onChange={e => setConfirm(e.target.value)} placeholder="비밀번호 재입력"
                    autoComplete="new-password" disabled={!ready} style={{ paddingRight: '42px' }} />
                  <button type="button" onClick={() => setShowCf(p => !p)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }}>
                    <EyeIcon open={showCf} />
                  </button>
                  {confirm.length > 0 && confirm === password && (
                    <span className="absolute right-9 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: '#16a34a' }}>✓</span>
                  )}
                </div>
              </div>
              {error && (
                <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: '#fef2ee', color: 'var(--highlight)', border: '1px solid #f5c9bc' }}>
                  ⚠ {error}
                </div>
              )}
              <button type="submit" className="btn-primary w-full" disabled={loading || !ready}
                style={{ opacity: loading || !ready ? 0.65 : 1 }}>
                {loading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>
}
