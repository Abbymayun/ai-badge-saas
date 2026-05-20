<template>
  <div class="med-report">
    <!-- Hero -->
    <div class="mr-hero">
      <el-row :gutter="20" align="middle">
        <el-col :span="10"><div class="mr-hero-badge" :class="overall"><span class="mhb-icon">{{ overall==='合规'?'✅':'⚠️' }}</span>{{ overall==='合规'?'合规达标':'存在风险' }}</div><h2>🏥 学术拜访合规评估报告</h2><div class="mr-hero-meta"><span>{{ doctor.hospital }}</span><span>{{ doctor.dept }} · {{ doctor.name }}</span><span>{{ doctor.level }}</span><span>{{ visitDate }}</span></div><div style="margin-top:8px;"><el-tag size="small" type="success">产品：{{ product }}</el-tag></div></el-col>
        <el-col :span="14"><div class="mr-hero-stats"><div class="mrh-stat"><span class="mrh-val" style="color:#67C23A;">{{ complianceRate }}%</span><span class="mrh-lbl">合规通过率</span></div><div class="mrh-stat"><span class="mrh-val" style="color:#409EFF;">{{ qualityScore }}</span><span class="mrh-lbl">拜访质量分</span></div><div class="mrh-stat"><span class="mrh-val">{{ riskLevel }}</span><span class="mrh-lbl">风险等级</span></div></div></el-col>
      </el-row>
    </div>

    <!-- 合规检查清单 -->
    <el-card shadow="never" class="mr-card"><template #header><span class="mrc-title">🔍 合规检查清单</span><el-tag size="small" type="success" style="margin-left:8px;">{{ passCount }}/{{ checks.length }} 通过</el-tag></template>
      <div v-for="(c,idx) in checks" :key="idx" class="check-row">
        <div class="cr-status" :class="c.status">{{ c.status==='pass'?'✓':'✗' }}</div>
        <div class="cr-body"><div class="cr-name">{{ c.name }}</div><div class="cr-detail">{{ c.detail }}</div></div>
        <el-tag :type="c.status==='pass'?'success':'danger'" size="small" effect="plain">{{ c.status==='pass'?'通过':'未通过' }}</el-tag>
      </div>
    </el-card>

    <!-- 拜访质量四维 -->
    <el-card shadow="never" class="mr-card"><template #header><span class="mrc-title">📊 拜访质量评估</span></template>
      <el-row :gutter="16"><el-col :span="6" v-for="d in qualityDims" :key="d.name"><div class="qd-card"><div class="qd-score" :style="{color:d.score>=90?'#67C23A':d.score>=80?'#409EFF':'#E6A23C'}">{{ d.score }}</div><div class="qd-name">{{ d.name }}</div><el-progress :percentage="d.score" :stroke-width="5" :show-text="false" :color="d.score>=90?'#67C23A':'#409EFF'"/><div class="qd-comment">{{ d.comment }}</div></div></el-col></el-row>
    </el-card>

    <!-- 沟通内容分析 + 医生反馈 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="mr-card"><template #header><span class="mrc-title">💬 沟通内容分析</span></template>
        <div class="content-section"><h4>已传递的关键信息</h4><el-tag v-for="k in keyMessages" :key="k" type="success" effect="plain" style="margin:3px;">{{ k }}</el-tag></div>
        <div class="content-section"><h4>医生关注的问题</h4><div v-for="q in docQuestions" :key="q.q" class="dq-row"><span class="dq-q">❓ {{ q.q }}</span><span class="dq-a" :class="q.answered">→ {{ q.answered==='yes'?'已解答':'未充分回答' }}</span></div></div>
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="mr-card"><template #header><span class="mrc-title">👨‍⚕️ 医生反馈与意向</span></template>
        <div class="feedback-box"><el-icon :size="20" color="#409EFF"><ChatDotRound /></el-icon><p>{{ doctorFeedback }}</p></div>
        <el-divider />
        <div class="intent-row"><span>处方意向：</span><el-tag type="warning" size="small">{{ intentLevel }}</el-tag></div>
        <div class="intent-row"><span>关注方向：</span><el-tag v-for="i in interests" :key="i" size="small" effect="plain" style="margin:2px;">{{ i }}</el-tag></div>
      </el-card></el-col>
    </el-row>

    <!-- 风险提示 + 改进建议 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="mr-card"><template #header><span class="mrc-title">⚠️ 风险提示</span></template>
        <div v-if="risks.length"><div v-for="(r,idx) in risks" :key="idx" class="risk-item"><el-icon color="#F56C6C"><WarningFilled /></el-icon><span>{{ r }}</span></div></div>
        <el-empty v-else description="本次拜访无合规风险" :image-size="40" />
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="mr-card"><template #header><span class="mrc-title">📋 改进建议</span></template>
        <div v-for="(imp,idx) in improvements" :key="idx" class="imp-item"><span class="imp-num">{{ idx+1 }}</span><span>{{ imp }}</span></div>
      </el-card></el-col>
    </el-row>

    <div class="mr-footer">报告由 AI智能胸牌 自动生成 · 仅供参考，不作为法律依据</div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const overall = '合规'; const doctor = { hospital:'杭州市第一人民医院', dept:'心内科', name:'王主任', level:'科室主任/主任医师' }; const visitDate = '2026-05-16 15:00'; const product = 'XX降压药（第三代ARB类）'
const complianceRate = 100; const qualityScore = 88; const riskLevel = '🟢 低风险'; const passCount = 5
const checks = [
  { name:'适应症表述合规', detail:'严格按说明书适应症范围介绍，未涉及超适应症推广', status:'pass' },
  { name:'不良反应告知完整', detail:'主动告知头晕、乏力等常见不良反应及发生率（3%-5%），建议定期监测血压', status:'pass' },
  { name:'禁忌症询问到位', detail:'详细询问了过敏史、妊娠情况、肝肾功能状况，确认无禁忌', status:'pass' },
  { name:'竞品比较合规', detail:'与竞品比较时引用公开文献数据（2025 ESC指南），未做不实或贬低性对比', status:'pass' },
  { name:'用法用量正确', detail:'严格按照说明书推荐剂量（50mg QD），强调餐后服用和固定时间', status:'pass' }
]
const qualityDims = [
  { name:'学术专业性', score:90, comment:'医学知识准确，引用最新ESC指南和临床研究数据' },
  { name:'沟通有效性', score:85, comment:'倾听医生临床需求，针对性解答问题，互动良好' },
  { name:'合规规范性', score:95, comment:'合规表现优秀，各项检查全部通过' },
  { name:'关系维护', score:82, comment:'关注医生科研需求，主动提供文献支持，建立专业信任' }
]
const keyMessages = ['第三代ARB类降压药','24小时平稳降压','不良反应发生率低','对肾功能有保护作用','2025 ESC指南推荐','医保乙类报销']
const docQuestions = [
  { q:'长期疗效数据如何？', answered:'yes' },{ q:'与竞品XX相比优势在哪？', answered:'yes' },
  { q:'医保报销比例是多少？', answered:'yes' },{ q:'对老年患者是否需要调整剂量？', answered:'yes' }
]
const doctorFeedback = '王主任对产品的临床数据和最新研究进展表示认可，特别关注了长期疗效和肾功能保护方面的数据。表示愿意在合适的轻中度高血压患者中试用，并关注后续的上市后临床研究结果。'
const intentLevel = '愿意试用'; const interests = ['长期疗效数据','肾功能保护','老年患者安全性','医保政策变化']
const risks = []
const improvements = ['建议准备针对老年患者的专项临床数据，医生对该人群关注度高','可提前整理竞品头对头研究对比表，提高沟通效率','后续随访时可带最新发表的临床研究文献，持续建立学术信任']
</script>

<style scoped>
.med-report{max-width:960px;margin:0 auto;padding:8px}
.mr-hero{background:linear-gradient(135deg,#1a3a2a,#1e4d35,#1a5c3a);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.mr-hero-badge{display:inline-block;padding:4px 16px;border-radius:20px;font-size:14px;font-weight:700;margin-bottom:10px}
.mr-hero-badge.合规{background:rgba(103,194,58,.25)}.mr-hero-badge.不合规{background:rgba(245,108,108,.25)}
.mhb-icon{margin-right:6px}
.mr-hero-meta{display:flex;gap:16px;font-size:13px;opacity:.85;margin:8px 0;flex-wrap:wrap}
.mr-hero-stats{display:flex;gap:20px;justify-content:flex-end}
.mrh-stat{text-align:center;padding:12px 18px;background:rgba(255,255,255,.1);border-radius:12px}
.mrh-val{font-size:28px;font-weight:700;display:block}.mrh-lbl{font-size:11px;opacity:.7;margin-top:4px}

.mr-card{border-radius:12px;margin-bottom:14px}.mrc-title{font-size:15px;font-weight:700;color:#1a1a2e}

.check-row{display:flex;align-items:flex-start;gap:14px;padding:10px;border-bottom:1px solid #f5f7fa}
.cr-status{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0}.cr-status.pass{background:#f0f9eb;color:#67C23A}.cr-status.fail{background:#fef0f0;color:#F56C6C}
.cr-body{flex:1}.cr-name{font-size:14px;font-weight:600;color:#303133}.cr-detail{font-size:12px;color:#909399;margin-top:3px;line-height:1.5}

.qd-card{text-align:center;padding:12px}.qd-score{font-size:36px;font-weight:700}.qd-name{font-size:13px;color:#606266;margin:4px 0 8px}.qd-comment{font-size:11px;color:#909399;margin-top:6px;line-height:1.4}

.content-section{margin-bottom:14px}.content-section h4{font-size:13px;color:#303133;margin:0 0 8px}
.dq-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}.dq-q{color:#303133}.dq-a{font-size:12px}.dq-a.yes{color:#67C23A}.dq-a.no{color:#F56C6C}
.feedback-box{display:flex;gap:10px}.feedback-box p{font-size:13px;color:#606266;line-height:1.8;margin:0}
.intent-row{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;color:#606266}

.risk-item,.imp-item{display:flex;align-items:flex-start;gap:8px;padding:6px 0;font-size:13px;color:#606266;line-height:1.6}.imp-num{width:20px;height:20px;border-radius:50%;background:#409EFF;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mr-footer{text-align:center;padding:20px;color:#ccc;font-size:11px}
</style>
