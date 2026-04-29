import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Collection } from '@/lib/database.types'

async function getCollections(): Promise<Collection[]> {
  const { data } = await supabase.from('collections').select('*').order('sort_order')
  return (data ?? []) as Collection[]
}

const FALLBACK: Collection[] = [
  { id: 'e1000000-0000-0000-0000-000000000001', title: '몽환적인 해금 사운드', description: '안개처럼 스며드는 해금의 울림. 영상·전시·게임 배경음으로 제격.', cover_image: null, sort_order: 1, created_at: '' },
  { id: 'e2000000-0000-0000-0000-000000000002', title: '신명나는 타악 기반 국악', description: '장구·북·꽹과리가 만드는 폭발적 에너지. 광고·숏폼 필수 소스.', cover_image: null, sort_order: 2, created_at: '' },
  { id: 'e3000000-0000-0000-0000-000000000003', title: '전자음악과 어울리는 국악', description: 'EDM·힙합·앰비언트 프로덕션에 레이어할 수 있는 국악 텍스처 모음.', cover_image: null, sort_order: 3, created_at: '' },
  { id: 'e4000000-0000-0000-0000-000000000004', title: '장엄한 오프닝 국악', description: '가야금·거문고·대금이 만드는 서사적 스케일. 타이틀 시퀀스에 최적.', cover_image: null, sort_order: 4, created_at: '' },
]

const VISUALS = [
  {
    bg: 'linear-gradient(135deg, #c9d8e8 0%, #b8c8dc 50%, #ccc0d8 100%)',
    tag: '해금 · 몽환',
    tagBg: 'rgba(255,255,255,0.55)',
    tagColor: '#3a5a7a',
    Pattern: () => (
      <svg width="100%" height="100%" viewBox="0 0 280 140" preserveAspectRatio="xMidYMid slice">
        <path d="M0 70 C28 42,56 42,84 70 C112 98,140 98,168 70 C196 42,224 42,252 70 C266 84,274 91,280 94" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <path d="M0 82 C28 58,56 58,84 82 C112 106,140 106,168 82 C196 58,224 58,252 82" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
        <path d="M0 58 C28 30,56 30,84 58 C112 86,140 86,168 58 C196 30,224 30,252 58" stroke="white" strokeWidth="0.8" fill="none" opacity="0.25"/>
        <line x1="210" y1="24" x2="244" y2="116" stroke="white" strokeWidth="1.8" opacity="0.35" strokeLinecap="round"/>
        <ellipse cx="226" cy="70" rx="7" ry="22" stroke="white" strokeWidth="1" fill="none" opacity="0.3" transform="rotate(-15 226 70)"/>
      </svg>
    ),
  },
  {
    bg: 'linear-gradient(135deg, #f0d4a0 0%, #e8c080 50%, #e0b060 100%)',
    tag: '타악 · 신명',
    tagBg: 'rgba(255,255,255,0.55)',
    tagColor: '#7a4a10',
    Pattern: () => (
      <svg width="100%" height="100%" viewBox="0 0 280 140" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="100" cy="70" rx="22" ry="34" stroke="white" strokeWidth="1.5" fill="none" opacity="0.45"/>
        <ellipse cx="150" cy="70" rx="22" ry="34" stroke="white" strokeWidth="1.5" fill="none" opacity="0.45"/>
        <line x1="122" y1="50" x2="128" y2="50" stroke="white" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
        <line x1="122" y1="90" x2="128" y2="90" stroke="white" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
        <circle cx="100" cy="70" r="30" stroke="white" strokeWidth="0.8" fill="none" opacity="0.25"/>
        <circle cx="100" cy="70" r="42" stroke="white" strokeWidth="0.5" fill="none" opacity="0.15"/>
        <circle cx="150" cy="70" r="30" stroke="white" strokeWidth="0.8" fill="none" opacity="0.25"/>
        <circle cx="38" cy="50" r="4" fill="white" opacity="0.3"/>
        <circle cx="50" cy="70" r="2.5" fill="white" opacity="0.2"/>
        <circle cx="38" cy="90" r="4" fill="white" opacity="0.3"/>
        <circle cx="214" cy="48" r="4" fill="white" opacity="0.3"/>
        <circle cx="202" cy="70" r="2.5" fill="white" opacity="0.2"/>
        <circle cx="214" cy="92" r="4" fill="white" opacity="0.3"/>
      </svg>
    ),
  },
  {
    bg: 'linear-gradient(135deg, #b8d8c8 0%, #a0c8b4 50%, #90bca4 100%)',
    tag: '일렉트로닉',
    tagBg: 'rgba(255,255,255,0.55)',
    tagColor: '#1a5a40',
    Pattern: () => (
      <svg width="100%" height="100%" viewBox="0 0 280 140" preserveAspectRatio="xMidYMid slice">
        {[0,56,112,168,224,280].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="140" stroke="white" strokeWidth="0.5" opacity="0.2"/>
        ))}
        {[0,35,70,105,140].map(y => (
          <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="white" strokeWidth="0.5" opacity="0.2"/>
        ))}
        <polyline points="0,70 28,70 28,38 56,38 56,70 84,70 84,100 112,100 112,50 140,50 140,70 168,70 168,32 196,32 196,70 224,70 224,94 252,94 252,70 280,70"
          stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
        <circle cx="56" cy="70" r="4" fill="white" opacity="0.55"/>
        <circle cx="140" cy="70" r="4" fill="white" opacity="0.55"/>
        <circle cx="196" cy="32" r="3" fill="white" opacity="0.5"/>
        <circle cx="112" cy="50" r="3" fill="white" opacity="0.5"/>
      </svg>
    ),
  },
  {
    bg: 'linear-gradient(135deg, #d8c8a8 0%, #cbb890 50%, #bea878 100%)',
    tag: '가야금 · 장엄',
    tagBg: 'rgba(255,255,255,0.55)',
    tagColor: '#5a3a10',
    Pattern: () => (
      <svg width="100%" height="100%" viewBox="0 0 280 140" preserveAspectRatio="xMidYMid slice">
        <path d="M16 25 Q140 12 264 25 L264 115 Q140 128 16 115 Z" stroke="white" strokeWidth="1" fill="none" opacity="0.2"/>
        {[30,46,62,78,94,110,126,142,158,174,190].map((x, i) => (
          <line key={x} x1={x} y1="18" x2={x + (i%2===0?4:-4)} y2="122" stroke="white" strokeWidth="0.9" opacity="0.35"/>
        ))}
        {[52, 84, 116, 148].map(x => (
          <path key={x} d={`M${x} 62 L${x-5} 78 L${x+5} 78 Z`} fill="white" opacity="0.3"/>
        ))}
        <path d="M200 35 C220 28,240 35,255 52" stroke="white" strokeWidth="1.8" fill="none" opacity="0.4" strokeLinecap="round"/>
        <path d="M204 55 C224 48,244 55,259 72" stroke="white" strokeWidth="1.4" fill="none" opacity="0.3" strokeLinecap="round"/>
        <path d="M200 75 C220 68,240 75,255 92" stroke="white" strokeWidth="1" fill="none" opacity="0.2" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default async function CollectionSection() {
  let collections: Collection[] = []
  try { collections = await getCollections() } catch { collections = [] }
  if (!collections.length) collections = FALLBACK

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>추천 컬렉션</h2>
        <Link href="/search" className="text-sm font-medium transition-colors" style={{ color: 'var(--muted)' }}>
          전체 보기 →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((col, i) => {
          const v = VISUALS[i % VISUALS.length]
          const { Pattern } = v
          return (
            <Link key={col.id} href={`/search?collection=${col.id}`} className="card flex flex-col group block">
              <div className="relative h-40 overflow-hidden" style={{ background: v.bg }}>
                <div className="absolute inset-0"><Pattern /></div>
                <span className="absolute bottom-3 left-4 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: v.tagBg, color: v.tagColor, backdropFilter: 'blur(6px)' }}>
                  {v.tag}
                </span>
              </div>
              <div className="p-5">
                <p className="font-bold text-base">{col.title}</p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{col.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
