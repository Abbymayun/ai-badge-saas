<template>
  <div class="profile-detail">
    <!-- Hero -->
    <div class="pd-hero">
      <el-row :gutter="24" align="middle">
        <el-col :span="4" style="text-align:center">
          <el-avatar :size="80" :style="{background:salesPerson.color,fontSize:'32px'}">{{ salesPerson.name[0] }}</el-avatar>
          <div style="margin-top:8px"><el-tag v-if="salesPerson.gold" type="warning" size="small">🏆 金牌销售</el-tag></div>
        </el-col>
        <el-col :span="12">
          <h2>{{ salesPerson.name }}</h2>
          <div class="pd-meta"><span>{{ salesPerson.dept }}</span><span>{{ salesPerson.industry }}行业</span><span>从业{{ salesPerson.years }}年</span></div>
          <div class="pd-tags"><el-tag v-for="t in salesPerson.tags" :key="t" size="small" effect="plain" style="margin:2px">{{ t }}</el-tag></div>
        </el-col>
        <el-col :span="8">
          <div class="pd-kpi-grid">
            <div class="pd-kpi"><span class="pdk-val" style="color:#fbbf24">{{ salesPerson.score }}</span><span class="pdk-lbl">综合评分</span></div>
            <div class="pd-kpi"><span class="pdk-val">{{ salesPerson.rank }}</span><span class="pdk-lbl">团队排名</span></div>
            <div class="pd-kpi"><span class="pdk-val" style="color:#67C23A">{{ salesPerson.conversion }}%</span><span class="pdk-lbl">转化率</span></div>
            <div class="pd-kpi"><span class="pdk-val">{{ salesPerson.deals }}</span><span class="pdk-lbl">成交客户</span></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 能力分析 + 成长曲线 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never" class="pd-card"><template #header><span class="pdc-title">🎯 能力雷达图</span></template>
          <div ref="radarRef" style="height:300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="pd-card"><template #header><span class="pdc-title">📈 成长趋势</span></template>
          <div ref="trendRef" style="height:300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 话术沉淀 -->
    <el-card shadow="never" class="pd-card"><template #header><span class="pdc-title">💬 个人话术沉淀（持续优化中）</span><el-tag size="small" type="warning">{{ scripts.length }}条话术</el-tag></template>
      <el-table :data="scripts" stripe>
        <el-table-column prop="version" label="版本" width="60"><template #default="{row}"><el-tag size="small">v{{ row.version }}</el-tag></template></el-table-column>
        <el-table-column prop="scene" label="场景" width="120" />
        <el-table-column prop="content" label="话术内容" min-width="300" show-overflow-tooltip />
        <el-table-column prop="effect" label="效果评估" width="100"><template #default="{row}"><el-rate v-model="row.stars" disabled show-score text-color="#fbbf24" /></template></el-table-column>
        <el-table-column prop="improvement" label="本次优化点" min-width="200" show-overflow-tooltip>
          <template #default="{row}"><span v-if="row.improvement" style="color:#E6A23C">📝 {{ row.improvement }}</span><span v-else style="color:#909399">初始版本</span></template>
        </el-table-column>
        <el-table-column prop="date" label="更新时间" width="110" />
      </el-table>
      <div style="margin-top:12px">
        <el-button type="primary" size="small" @click="addScript">➕ 沉淀新话术</el-button>
      </div>
    </el-card>

    <!-- 优秀案例 -->
    <el-card shadow="never" class="pd-card"><template #header><span class="pdc-title">⭐ 优秀对话案例 Top5</span></template>
      <el-timeline>
        <el-timeline-item v-for="(c,idx) in topCases" :key="idx" :timestamp="c.date" placement="top" color="#67C23A">
          <el-card shadow="never" size="small">
            <div style="font-weight:700;color:#303133;margin-bottom:4px">{{ c.title }}</div>
            <div style="font-size:12px;color:#909399;line-height:1.6">{{ c.detail }}</div>
            <div style="margin-top:4px"><el-tag size="small" type="success">评分 {{ c.score }}</el-tag><el-tag size="small" effect="plain" style="margin-left:4px">{{ c.keySkill }}</el-tag></div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = parseInt(route.params.id) || 1

const profiles = {
  1: { name:'王志华',dept:'华东区',industry:'银行',years:8,score:92,gold:true,color:'#409EFF',rank:'Top 3',conversion:32,deals:45,tags:['顾问型','银行专家','需求深挖','高风险客户','关系维护'] },
  2: { name:'朱炫',dept:'华南区',industry:'汽车',years:6,score:88,gold:true,color:'#67C23A',rank:'Top 5',conversion:28,deals:38,tags:['专业型','汽车专家','产品演示','试驾促成'] },
  3: { name:'李飞',dept:'华北区',industry:'保险',years:5,score:85,gold:false,color:'#E6A23C',rank:'Top 8',conversion:25,deals:32,tags:['亲和型','保险顾问','信任建立'] },
  4: { name:'张锐',dept:'西南区',industry:'地产',years:7,score:82,gold:false,color:'#F56C6C',rank:'Top 10',conversion:22,deals:28,tags:['效率型','地产专家','逼单促成'] }
}

const salesPerson = ref(profiles[id] || profiles[1])

const scripts = ref([
  { version:3, scene:'银行首次拜访开场', content:'张总您好，我是利尔达的小王。我们专注企业数字化转型，特别是帮银行提升客户经理销售效能。了解到贵行在推进转型，不知道外拓管理这块有没有痛点？', stars:4.8, improvement:'增加"数字化转型"关键词，更贴合银行当前语境', date:'2026-05-28' },
  { version:2, scene:'银行首次拜访开场', content:'张总您好，我是利尔达AI科技的小王。我们公司帮银行做客户经理的AI赋能。贵行最近在招行那边有没有听说我们的案例？', stars:4.2, improvement:'引入招商银行案例钩子，增强客户兴趣', date:'2026-05-15' },
  { version:1, scene:'银行首次拜访开场', content:'张总您好，我是利尔达的小王。我们做AI智能胸牌的，帮销售自动录音和分析。您有兴趣了解一下吗？', stars:3.5, improvement:null, date:'2026-04-20' },
  { version:2, scene:'数据安全异议处理', content:'您说的数据安全我们非常理解。我们通过了等保三级，支持私有化部署，招商银行已经在用。您可以看看他们的安全评估报告。', stars:4.5, improvement:'从2个论据升级到3个（证书+方案+案例），更有说服力', date:'2026-05-20' },
  { version:1, scene:'数据安全异议处理', content:'我们数据是加密的，通过了等保三级认证，很安全的。', stars:3.0, improvement:null, date:'2026-04-25' }
])

const topCases = [
  { date:'2026-05-17', title:'兴业银行张总拜访', detail:'精准锁定三大痛点，招商案例有效建立信任。当场确认试用意向。', score:'88分', keySkill:'需求挖掘+案例佐证' },
  { date:'2026-05-14', title:'杭州银行二次跟进', detail:'成功化解价格和安全两个异议，推动客户从观望到主动询问方案细节。', score:'85分', keySkill:'异议处理+价值重塑' },
  { date:'2026-05-10', title:'南京银行产品演示', detail:'产品介绍结构清晰，从场景→功能→价值层层递进，客户主动提出引荐给上级。', score:'90分', keySkill:'场景化产品介绍' }
]

const radarRef = ref(null), trendRef = ref(null)

onMounted(()=>{nextTick(()=>{
  if(radarRef.value){
    const c=echarts.init(radarRef.value)
    c.setOption({radar:{indicator:[{name:'需求挖掘',max:100},{name:'产品介绍',max:100},{name:'异议处理',max:100},{name:'逼单成交',max:100},{name:'客户关系',max:100}]},series:[{type:'radar',data:[{value:[95,82,90,70,88],name:salesPerson.value.name,areaStyle:{color:'rgba(64,158,255,.15)'},itemStyle:{color:'#409EFF'}},{value:[75,72,68,65,70],name:'团队平均',areaStyle:{color:'rgba(192,196,204,.1)'},lineStyle:{type:'dashed'}}]}]})
  }
  if(trendRef.value){
    const c=echarts.init(trendRef.value)
    c.setOption({xAxis:{type:'category',data:['1月','2月','3月','4月','5月','6月']},yAxis:{min:60,max:100},series:[{name:'综合评分',type:'line',smooth:true,data:[80,83,85,88,90,92],itemStyle:{color:'#409EFF'},areaStyle:{color:'rgba(64,158,255,.1)'}},{name:'团队平均',type:'line',data:[70,71,72,73,74,75],lineStyle:{type:'dashed',color:'#c0c4cc'}}],grid:{left:40,right:20,top:20,bottom:30},legend:{data:['综合评分','团队平均'],bottom:0}})
  }
})})

const addScript = () => { scripts.value.unshift({ version:scripts.value.length+1, scene:'新场景', content:'新话术内容...', stars:4.0, improvement:'新增', date:new Date().toISOString().slice(0,10) }) }
</script>

<style scoped>
.profile-detail{padding:8px;max-width:1100px;margin:0 auto}
.pd-hero{background:linear-gradient(135deg,#1e3a5f,#2563a0);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.pd-hero h2{margin:0 0 8px;font-size:22px}.pd-meta{display:flex;gap:16px;font-size:13px;opacity:.85;margin:6px 0}.pd-tags{margin-top:6px}
.pd-kpi-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.pd-kpi{text-align:center;padding:8px;background:rgba(255,255,255,.08);border-radius:10px}.pdk-val{font-size:22px;font-weight:700;display:block}.pdk-lbl{font-size:10px;color:#94a3b8}
.pd-card{border-radius:12px;margin-bottom:14px}.pdc-title{font-size:15px;font-weight:700;color:#1a1a2e}
</style>
