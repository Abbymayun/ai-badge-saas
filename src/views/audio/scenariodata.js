// ============ 各行业场景预览数据生成器 ============
function vary(score, delta = 5) { return Math.min(100, Math.max(50, score + (Math.random() - 0.5) * delta * 2)) }

const scenarioData = {
  // 会议总结
  meeting: {
    title: 'AI智能胸牌产品方案讨论会',
    date: '2026-05-17 09:30-11:00',
    attendees: '王志华(销售)、张总(客户)、李经理(技术)、王主任(采购)',
    summary: '本次会议围绕AI智能胸牌在银行客户经理外拓场景的应用展开深入讨论。客户方对产品价值高度认可，重点讨论了数据安全、系统对接、试用方案等关键议题。',
    topics: [
      { topic: '产品功能演示与场景匹配', discussion: '王志华详细演示了AI智能胸牌的录音转写、AI分析和话术提取功能。张总认为产品贴合银行外拓场景，特别是自动生成客户画像和拜访报告的功能很有价值。', decision: '产品功能满足需求，无需二次开发' },
      { topic: '数据安全与合规', discussion: '李经理详细询问了数据加密标准、等保认证和私有化部署方案。我方展示了等保三级证书和招商银行案例的安全架构方案。', decision: '安全方案满足要求，需在合同中明确SLA条款' },
      { topic: '系统对接方案', discussion: '讨论了与银行现有CRM系统的数据互通方案。我方提供了标准API接口文档，确认可在2周内完成对接开发。', decision: '确认API对接方案，技术评估通过' },
      { topic: '试用计划与商务条款', discussion: '王主任提出先选20名客户经理试用3个月。讨论了年费方案（200人规模约70万/年），含硬件+SaaS平台+1次系统定制。', decision: '启动20人3个月试用，商务条款进入审批流程' }
    ],
    decisions: [
      '确认产品功能满足需求，无需二次开发',
      '数据安全方案通过评估，SLA条款写入合同',
      'API对接方案确认，预计2周完成',
      '启动20人3个月免费试用'
    ],
    actionItems: [
      { task: '提供详细试用方案', owner: '王志华', deadline: '5月18日' },
      { task: '准备20台试用设备', owner: '运营部', deadline: '5月20日' },
      { task: '完成API对接开发', owner: '技术部(李经理)', deadline: '5月30日' },
      { task: '内部审批商务条款', owner: '张总/王主任', deadline: '5月21日' },
      { task: '确定试用启动日期', owner: '王志华', deadline: '5月22日' }
    ],
    nextMeeting: '5月22日 14:00 签订试用协议'
  },

  // 医疗合规沟通检查
  medical: {
    doctor: { name: '王主任', dept: '心内科', hospital: '杭州市第一人民医院', level: '科室主任/主任医师' },
    visitDate: '2026-05-16 15:00',
    product: 'XX降压药（第三代ARB类）',
    compliance: {
      overall: '合规',
      issues: [
        { item: '适应症表述', status: 'pass', detail: '严格按说明书适应症范围介绍，未超适应症推广' },
        { item: '不良反应告知', status: 'pass', detail: '主动提及常见不良反应（头晕、乏力）及发生率，建议定期监测血压' },
        { item: '禁忌症询问', status: 'pass', detail: '询问了患者过敏史、妊娠情况、肾功能状况' },
        { item: '竞品比较', status: 'pass', detail: '与竞品比较时引用公开文献数据，未做不实对比' },
        { item: '用法用量', status: 'pass', detail: '严格按照说明书推荐剂量，强调了餐后服用和固定时间' }
      ]
    },
    visitQuality: {
      score: 88,
      dimensions: [
        { name: '学术专业性', score: 90, comment: '医学知识准确，引用最新指南（2025 ESC高血压指南）' },
        { name: '沟通有效性', score: 85, comment: '倾听医生临床需求，针对性解答，互动良好' },
        { name: '合规规范性', score: 92, comment: '合规表现优秀，无超适应症推广，不良反应告知到位' },
        { name: '关系维护', score: 85, comment: '关注医生科研需求，主动提供文献支持，建立专业信任' }
      ]
    },
    doctorFeedback: '对产品临床数据和研究进展表示认可，愿意在合适患者中试用。关注点：长期疗效数据、医保覆盖情况、与其他降压药的联用方案。'
  },

  // 教育课程推荐
  education: {
    parent: { name: '陈家长', child: { name: '小明', grade: '五年级', subjects: ['数学', '英语'] } },
    needs: { goal: '提升数学成绩，准备小升初', painPoint: '应用题理解困难，计算粗心', budget: '8000-12000元/年', schedule: '周末可安排2小时' },
    recommendation: {
      course: '小学数学思维训练班（高级）',
      reason: '针对应用题薄弱环节，重点训练逻辑思维和解题技巧。小班教学（6人），每节课配套1对1答疑。',
      teacher: '张老师，10年教龄，所带学生85%考入重点初中',
      schedule: '周六上午 9:00-11:00', price: '9600元/年'
    },
    salesAnalysis: { score: 82, rapport: '与家长建立良好信任，充分了解孩子学习情况', matching: '精准匹配课程与孩子薄弱环节', persuasion: '用数据（升学率85%）和师资背书增强说服力' },
    nextStep: '安排本周六免费试听，试听后确定报名'
  },

  // 地产看房跟进
  realestate: {
    customer: { name: '刘总', family: '三口之家', budget: '400-500万', target: '三房两卫，学区房', urgency: '计划3个月内购房' },
    property: { name: '滨江·春江花月', type: '三房两厅两卫', area: '128㎡', floor: '12层/总18层', price: '468万', school: '实验小学（步行5分钟）' },
    visitAnalysis: {
      liked: ['南北通透户型', '12楼黄金楼层采光好', '实验小学学区', '小区环境好', '精装修拎包入住'],
      concerns: ['总价略超预算', '离地铁站1.2公里', '车位配比1:0.8偏低'],
      objections: [
        { concern: '价格偏高', response: '对比同小区同户型成交均价480万，468万已低于市场价。首付20%约94万，月供约1.6万。' },
        { concern: '交通不便', response: '小区门口有公交站，地铁18号线规划中，预计2027年通车。' }
      ]
    },
    dealProbability: { score: 75, signal: '愿意带家人第二次看房' },
    nextStep: '本周六下午带家人看房+谈价格，争取锁定意向'
  },

  // 零售客户服务
  retail: {
    customer: { name: '周女士', age: '32岁', occupation: '白领', visitDate: '2026-05-15' },
    behavior: { browsingTime: '25分钟', touchedProducts: ['护肤品套装', '香水', '口红'], purchased: ['精华液x1', '面霜x1'], totalSpend: '1280元', memberLevel: '金卡会员' },
    insights: {
      preferences: ['偏爱日系品牌', '关注成分', '重视抗衰老', '对价格不敏感'],
      purchaseTriggers: 'BA专业讲解成分功效+试用体验后决定购买',
      upsell: '推荐同系列眼霜（420元），客户表示考虑，加了企业微信',
      loyalty: '金卡会员，过去12个月消费8次，累计消费额9600元，复购周期约45天',
      nextRecommend: '建议2周后推送同品牌新上市面膜+会员专属折扣'
    }
  },

  // 保险需求分析
  insurance: {
    customer: { name: '赵经理', age: '38岁', family: '配偶+1个孩子（8岁）', income: '家庭年收入约50万' },
    currentCoverage: { life: '公司团险50万', medical: '社保+企业补充医疗', accident: '公司团险30万', criticalIllness: '无', education: '无' },
    gapAnalysis: [
      { gap: '重疾保障缺失', risk: '家庭成员无商业重疾险，一旦发生重大疾病，医疗费用+收入损失将是重大经济负担', suggestion: '建议配置重疾险，保额≥年收入3-5倍（150万-250万）' },
      { gap: '寿险保额不足', risk: '仅50万团险，若发生极端风险，房贷+子女教育费用远超此额度', suggestion: '建议补充定期寿险200-300万，覆盖房贷+子女教育金' },
      { gap: '子女教育金无储备', risk: '孩子8岁，10年后大学，教育费用约50-100万无储备', suggestion: '建议配置教育年金或增额终身寿，年缴2-3万' }
    ],
    recommendation: [
      { product: 'XX重疾险', coverage: '100万', premium: '约8000元/年', reason: '覆盖70种重疾+30种轻症，含轻症豁免' },
      { product: 'XX定期寿险', coverage: '200万', premium: '约3000元/年', reason: '保障至60岁，覆盖房贷+子女教育关键期' },
      { product: 'XX教育年金', coverage: '年缴2万', premium: '2万/年', reason: '18-21岁每年领取5万教育金' }
    ],
    totalPremium: '约3.1万/年（占家庭年收入6.2%，在合理范围内）'
  },

  // 营业厅服务
  serviceHall: {
    customer: { name: '王先生', type: 'VIP客户', visitPurpose: '办理大额转账+理财咨询' },
    service: {
      waitTime: '2分钟（VIP通道）',
      serviceTime: '18分钟',
      staff: '大堂经理 林小姐',
      satisfaction: 98
    },
    serviceFlow: [
      { step: '迎接引导', score: 98, detail: '主动迎接，微笑问候，快速识别VIP身份引导至贵宾室' },
      { step: '需求了解', score: 95, detail: '耐心倾听，确认转账金额和收款信息，了解理财偏好' },
      { step: '业务办理', score: 100, detail: '操作熟练，一次性完成转账+风险评估问卷+产品推荐' },
      { step: '产品推荐', score: 90, detail: '根据客户风险偏好（稳健型）推荐大额存单+纯债基金组合' },
      { step: '送别服务', score: 96, detail: '送至门口，提醒注意资金安全，预约下次服务时间' }
    ],
    highlights: ['VIP身份快速识别', '一站式完成多项业务', '精准理财推荐匹配风险偏好'],
    improvements: ['可主动添加企业微信便于后续服务', '大额转账后建议增加安全提醒短信']
  }
}

// 获取场景预览数据
export function getScenarioPreviewData(templateName, templateType, industries) {
  const industry = (industries || ['通用'])[0]
  
  // 识别场景
  let scenario = 'generic'
  if (templateName.includes('会议') || templateName.includes('总结')) scenario = 'meeting'
  else if (templateName.includes('医疗') || templateName.includes('合规')) scenario = 'medical'
  else if (templateName.includes('教育') || templateName.includes('课程')) scenario = 'education'
  else if (templateName.includes('地产') || templateName.includes('看房')) scenario = 'realestate'
  else if (templateName.includes('零售') || templateName.includes('客户画像')) scenario = 'retail'
  else if (templateName.includes('保险')) scenario = 'insurance'
  else if (templateName.includes('营业厅') || templateName.includes('服务')) scenario = 'serviceHall'
  else if (templateName.includes('银行') || industry.includes('银行')) scenario = 'meeting' // 银行默认会议
  else if (templateName.includes('汽车')) scenario = 'realestate' // 汽车类似看房
  else if (templateName.includes('销售复盘')) scenario = 'meeting'

  const baseScore = 82 + Math.floor(Math.random() * 12)
  const sdata = scenarioData[scenario] || scenarioData.meeting

  // 根据场景生成适合的报告数据
  return buildScenarioReport(sdata, scenario, baseScore, templateName)
}

function buildScenarioReport(sdata, scenario, baseScore, templateName) {
  const report = {
    scenario,
    templateName,
    scenarioData: sdata,

    sales: {
      totalScore: Math.round(vary(baseScore, 4)),
      dimensions: [
        { name: '专业能力', score: Math.round(vary(baseScore+5,5)), weight: 35, color: '#409EFF', subDimensions: [
          { name: '产品/业务知识', weight: 20, score: Math.round(vary(baseScore+8,4)) },
          { name: '流程规范性', weight: 15, score: Math.round(vary(baseScore+3,5)) }
        ]},
        { name: '沟通能力', score: Math.round(vary(baseScore+2,6)), weight: 35, color: '#67C23A', subDimensions: [
          { name: '需求理解', weight: 18, score: Math.round(vary(baseScore+5,5)) },
          { name: '表达清晰度', weight: 17, score: Math.round(vary(baseScore,5)) }
        ]},
        { name: '服务意识', score: Math.round(vary(baseScore-1,6)), weight: 30, color: '#E6A23C', subDimensions: [
          { name: '主动服务', weight: 15, score: Math.round(vary(baseScore+3,6)) },
          { name: '客户满意度', weight: 15, score: Math.round(vary(baseScore-2,5)) }
        ]}
      ],
      conversationLogic: {
        goal: getScenarioGoal(scenario),
        painPoints: ['效率待提升', '经验难沉淀', '数据不透明'],
        logicFlow: '需求了解 → 方案匹配 → 异议处理 → 确认推进',
        result: '沟通达成预期目标，客户认可方案价值'
      },
      highlights: ['专业能力突出', '沟通高效流畅', '服务态度良好'],
      improvements: ['可补充更多数据佐证', '明确下一步行动时间'],
      overall: `${templateName}效果预览。基于行业真实场景生成的分析示例。`
    },
    customer: buildCustomerSection(sdata, scenario),
    product: buildProductSection(sdata, scenario, baseScore),
    comprehensive: {
      totalScore: Math.round(vary(baseScore, 3)),
      scoreBreakdown: [
        { label: '专业能力', score: Math.round(vary(baseScore+3,4)), max: 100 },
        { label: '沟通效果', score: Math.round(vary(baseScore,5)), max: 100 },
        { label: '客户满意', score: Math.round(vary(baseScore-2,5)), max: 100 },
        { label: '推进概率', score: Math.round(vary(baseScore-3,6)), max: 100 }
      ],
      radarData: [
        { name: '专业度', value: Math.round(vary(baseScore+5,4)) },
        { name: '沟通力', value: Math.round(vary(baseScore+2,5)) },
        { name: '服务意识', value: Math.round(vary(baseScore,6)) },
        { name: '规范性', value: Math.round(vary(baseScore+3,5)) },
        { name: '满意度', value: Math.round(vary(baseScore-2,5)) },
        { name: '效率', value: Math.round(vary(baseScore+1,5)) }
      ],
      conclusion: generateConclusion(scenario, baseScore, templateName),
      timeline: [
        { step: '第1天', action: '发送跟进资料' },
        { step: '第3天', action: '电话回访确认' },
        { step: '第7天', action: '推进下一步合作' }
      ]
    }
  }

  return report
}

function getScenarioGoal(scenario) {
  const goals = {
    meeting: '讨论产品方案、确认技术对接、明确合作模式',
    medical: '了解产品临床价值、评估合规性、建立学术合作',
    education: '了解孩子学习情况、匹配课程方案、推动试听',
    realestate: '了解客户家庭需求、推荐合适房源、推动二次看房',
    retail: '提供专业产品推荐、提升客单价、增强会员粘性',
    insurance: '识别家庭保障缺口、推荐合适方案、推动投保决策',
    serviceHall: '高效办理业务、挖掘潜在需求、提升客户体验',
    generic: '了解客户需求、推荐匹配方案、推动合作'
  }
  return goals[scenario] || goals.generic
}

function buildCustomerSection(sdata, scenario) {
  const base = {
    profile: { name: '客户', position: '负责人', industry: '通用', estimatedAge: '35-45岁', decisionRole: '决策人', traits: ['务实', '理性'] },
    assetLevel: { level: '中等', confidence: '中' },
    needAnalysis: { explicit: [{ need: '提升效率', urgency: '高', priority: 1 }], implicit: [{ need: '标准化管理', urgency: '中', confidence: 80 }] },
    intentLevel: { level: '意向明确', score: 82, signal: '愿意进一步了解' },
    competitorInfo: [], budgetRange: '待确认', decisionChain: ['客户 → 评估 → 决策'],
    nextSteps: ['发送资料', '安排演示', '确认方案']
  }

  // 根据场景覆盖
  if (scenario === 'meeting' && sdata.attendees) {
    base.profile = { name: sdata.attendees.split('、')[1] || '张总', position: '部门负责人', industry: '金融', estimatedAge: '45-50岁', decisionRole: '关键决策人', traits: ['专业', '关注合规', '决策审慎'] }
    base.nextSteps = (sdata.actionItems || []).map(a => `${a.task}（${a.owner}，${a.deadline}）`)
  }
  if (scenario === 'medical') {
    base.profile = { name: sdata.doctor?.name || '王主任', position: sdata.doctor?.dept || '科室', industry: '医疗', estimatedAge: '48岁', decisionRole: '处方决策者', traits: ['严谨', '学术导向'] }
  }
  if (scenario === 'education') {
    base.profile = { name: sdata.parent?.name || '家长', position: '家长', industry: '教育', estimatedAge: '38岁', decisionRole: '消费决策者', traits: ['关心孩子', '重视效果'] }
    base.nextSteps = ['安排免费试听', '试听后确定报名']
  }
  if (scenario === 'realestate') {
    base.profile = { name: sdata.customer?.name || '客户', position: '购房者', industry: '房地产', estimatedAge: '40岁', decisionRole: '家庭决策', traits: ['注重品质', '关注学区', '决策谨慎'] }
  }
  if (scenario === 'retail') {
    base.profile = { name: sdata.customer?.name || '客户', position: sdata.customer?.occupation || '白领', industry: '零售', estimatedAge: `${sdata.customer?.age || 32}岁`, decisionRole: '个人消费者', traits: ['品质导向', '品牌忠诚'] }
  }
  if (scenario === 'serviceHall') {
    base.profile = { name: sdata.customer?.name || '客户', position: sdata.customer?.type || 'VIP客户', industry: '银行', estimatedAge: '42岁', decisionRole: '个人客户', traits: ['高净值', '重视服务体验'] }
  }

  return base
}

function buildProductSection(sdata, scenario, baseScore) {
  return {
    score: Math.round(vary(baseScore+3,4)),
    clarity: { score: Math.round(vary(baseScore+5,4)), comment: '介绍逻辑清晰，条理分明' },
    match: { score: Math.round(vary(baseScore+4,5)), comment: '精准匹配客户需求场景' },
    objection: { score: Math.round(vary(baseScore-2,5)), comment: '有效回应客户疑虑' },
    competitorHandling: { score: Math.round(vary(baseScore-3,5)), comment: '差异化优势展示到位' },
    keySellingPoints: getSellingPoints(scenario)
  }
}

function getSellingPoints(scenario) {
  const points = {
    meeting: ['AI智能分析，节省90%整理时间', '自动生成结构化报告', '行业定制化模板', '数据安全保障'],
    medical: ['权威临床数据支持', '不良反应发生率低', '指南推荐一线用药', '患者依从性高'],
    education: ['小班教学，因材施教', '85%学员考入重点初中', '10年教龄名师授课', '不满意随时退费'],
    realestate: ['南北通透黄金户型', '实验小学学区房', '精装修拎包入住', '低于市场价12万'],
    retail: ['日系品牌官方授权', '成分安全温和', '专柜正品保障', '会员专属折扣'],
    insurance: ['全面覆盖家庭风险', '轻症豁免保费', '灵活缴费方式', '快速理赔服务'],
    serviceHall: ['VIP专属通道', '一站式综合服务', '专业理财顾问', '资金安全保障'],
    generic: ['核心功能突出', '行业定制化能力', '成功案例佐证', '完善服务支持']
  }
  return points[scenario] || points.generic
}

function generateConclusion(scenario, score, templateName) {
  const conclusions = {
    meeting: `本次会议${score >= 85 ? '效率高、成果显著' : '基本达成预期目标'}。双方就产品方案、技术对接和商务条款进行了充分沟通，明确了下一步行动计划。`,
    medical: `本次学术拜访${score >= 85 ? '合规、专业、有效' : '基本符合要求'}。合规表现优秀，学术传递准确，医生认可产品价值。建议持续跟进临床研究进展。`,
    education: `课程推荐${score >= 80 ? '精准匹配' : '基本合理'}。充分了解孩子学习情况，推荐的课程与需求高度契合。建议尽快安排试听。`,
    realestate: `看房跟进${score >= 80 ? '效果良好' : '达到预期'}。客户对房源认可度高，主要关注点已得到有效回应。建议尽快推动二次看房。`,
    retail: `本次服务${score >= 85 ? '超出客户预期' : '客户满意'}。BA专业度好，产品推荐精准。建议持续通过企微维护客户关系。`,
    insurance: `需求分析${score >= 80 ? '到位' : '基本完成'}。已识别客户家庭保障缺口，推荐的保障方案符合客户预算和需求。`,
    serviceHall: `${score >= 95 ? 'VIP服务体验卓越' : '服务达标'}。业务办理高效，理财推荐精准，客户满意度高。`,
    generic: `综合评估${score >= 80 ? '良好' : '基本达标'}。客户对方案表示认可，建议按计划推进。`
  }
  return (conclusions[scenario] || conclusions.generic) + `（基于「${templateName}」模板预览）`
}
