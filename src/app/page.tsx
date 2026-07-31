'use client'

import { useState, useEffect } from 'react'
import ClockDial from '@/components/ClockDial'
import AcuCard from '@/components/AcuCard'
import { calculateAll, type AllMethodsResult } from '@/lib/engine'
import { getShiChen, SHI_CHEN_MERIDIANS } from '@/lib/data/acupoints'

export default function HomePage() {
  const [result, setResult] = useState<AllMethodsResult | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const tick = () => {
      const d = new Date()
      const h = (d.getUTCHours() + 8) % 24
      try {
        setResult(calculateAll(d.getFullYear(), d.getMonth() + 1, d.getDate(), h, d.getUTCMinutes()))
      } catch (e) {
        console.error('calc error', e)
      }
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  if (!mounted || !result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin-slow">☯️</div>
          <p className="text-gold/60 font-serif">推演天时...</p>
        </div>
      </div>
    )
  }

  const { now, nazi, najia, linggui, feiteng, yangzi } = result

  return (
    <div className="space-y-6 py-4">
      {/* 顶部：时辰 + 干支 */}
      <div className="text-center animate-fade-in">
        <p className="text-gold/40 text-xs tracking-widest uppercase">
          {now.year}年{now.month}月{now.day}日
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-gold mt-1">
          {now.dayGan}{now.dayZhi}日 · {now.shiChen}时
        </h1>
        <p className="text-parchment/50 text-sm mt-1">
          当令经：{SHI_CHEN_MERIDIANS[now.shiChen]}
        </p>
      </div>

      {/* 表盘 */}
      <div className="flex justify-center">
        <ClockDial />
      </div>

      {/* 四种开穴卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <AcuCard
          method="纳子法"
          icon="🌿"
          delay={0}
          points={[
            { label: '当令经', value: nazi.onDutyMeridian, sub: `(${nazi.meridianElement}行)` },
            { label: '补法（母穴）', value: nazi.tonify.point, sub: nazi.tonify.element, color: 'text-jade' },
            { label: '泻法（子穴）', value: nazi.sedate.point, sub: nazi.sedate.element, color: 'text-vermilion-light' },
          ]}
        />

        <AcuCard
          method="纳甲法"
          icon="☯️"
          delay={100}
          points={[
            { label: '值日经', value: najia.onDutyMeridian },
            { label: `开穴（${najia.hourGan}时）`, value: najia.openedPoint?.name || '闭穴', sub: najia.openedPoint?.category || '', color: 'text-gold' },
            { label: '经脉', value: najia.openedPoint?.meridian || '—', sub: najia.openedPoint?.note || '' },
          ]}
        />

        <AcuCard
          method="灵龟八法"
          icon="🐢"
          delay={200}
          points={[
            { label: `${linggui.dayType === 'yang' ? '阳' : '阴'}日 · ${linggui.divisor}宫`, value: `余${linggui.remainder}`, sub: `${linggui.point.gua}卦` },
            { label: '主穴', value: linggui.point.host, sub: linggui.point.hostMeridian, color: 'text-gold' },
            { label: '配穴', value: linggui.point.guest, sub: linggui.point.guestMeridian, color: 'text-jade' },
          ]}
        />

        <AcuCard
          method="飞腾八法"
          icon="🕊️"
          delay={300}
          points={[
            { label: `${feiteng.hourGan}时 · ${feiteng.point.gua}卦`, value: feiteng.point.direction },
            { label: '开穴', value: feiteng.point.name, sub: feiteng.point.meridian, color: 'text-gold' },
          ]}
        />
      </div>

      {/* 养子时刻 - 当前时辰每24分钟 */}
      <div className="acupoint-card animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h3 className="font-serif text-lg text-gold mb-4">⏱️ 养子时刻注穴法 · {now.shiChen}时</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {yangzi.slots.map((slot, i) => (
            <div key={i} className="bg-ink/40 rounded-lg p-3 text-center border border-gold/10">
              <p className="text-xs text-parchment/40">{slot.timeLabel}</p>
              <p className="font-serif text-lg text-gold mt-1">{slot.point}</p>
              <p className="text-xs text-parchment/50">{slot.meridian} · {slot.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 十二时辰当令经快速参考 */}
      <div className="acupoint-card animate-slide-up" style={{ animationDelay: '500ms' }}>
        <h3 className="font-serif text-lg text-gold mb-3">🕐 十二时辰当令经</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1">
          {Object.entries(SHI_CHEN_MERIDIANS).map(([sc, mer]) => (
            <div
              key={sc}
              className={`text-center p-2 rounded-lg ${
                sc === now.shiChen
                  ? 'bg-gold/15 border border-gold/30'
                  : 'bg-ink/30'
              }`}
            >
              <p className={`font-serif text-sm ${sc === now.shiChen ? 'text-gold' : 'text-parchment/40'}`}>{sc}</p>
              <p className={`text-xs mt-0.5 ${sc === now.shiChen ? 'text-parchment/80' : 'text-parchment/30'}`}>{mer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
