'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseAuth } from '@/lib/supabase-auth'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createSupabaseAuth()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) setError('이메일 전송에 실패했어요. 다시 시도해주세요.')
    else setSent(true)
  }

  if (sent) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm card p-8 flex flex-col gap-5 items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: '#e8f4f3', color: 'var(--action)' }}>✉</div>
        <div>
          <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>이메일을 보냈어요</p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--text)' }}>{email}</strong>으로<br />
            재설정 링크를 보냈어요. 링크는 1시간 유효해요.
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--muted2)' }}>메일이 안 보이면 스팸함도 확인해보세요.</p>
        </div>
        <Link href="/login" className="btn-primary w-full text-center">로그인 페이지로</Link>
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
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>비밀번호 찾기</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>가입한 이메일을 입력하면 재설정 링크를 보내드려요.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>이메일</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="가입한 이메일 주소" required autoFocus autoComplete="email" />
            </div>
            {error && (
              <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: '#fef2ee', color: 'var(--highlight)', border: '1px solid #f5c9bc' }}>
                ⚠ {error}
              </div>
            )}
            <button type="submit" className="btn-primary w-full" disabled={loading} style={{ opacity: loading ? 0.65 : 1 }}>
              {loading ? '전송 중...' : '재설정 링크 보내기'}
            </button>
          </form>
          <Link href="/login" className="text-sm text-center font-semibold" style={{ color: 'var(--action)' }}>← 로그인으로</Link>
        </div>
      </div>
    </div>
  )
}
