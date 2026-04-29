'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SEARCH_SUGGESTIONS } from '@/lib/search'

export default function SearchBar() {
  const [input, setInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(word: string) {
    const t = word.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault()
      if (input.trim()) addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length) setTags(prev => prev.slice(0, -1))
  }

  function handleSearch() {
    const all = input.trim() ? [...tags, input.trim()] : tags
    router.push(all.length ? `/search?tags=${encodeURIComponent(all.join(','))}` : '/search')
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl cursor-text transition-shadow"
        style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <span key={tag} className="tag active flex items-center gap-1">
            {tag}
            <button onClick={e => { e.stopPropagation(); setTags(p => p.filter(t => t !== tag)) }}
              className="ml-0.5 opacity-70 hover:opacity-100 text-xs leading-none">×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length ? '' : '해금, 몽환, 영상BGM... (스페이스·엔터로 태그 추가)'}
          className="flex-1 min-w-[160px] border-none outline-none text-sm bg-transparent p-1"
          style={{ color: 'var(--text)', boxShadow: 'none' }}
        />
        <button onClick={handleSearch} className="btn-primary shrink-0 text-sm px-5 py-2">
          검색
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center items-center">
        <span className="text-xs mr-1" style={{ color: 'var(--muted2)' }}>추천 태그</span>
        {SEARCH_SUGGESTIONS.map(s => (
          <button key={s} className="tag" onClick={() => addTag(s)}>{s}</button>
        ))}
      </div>
    </div>
  )
}
