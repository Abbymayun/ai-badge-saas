<template>
  <div class="pt-report">
    <!-- Hero -->
    <div class="pt-hero">
      <el-row :gutter="20" align="middle">
        <el-col :span="8" style="text-align:center;">
          <div class="pt-score-ring">
            <svg viewBox="0 0 130 130"><circle cx="65" cy="65" r="55" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="6"/><circle cx="65" cy="65" r="55" fill="none" stroke="#409EFF" stroke-width="6" :stroke-dasharray="2*Math.PI*55" :stroke-dashoffset="2*Math.PI*55*(1-totalScore/100)" stroke-linecap="round" transform="rotate(-90 65 65)"/></svg>
            <div class="pts-center"><span class="pts-score">{{ totalScore }}</span><span class="pts-label">沟通质量分</span></div>
          </div>
        </el-col>
        <el-col :span="16"><h2>🏥 医患沟通质量分析报告</h2>
          <div class="pt-hero-meta"><span>医生：{{ doctor.name }} · {{ doctor.dept }}</span><span>患者：{{ patient.name }} {{ patient.gender }} {{ patient.age }}岁</span><span>科室：{{ doctor.dept }}</span></div>
          <div class="pt-hero-meta" style="margin-top:4px;"><span>就诊时间：{{ visitDate }}</span><span>就诊类型：{{ visitType }}</span><span>主诉：{{ chiefComplaint }}</span></div>
        </el-col>
      </el-row>
    </div>

    <!-- 五维评估 -->
    <el-row :gutter="12" class="pt-dims">
      <el-col :span="Math.floor(24/dims.length)" v-for="d in dims" :key="d.name">
        <div class="ptd-card" :style="{borderTopColor:d.color}">
          <div class="ptd-icon">{{ d.icon }}</div>
          <div class="ptd-score" :style="{color:d.color}">{{ d.score }}</div>
          <div class="ptd-name">{{ d.name }}</div>
          <el-progress :percentage="d.score" :color="d.color" :stroke-width="4" :show-text="false" />
          <div class="ptd-comment">{{ d.comment }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 诊疗流程回顾 -->
    <el-card shadow="never" class="pt-card"><template #header><span class="ptc-title">📋 诊疗对话流程回顾</span></template>
      <el-timeline>
        <el-timeline-item v-for="(step,idx) in timeline" :key="idx" :timestamp="step.time" placement="top" :color="step.quality==='good'?'#67C23A':step.quality==='normal'?'#409EFF':'#E6A23C'" :icon="step.quality==='good'?'CircleCheckFilled':step.quality==='normal'?'MoreFilled':'WarningFilled'">
          <el-card shadow="never" size="small">
            <div class="tl-step-title">{{ step.stage }}<el-tag :type="step.quality==='good'?'success':step.quality==='normal'?'':'warning'" size="small" style="margin-left:6px;">{{ step.quality==='good'?'✓ 规范':step.quality==='normal'?'△ 一般':'⚠ 待改进' }}</el-tag></div>
            <div class="tl-detail">{{ step.detail }}</div>
            <div v-if="step.quote" class="tl-quote">"{{ step.quote }}"</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 诊断分析 + 患者理解度 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="pt-card"><template #header><span class="ptc-title">🩺 诊断与处方分析</span></template>
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="初步诊断">{{ diagnosis }}</el-descriptions-item>
          <el-descriptions-item label="诊断依据">{{ diagnosisBasis }}</el-descriptions-item>
          <el-descriptions-item label="处方药品">{{ prescription }}</el-descriptions-item>
          <el-descriptions-item label="用法用量">{{ dosage }}</el-descriptions-item>
          <el-descriptions-item label="用药周期">{{ treatmentCycle }}</el-descriptions-item>
        </el-descriptions>
        <el-alert title="处方合理性评估：用药方案符合指南推荐，剂量适宜" type="success" :closable="false" show-icon style="margin-top:12px;" />
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="pt-card"><template #header><span class="ptc-title">👤 患者理解度评估</span></template>
        <div v-for="(u,idx) in understanding" :key="idx" class="under-row">
          <div class="ur-icon" :style="{background:u.understood?'#f0f9eb':'#fef0f0'}">{{ u.understood?'✓':'?' }}</div>
          <div class="ur-body"><div class="ur-question">{{ u.question }}</div><div class="ur-answer" :style="{color:u.understood?'#67C23A':'#E6A23C'}">{{ u.answer }}</div></div>
        </div>
      </el-card></el-col>
    </el-row>

    <!-- 亮点 + 改进 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="pt-card"><template #header><span class="ptc-title">⭐ 沟通亮点</span></template>
        <div v-for="(h,idx) in highlights" :key="idx" class="hl-row"><span class="hl-num">{{ idx+1 }}</span><span>{{ h }}</span></div>
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="pt-card"><template #header><span class="ptc-title">📈 改进建议</span></template>
        <div v-for="(imp,idx) in improvements" :key="idx" class="hl-row"><span class="hl-num" style="background:#E6A23C;">{{ idx+1 }}</span><span>{{ imp }}</span></div>
      </el-card></el-col>
    </el-row>

    <div class="pt-footer">报告由 AI智能胸牌 自动生成 · 医患沟通质量分析</div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const totalScore = 86
const doctor = { name:'王主任', dept:'心内科' }
const patient = { name:'张先生', gender:'男', age:58 }
const visitDate = '2026-05-16 09:15'; const visitType = '初诊'; const chiefComplaint = '反复头晕2周，伴心悸'
const dims = [
  { name:'问诊完整性', icon:'🔍', score:90, color:'#409EFF', comment:'系统询问了症状、持续时间、诱因、既往史' },
  { name:'诊断清晰度', icon:'📋', score:85, color:'#67C23A', comment:'明确告知诊断结论和依据，患者表示理解' },
  { name:'风险告知', icon:'⚠️', score:78, color:'#E6A23C', comment:'告知了药物副作用，但生活方式建议不够具体' },
  { name:'共情沟通', icon:'💚', score:88, color:'#409EFF', comment:'耐心倾听，对患者的担忧给予了充分回应' },
  { name:'随访安排', icon:'📅', score:82, color:'#67C23A', comment:'明确了复诊时间，但未书面记录给患者' }
]
const timeline = [
  { time:'00:00', stage:'问诊开场', quality:'good', detail:'主动问候，询问就诊原因，语气温和。详细询问了头晕发作频率、持续时间、伴随症状。', quote:'张先生您好，请坐。最近哪里不舒服？这种情况持续多久了？' },
  { time:'03:20', stage:'既往史采集', quality:'good', detail:'系统询问了高血压病史、用药情况、家族史、生活习惯（吸烟/饮酒/饮食）。', quote:'您之前有量过血压吗？家里人有高血压的吗？平时抽烟喝酒吗？' },
  { time:'06:40', stage:'体格检查', quality:'normal', detail:'测量了血压（160/95mmHg），听诊心肺。但未记录心率具体数值，检查过程解释偏少。' },
  { time:'09:15', stage:'诊断告知', quality:'good', detail:'明确告知诊断为"原发性高血压1级"，解释诊断依据，用通俗语言说明病情。', quote:'根据您的症状和今天的血压测量结果，初步判断是高血压，属于1级，不算严重但需要重视。' },
  { time:'12:30', stage:'治疗方案沟通', quality:'normal', detail:'开具了降压药处方并说明了用法，但对不同药物的选择依据解释不够，患者询问后才补充说明。' },
  { time:'15:50', stage:'生活方式指导', quality:'normal', detail:'提到要低盐饮食、适当运动，但建议比较笼统（"少盐"没有具体量化），未提供书面指导材料。' },
  { time:'18:10', stage:'随访安排', quality:'good', detail:'明确告知2周后复诊，建议每天自测血压记录。但复诊细节未书面记录给患者。' }
]
const diagnosis = '原发性高血压 1级（160/95mmHg）'
const diagnosisBasis = '反复头晕2周+血压测量160/95mmHg+无心脑血管并发症表现'
const prescription = '氨氯地平片 5mg QD + 建议低盐饮食+有氧运动'
const dosage = '氨氯地平 5mg 每日一次，晨起服用'
const treatmentCycle = '初始4周，2周后复诊评估'
const understanding = [
  { question:'是否清楚自己的诊断？', answer:'清楚，能复述"高血压1级"', understood:true },
  { question:'是否知道如何正确服药？', answer:'知道每天1次早上吃，但不清楚如果漏服怎么办', understood:true },
  { question:'是否知道需要注意的副作用？', answer:'医生告知了可能头晕、脚踝水肿，患者表示了解', understood:true },
  { question:'是否清楚复诊时间和目的？', answer:'知道2周后复诊，但对复诊需要准备什么不太清楚', understood:false }
]
const highlights = [
  '问诊系统全面，从症状→持续时间→诱因→既往史逐步深入，专业规范',
  '用通俗语言解释医学术语（"血管弹性下降"替代"动脉硬化"），患者容易理解',
  '耐心倾听并回应患者的担忧（"这个药要吃一辈子吗？"给予了合理安抚和解释）',
  '复诊安排明确，给出了具体的复诊时间节点'
]
const improvements = [
  '生活方式指导可更加量化（如"每日食盐<5g"替代"少吃盐"，建议具体运动方案）',
  '用药方案可选择依据可前置说明，避免患者提问后才补充',
  '重要医嘱建议提供书面或电子版记录，方便老年患者记忆和执行',
  '可增加"teach-back"确认法（让患者复述要点），确保真正理解'
]
</script>

<style scoped>
.pt-report{max-width:960px;margin:0 auto;padding:8px}
.pt-hero{background:linear-gradient(135deg,#1e3a5f,#2563a0,#1e5a8a);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.pt-score-ring{position:relative;width:120px;height:120px;margin:0 auto}
.pts-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.pts-score{font-size:38px;font-weight:700;color:#409EFF}.pts-label{font-size:11px;color:#a0aec0;display:block}
.pt-hero-meta{display:flex;gap:16px;font-size:13px;opacity:.85;flex-wrap:wrap}

.pt-dims{margin-bottom:20px}
.ptd-card{background:#fff;border-radius:12px;padding:16px;text-align:center;border-top:3px solid;box-shadow:0 2px 8px rgba(0,0,0,.03)}.ptd-icon{font-size:26px}.ptd-score{font-size:30px;font-weight:700;margin:4px 0}.ptd-name{font-size:13px;color:#606266;margin:2px 0 6px}.ptd-comment{font-size:11px;color:#909399;margin-top:6px;line-height:1.4}

.pt-card{border-radius:12px;margin-bottom:14px}.ptc-title{font-size:15px;font-weight:700;color:#1a1a2e}
.tl-step-title{font-size:14px;font-weight:600;color:#303133}.tl-detail{font-size:13px;color:#606266;line-height:1.7;margin-top:4px}.tl-quote{font-size:12px;color:#909399;font-style:italic;margin-top:4px;padding-left:8px;border-left:2px solid #e4e7ed}

.under-row{display:flex;gap:10px;padding:8px;margin-bottom:4px;border-radius:8px}.ur-icon{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}.ur-question{font-size:13px;color:#303133;font-weight:600}.ur-answer{font-size:12px;margin-top:3px}

.hl-row{display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:13px;color:#606266;line-height:1.6}.hl-num{width:22px;height:22px;border-radius:50%;background:#67C23A;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pt-footer{text-align:center;padding:20px;color:#ccc;font-size:11px}
</style>
