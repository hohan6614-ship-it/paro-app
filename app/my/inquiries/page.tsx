import Link from 'next/link'

export default function InquiriesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center gap-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
        style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>✉</div>
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>내 문의 내역</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
          아티스트에게 보낸 문의와 진행 상태가 여기에 보여요.<br />
          문의 내역 관리는 다음 스프린트에서 오픈돼요.
        </p>
      </div>
      <Link href="/search?tab=commission" className="btn-primary px-6">의뢰 찾아보기</Link>
    </div>
  )
}
