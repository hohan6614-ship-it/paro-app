'use client'
import { useRouter } from 'next/navigation'
import { useAuth, type AuthModalContext } from '@/context/AuthContext'

const CONTENT: Record<AuthModalContext, { title: string; desc: string }> = {
  save: {
    title: '저장하려면 로그인이 필요해요',
    desc: '로그인하면 마음에 드는 음악과 아티스트를\n저장함에서 언제든 다시 볼 수 있어요.',
  },
  contact: {
    title: '문의하려면 로그인이 필요해요',
    desc: '로그인하면 아티스트에게 직접 문의하고\n의뢰를 진행할 수 있어요.',
  },
  general: {
    title: '로그인이 필요해요',
    desc: '이 기능은 로그인 후 이용할 수 있어요.\nPARO 계정이 없다면 무료로 가입해보세요.',
  },
}

export default function AuthModal() {
  const { authModalOpen, authModalCtx, closeAuthModal } = useAuth()
  const router = useRouter()

  if (!authModalOpen) return null

  const content = CONTENT[authModalCtx]

  function go(path: string) {
    closeAuthModal()
    router.push(path)
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(30,26,22,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={closeAuthModal}
    >
      <div
        className="w-full sm:max-w-sm mx-0 sm:mx-4 flex flex-col gap-6 p-7 sm:rounded-2xl rounded-t-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: '#e8f4f3', color: 'var(--action)' }}>
            {authModalCtx === 'save' ? '♡' : authModalCtx === 'contact' ? '✉' : '🔐'}
          </div>
          <div>
            <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>{content.title}</p>
            <p className="text-sm mt-1.5 leading-relaxed whitespace-pre-line" style={{ color: 'var(--muted)' }}>
              {content.desc}
            </p>
          </div>
        </div>

        {/* 버튼 3개 */}
        <div className="flex flex-col gap-2">
          <button className="btn-primary w-full" onClick={() => go('/login')}>
            로그인하기
          </button>
          <button className="btn-outline w-full" onClick={() => go('/signup')}>
            회원가입하기
          </button>
          <button
            className="text-sm text-center py-2"
            style={{ color: 'var(--muted2)' }}
            onClick={closeAuthModal}
          >
            계속 둘러보기
          </button>
        </div>
      </div>
    </div>
  )
}
