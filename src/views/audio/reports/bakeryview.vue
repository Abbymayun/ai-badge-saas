<template>
  <div class="bakery-report">
    <!-- Hero -->
    <div class="br-hero">
      <el-row :gutter="20" align="middle">
        <el-col :span="8" style="text-align:center;">
          <div class="br-badge"><span class="brb-val">¥{{ todaySales }}</span><span class="brb-lbl">今日营业额</span></div>
          <div class="br-badge" style="margin-top:8px;"><span class="brb-val" style="font-size:22px;">{{ totalCustomers }}</span><span class="brb-lbl">今日客流/人</span></div>
        </el-col>
        <el-col :span="16"><h2>🍞 面包店经营分析报告</h2>
          <div class="br-meta"><span>店铺：{{ shopName }}</span><span>日期：{{ date }}</span><span>营业时间：{{ hours }}</span></div>
        </el-col>
      </el-row>
    </div>

    <!-- 客流+客单价 -->
    <el-row :gutter="16">
      <el-col :span="8"><el-card shadow="never" class="br-card"><template #header><span class="brc-title">👥 时段客流分析</span></template>
        <div class="flow-chart">
          <div v-for="f in flowData" :key="f.time" class="fc-row"><span class="fc-time">{{ f.time }}</span><div class="fc-bar"><div class="fc-fill" :style="{width:(f.count/25*100)+'%', background: f.count>=20?'#67C23A':f.count>=12?'#409EFF':'#e4e7ed'}"></div></div><span class="fc-count">{{ f.count }}人</span></div>
        </div>
      </el-card></el-col>
      <el-col :span="8"><el-card shadow="never" class="br-card"><template #header><span class="brc-title">🍰 热销产品 TOP5</span></template>
        <div v-for="(p,idx) in topProducts" :key="idx" class="top-row"><span class="top-rank" :class="'r'+idx">{{ idx+1 }}</span><span class="top-name">{{ p.name }}</span><span class="top-info"><span class="top-sales">{{ p.sales }}份</span><span class="top-rev">¥{{ p.revenue }}</span></span></div>
      </el-card></el-col>
      <el-col :span="8"><el-card shadow="never" class="br-card"><template #header><span class="brc-title">📊 品类销售占比</span></template>
        <div v-for="c in categories" :key="c.name" class="cat-row"><span class="cat-name">{{ c.icon }} {{ c.name }}</span><div class="cat-bar"><div class="cat-fill" :style="{width:c.pct+'%',background:c.color}"></div></div><span class="cat-pct">{{ c.pct }}%</span></div>
      </el-card></el-col>
    </el-row>

    <!-- 客单价提升+客户分析 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="br-card"><template #header><span class="brc-title">💰 客单价与连带率分析</span></template>
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="平均客单价">¥{{ avgTicket }}</el-descriptions-item>
          <el-descriptions-item label="最高客单价">¥{{ maxTicket }}</el-descriptions-item>
          <el-descriptions-item label="平均连带件数">{{ avgItems }}件</el-descriptions-item>
          <el-descriptions-item label="套餐购买率">{{ comboRate }}%</el-descriptions-item>
        </el-descriptions>
        <el-alert title="📈 客单价提升机会：套餐购买率仅28%，建议优化套餐组合推荐话术，目标提升至40%" type="warning" :closable="false" show-icon style="margin-top:12px;" />
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="br-card"><template #header><span class="brc-title">👤 客户画像速写</span></template>
        <div class="cust-seg">
          <div v-for="seg in customerSegments" :key="seg.type" class="seg-row"><span class="seg-type" :style="{color:seg.color}">{{ seg.type }}</span><span class="seg-pct">{{ seg.pct }}%</span><div class="seg-bar"><div class="seg-fill" :style="{width:seg.pct+'%',background:seg.color}"></div></div></div>
        </div>
        <el-divider />
        <div class="insight-row"><strong>💡 核心洞察：</strong>{{ insight }}</div>
      </el-card></el-col>
    </el-row>

    <!-- 会员复购 + AI建议 -->
    <el-row :gutter="16">
      <el-col :span="12"><el-card shadow="never" class="br-card"><template #header><span class="brc-title">🔄 会员复购分析</span></template>
        <div class="member-stats"><div class="ms-item"><span class="ms-val">{{ memberCount }}</span><span class="ms-lbl">会员总数</span></div><div class="ms-item"><span class="ms-val" style="color:#67C23A;">{{ repurchaseRate }}%</span><span class="ms-lbl">30天复购率</span></div><div class="ms-item"><span class="ms-val" style="color:#E6A23C;">{{ lostCount }}</span><span class="ms-lbl">流失预警</span></div></div>
        <el-table :data="memberActions" size="small" style="margin-top:8px;"><el-table-column prop="action" label="会员唤醒策略" /><el-table-column prop="target" label="目标人群" width="100" /><el-table-column prop="effect" label="预计效果" width="120" /></el-table>
      </el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="br-card"><template #header><span class="brc-title">💡 AI经营建议</span></template>
        <div v-for="(r,idx) in recommendations" :key="idx" class="rec-item"><span class="ri-num" :style="{background:['#409EFF','#67C23A','#E6A23C'][idx]}">{{ idx+1 }}</span><div><div class="ri-title">{{ r.title }}</div><div class="ri-detail">{{ r.detail }}</div></div></div>
      </el-card></el-col>
    </el-row>

    <div class="br-footer">报告由 AI智能胸牌 自动生成 · 面包店经营分析</div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const shopName = '麦香烘焙·滨江店'; const date = '2026-05-16'; const hours = '07:00-21:00'; const todaySales = 8650; const totalCustomers = 168
const flowData = [
  { time:'7-9时', count:32 },{ time:'9-11时', count:18 },{ time:'11-13时', count:25 },{ time:'13-15时', count:14 },
  { time:'15-17时', count:22 },{ time:'17-19时', count:28 },{ time:'19-21时', count:19 }
]
const topProducts = [
  { name:'招牌菠萝包', sales:48, revenue:384 },{ name:'芝士培根面包', sales:35, revenue:525 },
  { name:'奶油泡芙(4个装)', sales:28, revenue:504 },{ name:'全麦吐司', sales:22, revenue:396 },
  { name:'冰美式咖啡', sales:38, revenue:684 }
]
const categories = [
  { icon:'🍞', name:'面包类', pct:32, color:'#E6A23C' },{ icon:'🥐', name:'酥皮点心', pct:18, color:'#fbbf24' },
  { icon:'🍰', name:'蛋糕甜品', pct:15, color:'#F56C6C' },{ icon:'☕', name:'饮品', pct:25, color:'#409EFF' },
  { icon:'🎁', name:'礼盒/其他', pct:10, color:'#67C23A' }
]
const avgTicket = 51.5; const maxTicket = 186; const avgItems = 2.3; const comboRate = 28
const customerSegments = [
  { type:'上班族(早餐+咖啡)', pct:45, color:'#409EFF' },{ type:'家庭主妇(采购)', pct:25, color:'#67C23A' },
  { type:'学生(下午茶)', pct:18, color:'#E6A23C' },{ type:'路过散客', pct:12, color:'#909399' }
]
const insight = '上班族早餐+咖啡组合贡献45%客流但客单价偏低(平均38元)，建议推出"晨间套餐"(面包+咖啡¥29.9)提升连带率和客单价'
const memberCount = 286; const repurchaseRate = 62; const lostCount = 34
const memberActions = [
  { action:'满5送1积分活动', target:'活跃会员', effect:'预计提升复购率8%' },
  { action:'新品尝鲜券', target:'沉睡会员(>30天未到店)', effect:'预计唤醒15-20人' },
  { action:'生日专属赠品', target:'本月生日会员', effect:'到店率可达80%' }
]
const recommendations = [
  { title:'推出"晨间能量套餐"', detail:'面包+咖啡组合价¥29.9(原价¥38)，利用上班族高峰时段7-9时集中推广，预计提升早餐时段客单价30%' },
  { title:'下午茶时段增加现烤出品', detail:'15-17时增加现烤蛋挞和可颂出品，热乎的香气能吸引路过散客进店，预计提升该时段客流20%' },
  { title:'企业团餐外送服务', detail:'周边写字楼密集，推出企业下午茶团餐(满200元免配送费)，锁定稳定的B端客户' }
]
</script>

<style scoped>
.bakery-report{max-width:960px;margin:0 auto;padding:8px}
.br-hero{background:linear-gradient(135deg,#5b3a1a,#8b5e3c,#6b4a2a);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.br-badge{background:rgba(255,255,255,.12);border-radius:14px;padding:16px}.brb-val{font-size:34px;font-weight:700;display:block;color:#fbbf24}.brb-lbl{font-size:11px;opacity:.7;margin-top:2px}
.br-meta{display:flex;gap:16px;font-size:13px;opacity:.85;margin-top:8px;flex-wrap:wrap}

.br-card{border-radius:12px;margin-bottom:14px}.brc-title{font-size:15px;font-weight:700;color:#1a1a2e}

.flow-chart{}.fc-row{display:flex;align-items:center;gap:8px;padding:4px 0}.fc-time{width:58px;font-size:12px;color:#909399;flex-shrink:0}.fc-bar{flex:1;height:18px;background:#f0f2f5;border-radius:9px;overflow:hidden}.fc-fill{height:18px;border-radius:9px;transition:width.5s}.fc-count{font-size:12px;font-weight:600;color:#303133;width:32px}

.top-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f5f7fa}.top-rank{width:22px;height:22px;border-radius:6px;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#f0f2f5;color:#909399}.top-rank.r0{background:#F56C6C;color:#fff}.top-rank.r1{background:#E6A23C;color:#fff}.top-rank.r2{background:#fbbf24;color:#fff}.top-name{flex:1;font-size:13px;color:#303133}.top-sales{font-size:12px;color:#909399;margin-right:8px}.top-rev{font-size:12px;font-weight:600;color:#F56C6C}

.cat-row{display:flex;align-items:center;gap:8px;padding:5px 0}.cat-name{width:90px;font-size:13px;color:#606266;flex-shrink:0}.cat-bar{flex:1;height:16px;background:#f0f2f5;border-radius:8px;overflow:hidden}.cat-fill{height:16px;border-radius:8px;transition:width.5s}.cat-pct{font-size:12px;font-weight:600;color:#303133}

.cust-seg{}.seg-row{display:flex;align-items:center;gap:8px;padding:4px 0}.seg-type{width:120px;font-size:13px;font-weight:600;flex-shrink:0}.seg-pct{font-size:12px;font-weight:600;width:35px}.seg-bar{flex:1;height:14px;background:#f0f2f5;border-radius:7px;overflow:hidden}.seg-fill{height:14px;border-radius:7px}.insight-row{font-size:13px;color:#606266;line-height:1.6}

.member-stats{display:flex;justify-content:space-around}.ms-item{text-align:center}.ms-val{font-size:24px;font-weight:700;color:#409EFF;display:block}.ms-lbl{font-size:11px;color:#909399;margin-top:2px}

.rec-item{display:flex;gap:10px;padding:10px;margin-bottom:6px;background:#fafbfc;border-radius:10px;align-items:flex-start}.ri-num{width:22px;height:22px;border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.ri-title{font-size:13px;font-weight:700;color:#303133}.ri-detail{font-size:12px;color:#909399;margin-top:3px;line-height:1.5}
.br-footer{text-align:center;padding:20px;color:#ccc;font-size:11px}
</style>
