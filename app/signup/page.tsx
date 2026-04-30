'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuth } from '@/lib/supabase-auth'
import { useAuth } from '@/context/AuthContext'

// ── 상수 ──────────────────────────────────────────────

const USER_TYPES = [
  { key: '음악 제작자',   emoji: '🎵', desc: 'K-POP·힙합·영화음악에 국악 요소를 넣고 싶어요' },
  { key: '영상 크리에이터', emoji: '🎬', desc: '유튜브·광고·다큐에 쓸 BGM을 찾고 있어요' },
  { key: '국악 아티스트', emoji: '🎤', desc: '제 작업을 소개하고 협업 기회를 찾고 싶어요' },
  { key: '공연·기획자',   emoji: '🎭', desc: '공연이나 행사에 맞는 아티스트를 찾고 있어요' },
  { key: '그냥 탐색',    emoji: '🔍', desc: '국악이 궁금해서 둘러보고 싶어요' },
] as const

const INTERESTS = ['해금', '가야금', '대금', '판소리', '장구', '피리', '거문고', '아쟁']

// ── 헬퍼 ──────────────────────────────────────────────

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

function getStrength(pw: string) {
  if (!pw) return { score: 0, label: '', color: '' }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Za-z]/.test(pw) && /[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const MAP = [
    { label: '', color: '' },
    { label: '약함', color: '#e05c3a' },
    { label: '보통', color: '#d97706' },
    { label: '강함', color: '#16a34a' },
  ] as const
  return { score: s, ...MAP[Math.min(s, 3)] }
}

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

// ── 컴포넌트 ─────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter()
  const { user } = useAuth()

  // Step 1 상태
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [nickname, setNickname] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [showCf, setShowCf]     = useState(false)
  const [agreed, setAgreed]     = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})

  // Step 2 상태
  const [step, setStep]         = useState<1 | 2>(1)
  const [userType, setUserType] = useState('')
  const [interests, setInterests] = useState<string[]>([])

  // 제출
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  useEffect(() => { if (user) router.replace('/') }, [user, router])

  // ── Step 1 유효성 ──────────────────────────────────

  function validateStep1(): boolean {
    const e: Record<string, string> = {}
    if (!isValidEmail(email))           e.email    = '올바른 이메일 형식이 아니에요.'
    if (password.length < 8)            e.password = '비밀번호는 8자 이상이어야 해요.'
    if (confirm !== password)           e.confirm  = '비밀번호가 일치하지 않아요.'
    if (nickname.trim().length < 2)     e.nickname = '닉네임은 2자 이상이어야 해요.'
    if (!agreed)                        e.agreed   = '이용약관에 동의해주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault()
    if (validateStep1()) setStep(2)
  }

  // ── Step 2 제출 ───────────────────────────────────

  async function handleSubmit(skip = false) {
    setLoading(true)
    const supabase = createSupabaseAuth()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname.trim(),
          user_type: skip ? '일반' : userType || '일반',
          interests: skip ? [] : interests,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        setStep(1)
        setErrors({ email: '이미 가입된 이메일이에요. 로그인해주세요.' })
      } else {
        setErrors({ form: error.message })
      }
      return
    }

    if (data.session) {
      router.push('/')
      router.refresh()
    } else {
      setDone(true)
    }
  }

  const strength = getStrength(password)
  const pwMatch = confirm.length > 0 && confirm === password

  // ── 완료 화면 ────────────────────────────────────

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm card p-8 flex flex-col gap-5 items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: '#e8f4f3', color: 'var(--action)' }}>✉</div>
        <div>
          <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>이메일을 확인해주세요</p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--text)' }}>{email}</strong>으로<br />
            인증 링크를 보냈어요. 링크 클릭 후 로그인해주세요.
          </p>
          <p className="text-xs mt-3" style={{ color: 'var(--muted2)' }}>메일이 안 보이면 스팸함도 확인해보세요.</p>
        </div>
        <Link href="/login" className="btn-primary w-full text-center">로그인 페이지로</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm flex flex-col gap-7">

        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-[0.18em]" style={{ color: 'var(--brand)' }}>PARO</Link>
          {/* 스텝 표시 */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2].map(n => (
              <div key={n} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: n <= step ? 'var(--action)' : 'var(--surface2)',
                    color: n <= step ? '#fff' : 'var(--muted2)'
                  }}>{n}</div>
                {n < 2 && <div className="w-8 h-px" style={{ background: step > n ? 'var(--action)' : 'var(--border)' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="card p-8 flex flex-col gap-5">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>계정 만들기</h1>

            <form onSubmit={handleNextStep} className="flex flex-col gap-4" noValidate>
              {/* 이메일 */}
              <Field label="이메일" error={errors.email}>
                <input type="email" value={email}
                  onChange={e => { setEmail(e.target.value); clearErr('email') }}
                  onBlur={() => !isValidEmail(email) && email && setErrors(p => ({ ...p, email: '올바른 이메일 형식이 아니에요.' }))}
                  placeholder="hello@example.com" autoFocus autoComplete="email"
                  style={errors.email ? { borderColor: 'var(--highlight)' } : {}} />
              </Field>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>비밀번호</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); clearErr('password') }}
                    onBlur={() => password && password.length < 8 && setErrors(p => ({ ...p, password: '비밀번호는 8자 이상이어야 해요.' }))}
                    placeholder="8자 이상 (영문+숫자 권장)" autoComplete="new-password"
                    style={{ paddingRight: '42px', ...(errors.password ? { borderColor: 'var(--highlight)' } : {}) }} />
                  <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                {/* 강도 바 */}
                {password.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all"
                          style={{ background: i < strength.score ? strength.color : 'var(--border)' }} />
                      ))}
                    </div>
                    {strength.label && <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>}
                  </div>
                )}
                {errors.password && <p className="text-xs" style={{ color: 'var(--highlight)' }}>{errors.password}</p>}
              </div>

              {/* 비밀번호 확인 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>비밀번호 확인</label>
                <div className="relative">
                  <input type={showCf ? 'text' : 'password'} value={confirm}
                    onChange={e => { setConfirm(e.target.value); clearErr('confirm') }}
                    onBlur={() => confirm && confirm !== password && setErrors(p => ({ ...p, confirm: '비밀번호가 일치하지 않아요.' }))}
                    placeholder="비밀번호 재입력" autoComplete="new-password"
                    style={{ paddingRight: '42px', ...(errors.confirm ? { borderColor: 'var(--highlight)' } : {}) }} />
                  <button type="button" onClick={() => setShowCf(p => !p)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }}>
                    <EyeIcon open={showCf} />
                  </button>
                  {pwMatch && (
                    <span className="absolute right-9 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: '#16a34a' }}>✓</span>
                  )}
                </div>
                {errors.confirm && <p className="text-xs" style={{ color: 'var(--highlight)' }}>{errors.confirm}</p>}
              </div>

              {/* 닉네임 */}
              <Field label="닉네임" error={errors.nickname}>
                <input type="text" value={nickname}
                  onChange={e => { setNickname(e.target.value); clearErr('nickname') }}
                  onBlur={() => nickname.trim().length < 2 && nickname && setErrors(p => ({ ...p, nickname: '닉네임은 2자 이상이어야 해요.' }))}
                  placeholder="활동 닉네임 (2~20자)" maxLength={20}
                  style={errors.nickname ? { borderColor: 'var(--highlight)' } : {}} />
              </Field>

              {/* 약관 */}
              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); clearErr('agreed') }}
                    className="mt-0.5" style={{ width: '15px', height: '15px', accentColor: 'var(--action)', flexShrink: 0 }} />
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--action)', fontWeight: 600 }}>이용약관</span> 및{' '}
                    <span style={{ color: 'var(--action)', fontWeight: 600 }}>개인정보처리방침</span>에 동의합니다 (필수)
                  </span>
                </label>
                {errors.agreed && <p className="text-xs ml-6" style={{ color: 'var(--highlight)' }}>{errors.agreed}</p>}
              </div>

              <button type="submit" className="btn-primary w-full">
                다음 →
              </button>
            </form>

            <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="font-semibold" style={{ color: 'var(--action)' }}>로그인</Link>
            </p>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="card p-8 flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>PARO를 어떻게 활용하실 건가요?</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>나에게 맞는 콘텐츠를 추천해드릴게요.</p>
            </div>

            {/* 유형 선택 */}
            <div className="flex flex-col gap-2">
              {USER_TYPES.map(t => (
                <button key={t.key} type="button"
                  onClick={() => setUserType(t.key)}
                  className="flex items-start gap-3 p-3.5 rounded-xl text-left transition-all"
                  style={{
                    background: userType === t.key ? '#e8f4f3' : 'var(--surface2)',
                    border: `1.5px solid ${userType === t.key ? 'var(--action)' : 'transparent'}`,
                  }}>
                  <span className="text-lg shrink-0">{t.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: userType === t.key ? 'var(--action)' : 'var(--text)' }}>
                      {t.key}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{t.desc}</p>
                  </div>
                  {userType === t.key && (
                    <span className="ml-auto shrink-0 text-sm font-bold" style={{ color: 'var(--action)' }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* 관심 국악 요소 */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>관심 국악 요소 (선택)</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(item => {
                  const selected = interests.includes(item)
                  return (
                    <button key={item} type="button"
                      className={`tag ${selected ? 'active' : ''}`}
                      onClick={() => setInterests(p => selected ? p.filter(i => i !== item) : [...p, item])}>
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>

            {errors.form && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                style={{ background: '#fef2ee', color: 'var(--highlight)', border: '1px solid #f5c9bc' }}>
                ⚠ {errors.form}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button className="btn-primary w-full" onClick={() => handleSubmit(false)}
                disabled={loading || !userType} style={{ opacity: loading || !userType ? 0.65 : 1 }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                    처리 중...
                  </span>
                ) : '시작하기'}
              </button>
              <button className="text-sm text-center py-1" style={{ color: 'var(--muted2)' }}
                onClick={() => handleSubmit(true)} disabled={loading}>
                건너뛰기
              </button>
            </div>
          </div>
        )}

        <Link href="/" className="text-xs text-center" style={{ color: 'var(--muted2)' }}>← 홈으로</Link>
      </div>
    </div>
  )

  function clearErr(key: string) { setErrors(p => ({ ...p, [key]: '' })) }
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
