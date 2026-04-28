import { MOCK_TRACKS } from '@/lib/mockData'
import { supabase } from '@/lib/supabase'
import type { Track, Artist } from '@/lib/database.types'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getTrack(id: string): Promise<Track | null> {
  try {
    const { data } = await supabase.from('tracks').select('*, artist:artists(*)').eq('id', id).single()
    if (data) return data as unknown as Track
  } catch {}
  return MOCK_TRACKS.find(t => t.id === id) ?? null
}

export default async function TrackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const track = await getTrack(id)
  if (!track) notFound()

  const artist = track.artist as Artist | undefined

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <Link href="/search" className="text-sm" style={{ color: 'var(--muted)' }}>← 탐색으로 돌아가기</Link>

      <div className="flex gap-6 items-start">
        <div className="w-32 h-32 rounded-xl flex items-center justify-center text-5xl shrink-0"
          style={{ background: 'var(--surface2)' }}>♩</div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>트랙</p>
          <h1 className="text-3xl font-black">{track.title}</h1>
          {artist && (
            <Link href={`/artist/${artist.id}`} className="text-sm mt-1 inline-block hover:underline" style={{ color: 'var(--muted)' }}>
              {artist.name}
            </Link>
          )}
          <p className="mt-3" style={{ color: 'var(--muted)' }}>{track.description}</p>
        </div>
      </div>

      {/* 태그 */}
      <div className="card p-6 flex flex-col gap-4">
        <TagRow label="악기" values={track.instruments} />
        <TagRow label="정서" values={track.emotion} />
        <TagRow label="목적" values={track.purpose} />
        <TagRow label="장단" values={track.jangdan} />
        <TagRow label="음색" values={track.timbre} />
        <TagRow label="장르" values={track.genre_blend} />
        <TagRow label="라이선스" values={track.license_scope} />
      </div>

      {/* 구매 */}
      <div className="card p-6 flex items-center justify-between">
        <div>
          <p className="text-2xl font-black" style={{ color: 'var(--accent)' }}>
            {track.price ? `₩${track.price.toLocaleString()}` : '가격 문의'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {track.trade_type.join(' · ')} 포함
          </p>
        </div>
        <div className="flex gap-3">
          {track.collab_open && artist && (
            <Link href={`/commission/${artist.id}`} className="btn-outline">의뢰하기</Link>
          )}
          <button className="btn-primary">구매하기</button>
        </div>
      </div>
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
