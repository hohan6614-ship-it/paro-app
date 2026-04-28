import { supabase } from './supabase'
import type { TagFilters, Track, Artist, SamplePack, CommissionItem } from './database.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyQuery = any

// 같은 축 내 → OR (overlaps), 다른 축 간 → AND
function applyTagFilters(query: AnyQuery, filters: TagFilters): AnyQuery {
  if (filters.instruments?.length)   query = query.overlaps('instruments', filters.instruments)
  if (filters.vocal_type?.length)    query = query.overlaps('vocal_type', filters.vocal_type)
  if (filters.jangdan?.length)       query = query.overlaps('jangdan', filters.jangdan)
  if (filters.emotion?.length)       query = query.overlaps('emotion', filters.emotion)
  if (filters.region?.length)        query = query.overlaps('region', filters.region)
  if (filters.timbre?.length)        query = query.overlaps('timbre', filters.timbre)
  if (filters.purpose?.length)       query = query.overlaps('purpose', filters.purpose)
  if (filters.genre_blend?.length)   query = query.overlaps('genre_blend', filters.genre_blend)
  if (filters.trade_type?.length)    query = query.overlaps('trade_type', filters.trade_type)
  if (filters.license_scope?.length) query = query.overlaps('license_scope', filters.license_scope)
  return query
}

export async function searchTracks(filters: TagFilters): Promise<Track[]> {
  const base = supabase.from('tracks').select('*, artist:artists(*)').order('created_at', { ascending: false })
  const { data, error } = await applyTagFilters(base, filters)
  if (error) throw error
  return (data ?? []) as unknown as Track[]
}

export async function searchArtists(filters: TagFilters): Promise<Artist[]> {
  const base = supabase.from('artists').select('*').order('created_at', { ascending: false })
  const { data, error } = await applyTagFilters(base, filters)
  if (error) throw error
  return (data ?? []) as Artist[]
}

export async function searchSamplePacks(filters: TagFilters): Promise<SamplePack[]> {
  const base = supabase.from('sample_packs').select('*, artist:artists(*)').order('created_at', { ascending: false })
  const { data, error } = await applyTagFilters(base, filters)
  if (error) throw error
  return (data ?? []) as unknown as SamplePack[]
}

export async function searchCommissionItems(filters: TagFilters): Promise<CommissionItem[]> {
  const base = supabase.from('commission_items').select('*, artist:artists(*)').order('created_at', { ascending: false })
  const { data, error } = await applyTagFilters(base, filters)
  if (error) throw error
  return (data ?? []) as unknown as CommissionItem[]
}

export function buildMatchReason(filters: TagFilters, item: Track | SamplePack | CommissionItem | Artist): string {
  const matched: string[] = []
  if (filters.instruments?.length) {
    const overlap = filters.instruments.filter(t => (item.instruments ?? []).includes(t))
    if (overlap.length) matched.push(overlap.join(' + '))
  }
  if (filters.emotion?.length) {
    const overlap = filters.emotion.filter(t => (item.emotion ?? []).includes(t))
    if (overlap.length) matched.push(overlap.join(' + '))
  }
  if (filters.purpose?.length) {
    const overlap = filters.purpose.filter(t => (item.purpose ?? []).includes(t))
    if (overlap.length) matched.push(overlap.join(' + '))
  }
  if (filters.jangdan?.length) {
    const overlap = filters.jangdan.filter(t => (item.jangdan ?? []).includes(t))
    if (overlap.length) matched.push(overlap.join(' + '))
  }
  if (!matched.length) return ''
  return `${matched.join(' · ')} 조건과 일치합니다`
}

// 태그 키워드 → TagFilters 변환
const INSTRUMENT_KEYWORDS = ['가야금', '해금', '대금', '소금', '단소', '거문고', '장구', '북', '징', '꽹과리', '판소리']
const EMOTION_KEYWORDS = ['한', '흥', '신명', '몽환', '비장함', '해학', '고요함']
const PURPOSE_KEYWORDS = ['영상BGM', '광고', '게임', '공연', '전시', '런웨이', '숏폼']
const JANGDAN_KEYWORDS = ['굿거리', '자진모리', '세마치', '중중모리']
const GENRE_KEYWORDS = ['K-POP', '힙합', 'EDM', '앰비언트', '재즈', '영화음악']

export function keywordsToFilters(keywords: string[]): TagFilters {
  const filters: TagFilters = {}
  const instruments = keywords.filter(k => INSTRUMENT_KEYWORDS.includes(k))
  const emotion = keywords.filter(k => EMOTION_KEYWORDS.includes(k))
  const purpose = keywords.filter(k => PURPOSE_KEYWORDS.includes(k))
  const jangdan = keywords.filter(k => JANGDAN_KEYWORDS.includes(k))
  const genre_blend = keywords.filter(k => GENRE_KEYWORDS.includes(k))
  if (instruments.length) filters.instruments = instruments
  if (emotion.length) filters.emotion = emotion
  if (purpose.length) filters.purpose = purpose
  if (jangdan.length) filters.jangdan = jangdan
  if (genre_blend.length) filters.genre_blend = genre_blend
  return filters
}

export const ALL_TAG_OPTIONS = {
  instruments: ['가야금', '해금', '대금', '소금', '단소', '거문고', '장구', '북', '징', '꽹과리'],
  vocal_type:  ['판소리', '민요', '정가', '무속'],
  jangdan:     ['굿거리', '자진모리', '세마치', '중중모리'],
  emotion:     ['한', '흥', '신명', '몽환', '비장함', '해학', '고요함'],
  region:      ['경기', '남도', '서도', '동부', '제주'],
  timbre:      ['맑은', '거친', '깊은', '몽환적', '타격감'],
  purpose:     ['영상BGM', '광고', '게임', '공연', '전시', '런웨이', '숏폼'],
  genre_blend: ['K-POP', '힙합', 'EDM', '앰비언트', '재즈', '영화음악'],
  trade_type:  ['음원', '악보', '샘플팩', '스템', '의뢰'],
  license_scope: ['개인', '상업', '방송', '광고', '게임'],
}

export const SEARCH_SUGGESTIONS = [
  '해금', '장구', '몽환', '신명', '영상BGM', '게임', '광고', '힙합', '앰비언트', '판소리',
]
