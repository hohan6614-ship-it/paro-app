import SearchBar from '@/components/SearchBar'
import EntryCards from '@/components/EntryCards'
import CollectionSection from '@/components/CollectionSection'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-12">

      {/* Hero — 검색 + 타이틀 */}
      <section className="relative rounded-2xl overflow-hidden px-8 py-10" style={{ background: 'linear-gradient(135deg, #f5efe2 0%, #F8F4EC 60%, #edf4f3 100%)' }}>
        {/* 배경 파동 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 900 300">
          <path d="M0 150 C100 110,200 110,300 150 C400 190,500 190,600 150 C700 110,800 120,900 135" stroke="#1E7C73" strokeWidth="1" fill="none" opacity="0.07"/>
          <path d="M0 175 C100 138,200 138,300 175 C400 212,500 212,600 175 C700 138,800 148,900 160" stroke="#1E7C73" strokeWidth="0.6" fill="none" opacity="0.05"/>
          <circle cx="820" cy="50" r="120" fill="#D6A23A" opacity="0.05"/>
          <circle cx="60"  cy="260" r="100" fill="#1E7C73" opacity="0.04"/>
        </svg>

        <div className="relative flex flex-col gap-5">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(30,124,115,0.1)', color: 'var(--action)' }}>
              국악 × 크리에이티브 마켓
            </span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              국악의 소리로&nbsp;
              <span style={{ color: 'var(--brand)' }}>당신의 작품</span>을 완성하세요
            </h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
              영상·게임·광고·공연 — 모든 창작에 어울리는 국악 아티스트와 음원을 탐색하세요
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* 진입 카드 */}
      <EntryCards />

      {/* 추천 컬렉션 */}
      <CollectionSection />

    </div>
  )
}
