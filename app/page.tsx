import SearchBar from '@/components/SearchBar'
import EntryCards from '@/components/EntryCards'
import CollectionSection from '@/components/CollectionSection'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* 배경 — 매우 연한 파동 SVG */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(160deg, #f0ede4 0%, #F8F4EC 55%, #edf4f3 100%)' }} />
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 520">
          <path d="M0 260 C150 200,300 200,450 260 C600 320,750 320,900 260 C1050 200,1150 210,1200 240" stroke="#1E7C73" strokeWidth="1" fill="none" opacity="0.08"/>
          <path d="M0 300 C150 240,300 240,450 300 C600 360,750 360,900 300 C1050 240,1150 250,1200 280" stroke="#1E7C73" strokeWidth="0.7" fill="none" opacity="0.05"/>
          <path d="M0 220 C150 165,300 165,450 220 C600 275,750 275,900 220 C1050 165,1150 175,1200 200" stroke="#8A5A2B" strokeWidth="0.6" fill="none" opacity="0.06"/>
          <circle cx="1100" cy="80" r="180" fill="#D6A23A" opacity="0.04"/>
          <circle cx="80"   cy="420" r="140" fill="#1E7C73" opacity="0.04"/>
        </svg>

        <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col items-center gap-7 text-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(30,124,115,0.09)', color: 'var(--action)' }}>
            국악 × 크리에이티브 마켓
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            국악의 소리로<br />
            <span style={{ color: 'var(--brand)' }}>당신의 작품</span>을<br />
            완성하세요
          </h1>
          <p className="text-base md:text-lg max-w-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            영상·게임·광고·공연 — 모든 창작에 어울리는<br />국악 아티스트와 음원을 탐색하세요
          </p>
          <div className="w-full max-w-2xl mt-2">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 flex flex-col gap-20 w-full">
        <EntryCards />
        <CollectionSection />
      </div>
    </div>
  )
}
