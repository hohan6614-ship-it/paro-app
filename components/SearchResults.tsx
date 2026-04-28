'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchTracks, searchArtists, searchSamplePacks, searchCommissionItems, keywordsToFilters, buildMatchReason } from '@/lib/search'
import type { Track, Artist, SamplePack, CommissionItem } from '@/lib/database.types'
import { MOCK_TRACKS, MOCK_ARTISTS, MOCK_SAMPLE_PACKS, MOCK_COMMISSION_ITEMS } from '@/lib/mockData'

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'track', label: '곡' },
  { key: 'artist', label: '아티스트' },
  { key: 'sample_pack', label: '샘플팩' },
  { key: 'commission', label: '의뢰' },
]

function formatPrice(n: number | null) {
  if (!n) return '문의'
  return `₩${n.toLocaleString()}`
}

function formatDuration(sec: number | null) {
  if (!sec) return ''
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface Props { tags: string[]; tab: string }

export default function SearchResults({ tags, tab: initialTab }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState(initialTab)
  const [tracks, setTracks] = useState<Track[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [samplePacks, setSamplePacks] = useState<SamplePack[]>([])
  const [commissions, setCommissions] = useState<CommissionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const filters = keywordsToFilters(tags)

    Promise.allSettled([
      searchTracks(filters),
      searchArtists(filters),
      searchSamplePacks(filters),
      searchCommissionItems(filters),
    ]).then(([t, a, s, c]) => {
      // Supabase 실연결 전엔 mock 데이터 사용
      setTracks(t.status === 'fulfilled' && t.value.length ? t.value : filterMock(MOCK_TRACKS, filters))
      setArtists(a.status === 'fulfilled' && a.value.length ? a.value : filterMock(MOCK_ARTISTS, filters))
      setSamplePacks(s.status === 'fulfilled' && s.value.length ? s.value : filterMock(MOCK_SAMPLE_PACKS, filters))
      setCommissions(c.status === 'fulfilled' && c.value.length ? c.value : filterMock(MOCK_COMMISSION_ITEMS, filters))
      setLoading(false)
    })
  }, [tags])

  function switchTab(key: string) {
    setTab(key)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', key)
    router.replace(url.pathname + '?' + url.searchParams.toString())
  }

  const total = tracks.length + artists.length + samplePacks.length + commissions.length

  return (
    <div className="flex flex-col gap-6">
      {/* 탭 */}
      <div className="flex gap-1" style={{ borderBottom: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{
              color: tab === t.key ? 'var(--accent)' : 'var(--muted)',
              borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {t.label}
            {!loading && t.key === 'all' && <span className="ml-1 text-xs opacity-60">{total}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center" style={{ color: 'var(--muted)' }}>탐색 중...</div>
      ) : (
        <>
          {(tab === 'all' || tab === 'track') && tracks.length > 0 && (
            <ResultSection title="곡" count={tracks.length}>
              {tracks.map(item => <TrackCard key={item.id} item={item} tags={tags} />)}
            </ResultSection>
          )}
          {(tab === 'all' || tab === 'artist') && artists.length > 0 && (
            <ResultSection title="아티스트" count={artists.length}>
              {artists.map(item => <ArtistCard key={item.id} item={item} tags={tags} />)}
            </ResultSection>
          )}
          {(tab === 'all' || tab === 'sample_pack') && samplePacks.length > 0 && (
            <ResultSection title="샘플팩" count={samplePacks.length}>
              {samplePacks.map(item => <SamplePackCard key={item.id} item={item} tags={tags} />)}
            </ResultSection>
          )}
          {(tab === 'all' || tab === 'commission') && commissions.length > 0 && (
            <ResultSection title="의뢰" count={commissions.length}>
              {commissions.map(item => <CommissionCard key={item.id} item={item} tags={tags} />)}
            </ResultSection>
          )}
          {total === 0 && (
            <div className="py-20 text-center" style={{ color: 'var(--muted)' }}>
              일치하는 결과가 없습니다.<br />
              <span className="text-sm">다른 태그로 검색해보세요.</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ResultSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-bold mb-3" style={{ color: 'var(--muted)' }}>{title} <span className="font-normal">{count}건</span></p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

function MatchReason({ reason }: { reason: string }) {
  if (!reason) return null
  return (
    <p className="text-xs mt-2 px-2 py-1 rounded" style={{ background: 'var(--surface2)', color: 'var(--accent)' }}>
      ✦ {reason}
    </p>
  )
}

function TrackCard({ item, tags }: { item: Track; tags: string[] }) {
  const router = useRouter()
  const filters = keywordsToFilters(tags)
  const reason = buildMatchReason(filters, item)
  return (
    <button className="card p-4 text-left w-full" onClick={() => router.push(`/track/${item.id}`)}>
      <div className="flex gap-3 items-start">
        <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-2xl"
          style={{ background: 'var(--surface2)' }}>♩</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{item.title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {(item.artist as Artist)?.name ?? '—'} · {formatDuration(item.duration_sec)}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.instruments.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
            {item.emotion.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <MatchReason reason={reason} />
        </div>
        <p className="text-sm font-bold shrink-0" style={{ color: 'var(--accent)' }}>{formatPrice(item.price)}</p>
      </div>
    </button>
  )
}

function ArtistCard({ item, tags }: { item: Artist; tags: string[] }) {
  const router = useRouter()
  const filters = keywordsToFilters(tags)
  const reason = buildMatchReason(filters, item)
  return (
    <button className="card p-4 text-left w-full" onClick={() => router.push(`/artist/${item.id}`)}>
      <div className="flex gap-3 items-start">
        <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-xl"
          style={{ background: 'var(--surface2)' }}>🎵</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold">{item.name}</p>
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--muted)' }}>{item.bio}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.instruments.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <MatchReason reason={reason} />
        </div>
        {item.collab_open && (
          <span className="tag active text-xs shrink-0">의뢰가능</span>
        )}
      </div>
    </button>
  )
}

function SamplePackCard({ item, tags }: { item: SamplePack; tags: string[] }) {
  const router = useRouter()
  const filters = keywordsToFilters(tags)
  const reason = buildMatchReason(filters, item)
  return (
    <button className="card p-4 text-left w-full" onClick={() => router.push(`/sample-pack/${item.id}`)}>
      <div className="flex gap-3 items-start">
        <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-xl"
          style={{ background: 'var(--surface2)' }}>📦</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{item.title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {(item.artist as Artist)?.name ?? '—'} · {item.file_count}개 파일
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.instruments.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <MatchReason reason={reason} />
        </div>
        <p className="text-sm font-bold shrink-0" style={{ color: 'var(--accent)' }}>{formatPrice(item.price)}</p>
      </div>
    </button>
  )
}

function CommissionCard({ item, tags }: { item: CommissionItem; tags: string[] }) {
  const router = useRouter()
  const filters = keywordsToFilters(tags)
  const reason = buildMatchReason(filters, item)
  return (
    <button className="card p-4 text-left w-full" onClick={() => router.push(`/commission/${item.id}`)}>
      <div className="flex gap-3 items-start">
        <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-xl"
          style={{ background: 'var(--surface2)' }}>✍️</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{item.title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {(item.artist as Artist)?.name ?? '—'} · {item.delivery_days}일 납기
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.purpose.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <MatchReason reason={reason} />
        </div>
        <p className="text-sm font-bold shrink-0" style={{ color: 'var(--accent)' }}>
          {item.price_from ? `₩${item.price_from.toLocaleString()}~` : '문의'}
        </p>
      </div>
    </button>
  )
}

// Supabase 미연결 시 mock 필터링
function filterMock<T extends { instruments?: string[]; emotion?: string[]; purpose?: string[] }>(
  items: T[],
  filters: ReturnType<typeof keywordsToFilters>
): T[] {
  if (!Object.values(filters).some(v => v?.length)) return items
  return items.filter(item => {
    if (filters.instruments?.length && !filters.instruments.some(t => item.instruments?.includes(t))) return false
    if (filters.emotion?.length && !filters.emotion.some(t => item.emotion?.includes(t))) return false
    if (filters.purpose?.length && !filters.purpose.some(t => item.purpose?.includes(t))) return false
    return true
  })
}
