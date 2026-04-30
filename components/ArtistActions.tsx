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

  function handleSave() {
    if (!user) { openAuthModal('save'); return }
    setSaved(p => !p)
    // 다음 스프린트: Supabase bookmarks 테이블 연동
  }

  function handleContact() {
    if (!user) { openAuthModal('contact'); return }
    router.push(hasCommission ? `/commission/${artistId}/request` : '/search?tab=commission')
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleSave}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
        style={{
          background: saved ? '#fbeee9' : 'var(--surface)',
          color: saved ? 'var(--highlight)' : 'var(--muted)',
          border: `1px solid ${saved ? '#f5c9bc' : 'var(--border)'}`,
        }}>
        <HeartIcon filled={saved} />
        <span className="hidden sm:inline">저장</span>
      </button>

      {collabOpen && (
        <button onClick={handleContact} className="btn-primary text-sm px-5 py-2">
          문의하기
        </button>
      )}
    </div>
  )
}
