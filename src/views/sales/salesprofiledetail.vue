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

    <!-- 销售类型 + 提升监督 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never" class="pd-card">
          <template #header><span class="pdc-title">🧠 销售类型分析</span></template>
          <div class="type-section">
            <div class="type-main">
              <span class="type-badge" :style="{background:persona.primaryColor}">{{ persona.primaryType }}</span>
              <span class="type-sub" v-for="t in persona.subTypes" :key="t">{{ t }}</span>
            </div>
            <el-divider style="margin:10px 0" />
            <div class="type-row"><strong>沟通风格</strong><span>{{ persona.commStyle }}</span></div>
            <div class="type-row"><strong>擅长场景</strong><span>{{ persona.bestScene }}</span></div>
            <div class="type-row"><strong>客户偏好</strong><span>{{ persona.customerType }}</span></div>
            <div class="type-row"><strong>成交节奏</strong><span>{{ persona.closePace }}</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="pd-card">
          <template #header><span class="pdc-title">📊 销售提升监督</span></template>
          <div class="improve-section">
            <div class="improve-metric" v-for="m in improveMetrics" :key="m.name">
              <div class="im-header">
                <span>{{ m.name }}</span>
                <span class="im-val" :style="{color:m.color}">{{ m.current }}/{{ m.target }}</span>
              </div>
              <el-progress :percentage="m.percent" :color="m.color" :stroke-width="8" />
              <div class="im-tip">{{ m.tip }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 优势 + 待提升 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never" class="pd-card">
          <template #header><span class="pdc-title" style="color:#67C23A">💪 核心优势</span></template>
          <div class="strength-list">
            <div class="strength-item" v-for="s in persona.strengths" :key="s.title">
              <div class="si-title">{{ s.title }}</div>
              <div class="si-desc">{{ s.desc }}</div>
              <div class="si-evidence">📊 数据支撑：{{ s.evidence }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="pd-card">
          <template #header><span class="pdc-title" style="color:#E6A23C">🎯 待提升方向</span></template>
          <div class="weakness-list">
            <div class="weakness-item" v-for="w in persona.weaknesses" :key="w.title">
              <div class="wi-title">{{ w.title }}</div>
              <div class="wi-desc">{{ w.desc }}</div>
              <div class="wi-action">{{ w.action }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

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

// 销售类型分析数据
const personaData = {
  1: { primaryType:'顾问型销售', primaryColor:'#409EFF', subTypes:['行业专家','需求导向'], commStyle:'沉稳专业，善于提问引导，先理解再建议', bestScene:'银行/金融类高层拜访，需求复杂度高', customerType:'决策链长、理性决策的B端客户', closePace:'稳健推进，3-5次拜访成交',
    strengths:[
      {title:'需求深挖能力突出',desc:'AI分析显示，每次拜访平均提问12个，其中开放式问题6个，远超团队平均8个',evidence:'开放式问题占比50%，团队平均35%'},
      {title:'行业知识储备深厚',desc:'银行行业话术匹配度97%，能准确引用行业术语和监管政策',evidence:'行业关键词命中率97%，同业案例引用率85%'},
      {title:'异议处理转化率高',desc:'面对客户质疑时，先共情再解释的模式使异议转化率达78%',evidence:'异议处理后继续推进率78%，团队平均55%'}
    ],
    weaknesses:[
      {title:'逼单成交偏保守',desc:'AI分析显示在客户表达购买信号后，主动试探成交的时机平均延迟2.3个回合',action:'建议：识别到3个以上购买信号时，立即启动"试探成交"话术'},
      {title:'产品演示互动性不足',desc:'产品介绍阶段单向讲述占比过高（65%），客户提问占比偏低',action:'建议：每讲一个功能后，主动问"这个对您的团队有什么启发吗？"'}
    ]
  },
  2: { primaryType:'专业型销售', primaryColor:'#67C23A', subTypes:['产品专家','演示高手'], commStyle:'逻辑清晰，善于用数据和案例说话，演示能力强', bestScene:'汽车/零售类产品演示型拜访', customerType:'关注产品细节和效果的中层管理者', closePace:'中速推进，2-3次拜访成交',
    strengths:[
      {title:'产品演示极具说服力',desc:'演示后客户满意度评分场均4.5分（满分5），是团队标杆',evidence:'演示评分4.5，客户提出"想看更多"的概率85%'},
      {title:'案例运用自如',desc:'每次拜访平均引用2.8个案例，且案例与客户行业高度匹配',evidence:'案例引用频次2.8次/拜访，行业匹配度92%'}
    ],
    weaknesses:[
      {title:'初次拜访信任建立偏慢',desc:'开场破冰阶段客户情绪评分偏低，需要2次以上拜访才能建立深度信任',action:'建议：开场增加"共鸣点"话术，提前研究客户个人背景找共同点'},
      {title:'售后跟进不足',desc:'签约后7天内回访率仅60%，客户转介绍率偏低',action:'建议：设置CRM自动提醒，签约后第3天和第7天强制回访'}
    ]
  },
  3: { primaryType:'亲和型销售', primaryColor:'#E6A23C', subTypes:['关系维护','信任建立'], commStyle:'热情亲切，善于建立轻松氛围，客户粘性高', bestScene:'保险/教育类需要长期信任的场景', customerType:'需要情感连接的C端或小B客户', closePace:'渐进推进，4-6次拜访成交',
    strengths:[
      {title:'客户粘性极强',desc:'老客户转介绍率达40%，复购率65%，远高于团队平均',evidence:'转介绍率40%（团队平均18%），复购率65%（团队平均42%）'},
      {title:'异议处理温和有效',desc:'面对客户质疑时从不硬怼，用"理解+案例+方案"三步法化解',evidence:'客户情绪评分稳定，无一次对话出现"对抗"标签'}
    ],
    weaknesses:[
      {title:'专业话术掌握不足',desc:'产品参数、行业术语使用频率偏低，面对专业型客户时显得深度不够',action:'建议：每周背诵3条产品核心参数话术，搭配AI胸牌实时提示'},
      {title:'逼单力度偏弱',desc:'客户表达购买意向后，提出明确行动计划的概率仅40%',action:'建议：学习王志华的"试探成交+明确下一步"两段式收单法'}
    ]
  },
  4: { primaryType:'效率型销售', primaryColor:'#F56C6C', subTypes:['快速成交','高产出'], commStyle:'直截了当，注重效率，快速筛选和推进', bestScene:'地产/零售等标准化程度高的场景', customerType:'决策快、追求效率的中小客户', closePace:'快速推进，1-2次拜访成交',
    strengths:[
      {title:'成交速度团队最快',desc:'平均1.8次拜访成交，是团队效率标杆',evidence:'成交周期1.8次（团队平均3.5次），拜访量团队第一'},
      {title:'标准化执行到位',desc:'话术执行评分95%，几乎不偏离标准流程',evidence:'流程执行率95%，漏项率仅5%'}
    ],
    weaknesses:[
      {title:'客户需求深挖不足',desc:'开放式问题仅占总问题的22%，容易错过客户深层需求',action:'建议：每次拜访至少准备5个开放式问题，AI胸牌设置强制提醒'},
      {title:'大客户关系维护欠缺',desc:'对大客户（预算>50万）的跟进频率低于标准，流失风险较高',action:'建议：大客户设置独立跟进计划，每周至少1次非商务沟通'}
    ]
  }
}

const persona = ref(personaData[id] || personaData[1])

const improveMetrics = ref([
  { name:'话术执行率', current:85, target:95, percent:89, color:'#409EFF', tip:'距离目标还差10个百分点，多在"异议处理"环节掉分' },
  { name:'客户提问互动率', current:42, target:55, percent:76, color:'#67C23A', tip:'产品介绍环节互动偏少，建议增加反问频率' },
  { name:'跟进及时率', current:78, target:90, percent:87, color:'#E6A23C', tip:'24小时跟进达标率78%，漏跟主要集中在周五拜访' },
  { name:'促单成功率', current:55, target:70, percent:79, color:'#F56C6C', tip:'客户表达意向到提出方案的间隔平均3天，可压缩到1天' }
])

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

/* 销售类型 */
.type-section{font-size:13px}.type-main{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.type-badge{padding:4px 14px;border-radius:20px;color:#fff;font-size:14px;font-weight:600}.type-sub{font-size:11px;color:#909399;background:#f5f7fa;padding:2px 10px;border-radius:10px}
.type-row{display:flex;padding:6px 0;border-bottom:1px solid #f5f5f5}.type-row strong{width:70px;color:#666;font-size:12px;flex-shrink:0}.type-row span{color:#333;font-size:12px}

/* 提升监督 */
.improve-section{display:flex;flex-direction:column;gap:14px}
.improve-metric .im-header{display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px}
.improve-metric .im-val{font-weight:700}.improve-metric .im-tip{font-size:11px;color:#909399;margin-top:2px}

/* 优势/待提升 */
.strength-list,.weakness-list{display:flex;flex-direction:column;gap:10px}
.strength-item,.weakness-item{padding:10px;border-radius:8px;font-size:12px;line-height:1.6}
.strength-item{background:#f0f9eb;border-left:3px solid #67C23A}
.weakness-item{background:#fef0f0;border-left:3px solid #E6A23C}
.si-title,.wi-title{font-weight:700;color:#303133;margin-bottom:4px}
.si-desc,.wi-desc{color:#555;margin-bottom:4px}
.si-evidence{color:#67C23A;font-size:11px}.wi-action{color:#E6A23C;font-size:11px}
</style>
