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
    const trimmed = word.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
    }
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault()
      if (input.trim()) addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  function handleSearch() {
    const allTags = input.trim() ? [...tags, input.trim()] : tags
    if (!allTags.length) {
      router.push('/search')
      return
    }
    router.push(`/search?tags=${encodeURIComponent(allTags.join(','))}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center gap-2 p-3 rounded-xl cursor-text"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <span key={tag} className="tag active flex items-center gap-1">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 opacity-70 hover:opacity-100 text-xs">×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length ? '' : '해금, 몽환, 영상BGM... (스페이스/엔터로 태그 추가)'}
          className="flex-1 min-w-[180px] bg-transparent border-none outline-none text-sm p-0"
          style={{ color: 'var(--text)' }}
        />
        <button onClick={handleSearch} className="btn-primary text-sm px-5 py-2 shrink-0">
          검색
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>추천:</span>
        {SEARCH_SUGGESTIONS.map(s => (
          <button key={s} className="tag" onClick={() => addTag(s)}>{s}</button>
        ))}
      </div>
    </div>
  )
}
