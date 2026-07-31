/**
 * 灵龟八法
 * 原理: 八脉交会穴配九宫八卦，依日时干支数开穴
 * 公式：日干+日支+时干+时支 = 和
 * 阳日: 和÷9 取余数 → 九宫数 → 穴
 * 阴日: 和÷6 取余数 → 九宫数 → 穴
 * 余0者取9或6
 */

import { type TianGan, type DiZhi, TIAN_GAN, DI_ZHI, isYangGan, getHourGan, hourToDiZhi } from '../utils/ganzhi'

/** 干支数字表 (灵龟八法专用) */
const GAN_NUMBER: Record<TianGan, number> = {
  甲: 1, 乙: 2, 丙: 3, 丁: 4, 戊: 5,
  己: 6, 庚: 7, 辛: 8, 壬: 9, 癸: 10,
}

const ZHI_NUMBER: Record<DiZhi, number> = {
  子: 1, 丑: 2, 寅: 3, 卯: 4, 辰: 5, 巳: 6,
  午: 7, 未: 8, 申: 9, 酉: 10, 戌: 11, 亥: 12,
}

/** 九宫→八脉交会穴映射（《针灸大全》灵龟八法歌诀）
 *  坎一联申脉，照海坤二五，震三属外关，巽四临泣数，
 *  乾六是公孙，兑七后溪府，艮八系内关，离九列缺主
 */
const JIU_GONG_ACUPOINT: Record<number, {
  host: string; hostMeridian: string; guest: string; guestMeridian: string; gua: string; direction: string
}> = {
  1: { host: '申脉', hostMeridian: '膀胱经', guest: '后溪', guestMeridian: '小肠经', gua: '坎', direction: '北' },
  2: { host: '照海', hostMeridian: '肾经', guest: '列缺', guestMeridian: '肺经', gua: '坤', direction: '西南' },
  3: { host: '外关', hostMeridian: '三焦经', guest: '足临泣', guestMeridian: '胆经', gua: '震', direction: '东' },
  4: { host: '足临泣', hostMeridian: '胆经', guest: '外关', guestMeridian: '三焦经', gua: '巽', direction: '东南' },
  5: { host: '照海', hostMeridian: '肾经', guest: '列缺', guestMeridian: '肺经', gua: '中', direction: '中' },
  6: { host: '公孙', hostMeridian: '脾经', guest: '内关', guestMeridian: '心包经', gua: '乾', direction: '西北' },
  7: { host: '后溪', hostMeridian: '小肠经', guest: '申脉', guestMeridian: '膀胱经', gua: '兑', direction: '西' },
  8: { host: '内关', hostMeridian: '心包经', guest: '公孙', guestMeridian: '脾经', gua: '艮', direction: '东北' },
  9: { host: '列缺', hostMeridian: '肺经', guest: '照海', guestMeridian: '肾经', gua: '离', direction: '南' },
}

export interface LingGuiResult {
  dayGan: TianGan
  dayZhi: DiZhi
  hourGan: TianGan
  hourZhi: DiZhi
  /** 日类型 */
  dayType: 'yang' | 'yin'
  /** 四数之和 */
  sum: number
  /** 除数 */
  divisor: number
  /** 余数 (九宫数) */
  remainder: number
  /** 开穴详情 */
  point: {
    gua: string
    direction: string
    host: string
    hostMeridian: string
    guest: string
    guestMeridian: string
  }
}

/**
 * 灵龟八法计算
 */
export function calculateLingGuiBaFa(
  dayGan: TianGan, dayZhi: DiZhi,
  hour: number
): LingGuiResult {
  const hourZhi = hourToDiZhi(hour)
  const hourGan = getHourGan(dayGan, hourZhi)

  const dayType = isYangGan(dayGan) ? 'yang' : 'yin'

  // 四数求和
  const sum = GAN_NUMBER[dayGan] + ZHI_NUMBER[dayZhi] + GAN_NUMBER[hourGan] + ZHI_NUMBER[hourZhi]

  // 阳日除9，阴日除6
  const divisor = dayType === 'yang' ? 9 : 6
  let remainder = sum % divisor
  if (remainder === 0) remainder = divisor === 9 ? 9 : 6

  const point = JIU_GONG_ACUPOINT[remainder] || JIU_GONG_ACUPOINT[1]

  return {
    dayGan, dayZhi, hourGan, hourZhi,
    dayType, sum, divisor, remainder,
    point: {
      gua: point.gua,
      direction: point.direction,
      host: point.host,
      hostMeridian: point.hostMeridian,
      guest: point.guest,
      guestMeridian: point.guestMeridian,
    },
  }
}
