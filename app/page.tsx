import SearchBar from '@/components/SearchBar'
import EntryCards from '@/components/EntryCards'
import CollectionSection from '@/components/CollectionSection'

export default function Home() {
  return (
    <>
      {/* ── 전체 페이지 배경 — 오방색 그래픽 ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* 황 — 우상단 큰 원 */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '420px', height: '420px', borderRadius: '9999px',
          background: '#D6A23A', opacity: 0.13,
        }} />
        {/* 황 — 작은 보조 원 */}
        <div style={{
          position: 'absolute', top: '60px', right: '180px',
          width: '120px', height: '120px', borderRadius: '9999px',
          background: '#D6A23A', opacity: 0.09,
        }} />
        {/* 청 — 좌하단 큰 원 */}
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-80px',
          width: '380px', height: '380px', borderRadius: '9999px',
          background: '#1E7C73', opacity: 0.12,
        }} />
        {/* 청 — 중간 왼쪽 */}
        <div style={{
          position: 'absolute', top: '45%', left: '-40px',
          width: '160px', height: '160px', borderRadius: '9999px',
          background: '#1E7C73', opacity: 0.07,
        }} />
        {/* 적 — 우중단 포인트 */}
        <div style={{
          position: 'absolute', top: '38%', right: '-30px',
          width: '200px', height: '200px', borderRadius: '9999px',
          background: '#C45532', opacity: 0.08,
        }} />
        {/* 흑 — 하단 중앙 미세 */}
        <div style={{
          position: 'absolute', bottom: '5%', left: '42%',
          width: '140px', height: '140px', borderRadius: '9999px',
          background: '#2A2622', opacity: 0.04,
        }} />
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="relative max-w-6xl mx-auto px-6 py-8 flex flex-col gap-12" style={{ zIndex: 1 }}>

        {/* Hero */}
        <section className="flex flex-col gap-5 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {['#2A2622','#C45532','#D6A23A','#F0EAD6','#1E7C73'].map((c, i) => (
                <span key={i} className="block rounded-full border"
                  style={{ width:'8px', height:'8px', background: c, borderColor:'rgba(0,0,0,0.08)' }} />
              ))}
            </div>
            <span className="text-xs font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--muted)' }}>
              국악 × 크리에이티브 마켓
            </span>
          </div>

          <div>
            <h1 className="text-3xl md:text-[2.6rem] font-black leading-[1.2] tracking-tight" style={{ color: 'var(--text)' }}>
              국악의 소리로<br />
              <span style={{ color: 'var(--brand)' }}>당신의 작품</span>을 완성하세요
            </h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
              영상·게임·광고·공연 — 모든 창작에 어울리는 국악 아티스트와 음원
            </p>
          </div>

          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </section>

        <EntryCards />
        <CollectionSection />
      </div>
    </>
  )
}
