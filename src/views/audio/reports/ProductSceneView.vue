<template>
  <div class="prod-report">
    <!-- Hero -->
    <div class="pr-hero">
      <el-row :gutter="20" align="middle">
        <el-col :span="7" style="text-align:center;">
          <div class="pr-hero-ring">
            <svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="6"/><circle cx="70" cy="70" r="58" fill="none" stroke="#67C23A" stroke-width="6" :stroke-dasharray="2*Math.PI*58" :stroke-dashoffset="2*Math.PI*58*(1-totalScore/100)" stroke-linecap="round" transform="rotate(-90 70 70)"/></svg>
            <div class="prr-center"><span class="prr-score">{{ totalScore }}</span><span class="prr-label">产品力评分</span></div>
          </div>
          <el-tag type="success" size="small" effect="dark" round style="margin-top:6px;">{{ totalScore>=90?'🏆 卓越':totalScore>=80?'⭐ 优秀':'📋 良好' }}</el-tag>
        </el-col>
        <el-col :span="17"><h2>⭐ 产品力综合评估报告</h2>
          <div class="pr-hero-meta"><span>产品：{{ productName }}</span><span>销售人员：{{ salesPerson }}</span><span>场景：{{ scene }}</span></div>
          <div class="pr-hero-desc">评估销售人员在对话中对产品的理解深度、介绍完整度、需求匹配精准度及异议处理能力</div>
        </el-col>
      </el-row>
    </div>

    <!-- 四维评估卡 -->
    <el-row :gutter="16" class="pr-dims">
      <el-col :span="6" v-for="d in dims" :key="d.name">
        <div class="prd-card" :style="{borderTopColor:d.color}">
          <div class="prd-icon">{{ d.icon }}</div>
          <div class="prd-score" :style="{color:d.color}">{{ d.score }}</div>
          <div class="prd-name">{{ d.name }}</div>
          <el-progress :percentage="d.score" :color="d.color" :stroke-width="4" :show-text="false" />
          <div class="prd-tags"><el-tag v-for="t in d.tags" :key="t" size="small" effect="plain" style="margin:2px;">{{ t }}</el-tag></div>
        </div>
      </el-col>
    </el-row>

    <!-- 卖点覆盖率热力图 -->
    <el-card shadow="never" class="pr-card">
      <template #header><span class="prc-title">💎 核心卖点覆盖热力图</span><el-tag size="small" type="warning" style="margin-left:8px;">{{ coveredCount }}/{{ sellingPoints.length }} 已覆盖</el-tag></template>
      <div v-for="(sp,idx) in sellingPoints" :key="idx" class="sp-row">
        <span class="sp-num">{{ idx+1 }}</span>
        <div class="sp-info"><div class="sp-name">{{ sp.name }}</div><div class="sp-desc">{{ sp.desc }}</div></div>
        <div class="sp-bar-wrap"><div class="sp-bar"><div class="sp-fill" :class="sp.covered?'covered':'missed'" :style="{width:sp.covered?sp.coverage+'%':'100%'}">{{ sp.covered ? sp.coverage+'%' : '未提及' }}</div></div></div>
        <el-tag :type="sp.covered?'success':'danger'" size="small" effect="plain">{{ sp.covered?'✓ 已覆盖':'✗ 遗漏' }}</el-tag>
      </div>
    </el-card>

    <!-- 需求-产品匹配 + 异议处理 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="pr-card"><template #header><span class="prc-title">🎯 需求→产品匹配分析</span></template>
        <div v-for="(m,idx) in needMatch" :key="idx" class="match-row">
          <div class="mr-need"><el-tag size="small" type="danger">{{ m.need }}</el-tag></div>
          <el-icon color="#409EFF"><ArrowRight /></el-icon>
          <div class="mr-feature"><span class="mrf-name">{{ m.feature }}</span><el-tag size="small" :type="m.matched?'success':'info'" effect="plain">{{ m.matched?'✓ 精准匹配':'△ 部分匹配' }}</el-tag></div>
        </div>
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="pr-card"><template #header><span class="prc-title">🛡️ 产品异议处理</span></template>
        <div v-for="(o,idx) in objections" :key="idx" class="obj-row">
          <div class="obj-concern">🤔 {{ o.concern }}</div>
          <div class="obj-response" :class="o.handled"><span class="obj-tag">{{ o.handled==='good'?'✅ 有效回应':o.handled==='partial'?'⚠️ 部分回应':'❌ 未回应' }}</span>{{ o.response }}</div>
        </div>
      </el-card></el-col>
    </el-row>

    <!-- 竞品对比定位 -->
    <el-card shadow="never" class="pr-card"><template #header><span class="prc-title">⚔️ 竞品对比定位</span></template>
      <el-row :gutter="12">
        <el-col :span="6" v-for="c in competitorDims" :key="c.name"><div class="comp-card"><div class="cc-name">{{ c.name }}</div>
          <div class="cc-bars"><div class="cc-us" :style="{width:c.us+'%'}"><small>我方 {{ c.us }}</small></div><div class="cc-them" :style="{width:c.them+'%'}"><small>竞品 {{ c.them }}</small></div></div>
          <div class="cc-verdict" :style="{color:c.us>c.them?'#67C23A':'#E6A23C'}">{{ c.us>c.them?'✓ 优势':'需加强' }}</div></div></el-col>
      </el-row>
    </el-card>

    <!-- AI知识图谱分析 -->
    <el-card shadow="never" class="pr-card"><template #header><span class="prc-title">🧠 产品知识图谱分析</span></template>
      <el-row :gutter="16">
        <el-col :span="12"><h4 style="margin:0 0 8px;font-size:14px;">✅ 已掌握</h4><el-tag v-for="k in knowledge.known" :key="k" type="success" effect="plain" style="margin:3px;">{{ k }}</el-tag></el-col>
        <el-col :span="12"><h4 style="margin:0 0 8px;font-size:14px;">⚠️ 知识盲区（建议补充）</h4><el-tag v-for="k in knowledge.gaps" :key="k" type="danger" effect="plain" style="margin:3px;">{{ k }}</el-tag></el-col>
      </el-row>
    </el-card>

    <!-- 提升建议 -->
    <el-card shadow="never" class="pr-card pr-improve"><template #header><span class="prc-title">📋 产品力提升建议</span></template>
      <el-row :gutter="16"><el-col :span="8" v-for="(r,idx) in recommendations" :key="idx"><div class="rec-card"><span class="rec-icon">{{ ['📖','🎯','💪'][idx] }}</span><div class="rec-title">{{ r.title }}</div><div class="rec-desc">{{ r.desc }}</div></div></el-col></el-row>
    </el-card>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const totalScore = 82; const productName = 'AI智能胸牌3S增强版'; const salesPerson = '朱炫'; const scene = '客户产品演示'
const dims = [
  { name:'介绍完整度', icon:'📋', score:85, color:'#409EFF', tags:['核心功能','场景展示'] },
  { name:'需求匹配度', icon:'🎯', score:78, color:'#67C23A', tags:['痛点对应','场景化'] },
  { name:'异议应对', icon:'🛡️', score:72, color:'#E6A23C', tags:['价格','安全'] },
  { name:'竞品区隔', icon:'⚔️', score:68, color:'#909399', tags:['差异化不足'] }
]
const sellingPoints = [
  { name:'AI语音实时转写', desc:'准确率98%+多人对话自动区分', covered:true, coverage:95 },
  { name:'智能分析报告生成', desc:'客户画像+需求分析+行动建议', covered:true, coverage:88 },
  { name:'等保三级安全认证', desc:'银行级数据加密+私有化部署', covered:true, coverage:82 },
  { name:'双麦降噪芯片', desc:'5米内清晰拾音，嘈杂环境可用', covered:true, coverage:75 },
  { name:'轻量化设计28克', desc:'佩戴无感，全天舒适', covered:false, coverage:0 },
  { name:'招商银行标杆案例', desc:'拜访量+40%、评分+12分', covered:true, coverage:90 },
  { name:'API标准对接能力', desc:'与CRM等系统无缝集成', covered:false, coverage:0 },
  { name:'售后服务体系', desc:'7×24小时+专属客户成功经理', covered:false, coverage:0 }
]
const coveredCount = sellingPoints.filter(s=>s.covered).length
const needMatch = [
  { need:'提升外拓拜访效率', feature:'AI自动记录+分析+生成报告', matched:true },
  { need:'客户经理过程管理', feature:'实时数据看板+能力评分', matched:true },
  { need:'数据安全合规', feature:'等保三级+私有化部署', matched:true },
  { need:'降低新人培训成本', feature:'话术自动沉淀+案例库', matched:false }
]
const objections = [
  { concern:'价格比竞品贵', response:'详细介绍硬件成本构成和AI分析带来的ROI（招行案例ROI 300%）', handled:'good' },
  { concern:'数据安全担忧', response:'展示了等保三级证书和私有化部署方案', handled:'good' },
  { concern:'系统对接难度', response:'仅提及有API，未给出具体对接方案和时间预估', handled:'partial' },
  { concern:'竞品对比', response:'未主动进行竞品对比，客户提问后才被动回应', handled:'partial' }
]
const competitorDims = [
  { name:'AI分析能力', us:95, them:10 },{ name:'安全合规', us:88, them:35 },
  { name:'价格竞争力', us:60, them:82 },{ name:'品牌知名度', us:35, them:88 }
]
const knowledge = {
  known: ['核心功能参数','AI分析流程','等保认证体系','硬件规格','招行案例数据','典型应用场景'],
  gaps: ['竞品详细对比数据','ROI量化计算方法','售后服务SLA条款','系统对接技术细节','行业定制化方案']
}
const recommendations = [
  { title:'补齐知识盲区', desc:'本周内学习竞品对比资料和ROI计算模型，准备3组行业定制方案话术' },
  { title:'强化需求匹配', desc:'拜访前先研究客户行业痛点，准备"痛点→功能→价值"三段式介绍框架' },
  { title:'建立产品信心', desc:'通过角色扮演练习产品介绍，录音自评覆盖率和遗漏点，目标覆盖率≥90%' }
]
</script>

<style scoped>
.prod-report{max-width:960px;margin:0 auto;padding:8px}
.pr-hero{background:linear-gradient(135deg,#1a3a1a,#1e4d2e,#1a5c3a);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.pr-hero-ring{position:relative;width:120px;height:120px;margin:0 auto}
.prr-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.prr-score{font-size:38px;font-weight:700;color:#67C23A}
.prr-label{font-size:11px;color:#a0aec0;display:block}
.pr-hero-meta{display:flex;gap:16px;font-size:13px;opacity:.85;margin:8px 0;flex-wrap:wrap}
.pr-hero-desc{font-size:13px;opacity:.7;line-height:1.6}

.pr-dims{margin-bottom:20px}
.prd-card{background:#fff;border-radius:12px;padding:18px;text-align:center;border-top:3px solid;box-shadow:0 2px 8px rgba(0,0,0,.03)}
.prd-icon{font-size:28px;margin-bottom:4px}
.prd-score{font-size:32px;font-weight:700}
.prd-name{font-size:13px;color:#606266;margin:4px 0 8px}
.prd-tags{min-height:26px;margin-top:6px}

.pr-card{border-radius:12px;margin-bottom:14px}
.prc-title{font-size:15px;font-weight:700;color:#1a1a2e}

.sp-row{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #f5f7fa}
.sp-num{width:24px;height:24px;border-radius:6px;background:#f0f2f5;color:#909399;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sp-info{width:220px;flex-shrink:0}.sp-name{font-size:13px;font-weight:600;color:#303133}.sp-desc{font-size:11px;color:#909399;margin-top:2px}
.sp-bar-wrap{flex:1}.sp-bar{height:22px;background:#f0f2f5;border-radius:11px;overflow:hidden}
.sp-fill{height:22px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:600}
.sp-fill.covered{background:linear-gradient(90deg,#67C23A,#409EFF)}.sp-fill.missed{background:#F56C6C;color:#fff}

.match-row{display:flex;align-items:center;gap:8px;padding:8px;margin-bottom:4px;background:#fafbfc;border-radius:8px}.mr-feature{flex:1;display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#303133}.mrf-name{font-weight:600}

.obj-row{padding:10px;margin-bottom:6px;border-radius:8px}.obj-concern{font-size:13px;font-weight:600;color:#E6A23C;margin-bottom:4px}.obj-response{font-size:12px;color:#606266;line-height:1.6;padding:8px;border-radius:6px}.obj-response.good{background:#f0f9eb}.obj-response.partial{background:#fdf6ec}.obj-tag{font-weight:700;margin-right:6px}

.comp-card{text-align:center;padding:12px;background:#fafbfc;border-radius:10px}
.cc-name{font-size:13px;font-weight:700;color:#303133;margin-bottom:8px}
.cc-bars{display:flex;gap:4px;margin-bottom:6px}
.cc-us,.cc-them{height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;min-width:30px}.cc-us{background:#409EFF}.cc-them{background:#c0c4cc}
.cc-verdict{font-size:12px;font-weight:600}

.pr-improve{background:linear-gradient(135deg,#fafbfc,#f0f9ff)}
.rec-card{text-align:center;padding:16px;background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.03)}
.rec-icon{font-size:28px;display:block;margin-bottom:8px}.rec-title{font-size:14px;font-weight:700;color:#303133}.rec-desc{font-size:12px;color:#909399;margin-top:4px;line-height:1.6}
</style>
