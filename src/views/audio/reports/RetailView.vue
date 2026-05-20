<template>
  <div class="ret-report">
    <!-- Hero -->
    <div class="rr-hero">
      <el-row :gutter="20" align="middle">
        <el-col :span="7" style="text-align:center;">
          <div class="rr-score-badge">
            <span class="rrs-val">{{ customerValue }}</span>
            <span class="rrs-lbl">客户价值分</span>
            <el-tag type="warning" size="small" effect="dark" round style="margin-top:6px;">{{ memberLevel }}</el-tag>
          </div>
        </el-col>
        <el-col :span="17"><h2>🛒 客户画像与消费分析报告</h2>
          <div class="rr-meta"><span>客户：{{ customer.name }} · {{ customer.gender }} · {{ customer.age }}岁</span><span>职业：{{ customer.occupation }}</span><span>到店时间：{{ visitDate }}</span></div>
        </el-col>
      </el-row>
    </div>

    <!-- 本次消费 + 行为分析 -->
    <el-row :gutter="16">
      <el-col :span="8"><el-card shadow="never" class="rr-card">
        <template #header><span class="rrc-title">🛍️ 本次消费明细</span></template>
        <div class="purchase-summary"><div class="ps-amount">{{ purchase.total }}</div><div class="ps-items">{{ purchase.items.length }}件商品</div></div>
        <div v-for="(item,idx) in purchase.items" :key="idx" class="ps-item"><span class="psi-name">{{ item.name }}</span><span class="psi-price">{{ item.price }}</span></div>
        <el-divider /><div class="ps-extras"><span>浏览时长：{{ behavior.browseTime }}</span><span>试用商品：{{ behavior.triedCount }}件</span><span>咨询次数：{{ behavior.askCount }}次</span></div>
      </el-card></el-col>
      <el-col :span="8"><el-card shadow="never" class="rr-card">
        <template #header><span class="rrc-title">🏷️ 偏好标签</span></template>
        <div class="pref-section"><h4>品类偏好</h4><el-tag v-for="p in preferences.categories" :key="p" size="small" style="margin:3px;">{{ p }}</el-tag></div>
        <div class="pref-section"><h4>品牌偏好</h4><el-tag v-for="p in preferences.brands" :key="p" size="small" type="warning" style="margin:3px;">{{ p }}</el-tag></div>
        <div class="pref-section"><h4>购买风格</h4><el-tag v-for="p in preferences.style" :key="p" size="small" type="success" style="margin:3px;">{{ p }}</el-tag></div>
      </el-card></el-col>
      <el-col :span="8"><el-card shadow="never" class="rr-card">
        <template #header><span class="rrc-title">📈 客户价值评估</span></template>
        <div v-for="stat in valueStats" :key="stat.label" class="vs-row"><span class="vs-label">{{ stat.label }}</span><span class="vs-value" :style="{color:stat.color}">{{ stat.value }}</span></div>
        <el-divider />
        <div class="loyalty-badge"><span :style="{color:loyaltyColor}">{{ loyaltyStatus }}</span></div>
      </el-card></el-col>
    </el-row>

    <!-- 导购沟通分析 + 推荐策略 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="rr-card"><template #header><span class="rrc-title">💬 导购沟通分析</span></template>
        <div class="comm-section"><h4>✅ 做得好的</h4><div v-for="g in communication.good" :key="g" class="comm-item good"><el-icon color="#67C23A"><CircleCheckFilled /></el-icon><span>{{ g }}</span></div></div>
        <div class="comm-section"><h4>⚠️ 可改进</h4><div v-for="b in communication.bad" :key="b" class="comm-item bad"><el-icon color="#E6A23C"><WarningFilled /></el-icon><span>{{ b }}</span></div></div>
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="rr-card"><template #header><span class="rrc-title">💡 AI推荐策略</span></template>
        <div v-for="(r,idx) in recommendations" :key="idx" class="rec-item"><span class="ri-num" style="background:#409EFF;">{{ idx+1 }}</span><div><div class="ri-title">{{ r.title }}</div><div class="ri-detail">{{ r.detail }}</div></div></div>
      </el-card></el-col>
    </el-row>

    <!-- 消费趋势 -->
    <el-card shadow="never" class="rr-card"><template #header><span class="rrc-title">📊 近6个月消费趋势</span></template>
      <el-row :gutter="12"><el-col :span="3" v-for="m in monthlyTrend" :key="m.month"><div class="trend-bar-col"><div class="tbc-month">{{ m.month }}</div><div class="tbc-bar" :style="{height:(m.amount/2000*120)+'px', background: m.amount>0?'#409EFF':'#e4e7ed'}"></div><div class="tbc-amount">{{ m.amount>0?'¥'+m.amount:'-' }}</div></div></el-col></el-row>
    </el-card>

    <div class="rr-footer">报告由 AI智能胸牌 自动生成 · 零售客户画像分析</div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const customerValue = 82; const memberLevel = '金卡会员'; const loyaltyColor = '#67C23A'; const loyaltyStatus = '🟢 高忠诚度客户'
const customer = { name:'周女士', gender:'女', age:32, occupation:'互联网公司产品经理' }; const visitDate = '2026-05-15 14:30'
const purchase = { total:'¥1,280', items:[
  { name:'XX精华液 30ml', price:'¥680' },{ name:'XX保湿面霜 50g', price:'¥420' },{ name:'XX卸妆油 150ml', price:'¥180' }
]}
const behavior = { browseTime:'25分钟', triedCount:5, askCount:8 }
const preferences = {
  categories:['护肤品','精华液','面霜','卸妆'], brands:['资生堂','SK-II','雅诗兰黛'], style:['成分党','抗衰老关注','品质导向','价格不敏感']
}
const valueStats = [
  { label:'累计消费次数', value:'8次', color:'#409EFF' },{ label:'累计消费金额', value:'¥9,600', color:'#F56C6C' },
  { label:'平均客单价', value:'¥1,200', color:'#E6A23C' },{ label:'复购周期', value:'约45天', color:'#67C23A' },
  { label:'最近到店', value:'5天前', color:'#409EFF' },{ label:'流失风险', value:'低', color:'#67C23A' }
]
const communication = {
  good:['主动询问肤质和护肤习惯，精准推荐匹配产品','专业知识扎实，对成分功效讲解清晰有说服力','耐心提供试用体验，客户试用后决定购买','添加企业微信，建立后续服务渠道','连带推荐同系列眼霜，客户表示考虑'],
  bad:['未询问客户预算范围，可能错失更高客单价推荐机会','未主动提及会员积分和专属折扣，失去增强粘性的触点','客户表示"考虑一下眼霜"时未约定具体跟进时间']
}
const recommendations = [
  { title:'2周后推送新品', detail:'同品牌新上市面膜即将到货，在到货前1天通过企微推送预告+会员专属折扣' },
  { title:'生日关怀营销', detail:'客户生日下月，提前3天发送生日专属礼遇(双倍积分+赠品)，引导到店消费' },
  { title:'复购提醒', detail:'精华液预计30天用完，在第25天发送补货提醒+满减券，促进复购' }
]
const monthlyTrend = [
  { month:'12月', amount:980 },{ month:'1月', amount:0 },{ month:'2月', amount:1560 },{ month:'3月', amount:0 },{ month:'4月', amount:880 },{ month:'5月', amount:1280 }
]
</script>

<style scoped>
.ret-report{max-width:960px;margin:0 auto;padding:8px}
.rr-hero{background:linear-gradient(135deg,#3e1a5a,#5b2c6e,#3e2a5a);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.rr-score-badge{background:rgba(255,255,255,.1);border-radius:16px;padding:20px}.rrs-val{font-size:40px;font-weight:700;color:#fbbf24;display:block}.rrs-lbl{font-size:12px;opacity:.7}
.rr-meta{display:flex;gap:16px;font-size:13px;opacity:.85;margin-top:8px;flex-wrap:wrap}

.rr-card{border-radius:12px;margin-bottom:14px}.rrc-title{font-size:15px;font-weight:700;color:#1a1a2e}
.purchase-summary{text-align:center;padding:8px}.ps-amount{font-size:32px;font-weight:700;color:#F56C6C}.ps-items{font-size:12px;color:#909399}.ps-item{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #f5f7fa}.psi-price{font-weight:600;color:#303133}.ps-extras{display:flex;justify-content:space-around;font-size:11px;color:#909399}

.pref-section{margin-bottom:10px}.pref-section h4{font-size:12px;color:#909399;margin:0 0 6px}

.vs-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px}.vs-label{color:#909399}.vs-value{font-weight:700}.loyalty-badge{text-align:center;font-size:16px;font-weight:700;padding:8px}

.comm-section{margin-bottom:12px}.comm-section h4{font-size:13px;color:#303133;margin:0 0 6px}.comm-item{display:flex;align-items:flex-start;gap:6px;padding:4px 0;font-size:12px;line-height:1.6}.comm-item.good{color:#606266}.comm-item.bad{color:#E6A23C}

.rec-item{display:flex;gap:10px;padding:10px;margin-bottom:6px;background:#fafbfc;border-radius:10px;align-items:flex-start}.ri-num{width:22px;height:22px;border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.ri-title{font-size:13px;font-weight:700;color:#303133}.ri-detail{font-size:12px;color:#909399;margin-top:3px;line-height:1.5}

.trend-bar-col{text-align:center}.tbc-month{font-size:10px;color:#909399;margin-bottom:4px}.tbc-bar{width:28px;margin:0 auto;border-radius:4px 4px 0 0;min-height:2px;transition:height .5s}.tbc-amount{font-size:10px;color:#606266;margin-top:4px}
.rr-footer{text-align:center;padding:20px;color:#ccc;font-size:11px}
</style>
