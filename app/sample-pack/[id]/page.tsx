import { MOCK_SAMPLE_PACKS } from '@/lib/mockData'
import { supabase } from '@/lib/supabase'
import type { SamplePack, Artist } from '@/lib/database.types'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getSamplePack(id: string): Promise<SamplePack | null> {
  try {
    const { data } = await supabase.from('sample_packs').select('*, artist:artists(*)').eq('id', id).single()
    if (data) return data as unknown as SamplePack
  } catch {}
  return MOCK_SAMPLE_PACKS.find(s => s.id === id) ?? null
}

export default async function SamplePackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pack = await getSamplePack(id)
  if (!pack) notFound()

  const artist = pack.artist as Artist | undefined

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <Link href="/search" className="text-sm" style={{ color: 'var(--muted)' }}>← 탐색으로 돌아가기</Link>

      <div className="flex gap-6 items-start">
        <div className="w-28 h-28 rounded-xl flex items-center justify-center text-5xl shrink-0"
          style={{ background: 'var(--surface2)' }}>📦</div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>샘플팩</p>
          <h1 className="text-3xl font-black">{pack.title}</h1>
          {artist && (
            <Link href={`/artist/${artist.id}`} className="text-sm mt-1 inline-block hover:underline" style={{ color: 'var(--muted)' }}>
              {artist.name}
            </Link>
          )}
          <p className="mt-3" style={{ color: 'var(--muted)' }}>{pack.description}</p>
        </div>
      </div>

      <div className="card p-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>가격</p>
          <p className="text-2xl font-black mt-1" style={{ color: 'var(--accent)' }}>
            {pack.price ? `₩${pack.price.toLocaleString()}` : '문의'}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>파일 수</p>
          <p className="text-2xl font-black mt-1">{pack.file_count}개</p>
        </div>
      </div>

      <div className="card p-6 flex flex-col gap-4">
        <TagRow label="악기" values={pack.instruments} />
        <TagRow label="정서" values={pack.emotion} />
        <TagRow label="목적" values={pack.purpose} />
        <TagRow label="장단" values={pack.jangdan} />
        <TagRow label="음색" values={pack.timbre} />
        <TagRow label="장르" values={pack.genre_blend} />
        <TagRow label="라이선스" values={pack.license_scope} />
      </div>

      <div className="card p-6 flex items-center justify-between">
        <p className="text-2xl font-black" style={{ color: 'var(--accent)' }}>
          {pack.price ? `₩${pack.price.toLocaleString()}` : '가격 문의'}
        </p>
        <button className="btn-primary">다운로드 구매</button>
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
