import { MOCK_COMMISSION_ITEMS } from '@/lib/mockData'
import { supabase } from '@/lib/supabase'
import type { CommissionItem, Artist } from '@/lib/database.types'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getCommission(id: string): Promise<CommissionItem | null> {
  try {
    const { data } = await supabase.from('commission_items').select('*, artist:artists(*)').eq('id', id).single()
    if (data) return data as unknown as CommissionItem
  } catch {}
  return MOCK_COMMISSION_ITEMS.find(c => c.id === id) ?? null
}

export default async function CommissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getCommission(id)
  if (!item) notFound()

  const artist = item.artist as Artist | undefined

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <Link href="/search" className="text-sm" style={{ color: 'var(--muted)' }}>← 탐색으로 돌아가기</Link>

      <div className="flex gap-6 items-start">
        <div className="w-28 h-28 rounded-xl flex items-center justify-center text-5xl shrink-0"
          style={{ background: 'var(--surface2)' }}>✍️</div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>의뢰 상품</p>
          <h1 className="text-3xl font-black">{item.title}</h1>
          {artist && (
            <Link href={`/artist/${artist.id}`} className="text-sm mt-1 inline-block hover:underline" style={{ color: 'var(--muted)' }}>
              {artist.name}
            </Link>
          )}
          <p className="mt-3" style={{ color: 'var(--muted)' }}>{item.description}</p>
        </div>
      </div>

      {/* 스펙 */}
      <div className="card p-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>시작 금액</p>
          <p className="text-2xl font-black mt-1" style={{ color: 'var(--accent)' }}>
            {item.price_from ? `₩${item.price_from.toLocaleString()}~` : '문의'}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>작업 기간</p>
          <p className="text-2xl font-black mt-1">{item.delivery_days}일</p>
        </div>
      </div>

      {/* 태그 */}
      <div className="card p-6 flex flex-col gap-4">
        <TagRow label="악기" values={item.instruments} />
        <TagRow label="발성" values={item.vocal_type} />
        <TagRow label="정서" values={item.emotion} />
        <TagRow label="목적" values={item.purpose} />
        <TagRow label="장르" values={item.genre_blend} />
        <TagRow label="라이선스" values={item.license_scope} />
      </div>

      <Link href={`/commission/${id}/request`} className="btn-primary text-center text-lg py-4">
        의뢰 신청하기
      </Link>
    </div>
  )
}

function TagRow({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 shrink-0" style={{ color: 'var(--muted)' }}>{label}</span>
      <div className="flex flex-wrap gap-1">
        {values.map(v => <span key={v} className="tag">{v}</span>)}
      </div>
    </div>
  )
}
