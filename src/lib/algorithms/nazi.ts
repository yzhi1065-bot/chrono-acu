/**
 * 子午流注纳子法
 * 原理：十二时辰当令经脉 → 取五输穴补母泻子
 * 当令时辰：某经气血最旺的时辰
 * 补法：母穴（生我者）
 * 泻法：子穴（我生者）
 */

import { type TianGan, type DiZhi, isYangGan } from '../utils/ganzhi'
import { SHI_CHEN_MERIDIANS, getShiChen, type Acupoint, FIVE_SHU_POINTS_YANG, FIVE_SHU_POINTS_YIN, ELEMENT_GENERATING } from '../data/acupoints'

export interface NaZiResult {
  /** 当令时辰 */
  shiChen: string
  /** 当令经脉 */
  onDutyMeridian: string
  /** 经别（阴/阳） */
  meridianType: 'yin' | 'yang'
  /** 当令经五行 */
  meridianElement: string
  /** 补法（母穴） */
  tonify: { point: string; meridian: string; element: string }
  /** 泻法（子穴） */
  sedate: { point: string; meridian: string; element: string }
}

/** 经脉五行属性 */
const MERIDIAN_ELEMENT: Record<string, string> = {
  胆经: '木', 肝经: '木',
  心经: '火', 小肠经: '火',
  心包经: '火', 三焦经: '火',
  脾经: '土', 胃经: '土',
  肺经: '金', 大肠经: '金',
  肾经: '水', 膀胱经: '水',
}

const YANG_MERIDIANS = ['胆经', '小肠经', '胃经', '大肠经', '膀胱经', '三焦经']

/**
 * 纳子法开穴计算
 * @param hour 小时 (0-23)
 * @returns 补法和泻法结果
 */
export function calculateNaZi(hour: number): NaZiResult {
  const shiChen = getShiChen(hour)
  const onDutyMeridian = SHI_CHEN_MERIDIANS[shiChen]
  const meridianType = YANG_MERIDIANS.includes(onDutyMeridian) ? 'yang' : 'yin'
  const meridianElement = MERIDIAN_ELEMENT[onDutyMeridian]

  // 母元素：生我者
  const motherElement = Object.entries(ELEMENT_GENERATING).find(([_, v]) => v === meridianElement)?.[0] || '土'
  // 子元素：我生者
  const childElement = ELEMENT_GENERATING[meridianElement]

  // 在本经五输穴中寻找母穴和子穴
  const points = meridianType === 'yang'
    ? FIVE_SHU_POINTS_YANG[onDutyMeridian] || []
    : FIVE_SHU_POINTS_YIN[onDutyMeridian] || []

  const tonifyPoint = points.find(p => p.element === motherElement)
  const sedatePoint = points.find(p => p.element === childElement)

  return {
    shiChen,
    onDutyMeridian,
    meridianType,
    meridianElement,
    tonify: {
      point: tonifyPoint?.name || '—',
      meridian: onDutyMeridian,
      element: motherElement,
    },
    sedate: {
      point: sedatePoint?.name || '—',
      meridian: onDutyMeridian,
      element: childElement,
    },
  }
}
