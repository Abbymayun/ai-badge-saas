<template>
  <div class="ins-report">
    <!-- Hero -->
    <div class="ir-hero">
      <el-row :gutter="20" align="middle">
        <el-col :span="7" style="text-align:center;">
          <div class="ir-ring"><svg viewBox="0 0 130 130"><circle cx="65" cy="65" r="55" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="6"/><circle cx="65" cy="65" r="55" fill="none" stroke="#fbbf24" stroke-width="6" :stroke-dasharray="2*Math.PI*55" :stroke-dashoffset="2*Math.PI*55*(1-totalScore/100)" stroke-linecap="round" transform="rotate(-90 65 65)"/></svg><div class="irr-center"><span class="irr-score">{{ totalScore }}</span><span class="irr-label">家庭保障评分</span></div></div>
        </el-col>
        <el-col :span="17"><h2>🛡️ 家庭保障需求分析报告</h2>
          <div class="ir-meta"><span>客户：赵经理 · 38岁 · 配偶+1孩(8岁)</span><span>家庭年收入：约50万</span><span>沟通时长：{{ duration }}</span></div>
          <div class="ir-tags"><el-tag size="small" type="warning">保障缺口：{{ gaps.length }}项</el-tag><el-tag size="small" type="success">风险等级：{{ riskLevel }}</el-tag></div>
        </el-col>
      </el-row>
    </div>

    <!-- 现有保障 vs 建议保障 -->
    <el-card shadow="never" class="ir-card"><template #header><span class="irc-title">📊 保障缺口总览</span></template>
      <el-table :data="coverageCompare" size="small" border>
        <el-table-column prop="name" label="保障类型" width="120" />
        <el-table-column prop="current" label="现有保障" width="160"><template #default="{row}"><span :style="{color:row.current==='无'?'#F56C6C':'#606266'}">{{ row.current }}</span></template></el-table-column>
        <el-table-column label="建议保障" width="160"><template #default="{row}"><span style="font-weight:700;color:#409EFF;">{{ row.suggested }}</span></template></el-table-column>
        <el-table-column label="缺口评估" width="100"><template #default="{row}"><el-tag :type="row.gap==='严重'?'danger':row.gap==='不足'?'warning':'success'" size="small">{{ row.gap }}</el-tag></template></el-table-column>
        <el-table-column prop="risk" label="风险说明" min-width="200" />
      </el-table>
    </el-card>

    <!-- 三大缺口详细分析 -->
    <el-card shadow="never" class="ir-card"><template #header><span class="irc-title">⚠️ 保障缺口详细分析</span></template>
      <div v-for="(g,idx) in gaps" :key="idx" class="gap-card">
        <div class="gc-header"><span class="gc-num">{{ idx+1 }}</span><span class="gc-title">{{ g.title }}</span><el-tag type="danger" size="small">严重缺口</el-tag></div>
        <div class="gc-body"><div class="gc-risk"><strong>🟡 风险描述：</strong>{{ g.risk }}</div><div class="gc-impact"><strong>💰 潜在损失：</strong>{{ g.impact }}</div><div class="gc-suggestion"><strong>💡 建议方案：</strong>{{ g.suggestion }}</div></div>
      </div>
    </el-card>

    <!-- 推荐方案 + 保费测算 -->
    <el-row :gutter="16">
      <el-col :span="14"><el-card shadow="never" class="ir-card"><template #header><span class="irc-title">💼 推荐保障方案</span></template>
        <div v-for="(r,idx) in recommendations" :key="idx" class="rec-row"><div class="rr-icon" :style="{background:['#409EFF','#67C23A','#E6A23C'][idx]}">{{ ['重疾','寿险','教育'][idx] }}</div><div class="rr-body"><div class="rr-name">{{ r.product }}</div><div class="rr-detail">保额：{{ r.coverage }} | 年缴：{{ r.premium }} | 缴费期：{{ r.period }}</div><div class="rr-reason">{{ r.reason }}</div></div></div>
      </el-card></el-col>
      <el-col :span="10"><el-card shadow="never" class="ir-card"><template #header><span class="irc-title">💰 保费测算</span></template>
        <div class="prem-summary"><div class="prem-total">约 {{ totalPremium }}</div><div class="prem-rate">占家庭年收入 {{ premiumRate }}%</div><el-progress :percentage="premiumRate" :stroke-width="8" :color="premiumRate<=10?'#67C23A':premiumRate<=15?'#409EFF':'#E6A23C'" /></div>
        <el-divider />
        <el-alert title="保费占家庭年收入6.2%，处于合理区间（建议≤10%）" type="success" :closable="false" show-icon />
        <el-alert title="建议优先配置重疾险+定期寿险，教育金可视预算灵活调整" type="info" :closable="false" show-icon style="margin-top:6px;" />
      </el-card></el-col>
    </el-row>

    <!-- 下一步 -->
    <el-card shadow="never" class="ir-card ir-next"><template #header><span class="irc-title">📋 跟进建议</span></template>
      <el-steps :active="0" finish-status="success" align-center>
        <el-step title="发送方案" description="今日发送详细保障方案和产品对比" />
        <el-step title="家庭沟通" description="建议客户与配偶共同审阅方案" />
        <el-step title="答疑签约" description="安排线下/视频会议解答疑问并签约" />
      </el-steps>
    </el-card>

    <div class="ir-footer">报告由 AI智能胸牌 自动生成</div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const totalScore = 78; const duration = '35分钟'; const riskLevel = '🟡 中等风险'; const totalPremium = '约3.1万/年'; const premiumRate = 6.2
const coverageCompare = [
  { name:'重疾保障', current:'无（仅社保）', suggested:'100万', gap:'严重', risk:'一旦确诊重疾，治疗费用+收入损失可能超过50万，现有保障完全无法覆盖' },
  { name:'寿险保障', current:'50万（公司团险）', suggested:'250万', gap:'严重', risk:'家庭经济支柱身故后，房贷+子女教育+生活开支远超50万团险赔付' },
  { name:'意外保障', current:'30万（公司团险）', suggested:'100万', gap:'不足', risk:'意外伤残导致长期失能，30万赔付不足以覆盖康复和收入损失' },
  { name:'医疗补充', current:'社保+企业补充医疗', suggested:'百万医疗险', gap:'不足', risk:'重大疾病住院费用可能超社保报销上限，自费部分负担重' },
  { name:'教育金储备', current:'无', suggested:'年缴2-3万', gap:'严重', risk:'孩子8岁，10年后大学费用约50-100万，目前零储备' }
]
const gaps = [
  { title:'重疾保障缺失', risk:'家庭成员均无商业重疾险，仅依靠社保。一旦确诊重疾（如癌症、心梗），平均治疗费用30-50万，加上康复期收入损失1-2年，总缺口约80-100万', impact:'直接经济损失80-100万 + 家庭生活质量大幅下降', suggestion:'建议配置终身重疾险100万保额，年缴约8000元，含轻症豁免条款' },
  { title:'寿险保额严重不足', risk:'仅50万团险，若发生极端风险，房贷余额约150万+子女教育50万+家庭生活开支50万=250万，缺口200万', impact:'家庭可能面临卖房或子女辍学风险', suggestion:'补充定期寿险200万保至60岁（覆盖房贷+教育关键期），年缴约3000元' },
  { title:'教育金零储备', risk:'孩子8岁，距离大学仅10年。按当前教育成本计算，大学4年+研究生2年约需60-80万，目前无任何专项储备', impact:'可能影响子女教育质量或需要临时借贷', suggestion:'配置教育年金保险或增额终身寿，年缴2万，交10年，18-21岁每年领取5万' }
]
const recommendations = [
  { product:'XX终身重疾险', coverage:'100万', premium:'约8000元/年', period:'20年', reason:'覆盖70种重疾+30种轻症，含轻症豁免，确诊即赔，保障终身' },
  { product:'XX定期寿险', coverage:'200万', premium:'约3000元/年', period:'至60岁', reason:'保障家庭责任最重时期，杠杆率高，保费压力小' },
  { product:'XX教育年金', coverage:'年缴2万', premium:'2万/年', period:'10年', reason:'专款专用，18-21岁每年领取5万，确保教育金不受其他风险影响' }
]
</script>

<style scoped>
.ins-report{max-width:960px;margin:0 auto;padding:8px}
.ir-hero{background:linear-gradient(135deg,#1a1a3e,#2d2563,#1a3a5e);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.ir-ring{position:relative;width:115px;height:115px;margin:0 auto}
.irr-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.irr-score{font-size:36px;font-weight:700;color:#fbbf24}.irr-label{font-size:11px;color:#a0aec0;display:block}
.ir-meta{display:flex;gap:16px;font-size:13px;opacity:.85;margin:8px 0;flex-wrap:wrap}.ir-tags{display:flex;gap:8px;margin-top:8px}

.ir-card{border-radius:12px;margin-bottom:14px}.irc-title{font-size:15px;font-weight:700;color:#1a1a2e}

.gap-card{padding:14px;margin-bottom:8px;background:#fef0f0;border-radius:10px;border-left:3px solid #F56C6C}
.gc-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}.gc-num{width:22px;height:22px;border-radius:50%;background:#F56C6C;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.gc-title{font-size:14px;font-weight:700;color:#303133}
.gc-body>div{font-size:13px;color:#606266;line-height:1.7;padding:2px 0}

.rec-row{display:flex;gap:12px;padding:12px;margin-bottom:6px;background:#fafbfc;border-radius:10px;align-items:flex-start}
.rr-icon{width:36px;height:36px;border-radius:8px;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.rr-name{font-size:14px;font-weight:700;color:#303133}.rr-detail{font-size:12px;color:#909399;margin:3px 0}.rr-reason{font-size:12px;color:#606266;line-height:1.5}

.prem-summary{text-align:center}.prem-total{font-size:28px;font-weight:700;color:#409EFF}.prem-rate{font-size:13px;color:#909399;margin:4px 0 10px}
.ir-next{background:linear-gradient(135deg,#fafbfc,#f0f5ff)}.ir-footer{text-align:center;padding:20px;color:#ccc;font-size:11px}
</style>
