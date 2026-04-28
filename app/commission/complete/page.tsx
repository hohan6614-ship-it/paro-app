import Link from 'next/link'

export default function CommissionCompletePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="text-7xl">✦</div>
      <div>
        <h1 className="text-3xl font-black">요청이 접수되었습니다</h1>
        <p className="mt-3 text-lg" style={{ color: 'var(--muted)' }}>
          아티스트가 검토 후 이메일로 연락드립니다.<br />
          보통 1~2 영업일 내에 답변이 도착해요.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/" className="btn-outline">홈으로</Link>
        <Link href="/search" className="btn-primary">계속 탐색하기</Link>
      </div>
    </div>
  )
}
