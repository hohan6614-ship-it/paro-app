import { MOCK_COMMISSION_ITEMS } from '@/lib/mockData'
import { notFound } from 'next/navigation'
import CommissionForm from '@/components/CommissionForm'
import Link from 'next/link'

export default async function CommissionRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = MOCK_COMMISSION_ITEMS.find(c => c.id === id)
  if (!item) notFound()

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">
      <Link href={`/commission/${id}`} className="text-sm" style={{ color: 'var(--muted)' }}>← 의뢰 상세로 돌아가기</Link>
      <div>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>의뢰 신청</p>
        <h1 className="text-2xl font-black">{item.title}</h1>
      </div>
      <CommissionForm commissionId={id} />
    </div>
  )
}
