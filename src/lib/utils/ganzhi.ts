/**
 * 干支工具 — 基于 lunisolar 引擎
 * 提供天干地支、时辰、八卦等基础计算
 */
// 注意: lunisolar 在浏览器端可用 CDN 加载
// 这里提供类型定义和纯函数工具，lunisolar 实例化在运行时完成

export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const
export type TianGan = typeof TIAN_GAN[number]
export type DiZhi = typeof DI_ZHI[number]

export const WU_XING = ['木', '火', '土', '金', '水'] as const

/** 天干五行 */
export const GAN_WU_XING: Record<TianGan, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
}

/** 地支五行 */
export const ZHI_WU_XING: Record<DiZhi, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
}

/** 十二时辰对应地支 */
export function hourToDiZhi(h: number): DiZhi {
  if (h >= 23 || h < 1) return '子'
  if (h >= 1 && h < 3) return '丑'
  if (h >= 3 && h < 5) return '寅'
  if (h >= 5 && h < 7) return '卯'
  if (h >= 7 && h < 9) return '辰'
  if (h >= 9 && h < 11) return '巳'
  if (h >= 11 && h < 13) return '午'
  if (h >= 13 && h < 15) return '未'
  if (h >= 15 && h < 17) return '申'
  if (h >= 17 && h < 19) return '酉'
  if (h >= 19 && h < 21) return '戌'
  return '亥'
}

/** 日干推时干 (五鼠遁) — 精确匹配 */
const WU_SHU_DUN: Record<string, string> = {
  '甲': '甲己', '乙': '乙庚', '丙': '丙辛', '丁': '丁壬', '戊': '戊癸',
  '己': '甲己', '庚': '乙庚', '辛': '丙辛', '壬': '丁壬', '癸': '戊癸',
}

const WU_SHU_SEQ: Record<string, TianGan[]> = {
  '甲己': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  '乙庚': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
  '丙辛': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  '丁壬': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  '戊癸': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
}

/** 根据日干和时辰地支推时干 */
export function getHourGan(dayGan: TianGan, hourZhi: DiZhi): TianGan {
  const groupKey = WU_SHU_DUN[dayGan]
  const hourIndex = DI_ZHI.indexOf(hourZhi)
  return WU_SHU_SEQ[groupKey][hourIndex] as TianGan
}

/** 天干 → 阴阳: 甲丙戊庚壬=阳, 乙丁己辛癸=阴 */
export function isYangGan(gan: TianGan): boolean {
  return [0, 2, 4, 6, 8].includes(TIAN_GAN.indexOf(gan))
}

/** 地支 → 阴阳: 子寅辰午申戌=阳, 丑卯巳未酉亥=阴 */
export function isYangZhi(zhi: DiZhi): boolean {
  return [0, 2, 4, 6, 8, 10].includes(DI_ZHI.indexOf(zhi))
}

/** 天干合化 (五合) */
export const GAN_HE: Record<string, string> = {
  '甲己': '土', '乙庚': '金', '丙辛': '水', '丁壬': '木', '戊癸': '火',
}
