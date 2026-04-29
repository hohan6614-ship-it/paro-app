'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

interface Props {
  price: number | null
  tradeType: string[]
  collabOpen: boolean
  artistId?: string
}

export default function TrackActions({ price, tradeType, collabOpen, artistId }: Props) {
  const { user, openAuthModal } = useAuth()

  function handlePurchase() {
    if (!user) { openAuthModal(); return }
    // TODO: 결제 연동
    alert('결제 기능은 준비 중이에요.')
  }

  return (
    <div className="card p-6 flex items-center justify-between">
      <div>
        <p className="text-2xl font-black" style={{ color: 'var(--action)' }}>
          {price ? `₩${price.toLocaleString()}` : '가격 문의'}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          {tradeType.join(' · ')} 포함
        </p>
      </div>
      <div className="flex gap-3">
        {collabOpen && artistId && (
          user
            ? <Link href={`/commission/${artistId}`} className="btn-outline">의뢰하기</Link>
            : <button className="btn-outline" onClick={openAuthModal}>의뢰하기</button>
        )}
        <button className="btn-primary" onClick={handlePurchase}>구매하기</button>
      </div>
    </div>
  )
}
