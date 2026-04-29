'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const USER_TYPES = ['창작자', '아티스트', '영상제작자', '기획자', '일반'] as const

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12C1 12 5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 1
  if (pw.length >= 8) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw) || /[A-Z]/.test(pw)) score++
  const map = [
    { label: '', color: '' },
    { label: '매우 약함', color: '#e05c3a' },
    { label: '약함',     color: '#d97706' },
    { label: '보통',     color: '#ca8a04' },
    { label: '강함',     color: '#16a34a' },
  ]
  return { score, ...map[score] }
}

// 이메일 형식 간단 검사
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function SignupPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [nickname, setNickname] = useState('')
  const [userType, setUserType] = useState<string>('창작자')
  const [agreed, setAgreed]     = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [showCf, setShowCf]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  // 필드별 오류
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  function validate() {
    const e: Record<string, string> = {}
    if (!isValidEmail(email))           e.email    = '올바른 이메일 형식이 아니에요.'
    if (password.length < 8)            e.password = '비밀번호는 8자 이상이어야 해요.'
    if (confirm !== password)           e.confirm  = '비밀번호가 일치하지 않아요.'
    if (!nickname.trim())               e.nickname = '닉네임을 입력해주세요.'
    if (nickname.trim().length < 2)     e.nickname = '닉네임은 2자 이상이어야 해요.'
    if (!agreed)                        e.agreed   = '이용약관에 동의해주세요.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname: nickname.trim(), user_type: userType },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (error) {
      if (error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already been registered')) {
        setErrors({ email: '이미 가입된 이메일이에요. 로그인해주세요.' })
      } else {
        setErrors({ form: error.message })
      }
      return
    }

    // 이메일 확인이 필요없는 경우(세션 즉시 발급) → 홈으로
    if (data.session) {
      router.push('/')
      router.refresh()
    } else {
      // 이메일 인증 대기
      setDone(true)
    }
  }

  const strength = getStrength(password)

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-sm flex flex-col gap-8 text-center">
          <div>
            <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</Link>
          </div>
          <div className="card p-8 flex flex-col gap-4 items-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: '#e8f4f3', color: 'var(--action)' }}>✉</div>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>이메일을 확인해주세요</p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                <strong style={{ color: 'var(--text)' }}>{email}</strong>으로<br />
                인증 링크를 보냈어요. 메일함을 확인한 후<br />
                링크를 클릭하면 가입이 완료돼요.
              </p>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted2)' }}>
              메일이 안 보이면 스팸함도 확인해보세요.
            </p>
            <Link href="/login" className="btn-primary w-full text-center mt-2">
              로그인 페이지로
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm flex flex-col gap-8">

        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</Link>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>국악 크리에이티브 마켓</p>
        </div>

        <div className="card p-8 flex flex-col gap-5">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>회원가입</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            {/* 이메일 */}
            <Field label="이메일" error={errors.email}>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                placeholder="hello@example.com"
                autoFocus
                autoComplete="email"
                style={errors.email ? { borderColor: 'var(--highlight)' } : {}}
              />
            </Field>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>비밀번호</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                  placeholder="8자 이상"
                  autoComplete="new-password"
                  style={{ paddingRight: '42px', ...(errors.password ? { borderColor: 'var(--highlight)' } : {}) }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }} tabIndex={-1}>
                  <EyeIcon open={showPw} />
                </button>
              </div>

              {/* 강도 표시 */}
              {password.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all"
                        style={{ background: i <= strength.score ? strength.color : 'var(--border)' }} />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                  )}
                </div>
              )}
              {errors.password && <p className="text-xs" style={{ color: 'var(--highlight)' }}>{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>비밀번호 확인</label>
              <div className="relative">
                <input
                  type={showCf ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })) }}
                  placeholder="비밀번호 재입력"
                  autoComplete="new-password"
                  style={{ paddingRight: '42px', ...(errors.confirm ? { borderColor: 'var(--highlight)' } : {}) }}
                />
                <button type="button" onClick={() => setShowCf(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }} tabIndex={-1}>
                  <EyeIcon open={showCf} />
                </button>
                {/* 일치 표시 */}
                {confirm.length > 0 && !errors.confirm && confirm === password && (
                  <span className="absolute right-9 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#16a34a' }}>✓</span>
                )}
              </div>
              {errors.confirm && <p className="text-xs" style={{ color: 'var(--highlight)' }}>{errors.confirm}</p>}
            </div>

            {/* 닉네임 */}
            <Field label="닉네임" error={errors.nickname}>
              <input
                type="text"
                value={nickname}
                onChange={e => { setNickname(e.target.value); setErrors(p => ({ ...p, nickname: '' })) }}
                placeholder="활동 닉네임 (2~20자)"
                maxLength={20}
                style={errors.nickname ? { borderColor: 'var(--highlight)' } : {}}
              />
            </Field>

            {/* 사용자 유형 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>사용자 유형</label>
              <div className="flex flex-wrap gap-2">
                {USER_TYPES.map(t => (
                  <button key={t} type="button"
                    className={`tag ${userType === t ? 'active' : ''}`}
                    onClick={() => setUserType(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 이용약관 동의 */}
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: '' })) }}
                  className="mt-0.5"
                  style={{ width: '16px', height: '16px', accentColor: 'var(--action)', flexShrink: 0 }}
                />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--action)', fontWeight: 600 }}>이용약관</span> 및{' '}
                  <span style={{ color: 'var(--action)', fontWeight: 600 }}>개인정보처리방침</span>에 동의합니다 (필수)
                </span>
              </label>
              {errors.agreed && <p className="text-xs ml-6" style={{ color: 'var(--highlight)' }}>{errors.agreed}</p>}
            </div>

            {errors.form && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: '#fef2ee', color: 'var(--highlight)', border: '1px solid #f5c9bc' }}>
                <span>⚠</span> {errors.form}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full mt-1"
              disabled={loading}
              style={{ opacity: loading ? 0.65 : 1 }}
            >
              {loading ? '처리 중...' : '가입하기'}
            </button>
          </form>

          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--action)' }}>로그인</Link>
          </p>
        </div>

        <Link href="/" className="text-xs text-center" style={{ color: 'var(--muted2)' }}>← 홈으로 돌아가기</Link>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: 'var(--highlight)' }}>{error}</p>}
    </div>
  )
}
