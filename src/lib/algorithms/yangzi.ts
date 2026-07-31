/**
 * 养子时刻注穴法
 * 每24分钟开一穴，按五输穴序：井→荥→输→经→合
 * 起始经由日干决定（值日经），跨时辰连续循环
 */

import { type TianGan, type DiZhi, isYangGan, hourToDiZhi, getHourGan } from '../utils/ganzhi'
import { FIVE_SHU_POINTS_YANG, FIVE_SHU_POINTS_YIN, type Acupoint } from '../data/acupoints'

/** 阳经循环序 */
const YANG_MERIDIAN_ORDER = ['胆经', '小肠经', '胃经', '大肠经', '膀胱经', '三焦经']
/** 阴经循环序 */
const YIN_MERIDIAN_ORDER = ['肝经', '心经', '脾经', '肺经', '肾经', '心包经']
const CATEGORY_ORDER: Array<Acupoint['category']> = ['井', '荥', '输', '经', '合']

/** 日干→值日经（纳甲法同源） */
const DAY_GAN_MERIDIAN: Record<TianGan, string> = {
  甲: '胆经', 乙: '肝经', 丙: '小肠经', 丁: '心经', 戊: '胃经',
  己: '脾经', 庚: '大肠经', 辛: '肺经', 壬: '膀胱经', 癸: '肾经',
}

export interface YangZiResult {
  /** 该时辰内每24分钟的开穴 */
  slots: Array<{
    minute: number  // 0, 24, 48, 72, 96
    timeLabel: string // e.g. "09:00-09:24"
    point: string
    meridian: string
    category: string
    element: string
  }>
}

/**
 * 养子时刻注穴法
 * @param dayGan 日干 — 决定起始经
 * @param hour 小时
 */
export function calculateYangZi(dayGan: TianGan, hour: number): YangZiResult {
  const startMeridian = DAY_GAN_MERIDIAN[dayGan] || '胆经'
  const isYang = YANG_MERIDIAN_ORDER.includes(startMeridian)
  const order = isYang ? YANG_MERIDIAN_ORDER : YIN_MERIDIAN_ORDER
  const pointsMap = isYang ? FIVE_SHU_POINTS_YANG : FIVE_SHU_POINTS_YIN

  // 起始经在循环中的位置
  const startIdx = order.indexOf(startMeridian)
  const baseIdx = startIdx === -1 ? 0 : startIdx

  const slots = CATEGORY_ORDER.map((cat, i) => {
    // 同一经内五输穴顺序，然后换下一经（跨时辰连续）
    const meridian = order[(baseIdx + i) % order.length]
    const meridianPoints = pointsMap[meridian]
    const point = meridianPoints?.find(p => p.category === cat)

    const startMin = i * 24
    const startM = hour * 60 + startMin
    const endM = startM + 24
    const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

    return {
      minute: startMin,
      timeLabel: `${fmt(startM)}-${fmt(endM)}`,
      point: point?.name || '—',
      meridian: meridian,
      category: cat,
      element: point?.element || '—',
    }
  })

  return { slots }
}
