// 听记详情页 — 四份AI报告数据生成器
// 根据录音ID（行业+场景）生成不同的Mock报告数据

function vary(score, delta = 5) {
  return Math.min(100, Math.max(50, score + (Math.random() - 0.5) * delta * 2))
}

const industryNames = {
  bank: '银行金融', auto: '汽车销售', insurance: '保险',
  realestate: '房地产', education: '教育培训', medical: '医疗健康', retail: '零售消费'
}

const customerNames = { bank: '张总', auto: '李先生', insurance: '赵经理', realestate: '刘总', education: '陈家长', medical: '王主任', retail: '周女士' }

const customerProfiles = {
  bank: { position: '零售银行部总经理', traits: ['理性务实', '关注合规', '重视ROI', '决策审慎'], need1: '提升外拓拜访效率', need2: '客户经理过程管理', need3: '数据安全合规', need4: 'CRM系统对接' },
  auto: { position: '4S店总经理', traits: ['经验丰富', '价格敏感', '注重体验', '快节奏'], need1: '试驾转化率提升', need2: '客户跟进标准化', need3: '竞品应对策略', need4: '销售话术沉淀' },
  insurance: { position: '保险经纪公司副总', traits: ['风险意识强', '关注转化', '数据驱动', '务实'], need1: '客户需求精准识别', need2: '方案匹配效率', need3: '异议处理能力', need4: '成单转化率' },
  realestate: { position: '房产经纪公司区域总监', traits: ['决策果断', '关注成交', '重视服务', '务实'], need1: '看房跟进效率', need2: '户型推荐精准度', need3: '逼单话术优化', need4: '客户决策链分析' },
  education: { position: '培训机构校长', traits: ['教育情怀', '关注效果', '精打细算', '重口碑'], need1: '家长需求精准分析', need2: '课程匹配推荐', need3: '试听转化率', need4: '复购续费策略' },
  medical: { position: '医院科室主任', traits: ['严谨专业', '合规意识强', '关注疗效', '审慎'], need1: '产品合规沟通', need2: '学术推广效果', need3: '竞品差异化', need4: '医生关系维护' },
  retail: { position: '连锁门店运营经理', traits: ['数据敏感', '关注复购', '快节奏', '务实'], need1: '客户画像精准度', need2: '个性化推荐', need3: '复购预测', need4: '会员运营策略' }
}

const productSellings = {
  bank: ['AI实时语音转写+银行级安全加密', '智能客户画像：资产规模评估+理财偏好分析', '合规性自动检查，满足金融监管要求', '招行案例：拜访量+40%，评分+12分', '新人上手周期3月→1月'],
  auto: ['双麦降噪芯片，展厅/试驾场景清晰拾音', '试驾全程AI分析：客户关注点+竞品对比', '购车意向自动评级，精准跟进优先级', '某4S集团案例：试驾转化率+25%', '话术自动沉淀，快速复制Top Sales经验'],
  insurance: ['客户需求智能探测：保障缺口分析', '家庭风险画像：健康/意外/教育金全覆盖', '方案匹配度AI评分，拒绝"一刀切"', '异议处理话术库：来自金牌销售实战', '成单周期缩短40%'],
  realestate: ['看房全程录音+AI自动分析客户偏好', '户型智能匹配：预算/户型/学区多维度', '逼单时机AI识别：成交信号自动标注', '决策链分析：识别关键人和决策因素', '周度转化报告：自动生成团队数据看板'],
  education: ['课程体验全程录音+AI分析家长关注点', '学员画像：学习风格+薄弱环节+兴趣偏好', '课程匹配推荐引擎：提升试听转化率', '续费预测模型：识别高流失风险学员', '教学话术沉淀：优秀顾问经验可复制'],
  medical: ['学术拜访合规检查：自动检测超适应症表述', '产品知识AI评测：确保信息准确传递', '医生关注点分析：精准匹配学术需求', '竞品情报自动采集：差异化竞争优势', '拜访报告自动生成：节省90%文书时间'],
  retail: ['客户进店全程分析：停留时长+关注商品', 'AI客户画像：消费偏好+购买力+复购周期', '个性化推荐引擎：提升连带购买率', '会员分层运营：高价值客户自动识别', '店铺数据看板：销售转化漏斗实时监控']
}

export function generateRecordData(id) {
  const keys = Object.keys(customerProfiles)
  const key = keys[(id - 1) % keys.length]
  const industry = industryNames[key]
  const customerName = customerNames[key]
  const profile = customerProfiles[key]
  const sellings = productSellings[key]
  const baseScore = 75 + (id * 5) % 20

  return {
    record: {
      name: `录音#${id} - ${industry} - ${customerName}`,
      industry, scene: ['客户拜访','产品演示','商务谈判','售后跟进','需求调研'][(id-1)%5],
      salesPerson: ['王志华','朱炫','李飞','张锐','静妍','郑凯','潘璐'][(id-1)%7],
      duration: `${18 + (id*3)%40}分${(id*7)%60}秒`, date: `2026-05-${17 - (id-1)%7}`,
      device: `1B0126170000${(id*10+35)%100}`
    },
    sales: {
      totalScore: Math.round(baseScore + (id%2===0 ? 7 : -3)),
      dimensions: [
        { name: '客户洞察', score: Math.round(vary(baseScore+5,8)), weight: 44, color: '#409EFF', subDimensions: [
          { name: '需求挖掘能力', weight: 22, score: Math.round(vary(baseScore+8,5)) },
          { name: '客户互动能力', weight: 8, score: Math.round(vary(baseScore+2,5)) }
        ]},
        { name: '产品介绍', score: Math.round(vary(baseScore+3,8)), weight: 34, color: '#67C23A', subDimensions: [
          { name: '产品介绍完整度', weight: 22, score: Math.round(vary(baseScore+4,6)) },
          { name: '需求与产品匹配度', weight: 12, score: Math.round(vary(baseScore+6,6)) }
        ]},
        { name: '推进控单', score: Math.round(vary(baseScore-5,10)), weight: 22, color: '#E6A23C', subDimensions: [
          { name: '推进成交能力', weight: 10, score: Math.round(vary(baseScore-3,8)) },
          { name: '沟通逻辑清晰度', weight: 8, score: Math.round(vary(baseScore+2,5)) }
        ]}
      ],
      conversationLogic: {
        goal: [`了解${industry}解决方案`, '对比现有方案差异', '关注数据安全与合规', '评估投入产出比', '确认试用可行性'],
        painPoints: ['新人成长慢', '优秀经验难复制', '沟通数据不透明', `${industry}行业竞争激烈`, '管理成本高'],
        logicFlow: '需求摸底 → 方案介绍 → 痛点共鸣 → 案例佐证 → 差异化展示 → 异议处理 → 试用推进',
        result: `客户对方案表示认可，约定内部评估后确定${customerName}侧试用方案`
      },
      highlights: [
        `精准识别${industry}客户核心痛点，需求挖掘到位`,
        `产品介绍贴合${industry}行业特点，价值传递清晰`,
        `异议处理专业，全面回应客户顾虑`,
        `互动自然、共情到位，客户沟通意愿强`
      ],
      improvements: [
        '可补充更多行业同业案例增强说服力',
        '建议更主动确认决策流程和预算范围',
        '可给出更具体的下一步时间节点'
      ],
      overall: `本次${industry}客户拜访综合表现良好。销售在需求挖掘和产品匹配方面表现突出，精准捕捉了客户的核心诉求。客户意向明确，建议尽快推进试用方案。`
    },
    customer: {
      profile: {
        name: customerName, position: profile.position, industry,
        estimatedAge: `${40 + (id%10)}-${48 + (id%10)}岁`,
        decisionRole: id % 3 === 0 ? '关键决策人' : '重要影响者',
        traits: profile.traits
      },
      assetLevel: { level: id % 2 === 0 ? '高净值' : '中高净值', confidence: id % 2 === 0 ? '高' : '中' },
      needAnalysis: {
        explicit: [
          { need: profile.need1, urgency: '高', priority: 1 },
          { need: profile.need2, urgency: '高', priority: 2 },
          { need: profile.need3, urgency: '中', priority: 3 },
          { need: profile.need4, urgency: '中', priority: 4 }
        ],
        implicit: [
          { need: '降低团队培训成本', urgency: '中', confidence: 80 + (id%10) },
          { need: '建立标准化销售流程', urgency: '中', confidence: 75 + (id%8) },
          { need: '销售团队数字化管理', urgency: '高', confidence: 88 + (id%5) }
        ]
      },
      intentLevel: { level: baseScore > 85 ? '高意向' : '中高意向', score: Math.round(baseScore - 5 + (id%10)), signal: '明确表示内部评估后推进' },
      competitorInfo: [`已在考察某竞品方案`, `对${industry}定制化AI分析能力感兴趣`],
      budgetRange: `${50 + (id%3)*20}-${80 + (id%3)*20}万/年`,
      decisionChain: [`${customerNames[key]}→ 内部评估 → 方案对比 → 决策审批`],
      nextSteps: ['发送详细方案和案例', '约定下次演示时间', '确认试用规模和周期']
    },
    product: {
      score: Math.round(vary(baseScore+2,5)),
      clarity: { score: Math.round(vary(baseScore+4,6)), comment: '产品介绍逻辑清晰，从场景→功能→价值→案例逐步展开' },
      match: { score: Math.round(vary(baseScore+6,5)), comment: `精准匹配${industry}行业场景需求` },
      objection: { score: Math.round(vary(baseScore,8)), comment: '逐一回应价格、安全、适配等异议' },
      competitorHandling: { score: Math.round(vary(baseScore-3,8)), comment: '通过行业定制化能力形成差异化优势' },
      keySellingPoints: sellings
    },
    comprehensive: {
      totalScore: Math.round(baseScore + (id%2===0 ? 6 : -3)),
      scoreBreakdown: [
        { label: '销售能力', score: Math.round(vary(baseScore+4,5)), max: 100 },
        { label: '客户意向', score: Math.round(vary(baseScore,8)), max: 100 },
        { label: '产品力', score: Math.round(vary(baseScore+2,5)), max: 100 },
        { label: '成单概率', score: Math.round(vary(baseScore-2,8)), max: 100 }
      ],
      radarData: [
        { name: '需求挖掘', value: Math.round(vary(baseScore+8,5)) },
        { name: '产品介绍', value: Math.round(vary(baseScore+2,6)) },
        { name: '异议处理', value: Math.round(vary(baseScore-2,8)) },
        { name: '推进成交', value: Math.round(vary(baseScore-5,10)) },
        { name: '客户互动', value: Math.round(vary(baseScore+3,5)) },
        { name: '沟通逻辑', value: Math.round(vary(baseScore+5,5)) }
      ],
      conclusion: `${industry}客户拜访综合评估：销售整体表现良好，客户意向明确。建议补充同业案例，明确决策流程和时间节点，争取2周内推进到试用阶段。`,
      timeline: [
        { step: '第1天', action: '发送详细方案+行业案例' },
        { step: '第3-5天', action: '带样机现场演示，确定试用方案' },
        { step: '第7-14天', action: '签署试用协议，启动试点' },
        { step: '试用后', action: '根据数据报告推进正式合作' }
      ]
    }
  }
}

// 为模板预览生成数据（基于模板配置）
export function generatePreviewData(template) {
  const tpl = template || {}
  const hasScore = tpl.hasScore !== false
  const isScoring = tpl.templateType === 'scoring'
  const isReport = tpl.templateType === 'report'
  const baseScore = 85 + Math.floor(Math.random() * 12)

  const dims = (tpl.dimensionConfig || []).map((d, i) => ({
    name: d.name || `维度${i+1}`,
    score: Math.round(vary(baseScore - i*3, 6)),
    weight: d.weight || Math.floor(100 / (tpl.dimensionConfig?.length || 3)),
    color: ['#409EFF','#67C23A','#E6A23C','#F56C6C','#909399'][i%5],
    subDimensions: (d.children || []).map(c => ({
      name: c.name, weight: c.weight || 5,
      score: Math.round(vary(baseScore - i*2, 5))
    }))
  }))

  const sections = (tpl.sections || []).length ? tpl.sections : [
    { title: '沟通概况', type: 'summary', prompt: '总结沟通基本信息' },
    { title: '要点分析', type: 'custom', prompt: '分析核心要点' },
    { title: '行动建议', type: 'suggestions', prompt: '给出行动建议' }
  ]

  return {
    sales: {
      totalScore: hasScore ? Math.round(vary(baseScore, 4)) : null,
      dimensions: dims,
      conversationLogic: {
        goal: ['了解产品方案价值', '评估可行性'],
        painPoints: ['团队效率待提升', '经验难以复制'],
        logicFlow: '需求摸底 → 方案介绍 → 案例佐证 → 试用推进',
        result: '客户认可方案价值，进入下一步评估'
      },
      highlights: ['需求挖掘精准', '产品匹配到位', '沟通专业高效'],
      improvements: ['可补充更多案例', '明确下一步时间节点'],
      overall: `本次沟通整体表现${hasScore ? '优秀' : '良好'}。${hasScore ? `综合评分${Math.round(vary(baseScore,4))}分。` : ''}客户意向明确，建议尽快推进。`
    },
    customer: {
      profile: {
        name: '示例客户', position: '部门负责人',
        industry: (tpl.industries || ['通用'])[0] || '通用',
        estimatedAge: '40-45岁', decisionRole: '关键决策人',
        traits: ['务实', '关注效率', '决策审慎']
      },
      assetLevel: { level: '中高净值', confidence: '中' },
      needAnalysis: {
        explicit: [
          { need: '提升工作效率', urgency: '高', priority: 1 },
          { need: '数据化管理', urgency: '中', priority: 2 },
          { need: '降低成本', urgency: '中', priority: 3 }
        ],
        implicit: [
          { need: '团队标准化', urgency: '中', confidence: 82 },
          { need: '竞争力提升', urgency: '中', confidence: 76 }
        ]
      },
      intentLevel: { level: '中高意向', score: Math.round(vary(baseScore - 3, 5)), signal: '明确表达进一步了解的意愿' },
      competitorInfo: ['正在考察其他方案'],
      budgetRange: '待确认',
      decisionChain: ['客户负责人 → 内部评估 → 决策'],
      nextSteps: ['发送详细方案', '安排产品演示', '确认试用方案']
    },
    product: {
      score: hasScore ? Math.round(vary(baseScore + 2, 5)) : null,
      clarity: { score: Math.round(vary(baseScore + 3, 5)), comment: '产品介绍条理清晰' },
      match: { score: Math.round(vary(baseScore + 5, 5)), comment: '精准匹配客户场景需求' },
      objection: { score: Math.round(vary(baseScore - 1, 6)), comment: '有效回应客户异议' },
      competitorHandling: { score: Math.round(vary(baseScore - 3, 6)), comment: '差异化优势展示到位' },
      keySellingPoints: ['核心功能突出', '行业定制化能力', '成功案例佐证', '服务支持完善', '性价比优势']
    },
    comprehensive: {
      totalScore: hasScore ? Math.round(vary(baseScore, 4)) : null,
      scoreBreakdown: hasScore ? [
        { label: '综合表现', score: Math.round(vary(baseScore + 1, 4)), max: 100 },
        { label: '客户匹配', score: Math.round(vary(baseScore + 3, 4)), max: 100 },
        { label: '方案质量', score: Math.round(vary(baseScore, 5)), max: 100 },
        { label: '推进概率', score: Math.round(vary(baseScore - 2, 6)), max: 100 }
      ] : [],
      radarData: dims.slice(0, 6).map(d => ({ name: d.name, value: d.score })),
      conclusion: `基于「${tpl.name || '当前模板'}」的分析结果。${hasScore ? `综合评分良好。` : ''}客户对方案表现出明确兴趣，建议按标准流程推进。${isReport ? '本报告重点展示了客户画像和沟通要点分析。' : ''}`,
      timeline: [
        { step: '第1天', action: '发送方案资料' },
        { step: '第3天', action: '跟进客户反馈' },
        { step: '第7天', action: '安排深入沟通' },
        { step: '第14天', action: '推进合作落地' }
      ]
    },
    templateName: tpl.name || '未命名模板',
    templateType: tpl.templateType || 'scoring'
  }
}
