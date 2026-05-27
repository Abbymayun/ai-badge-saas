<template>
  <div class="general-report">
    <div class="gr-hero">
      <h2>📋 {{ data.title || '销售拜访报告' }}</h2>
      <div class="gr-meta">
        <span>🕐 {{ data.date || '2026-05-27' }}</span>
        <span>👤 {{ data.salesPerson || '销售代表' }}</span>
        <span>🏢 {{ data.customer || '客户' }}</span>
        <span>⏱ {{ data.duration || '35分钟' }}</span>
      </div>
    </div>

    <el-row :gutter="16" class="gr-overview">
      <el-col :span="6"><div class="gro-card"><span class="gro-num" style="color:#409EFF;">{{ data.topics?.length || 5 }}</span><span class="gro-label">讨论议题</span></div></el-col>
      <el-col :span="6"><div class="gro-card"><span class="gro-num" style="color:#67C23A;">{{ data.conclusions?.length || 3 }}</span><span class="gro-label">达成结论</span></div></el-col>
      <el-col :span="6"><div class="gro-card"><span class="gro-num" style="color:#E6A23C;">{{ data.risks?.length || 2 }}</span><span class="gro-label">关注风险</span></div></el-col>
      <el-col :span="6"><div class="gro-card"><span class="gro-num" style="color:#F56C6C;">{{ data.nextSteps?.length || 3 }}</span><span class="gro-label">下一步行动</span></div></el-col>
    </el-row>

    <el-card shadow="never" class="gr-card"><template #header><span class="grc-title">💡 拜访摘要</span></template>
      <div class="grc-summary">{{ data.summary || '本次拜访围绕客户需求和产品方案展开深入交流，双方就核心问题达成初步共识，明确了下一步推进计划。' }}</div>
    </el-card>

    <el-card shadow="never" class="gr-card"><template #header><span class="grc-title">💬 议题讨论</span></template>
      <el-timeline>
        <el-timeline-item v-for="(t,idx) in (data.topics || defaultTopics)" :key="idx" :timestamp="t.time||''" placement="top" :color="t.result?'#67C23A':'#409EFF'" :icon="t.result?'CircleCheckFilled':'MoreFilled'">
          <div class="grt-topic-card">
            <div class="grtt-header"><span class="grtt-num">{{ idx+1 }}</span><span class="grtt-title">{{ t.title }}</span><el-tag v-if="t.result" type="success" size="small" effect="plain">✓ 已达成</el-tag><el-tag v-else type="info" size="small" effect="plain">待跟进</el-tag></div>
            <div class="grtt-detail">{{ t.detail }}</div>
            <div v-if="t.result" class="grtt-result"><span class="grttr-label">📌 结论</span>{{ t.result }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <el-card shadow="never" class="gr-card"><template #header><span class="grc-title">🎯 核心结论</span></template>
      <div class="grc-grid">
        <div v-for="(c,idx) in (data.conclusions || defaultConclusions)" :key="idx" class="grcc-item">
          <div class="grcc-num" style="background:#67C23A;">{{ idx+1 }}</div>
          <div class="grcc-text">{{ c }}</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="gr-card"><template #header><span class="grc-title">⚠️ 风险与关注点</span></template>
      <div v-for="(r,idx) in (data.risks || defaultRisks)" :key="idx" class="gr-risk-item">
        <el-icon style="color:#E6A23C;"><WarningFilled /></el-icon>
        <div><span class="grri-title">{{ r.title }}</span><span class="grri-desc">{{ r.desc }}</span></div>
      </div>
    </el-card>

    <el-card shadow="never" class="gr-card"><template #header><span class="grc-title">📋 下一步行动计划</span></template>
      <div v-for="(s,idx) in (data.nextSteps || defaultSteps)" :key="idx" class="gr-step-item">
        <span class="grsi-num" style="background:#409EFF;">{{ idx+1 }}</span>
        <div class="grsi-body"><div class="grsi-title">{{ s.title }}</div><div class="grsi-meta">{{ s.deadline }} · {{ s.owner }}</div></div>
      </div>
    </el-card>

    <div class="gr-footer">报告由 AI智能胸牌 自动生成</div>
  </div>
</template>

<script setup>
defineProps({ data: Object, template: Object })

const defaultTopics = [
  { time:'约10分钟', title:'客户需求了解', detail:'详细了解了客户当前的业务痛点、团队规模和核心诉求。客户主要关注提升销售效率和过程管理。', result:'明确了客户的三大核心需求：效率提升、数据管理、经验沉淀' },
  { time:'约8分钟', title:'产品方案介绍', detail:'根据客户需求，重点介绍了AI智能胸牌的核心功能和典型应用场景，展示了录音转写、AI分析、话术提取等能力。', result:'客户对产品功能表示认可，尤其关注AI分析报告的实用性' },
  { time:'约7分钟', title:'技术方案与对接', detail:'讨论了系统部署方式、数据安全方案和现有系统对接的可行性。', result:'确认私有化部署方案可行，系统对接需进一步评估' },
  { time:'约5分钟', title:'商务条款沟通', detail:'初步沟通了合作模式、定价方案和实施周期。', result:'' },
  { time:'约5分钟', title:'下一步计划确认', detail:'确认了后续的沟通安排和推进时间节点。', result:'约定下周安排技术团队对接，2周内提供正式方案' }
]
const defaultConclusions = [
  '客户核心需求明确：提升销售效率、数据化过程管理、经验沉淀复制',
  '产品功能满足客户核心需求，AI分析能力是差异化优势',
  '私有化部署方案可行，需技术团队进一步对接确认细节'
]
const defaultRisks = [
  { title:'竞争压力', desc:'客户同时考察2家竞品方案，需突出AI分析差异化优势' },
  { title:'决策周期', desc:'客户内部审批流程可能较长，需提前推进关键决策人沟通' }
]
const defaultSteps = [
  { title:'发送产品方案和案例资料', deadline:'本周内', owner:'销售代表' },
  { title:'安排技术团队对接会议', deadline:'下周', owner:'技术+销售' },
  { title:'提供正式商务方案', deadline:'2周内', owner:'销售代表' }
]
</script>

<style scoped>
.general-report{max-width:900px;margin:0 auto;padding:8px}
.gr-hero{background:linear-gradient(135deg,#f0f5ff,#e8f4fd);border-radius:16px;padding:28px;margin-bottom:20px}
.gr-hero h2{font-size:20px;color:#1a1a2e;margin:0 0 10px}.gr-meta{display:flex;gap:20px;font-size:13px;color:#909399;flex-wrap:wrap}
.gr-overview{margin-bottom:20px}.gro-card{background:#fff;border-radius:14px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.03)}.gro-num{font-size:32px;font-weight:700;display:block}.gro-label{font-size:13px;color:#909399;margin-top:4px}
.gr-card{border-radius:14px;margin-bottom:14px;border:none;box-shadow:0 1px 6px rgba(0,0,0,.03)}
.grc-title{font-size:15px;font-weight:700;color:#1a1a2e}.grc-summary{font-size:14px;color:#4a5568;line-height:1.9}

.grt-topic-card{background:#fafbfc;border-radius:12px;padding:18px;border-left:3px solid #409EFF}
.grtt-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}.grtt-num{width:24px;height:24px;border-radius:8px;background:#409EFF;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.grtt-title{font-size:15px;font-weight:700;color:#1a1a2e;flex:1}.grtt-detail{font-size:13px;color:#606266;line-height:1.8;padding-left:34px}.grtt-result{margin-top:10px;padding:10px 14px;background:#f0f9eb;border-radius:8px;font-size:13px;color:#303133;line-height:1.6}.grttr-label{font-weight:700;color:#67C23A;margin-right:6px}

.grc-grid{display:flex;flex-direction:column;gap:10px}.grcc-item{display:flex;gap:12px;padding:14px;background:#f0f9eb;border-radius:12px;align-items:flex-start}.grcc-num{width:26px;height:26px;border-radius:50%;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.grcc-text{font-size:14px;color:#1a1a2e;line-height:1.6}

.gr-risk-item{display:flex;align-items:flex-start;gap:10px;padding:10px;margin-bottom:6px;background:#fef0f0;border-radius:10px}.grri-title{font-size:14px;font-weight:600;color:#303133;display:block}.grri-desc{font-size:12px;color:#909399;margin-top:2px;display:block}

.gr-step-item{display:flex;gap:12px;padding:10px;align-items:center}.grsi-num{width:24px;height:24px;border-radius:50%;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.grsi-title{font-size:14px;font-weight:600;color:#303133}.grsi-meta{font-size:12px;color:#909399;margin-top:2px}
.gr-footer{text-align:center;padding:20px;color:#ccc;font-size:12px}
</style>
