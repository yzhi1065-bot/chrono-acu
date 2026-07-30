/**
 * 飞腾八法
 * 原理: 先天八卦纳甲 — 直接以时干配八脉交会穴
 * 歌诀:
 *   壬甲公孙即是乾，丙居艮上内关然
 *   戊为临泣生坎水，庚属外关震相连
 *   辛上后溪装巽卦，乙癸申脉到坤传
 *   己土列缺南离上，丁居照海兑金全
 */

import { type TianGan, getHourGan, hourToDiZhi } from '../utils/ganzhi'

/** 时干→八卦→八穴 */
const FEI_TENG_TABLE: Record<TianGan, {
  point: string; meridian: string; gua: string; direction: string
}> = {
  壬: { point: '公孙', meridian: '脾经', gua: '乾', direction: '西北' },
  甲: { point: '公孙', meridian: '脾经', gua: '乾', direction: '西北' },
  丙: { point: '内关', meridian: '心包经', gua: '艮', direction: '东北' },
  戊: { point: '足临泣', meridian: '胆经', gua: '坎', direction: '北' },
  庚: { point: '外关', meridian: '三焦经', gua: '震', direction: '东' },
  辛: { point: '后溪', meridian: '小肠经', gua: '巽', direction: '东南' },
  乙: { point: '申脉', meridian: '膀胱经', gua: '坤', direction: '西南' },
  癸: { point: '申脉', meridian: '膀胱经', gua: '坤', direction: '西南' },
  己: { point: '列缺', meridian: '肺经', gua: '离', direction: '南' },
  丁: { point: '照海', meridian: '肾经', gua: '兑', direction: '西' },
}

export interface FeiTengResult {
  dayGan: TianGan
  hourGan: TianGan
  hourZhi: string
  point: {
    name: string
    meridian: string
    gua: string
    direction: string
  }
}

/**
 * 飞腾八法计算
 */
export function calculateFeiTengBaFa(dayGan: TianGan, hour: number): FeiTengResult {
  const hourZhi = hourToDiZhi(hour)
  const hourGan = getHourGan(dayGan, hourZhi)
  const entry = FEI_TENG_TABLE[hourGan] || FEI_TENG_TABLE['甲']

  return {
    dayGan,
    hourGan,
    hourZhi,
    point: {
      name: entry.point,
      meridian: entry.meridian,
      gua: entry.gua,
      direction: entry.direction,
    },
  }
}
