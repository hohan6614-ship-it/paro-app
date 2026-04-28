import { MOCK_ARTISTS, MOCK_TRACKS, MOCK_COMMISSION_ITEMS } from '@/lib/mockData'
import { supabase } from '@/lib/supabase'
import type { Artist, Track, CommissionItem } from '@/lib/database.types'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getArtist(id: string): Promise<Artist | null> {
  try {
    const { data } = await supabase.from('artists').select('*').eq('id', id).single()
    if (data) return data as Artist
  } catch {}
  return MOCK_ARTISTS.find(a => a.id === id) ?? null
}

async function getArtistTracks(artistId: string): Promise<Track[]> {
  try {
    const { data } = await supabase.from('tracks').select('*').eq('artist_id', artistId)
    if (data?.length) return data as Track[]
  } catch {}
  return MOCK_TRACKS.filter(t => t.artist_id === artistId)
}

async function getArtistCommissions(artistId: string): Promise<CommissionItem[]> {
  try {
    const { data } = await supabase.from('commission_items').select('*').eq('artist_id', artistId)
    if (data?.length) return data as CommissionItem[]
  } catch {}
  return MOCK_COMMISSION_ITEMS.filter(c => c.artist_id === artistId)
}

export default async function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [artist, tracks, commissions] = await Promise.all([
    getArtist(id),
    getArtistTracks(id),
    getArtistCommissions(id),
  ])
  if (!artist) notFound()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <Link href="/search" className="text-sm" style={{ color: 'var(--muted)' }}>← 탐색으로 돌아가기</Link>

      <div className="flex gap-6 items-start">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shrink-0"
          style={{ background: 'var(--surface2)' }}>🎵</div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>아티스트</p>
          <h1 className="text-3xl font-black">{artist.name}</h1>
          <p className="mt-2" style={{ color: 'var(--muted)' }}>{artist.bio}</p>
          {artist.collab_open && (
            <span className="tag active mt-3 inline-block">의뢰 수락 중</span>
          )}
        </div>
      </div>

      <div className="card p-6 flex flex-col gap-3">
        <TagRow label="악기" values={artist.instruments} />
        <TagRow label="발성" values={artist.vocal_type} />
        <TagRow label="정서" values={artist.emotion} />
        <TagRow label="목적" values={artist.purpose} />
        <TagRow label="장르" values={artist.genre_blend} />
      </div>

      {tracks.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">트랙 ({tracks.length})</h2>
          <div className="flex flex-col gap-2">
            {tracks.map(t => (
              <Link key={t.id} href={`/track/${t.id}`} className="card p-4 flex items-center gap-4 block">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: 'var(--surface2)' }}>♩</div>
                <div className="flex-1">
                  <p className="font-bold">{t.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    {[...t.instruments, ...t.emotion].slice(0, 4).join(' · ')}
                  </p>
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  {t.price ? `₩${t.price.toLocaleString()}` : '문의'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {commissions.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">의뢰 메뉴</h2>
          <div className="flex flex-col gap-2">
            {commissions.map(c => (
              <Link key={c.id} href={`/commission/${c.id}`} className="card p-4 flex items-center gap-4 block">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: 'var(--surface2)' }}>✍️</div>
                <div className="flex-1">
                  <p className="font-bold">{c.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>납기 {c.delivery_days}일</p>
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  {c.price_from ? `₩${c.price_from.toLocaleString()}~` : '문의'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
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
