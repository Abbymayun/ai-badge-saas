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
  insurance: {
    customer: { name: '赵经理', age: 38, family: '配偶+1个孩子', income: '家庭年收入约50万' },
    gapAnalysis: [
      { gap: '重疾保障缺失', risk: '无商业重疾险', suggestion: '配置重疾险保额150-250万' },
      { gap: '寿险保额不足', risk: '仅50万团险', suggestion: '补充定期寿险200-300万' },
      { gap: '子女教育金无储备', risk: '教育费用无储备', suggestion: '配置教育年金，年缴2-3万' }
    ]
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
  else if (templateName.includes('汽车')) scenario = 'realestate'
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
