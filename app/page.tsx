import SearchBar from '@/components/SearchBar'
import EntryCards from '@/components/EntryCards'
import CollectionSection from '@/components/CollectionSection'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-12">

      {/* ── Hero ── */}
      <section className="relative rounded-2xl overflow-hidden" style={{ background: '#F8F4EC' }}>

        {/* 오방색 컬러 블록 — 상단 스트라이프 */}
        <div className="flex h-1.5 w-full">
          <div className="flex-1" style={{ background: '#D6A23A' }} /> {/* 황 */}
          <div className="flex-1" style={{ background: '#1E7C73' }} /> {/* 청 */}
          <div className="flex-1" style={{ background: '#F8F4EC' }} /> {/* 백 */}
          <div className="flex-1" style={{ background: '#C45532' }} /> {/* 적 */}
          <div className="flex-1" style={{ background: '#2A2622' }} /> {/* 흑 */}
        </div>

        {/* 배경 색면 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 우측 상단 — 황 원 */}
          <div className="absolute" style={{
            top: '-60px', right: '-60px',
            width: '280px', height: '280px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(214,162,58,0.18) 0%, transparent 70%)',
          }} />
          {/* 좌측 하단 — 청 원 */}
          <div className="absolute" style={{
            bottom: '-40px', left: '-40px',
            width: '220px', height: '220px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(30,124,115,0.14) 0%, transparent 70%)',
          }} />
          {/* 소리 파동 */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 900 280">
            <path d="M0 140 C100 100,200 100,300 140 C400 180,500 180,600 140 C700 100,800 110,900 125"
              stroke="#1E7C73" strokeWidth="1.2" fill="none" opacity="0.1"/>
            <path d="M0 165 C100 128,200 128,300 165 C400 202,500 202,600 165 C700 128,800 138,900 150"
              stroke="#D6A23A" strokeWidth="0.8" fill="none" opacity="0.1"/>
          </svg>
        </div>

        {/* 콘텐츠 */}
        <div className="relative px-8 pt-8 pb-9 flex flex-col gap-5">

          {/* 오방색 닷 뱃지 */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {['#D6A23A','#1E7C73','#F8F4EC','#C45532','#2A2622'].map((c, i) => (
                <span key={i} className="inline-block w-2.5 h-2.5 rounded-full border"
                  style={{ background: c, borderColor: 'rgba(0,0,0,0.08)' }} />
              ))}
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--action)' }}>
              국악 × 크리에이티브 마켓
            </span>
          </div>

          {/* 타이틀 */}
          <div>
            <h1 className="font-serif text-3xl md:text-[2.6rem] font-black leading-tight tracking-tight">
              국악의 소리로&nbsp;
              <span className="relative inline-block">
                <span style={{ color: 'var(--brand)' }}>당신의 작품</span>
                {/* 황 언더라인 */}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 rounded-full"
                  style={{ background: 'var(--gold)' }} />
              </span>
              을 완성하세요
            </h1>
            <p className="text-sm mt-2.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
              영상·게임·광고·공연 — 모든 창작에 어울리는 국악 아티스트와 음원을 탐색하세요
            </p>
          </div>

          <SearchBar />
        </div>
      </section>

      <EntryCards />
      <CollectionSection />

    </div>
  )
}
