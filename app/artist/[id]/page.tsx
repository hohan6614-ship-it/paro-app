import { MOCK_ARTISTS, MOCK_TRACKS, MOCK_COMMISSION_ITEMS } from '@/lib/mockData'
import { supabase } from '@/lib/supabase'
import type { Artist, Track, CommissionItem } from '@/lib/database.types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArtistActions from '@/components/ArtistActions'

// ── 데이터 패치 ────────────────────────────────────────

async function getArtist(id: string): Promise<Artist | null> {
  try {
    const { data } = await supabase.from('artists').select('*').eq('id', id).single()
    if (data) return data as Artist
  } catch {}
  return MOCK_ARTISTS.find(a => a.id === id) ?? null
}

async function getArtistTracks(artistId: string): Promise<Track[]> {
  try {
    const { data } = await supabase.from('tracks').select('*').eq('artist_id', artistId).order('created_at', { ascending: false })
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

// ── 헬퍼 ───────────────────────────────────────────────

const AVATAR_PALETTE = [
  { bg: '#FEF4E4', color: '#8A5A2B' },  // 황
  { bg: '#E6F4F2', color: '#1E7C73' },  // 청
  { bg: '#FBEEE9', color: '#C45532' },  // 적
  { bg: '#EDECE8', color: '#3D3530' },  // 흑
]

function getAvatarColors(name: string) {
  const code = name.charCodeAt(0) ?? 0
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length]
}

function detectPortfolioLabel(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('soundcloud.com')) return 'SoundCloud'
  if (url.includes('instagram.com')) return 'Instagram'
  if (url.includes('vimeo.com')) return 'Vimeo'
  return '포트폴리오'
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// ── 페이지 ─────────────────────────────────────────────

export default async function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [artist, tracks, commissions] = await Promise.all([
    getArtist(id),
    getArtistTracks(id),
    getArtistCommissions(id),
  ])
  if (!artist) notFound()

  const avatarColors = getAvatarColors(artist.name)
  const primaryTags = [...artist.instruments, ...artist.vocal_type].slice(0, 4)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">

      {/* 뒤로가기 */}
      <Link href="/search" className="text-sm w-fit" style={{ color: 'var(--muted)' }}>
        ← 탐색으로 돌아가기
      </Link>

      {/* ── 프로필 헤더 ── */}
      <div className="card p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            {/* 아바타 */}
            {artist.profile_image ? (
              <img
                src={artist.profile_image}
                alt={artist.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0"
                style={{ background: avatarColors.bg, color: avatarColors.color }}
              >
                {artist.name[0]}
              </div>
            )}

            {/* 이름 · 분야 · 소개 */}
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: 'var(--muted2)' }}>아티스트</p>
                <h1 className="text-2xl font-black leading-tight" style={{ color: 'var(--text)' }}>
                  {artist.name}
                </h1>
              </div>

              {/* 주요 분야 태그 */}
              {primaryTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {primaryTags.map(t => (
                    <span key={t} className="tag" style={{ fontSize: '0.7rem' }}>{t}</span>
                  ))}
                </div>
              )}

              {/* 지역 */}
              {artist.region.length > 0 && (
                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {artist.region.join(' · ')}
                </p>
              )}
            </div>
          </div>

          {/* 저장 + 문의 버튼 */}
          <ArtistActions
            artistId={artist.id}
            collabOpen={artist.collab_open}
            hasCommission={commissions.length > 0}
          />
        </div>

        {/* 소개 */}
        {artist.bio && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            {artist.bio}
          </p>
        )}

        {/* 협업 상태 배지 */}
        <div className="flex flex-wrap gap-2">
          {artist.collab_open ? (
            <>
              <StatusBadge color="action" label="협업 가능" />
              {commissions.length > 0 && <StatusBadge color="gold" label="의뢰 가능" />}
            </>
          ) : (
            <StatusBadge color="muted" label="현재 불가" />
          )}
          {artist.trade_type.map(t => (
            <span key={t} className="tag" style={{ fontSize: '0.68rem' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── 태그 상세 ── */}
      <div className="card p-6 flex flex-col gap-3.5">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted2)' }}>
          음악 스타일
        </p>
        <TagRow label="악기"    values={artist.instruments} />
        <TagRow label="성악"    values={artist.vocal_type} />
        <TagRow label="장단"    values={artist.jangdan} />
        <TagRow label="정서"    values={artist.emotion} />
        <TagRow label="음색"    values={artist.timbre} />
        <TagRow label="장르"    values={artist.genre_blend} />
        <TagRow label="라이선스" values={artist.license_scope} />
      </div>

      {/* ── 포트폴리오 링크 ── */}
      {artist.portfolio_url && (
        <div className="card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--surface2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {detectPortfolioLabel(artist.portfolio_url)}
              </p>
              <p className="text-xs truncate max-w-[200px]" style={{ color: 'var(--muted2)' }}>
                {artist.portfolio_url}
              </p>
            </div>
          </div>
          <a
            href={artist.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs px-4 py-2"
          >
            방문하기 ↗
          </a>
        </div>
      )}

      {/* ── 대표 작업 ── */}
      {tracks.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
              대표 작업 <span className="font-normal text-sm" style={{ color: 'var(--muted)' }}>({tracks.length})</span>
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {tracks.map(track => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}

      {/* ── 의뢰 메뉴 ── */}
      {commissions.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
            의뢰 메뉴 <span className="font-normal text-sm" style={{ color: 'var(--muted)' }}>({commissions.length})</span>
          </h2>
          <div className="flex flex-col gap-2">
            {commissions.map(c => (
              <CommissionCard key={c.id} item={c} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

// ── 서브 컴포넌트 ──────────────────────────────────────

function StatusBadge({ color, label }: { color: 'action' | 'gold' | 'muted'; label: string }) {
  const styles = {
    action: { background: '#e8f4f3', color: 'var(--action)',    border: '1px solid #b8deda' },
    gold:   { background: '#fef4e4', color: 'var(--brand)',     border: '1px solid #e8d0a0' },
    muted:  { background: 'var(--surface2)', color: 'var(--muted2)', border: '1px solid var(--border)' },
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={styles[color]}>
      <span className="w-1.5 h-1.5 rounded-full"
        style={{ background: color === 'action' ? 'var(--action)' : color === 'gold' ? 'var(--brand)' : 'var(--muted2)' }} />
      {label}
    </span>
  )
}

function TagRow({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs w-14 shrink-0 mt-0.5" style={{ color: 'var(--muted2)' }}>{label}</span>
      <div className="flex flex-wrap gap-1">
        {values.map(v => <span key={v} className="tag">{v}</span>)}
      </div>
    </div>
  )
}

function TrackCard({ track }: { track: Track }) {
  const previewTags = [...track.emotion, ...track.purpose].slice(0, 3)
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg"
        style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>♩</div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{track.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {track.instruments.slice(0, 2).map(t => (
            <span key={t} className="tag" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{t}</span>
          ))}
          {previewTags.map(t => (
            <span key={t} className="text-xs" style={{ color: 'var(--muted2)' }}>{t}</span>
          ))}
          {track.duration_sec && (
            <span className="text-xs ml-auto shrink-0" style={{ color: 'var(--muted2)' }}>
              {formatDuration(track.duration_sec)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <p className="text-sm font-bold" style={{ color: 'var(--action)' }}>
          {track.price ? `₩${track.price.toLocaleString()}` : '문의'}
        </p>
        <Link href={`/track/${track.id}`}
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
          style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          상세보기
        </Link>
      </div>
    </div>
  )
}

function CommissionCard({ item }: { item: CommissionItem }) {
  return (
    <Link href={`/commission/${item.id}`} className="card p-4 flex items-center gap-4 block group">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: '#FEF4E4', color: '#8A5A2B' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {item.delivery_days ? `납기 ${item.delivery_days}일` : '납기 협의'}{' '}
          {item.purpose.slice(0, 2).join(' · ')}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold" style={{ color: 'var(--brand)' }}>
          {item.price_from ? `₩${item.price_from.toLocaleString()}~` : '견적 문의'}
        </p>
        <p className="text-xs mt-0.5 group-hover:underline" style={{ color: 'var(--muted2)' }}>자세히 →</p>
      </div>
    </Link>
  )
}
