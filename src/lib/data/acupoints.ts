/** 十二经脉五输穴 + 原穴 完整数据 */
export interface Acupoint {
  name: string
  pinyin: string
  meridian: string
  category: '井' | '荥' | '输' | '经' | '合' | '原'
  element: '木' | '火' | '土' | '金' | '水'
}

/** 五输穴属性: 井木荥火输土经金合水（阳经）/ 井金荥水输木经火合土（阴经） */

export const FIVE_SHU_POINTS_YANG: Record<string, Acupoint[]> = {
  // 阳经: 井金 荥水 输木 经火 合土 原
  胆经: [
    { name: '足窍阴', pinyin: 'zuqiaoyin', meridian: '胆经', category: '井', element: '金' },
    { name: '侠溪', pinyin: 'xiaxi', meridian: '胆经', category: '荥', element: '水' },
    { name: '足临泣', pinyin: 'zulinqi', meridian: '胆经', category: '输', element: '木' },
    { name: '阳辅', pinyin: 'yangfu', meridian: '胆经', category: '经', element: '火' },
    { name: '阳陵泉', pinyin: 'yanglingquan', meridian: '胆经', category: '合', element: '土' },
    { name: '丘墟', pinyin: 'qiuxu', meridian: '胆经', category: '原', element: '木' },
  ],
  小肠经: [
    { name: '少泽', pinyin: 'shaoze', meridian: '小肠经', category: '井', element: '金' },
    { name: '前谷', pinyin: 'qiangu', meridian: '小肠经', category: '荥', element: '水' },
    { name: '后溪', pinyin: 'houxi', meridian: '小肠经', category: '输', element: '木' },
    { name: '阳谷', pinyin: 'yanggu', meridian: '小肠经', category: '经', element: '火' },
    { name: '小海', pinyin: 'xiaohai', meridian: '小肠经', category: '合', element: '土' },
    { name: '腕骨', pinyin: 'wangu', meridian: '小肠经', category: '原', element: '木' },
  ],
  胃经: [
    { name: '厉兑', pinyin: 'lidui', meridian: '胃经', category: '井', element: '金' },
    { name: '内庭', pinyin: 'neiting', meridian: '胃经', category: '荥', element: '水' },
    { name: '陷谷', pinyin: 'xiangu', meridian: '胃经', category: '输', element: '木' },
    { name: '解溪', pinyin: 'jiexi', meridian: '胃经', category: '经', element: '火' },
    { name: '足三里', pinyin: 'zusanli', meridian: '胃经', category: '合', element: '土' },
    { name: '冲阳', pinyin: 'chongyang', meridian: '胃经', category: '原', element: '木' },
  ],
  大肠经: [
    { name: '商阳', pinyin: 'shangyang', meridian: '大肠经', category: '井', element: '金' },
    { name: '二间', pinyin: 'erjian', meridian: '大肠经', category: '荥', element: '水' },
    { name: '三间', pinyin: 'sanjian', meridian: '大肠经', category: '输', element: '木' },
    { name: '阳溪', pinyin: 'yangxi', meridian: '大肠经', category: '经', element: '火' },
    { name: '曲池', pinyin: 'quchi', meridian: '大肠经', category: '合', element: '土' },
    { name: '合谷', pinyin: 'hegu', meridian: '大肠经', category: '原', element: '木' },
  ],
  膀胱经: [
    { name: '至阴', pinyin: 'zhiyin', meridian: '膀胱经', category: '井', element: '金' },
    { name: '通谷', pinyin: 'tonggu', meridian: '膀胱经', category: '荥', element: '水' },
    { name: '束骨', pinyin: 'shugu', meridian: '膀胱经', category: '输', element: '木' },
    { name: '昆仑', pinyin: 'kunlun', meridian: '膀胱经', category: '经', element: '火' },
    { name: '委中', pinyin: 'weizhong', meridian: '膀胱经', category: '合', element: '土' },
    { name: '京骨', pinyin: 'jinggu', meridian: '膀胱经', category: '原', element: '木' },
  ],
  三焦经: [
    { name: '关冲', pinyin: 'guanchong', meridian: '三焦经', category: '井', element: '金' },
    { name: '液门', pinyin: 'yemen', meridian: '三焦经', category: '荥', element: '水' },
    { name: '中渚', pinyin: 'zhongzhu', meridian: '三焦经', category: '输', element: '木' },
    { name: '支沟', pinyin: 'zhigou', meridian: '三焦经', category: '经', element: '火' },
    { name: '天井', pinyin: 'tianjing', meridian: '三焦经', category: '合', element: '土' },
    { name: '阳池', pinyin: 'yangchi', meridian: '三焦经', category: '原', element: '木' },
  ],
}

export const FIVE_SHU_POINTS_YIN: Record<string, Acupoint[]> = {
  // 阴经: 井金 荥水 输木 经火 合土  (原=输)
  肝经: [
    { name: '大敦', pinyin: 'dadun', meridian: '肝经', category: '井', element: '木' },
    { name: '行间', pinyin: 'xingjian', meridian: '肝经', category: '荥', element: '火' },
    { name: '太冲', pinyin: 'taichong', meridian: '肝经', category: '输', element: '土' },
    { name: '中封', pinyin: 'zhongfeng', meridian: '肝经', category: '经', element: '金' },
    { name: '曲泉', pinyin: 'ququan', meridian: '肝经', category: '合', element: '水' },
  ],
  心经: [
    { name: '少冲', pinyin: 'shaochong', meridian: '心经', category: '井', element: '木' },
    { name: '少府', pinyin: 'shaofu', meridian: '心经', category: '荥', element: '火' },
    { name: '神门', pinyin: 'shenmen', meridian: '心经', category: '输', element: '土' },
    { name: '灵道', pinyin: 'lingdao', meridian: '心经', category: '经', element: '金' },
    { name: '少海', pinyin: 'shaohai', meridian: '心经', category: '合', element: '水' },
  ],
  脾经: [
    { name: '隐白', pinyin: 'yinbai', meridian: '脾经', category: '井', element: '木' },
    { name: '大都', pinyin: 'dadou', meridian: '脾经', category: '荥', element: '火' },
    { name: '太白', pinyin: 'taibai', meridian: '脾经', category: '输', element: '土' },
    { name: '商丘', pinyin: 'shangqiu', meridian: '脾经', category: '经', element: '金' },
    { name: '阴陵泉', pinyin: 'yinlingquan', meridian: '脾经', category: '合', element: '水' },
  ],
  肺经: [
    { name: '少商', pinyin: 'shaoshang', meridian: '肺经', category: '井', element: '木' },
    { name: '鱼际', pinyin: 'yuji', meridian: '肺经', category: '荥', element: '火' },
    { name: '太渊', pinyin: 'taiyuan', meridian: '肺经', category: '输', element: '土' },
    { name: '经渠', pinyin: 'jingqu', meridian: '肺经', category: '经', element: '金' },
    { name: '尺泽', pinyin: 'chize', meridian: '肺经', category: '合', element: '水' },
  ],
  肾经: [
    { name: '涌泉', pinyin: 'yongquan', meridian: '肾经', category: '井', element: '木' },
    { name: '然谷', pinyin: 'rangu', meridian: '肾经', category: '荥', element: '火' },
    { name: '太溪', pinyin: 'taixi', meridian: '肾经', category: '输', element: '土' },
    { name: '复溜', pinyin: 'fuliu', meridian: '肾经', category: '经', element: '金' },
    { name: '阴谷', pinyin: 'yingu', meridian: '肾经', category: '合', element: '水' },
  ],
  心包经: [
    { name: '中冲', pinyin: 'zhongchong', meridian: '心包经', category: '井', element: '木' },
    { name: '劳宫', pinyin: 'laogong', meridian: '心包经', category: '荥', element: '火' },
    { name: '大陵', pinyin: 'daling', meridian: '心包经', category: '输', element: '土' },
    { name: '间使', pinyin: 'jianshi', meridian: '心包经', category: '经', element: '金' },
    { name: '曲泽', pinyin: 'quze', meridian: '心包经', category: '合', element: '水' },
  ],
}

/** 所有五输穴扁平化 */
export const ALL_FIVE_SHU: Acupoint[] = [
  ...Object.values(FIVE_SHU_POINTS_YANG).flat(),
  ...Object.values(FIVE_SHU_POINTS_YIN).flat(),
]

export function findAcupoint(name: string): Acupoint | undefined {
  return ALL_FIVE_SHU.find(a => a.name === name)
}

/** 十二时辰当令经络 */
export const SHI_CHEN_MERIDIANS: Record<string, string> = {
  子: '胆经', 丑: '肝经', 寅: '肺经', 卯: '大肠经',
  辰: '胃经', 巳: '脾经', 午: '心经', 未: '小肠经',
  申: '膀胱经', 酉: '肾经', 戌: '心包经', 亥: '三焦经',
}

/** 时辰 → 小时范围 */
export const SHI_CHEN_HOURS: Record<string, [number, number]> = {
  子: [23, 0], 丑: [1, 2], 寅: [3, 4], 卯: [5, 6],
  辰: [7, 8], 巳: [9, 10], 午: [11, 12], 未: [13, 14],
  申: [15, 16], 酉: [17, 18], 戌: [19, 20], 亥: [21, 22],
}

export function getShiChen(hour: number): string {
  for (const [sc, [start, end]] of Object.entries(SHI_CHEN_HOURS)) {
    if (start === 23) { if (hour >= 23 || hour < 1) return sc }
    else if (hour >= start && hour <= end) return sc
  }
  return '子'
}

/** 五行生克关系 */
export const ELEMENT_GENERATING: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' }
export const ELEMENT_CONTROLLING: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' }
