import Link from 'next/link'

export default function SavedPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center gap-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
        style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>♡</div>
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>내 저장함</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
          저장한 음원과 아티스트가 여기에 모여요.<br />
          저장 기능은 다음 스프린트에서 오픈돼요.
        </p>
      </div>
      <Link href="/search" className="btn-primary px-6">탐색하러 가기</Link>
    </div>
  )
}
