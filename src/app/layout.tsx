import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '历法·子午灵龟 — 择时开穴',
  description: '传统历法·子午流注·灵龟八法·飞腾八法·择时开穴工具 — 依天干地支推演经气流注，为任一时辰计算开穴',
  keywords: ['子午流注', '灵龟八法', '飞腾八法', '择时开穴', '传统历法', '针灸', '中医'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {/* 导航 */}
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-ink/80 border-b border-gold/10">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/chrono-acu" className="flex items-center gap-2">
              <span className="text-2xl">☯️</span>
              <span className="font-serif text-lg text-gold font-semibold hidden sm:inline">子午灵龟</span>
            </a>
            <nav className="flex gap-1 sm:gap-4">
              <a href="/chrono-acu" className="nav-link active text-sm sm:text-base">实时</a>
              <a href="/chrono-acu/calendar" className="nav-link text-sm sm:text-base">日历</a>
              <a href="/chrono-acu/query" className="nav-link text-sm sm:text-base">择时</a>
              <a href="/chrono-acu/knowledge" className="nav-link text-sm sm:text-base">知识</a>
            </nav>
          </div>
        </header>

        <main className="main-container min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        {/* 底部 */}
        <footer className="border-t border-gold/10 py-6 text-center text-parchment/30 text-xs">
          <p>历法·子午灵龟 — 基于《针灸大全》《针灸大成》传统理论</p>
          <p className="mt-1">仅供学习参考，不构成医疗建议</p>
        </footer>
      </body>
    </html>
  )
}
