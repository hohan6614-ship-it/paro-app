'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth()
  const router = useRouter()

  if (!authModalOpen) return null

  function goLogin() {
    closeAuthModal()
    router.push('/login')
  }

  function goSignup() {
    closeAuthModal()
    router.push('/signup')
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(30,26,22,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={closeAuthModal}
    >
      <div
        className="card flex flex-col gap-5 p-8 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1.5">
          <p className="text-lg font-black" style={{ color: 'var(--text)' }}>로그인이 필요해요</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            이 기능은 로그인 후 이용할 수 있어요.<br />
            PARO 계정이 없다면 무료로 가입해보세요.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button className="btn-primary w-full" onClick={goLogin}>로그인</button>
          <button className="btn-outline w-full" onClick={goSignup}>회원가입</button>
        </div>

        <button
          className="text-xs text-center"
          style={{ color: 'var(--muted2)' }}
          onClick={closeAuthModal}
        >
          닫기
        </button>
      </div>
    </div>
  )
}
