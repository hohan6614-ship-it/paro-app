'use client'
import { useRouter } from 'next/navigation'

function IconTarget() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <line x1="12" y1="3" x2="12" y2="5.5"/>
      <line x1="12" y1="18.5" x2="12" y2="21"/>
      <line x1="3" y1="12" x2="5.5" y2="12"/>
      <line x1="18.5" y1="12" x2="21" y2="12"/>
    </svg>
  )
}

function IconWave() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12 C4 6, 6 6, 8 12 C10 18, 12 18, 14 12 C16 6, 18 6, 20 12 C21 15, 22 16, 22 17"/>
      <path d="M2 17 C3.5 14.5, 5 14.5, 6.5 17" opacity="0.4"/>
    </svg>
  )
}

function IconPerson() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="10" cy="8" r="4"/>
      <path d="M2 21C2 17.134 5.582 14 10 14"/>
      <circle cx="18" cy="8" r="2.5" opacity="0.45"/>
      <path d="M21 21C21 18.8 19.7 17 18 17" opacity="0.45"/>
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )
}

const entries = [
  { title: '목적부터 찾기',      desc: '영상, 게임, 공연, 광고 등\n용도에 맞는 소리를 찾아요', Icon: IconTarget, href: '/search?axis=purpose', color: '#eef0f8', iconColor: '#2b3a6b' },
  { title: '소리·분위기로 찾기', desc: '악기, 정서, 장단으로\n원하는 느낌을 탐색해요',     Icon: IconWave,   href: '/search?axis=sound',   color: '#f3ede4', iconColor: '#8b5e2a' },
  { title: '아티스트부터 찾기',  desc: '작곡가, 연주자, 보컬 등\n직접 아티스트를 만나요',  Icon: IconPerson, href: '/search?tab=artist',   color: '#edf5f0', iconColor: '#2a6b4a' },
  { title: '그냥 둘러보기',      desc: '큐레이션된 추천 컬렉션으로\n영감을 찾아요',         Icon: IconGrid,   href: '/search?tab=all',     color: '#f5eef5', iconColor: '#6b2a6b' },
]

export default function EntryCards() {
  const router = useRouter()
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>어떻게 찾고 싶으세요?</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {entries.map(e => (
          <button key={e.title} onClick={() => router.push(e.href)}
            className="card p-5 text-left flex flex-col gap-4 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: e.color, color: e.iconColor }}>
              <e.Icon />
            </div>
            <div>
              <p className="font-bold text-sm leading-snug">{e.title}</p>
              <p className="text-xs mt-1.5 whitespace-pre-line leading-relaxed" style={{ color: 'var(--muted)' }}>{e.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
