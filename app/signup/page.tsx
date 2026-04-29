'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const USER_TYPES = ['창작자', '아티스트', '영상제작자', '기획자', '일반'] as const

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [userType, setUserType] = useState<string>('창작자')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 해요.')
      return
    }
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname: nickname.trim(), user_type: userType },
      },
    })
    setLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        setError('이미 가입된 이메일이에요.')
      } else {
        setError(error.message)
      }
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* 로고 */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>
            PARO
          </Link>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>국악 크리에이티브 마켓</p>
        </div>

        <div className="card p-8 flex flex-col gap-6">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>회원가입</h1>

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
                placeholder="6자 이상"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="활동 닉네임"
                required
                maxLength={20}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>사용자 유형</label>
              <div className="flex flex-wrap gap-2">
                {USER_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`tag ${userType === t ? 'active' : ''}`}
                    onClick={() => setUserType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
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
              {loading ? '가입 중...' : '가입하기'}
            </button>
          </form>

          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--action)' }}>
              로그인
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
