/**
 * 算法直接验证脚本 — 不依赖 vitest
 */
const path = require('path')
const fs = require('fs')

// 模拟 vitest 的测试函数
let passed = 0
let failed = 0
let currentSuite = ''

function describe(name, fn) {
  currentSuite = name
  console.log(`\n  ${name}`)
  fn()
}

function it(name, fn) {
  try {
    fn()
    console.log(`    ✓ ${name}`)
    passed++
  } catch (e) {
    console.log(`    ✗ ${name}`)
    console.log(`      ${e.message}`)
    failed++
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
      }
    },
    toBeTruthy() {
      if (!actual) throw new Error(`expected truthy, got ${JSON.stringify(actual)}`)
    },
    toHaveLength(n) {
      if (!actual || actual.length !== n) throw new Error(`expected length ${n}, got ${actual?.length}`)
    }
  }
}

// 动态加载 TypeScript 文件
require('tsx').register()

const { calculateNaZi } = require('./src/lib/algorithms/nazi')
const { calculateNaJia } = require('./src/lib/algorithms/najia')
const { calculateLingGuiBaFa } = require('./src/lib/algorithms/lingguibafa')
const { calculateFeiTengBaFa } = require('./src/lib/algorithms/feitengbafa')
const { calculateYangZi } = require('./src/lib/algorithms/yangzi')
const { getDayGanZhi, calculateAll } = require('./src/lib/engine')
const { getHourGan } = require('./src/lib/utils/ganzhi')

// ====== 干支基础 ======
describe('干支计算', () => {
  it('2000-01-01 = 戊午日', () => {
    const { gan, index } = getDayGanZhi(2000, 1, 1)
    expect(gan).toBe('戊')
    expect(index).toBe(54)
  })

  it('2000-01-07 = 甲子日', () => {
    const { gan } = getDayGanZhi(2000, 1, 7)
    expect(gan).toBe('甲')
  })

  it('2024-02-10 (春节) = 甲辰日', () => {
    const { gan } = getDayGanZhi(2024, 2, 10)
    expect(gan).toBe('甲')
  })

  it('甲日午时 = 庚午时', () => {
    expect(getHourGan('甲', '午')).toBe('庚')
  })

  it('乙日子时 = 丙子时 (乙庚丙作初)', () => {
    expect(getHourGan('乙', '子')).toBe('丙')
  })
})

// ====== 纳子法 ======
describe('纳子法', () => {
  it('午时 心经 补母少冲/泻子神门', () => {
    const r = calculateNaZi(12)
    expect(r.onDutyMeridian).toBe('心经')
    expect(r.tonify.point).toBe('少冲')
    expect(r.sedate.point).toBe('神门')
  })

  it('丑时 肝经', () => {
    const r = calculateNaZi(2)
    expect(r.onDutyMeridian).toBe('肝经')
    expect(r.tonify.point).toBe('曲泉')
    expect(r.sedate.point).toBe('行间')
  })
})

// ====== 纳甲法 ======
describe('纳甲法', () => {
  it('甲日午时 开阳溪', () => {
    const r = calculateNaJia('甲', 12)
    expect(r.openedPoint.name).toBe('阳溪')
  })

  it('乙日酉时 开大敦', () => {
    const r = calculateNaJia('乙', 18)
    expect(r.openedPoint.name).toBe('大敦')
  })

  it('戊日午时 开厉兑', () => {
    const r = calculateNaJia('戊', 12)
    expect(r.openedPoint.name).toBe('厉兑')
  })
})

// ====== 灵龟八法 ======
describe('灵龟八法', () => {
  it('甲子日子时 余4 → 足临泣/外关', () => {
    const r = calculateLingGuiBaFa('甲', '子', 0)
    expect(r.sum).toBe(4)
    expect(r.remainder).toBe(4)
    expect(r.point.host).toBe('足临泣')
  })

  it('甲申日午时 余6 → 申脉/后溪', () => {
    const r = calculateLingGuiBaFa('甲', '申', 12)
    expect(r.remainder).toBe(6)
    expect(r.point.host).toBe('申脉')
  })
})

// ====== 飞腾八法 ======
describe('飞腾八法', () => {
  it('甲日午时(庚) → 外关', () => {
    const r = calculateFeiTengBaFa('甲', 12)
    expect(r.point.name).toBe('外关')
  })

  it('乙日子时(丙) → 内关', () => {
    const r = calculateFeiTengBaFa('乙', 0)
    expect(r.point.name).toBe('内关')
  })
})

// ====== 养子时刻 ======
describe('养子时刻', () => {
  it('开5穴', () => {
    const r = calculateYangZi('甲', 12)
    expect(r.slots.length).toBe(5)
  })
})

// ====== 汇总 ======
console.log(`\n====== 结果: ${passed} passed, ${failed} failed ======`)
process.exit(failed > 0 ? 1 : 0)
