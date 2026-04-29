'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요.')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* 로고 */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>
            PARO
          </Link>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>국악 크리에이티브 마켓</p>
        </div>

        <div className="card p-8 flex flex-col gap-6">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>로그인</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hello@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-xs" style={{ color: 'var(--highlight)' }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn-primary w-full mt-1"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: 'var(--action)' }}>
              회원가입
            </Link>
          </p>
        </div>

        <Link href="/" className="text-xs text-center" style={{ color: 'var(--muted2)' }}>
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
