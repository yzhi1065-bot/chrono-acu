/**
 * 养子时刻注穴法
 * 每24分钟开一穴，按五输穴序：井→荥→输→经→合→阳/阴经周期
 * 每时辰（2小时=120分钟）= 5个24分钟 = 开5穴
 */

import { type TianGan, type DiZhi, isYangGan, hourToDiZhi, getHourGan } from '../utils/ganzhi'
import { FIVE_SHU_POINTS_YANG, FIVE_SHU_POINTS_YIN, type Acupoint } from '../data/acupoints'

/** 阳经开穴序（按值日经+五输） */
const YANG_MERIDIAN_ORDER = ['胆经', '小肠经', '胃经', '大肠经', '膀胱经', '三焦经']
const YIN_MERIDIAN_ORDER = ['肝经', '心经', '脾经', '肺经', '肾经', '心包经']
const CATEGORY_ORDER: Array<Acupoint['category']> = ['井', '荥', '输', '经', '合']

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
 */
export function calculateYangZi(dayGan: TianGan, hour: number): YangZiResult {
  const dayIsYang = isYangGan(dayGan)
  const hourZhi = hourToDiZhi(hour)
  const hourGan = getHourGan(dayGan, hourZhi)
  const hourIsYang = isYangGan(hourGan)

  // 决定用阳经还是阴经序
  const meridianOrder = hourIsYang ? YANG_MERIDIAN_ORDER : YIN_MERIDIAN_ORDER
  const pointsMap = hourIsYang ? FIVE_SHU_POINTS_YANG : FIVE_SHU_POINTS_YIN

  const slots = CATEGORY_ORDER.map((cat, i) => {
    const meridianIndex = i % meridianOrder.length
    const meridian = meridianOrder[meridianIndex]
    const meridianPoints = pointsMap[meridian]
    const point = meridianPoints?.find(p => p.category === cat)

    const startMin = i * 24
    const startHour = hour
    const startM = startHour * 60 + startMin
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
