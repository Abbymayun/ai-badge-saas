<template>
  <div class="boss-report">
    <!-- ====== 高管摘要卡片 ====== -->
    <div class="exec-summary">
      <el-row :gutter="20" align="middle">
        <el-col :span="6" class="es-score-col">
          <div class="es-ring">
            <svg viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#e8edf2" stroke-width="8"/>
              <circle cx="70" cy="70" r="60" fill="none" :stroke="scoreGradient" stroke-width="8"
                :stroke-dasharray="2 * Math.PI * 60" :stroke-dashoffset="2 * Math.PI * 60 * (1 - data.totalScore / 100)"
                stroke-linecap="round" transform="rotate(-90 70 70)"/>
            </svg>
            <div class="es-ring-center">
              <span class="es-big-score">{{ data.totalScore }}</span>
              <span class="es-score-label">综合评分</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="es-info-col">
          <h2>销售能力评估报告</h2>
          <div class="es-tags">
            <el-tag :type="levelTagType" size="default" effect="dark" round>{{ levelText }}</el-tag>
            <el-tag type="info" size="default" effect="plain" round>团队排名 Top {{ teamRank }}</el-tag>
            <el-tag :type="trendType" size="default" effect="plain" round>
              {{ trendIcon }} 较上月 {{ trendText }}
            </el-tag>
          </div>
          <div class="es-meta">
            <span>销售人员：{{ salesPerson }}</span>
            <span>评估日期：{{ evalDate }}</span>
            <span>对话时长：{{ duration }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="es-kpi-grid">
            <div class="es-kpi">
              <div class="es-kpi-val up">{{ conversionRate }}%</div>
              <div class="es-kpi-lbl">客户转化率</div>
            </div>
            <div class="es-kpi">
              <div class="es-kpi-val">¥{{ avgDealSize }}</div>
              <div class="es-kpi-lbl">平均客单(万)</div>
            </div>
            <div class="es-kpi">
              <div class="es-kpi-val up">{{ customerSatisfaction }}%</div>
              <div class="es-kpi-lbl">客户满意度</div>
            </div>
            <div class="es-kpi">
              <div class="es-kpi-val">{{ totalVisits }}</div>
              <div class="es-kpi-lbl">本月拜访量</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- ====== 核心能力四维分析 ====== -->
    <el-row :gutter="16" class="capability-row">
      <el-col :span="12">
        <el-card shadow="never" class="br-card">
          <template #header>
            <div class="br-card-title">🎯 核心能力雷达</div>
            <el-tooltip content="各维度得分 vs 团队平均水平"><el-icon style="color:#c0c4cc;cursor:help;"><QuestionFilled /></el-icon></el-tooltip>
          </template>
          <div ref="radarRef" style="height:320px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="br-card">
          <template #header><div class="br-card-title">📈 能力趋势（近6个月）</div></template>
          <div ref="trendRef" style="height:320px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ====== 优势 & 短板 ====== -->
    <el-row :gutter="16" class="sw-row">
      <el-col :span="12">
        <el-card shadow="never" class="br-card">
          <template #header>
            <div class="br-card-title">💪 核心优势（可复用）</div>
            <el-tag type="success" size="small">建议团队推广</el-tag>
          </template>
          <div v-for="(s, idx) in strengths" :key="idx" class="sw-item">
            <div class="sw-rank" style="background:#67C23A;">{{ idx + 1 }}</div>
            <div class="sw-content">
              <div class="sw-title">{{ s.title }}</div>
              <div class="sw-desc">{{ s.desc }}</div>
              <div class="sw-evidence">📎 {{ s.evidence }}</div>
            </div>
            <el-tag size="small" effect="plain" type="success">可复用</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="br-card">
          <template #header>
            <div class="br-card-title">🎯 待提升项（需辅导）</div>
            <el-tag type="warning" size="small">建议1对1辅导</el-tag>
          </template>
          <div v-for="(w, idx) in weaknesses" :key="idx" class="sw-item">
            <div class="sw-rank" style="background:#E6A23C;">{{ idx + 1 }}</div>
            <div class="sw-content">
              <div class="sw-title">{{ w.title }}</div>
              <div class="sw-desc">{{ w.desc }}</div>
              <div class="sw-evidence coaching">💡 {{ w.coaching }}</div>
            </div>
            <el-tag size="small" effect="plain" type="warning">待辅导</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ====== 对话质量分析 ====== -->
    <el-card shadow="never" class="br-card">
      <template #header><div class="br-card-title">🗣️ 对话质量分析</div></template>
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="conv-stat">
            <div class="conv-stat-label">话术占比</div>
            <div class="conv-ratio-bar">
              <div class="crb-sales" :style="{width: talkRatio + '%'}">{{ talkRatio }}%</div>
              <div class="crb-customer" :style="{width: (100 - talkRatio) + '%'}">{{ 100 - talkRatio }}%</div>
            </div>
            <div class="conv-ratio-legend">
              <span><span class="dot" style="background:#409EFF;"></span> 销售人员</span>
              <span><span class="dot" style="background:#67C23A;"></span> 客户</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="conv-stat">
            <div class="conv-stat-label">提问质量</div>
            <div class="conv-metrics">
              <div class="cm-item"><span class="cm-val">{{ openQuestions }}</span><span class="cm-lbl">开放式提问</span></div>
              <div class="cm-item"><span class="cm-val">{{ closedQuestions }}</span><span class="cm-lbl">封闭式提问</span></div>
              <div class="cm-item"><span class="cm-val">{{ followUps }}</span><span class="cm-lbl">追问次数</span></div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="conv-stat">
            <div class="conv-stat-label">客户情绪曲线</div>
            <div class="emotion-bar">
              <div v-for="(e, i) in emotions" :key="i" class="emotion-segment" :class="e" :title="'阶段'+(i+1)"></div>
            </div>
            <div class="emotion-legend">
              <span><span class="dot" style="background:#67C23A;"></span> 积极</span>
              <span><span class="dot" style="background:#409EFF;"></span> 中性</span>
              <span><span class="dot" style="background:#E6A23C;"></span> 疑虑</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- ====== 关键对话时刻 ====== -->
    <el-card shadow="never" class="br-card">
      <template #header><div class="br-card-title">⏱️ 关键对话时刻</div></template>
      <el-timeline>
        <el-timeline-item v-for="(m, idx) in keyMoments" :key="idx" :timestamp="m.time" placement="top"
          :color="m.type === 'positive' ? '#67C23A' : m.type === 'negative' ? '#F56C6C' : '#409EFF'"
          :icon="m.type === 'positive' ? 'CircleCheckFilled' : m.type === 'negative' ? 'WarningFilled' : 'MoreFilled'">
          <el-card shadow="never" size="small" :body-style="{padding:'10px 14px'}">
            <el-tag :type="m.type === 'positive' ? 'success' : m.type === 'negative' ? 'danger' : ''" size="small" style="margin-bottom:4px;">
              {{ m.type === 'positive' ? '✨ 亮点' : m.type === 'negative' ? '⚠️ 改进点' : '📌 转折点' }}
            </el-tag>
            <div style="font-size:13px;color:#303133;line-height:1.6;">{{ m.content }}</div>
            <div v-if="m.quote" style="font-size:12px;color:#909399;margin-top:4px;font-style:italic;">"{{ m.quote }}"</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- ====== 辅导建议 ====== -->
    <el-card shadow="never" class="br-card coaching-card">
      <template #header><div class="br-card-title">📋 管理者辅导建议</div></template>
      <el-row :gutter="16">
        <el-col :span="8" v-for="(c, idx) in coachingAdvice" :key="idx">
          <div class="coaching-block">
            <div class="coaching-icon">{{ ['🎯','📚','🤝'][idx] }}</div>
            <div class="coaching-title">{{ c.title }}</div>
            <div class="coaching-actions">
              <div v-for="a in c.actions" :key="a" class="ca-item">{{ a }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: { type: Object, required: true },
  template: { type: Object, default: () => ({}) }
})

// 高管摘要数据
const salesPerson = '王志华'
const evalDate = '2026-05-17'
const duration = '32分钟'
const teamRank = ref(3)
const conversionRate = ref(28)
const avgDealSize = ref(68)
const customerSatisfaction = ref(94)
const totalVisits = ref(45)
const trendScore = ref(3.2)

const levelText = computed(() => props.data.totalScore >= 95 ? '🏆 卓越' : props.data.totalScore >= 88 ? '🥇 优秀' : props.data.totalScore >= 75 ? '🥈 良好' : '🥉 待提升')
const levelTagType = computed(() => props.data.totalScore >= 88 ? 'danger' : props.data.totalScore >= 75 ? 'warning' : 'info')
const trendText = computed(() => trendScore.value > 0 ? `+${trendScore.value}分` : `${trendScore.value}分`)
const trendType = computed(() => trendScore.value > 0 ? 'success' : 'danger')
const trendIcon = computed(() => trendScore.value > 0 ? '📈' : '📉')
const scoreGradient = computed(() => {
  const id = 'scoreGrad'
  return `url(#${id})` // simplified - use solid color
})

// 优势
const strengths = [
  { title: '需求挖掘能力突出', desc: '善于通过开放式提问引导客户表达真实需求，问题设计有层次', evidence: '开场3个递进问题即锁定客户三大核心痛点' },
  { title: '产品匹配精准', desc: '能够将产品功能准确对应到客户痛点，介绍有场景感', evidence: '5个核心卖点全部匹配客户需求，无一遗漏' },
  { title: '异议处理专业', desc: '面对客户价格、安全、对接等多维度疑虑，逐一给出有效回应', evidence: '成功化解4个主要异议，客户从质疑转向认可' }
]

// 短板
const weaknesses = [
  { title: '逼单力度不足', desc: '在客户表达认可后未及时推进成交，错失最佳时机', coaching: '建议练习"试探性收单"话术，在客户表达满意后立即询问合作意向' },
  { title: '缺少数据佐证', desc: '介绍过程中多为定性描述，缺少同业数据和ROI计算', coaching: '准备3-5个同行案例的数据卡片，在介绍时自然引用' },
  { title: '下一步不明确', desc: '结尾未给出具体的下一步行动计划和时间节点', coaching: '每次拜访结束前必须和客户确认：下次联系时间、方式、内容' }
]

// 对话质量
const talkRatio = ref(58)
const openQuestions = ref(12)
const closedQuestions = ref(8)
const followUps = ref(5)
const emotions = ['positive','neutral','positive','positive','neutral','caution','positive','positive']

// 关键对话时刻
const keyMoments = [
  { time: '02:15', type: 'positive', content: '开场破冰成功，通过行业洞察快速建立信任', quote: '张总，我注意到贵行最近在推进数字化转型，特别是在客户经理外拓管理这块...' },
  { time: '08:30', type: 'positive', content: '需求挖掘到位，客户主动透露了痛点和预算范围', quote: '你说得对，我们确实在客户经理的过程管理上比较头疼' },
  { time: '15:45', type: 'turning', content: '客户提出安全和对接疑虑，进入关键异议处理阶段' },
  { time: '22:10', type: 'positive', content: '通过招行案例成功打消客户顾虑，客户态度明显转变', quote: '招商银行的案例很有参考性，能详细说说吗？' },
  { time: '28:50', type: 'negative', content: '客户表达认可后未及时推进成交，仅以"发方案"结束', quote: '好的，你先发方案给我看看' }
]

// 辅导建议
const coachingAdvice = [
  { title: '立即行动', actions: ['本周内安排角色扮演训练，重点练习逼单话术', '准备行业案例数据卡片，用于下次拜访'] },
  { title: '持续提升', actions: ['每周分析2份优秀对话录音，学习同行技巧', '建立个人话术库，按场景分类整理'] },
  { title: '团队贡献', actions: ['将本次优秀话术沉淀到团队话术库', '下月团队分享会上做经验交流'] }
]

const radarRef = ref(null)
const trendRef = ref(null)

onMounted(() => {
  nextTick(() => {
    // 雷达图 - 个人 vs 团队
    if (radarRef.value) {
      const chart = echarts.init(radarRef.value)
      const dims = props.data.dimensions || []
      const allSubs = dims.flatMap(d => (d.subDimensions || []).map(s => s.name))
      const personalScores = dims.flatMap(d => (d.subDimensions || []).map(s => s.score))
      const teamScores = personalScores.map(s => Math.round(s - 5 - Math.random() * 10))
      chart.setOption({
        radar: {
          indicator: allSubs.map(n => ({ name: n, max: 100 })),
          center: ['50%', '52%'], radius: '65%'
        },
        series: [{
          type: 'radar',
          data: [
            { value: personalScores, name: '个人', areaStyle: { color: 'rgba(64,158,255,0.2)' }, lineStyle: { color: '#409EFF', width: 2 }, itemStyle: { color: '#409EFF' } },
            { value: teamScores, name: '团队平均', areaStyle: { color: 'rgba(192,196,204,0.1)' }, lineStyle: { color: '#c0c4cc', width: 1, type: 'dashed' }, itemStyle: { color: '#c0c4cc' } }
          ]
        }],
        legend: { data: ['个人', '团队平均'], bottom: 0 }
      })
    }

    // 趋势图
    if (trendRef.value) {
      const chart = echarts.init(trendRef.value)
      chart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['12月', '1月', '2月', '3月', '4月', '5月'] },
        yAxis: { type: 'value', min: 60, max: 100 },
        series: [
          { name: '综合评分', type: 'line', smooth: true, data: [78, 82, 79, 85, 88, props.data.totalScore], itemStyle: { color: '#409EFF' }, areaStyle: { color: 'rgba(64,158,255,0.1)' } },
          { name: '团队平均', type: 'line', smooth: true, data: [72, 73, 74, 74, 75, 75], itemStyle: { color: '#c0c4cc' }, lineStyle: { type: 'dashed' } }
        ],
        grid: { left: 40, right: 20, top: 20, bottom: 30 },
        legend: { data: ['综合评分', '团队平均'], bottom: 0 }
      })
    }
  })
})
</script>

<style scoped>
.boss-report { }

/* 高管摘要 */
.exec-summary { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border-radius: 20px; padding: 32px; margin-bottom: 20px; color: #fff; }
.es-score-col { text-align: center; }
.es-ring { position: relative; width: 130px; height: 130px; margin: 0 auto; }
.es-ring-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
.es-big-score { font-size: 42px; font-weight: bold; color: #409EFF; line-height: 1; display: block; }
.es-score-label { font-size: 11px; color: #a0aec0; }
.es-info-col h2 { margin: 0 0 10px; font-size: 22px; color: #e2e8f0; }
.es-tags { display: flex; gap: 8px; margin-bottom: 10px; }
.es-meta { display: flex; gap: 16px; font-size: 13px; color: #a0aec0; }
.es-kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.es-kpi { text-align: center; padding: 10px 6px; background: rgba(255,255,255,0.06); border-radius: 10px; }
.es-kpi-val { font-size: 20px; font-weight: bold; }
.es-kpi-val.up { color: #67C23A; }
.es-kpi-lbl { font-size: 10px; color: #a0aec0; margin-top: 2px; }

.br-card { border-radius: 14px; margin-bottom: 16px; }
.br-card-title { font-size: 15px; font-weight: bold; color: #303133; }

/* 优势短板 */
.sw-row { }
.sw-item { display: flex; gap: 12px; padding: 14px; margin-bottom: 8px; background: #fafbfc; border-radius: 10px; align-items: flex-start; transition: .2s; }
.sw-item:hover { background: #f0f5ff; }
.sw-rank { width: 26px; height: 26px; border-radius: 8px; color: #fff; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sw-title { font-size: 14px; font-weight: bold; color: #303133; }
.sw-desc { font-size: 12px; color: #606266; margin: 3px 0; line-height: 1.6; }
.sw-evidence { font-size: 11px; color: #67C23A; background: #f0f9eb; padding: 2px 8px; border-radius: 4px; display: inline-block; }
.sw-evidence.coaching { color: #E6A23C; background: #fdf6ec; }

/* 对话质量 */
.conv-stat { text-align: center; }
.conv-stat-label { font-size: 13px; color: #606266; margin-bottom: 10px; font-weight: bold; }
.conv-ratio-bar { display: flex; height: 32px; border-radius: 16px; overflow: hidden; font-size: 12px; font-weight: bold; color: #fff; }
.crb-sales { background: #409EFF; display: flex; align-items: center; justify-content: center; }
.crb-customer { background: #67C23A; display: flex; align-items: center; justify-content: center; }
.conv-ratio-legend { display: flex; justify-content: center; gap: 16px; margin-top: 8px; font-size: 12px; color: #909399; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
.conv-metrics { display: flex; justify-content: center; gap: 16px; }
.cm-item { text-align: center; }
.cm-val { font-size: 24px; font-weight: bold; color: #409EFF; display: block; }
.cm-lbl { font-size: 11px; color: #909399; }

.emotion-bar { display: flex; gap: 2px; height: 24px; margin: 10px 0; }
.emotion-segment { flex: 1; border-radius: 4px; }
.emotion-segment.positive { background: #67C23A; }
.emotion-segment.neutral { background: #409EFF; }
.emotion-segment.caution { background: #E6A23C; }
.emotion-legend { display: flex; justify-content: center; gap: 12px; font-size: 12px; color: #909399; }

/* 辅导建议 */
.coaching-card { background: linear-gradient(135deg, #fafbfc, #f0f5ff); }
.coaching-block { padding: 16px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.coaching-icon { font-size: 28px; margin-bottom: 8px; }
.coaching-title { font-size: 14px; font-weight: bold; color: #303133; margin-bottom: 8px; }
.ca-item { font-size: 12px; color: #606266; padding: 4px 0; line-height: 1.6; }
</style>
