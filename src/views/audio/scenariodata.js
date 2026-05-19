import { generateRecordData } from './reportData.js'
const bankData = generateRecordData(1)

// ============ 各行业场景预览数据生成器 ============
function vary(score, delta = 5) { return Math.min(100, Math.max(50, score + (Math.random() - 0.5) * delta * 2)) }

const scenarioData = {
  meeting: {
    title: 'AI智能胸牌产品方案讨论会',
    date: '2026-05-17 09:30-11:00',
    attendees: '王志华(销售)、张总(客户)、李经理(技术)、王主任(采购)',
    summary: '本次会议围绕AI智能胸牌在银行客户经理外拓场景的应用展开深入讨论。客户方对产品价值高度认可。',
    topics: [
      { topic: '产品功能演示与场景匹配', discussion: '王志华详细演示了AI智能胸牌的录音转写、AI分析和话术提取功能。张总认为产品贴合银行外拓场景。', decision: '产品功能满足需求' },
      { topic: '数据安全与合规', discussion: '李经理详细询问了数据加密标准和等保认证。我方展示了等保三级证书。', decision: '安全方案满足要求' },
      { topic: '系统对接方案', discussion: '讨论了与银行现有CRM系统的数据互通方案。确认可在2周内完成对接开发。', decision: 'API对接方案通过' },
      { topic: '试用计划与商务条款', discussion: '先选20名客户经理试用3个月。讨论了年费方案约70万/年。', decision: '启动20人3个月试用' }
    ],
    decisions: ['产品功能满足需求', '安全方案通过评估', 'API对接确认', '启动试用'],
    actionItems: [
      { task: '提供详细试用方案', owner: '王志华', deadline: '5月18日' },
      { task: '准备20台试用设备', owner: '运营部', deadline: '5月20日' },
      { task: '完成API对接开发', owner: '技术部', deadline: '5月30日' },
      { task: '内部审批商务条款', owner: '张总', deadline: '5月21日' }
    ]
  },
  medical: {
    doctor: { name: '王主任', dept: '心内科', hospital: '杭州市第一人民医院', level: '科室主任' },
    product: 'XX降压药（第三代ARB类）',
    compliance: { overall: '合规', issues: [
      { item: '适应症表述', status: 'pass', detail: '严格按说明书适应症范围介绍' },
      { item: '不良反应告知', status: 'pass', detail: '主动告知常见不良反应及发生率' },
      { item: '禁忌症询问', status: 'pass', detail: '询问过敏史、妊娠、肾功能' },
      { item: '竞品比较', status: 'pass', detail: '引用公开文献数据，未做不实对比' }
    ]},
    visitQuality: { score: 88, dimensions: [
      { name: '学术专业性', score: 90, comment: '医学知识准确，引用最新指南' },
      { name: '沟通有效性', score: 85, comment: '倾听临床需求，互动良好' },
      { name: '合规规范性', score: 92, comment: '合规表现优秀' },
      { name: '关系维护', score: 85, comment: '关注科研需求，建立专业信任' }
    ]}
  },
  education: {
    parent: { name: '陈家长', child: { name: '小明', grade: '五年级', subjects: ['数学', '英语'] }},
    needs: { goal: '提升数学成绩，准备小升初', painPoint: '应用题理解困难', budget: '8000-12000元/年' },
    recommendation: { course: '小学数学思维训练班（高级）', teacher: '张老师，10年教龄，85%学员考入重点初中', price: '9600元/年' }
  },
  realestate: {
    customer: { name: '刘总', family: '三口之家', budget: '400-500万' },
    property: { name: '滨江春江花月', type: '三房两厅两卫', area: '128m2', price: '468万', school: '实验小学' },
    dealProbability: { score: 75, signal: '愿意带家人第二次看房' }
  },
  retail: {
    customer: { name: '周女士', age: 32, occupation: '白领' },
    behavior: { browsingTime: '25分钟', purchased: '精华液+面霜', totalSpend: '1280元', memberLevel: '金卡会员' }
  },
  // 汽车销售
  auto: {
    totalScore: 87, customer: { name: '李先生', family: '三口之家' }, budget: '25-35万', targetCar: 'XX SUV 豪华版', competitors: '丰田RAV4、本田CR-V',
    useCase: '家庭日常通勤+周末自驾游', concerns: '安全性 > 空间 > 油耗 > 保值率', decisionFactors: '试驾体验(40%) > 品牌口碑(25%) > 价格优惠(20%) > 售后服务(15%)', familyInfo: '一家三口+偶尔带父母出行，需要大空间',
    salesStrategies: [
      { point: '试驾路线设计', effective: true, detail: '精心设计包含高速+城市+颠簸路段，全面展示底盘和隔音性能' },
      { point: '竞品对比', effective: true, detail: '客观对比三款竞品，突出安全配置和空间优势而非贬低对手' },
      { point: '家庭需求挖掘', effective: true, detail: '注意到客户带家人看车，主动展示儿童安全座椅接口和后排空间' },
      { point: '价格谈判', effective: false, detail: '客户询问优惠时只给了官方优惠，未主动提及赠品和金融方案' },
      { point: '跟进节奏', effective: false, detail: '试驾后仅留了电话，未约定具体跟进时间和方式' }
    ],
    quotes: [
      { text: '这台车开起来很稳，高速上噪音小多了', signal: 'positive' },
      { text: '后排很宽敞，爸妈坐着应该舒服', signal: 'positive' },
      { text: '就是价格方面，比RAV4贵了不少', signal: 'negative' }
    ],
    dealProbability: 72, dealSignal: '客户意向明确，但价格比较敏感', followUps: [
      { time: '次日', action: '发送竞品对比表和金融方案' }, { time: '3天后', action: '邀约带配偶二次试驾' }, { time: '周末', action: '以周末活动名义提供额外赠品方案' }
    ]
  },
  // 产品力
  product: {
    totalScore: 88, productName: 'AI智能胸牌3S增强版', industry: '银行金融',
    productDims: [
      { name: '介绍完整度', score: 94, color: '#409EFF', desc: '从硬件规格到软件能力再到AI分析，覆盖完整', tags: ['硬件','软件','AI','案例'] },
      { name: '场景匹配度', score: 91, color: '#67C23A', desc: '精准匹配银行外拓+会议双场景', tags: ['外拓','会议','合规'] },
      { name: '竞品对比力', score: 82, color: '#E6A23C', desc: '突出AI差异化优势，有效区隔竞品', tags: ['AI分析','合规认证'] },
      { name: '异议应对', score: 89, color: '#909399', desc: '价格/安全/对接三大异议均给出可信回应', tags: ['案例佐证','数据支撑'] }
    ],
    sellingHeatmap: [
      { name: 'AI语音转写', coverage: 95 }, { name: '智能分析报告', coverage: 92 }, { name: '等保三级安全', coverage: 88 },
      { name: '私有化部署', coverage: 85 }, { name: '招商银行案例', coverage: 90 }, { name: '投资回报率', coverage: 65 },
      { name: '售后服务体系', coverage: 45 }, { name: '扩展能力', coverage: 35 }
    ],
    competitorCompare: [
      { dim: 'AI分析能力', us: 95, them: 10 }, { dim: '合规认证', us: 90, them: 30 },
      { dim: '价格竞争力', us: 65, them: 80 }, { dim: '品牌知名度', us: 40, them: 85 }
    ]
  },
  // 教育课程(扩展)
  education: {
    parent: { name: '陈家长', child: { name: '小明', grade: '五年级', subjects: ['数学','英语'] }},
    needs: { goal: '提升数学成绩准备小升初', painPoint: '应用题理解困难计算粗心', budget: '8000-12000元/年', schedule: '周末可安排2小时' },
    recommendation: { course: '小学数学思维训练班（高级）', teacher: '张老师10年教龄85%学员考入重点初中', price: '9600元/年' },
    salesAnalysis: ['与家长建立良好信任，充分了解孩子学习情况', '精准匹配课程与孩子薄弱环节', '用数据（升学率85%）和师资背书增强说服力'],
    nextStep: '安排本周六免费试听，试听后确定报名',
    expectedOutcomes: ['应用题正确率从60%提升至85%+', '计算速度提升50%', '建立系统解题思维框架', '小升初数学达到重点学校录取水平']
  },
  // 地产(扩展)
  realestate: {
    customer: { name: '刘总', family: '三口之家', budget: '400-500万', urgency: '计划3个月内购房' },
    property: { name: '滨江·春江花月', type: '三房两厅两卫', area: '128m2', price: '468万', floor: '12层/总18层', school: '实验小学（步行5分钟）' },
    visitAnalysis: {
      liked: ['南北通透户型', '12楼黄金楼层采光好', '实验小学学区', '精装修拎包入住', '小区环境好'],
      concerns: ['总价略超预算', '离地铁站1.2公里', '车位配比偏低'],
      objections: [
        { concern: '价格偏高', response: '对比同小区同户型成交均价480万，468万已低于市场价。首付20%约94万，月供约1.6万' },
        { concern: '交通不便', response: '小区门口有公交直达地铁站，18号线规划中预计2027年通车' }
      ]
    },
    dealProbability: { score: 75, signal: '愿意带家人第二次看房，意向明确' }
  },
  // 保险(扩展)
  insurance: {
    customer: { name: '赵经理', age: 38, family: '配偶+1个孩子（8岁）', income: '家庭年收入约50万' },
    gapAnalysis: [
      { gap: '重疾保障缺失', risk: '家庭成员无商业重疾险，一旦发生重大疾病医疗费用+收入损失将构成重大经济负担', suggestion: '建议配置重疾险保额≥年收入3-5倍（150万-250万）' },
      { gap: '寿险保额不足', risk: '仅50万团险，若发生极端风险，房贷+子女教育费用远超此额度', suggestion: '建议补充定期寿险200-300万，覆盖房贷+子女教育金' },
      { gap: '子女教育金无储备', risk: '孩子8岁，10年后大学教育费用约50-100万目前无专项储备', suggestion: '建议配置教育年金或增额终身寿，年缴2-3万' }
    ],
    coverageCompare: [
      { name: '重疾保障', current: '无', suggested: '100-250万' }, { name: '寿险保障', current: '50万（团险）', suggested: '200-300万' },
      { name: '意外保障', current: '30万（团险）', suggested: '100万' }, { name: '教育金储备', current: '无', suggested: '年缴2-3万' }
    ],
    recommendation: [
      { product: 'XX重疾险', coverage: '100万', premium: '约8000元/年', reason: '覆盖70种重疾+30种轻症含轻症豁免' },
      { product: 'XX定期寿险', coverage: '200万', premium: '约3000元/年', reason: '保障至60岁覆盖房贷+子女教育关键期' },
      { product: 'XX教育年金', coverage: '年缴2万', premium: '2万/年', reason: '18-21岁每年领取5万教育金' }
    ],
    totalPremium: '约3.1万/年'
  },
  serviceHall: {
    customer: { name: '王先生', type: 'VIP客户' },
    service: { waitTime: '2分钟', serviceTime: '18分钟', satisfaction: 98 }
  }
}

export function getScenarioPreviewData(templateName, templateType, industries) {
  const industry = (industries || ['通用'])[0]
  let scenario = 'generic'
  if (templateName.includes('会议') || templateName.includes('总结')) scenario = 'meeting'
  else if (templateName.includes('医疗') || templateName.includes('合规')) scenario = 'medical'
  else if (templateName.includes('教育') || templateName.includes('课程')) scenario = 'education'
  else if (templateName.includes('地产') || templateName.includes('看房')) scenario = 'realestate'
  else if (templateName.includes('零售') || templateName.includes('客户画像')) scenario = 'retail'
  else if (templateName.includes('保险')) scenario = 'insurance'
  else if (templateName.includes('营业厅') || templateName.includes('服务')) scenario = 'serviceHall'
  else if (templateName.includes('银行')) scenario = 'meeting'
  else if (templateName.includes('汽车')) scenario = 'auto'
  else if (templateName.includes('产品力')) scenario = 'product'
  else if (templateName.includes('销售复盘')) scenario = 'meeting'

  const baseScore = 82 + Math.floor(Math.random() * 12)
  const sdata = scenarioData[scenario] || scenarioData.meeting
  return buildScenarioReport(sdata, scenario, baseScore, templateName)
}

function buildScenarioReport(sdata, scenario, baseScore, templateName) {
  const report = {
    scenario, templateName, scenarioData: sdata,
    sales: {
      totalScore: Math.round(vary(baseScore, 4)),
      dimensions: [
        { name: '专业能力', score: Math.round(vary(baseScore+5,5)), weight: 35, color: '#409EFF', subDimensions: [
          { name: '产品知识', weight: 20, score: Math.round(vary(baseScore+8,4)) },
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
        goal: getGoal(scenario), painPoints: ['效率待提升', '经验难沉淀', '数据不透明'],
        logicFlow: '需求了解 - 方案匹配 - 异议处理 - 确认推进',
        result: '沟通达成预期目标，客户认可方案价值'
      },
      highlights: ['专业能力突出', '沟通高效流畅', '服务态度良好'],
      improvements: ['可补充更多数据佐证', '明确下一步行动时间'],
      overall: `${templateName}效果预览——基于行业真实场景生成的AI分析示例。`
    },
    customer: buildCustomer(sdata, scenario),
    product: {
      score: Math.round(vary(baseScore+3,4)),
      clarity: { score: Math.round(vary(baseScore+5,4)), comment: '介绍逻辑清晰，条理分明' },
      match: { score: Math.round(vary(baseScore+4,5)), comment: '精准匹配客户需求场景' },
      objection: { score: Math.round(vary(baseScore-2,5)), comment: '有效回应客户疑虑' },
      competitorHandling: { score: Math.round(vary(baseScore-3,5)), comment: '差异化优势展示到位' },
      keySellingPoints: getSellingPoints(scenario)
    },
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
      conclusion: `基于「${templateName}」模板的预览效果。综合评估良好，建议按场景推进。`,
      timeline: [
        { step: '第1天', action: '发送跟进资料' },
        { step: '第3天', action: '电话回访确认' },
        { step: '第7天', action: '推进下一步合作' }
      ]
    },
    bankVisit: bankData?.bankVisit || null
  }
  return report
}

function buildCustomer(sdata, scenario) {
  const base = {
    profile: { name: '客户', position: '负责人', industry: '通用', estimatedAge: '35-45岁', decisionRole: '决策人', traits: ['务实', '理性'] },
    needAnalysis: { explicit: [{ need: '提升效率', urgency: '高', priority: 1 }], implicit: [{ need: '标准化', urgency: '中', confidence: 80 }] },
    intentLevel: { level: '意向明确', score: 82, signal: '愿意进一步了解' },
    competitorInfo: [], budgetRange: '待确认', decisionChain: ['客户-评估-决策'],
    nextSteps: ['发送资料', '安排演示']
  }
  if (scenario === 'medical') base.profile = { name: sdata.doctor.name, position: sdata.doctor.dept, industry: '医疗', estimatedAge: '48岁', decisionRole: '处方决策者', traits: ['严谨', '学术导向'] }
  if (scenario === 'education') base.profile = { name: sdata.parent.name, position: '家长', industry: '教育', estimatedAge: '38岁', decisionRole: '消费决策者', traits: ['关心孩子', '重视效果'] }
  if (scenario === 'realestate') base.profile = { name: sdata.customer.name, position: '购房者', industry: '房地产', estimatedAge: '40岁', decisionRole: '家庭决策', traits: ['注重品质', '关注学区'] }
  if (scenario === 'retail') base.profile = { name: sdata.customer.name, position: sdata.customer.occupation, industry: '零售', estimatedAge: '32岁', decisionRole: '个人消费者', traits: ['品质导向', '品牌忠诚'] }
  if (scenario === 'serviceHall') base.profile = { name: sdata.customer.name, position: sdata.customer.type, industry: '银行', estimatedAge: '42岁', decisionRole: '高净值客户', traits: ['重视服务体验'] }
  return base
}

function getGoal(scenario) {
  const m = { meeting: '讨论产品方案、确认技术对接、明确合作模式', medical: '了解产品临床价值、评估合规性、建立学术合作', education: '了解学习情况、匹配课程方案、推动试听', realestate: '了解家庭需求、推荐房源、推动二次看房', retail: '提供专业推荐、提升客单价、增强粘性', insurance: '识别保障缺口、推荐方案、推动投保', serviceHall: '高效办理业务、挖掘需求、提升体验' }
  return m[scenario] || '了解客户需求、推荐匹配方案、推动合作'
}

function getSellingPoints(scenario) {
  const p = { meeting: ['AI智能分析，节省90%整理时间', '自动生成结构化报告', '行业定制化模板', '数据安全保障'], medical: ['权威临床数据支持', '不良反应发生率低', '指南推荐一线用药', '患者依从性高'], education: ['小班教学因材施教', '85%学员考入重点初中', '10年教龄名师授课', '不满意随时退费'], realestate: ['南北通透黄金户型', '实验小学学区房', '精装修拎包入住', '低于市场价12万'], retail: ['日系品牌官方授权', '成分安全温和', '专柜正品保障', '会员专属折扣'], insurance: ['全面覆盖家庭风险', '轻症豁免保费', '灵活缴费方式', '快速理赔服务'], serviceHall: ['VIP专属通道', '一站式综合服务', '专业理财顾问', '资金安全保障'] }
  return p[scenario] || ['核心功能突出', '行业定制化能力', '成功案例佐证']
}
