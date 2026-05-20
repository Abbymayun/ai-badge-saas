<template>
  <div class="review-report">
    <!-- Hero: 复盘评分 + 对比上次 -->
    <div class="rv-hero">
      <el-row :gutter="20" align="middle">
        <el-col :span="7" style="text-align:center;">
          <div class="rv-trend"><span class="rvt-arrow" :class="trend>0?'up':'down'">{{ trend>0?'↑':'↓' }}</span><span class="rvt-score">{{ totalScore }}</span><span class="rvt-label">本次评分</span></div>
          <div class="rv-compare">较上次 {{ trend>0?'+'+trend:trend }}分 · {{ compareText }}</div>
        </el-col>
        <el-col :span="17"><h2>🏆 销售对话复盘报告</h2>
          <div class="rv-meta"><span>销售人员：{{ salesPerson }}</span><span>客户：{{ customer }}</span><span>场景：{{ scene }}</span><span>{{ date }}</span></div>
          <div class="rv-summary">{{ summary }}</div>
        </el-col>
      </el-row>
    </div>

    <!-- 复盘总览：3个关键数字 -->
    <el-row :gutter="16" class="rv-overview">
      <el-col :span="8"><div class="rvo-card"><span class="rvo-val" style="color:#67C23A;">{{ highlights.length }}</span><span class="rvo-lbl">亮点沉淀</span></div></el-col>
      <el-col :span="8"><div class="rvo-card"><span class="rvo-val" style="color:#E6A23C;">{{ improvements.length }}</span><span class="rvo-lbl">改进空间</span></div></el-col>
      <el-col :span="8"><div class="rvo-card"><span class="rvo-val" style="color:#409EFF;">{{ scripts.length }}</span><span class="rvo-lbl">可沉淀话术</span></div></el-col>
    </el-row>

    <!-- 对话阶段回顾(时间线) -->
    <el-card shadow="never" class="rv-card"><template #header><span class="rvc-title">⏱️ 对话阶段回顾</span></template>
      <el-timeline>
        <el-timeline-item v-for="(stage,idx) in stages" :key="idx" :timestamp="stage.time" placement="top"
          :color="stage.rating==='good'?'#67C23A':stage.rating==='normal'?'#409EFF':'#E6A23C'"
          :icon="stage.rating==='good'?'CircleCheckFilled':stage.rating==='normal'?'MoreFilled':'WarningFilled'">
          <el-card shadow="never" size="small">
            <div class="stage-header"><span class="stage-name">{{ stage.stage }}</span><el-tag :type="stage.rating==='good'?'success':stage.rating==='normal'?'':'warning'" size="small">{{ stage.rating==='good'?'✨ 出色':stage.rating==='normal'?'👉 正常':'⚠ 需提升' }}</el-tag></div>
            <div class="stage-what">{{ stage.what }}</div>
            <div class="stage-quote" v-if="stage.quote">"{{ stage.quote }}"</div>
            <div class="stage-coach" v-if="stage.coaching">💡 {{ stage.coaching }}</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 亮点 → 可复用 + 待改进 → 辅导建议 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="rv-card"><template #header><span class="rvc-title">⭐ 亮点沉淀（可复用）</span></template>
        <div v-for="(h,idx) in highlights" :key="idx" class="hl-item"><span class="hl-num" style="background:#67C23A;">{{ idx+1 }}</span><div><div class="hl-title">{{ h.title }}</div><div class="hl-detail">{{ h.detail }}</div><el-tag size="small" effect="plain" type="success" style="margin-top:4px;">建议纳入话术库</el-tag></div></div>
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="rv-card"><template #header><span class="rvc-title">🎯 待改进（辅导建议）</span></template>
        <div v-for="(imp,idx) in improvements" :key="idx" class="hl-item"><span class="hl-num" style="background:#E6A23C;">{{ idx+1 }}</span><div><div class="hl-title">{{ imp.title }}</div><div class="hl-detail">{{ imp.detail }}</div><div class="hl-coaching">💡 辅导建议：{{ imp.coaching }}</div></div></div>
      </el-card></el-col>
    </el-row>

    <!-- 可沉淀话术 -->
    <el-card shadow="never" class="rv-card"><template #header><span class="rvc-title">💬 可沉淀的优秀话术</span><el-tag size="small" type="warning">{{ scripts.length }}条</el-tag></template>
      <div v-for="(s,idx) in scripts" :key="idx" class="script-item"><span class="si-num">{{ idx+1 }}</span><div class="si-body"><div class="si-text">"{{ s.text }}"</div><div class="si-meta"><el-tag size="small" effect="plain">{{ s.stage }}</el-tag><el-tag size="small" effect="plain" type="success" style="margin-left:4px;">{{ s.scene }}</el-tag><span style="font-size:12px;color:#909399;margin-left:8px;">{{ s.effect }}</span></div></div></div>
    </el-card>

    <!-- 下次目标 -->
    <el-card shadow="never" class="rv-card rv-next"><template #header><span class="rvc-title">🎯 下次沟通目标</span></template>
      <el-row :gutter="16"><el-col :span="8" v-for="(g,idx) in nextGoals" :key="idx"><div class="goal-card"><span class="gc-icon">{{ ['📊','💪','🎯'][idx] }}</span><div class="gc-title">{{ g.title }}</div><div class="gc-metric"><span class="gcm-now">{{ g.now }}</span><span class="gcm-arrow">→</span><span class="gcm-target">{{ g.target }}</span></div></div></el-col></el-row>
    </el-card>

    <div class="rv-footer">复盘报告由 AI智能胸牌 自动生成 · 持续提升销售能力</div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const totalScore = 79; const trend = 3.5; const compareText = '持续进步中'
const salesPerson = '李飞'; const customer = '赵经理(保险客户)'; const scene = '客户拜访'; const date = '2026-05-16'
const summary = '本次沟通整体流畅，需求挖掘和产品匹配表现良好，但在异议处理和逼单环节有较大提升空间。较上次评分提升3.5分，进步明显。'
const highlights = [
  { title:'开场破冰自然', detail:'通过行业话题切入建立共鸣，"赵经理，最近保险行业在推数字化转型，您这边有没有感受到什么变化？"——既展示专业又引发客户表达' },
  { title:'需求挖掘有层次', detail:'从开放式提问(您最担心什么)到聚焦确认(所以核心是重疾保障对吧)，层层深入，精准锁定客户真实需求' },
  { title:'产品匹配精准', detail:'针对客户三口之家的结构，推荐了重疾+寿险+教育金的组合方案，而非单一产品，展示全局规划能力' }
]
const improvements = [
  { title:'异议处理不够从容', detail:'当客户质疑"保费太贵"时，直接进入价格解释模式，未先共情和理解客户的经济压力', coaching:'先共情("确实，一年3万不是小数目")→再拆分("平摊到每月约2500元")→最后对比("一杯咖啡的价格换来全家保障")' },
  { title:'缺乏数据佐证', detail:'介绍产品时多为定性描述，缺少如"重疾平均治疗费30-50万""85%客户选择100万以上保额"等数据支撑', coaching:'准备3-5个关键数据卡片，在介绍产品时自然引用，增强说服力' },
  { title:'未主动推进下一步', detail:'客户表达"我再考虑考虑"时，仅回复"好的您慢慢考虑"，未约定具体跟进时间和内容', coaching:'回应模板："完全理解需要时间考虑。我们这样约定：下周三我再联系您，届时您有任何问题我一一解答，您看可以吗？"设定具体时间降低客户焦虑' }
]
const scripts = [
  { text:'赵经理，您刚才提到最担心的是万一发生重大疾病，治疗费用会影响孩子上学。说实话，我接触的80%家庭客户都有这个顾虑。', stage:'需求挖掘', scene:'建立共鸣', effect:'客户点头回应，后续沟通更主动' },
  { text:'我们不是推最贵的产品，而是帮您算一笔账——哪些风险必须优先覆盖，哪些可以后续补充。今天先把保障框架定下来。', stage:'方案推荐', scene:'降低防备', effect:'客户从抗拒转为倾听' }
]
const stages = [
  { time:'00:00', stage:'开场破冰', rating:'good', what:'以行业话题切入，自然引导客户表达关注点，氛围轻松', quote:'赵经理，最近保险行业在推数字化转型，您这边有没有感受到什么变化？' },
  { time:'03:20', stage:'需求挖掘', rating:'good', what:'开放式提问→痛点确认→需求优先级排序，层次清晰', coaching:'可以增加"如果只能选一样保障，您最想先解决哪个？"来进一步聚焦' },
  { time:'08:40', stage:'方案推荐', rating:'good', what:'根据家庭结构推荐组合方案，产品匹配度较高' },
  { time:'15:10', stage:'异议处理', rating:'bad', what:'面对"保费太贵"的质疑，直接进入价格解释，未先共情', coaching:'先共情再拆分再对比的3步回应法' },
  { time:'20:30', stage:'促成成交', rating:'bad', what:'客户说"考虑考虑"后未约定下一步，错过推进时机', coaching:'用约定具体时间+具体内容的方式替代被动等待' }
]
const nextGoals = [
  { title:'异议处理', now:'60分', target:'75分' },{ title:'数据引用', now:'40分', target:'70分' },{ title:'逼单推进', now:'50分', target:'70分' }
]
</script>

<style scoped>
.review-report{max-width:960px;margin:0 auto;padding:8px}
.rv-hero{background:linear-gradient(135deg,#2d1b4e,#4a2d6e,#3d2b5e);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.rv-trend{text-align:center}.rvt-arrow{font-size:24px;font-weight:700}.rvt-arrow.up{color:#67C23A}.rvt-score{font-size:44px;font-weight:700;display:block}.rvt-label{font-size:12px;opacity:.7}.rv-compare{font-size:12px;color:#67C23A;margin-top:4px}
.rv-meta{display:flex;gap:16px;font-size:13px;opacity:.85;margin:8px 0;flex-wrap:wrap}.rv-summary{font-size:13px;opacity:.75;line-height:1.6;margin-top:6px}

.rv-overview{margin-bottom:20px}.rvo-card{background:#fff;border-radius:14px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.03)}.rvo-val{font-size:36px;font-weight:700;display:block}.rvo-lbl{font-size:13px;color:#909399;margin-top:4px}

.rv-card{border-radius:12px;margin-bottom:14px}.rvc-title{font-size:15px;font-weight:700;color:#1a1a2e}
.stage-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}.stage-name{font-size:14px;font-weight:600;color:#303133}.stage-what{font-size:13px;color:#606266;line-height:1.6}.stage-quote{font-size:12px;color:#909399;font-style:italic;margin-top:4px;padding-left:8px;border-left:2px solid #e4e7ed}.stage-coach{font-size:12px;color:#409EFF;margin-top:4px;background:#ecf5ff;padding:4px 8px;border-radius:4px;display:inline-block}

.hl-item{display:flex;gap:10px;padding:10px;margin-bottom:6px;background:#fafbfc;border-radius:10px;align-items:flex-start}.hl-num{width:22px;height:22px;border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.hl-title{font-size:13px;font-weight:700;color:#303133}.hl-detail{font-size:12px;color:#606266;margin-top:3px;line-height:1.6}.hl-coaching{font-size:12px;color:#E6A23C;margin-top:4px;background:#fdf6ec;padding:4px 8px;border-radius:4px;display:inline-block}

.script-item{display:flex;gap:10px;padding:10px;margin-bottom:6px;background:#f0f5ff;border-radius:10px;align-items:flex-start}.si-num{width:22px;height:22px;border-radius:50%;background:#409EFF;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.si-text{font-size:13px;color:#303133;font-style:italic;line-height:1.6}.si-meta{margin-top:4px}

.rv-next{background:linear-gradient(135deg,#fafbfc,#f0f5ff)}.goal-card{text-align:center;padding:16px;background:#fff;border-radius:12px}.gc-icon{font-size:28px;display:block;margin-bottom:8px}.gc-title{font-size:14px;font-weight:700;color:#303133}.gc-metric{margin-top:8px;font-size:18px;font-weight:700}.gcm-now{color:#E6A23C}.gcm-arrow{color:#909399;margin:0 6px}.gcm-target{color:#67C23A}
.rv-footer{text-align:center;padding:20px;color:#ccc;font-size:11px}
</style>
