'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError('이메일 전송에 실패했어요. 다시 시도해주세요.')
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-sm flex flex-col gap-8 text-center">
          <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</Link>
          <div className="card p-8 flex flex-col gap-4 items-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: '#e8f4f3', color: 'var(--action)' }}>✉</div>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>이메일을 보냈어요</p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                <strong style={{ color: 'var(--text)' }}>{email}</strong>으로<br />
                비밀번호 재설정 링크를 보냈어요.<br />
                링크는 1시간 동안 유효해요.
              </p>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted2)' }}>메일이 안 보이면 스팸함도 확인해보세요.</p>
            <Link href="/login" className="btn-primary w-full text-center mt-2">로그인 페이지로</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm flex flex-col gap-8">

        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</Link>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>국악 크리에이티브 마켓</p>
        </div>

        <div className="card p-8 flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>비밀번호 찾기</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              가입한 이메일을 입력하면 재설정 링크를 보내드려요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="가입한 이메일 주소"
                required
                autoFocus
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: '#fef2ee', color: 'var(--highlight)', border: '1px solid #f5c9bc' }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}
              style={{ opacity: loading ? 0.65 : 1 }}>
              {loading ? '전송 중...' : '재설정 링크 보내기'}
            </button>
          </form>

          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            <Link href="/login" className="font-semibold" style={{ color: 'var(--action)' }}>← 로그인으로 돌아가기</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
