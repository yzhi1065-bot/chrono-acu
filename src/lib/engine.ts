/**
 * 统一引擎 — 整合所有算法，提供统一接口
 */

import { type TianGan, TIAN_GAN, hourToDiZhi } from './utils/ganzhi'
import { calculateNaZi } from './algorithms/nazi'
import { calculateNaJia } from './algorithms/najia'
import { calculateLingGuiBaFa } from './algorithms/lingguibafa'
import { calculateFeiTengBaFa } from './algorithms/feitengbafa'
import { calculateYangZi } from './algorithms/yangzi'
import { getShiChen } from './data/acupoints'

/**
 * lunisolar 轻量替代 — 核心干支计算
 * 无需外部依赖，纯数学推算
 */

/** 格里历 → 儒略日数 (计算日干支用) */
function gregorianToJD(year: number, month: number, day: number): number {
  const y = month <= 2 ? year - 1 : year
  const m = month <= 2 ? month + 12 : month
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5
}

/** 格里历 → 日干支 (天干+地支序号，0-indexed) */
export function getDayGanZhi(year: number, month: number, day: number): { gan: TianGan; zhi: string; index: number } {
  // 参考: 2000年1月1日 = 戊午日(sexagenary index=54)
  // 已知: 2024-02-10(甲辰年正月初一) = 甲辰日(index=40)
  const jd = gregorianToJD(year, month, day)
  const baseJD = 2451545
  const diff = Math.round(jd - baseJD)
  // 偏移量: 2000-01-01(JD 2451545)对应戊午日(index=54)
  const index = ((diff + 54) % 60 + 60) % 60
  return {
    gan: TIAN_GAN[index % 10] as TianGan,
    zhi: ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][index % 12],
    index,
  }
}

/** 获取当前时辰的时干 */
export function getCurrentHourGan(dayGan: TianGan, hour: number): TianGan {
  const zhiIndex = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'].indexOf(hourToDiZhi(hour))
  // 五鼠遁: 甲己→甲子, 乙庚→丙子, 丙辛→戊子, 丁壬→庚子, 戊癸→壬子
  const dun: Record<string, string> = { '甲':'甲','乙':'丙','丙':'戊','丁':'庚','戊':'壬','己':'甲','庚':'丙','辛':'戊','壬':'庚','癸':'壬' }
  const startGanIndex = TIAN_GAN.indexOf(dun[dayGan] as TianGan)
  return TIAN_GAN[(startGanIndex + zhiIndex) % 10] as TianGan
}

export interface AllMethodsResult {
  now: { year: number; month: number; day: number; hour: number; minute: number; shiChen: string; dayGan: TianGan; dayZhi: string }
  nazi: ReturnType<typeof calculateNaZi>
  najia: ReturnType<typeof calculateNaJia>
  linggui: ReturnType<typeof calculateLingGuiBaFa>
  feiteng: ReturnType<typeof calculateFeiTengBaFa>
  yangzi: ReturnType<typeof calculateYangZi>
}

/** 对所有算法求值 */
export function calculateAll(year: number, month: number, day: number, hour: number, minute: number = 0): AllMethodsResult {
  const shiChen = getShiChen(hour)
  const { gan: dayGan, zhi: dayZhi } = getDayGanZhi(year, month, day)

  return {
    now: { year, month, day, hour, minute, shiChen, dayGan, dayZhi },
    nazi: calculateNaZi(hour),
    najia: calculateNaJia(dayGan, hour),
    linggui: calculateLingGuiBaFa(dayGan, dayZhi as any, hour),
    feiteng: calculateFeiTengBaFa(dayGan, hour),
    yangzi: calculateYangZi(dayGan, hour),
  }
}

/** 当前时间求值 */
export function calculateNow(): AllMethodsResult {
  const d = new Date()
  d.setHours(d.getHours() + 8) // UTC→北京时间
  return calculateAll(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes())
}
