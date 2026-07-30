'use client'

interface AcuCardProps {
  method: string
  icon: string
  points: Array<{
    label: string
    value: string
    sub?: string
    color?: string
  }>
  className?: string
  delay?: number
}

const METHOD_GLYPH: Record<string, string> = {
  '纳子法': '🌿',
  '纳甲法': '☯️',
  '灵龟八法': '🐢',
  '飞腾八法': '🕊️',
  '养子时刻': '⏱️',
}

export default function AcuCard({ method, icon, points, className = '', delay = 0 }: AcuCardProps) {
  return (
    <div
      className={`acupoint-card animate-slide-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon || METHOD_GLYPH[method] || '📍'}</span>
        <h3 className="font-serif text-lg text-gold">{method}</h3>
      </div>
      <div className="space-y-2">
        {points.map((p, i) => (
          <div key={i} className="flex items-center justify-between py-1 border-b border-ink-light/30 last:border-0">
            <span className="text-sm text-parchment/60">{p.label}</span>
            <div className="flex items-center gap-2">
              <span className={`font-serif font-semibold ${p.color || 'text-gold'}`}>{p.value}</span>
              {p.sub && <span className="text-xs text-parchment/40">{p.sub}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
