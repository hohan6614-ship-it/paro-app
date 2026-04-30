'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface Props {
  artistId: string
  collabOpen: boolean
  hasCommission: boolean
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

export default function ArtistActions({ artistId, collabOpen, hasCommission }: Props) {
  const { user, openAuthModal } = useAuth()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [saveHint, setSaveHint] = useState(false)

  function handleSave() {
    if (!user) {
      setSaveHint(true)
      setTimeout(() => setSaveHint(false), 2500)
      return
    }
    setSaved(p => !p)
    // 다음 스프린트: Supabase bookmarks 테이블 연동
  }

  function handleContact() {
    if (!user) { openAuthModal(); return }
    if (hasCommission) {
      router.push(`/commission/${artistId}/request`)
    } else {
      router.push(`/search?tab=commission`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* 저장 버튼 */}
      <div className="relative">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: saved ? '#fbeee9' : 'var(--surface)',
            color: saved ? 'var(--highlight)' : 'var(--muted)',
            border: `1px solid ${saved ? '#f5c9bc' : 'var(--border)'}`,
          }}
        >
          <HeartIcon filled={saved} />
          <span className="hidden sm:inline">저장</span>
        </button>
        {saveHint && (
          <div className="absolute top-full mt-2 right-0 whitespace-nowrap text-xs px-3 py-1.5 rounded-lg z-10"
            style={{ background: 'var(--text)', color: '#fff' }}>
            로그인 후 이용 가능해요
            <div className="absolute -top-1 right-3 w-2 h-2 rotate-45"
              style={{ background: 'var(--text)' }} />
          </div>
        )}
      </div>

      {/* 문의하기 버튼 */}
      {collabOpen && (
        <button onClick={handleContact} className="btn-primary text-sm px-5 py-2">
          문의하기
        </button>
      )}
    </div>
  )
}
