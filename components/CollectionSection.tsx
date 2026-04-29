import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Collection } from '@/lib/database.types'

async function getCollections(): Promise<Collection[]> {
  const { data } = await supabase.from('collections').select('*').order('sort_order')
  return (data ?? []) as Collection[]
}

const FALLBACK: Collection[] = [
  { id: 'e1000000-0000-0000-0000-000000000001', title: '몽환적인 해금 사운드', description: '안개처럼 스며드는 해금의 울림. 영상·전시·게임 배경음으로 제격인 컬렉션.', cover_image: null, sort_order: 1, created_at: '' },
  { id: 'e2000000-0000-0000-0000-000000000002', title: '신명나는 타악 기반 국악', description: '장구·북·꽹과리가 만드는 폭발적 에너지. 광고·숏폼·EDM 프로덕션 필수 소스.', cover_image: null, sort_order: 2, created_at: '' },
  { id: 'e3000000-0000-0000-0000-000000000003', title: '전자음악과 어울리는 국악 소스', description: 'EDM·힙합·앰비언트 프로덕션에 레이어할 수 있는 국악 텍스처·루프 모음.', cover_image: null, sort_order: 3, created_at: '' },
  { id: 'e4000000-0000-0000-0000-000000000004', title: '영상 오프닝에 어울리는 장엄한 국악', description: '가야금·거문고·대금이 만드는 서사적 스케일. 타이틀 시퀀스·예고편에 최적.', cover_image: null, sort_order: 4, created_at: '' },
]

// 각 컬렉션 성격에 맞는 그라디언트 + SVG 패턴
const VISUALS = [
  {
    // 몽환 해금 — 연한 청보라 안개
    gradient: 'linear-gradient(135deg, #dde8f0 0%, #c9d8e8 40%, #d4c8e0 100%)',
    label: '해금',
    labelColor: '#5a7a9a',
    Pattern: () => (
      <svg width="100%" height="100%" viewBox="0 0 200 112" preserveAspectRatio="xMidYMid slice">
        {/* 파형 곡선 여러 겹 */}
        <path d="M0 56 C20 30, 40 30, 60 56 C80 82, 100 82, 120 56 C140 30, 160 30, 180 56 C190 64, 196 68, 200 70" stroke="#8aaac4" strokeWidth="1.2" fill="none" opacity="0.6"/>
        <path d="M0 66 C20 44, 40 44, 60 66 C80 88, 100 88, 120 66 C140 44, 160 44, 180 66 C190 72, 196 76, 200 78" stroke="#9ab0c8" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <path d="M0 46 C20 22, 40 22, 60 46 C80 70, 100 70, 120 46 C140 22, 160 22, 180 46" stroke="#7090b0" strokeWidth="0.6" fill="none" opacity="0.3"/>
        {/* 활 긋는 선 */}
        <line x1="155" y1="20" x2="185" y2="92" stroke="#8aaac4" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
        <ellipse cx="168" cy="56" rx="6" ry="18" stroke="#8aaac4" strokeWidth="1" fill="none" opacity="0.4" transform="rotate(-15 168 56)"/>
      </svg>
    ),
  },
  {
    // 신명 타악 — 따뜻한 주황 에너지
    gradient: 'linear-gradient(135deg, #f5e8d0 0%, #f0d4a8 40%, #e8c48a 100%)',
    label: '타악',
    labelColor: '#9a6020',
    Pattern: () => (
      <svg width="100%" height="100%" viewBox="0 0 200 112" preserveAspectRatio="xMidYMid slice">
        {/* 장구 형태 */}
        <ellipse cx="80" cy="56" rx="18" ry="28" stroke="#c08040" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <ellipse cx="120" cy="56" rx="18" ry="28" stroke="#c08040" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <line x1="98" y1="40" x2="102" y2="40" stroke="#c08040" strokeWidth="2" opacity="0.6"/>
        <line x1="98" y1="72" x2="102" y2="72" stroke="#c08040" strokeWidth="2" opacity="0.6"/>
        {/* 타격 파동 */}
        <circle cx="80" cy="56" r="24" stroke="#d09050" strokeWidth="0.8" fill="none" opacity="0.3"/>
        <circle cx="80" cy="56" r="32" stroke="#d09050" strokeWidth="0.6" fill="none" opacity="0.2"/>
        <circle cx="120" cy="56" r="24" stroke="#d09050" strokeWidth="0.8" fill="none" opacity="0.3"/>
        {/* 리듬 점 */}
        <circle cx="30" cy="40" r="3" fill="#c08040" opacity="0.4"/>
        <circle cx="42" cy="56" r="2" fill="#c08040" opacity="0.3"/>
        <circle cx="30" cy="72" r="3" fill="#c08040" opacity="0.4"/>
        <circle cx="170" cy="38" r="3" fill="#c08040" opacity="0.4"/>
        <circle cx="158" cy="56" r="2" fill="#c08040" opacity="0.3"/>
        <circle cx="170" cy="74" r="3" fill="#c08040" opacity="0.4"/>
      </svg>
    ),
  },
  {
    // 전자 국악 — 네온 민트 + 그리드
    gradient: 'linear-gradient(135deg, #e0f0ec 0%, #cce8e0 40%, #c8e0d8 100%)',
    label: '일렉트로닉',
    labelColor: '#2a7a6a',
    Pattern: () => (
      <svg width="100%" height="100%" viewBox="0 0 200 112" preserveAspectRatio="xMidYMid slice">
        {/* 그리드 */}
        {[0,40,80,120,160,200].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="112" stroke="#4aaa90" strokeWidth="0.4" opacity="0.25"/>
        ))}
        {[0,28,56,84,112].map(y => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#4aaa90" strokeWidth="0.4" opacity="0.25"/>
        ))}
        {/* 디지털 파형 */}
        <polyline points="0,56 20,56 20,30 40,30 40,56 60,56 60,80 80,80 80,40 100,40 100,56 120,56 120,25 140,25 140,56 160,56 160,75 180,75 180,56 200,56"
          stroke="#3a9a80" strokeWidth="1.5" fill="none" opacity="0.7"/>
        {/* 노드 */}
        <circle cx="60" cy="56" r="3" fill="#3a9a80" opacity="0.6"/>
        <circle cx="120" cy="56" r="3" fill="#3a9a80" opacity="0.6"/>
        <circle cx="40" cy="30" r="2" fill="#3a9a80" opacity="0.5"/>
        <circle cx="140" cy="25" r="2" fill="#3a9a80" opacity="0.5"/>
      </svg>
    ),
  },
  {
    // 장엄한 국악 — 딥 버건디 + 금빛
    gradient: 'linear-gradient(135deg, #ede8e0 0%, #e4ddd0 40%, #ddd4c4 100%)',
    label: '오케스트라',
    labelColor: '#7a5030',
    Pattern: () => (
      <svg width="100%" height="100%" viewBox="0 0 200 112" preserveAspectRatio="xMidYMid slice">
        {/* 가야금 현 */}
        {[20,30,40,50,60,70,80,90,100,110,120,130].map((x, i) => (
          <line key={x} x1={x} y1="15" x2={x + (i % 2 === 0 ? 5 : -5)} y2="97"
            stroke="#b08040" strokeWidth="0.8" opacity="0.35"/>
        ))}
        {/* 안족 (기러기발) */}
        {[35, 55, 75, 95, 115].map(x => (
          <path key={x} d={`M${x} 50 L${x-4} 62 L${x+4} 62 Z`}
            fill="#a07030" opacity="0.4"/>
        ))}
        {/* 공명통 라인 */}
        <path d="M10 20 Q100 10 190 20 L190 92 Q100 102 10 92 Z"
          stroke="#b08040" strokeWidth="1.2" fill="none" opacity="0.25"/>
        {/* 오른쪽 오케스트라 선 */}
        <path d="M145 30 C160 25, 175 30, 185 45" stroke="#8a6028" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <path d="M148 45 C163 40, 178 45, 188 60" stroke="#8a6028" strokeWidth="1.2" fill="none" opacity="0.4"/>
        <path d="M145 60 C160 55, 175 60, 185 75" stroke="#8a6028" strokeWidth="1" fill="none" opacity="0.3"/>
      </svg>
    ),
  },
]

export default async function CollectionSection() {
  let collections: Collection[] = []
  try {
    collections = await getCollections()
  } catch {
    collections = []
  }
  if (!collections.length) collections = FALLBACK

  return (
    <section>
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--muted)' }}>추천 컬렉션</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((col, i) => {
          const visual = VISUALS[i % VISUALS.length]
          const { Pattern } = visual
          return (
            <Link key={col.id} href={`/search?collection=${col.id}`} className="card flex flex-col block group">
              {/* 썸네일 */}
              <div className="relative w-full h-36 overflow-hidden" style={{ background: visual.gradient }}>
                <div className="absolute inset-0">
                  <Pattern />
                </div>
                {/* 장르 레이블 */}
                <span
                  className="absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.6)', color: visual.labelColor, backdropFilter: 'blur(4px)' }}
                >
                  {visual.label}
                </span>
              </div>
              {/* 텍스트 */}
              <div className="p-5 flex flex-col gap-1">
                <p className="font-bold text-base">{col.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{col.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
