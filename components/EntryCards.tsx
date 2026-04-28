'use client'
import { useRouter } from 'next/navigation'

function IconTarget() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="14" cy="14" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="14" cy="14" r="2" fill="currentColor"/>
      <line x1="14" y1="3" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="22" x2="14" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="3" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="14" x2="25" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconWave() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M2 14 C4 8, 6 8, 8 14 C10 20, 12 20, 14 14 C16 8, 18 8, 20 14 C22 20, 24 20, 26 14"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 19 C4 16, 6 16, 8 19"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4"/>
      <path d="M20 19 C22 16, 24 16, 26 19"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4"/>
    </svg>
  )
}

function IconPerson() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 24C4 19.582 8.477 16 14 16C19.523 16 24 19.582 24 24"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="21" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5"/>
      <path d="M24 14C25.5 14.8 26.5 16.3 26.5 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5"/>
    </svg>
  )
}

function IconCompass() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="14" cy="14" r="1.8" fill="currentColor"/>
      {/* 북동 화살표 */}
      <path d="M14 14 L18.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 9.5 L18.5 9.5 L18.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 남서 꼬리 */}
      <path d="M14 14 L9.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
    </svg>
  )
}

const entries = [
  {
    title: '목적부터 찾기',
    desc: '영상, 게임, 공연, 광고 등\n용도에 맞는 소리를 찾아요',
    Icon: IconTarget,
    href: '/search?axis=purpose',
  },
  {
    title: '소리·분위기로 찾기',
    desc: '악기, 정서, 장단으로\n원하는 느낌을 탐색해요',
    Icon: IconWave,
    href: '/search?axis=sound',
  },
  {
    title: '아티스트부터 찾기',
    desc: '작곡가, 연주자, 보컬 등\n직접 아티스트를 만나요',
    Icon: IconPerson,
    href: '/search?tab=artist',
  },
  {
    title: '그냥 둘러보기',
    desc: '큐레이션된 추천 컬렉션으로\n영감을 찾아요',
    Icon: IconCompass,
    href: '/search?tab=all',
  },
]

export default function EntryCards() {
  const router = useRouter()
  return (
    <section>
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--muted)' }}>어떻게 찾고 싶으세요?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {entries.map(e => (
          <button
            key={e.title}
            onClick={() => router.push(e.href)}
            className="card p-6 text-left flex flex-col gap-4 hover:cursor-pointer group"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'var(--surface2)', color: 'var(--accent)' }}
            >
              <e.Icon />
            </div>
            <div>
              <p className="font-bold text-base">{e.title}</p>
              <p className="text-xs mt-1 whitespace-pre-line leading-relaxed" style={{ color: 'var(--muted)' }}>{e.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
