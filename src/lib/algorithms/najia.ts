/**
 * 子午流注纳甲法
 * 依据：徐凤《针灸大全》"子午流注逐日按时定穴诀"
 * 原理：日干决定值日经开穴周期，按时干开五输穴
 *
 * 10天周期（甲→癸），每日值班经脉不同
 * 每日开穴按时辰顺序：井、荥、输、经、合（阳日阳时开阳经穴，阴日阴时开阴经穴）
 */

import { type TianGan, type DiZhi, TIAN_GAN, DI_ZHI, isYangGan, getHourGan, hourToDiZhi } from '../utils/ganzhi'
import { FIVE_SHU_POINTS_YANG, FIVE_SHU_POINTS_YIN, type Acupoint } from '../data/acupoints'

/** 十天干值日经脉映射 */
const DAY_MERIDIAN_MAP: Record<TianGan, { yang: string; yin: string; points: Acupoint[] }> = {
  // 阳日阳时开阳经穴 → 阳日值日阳经
  // 阴日阴时开阴经穴 → 阴日值日阴经
  甲: { yang: '胆经', yin: '', points: [] },
  乙: { yang: '', yin: '肝经', points: [] },
  丙: { yang: '小肠经', yin: '', points: [] },
  丁: { yang: '', yin: '心经', points: [] },
  戊: { yang: '胃经', yin: '', points: [] },
  己: { yang: '', yin: '脾经', points: [] },
  庚: { yang: '大肠经', yin: '', points: [] },
  辛: { yang: '', yin: '肺经', points: [] },
  壬: { yang: '膀胱经', yin: '', points: [] },
  癸: { yang: '', yin: '肾经', points: [] },
}

/**
 * 纳甲法开穴表
 * 格式: [日干][时干] = 开穴信息
 * 以徐凤《针灸大全》逐日按时定穴诀为准
 */
const NAJIA_TABLE: Record<string, Record<string, { point: string; meridian: string; category: string; note?: string }>> = {
  // 甲日
  甲: {
    甲: { point: '足窍阴', meridian: '胆经', category: '井', note: '主' },
    丙: { point: '前谷', meridian: '小肠经', category: '荥' },
    戊: { point: '陷谷', meridian: '胃经', category: '输', note: '过丘墟' },
    庚: { point: '阳溪', meridian: '大肠经', category: '经' },
    壬: { point: '委中', meridian: '膀胱经', category: '合' },
  },
  // 乙日
  乙: {
    乙: { point: '大敦', meridian: '肝经', category: '井', note: '主' },
    丁: { point: '少府', meridian: '心经', category: '荥' },
    己: { point: '太白', meridian: '脾经', category: '输', note: '过太冲' },
    辛: { point: '经渠', meridian: '肺经', category: '经' },
    癸: { point: '阴谷', meridian: '肾经', category: '合' },
  },
  // 丙日
  丙: {
    丙: { point: '少泽', meridian: '小肠经', category: '井', note: '主' },
    戊: { point: '内庭', meridian: '胃经', category: '荥' },
    庚: { point: '三间', meridian: '大肠经', category: '输', note: '过腕骨' },
    壬: { point: '昆仑', meridian: '膀胱经', category: '经' },
    甲: { point: '阳陵泉', meridian: '胆经', category: '合' },
  },
  // 丁日
  丁: {
    丁: { point: '少冲', meridian: '心经', category: '井', note: '主' },
    己: { point: '大都', meridian: '脾经', category: '荥' },
    辛: { point: '太渊', meridian: '肺经', category: '输', note: '过神门' },
    癸: { point: '复溜', meridian: '肾经', category: '经' },
    乙: { point: '曲泉', meridian: '肝经', category: '合' },
  },
  // 戊日
  戊: {
    戊: { point: '厉兑', meridian: '胃经', category: '井', note: '主' },
    庚: { point: '二间', meridian: '大肠经', category: '荥' },
    壬: { point: '束骨', meridian: '膀胱经', category: '输', note: '过冲阳' },
    甲: { point: '阳辅', meridian: '胆经', category: '经' },
    丙: { point: '小海', meridian: '小肠经', category: '合' },
  },
  // 己日
  己: {
    己: { point: '隐白', meridian: '脾经', category: '井', note: '主' },
    辛: { point: '鱼际', meridian: '肺经', category: '荥' },
    癸: { point: '太溪', meridian: '肾经', category: '输', note: '过太白' },
    乙: { point: '中封', meridian: '肝经', category: '经' },
    丁: { point: '少海', meridian: '心经', category: '合' },
  },
  // 庚日
  庚: {
    庚: { point: '商阳', meridian: '大肠经', category: '井', note: '主' },
    壬: { point: '通谷', meridian: '膀胱经', category: '荥' },
    甲: { point: '足临泣', meridian: '胆经', category: '输', note: '过合谷' },
    丙: { point: '阳谷', meridian: '小肠经', category: '经' },
    戊: { point: '足三里', meridian: '胃经', category: '合' },
  },
  // 辛日
  辛: {
    辛: { point: '少商', meridian: '肺经', category: '井', note: '主' },
    癸: { point: '然谷', meridian: '肾经', category: '荥' },
    乙: { point: '太冲', meridian: '肝经', category: '输', note: '过太渊' },
    丁: { point: '灵道', meridian: '心经', category: '经' },
    己: { point: '阴陵泉', meridian: '脾经', category: '合' },
  },
  // 壬日
  壬: {
    壬: { point: '至阴', meridian: '膀胱经', category: '井', note: '主' },
    甲: { point: '侠溪', meridian: '胆经', category: '荥' },
    丙: { point: '后溪', meridian: '小肠经', category: '输', note: '过京骨' },
    戊: { point: '解溪', meridian: '胃经', category: '经' },
    庚: { point: '曲池', meridian: '大肠经', category: '合' },
  },
  // 癸日
  癸: {
    癸: { point: '涌泉', meridian: '肾经', category: '井', note: '主' },
    乙: { point: '行间', meridian: '肝经', category: '荥' },
    丁: { point: '神门', meridian: '心经', category: '输', note: '过太溪' },
    己: { point: '商丘', meridian: '脾经', category: '经' },
    辛: { point: '尺泽', meridian: '肺经', category: '合' },
  },
}

export interface NaJiaResult {
  dayGan: TianGan
  hourGan: TianGan
  hourZhi: DiZhi
  /** 值班经脉 */
  onDutyMeridian: string
  /** 开穴信息 */
  openedPoint: {
    name: string
    meridian: string
    category: string
    note?: string
  } | null
  /** 本日所有开穴 */
  dailySchedule: Array<{
    hourGan: TianGan
    hourZhi: DiZhi
    point: { name: string; meridian: string; category: string; note?: string }
  }>
}

/**
 * 纳甲法计算
 * @param dayGan 日干
 * @param hour 小时 (0-23)
 */
export function calculateNaJia(dayGan: TianGan, hour: number): NaJiaResult {
  const hourZhi = hourToDiZhi(hour)
  const hourGan = getHourGan(dayGan, hourZhi)
  const onDuty = DAY_MERIDIAN_MAP[dayGan]

  // 查找当前时辰开穴
  const dayTable = NAJIA_TABLE[dayGan]
  const currentOpening = dayTable?.[hourGan] ?? null

  // 生成当日所有开穴计划
  const dailySchedule: NaJiaResult['dailySchedule'] = []
  if (dayTable) {
    for (let i = 0; i < 12; i++) {
      const hg = TIAN_GAN[i % 10]
      const hz = DI_ZHI[i]
      const p = dayTable[hg]
      if (p) {
        dailySchedule.push({ hourGan: hg as TianGan, hourZhi: hz as DiZhi, point: { name: p.point, meridian: p.meridian, category: p.category, note: p.note } })
      }
    }
  }

  return {
    dayGan,
    hourGan,
    hourZhi,
    onDutyMeridian: onDuty.yang || onDuty.yin,
    openedPoint: currentOpening ? {
      name: currentOpening.point,
      meridian: currentOpening.meridian,
      category: currentOpening.category,
      note: currentOpening.note,
    } : null,
    dailySchedule,
  }
}
