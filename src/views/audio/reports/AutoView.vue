<template>
  <div class="auto-report">
    <!-- 成交概率 Hero -->
    <div class="ar-hero">
      <el-row :gutter="24" align="middle">
        <el-col :span="6" class="ar-deal-col">
          <div class="ar-deal-ring">
            <svg viewBox="0 0 130 130"><circle cx="65" cy="65" r="55" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="6"/><circle cx="65" cy="65" r="55" fill="none" stroke="#fbbf24" stroke-width="6" :stroke-dasharray="2*Math.PI*55" :stroke-dashoffset="2*Math.PI*55*(1-dealProb/100)" stroke-linecap="round" transform="rotate(-90 65 65)"/></svg>
            <div class="ard-center"><span class="ard-score">{{ dealProb }}%</span><span class="ard-label">成交概率</span></div>
          </div>
        </el-col>
        <el-col :span="12"><h2>🚗 试驾跟进分析报告</h2>
          <div class="ar-meta"><span>{{ customer.name }} · {{ customer.family }}</span><span>意向车型：{{ targetCar }}</span><span>预算：{{ budget }}</span></div>
          <div class="ar-tags"><el-tag size="small" type="warning">{{ urgency }}</el-tag><el-tag size="small" effect="plain">{{ useCase }}</el-tag><el-tag size="small" effect="plain" type="info">竞品：{{ competitors }}</el-tag></div>
        </el-col>
        <el-col :span="6"><div class="ar-kpi-grid"><div class="ar-kpi"><span class="ark-val">¥{{ dealValue }}</span><span class="ark-lbl">预估成交(万)</span></div><div class="ar-kpi"><span class="ark-val">{{ testDriveScore }}</span><span class="ark-lbl">试驾体验分</span></div></div></el-col>
      </el-row>
    </div>

    <!-- 客户需求画像 + 关注点排序 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="ar-card"><template #header><span class="arc-title">🎯 客户需求画像</span></template>
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="用车场景">{{ useCase }}</el-descriptions-item>
          <el-descriptions-item label="家庭情况">{{ familyInfo }}</el-descriptions-item>
          <el-descriptions-item label="预算区间"><strong style="color:#F56C6C;">{{ budget }}</strong></el-descriptions-item>
          <el-descriptions-item label="决策周期">{{ decisionCycle }}</el-descriptions-item>
        </el-descriptions></el-card>
        <el-card shadow="never" class="ar-card" style="margin-top:12px;"><template #header><span class="arc-title">⚖️ 决策因素权重</span></template>
          <div v-for="f in decisionFactors" :key="f.name" class="df-row"><span class="df-name">{{ f.name }}</span><div class="df-bar"><div class="df-fill" :style="{width:f.weight+'%'}">{{ f.weight }}%</div></div></div>
        </el-card>
      </el-col>
      <el-col :span="12"><el-card shadow="never" class="ar-card"><template #header><span class="arc-title">🚘 试驾反馈分析</span></template>
        <div class="fb-section"><h4>👍 满意点</h4><span v-for="l in likedPoints" :key="l" class="fb-tag good">{{ l }}</span></div>
        <div class="fb-section"><h4>👎 顾虑点</h4><span v-for="c in concernPoints" :key="c" class="fb-tag bad">{{ c }}</span></div>
        <div class="fb-section"><h4>💬 客户原话</h4><div v-for="(q,idx) in quotes" :key="idx" class="quote-bubble" :class="q.type"><span class="qb-mark">{{ q.type==='positive'?'✓':'?' }}</span>{{ q.text }}</div></div>
      </el-card></el-col>
    </el-row>

    <!-- 竞品对比 -->
    <el-card shadow="never" class="ar-card"><template #header><span class="arc-title">⚔️ 竞品对比矩阵</span></template>
      <el-table :data="competitorMatrix" size="small" border>
        <el-table-column prop="dim" label="对比维度" width="120" fixed />
        <el-table-column v-for="c in compModels" :key="c" :label="c" width="130">
          <template #default="{row}"><span :style="{color: row[c]===row.best?'#67C23A':'#606266',fontWeight:row[c]===row.best?'bold':'normal'}">{{ row[c] }}</span></template>
        </el-table-column>
        <el-table-column label="我方优势" width="100">
          <template #default="{row}"><el-tag v-if="row.advantage" size="small" type="success">{{ row.advantage }}</el-tag></template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 销售策略评估 + 跟进计划 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="ar-card"><template #header><span class="arc-title">💡 销售策略评估</span></template>
        <div v-for="(s,idx) in strategies" :key="idx" class="st-row">
          <span class="st-dot" :class="s.effective ? 'good' : 'bad'"></span>
          <div class="st-info"><div class="st-title">{{ s.point }}<el-tag :type="s.effective?'success':'warning'" size="small" style="margin-left:6px;">{{ s.effective?'有效':'需改进' }}</el-tag></div><div class="st-detail">{{ s.detail }}</div></div>
        </div>
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="ar-card"><template #header><span class="arc-title">📅 跟进计划</span></template>
        <el-timeline><el-timeline-item v-for="(f,idx) in followUps" :key="idx" :timestamp="f.time" placement="top" :color="idx===0?'#409EFF':idx===followUps.length-1?'#67C23A':'#E6A23C'"><el-card shadow="never" size="small"><strong>{{ f.action }}</strong><div style="font-size:12px;color:#909399;margin-top:3px;">{{ f.detail }}</div></el-card></el-timeline-item></el-timeline>
      </el-card></el-col>
    </el-row>

    <!-- 成交建议 -->
    <el-card shadow="never" class="ar-card ar-final"><template #header><span class="arc-title">🏁 成交推进建议</span></template>
      <el-row :gutter="16"><el-col :span="8" v-for="(t,idx) in closingTips" :key="idx"><div class="ct-card"><span class="ct-icon">{{ ['🎯','💬','🎁'][idx] }}</span><div class="ct-title">{{ t.title }}</div><div class="ct-desc">{{ t.desc }}</div></div></el-col></el-row>
    </el-card>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const dealProb = 72; const customer = { name:'李先生', family:'三口之家' }; const targetCar = 'XX SUV 豪华版'; const budget = '25-35万'; const urgency = '1个月内购车'; const useCase = '家庭日常通勤+周末自驾游'; const competitors = '丰田RAV4、本田CR-V'; const dealValue = 28; const testDriveScore = 88; const familyInfo = '一家三口+偶尔带父母出行，需大空间'; const decisionCycle = '2-4周'
const decisionFactors = [
  { name:'试驾体验', weight:40 },{ name:'品牌口碑', weight:25 },{ name:'价格优惠', weight:20 },{ name:'售后服务', weight:15 }
]
const likedPoints = ['高速隔音效果好','后排空间宽敞','底盘扎实操控稳','内饰用料不错','全景天窗通透']
const concernPoints = ['价格比RAV4贵3-5万','油耗偏高','保养费用不清楚','二手车保值率存疑']
const quotes = [
  { type:'positive', text:'这台车开起来很稳，高速上噪音比我现在那台小多了' },
  { type:'positive', text:'后排很宽敞，爸妈坐着应该舒服，孩子安全座椅也好装' },
  { type:'negative', text:'就是价格方面，比RAV4贵了不少，得跟老婆商量一下' }
]
const compModels = ['XX SUV','丰田RAV4','本田CR-V']
const competitorMatrix = [
  { dim:'安全配置', 'XX SUV':'★★★★★','丰田RAV4':'★★★★☆','本田CR-V':'★★★★☆', best:'★★★★★', advantage:'领先' },
  { dim:'空间表现', 'XX SUV':'★★★★★','丰田RAV4':'★★★★☆','本田CR-V':'★★★★☆', best:'★★★★★', advantage:'领先' },
  { dim:'油耗经济性', 'XX SUV':'★★★☆☆','丰田RAV4':'★★★★★','本田CR-V':'★★★★☆', best:'★★★★★' },
  { dim:'价格竞争力', 'XX SUV':'★★★☆☆','丰田RAV4':'★★★★☆','本田CR-V':'★★★★☆', best:'★★★★☆' },
  { dim:'保值率', 'XX SUV':'★★★☆☆','丰田RAV4':'★★★★★','本田CR-V':'★★★★☆', best:'★★★★★' },
  { dim:'售后服务', 'XX SUV':'★★★★☆','丰田RAV4':'★★★★★','本田CR-V':'★★★★☆', best:'★★★★★' },
  { dim:'智能配置', 'XX SUV':'★★★★★','丰田RAV4':'★★★☆☆','本田CR-V':'★★★☆☆', best:'★★★★★', advantage:'领先' }
]
const strategies = [
  { point:'试驾路线设计', effective:true, detail:'包含高速+城市+颠簸路段，全面展示底盘和静音性能，客户对隔音效果印象深刻' },
  { point:'家庭需求挖掘', effective:true, detail:'注意到客户带家人看车，主动展示儿童座椅接口和后排空间，充分打动家庭决策者' },
  { point:'竞品客观对比', effective:true, detail:'客观承认油耗和保值率差距，但突出安全+空间+智能配置三大优势' },
  { point:'价格谈判', effective:false, detail:'客户询问优惠时仅报了官方优惠，未主动提及金融方案和置换补贴，错失降低心理价位的时机' },
  { point:'跟进节奏', effective:false, detail:'试驾后仅交换联系方式，未约定具体跟进时间，容易被竞品截胡' }
]
const followUps = [
  { time:'当天', action:'发送竞品对比表+金融方案', detail:'包含RAV4/CR-V详细对比、36/48/60期金融方案、置换补贴政策' },
  { time:'3天后', action:'邀约配偶二次试驾', detail:'以"周末试驾送油卡"活动邀约，让家庭决策者共同体验，消除价格顾虑' },
  { time:'周末', action:'限时优惠逼单', detail:'告知月底冲量优惠即将结束，额外赠送3年免费保养+行车记录仪' }
]
const closingTips = [
  { title:'攻克价格关', desc:'用金融方案拉低月供感知（36期月供仅6200元），强调3年免费保养节省约1.2万元' },
  { title:'家庭决策策略', desc:'邀请配偶试驾，准备详细竞品对比资料，用安全配置和空间优势打动家庭决策者' },
  { title:'时机创造紧迫', desc:'月底冲量+限量颜色+"试驾即送"活动组合拳，创造"现在不下订就亏了"的心理' }
]
</script>

<style scoped>
.auto-report{max-width:960px;margin:0 auto;padding:8px}
.ar-hero{background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.ar-deal-ring{position:relative;width:110px;height:110px;margin:0 auto}
.ard-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.ard-score{font-size:32px;font-weight:700;color:#fbbf24;line-height:1}
.ard-label{font-size:11px;color:#94a3b8;display:block}
.ar-deal-col{text-align:center}
.ar-meta{display:flex;gap:16px;font-size:13px;opacity:.8;margin:8px 0;flex-wrap:wrap}
.ar-tags{display:flex;gap:6px}
.ar-kpi-grid{display:flex;flex-direction:column;gap:10px}
.ar-kpi{text-align:center;padding:10px;background:rgba(255,255,255,.08);border-radius:10px}
.ark-val{font-size:22px;font-weight:700;display:block;color:#67C23A}
.ark-lbl{font-size:10px;color:#94a3b8}

.ar-card{border-radius:12px;margin-bottom:14px;box-shadow:0 1px 6px rgba(0,0,0,.03)}
.arc-title{font-size:15px;font-weight:700;color:#1a1a2e}

.df-row{display:flex;align-items:center;gap:10px;padding:6px 0}
.df-name{width:80px;font-size:13px;color:#606266;flex-shrink:0}
.df-bar{flex:1;height:24px;background:#f0f2f5;border-radius:12px;overflow:hidden}
.df-fill{height:24px;background:linear-gradient(90deg,#409EFF,#67C23A);border-radius:12px;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-size:11px;color:#fff;font-weight:700;min-width:40px;transition:width 1s}

.fb-section{margin-bottom:12px}
.fb-section h4{font-size:13px;color:#303133;margin:0 0 6px}
.fb-tag{display:inline-block;padding:3px 10px;margin:3px;border-radius:12px;font-size:12px}
.fb-tag.good{background:#f0f9eb;color:#67C23A}
.fb-tag.bad{background:#fef0f0;color:#E6A23C}
.quote-bubble{padding:10px 14px;margin-bottom:6px;border-radius:10px;font-size:13px;color:#333;line-height:1.6;display:flex;gap:8px}
.quote-bubble.positive{background:#f0f9eb;border-left:3px solid #67C23A}
.quote-bubble.negative{background:#fef0f0;border-left:3px solid #E6A23C}
.qb-mark{font-weight:700;flex-shrink:0}

.st-row{display:flex;gap:10px;padding:10px;margin-bottom:6px;background:#fafbfc;border-radius:8px;align-items:flex-start}
.st-dot{width:10px;height:10px;border-radius:50%;margin-top:5px;flex-shrink:0}
.st-dot.good{background:#67C23A}.st-dot.bad{background:#E6A23C}
.st-title{font-size:13px;font-weight:700;color:#303133}
.st-detail{font-size:12px;color:#909399;margin-top:3px;line-height:1.5}

.ar-final{background:linear-gradient(135deg,#fafbfc,#f0f5ff)}
.ct-card{text-align:center;padding:16px;background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.03)}
.ct-icon{font-size:28px;display:block;margin-bottom:8px}
.ct-title{font-size:14px;font-weight:700;color:#303133}
.ct-desc{font-size:12px;color:#909399;margin-top:4px;line-height:1.6}
</style>
