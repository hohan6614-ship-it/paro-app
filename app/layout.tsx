import type { Metadata } from 'next'
import { Noto_Serif_KR } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PARO — 국악 크리에이티브 마켓',
  description: '국악을 활용하고 싶은 창작자와 국악 아티스트를 연결하는 탐색·거래 서비스',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSerifKR.variable}>
      <body className="min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
