'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { ALL_TAG_OPTIONS } from '@/lib/search'

const AXIS_LABELS: Record<string, string> = {
  instruments: '악기',
  vocal_type: '발성',
  jangdan: '장단',
  emotion: '정서',
  region: '지역',
  timbre: '음색',
  purpose: '목적',
  genre_blend: '장르',
  trade_type: '거래 유형',
  license_scope: '라이선스',
}

// purpose 진입 시 우선 노출, sound 진입 시 음색/정서 우선
const AXIS_ORDER_PURPOSE = ['purpose', 'genre_blend', 'instruments', 'emotion', 'timbre', 'jangdan', 'vocal_type', 'region', 'trade_type', 'license_scope']
const AXIS_ORDER_SOUND   = ['instruments', 'emotion', 'timbre', 'jangdan', 'vocal_type', 'region', 'purpose', 'genre_blend', 'trade_type', 'license_scope']
const AXIS_ORDER_DEFAULT = Object.keys(ALL_TAG_OPTIONS)

interface Props {
  activeTags: string[]
  axis: string
}

export default function FilterPanel({ activeTags, axis }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const order = axis === 'purpose' ? AXIS_ORDER_PURPOSE
              : axis === 'sound'   ? AXIS_ORDER_SOUND
              : AXIS_ORDER_DEFAULT

  function toggleTag(tag: string) {
    const current = searchParams.get('tags')?.split(',').filter(Boolean) ?? []
    const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
    const params = new URLSearchParams(searchParams.toString())
    if (next.length) params.set('tags', next.join(','))
    else params.delete('tags')
    router.push(`/search?${params.toString()}`)
  }

  return (
    <aside className="w-52 shrink-0 flex flex-col gap-5 sticky top-20">
      {order.map(key => {
        const options = ALL_TAG_OPTIONS[key as keyof typeof ALL_TAG_OPTIONS]
        return (
          <div key={key}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
              {AXIS_LABELS[key]}
            </p>
            <div className="flex flex-wrap gap-1">
              {options.map(opt => (
                <button
                  key={opt}
                  className={`tag ${activeTags.includes(opt) ? 'active' : ''}`}
                  onClick={() => toggleTag(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </aside>
  )
}
