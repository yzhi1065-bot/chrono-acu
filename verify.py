#!/usr/bin/env python3
"""算法正确性验证 — 纯数学验证"""

def test_ganzhi():
    """验证干支计算 (基准: 2000-01-01 = 戊午 = index 54)"""
    TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
    DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
    
    def get_ganzhi(year, month, day):
        """格里历→日干支 用JD差"""
        def jd(y, m, d):
            if m <= 2:
                y -= 1
                m += 12
            a = y // 100
            b = 2 - a + a // 4
            return int(365.25 * (y + 4716)) + int(30.6001 * (m + 1)) + d + b - 1524.5
        
        ref_jd = 2451545  # 2000-01-01 noon
        target_jd = jd(year, month, day)
        diff = round(target_jd - ref_jd)
        idx = (diff + 54) % 60
        gan = TIAN_GAN[idx % 10]
        zhi = DI_ZHI[idx % 12]
        return gan, zhi, idx
    
    checks = [
        (2000, 1, 1, '戊', '午', 54),
        (2000, 1, 7, '甲', '子', 0),
        (2024, 2, 10, '甲', '辰', 40),
        (2024, 3, 21, '甲', '申', 20),
        (2024, 6, 21, '丙', '辰', 52),
    ]
    
    for y, m, d, exp_g, exp_z, exp_i in checks:
        g, z, i = get_ganzhi(y, m, d)
        ok = g == exp_g and z == exp_z and i == exp_i
        status = '✓' if ok else '✗'
        print(f"  {status} {y}-{m:02d}-{d:02d}: {g}{z} (idx={i}) expected {exp_g}{exp_z} (idx={exp_i})")
        if not ok:
            return False
    return True


def test_wushudun():
    """验证五鼠遁时干"""
    DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
    DUN2 = {
        '甲': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
        '乙': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
        '丙': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
        '丁': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
        '戊': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
        '己': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
        '庚': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
        '辛': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
        '壬': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
        '癸': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
    }
    
    def get_hour_gan(day_gan, hour_zhi):
        return DUN2[day_gan][DI_ZHI.index(hour_zhi)]
    
    checks = [
        ('甲', '午', '庚'),
        ('甲', '巳', '己'),
        ('乙', '子', '丙'),
        ('乙', '酉', '乙'),
        ('丙', '子', '戊'),
        ('丁', '子', '庚'),
        ('戊', '子', '壬'),
        ('己', '子', '甲'),
        ('庚', '子', '丙'),
    ]
    
    for dg, hz, exp in checks:
        r = get_hour_gan(dg, hz)
        ok = r == exp
        status = '✓' if ok else '✗'
        print(f"  {status} {dg}日{hz}时: {r} (expected {exp})")
        if not ok:
            return False
    return True


def test_nazi():
    """验证纳子法"""
    SHI_CHEN = {0:'子',1:'丑',2:'寅',3:'卯',4:'辰',5:'巳',
                6:'午',7:'未',8:'申',9:'酉',10:'戌',11:'亥'}
    
    # 当令经
    ON_DUTY = {0:'胆经',2:'肝经',4:'肺经',6:'大肠经',
               8:'胃经',10:'脾经',12:'心经',14:'小肠经',
               16:'膀胱经',18:'肾经',20:'心包经',22:'三焦经'}
    
    # 五输穴 (心经: 木少冲, 火少府, 土神门, 金灵道, 水少海)
    HEART_POINTS = {'木':'少冲', '火':'少府', '土':'神门', '金':'灵道', '水':'少海'}
    LIVER_POINTS = {'木':'大敦', '火':'行间', '土':'太冲', '金':'中封', '水':'曲泉'}
    MERIDIAN_ELEMENT = {'胆经':'木','肝经':'木','心经':'火','脾经':'土',
                        '肺经':'金','肾经':'水','胃经':'土','大肠经':'金',
                        '小肠经':'火','膀胱经':'水','心包经':'火','三焦经':'火'}
    GENERATING = {'木':'火','火':'土','土':'金','金':'水','水':'木'}
    
    checks = [
        (12, '午', '心经', '火', '少冲', '神门'),  # 午时
        (2, '丑', '肝经', '木', '曲泉', '行间'),    # 丑时
        (10, '巳', '脾经', '土', '大都', '商丘'),   # 巳时
    ]
    
    for hour, exp_sc, exp_mer, exp_ele, exp_ton, exp_sed in checks:
        # 找到对应的时辰
        sc_key = hour
        sc = SHI_CHEN.get(hour, '?')
        
        # 找当令经: 子0,丑2,寅4,...
        # hour → sc_index = hour//2 for even hours
        sc_idx = hour // 2
        sc_list = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
        sc_name = sc_list[sc_idx % 12]
        
        meridian_name = ON_DUTY.get(hour // 2 * 2, '?')
        if hour < 1 or hour >= 23:
            meridian_name = '胆经'
        elif hour < 3: meridian_name = '肝经'
        elif hour < 5: meridian_name = '肺经'
        elif hour < 7: meridian_name = '大肠经'
        elif hour < 9: meridian_name = '胃经'
        elif hour < 11: meridian_name = '脾经'
        elif hour < 13: meridian_name = '心经'
        elif hour < 15: meridian_name = '小肠经'
        elif hour < 17: meridian_name = '膀胱经'
        elif hour < 19: meridian_name = '肾经'
        elif hour < 21: meridian_name = '心包经'
        else: meridian_name = '三焦经'
        
        me = MERIDIAN_ELEMENT.get(meridian_name, '土')
        mother_elem = [k for k,v in GENERATING.items() if v == me][0]
        child_elem = GENERATING[me]
        
        # 找穴 (简化: 直接从已知表查)
        if meridian_name == '心经':
            tonify = HEART_POINTS[mother_elem]
            sedate = HEART_POINTS[child_elem]
        elif meridian_name == '肝经':
            tonify = LIVER_POINTS[mother_elem]
            sedate = LIVER_POINTS[child_elem]
        elif meridian_name == '脾经':
            SPLEEN = {'火':'大都','木':'太白','金':'商丘'}
            tonify = SPLEEN.get(mother_elem, '?')
            sedate = SPLEEN.get(child_elem, '?')
        else:
            tonify, sedate = '?', '?'
        
        ok = (sc_name == exp_sc and meridian_name == exp_mer and 
              tonify == exp_ton and sedate == exp_sed)
        status = '✓' if ok else '✗'
        print(f"  {status} {hour}h={sc_name}: {meridian_name} 补{tonify}({mother_elem})/泻{sedate}({child_elem})")
        if not ok:
            print(f"    Expected: {exp_sc}/{exp_mer} 补{exp_ton}/泻{exp_sed}")
            return False
    return True


def test_najia():
    """验证纳甲法"""
    # 逐日按时定穴诀
    NAJIA = {
        '甲': {'甲':'足窍阴','丙':'前谷','戊':'陷谷','庚':'阳溪','壬':'委中'},
        '乙': {'乙':'大敦','丁':'少府','己':'太白','辛':'经渠','癸':'阴谷'},
        '丙': {'丙':'少泽','戊':'内庭','庚':'三间','壬':'昆仑','甲':'阳陵泉'},
        '丁': {'丁':'少冲','己':'大都','辛':'太渊','癸':'复溜','乙':'曲泉'},
        '戊': {'戊':'厉兑','庚':'二间','壬':'束骨','甲':'阳辅','丙':'小海'},
        '己': {'己':'隐白','辛':'鱼际','癸':'太溪','乙':'中封','丁':'少海'},
        '庚': {'庚':'商阳','壬':'通谷','甲':'足临泣','丙':'阳谷','戊':'足三里'},
        '辛': {'辛':'少商','癸':'然谷','乙':'太冲','丁':'灵道','己':'阴陵泉'},
        '壬': {'壬':'至阴','甲':'侠溪','丙':'后溪','戊':'解溪','庚':'曲池'},
        '癸': {'癸':'涌泉','乙':'行间','丁':'神门','己':'商丘','辛':'尺泽'},
    }
    
    # 时干查找(五鼠遁)
    WU_SHU = {
        '甲':['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
        '乙':['丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
        '丙':['戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
        '丁':['庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
        '戊':['壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
        '己':['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
        '庚':['丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
        '辛':['戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
        '壬':['庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
        '癸':['壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
    }
    DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
    
    def get_hour_gan(day_gan, hour_zhi):
        return WU_SHU[day_gan][DI_ZHI.index(hour_zhi)]
    
    checks = [
        ('甲', 12, '午', '庚', '阳溪'),      # 甲日午时→庚时→阳溪
        ('甲', 0, '子', '甲', '足窍阴'),     # 甲日子时→甲时→足窍阴
        ('甲', 16, '申', '壬', '委中'),      # 甲日申时→壬时→委中
        ('乙', 18, '酉', '乙', '大敦'),      # 乙日酉时→乙时→大敦
        ('丙', 16, '申', '丙', '少泽'),      # 丙日申时→丙时→少泽
        ('戊', 12, '午', '戊', '厉兑'),      # 戊日午时→戊时→厉兑
    ]
    
    for day_gan, hour, exp_zhi, exp_hg, exp_point in checks:
        zhi = DI_ZHI[hour // 2 % 12]
        hour_gan = get_hour_gan(day_gan, zhi)
        opened = NAJIA[day_gan].get(hour_gan, None)
        ok = zhi == exp_zhi and hour_gan == exp_hg and opened == exp_point
        status = '✓' if ok else '✗'
        print(f"  {status} {day_gan}日{hour}h({zhi}时) → {hour_gan}时开{opened}")
        if not ok:
            print(f"    Expected: {zhi}时/{exp_hg}时/{exp_point}")
            return False
    return True


def test_linggui():
    """验证灵龟八法"""
    GAN_NUM = {'甲':1,'乙':2,'丙':3,'丁':4,'戊':5,'己':6,'庚':7,'辛':8,'壬':9,'癸':10}
    ZHI_NUM = {'子':1,'丑':2,'寅':3,'卯':4,'辰':5,'巳':6,'午':7,'未':8,'申':9,'酉':10,'戌':11,'亥':12}
    JIU_GONG = {
        1: ('公孙','内关','坎','北'),
        2: ('内关','公孙','坤','西南'),
        3: ('外关','足临泣','震','东'),
        4: ('足临泣','外关','巽','东南'),
        5: ('后溪','申脉','中','中'),
        6: ('申脉','后溪','乾','西北'),
        7: ('照海','列缺','兑','西'),
        8: ('列缺','照海','艮','东北'),
        9: ('照海','列缺','离','南'),
    }
    
    # 直接用已知数据
    # 甲子日甲子时: 1+1+1+1=4, 阳日÷9余4, 足临泣/外关
    dg, dz, hz = '甲', '子', '子'
    hg = '甲'
    s = GAN_NUM[dg] + ZHI_NUM[dz] + GAN_NUM[hg] + ZHI_NUM[hz]
    r = s % 9
    if r == 0: r = 9
    host, guest, gua, _ = JIU_GONG[r]
    ok = r == 4 and host == '足临泣'
    print(f"  {'✓' if ok else '✗'} 甲子日子时: sum={s}, 余{r}={gua}卦 主{host}配{guest}")
    
    # 甲申日庚午时: 1+9+7+7=24, 24%9=6, 申脉/后溪
    dg2, dz2, hz2 = '甲', '申', '午'
    hg2 = '庚'
    s2 = GAN_NUM[dg2] + ZHI_NUM[dz2] + GAN_NUM[hg2] + ZHI_NUM[hz2]
    r2 = s2 % 9
    if r2 == 0: r2 = 9
    host2, guest2, gua2, _ = JIU_GONG[r2]
    ok2 = r2 == 6 and host2 == '申脉'
    print(f"  {'✓' if ok2 else '✗'} 甲申日午时: sum={s2}, 余{r2}={gua2}卦 主{host2}配{guest2}")
    
    return ok and ok2


def test_feiteng():
    """验证飞腾八法"""
    FEI_TENG = {
        '壬':('公孙','乾'), '甲':('公孙','乾'),
        '丙':('内关','艮'), '戊':('足临泣','坎'),
        '庚':('外关','震'), '辛':('后溪','巽'),
        '乙':('申脉','坤'), '癸':('申脉','坤'),
        '己':('列缺','离'), '丁':('照海','兑'),
    }
    WU_SHU = {
        '甲':['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
        '乙':['丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
    }
    DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
    
    def get_hour_gan(dg, hz): return DUN2[dg][DI_ZHI.index(hz)]
    
    DUN2 = {
        '甲': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
        '乙': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
        '丙': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
        '丁': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
        '戊': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
        '己': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
        '庚': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
        '辛': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
        '壬': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
        '癸': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
    }
    hg = get_hour_gan('甲', '午')
    point, gua = FEI_TENG.get(hg, ('?','?'))
    ok1 = hg == '庚' and point == '外关' and gua == '震'
    print(f"  {'✓' if ok1 else '✗'} 甲日午时(庚时): {point}({gua})")
    
    # 甲日申时 = 壬时 → 公孙/乾
    hg2 = get_hour_gan('甲', '申')
    point2, gua2 = FEI_TENG.get(hg2, ('?','?'))
    ok2 = hg2 == '壬' and point2 == '公孙' and gua2 == '乾'
    print(f"  {'✓' if ok2 else '✗'} 甲日申时(壬时): {point2}({gua2})")
    
    # 乙日子时 = 丙时 → 内关/艮
    hg3 = get_hour_gan('乙', '子')
    point3, gua3 = FEI_TENG.get(hg3, ('?','?'))
    ok3 = hg3 == '丙' and point3 == '内关' and gua3 == '艮'
    print(f"  {'✓' if ok3 else '✗'} 乙日子时(丙时): {point3}({gua3})")
    
    return ok1 and ok2 and ok3


# ====== 运行所有测试 ======
print("=" * 50)
print("历法·子午灵龟 算法验证")
print("=" * 50)

results = []
print("\n📅 干支计算测试:")
results.append(('干支', test_ganzhi()))

print("\n🕐 五鼠遁（时干）测试:")
results.append(('时干', test_wushudun()))

print("\n🌿 纳子法测试:")
results.append(('纳子法', test_nazi()))

print("\n☯️ 纳甲法测试:")
results.append(('纳甲法', test_najia()))

print("\n🐢 灵龟八法测试:")
results.append(('灵龟八法', test_linggui()))

print("\n🕊️ 飞腾八法测试:")
results.append(('飞腾八法', test_feiteng()))

print("\n" + "=" * 50)
passed = sum(1 for _, r in results if r)
failed = sum(1 for _, r in results if not r)
for name, r in results:
    print(f"  {'✓' if r else '✗'} {name}")
print(f"\n结果: {passed} passed, {failed} failed")
print("=" * 50)
