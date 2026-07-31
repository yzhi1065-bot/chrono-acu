'use client'

import { useState } from 'react'
import { FIVE_SHU_POINTS_YANG, FIVE_SHU_POINTS_YIN, BA_MAI_JIAO_HUI, type Acupoint } from '@/lib/data/acupoints'

const CATEGORY_LABEL: Record<string, string> = { 井: '井穴', 荥: '荥穴', 输: '输穴', 经: '经穴', 合: '合穴', 原: '原穴' }
const CATEGORY_COLOR: Record<string, string> = {
  井: 'bg-jade/20 text-jade',
  荥: 'bg-red-500/20 text-red-300',
  输: 'bg-yellow-500/20 text-yellow-300',
  经: 'bg-slate-400/20 text-slate-200',
  合: 'bg-blue-500/20 text-blue-300',
  原: 'bg-purple-500/20 text-purple-300',
}
const ELEMENT_COLOR: Record<string, string> = {
  木: 'bg-emerald-500/20 text-emerald-300',
  火: 'bg-red-500/20 text-red-300',
  土: 'bg-amber-500/20 text-amber-300',
  金: 'bg-slate-300/20 text-slate-100',
  水: 'bg-cyan-500/20 text-cyan-300',
}

function AcupointRow({ p, index }: { p: Acupoint; index: number }) {
  return (
    <div className="bg-ink/40 rounded-lg p-3 border border-gold/10 hover:border-gold/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-serif text-lg text-gold">{p.name}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] ${CATEGORY_COLOR[p.category]}`}>{CATEGORY_LABEL[p.category]}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] ${ELEMENT_COLOR[p.element]}`}>{p.element}</span>
      </div>
      <p className="text-xs text-parchment/50">
        <span className="text-gold/50">定位：</span>{p.location}
      </p>
      <p className="text-xs text-parchment/50 mt-1">
        <span className="text-gold/50">功效：</span>{p.effect}
      </p>
    </div>
  )
}

export default function AcupointsPage() {
  const [filter, setFilter] = useState<'all' | 'yang' | 'yin'>('all')

  return (
    <div className="py-4 space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="font-serif text-2xl text-gold">📍 全部穴位库</h2>
        <p className="text-parchment/40 text-sm mt-1">66 五输穴（含原穴） + 8 八脉交会穴 = 74 穴完整数据</p>
      </div>

      {/* 筛选 */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${filter === 'all' ? 'bg-gold/25 border border-gold/40 text-gold' : 'bg-ink-light/40 text-parchment/50 border border-transparent hover:text-gold'}`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('yang')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${filter === 'yang' ? 'bg-gold/25 border border-gold/40 text-gold' : 'bg-ink-light/40 text-parchment/50 border border-transparent hover:text-gold'}`}
        >
          阳经（36穴）
        </button>
        <button
          onClick={() => setFilter('yin')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${filter === 'yin' ? 'bg-gold/25 border border-gold/40 text-gold' : 'bg-ink-light/40 text-parchment/50 border border-transparent hover:text-gold'}`}
        >
          阴经（30穴）
        </button>
      </div>

      {/* 阳经 */}
      {filter !== 'yin' && (
        <section>
          <h3 className="font-serif text-xl text-gold mb-3 border-b border-gold/20 pb-2">☀️ 阳经五输穴 + 原穴</h3>
          {Object.entries(FIVE_SHU_POINTS_YANG).map(([meridian, points]) => (
            <div key={meridian} className="acupoint-card mb-4">
              <h4 className="font-serif text-gold text-lg mb-3">{meridian}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {points.map((p, i) => <AcupointRow key={p.name} p={p} index={i} />)}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 阴经 */}
      {filter !== 'yang' && (
        <section>
          <h3 className="font-serif text-xl text-gold mb-3 border-b border-gold/20 pb-2">🌙 阴经五输穴</h3>
          {Object.entries(FIVE_SHU_POINTS_YIN).map(([meridian, points]) => (
            <div key={meridian} className="acupoint-card mb-4">
              <h4 className="font-serif text-gold text-lg mb-3">{meridian}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {points.map((p, i) => <AcupointRow key={p.name} p={p} index={i} />)}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 八脉交会穴 */}
      {filter === 'all' && (
        <section>
          <h3 className="font-serif text-xl text-gold mb-3 border-b border-gold/20 pb-2">🐢 八脉交会穴</h3>
          <div className="acupoint-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {BA_MAI_JIAO_HUI.map((p, i) => (
                <div key={p.name} className="bg-ink/40 rounded-lg p-3 border border-gold/10 hover:border-gold/30 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-lg text-gold">{p.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300">通{p.connectedMeridian}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gold/20 text-gold">配{p.pair}</span>
                  </div>
                  <p className="text-xs text-parchment/50">
                    <span className="text-gold/50">定位：</span>{p.location}
                  </p>
                  <p className="text-xs text-parchment/50 mt-1">
                    <span className="text-gold/50">功效：</span>{p.effect}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
