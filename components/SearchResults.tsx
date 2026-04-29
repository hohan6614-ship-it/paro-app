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
    <p className="text-xs mt-2 px-2.5 py-1 rounded-full inline-block" style={{ background: '#eef0f8', color: 'var(--accent)' }}>
      ✦ {reason}
    </p>
  )
}

function Thumb({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center" style={{ background: bg }}>
      {children}
    </div>
  )
}

function TrackCard({ item, tags }: { item: Track; tags: string[] }) {
  const router = useRouter()
  const reason = buildMatchReason(keywordsToFilters(tags), item)
  return (
    <button className="card p-4 text-left w-full" onClick={() => router.push(`/track/${item.id}`)}>
      <div className="flex gap-3 items-start">
        <Thumb bg="linear-gradient(135deg,#dde8f0,#ccc0d8)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a7a9a" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </Thumb>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{item.title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {(item.artist as Artist)?.name ?? '—'} · {formatDuration(item.duration_sec)}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.instruments.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
            {item.emotion.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <MatchReason reason={reason} />
        </div>
        <p className="text-sm font-bold shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>{formatPrice(item.price)}</p>
      </div>
    </button>
  )
}

function ArtistCard({ item, tags }: { item: Artist; tags: string[] }) {
  const router = useRouter()
  const reason = buildMatchReason(keywordsToFilters(tags), item)
  return (
    <button className="card p-4 text-left w-full" onClick={() => router.push(`/artist/${item.id}`)}>
      <div className="flex gap-3 items-start">
        <Thumb bg="linear-gradient(135deg,#edf5f0,#c8e0d0)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a6b4a" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="10" cy="8" r="4"/><path d="M2 21C2 17.134 5.582 14 10 14"/>
            <circle cx="18" cy="8" r="2.5" opacity="0.5"/><path d="M21 21C21 19 20 17.5 18 17" opacity="0.5"/>
          </svg>
        </Thumb>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm">{item.name}</p>
            {item.collab_open && <span className="tag active text-xs">의뢰가능</span>}
          </div>
          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--muted)' }}>{item.bio}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.instruments.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <MatchReason reason={reason} />
        </div>
      </div>
    </button>
  )
}

function SamplePackCard({ item, tags }: { item: SamplePack; tags: string[] }) {
  const router = useRouter()
  const reason = buildMatchReason(keywordsToFilters(tags), item)
  return (
    <button className="card p-4 text-left w-full" onClick={() => router.push(`/sample-pack/${item.id}`)}>
      <div className="flex gap-3 items-start">
        <Thumb bg="linear-gradient(135deg,#f0e8d8,#e0c8a0)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5e2a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </Thumb>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{item.title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {(item.artist as Artist)?.name ?? '—'} · {item.file_count}개 파일
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.instruments.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <MatchReason reason={reason} />
        </div>
        <p className="text-sm font-bold shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>{formatPrice(item.price)}</p>
      </div>
    </button>
  )
}

function CommissionCard({ item, tags }: { item: CommissionItem; tags: string[] }) {
  const router = useRouter()
  const reason = buildMatchReason(keywordsToFilters(tags), item)
  return (
    <button className="card p-4 text-left w-full" onClick={() => router.push(`/commission/${item.id}`)}>
      <div className="flex gap-3 items-start">
        <Thumb bg="linear-gradient(135deg,#f0eef8,#d8d0ec)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a3a9a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </Thumb>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{item.title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {(item.artist as Artist)?.name ?? '—'} · {item.delivery_days}일 납기
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.purpose.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <MatchReason reason={reason} />
        </div>
        <p className="text-sm font-bold shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>
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
