import SearchBar from '@/components/SearchBar'
import EntryCards from '@/components/EntryCards'
import CollectionSection from '@/components/CollectionSection'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
      <section className="flex flex-col items-center gap-6 text-center">
        <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
          국악 크리에이티브 마켓
        </p>
        <h1 className="text-4xl md:text-6xl font-black leading-tight">
          국악의 소리로<br />당신의 작품을 완성하세요
        </h1>
        <p className="text-lg max-w-xl" style={{ color: 'var(--muted)' }}>
          영상, 게임, 광고, 공연 — 어떤 창작에도 어울리는 국악 아티스트와 음원을 찾아보세요.
        </p>
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>
      </section>

      <EntryCards />
      <CollectionSection />
    </div>
  )
}
