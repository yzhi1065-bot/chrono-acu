'use client'

import { useState, useEffect } from 'react'
import { getDayGanZhi, calculateAll } from '@/lib/engine'
import { getShiChen, SHI_CHEN_MERIDIANS } from '@/lib/data/acupoints'
import AcuCard from '@/components/AcuCard'

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']
const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

export default function CalendarPage() {
  const [today, setToday] = useState(new Date())
  const [viewYear, setViewYear] = useState(0)
  const [viewMonth, setViewMonth] = useState(0)
  const [selectedDay, setSelectedDay] = useState<{ year: number; month: number; day: number } | null>(null)
  const [selectedResult, setSelectedResult] = useState<any>(null)

  useEffect(() => {
    const d = new Date()
    const h = (d.getUTCHours() + 8) % 24
    setToday(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth() + 1)
  }, [])

  if (!viewYear) return <div className="animate-pulse text-center py-20 text-gold/40">加载历法...</div>

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay()

  const selectDay = (day: number) => {
    setSelectedDay({ year: viewYear, month: viewMonth, day })
    try {
      setSelectedResult(calculateAll(viewYear, viewMonth, day, 12, 0)) // 午时
    } catch { /* ignore */ }
  }

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(v => v - 1); setViewMonth(12) }
    else setViewMonth(m => m - 1)
    setSelectedDay(null); setSelectedResult(null)
  }

  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(v => v + 1); setViewMonth(1) }
    else setViewMonth(m => m + 1)
    setSelectedDay(null); setSelectedResult(null)
  }

  return (
    <div className="py-4 space-y-6 animate-fade-in">
      {/* 月导航 */}
      <div className="flex items-center justify-center gap-6">
        <button onClick={prevMonth} className="text-gold/40 hover:text-gold text-2xl transition-colors">‹</button>
        <h2 className="font-serif text-2xl text-gold">{viewYear}年 {MONTH_NAMES[viewMonth - 1]}</h2>
        <button onClick={nextMonth} className="text-gold/40 hover:text-gold text-2xl transition-colors">›</button>
      </div>

      {/* 日历网格 */}
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEK_DAYS.map(w => (
            <div key={w} className="text-center text-xs text-gold/40 font-serif py-1">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* 空白格 */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {/* 日期格 */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const { gan, zhi } = getDayGanZhi(viewYear, viewMonth, day)
            const isToday = today.getFullYear() === viewYear && today.getMonth() + 1 === viewMonth && today.getDate() === day
            const isSelected = selectedDay?.day === day
            return (
              <button
                key={day}
                onClick={() => selectDay(day)}
                className={`
                  relative p-2 rounded-lg text-center transition-all cursor-pointer
                  ${isSelected ? 'bg-gold/20 border border-gold/40' : isToday ? 'bg-vermilion/10 border border-vermilion/30' : 'hover:bg-ink-light/50 border border-transparent'}
                `}
              >
                <div className={`font-serif text-sm ${isSelected ? 'text-gold' : isToday ? 'text-vermilion-light' : 'text-parchment/70'}`}>
                  {day}
                </div>
                <div className="text-[10px] text-gold/30 mt-0.5">{gan}{zhi}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 选中日期的开穴 */}
      {selectedDay && selectedResult && (
        <div className="animate-slide-up mt-6">
          <div className="text-center mb-4">
            <p className="text-gold/40 text-xs">
              {selectedDay.year}年{selectedDay.month}月{selectedDay.day}日
            </p>
            <h3 className="font-serif text-xl text-gold">
              {selectedResult.now.dayGan}{selectedResult.now.dayZhi}日 · 午时开穴
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AcuCard method="纳子法" icon="🌿" points={[
              { label: '当令经', value: selectedResult.nazi.onDutyMeridian },
              { label: '补法', value: selectedResult.nazi.tonify.point },
              { label: '泻法', value: selectedResult.nazi.sedate.point },
            ]} />
            <AcuCard method="纳甲法" icon="☯️" points={[
              { label: '值日经', value: selectedResult.najia.onDutyMeridian },
              { label: '开穴', value: selectedResult.najia.openedPoint?.name || '闭穴' },
            ]} />
            <AcuCard method="灵龟八法" icon="🐢" points={[
              { label: '主穴', value: selectedResult.linggui.point.host },
              { label: '配穴', value: selectedResult.linggui.point.guest },
            ]} />
            <AcuCard method="飞腾八法" icon="🕊️" points={[
              { label: '开穴', value: selectedResult.feiteng.point.name },
            ]} />
          </div>
        </div>
      )}
    </div>
  )
}
