'use client'

import { useState } from 'react'
import { findAnyAcupoint } from '@/lib/data/acupoints'

/** 穴位名称 → 显示详情浮窗 */
export default function AcupointBadge({ name }: { name: string }) {
  const [show, setShow] = useState(false)
  const info = findAnyAcupoint(name)

  if (!info || name === '—') return <span className="font-serif text-parchment/50">—</span>

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="font-serif font-semibold text-gold border-b border-dashed border-gold/30 hover:border-gold/80 transition-colors cursor-pointer"
      >
        {name}
      </button>

      {show && info.type === 'wushu' && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-ink border border-gold/30 rounded-xl p-3 shadow-2xl animate-fade-in pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-ink border-r border-b border-gold/30" />
          <p className="font-serif text-gold font-semibold text-base">{info.data.name}</p>
          <p className="text-xs text-parchment/40 mt-0.5">{info.data.meridian} · {info.data.category}穴 · {info.data.element}性</p>
          <p className="text-xs text-parchment/60 mt-2">
            <span className="text-gold/60">定位：</span>{info.data.location}
          </p>
          <p className="text-xs text-parchment/60 mt-1">
            <span className="text-gold/60">功效：</span>{info.data.effect}
          </p>
        </div>
      )}

      {show && info.type === 'bamai' && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-ink border border-gold/30 rounded-xl p-3 shadow-2xl animate-fade-in pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-ink border-r border-b border-gold/30" />
          <p className="font-serif text-gold font-semibold text-base">{info.data.name}</p>
          <p className="text-xs text-parchment/40 mt-0.5">{info.data.meridian} · 通{info.data.connectedMeridian} · 配{info.data.pair}</p>
          <p className="text-xs text-parchment/60 mt-2">
            <span className="text-gold/60">定位：</span>{info.data.location}
          </p>
          <p className="text-xs text-parchment/60 mt-1">
            <span className="text-gold/60">功效：</span>{info.data.effect}
          </p>
        </div>
      )}
    </span>
  )
}
