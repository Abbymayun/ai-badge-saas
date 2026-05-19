<template>
  <div class="purchase-report">
    <!-- ====== 客户价值总览 ====== -->
    <div class="pr-hero">
      <el-row :gutter="24" align="middle">
        <el-col :span="6" class="pr-score-col">
          <div class="pr-ring-wrap">
            <svg viewBox="0 0 140 140" class="pr-ring">
              <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
              <circle cx="70" cy="70" r="58" fill="none" stroke="#fbbf24" stroke-width="6"
                :stroke-dasharray="2 * Math.PI * 58" :stroke-dashoffset="2 * Math.PI * 58 * (1 - totalScore / 100)"
                stroke-linecap="round" transform="rotate(-90 70 70)"/>
            </svg>
            <div class="pr-ring-center">
              <span class="pr-big-score">{{ totalScore }}</span>
              <span class="pr-score-unit">/100</span>
            </div>
          </div>
          <div class="pr-grade">
            <el-tag :type="gradeType" size="default" effect="dark" round>{{ gradeText }}</el-tag>
          </div>
        </el-col>
        <el-col :span="13" class="pr-info-col">
          <h2>{{ customerName }}</h2>
          <div class="pr-info-tags">
            <el-tag size="small" effect="plain" type="warning">{{ industry }}</el-tag>
            <el-tag size="small" effect="plain">{{ position }}</el-tag>
            <el-tag size="small" effect="plain" type="info">{{ companyScale }}</el-tag>
          </div>
          <div class="pr-quick-stats">
            <div class="pr-qs-item">
              <div class="pr-qs-val" style="color:#fbbf24;">{{ budgetRange }}</div>
              <div class="pr-qs-lbl">预估预算</div>
            </div>
            <div class="pr-qs-item">
              <div class="pr-qs-val" style="color:#67C23A;">{{ probability }}%</div>
              <div class="pr-qs-lbl">成交概率</div>
            </div>
            <div class="pr-qs-item">
              <div class="pr-qs-val">{{ dealCycle }}</div>
              <div class="pr-qs-lbl">预计成交周期</div>
            </div>
            <div class="pr-qs-item">
              <div class="pr-qs-val" style="color:#409EFF;">{{ expectedRevenue }}</div>
              <div class="pr-qs-lbl">预期收入（万/年）</div>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="pr-decision-card">
            <div class="prd-title">🎯 决策状态</div>
            <div class="prd-status" :style="{color: decisionColor}">{{ decisionStatus }}</div>
            <div class="prd-timeline">
              <el-steps direction="vertical" :active="decisionStep" finish-status="success" process-status="process">
                <el-step title="需求确认" />
                <el-step title="方案评估" />
                <el-step title="内部审批" />
                <el-step title="合同签署" />
              </el-steps>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- ====== 四维评估仪表盘 ====== -->
    <el-row :gutter="16" class="pr-dim-row">
      <el-col :span="6" v-for="dim in dimensions" :key="dim.name">
        <el-card shadow="hover" class="pr-dim-card" :style="{borderTopColor: dim.color}">
          <div class="prd-header">
            <span class="prd-icon">{{ dim.icon }}</span>
            <span class="prd-name">{{ dim.name }}</span>
            <span class="prd-score" :style="{color: dim.color}">{{ dim.score }}</span>
          </div>
          <el-progress :percentage="dim.score" :color="dim.color" :stroke-width="6" :show-text="false" />
          <div class="prd-detail">{{ dim.detail }}</div>
          <div class="prd-tags" v-if="dim.tags">
            <el-tag v-for="t in dim.tags" :key="t" size="small" effect="plain" style="margin:2px;">{{ t }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ====== 预算与决策权深度分析 ====== -->
    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never" class="pr-card">
          <template #header>
            <div class="pr-card-title">💰 预算与需求匹配度</div>
            <el-tag size="small" type="success">匹配度高</el-tag>
          </template>
          <div class="budget-match">
            <div class="bm-bar-row">
              <span class="bm-label">客户预算</span>
              <div class="bm-bar-track"><div class="bm-bar-fill" style="width:80%;background:#409EFF;">{{ budgetRange }}</div></div>
            </div>
            <div class="bm-bar-row">
              <span class="bm-label">方案报价</span>
              <div class="bm-bar-track"><div class="bm-bar-fill" style="width:70%;background:#67C23A;">60-80万</div></div>
            </div>
            <div class="bm-bar-row">
              <span class="bm-label">同业均价</span>
              <div class="bm-bar-track"><div class="bm-bar-fill" style="width:65%;background:#c0c4cc;">50-70万</div></div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="pr-card" style="margin-top:12px;">
          <template #header><div class="pr-card-title">🔗 决策链分析</div></template>
          <div class="decision-chain">
            <div v-for="(p, idx) in decisionChain" :key="idx" class="dc-person">
              <div class="dcp-avatar" :style="{background: ['#409EFF','#67C23A','#E6A23C','#909399'][idx]}">
                {{ p.name[0] }}
              </div>
              <div class="dcp-info">
                <div class="dcp-name">{{ p.name }} <el-tag v-if="p.role === '关键决策人'" type="danger" size="small">决策人</el-tag></div>
                <div class="dcp-pos">{{ p.position }}</div>
                <div class="dcp-attitude" :style="{color: p.attitude === '支持' ? '#67C23A' : '#E6A23C'}">
                  {{ p.attitude === '支持' ? '✅' : '⚠️' }} {{ p.attitude }}
                </div>
              </div>
              <el-icon v-if="idx < decisionChain.length - 1" style="color:#c0c4cc;"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card shadow="never" class="pr-card">
          <template #header><div class="pr-card-title">⚠️ 风险评估</div></template>
          <div v-for="r in risks" :key="r.title" class="risk-row">
            <div class="risk-level" :style="{background: r.level === 'high' ? '#F56C6C' : r.level === 'medium' ? '#E6A23C' : '#67C23A'}">
              {{ r.level === 'high' ? '高' : r.level === 'medium' ? '中' : '低' }}
            </div>
            <div class="risk-info">
              <div class="risk-title">{{ r.title }}</div>
              <div class="risk-desc">{{ r.desc }}</div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="pr-card" style="margin-top:12px;">
          <template #header><div class="pr-card-title">⚔️ 竞争态势</div></template>
          <div v-for="c in competitors" :key="c.name" class="comp-row">
            <div class="comp-name">{{ c.name }}</div>
            <div class="comp-bar">
              <div class="comp-fill" :style="{width: c.advantage + '%', background: c.name === '我方' ? '#409EFF' : '#c0c4cc'}"></div>
            </div>
            <span class="comp-pct">{{ c.advantage }}%</span>
          </div>
          <el-divider />
          <div class="comp-advantage">
            <strong>我方核心优势：</strong>{{ competitiveAdvantage }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ====== 客户痛点与销售策略 ====== -->
    <el-row :gutter="16" class="pr-bottom-row">
      <el-col :span="12">
        <el-card shadow="never" class="pr-card">
          <template #header><div class="pr-card-title">🎯 客户核心诉求</div></template>
          <div v-for="(pp, idx) in painPoints" :key="idx" class="pp-row">
            <div class="pp-rank">{{ idx + 1 }}</div>
            <div class="pp-info">
              <div class="pp-title">{{ pp.title }}</div>
              <div class="pp-impact" :style="{color: pp.urgent ? '#F56C6C' : '#E6A23C'}">
                {{ pp.urgent ? '🔴 紧急' : '🟡 重要' }} · 影响程度：{{ '⭐'.repeat(pp.impact) }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="pr-card">
          <template #header>
            <div class="pr-card-title">💡 销售策略建议</div>
            <el-tag size="small" type="warning">AI推荐</el-tag>
          </template>
          <div v-for="(s, idx) in strategies" :key="idx" class="strategy-row">
            <div class="st-num" style="background:#409EFF;">{{ idx + 1 }}</div>
            <div>
              <div class="st-title">{{ s.title }}</div>
              <div class="st-desc">{{ s.desc }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ====== 下一步行动 ====== -->
    <el-card shadow="never" class="pr-card next-card">
      <template #header><div class="pr-card-title">📋 下一步行动计划</div></template>
      <el-row :gutter="16">
        <el-col :span="8" v-for="(a, idx) in nextActions" :key="idx">
          <div class="next-action-card">
            <div class="na-time">{{ a.time }}</div>
            <div class="na-title">{{ a.title }}</div>
            <div class="na-detail">{{ a.detail }}</div>
            <el-tag size="small" :type="a.priority === '高' ? 'danger' : ''">{{ a.priority }}优先级</el-tag>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
  template: { type: Object, default: () => ({}) }
})

const totalScore = 82
const customerName = '兴业银行 · 张总'
const industry = '银行金融'
const position = '零售银行部总经理'
const companyScale = '200+人规模'
const budgetRange = '60-80万'
const probability = 78
const dealCycle = '4-6周'
const expectedRevenue = '70'

const gradeText = computed(() => totalScore >= 90 ? '🏆 S级 · 战略客户' : totalScore >= 80 ? '🥇 A级 · 高价值客户' : totalScore >= 65 ? '🥈 B级 · 潜力客户' : '🥉 C级 · 普通客户')
const gradeType = computed(() => totalScore >= 80 ? 'danger' : totalScore >= 65 ? 'warning' : 'info')
const decisionStep = 1
const decisionColor = '#E6A23C'
const decisionStatus = '方案评估中'

const dimensions = [
  { name: '预算匹配', icon: '💰', score: 85, color: '#fbbf24', detail: '客户预算与方案报价高度匹配，预算充裕', tags: ['200人规模', '年费预算明确'] },
  { name: '决策权限', icon: '👑', score: 72, color: '#409EFF', detail: '张总为关键决策人，但需信息科技部会签', tags: ['关键决策人', '需跨部门协调'] },
  { name: '需求紧迫', icon: '🔥', score: 88, color: '#F56C6C', detail: '客户正推进数字化转型，对外拓管理改善需求迫切', tags: ['转型期', '3个月窗口'] },
  { name: '关系基础', icon: '🤝', score: 80, color: '#67C23A', detail: '首次拜访建立良好信任，客户认可专业度', tags: ['首次接触', '印象良好'] }
]

const decisionChain = [
  { name: '张总', position: '零售银行部总经理', role: '关键决策人', attitude: '支持' },
  { name: '李经理', position: '信息科技部负责人', role: '技术评估', attitude: '中立' },
  { name: '王主任', position: '采购部负责人', role: '商务谈判', attitude: '待沟通' }
]

const risks = [
  { level: 'medium', title: '技术评估风险', desc: '需通过信息科技部的安全合规评估，预计需1-2周' },
  { level: 'low', title: '预算变动风险', desc: '客户数字化转型预算已批复，资金充裕' },
  { level: 'medium', title: '竞争压力', desc: '客户同时考察2家竞品，需突出差异化优势' }
]

const competitors = [
  { name: '我方', advantage: 45 },
  { name: '竞品A（传统录音笔）', advantage: 30 },
  { name: '竞品B（SaaS方案）', advantage: 25 }
]

const competitiveAdvantage = 'AI智能分析能力（竞品仅基础录音）、银行合规认证（竞品无）、招行等标杆案例'

const painPoints = [
  { title: '客户经理外拓过程管理缺失', urgent: true, impact: 5 },
  { title: '新人上手周期长，优秀经验无法复制', urgent: true, impact: 4 },
  { title: '拜访数据不透明，管理层无法量化评估', urgent: false, impact: 4 },
  { title: '现有CRM系统与移动办公场景脱节', urgent: false, impact: 3 }
]

const strategies = [
  { title: '案例驱动', desc: '以招商银行200人规模成功案例为主线，用数据（拜访量+40%、评分+12分）建立信任' },
  { title: '差异化定位', desc: '强调AI分析+合规认证+私有化部署三大壁垒，与竞品录音笔形成代际差异' },
  { title: '降低决策门槛', desc: '建议20人3个月免费试用方案，用实际效果推动全行推广决策' },
  { title: '加速技术评估', desc: '主动安排技术对接会，提前准备安全合规文档，缩短信息科技部评估周期' }
]

const nextActions = [
  { time: '本周内', title: '发送详细方案+案例', detail: '包含招商银行案例、等保三级证书、API对接文档', priority: '高' },
  { time: '下周', title: '安排技术对接会', detail: '带技术团队与客户信息科技部沟通系统对接方案', priority: '高' },
  { time: '2周后', title: '提交试用方案', detail: '20人3个月试用，明确评估指标和后续采购条件', priority: '中' }
]
</script>

<style scoped>
.purchase-report { }

/* Hero */
.pr-hero { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%); border-radius: 20px; padding: 28px; margin-bottom: 20px; color: #e2e8f0; }
.pr-score-col { text-align: center; }
.pr-ring-wrap { position: relative; width: 120px; height: 120px; margin: 0 auto; }
.pr-ring-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
.pr-big-score { font-size: 40px; font-weight: bold; color: #fbbf24; line-height: 1; }
.pr-score-unit { font-size: 12px; color: #94a3b8; }
.pr-grade { margin-top: 8px; }
.pr-info-col h2 { margin: 0 0 8px; font-size: 20px; }
.pr-info-tags { display: flex; gap: 6px; margin-bottom: 14px; }
.pr-quick-stats { display: flex; gap: 16px; }
.pr-qs-item { text-align: center; padding: 8px 12px; background: rgba(255,255,255,0.06); border-radius: 10px; min-width: 90px; }
.pr-qs-val { font-size: 20px; font-weight: bold; }
.pr-qs-lbl { font-size: 10px; color: #94a3b8; margin-top: 2px; }
.pr-decision-card { background: rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; }
.prd-title { font-size: 13px; color: #94a3b8; margin-bottom: 6px; }
.prd-status { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
.prd-timeline :deep(.el-step__title) { font-size: 11px; color: #94a3b8; }

/* 四维仪表盘 */
.pr-dim-row { margin-bottom: 16px; }
.pr-dim-card { text-align: center; padding: 12px 0; border-top: 3px solid; transition: .2s; }
.pr-dim-card:hover { transform: translateY(-2px); }
.prd-header { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; }
.prd-icon { font-size: 24px; }
.prd-name { font-size: 14px; font-weight: bold; color: #303133; }
.prd-score { font-size: 28px; font-weight: bold; margin-left: auto; }
.prd-detail { font-size: 12px; color: #606266; margin-top: 8px; line-height: 1.5; }
.prd-tags { margin-top: 6px; }

.pr-card { border-radius: 14px; margin-bottom: 0; }

/* 预算匹配 */
.budget-match { }
.bm-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.bm-label { width: 72px; font-size: 13px; color: #606266; flex-shrink: 0; }
.bm-bar-track { flex: 1; height: 26px; background: #f0f2f5; border-radius: 13px; overflow: hidden; }
.bm-bar-fill { height: 26px; border-radius: 13px; display: flex; align-items: center; padding-left: 12px; font-size: 12px; color: #fff; font-weight: bold; }

/* 决策链 */
.decision-chain { display: flex; align-items: center; overflow-x: auto; gap: 6px; }
.dc-person { text-align: center; flex-shrink: 0; }
.dcp-avatar { width: 40px; height: 40px; border-radius: 50%; color: #fff; font-weight: bold; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; }
.dcp-name { font-size: 13px; font-weight: bold; color: #303133; }
.dcp-pos { font-size: 11px; color: #909399; }
.dcp-attitude { font-size: 12px; margin-top: 2px; }

/* 风险 */
.risk-row { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f5f7fa; align-items: flex-start; }
.risk-level { width: 24px; height: 24px; border-radius: 6px; color: #fff; font-size: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.risk-title { font-size: 13px; font-weight: bold; color: #303133; }
.risk-desc { font-size: 12px; color: #909399; margin-top: 2px; }

/* 竞争 */
.comp-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
.comp-name { width: 130px; font-size: 13px; color: #606266; flex-shrink: 0; }
.comp-bar { flex: 1; height: 16px; background: #f0f2f5; border-radius: 8px; overflow: hidden; }
.comp-fill { height: 16px; border-radius: 8px; transition: width 1s; }
.comp-pct { font-size: 12px; font-weight: bold; color: #303133; }
.comp-advantage { font-size: 13px; color: #303133; line-height: 1.6; }

/* 痛点 */
.pp-row { display: flex; gap: 12px; padding: 10px; margin-bottom: 6px; background: #fafbfc; border-radius: 10px; align-items: flex-start; }
.pp-rank { width: 24px; height: 24px; border-radius: 8px; background: #F56C6C; color: #fff; font-size: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pp-title { font-size: 14px; font-weight: bold; color: #303133; }
.pp-impact { font-size: 11px; margin-top: 2px; }

/* 策略 */
.strategy-row { display: flex; gap: 10px; padding: 10px; margin-bottom: 6px; background: #f0f5ff; border-radius: 10px; align-items: flex-start; }
.st-num { width: 22px; height: 22px; border-radius: 50%; color: #fff; font-size: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.st-title { font-size: 13px; font-weight: bold; color: #303133; }
.st-desc { font-size: 12px; color: #606266; margin-top: 2px; line-height: 1.6; }

/* 行动计划 */
.next-card { background: #fafbfc; }
.next-action-card { padding: 14px; background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.na-time { font-size: 12px; color: #409EFF; font-weight: bold; margin-bottom: 4px; }
.na-title { font-size: 14px; font-weight: bold; color: #303133; }
.na-detail { font-size: 12px; color: #606266; margin: 4px 0 8px; line-height: 1.5; }

.pr-bottom-row { margin-bottom: 16px; }
.pr-card-title { font-size: 15px; font-weight: bold; color: #303133; }
</style>
