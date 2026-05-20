<template>
  <div class="my-agents">
    <!-- 企业信息栏 -->
    <div class="ma-header">
      <el-row :gutter="16" align="middle">
        <el-col :span="16"><h2>{{ enterpriseName }}</h2><div class="ma-subtitle">行业：<el-tag size="small" type="warning">{{ enterpriseIndustry }}</el-tag> · 可见智能体：<strong>{{ visibleCount }}个</strong></div></el-col>
        <el-col :span="8" style="text-align:right;"><el-select v-model="currentEnterprise" size="small" style="width:200px;" @change="switchEnterprise"><el-option v-for="e in enterpriseList" :key="e.value" :label="e.label" :value="e.value" /></el-select></el-col>
      </el-row>
    </div>

    <!-- 四分类统计（与智能体配置一致的框架） -->
    <el-row :gutter="16" style="margin-bottom:16px;">
      <el-col :span="6"><el-card shadow="hover" class="stat-card" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'"><div class="stat-val">{{ allCount }}</div><div class="stat-lbl">全部智能体</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="stat-card" :class="{ active: activeTab === 'scoring' }" @click="activeTab = 'scoring'"><div class="stat-val" style="color:#409EFF;">{{ scoringCount }}</div><div class="stat-lbl">📊 公用评分智能体</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="stat-card" :class="{ active: activeTab === 'public' }" @click="activeTab = 'public'"><div class="stat-val" style="color:#67C23A;">{{ publicCount }}</div><div class="stat-lbl">📝 公用行业智能体</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="stat-card" :class="{ active: activeTab === 'mine' }" @click="activeTab = 'mine'"><div class="stat-val" style="color:#E6A23C;">{{ mineCount }}</div><div class="stat-lbl">⭐ 我的智能体</div></el-card></el-col>
    </el-row>

    <!-- 筛选栏 -->
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12" align="middle"><el-col :span="4"><el-input v-model="search" placeholder="搜索" clearable prefix-icon="Search" /></el-col><el-col :span="3"><el-select v-model="filterType" placeholder="类型" clearable><el-option label="评分" value="scoring" /><el-option label="报告" value="report" /></el-select></el-col><el-col :span="3"><el-select v-model="filterStatus" placeholder="状态" clearable><el-option label="已启用" value="on" /><el-option label="未启用" value="off" /></el-select></el-col></el-row>
    </el-card>

    <!-- 卡片网格 -->
    <el-row :gutter="16">
      <el-col :span="8" v-for="agent in filteredAgents" :key="agent.id">
        <el-card shadow="hover" class="ma-card" :class="{ disabled: !agent.enabled, mine: agent.isMine }">
          <div class="mac-header">
            <span class="mac-icon">{{ agent.icon }}</span>
            <div class="mac-title-area">
              <span class="mac-name">{{ agent.name }}</span>
            </div>
            <el-tag :type="agent.templateType==='scoring'?'':agent.templateType==='report'?'success':'warning'" size="small">{{ typeLabel(agent.templateType) }}</el-tag>
          </div>
          <div class="mac-desc">{{ agent.description }}</div>
          <div class="mac-tags"><el-tag v-for="i in agent.industries" :key="i" size="small" effect="plain" type="warning" style="margin:2px;">{{ i }}</el-tag></div>
          <div class="mac-stats"><div class="macs-item"><span class="macs-val">{{ agent.useCount }}</span><span class="macs-lbl">使用次数</span></div><div class="macs-item"><span class="macs-val">{{ agent.avgScore||'-' }}</span><span class="macs-lbl">{{ agent.templateType==='report'?'报告':'均分' }}</span></div></div>
          <div class="mac-actions">
            <el-button size="small" :disabled="agent.isMine" @click="cloneAgent(agent)">克隆</el-button>
            <el-button size="small" @click="previewAgent(agent)">预览效果</el-button>
            <el-button size="small" v-if="agent.isMine" type="warning" @click="editMine(agent)">编辑</el-button>
            <el-button size="small" type="danger" v-if="agent.isMine" @click="deleteMine(agent.id)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="showEdit" :title="'编辑我的智能体 - ' + editingAgent?.name" width="700px" destroy-on-close>
      <el-form v-if="editingAgent" label-width="100px">
        <el-form-item label="名称"><el-input v-model="editingAgent.name" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="editingAgent.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="类型"><el-radio-group v-model="editingAgent.templateType" disabled><el-radio-button value="scoring">评分</el-radio-button><el-radio-button value="report">报告</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="适用行业"><el-select v-model="editingAgent.industries" multiple style="width:100%"><el-option v-for="i in allIndustries" :key="i" :label="i" :value="i" /></el-select></el-form-item>
        <el-form-item label="启用"><el-switch v-model="editingAgent.enabled" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="showEdit=false">取消</el-button><el-button type="primary" @click="saveEdit">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const enterpriseName = ref('杭州智联金融科技')
const enterpriseIndustry = ref('银行金融')
const currentEnterprise = ref('hz-bank')
const search = ref(''); const filterType = ref(''); const filterStatus = ref(''); const activeTab = ref('all')
const allIndustries = ['银行金融','汽车销售','医疗健康','教育培训','房地产','零售消费','保险','通用']

const enterpriseList = [
  { label:'杭州智联金融科技（银行）', value:'hz-bank' },
  { label:'上海瑞驰汽车服务（汽车）', value:'sh-auto' },
  { label:'深圳健康医疗科技（医疗）', value:'sz-medical' }
]

const switchEnterprise = (val) => {
  const map = { 'hz-bank': ['杭州智联金融科技','银行金融'], 'sh-auto': ['上海瑞驰汽车服务','汽车销售'], 'sz-medical': ['深圳健康医疗科技','医疗健康'] }
  const [name, industry] = map[val] || ['','']
  enterpriseName.value = name; enterpriseIndustry.value = industry
}

const typeLabel = (t) => t==='scoring'?'评分':t==='report'?'报告':'综合分析'

// 全量智能体
const allAgents = ref([
  { id:1, name:'销售能力综合评分', icon:'📊', templateType:'scoring', enabled:true, industries:['银行金融','汽车销售','保险'], description:'企业销售能力评估的核心模板', useCount:1256, avgScore:'76分', isMine:false },
  { id:2, name:'银行客户拜访报告', icon:'🏦', templateType:'report', enabled:true, industries:['银行金融'], description:'银行业专属拜访报告模板', useCount:832, avgScore:'-', isMine:false },
  { id:3, name:'客户购买力打分', icon:'💰', templateType:'scoring', enabled:true, industries:['银行金融','汽车销售','房地产','保险'], description:'评估客户购买意向和支付能力', useCount:2100, avgScore:'72分', isMine:false },
  { id:7, name:'产品力打分', icon:'⭐', templateType:'scoring', enabled:true, industries:['银行金融','汽车销售','医疗健康','教育培训'], description:'评估产品知识掌握和传达能力', useCount:890, avgScore:'68分', isMine:false }
])
// 我的智能体（从localStorage加载）
const STORAGE_KEY = 'my_agents_data'
const loadMyAgents = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]') } catch { return [] } }
const saveMyAgents = (data) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
const myAgents = ref(loadMyAgents())

const enterpriseAgents = computed(() => {
  const pub = allAgents.value.filter(a => a.industries.includes(enterpriseIndustry.value))
  return [...pub, ...myAgents.value]
})

const allCount = computed(() => enterpriseAgents.value.length)
const scoringCount = computed(() => enterpriseAgents.value.filter(a => a.templateType==='scoring' && !a.isMine).length)
const publicCount = computed(() => enterpriseAgents.value.filter(a => a.templateType!=='scoring' && !a.isMine && a.enabled).length)
const mineCount = computed(() => enterpriseAgents.value.filter(a => a.isMine).length)

const visibleCount = computed(() => enterpriseAgents.value.filter(a => a.enabled || a.isMine).length)

const filteredAgents = computed(() => {
  let list = enterpriseAgents.value
  if (activeTab.value === 'scoring') list = list.filter(a => a.templateType === 'scoring' && !a.isMine)
  else if (activeTab.value === 'public') list = list.filter(a => a.templateType !== 'scoring' && !a.isMine && a.enabled)
  else if (activeTab.value === 'mine') list = list.filter(a => a.isMine)
  if (search.value) { const kw = search.value.toLowerCase(); list = list.filter(a => a.name.toLowerCase().includes(kw)) }
  if (filterType.value) list = list.filter(a => a.templateType === filterType.value)
  if (filterStatus.value === 'on') list = list.filter(a => a.enabled)
  else if (filterStatus.value === 'off') list = list.filter(a => !a.enabled)
  return list
})

// 克隆
const cloneAgent = (agent) => {
  const newId = Date.now()
  const newAgent = { ...JSON.parse(JSON.stringify(agent)), id: newId, name: agent.name, isMine: true, enabled: true, useCount: 0, avgScore: '-' }
  myAgents.value.push(newAgent)
  saveMyAgents(myAgents.value)
  ElMessage({ message: '已克隆到我的智能体', type: 'success', duration: 3000, onClick: () => { activeTab.value = 'mine' } })
}

// 编辑我的智能体
const showEdit = ref(false); const editingAgent = ref(null)
const editMine = (agent) => { editingAgent.value = { ...agent }; showEdit.value = true }
const saveEdit = () => {
  const idx = myAgents.value.findIndex(a => a.id === editingAgent.value.id)
  if (idx >= 0) myAgents.value[idx] = { ...editingAgent.value }
  saveMyAgents(myAgents.value)
  showEdit.value = false; ElMessage.success('已保存')
}
const deleteMine = (id) => { myAgents.value = myAgents.value.filter(a => a.id !== id); saveMyAgents(myAgents.value); ElMessage.success('已删除') }

const useAgent = (agent) => { ElMessage.success(`已选择：${agent.name}`) }
</script>

<style scoped>
.my-agents{padding:8px}
.ma-header{margin-bottom:20px}.ma-subtitle{font-size:13px;color:#909399;margin-top:6px}

.stat-card{cursor:pointer;text-align:center;padding:8px 0;border:2px solid transparent;transition:.2s}.stat-card:hover{border-color:#409EFF}.stat-card.active{border-color:#409EFF;background:#ecf5ff}.stat-val{font-size:28px;font-weight:700;color:#303133}.stat-lbl{font-size:13px;color:#909399;margin-top:4px}

.ma-card{transition:.2s;margin-bottom:14px}.ma-card:hover{transform:translateY(-2px)}.ma-card.disabled{opacity:.6}.ma-card.mine{border:2px dashed #E6A23C}
.mac-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}.mac-icon{font-size:28px}.mac-title-area{flex:1}.mac-name{font-size:14px;font-weight:700;color:#303133;display:block}
.mac-desc{font-size:12px;color:#909399;line-height:1.5;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mac-tags{min-height:22px;margin-bottom:8px}
.mac-stats{display:flex;justify-content:space-around;padding:8px 0;border-top:1px solid #f5f7fa;margin-bottom:8px}.macs-item{text-align:center}.macs-val{font-size:16px;font-weight:700;color:#409EFF;display:block}.macs-lbl{font-size:11px;color:#909399}
.mac-actions{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
</style>
