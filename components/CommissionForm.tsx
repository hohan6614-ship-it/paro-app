'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ALL_TAG_OPTIONS } from '@/lib/search'

const PURPOSE_OPTIONS = ['영상BGM', '광고', '게임', '공연', '전시', '런웨이', '숏폼', '기타']
const MOOD_OPTIONS = ['한', '흥', '신명', '몽환', '비장함', '해학', '고요함']
const BUDGET_OPTIONS = ['30만원 미만', '30~100만원', '100~300만원', '300만원 이상', '협의']

export default function CommissionForm({ commissionId }: { commissionId: string }) {
  const router = useRouter()
  const [form, setForm] = useState({
    requester_name: '',
    requester_email: '',
    purpose: '',
    mood: [] as string[],
    reference_url: '',
    budget: '',
    deadline: '',
    license_scope: [] as string[],
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleArray(key: 'mood' | 'license_scope', val: string) {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    // 백엔드 미연결 — 1초 딜레이 후 완료 화면으로
    await new Promise(r => setTimeout(r, 1000))
    router.push('/commission/complete')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 기본 정보 */}
      <fieldset className="card p-6 flex flex-col gap-4">
        <legend className="text-sm font-bold mb-2">기본 정보</legend>
        <label className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>이름 *</span>
          <input required value={form.requester_name} onChange={e => set('requester_name', e.target.value)} placeholder="홍길동" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>이메일 *</span>
          <input required type="email" value={form.requester_email} onChange={e => set('requester_email', e.target.value)} placeholder="hello@example.com" />
        </label>
      </fieldset>

      {/* 용도 */}
      <fieldset className="card p-6 flex flex-col gap-3">
        <legend className="text-sm font-bold mb-2">용도 *</legend>
        <div className="flex flex-wrap gap-2">
          {PURPOSE_OPTIONS.map(opt => (
            <button key={opt} type="button"
              className={`tag ${form.purpose === opt ? 'active' : ''}`}
              onClick={() => set('purpose', opt)}>
              {opt}
            </button>
          ))}
        </div>
        {form.purpose === '기타' && (
          <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="용도를 직접 입력해주세요" />
        )}
      </fieldset>

      {/* 분위기 */}
      <fieldset className="card p-6 flex flex-col gap-3">
        <legend className="text-sm font-bold mb-2">원하는 분위기 (복수 선택)</legend>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map(opt => (
            <button key={opt} type="button"
              className={`tag ${form.mood.includes(opt) ? 'active' : ''}`}
              onClick={() => toggleArray('mood', opt)}>
              {opt}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 레퍼런스 & 예산 & 일정 */}
      <fieldset className="card p-6 flex flex-col gap-4">
        <legend className="text-sm font-bold mb-2">세부 정보</legend>
        <label className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>참고 레퍼런스 URL</span>
          <input value={form.reference_url} onChange={e => set('reference_url', e.target.value)} placeholder="https://youtu.be/..." />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>예산</span>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map(opt => (
              <button key={opt} type="button"
                className={`tag ${form.budget === opt ? 'active' : ''}`}
                onClick={() => set('budget', opt)}>
                {opt}
              </button>
            ))}
          </div>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>희망 납기일</span>
          <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
        </label>
      </fieldset>

      {/* 라이선스 */}
      <fieldset className="card p-6 flex flex-col gap-3">
        <legend className="text-sm font-bold mb-2">저작권 · 사용 범위 (복수 선택)</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_TAG_OPTIONS.license_scope.map(opt => (
            <button key={opt} type="button"
              className={`tag ${form.license_scope.includes(opt) ? 'active' : ''}`}
              onClick={() => toggleArray('license_scope', opt)}>
              {opt}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 요청 내용 */}
      <fieldset className="card p-6 flex flex-col gap-2">
        <legend className="text-sm font-bold mb-2">요청 내용</legend>
        <textarea
          rows={5}
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="원하는 분위기, 참고 곡, 특이 사항 등 자유롭게 적어주세요."
          className="w-full resize-none"
        />
      </fieldset>

      <button type="submit" disabled={submitting} className="btn-primary text-center text-lg py-4">
        {submitting ? '전송 중...' : '의뢰 신청 제출'}
      </button>
    </form>
  )
}
