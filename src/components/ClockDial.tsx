'use client'

import { useEffect, useState } from 'react'
import { getShiChen } from '@/lib/data/acupoints'

/** 实时时辰表盘 — SVG 动画 */
export default function ClockDial() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0, sc: '' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const tick = () => {
      const d = new Date()
      // 北京时间 UTC+8
      const h = (d.getUTCHours() + 8) % 24
      setTime({ h, m: d.getUTCMinutes(), s: d.getUTCSeconds(), sc: getShiChen(h) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!mounted) return <div className="h-64 flex items-center justify-center text-gray-500 animate-pulse">加载中...</div>

  // 时针角度: 每12小时360度
  const hourAngle = ((time.h % 12) / 12) * 360 + (time.m / 60) * 30
  const minAngle = (time.m / 60) * 360
  const secAngle = (time.s / 60) * 360

  // 十二时辰定位
  const shiChenLabels = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
  const radius = 120
  const cx = 160, cy = 160

  return (
    <div className="flex flex-col items-center gap-3 animate-fade-in">
      <div className="relative" style={{ width: 320, height: 320 }}>
        <svg viewBox="0 0 320 320" className="w-full h-full">
          {/* 外圈 — 金环 */}
          <circle cx={cx} cy={cy} r={radius + 12} className="clock-ring" opacity={0.3} />
          <circle cx={cx} cy={cy} r={radius} className="clock-ring" />
          <circle cx={cx} cy={cy} r={8} fill="#C9A96E" />

          {/* 时辰标签 */}
          {shiChenLabels.map((sc, i) => {
            const angle = (i * 30 - 90) * Math.PI / 180
            const r2 = radius - 22
            const x = cx + r2 * Math.cos(angle)
            const y = cy + r2 * Math.sin(angle)
            const isActive = sc === time.sc
            return (
              <g key={sc}>
                <text
                  x={x} y={y}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isActive ? '#D4AF37' : '#8B7355'}
                  fontSize={isActive ? 18 : 14}
                  fontWeight={isActive ? 'bold' : 'normal'}
                  className={isActive ? 'animate-pulse-soft' : ''}
                  fontFamily="Noto Serif SC, serif"
                >
                  {sc}
                </text>
                {/* 刻度 */}
                <line
                  x1={cx + (radius - 8) * Math.cos(angle)}
                  y1={cy + (radius - 8) * Math.sin(angle)}
                  x2={cx + radius * Math.cos(angle)}
                  y2={cy + radius * Math.sin(angle)}
                  stroke={isActive ? '#D4AF37' : '#2D2D44'}
                  strokeWidth={isActive ? 3 : 1}
                />
              </g>
            )
          })}

          {/* 时针 */}
          <line
            x1={cx} y1={cy}
            x2={cx + 55 * Math.sin(hourAngle * Math.PI / 180)}
            y2={cy - 55 * Math.cos(hourAngle * Math.PI / 180)}
            stroke="#B22222" strokeWidth={4} strokeLinecap="round"
          />
          {/* 分针 */}
          <line
            x1={cx} y1={cy}
            x2={cx + 75 * Math.sin(minAngle * Math.PI / 180)}
            y2={cy - 75 * Math.cos(minAngle * Math.PI / 180)}
            stroke="#C9A96E" strokeWidth={2.5} strokeLinecap="round"
          />
          {/* 秒针 */}
          <line
            x1={cx} y1={cy}
            x2={cx + 85 * Math.sin(secAngle * Math.PI / 180)}
            y2={cy - 85 * Math.cos(secAngle * Math.PI / 180)}
            stroke="#8B0000" strokeWidth={1} strokeLinecap="round"
          />
        </svg>

        {/* 中心数字时钟 */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="font-serif text-xl text-gold">
            {String(time.h).padStart(2, '0')}:{String(time.m).padStart(2, '0')}
          </span>
          <span className="ml-3 px-2 py-0.5 bg-vermilion/20 text-vermilion-light rounded text-sm font-serif">
            {time.sc}时
          </span>
        </div>
      </div>
    </div>
  )
}
