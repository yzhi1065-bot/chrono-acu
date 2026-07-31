import { SHI_CHEN_MERIDIANS } from '@/lib/data/acupoints'

const METHODS = [
  {
    name: '纳子法',
    icon: '🌿',
    desc: '十二时辰当令经脉，取五输穴行补母泻子之法。每一时辰（2小时）有一经当令，气血最旺。虚则补其母（生我者），实则泻其子（我生者）。',
    formula: '某经当令时辰 → 本经找母穴/子穴',
    ref: '《针灸大成》· 十二经纳支法',
  },
  {
    name: '纳甲法',
    icon: '☯️',
    desc: '逐日按时开穴法。以日干决定值日经，按时干依次开井、荥、输、经、合五输穴。阳日阳时开阳经穴，阴日阴时开阴经穴。十日一周期。',
    formula: '日干定经 → 时干定穴序 → 开穴',
    ref: '徐凤《针灸大全》· 子午流注逐日按时定穴诀',
  },
  {
    name: '灵龟八法',
    icon: '🐢',
    desc: '八脉交会穴配九宫八卦，按日时干支计算开穴。将日干、日支、时干、时支数字相加，阳日除9、阴日除6，余数对应九宫数定穴。',
    formula: '(日干数+日支数+时干数+时支数) ÷ 9(阳)或6(阴) → 余数 → 九宫 → 八穴',
    ref: '《针灸大全》· 灵龟八法',
  },
  {
    name: '飞腾八法',
    icon: '🕊️',
    desc: '以先天八卦纳甲，直接以时干配八脉交会穴。不设日干支约束，唯以时干定穴，主治专一。',
    formula: '时干 → 八卦 → 八脉交会穴',
    ref: '王国瑞《扁鹊神应针灸玉龙经》',
  },
  {
    name: '养子时刻注穴法',
    icon: '⏱️',
    desc: '每24分钟开一穴，以井、荥、输、经、合序轮流五输穴。每一时辰（120分钟）开5穴，依次过五经。',
    formula: '24min/穴 × 5 = 120min = 1时辰',
    ref: '阎明广《子午流注针经》',
  },
]

const SHI_CHEN_DESC: Record<string, { meridian: string; organ: string }> = {
  子: { meridian: '胆经', organ: '胆' }, 丑: { meridian: '肝经', organ: '肝' },
  寅: { meridian: '肺经', organ: '肺' }, 卯: { meridian: '大肠经', organ: '大肠' },
  辰: { meridian: '胃经', organ: '胃' }, 巳: { meridian: '脾经', organ: '脾' },
  午: { meridian: '心经', organ: '心' }, 未: { meridian: '小肠经', organ: '小肠' },
  申: { meridian: '膀胱经', organ: '膀胱' }, 酉: { meridian: '肾经', organ: '肾' },
  戌: { meridian: '心包经', organ: '心包' }, 亥: { meridian: '三焦经', organ: '三焦' },
}

export default function KnowledgePage() {
  return (
    <div className="py-4 space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="font-serif text-2xl text-gold">📖 择时开穴 · 算法说明</h2>
        <p className="text-parchment/40 text-sm mt-1">传统时间针法的理论基础与计算方法</p>
      </div>

      {/* 算法说明 */}
      <div className="space-y-4">
        <a href="/chrono-acu/acupoints" className="acupoint-card block animate-slide-up group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <h3 className="font-serif text-lg text-gold">全部穴位库（74穴）</h3>
            </div>
            <span className="text-gold/50 group-hover:text-gold transition-colors">查看 →</span>
          </div>
          <p className="text-parchment/70 text-sm leading-relaxed mt-2">
            十二经 66 个五输穴（井、荥、输、经、合、原）+ 8 个八脉交会穴，每穴含完整定位与主治功效。
          </p>
        </a>

        {METHODS.map((m, i) => (
          <div key={m.name} className="acupoint-card animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{m.icon}</span>
              <h3 className="font-serif text-lg text-gold">{m.name}</h3>
            </div>
            <p className="text-parchment/70 text-sm leading-relaxed">{m.desc}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-gold/10 text-gold/70 rounded">{m.formula}</span>
              <span className="px-2 py-1 bg-ink-light/50 text-parchment/40 rounded">{m.ref}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 十二时辰当令表 */}
      <div className="acupoint-card">
        <h3 className="font-serif text-lg text-gold mb-3">🕐 十二时辰 · 当令经络表</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {Object.entries(SHI_CHEN_DESC).map(([sc, info]) => (
            <div key={sc} className="bg-ink/40 rounded-lg p-3 text-center border border-gold/5">
              <p className="font-serif text-lg text-gold">{sc}</p>
              <p className="text-xs text-parchment/60">{info.organ}</p>
              <p className="text-xs text-parchment/40">{info.meridian}</p>
              <p className="text-[10px] text-parchment/30 mt-1">
                {({23:'23-01',1:'01-03',3:'03-05',5:'05-07',7:'07-09',9:'09-11',
                  11:'11-13',13:'13-15',15:'15-17',17:'17-19',19:'19-21',21:'21-23'})[sc]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 免责 */}
      <div className="text-center text-parchment/20 text-xs space-y-1 py-4">
        <p>本工具算法基于《针灸大全》《针灸大成》《扁鹊神应针灸玉龙经》等古籍整理</p>
        <p>数据仅供学习参考，临床使用请遵医嘱</p>
      </div>
    </div>
  )
}
