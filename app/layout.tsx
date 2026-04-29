import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-korean',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PARO — 국악 크리에이티브 마켓',
  description: '국악을 활용하고 싶은 창작자와 국악 아티스트를 연결하는 탐색·거래 서비스',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${jakarta.variable} ${notoSans.variable}`}>
      <body className="min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
