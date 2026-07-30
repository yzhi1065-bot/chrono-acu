'use client'

import { useState, useEffect } from 'react'
import { calculateAll } from '@/lib/engine'
import { getShiChen } from '@/lib/data/acupoints'
import AcuCard from '@/components/AcuCard'

const SHI_CHEN_LIST = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

export default function QueryPage() {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(7)
  const [day, setDay] = useState(30)
  const [hour, setHour] = useState(12)
  const [result, setResult] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const d = new Date()
    setYear(d.getFullYear())
    setMonth(d.getMonth() + 1)
    setDay(d.getDate())
    setHour((d.getUTCHours() + 8) % 24)
  }, [])

  const doQuery = () => {
    try {
      setResult(calculateAll(year, month, day, hour, 0))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (mounted) doQuery()
  }, [mounted])

  if (!mounted) return <div className="animate-pulse text-center py-20 text-gold/40">加载...</div>

  return (
    <div className="py-4 space-y-6 animate-fade-in max-w-3xl mx-auto">
      <h2 className="font-serif text-2xl text-gold text-center">📅 择时开穴查询</h2>
      <p className="text-center text-parchment/40 text-sm">选择日期和时辰，查看四种算法的开穴结果</p>

      {/* 选择器 */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <select value={year} onChange={e => setYear(Number(e.target.value))}
          className="bg-ink border border-gold/20 rounded-lg px-3 py-2 text-parchment font-serif text-sm">
          {Array.from({ length: 51 }, (_, i) => 2000 + i).map(y => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}
          className="bg-ink border border-gold/20 rounded-lg px-3 py-2 text-parchment font-serif text-sm">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{m}月</option>
          ))}
        </select>
        <select value={day} onChange={e => setDay(Number(e.target.value))}
          className="bg-ink border border-gold/20 rounded-lg px-3 py-2 text-parchment font-serif text-sm">
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{d}日</option>
          ))}
        </select>
        <select value={hour} onChange={e => setHour(Number(e.target.value))}
          className="bg-ink border border-gold/20 rounded-lg px-3 py-2 text-parchment font-serif text-sm">
          {Array.from({ length: 12 }, (_, i) => i * 2).map(h => (
            <option key={h} value={h}>
              {String(h).padStart(2, '0')}:00-{String(h + 2).padStart(2, '0')}:00 {SHI_CHEN_LIST[h / 2]}时
            </option>
          ))}
        </select>
        <button onClick={doQuery}
          className="px-6 py-2 bg-gold/15 border border-gold/30 rounded-lg text-gold font-serif hover:bg-gold/25 transition-colors">
          查询
        </button>
      </div>

      {/* 结果 */}
      {result && (
        <div className="animate-slide-up space-y-4">
          <div className="text-center">
            <p className="font-serif text-xl text-gold">
              {result.now.dayGan}{result.now.dayZhi}日 · {result.now.shiChen}时
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <AcuCard method="纳子法" icon="🌿" delay={0} points={[
              { label: '当令经', value: result.nazi.onDutyMeridian, sub: result.nazi.meridianElement },
              { label: '补法', value: result.nazi.tonify.point, sub: result.nazi.tonify.element, color: 'text-jade' },
              { label: '泻法', value: result.nazi.sedate.point, sub: result.nazi.sedate.element, color: 'text-vermilion-light' },
            ]} />
            <AcuCard method="纳甲法" icon="☯️" delay={100} points={[
              { label: '开穴', value: result.najia.openedPoint?.name || '闭穴', sub: result.najia.openedPoint?.category, color: 'text-gold' },
              { label: '经脉', value: result.najia.openedPoint?.meridian || '—' },
            ]} />
            <AcuCard method="灵龟八法" icon="🐢" delay={200} points={[
              { label: '主穴', value: result.linggui.point.host, sub: result.linggui.point.hostMeridian, color: 'text-gold' },
              { label: '配穴', value: result.linggui.point.guest, sub: result.linggui.point.guestMeridian, color: 'text-jade' },
            ]} />
            <AcuCard method="飞腾八法" icon="🕊️" delay={300} points={[
              { label: `${result.feiteng.point.gua}卦`, value: result.feiteng.point.name, sub: result.feiteng.point.meridian, color: 'text-gold' },
            ]} />
          </div>
          {/* 养子时刻 */}
          <div className="acupoint-card">
            <h3 className="font-serif text-gold mb-3">⏱️ 养子时刻 · 每24分钟开穴</h3>
            <div className="grid grid-cols-5 gap-2">
              {result.yangzi.slots.map((s: any, i: number) => (
                <div key={i} className="bg-ink/40 rounded p-2 text-center">
                  <p className="text-xs text-parchment/30">{s.timeLabel}</p>
                  <p className="font-serif text-gold">{s.point}</p>
                  <p className="text-[10px] text-parchment/40">{s.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
