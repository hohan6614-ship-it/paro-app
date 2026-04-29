import SearchBar from '@/components/SearchBar'
import EntryCards from '@/components/EntryCards'
import CollectionSection from '@/components/CollectionSection'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-12">

      {/* ── Hero ── */}
      <section className="relative rounded-3xl overflow-hidden" style={{ minHeight: '260px' }}>

        {/* 메시 그라디언트 배경 */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 55% 60% at 90% 10%,  rgba(214,162,58,0.28)  0%, transparent 65%),
            radial-gradient(ellipse 50% 55% at 5%  85%,  rgba(30,124,115,0.22)  0%, transparent 60%),
            radial-gradient(ellipse 40% 45% at 50% 110%, rgba(196,85,50,0.12)   0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 15% 10%,  rgba(214,162,58,0.10)  0%, transparent 60%),
            #F8F4EC
          `
        }} />

        {/* 그리드 오버레이 — 아주 연하게 */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(30,26,22,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,26,22,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* 콘텐츠 */}
        <div className="relative px-8 pt-9 pb-9 flex flex-col gap-5">

          {/* 오방색 닷 + 뱃지 */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {['#2A2622','#C45532','#D6A23A','#F0EAD6','#1E7C73'].map((c, i) => (
                <span key={i} className="block rounded-full border"
                  style={{ width:'9px', height:'9px', background: c, borderColor:'rgba(0,0,0,0.1)' }} />
              ))}
            </div>
            <span className="text-xs font-bold tracking-[0.12em] uppercase"
              style={{ color: 'var(--action)' }}>
              국악 × 크리에이티브 마켓
            </span>
          </div>

          {/* 헤드라인 */}
          <div>
            <h1 className="text-3xl md:text-[2.5rem] font-black leading-[1.2] tracking-tight">
              국악의 소리로{' '}
              <span className="relative whitespace-nowrap">
                <span style={{
                  background: 'linear-gradient(135deg, var(--brand) 0%, var(--gold) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>당신의 작품</span>
              </span>
              을{' '}
              <span style={{ color: 'var(--action)' }}>완성</span>하세요
            </h1>
            <p className="text-sm mt-2.5 leading-relaxed max-w-xl" style={{ color: 'var(--muted)' }}>
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
