import SearchBar from '@/components/SearchBar'
import EntryCards from '@/components/EntryCards'
import CollectionSection from '@/components/CollectionSection'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(160deg, #eef0f8 0%, #f8f6f2 50%, #f3ede4 100%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(184,145,74,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(43,58,107,0.06) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col items-center gap-7 text-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(43,58,107,0.07)', color: 'var(--accent)' }}>
            국악 × 크리에이티브 마켓
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            국악의 소리로<br />
            <span style={{ color: 'var(--accent)' }}>당신의 작품</span>을<br />
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

      {/* 하단 섹션들 */}
      <div className="max-w-6xl mx-auto px-6 pb-20 flex flex-col gap-20 w-full">
        <EntryCards />
        <CollectionSection />
      </div>
    </div>
  )
}
