import FilterPanel from '@/components/FilterPanel'
import SearchResults from '@/components/SearchResults'

interface Props {
  searchParams: Promise<{ tags?: string; tab?: string; axis?: string; collection?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const tags = params.tags ? params.tags.split(',').filter(Boolean) : []
  const tab = params.tab ?? 'all'
  const axis = params.axis ?? ''

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">탐색</h1>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>검색 태그:</span>
            {tags.map(t => <span key={t} className="tag active">{t}</span>)}
          </div>
        )}
      </div>

      <div className="flex gap-8 items-start">
        <FilterPanel activeTags={tags} axis={axis} />
        <div className="flex-1 min-w-0">
          <SearchResults tags={tags} tab={tab} />
        </div>
      </div>
    </div>
  )
}
