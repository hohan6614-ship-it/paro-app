import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Collection } from '@/lib/database.types'

async function getCollections(): Promise<Collection[]> {
  const { data } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order')
  return (data ?? []) as Collection[]
}

const FALLBACK: Collection[] = [
  { id: 'co1', title: '몽환적인 해금 사운드', description: '안개처럼 스며드는 해금의 울림. 영상·전시·게임 배경음으로 제격인 컬렉션.', cover_image: null, sort_order: 1, created_at: '' },
  { id: 'co2', title: '신명나는 타악 기반 국악', description: '장구·북·꽹과리가 만드는 폭발적 에너지. 광고·숏폼·EDM 프로덕션 필수 소스.', cover_image: null, sort_order: 2, created_at: '' },
  { id: 'co3', title: '전자음악과 어울리는 국악 소스', description: 'EDM·힙합·앰비언트 프로덕션에 레이어할 수 있는 국악 텍스처·루프 모음.', cover_image: null, sort_order: 3, created_at: '' },
  { id: 'co4', title: '영상 오프닝에 어울리는 장엄한 국악', description: '가야금·거문고·대금이 만드는 서사적 스케일. 타이틀 시퀀스·예고편에 최적.', cover_image: null, sort_order: 4, created_at: '' },
]

export default async function CollectionSection() {
  let collections: Collection[] = []
  try {
    collections = await getCollections()
  } catch {
    collections = []
  }
  if (!collections.length) collections = FALLBACK

  const BG_COLORS = ['#1e1a14', '#141e14', '#141419', '#1e1414']

  return (
    <section>
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--muted)' }}>추천 컬렉션</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((col, i) => (
          <Link key={col.id} href={`/search?collection=${col.id}`} className="card p-6 flex flex-col gap-2 block">
            <div
              className="w-full h-28 rounded-lg mb-3 flex items-center justify-center"
              style={{ background: BG_COLORS[i % BG_COLORS.length], border: '1px solid var(--border)' }}
            >
              <span className="text-4xl opacity-40">♩</span>
            </div>
            <p className="font-bold">{col.title}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{col.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
