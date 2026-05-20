<template>
  <div class="my-agents">
    <!-- 顶部企业信息 -->
    <div class="ma-header">
      <el-row :gutter="16" align="middle">
        <el-col :span="16"><h2>我的智能体</h2><div class="ma-subtitle">当前企业：<strong>{{ enterpriseName }}</strong> · 行业：<el-tag size="small" type="warning">{{ enterpriseIndustry }}</el-tag> · 可见智能体：<strong>{{ visibleCount }}个</strong></div></el-col>
        <el-col :span="8" style="text-align:right;"><el-select v-model="currentEnterprise" size="small" style="width:200px;" @change="switchEnterprise"><el-option v-for="e in enterpriseList" :key="e.value" :label="e.label" :value="e.value" /></el-select></el-col>
      </el-row>
    </div>

    <!-- 三区块 -->
    <div v-for="(section, sidx) in sections" :key="sidx" class="ma-section">
      <div class="mas-header">
        <span class="mas-icon">{{ section.icon }}</span>
        <span class="mas-title">{{ section.title }}</span>
        <el-tag size="small" type="info">{{ section.items.length }}个智能体</el-tag>
      </div>
      <el-row :gutter="16">
        <el-col :span="8" v-for="agent in section.items" :key="agent.id">
          <el-card shadow="hover" class="ma-card" :class="{ disabled: !agent.enabled }">
            <div class="mac-header">
              <span class="mac-icon">{{ agent.icon }}</span>
              <div class="mac-title-area">
                <span class="mac-name">{{ agent.name }}</span>
                <el-tag :type="agent.templateType==='scoring'?'':agent.templateType==='report'?'success':'warning'" size="small">{{ typeLabel(agent.templateType) }}</el-tag>
              </div>
              <el-tag :type="agent.enabled?'success':'info'" size="small" effect="plain">{{ agent.enabled?'已启用':'未启用' }}</el-tag>
            </div>
            <div class="mac-desc">{{ agent.description }}</div>
            <div class="mac-stats">
              <div class="macs-item"><span class="macs-val">{{ agent.useCount }}</span><span class="macs-lbl">使用次数</span></div>
              <div class="macs-item"><span class="macs-val">{{ agent.avgScore||'-' }}</span><span class="macs-lbl">{{ agent.templateType==='report'?'生成报告':'均分' }}</span></div>
            </div>
            <div class="mac-actions">
              <el-button type="primary" size="small" :disabled="!agent.enabled" @click="useAgent(agent)">使用智能体</el-button>
              <el-button size="small" @click="previewAgent(agent)">预览效果</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-if="section.items.length===0" description="暂无可用智能体" :image-size="60" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const enterpriseName = ref('杭州智联金融科技')
const enterpriseIndustry = ref('银行金融')
const currentEnterprise = ref('hz-bank')

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

// 全量智能体配置（模拟从超级管理员配置读取）
const allAgents = ref([
  { id:1, name:'销售能力综合评分', icon:'📊', templateType:'scoring', hasScore:true, enabled:true, industries:['银行金融','汽车销售','保险'], scenes:['客户拜访'], description:'企业销售能力评估的核心模板', useCount:1256, avgScore:'76分' },
  { id:2, name:'银行客户拜访报告', icon:'🏦', templateType:'report', hasScore:false, enabled:true, industries:['银行金融'], scenes:['客户拜访'], description:'银行业专属拜访报告模板', useCount:832, avgScore:'-' },
  { id:3, name:'客户购买力打分', icon:'💰', templateType:'scoring', hasScore:true, enabled:true, industries:['银行金融','汽车销售','房地产','保险'], scenes:['客户拜访'], description:'评估客户购买意向和支付能力', useCount:2100, avgScore:'72分' },
  { id:4, name:'会议总结模板', icon:'📝', templateType:'report', hasScore:false, enabled:true, industries:['银行金融','汽车销售','医疗健康','教育培训','房地产'], scenes:['会议总结'], description:'通用会议总结模板', useCount:560, avgScore:'-' },
  { id:6, name:'销售复盘模板', icon:'🏆', templateType:'report', hasScore:false, enabled:false, industries:['银行金融','汽车销售','保险','房地产'], scenes:['客户拜访'], description:'销售过程复盘模板', useCount:680, avgScore:'-' },
  { id:7, name:'产品力打分', icon:'⭐', templateType:'scoring', hasScore:true, enabled:true, industries:['银行金融','汽车销售','医疗健康','教育培训'], scenes:['产品演示'], description:'评估产品知识掌握和传达能力', useCount:890, avgScore:'68分' },
  { id:8, name:'医疗合规沟通检查', icon:'🏥', templateType:'report', hasScore:false, enabled:true, industries:['医疗健康'], scenes:['客户拜访'], description:'医患沟通质量分析', useCount:156, avgScore:'-' },
  { id:9, name:'保险需求分析模板', icon:'🛡️', templateType:'report', hasScore:false, enabled:false, industries:['保险'], scenes:['需求调研'], description:'家庭保障需求分析报告', useCount:88, avgScore:'-' },
  { id:10, name:'教育行业课堂总结', icon:'📚', templateType:'report', hasScore:false, enabled:true, industries:['教育培训'], scenes:['课堂授课'], description:'课堂知识点结构梳理', useCount:45, avgScore:'-' },
  { id:11, name:'地产看房跟进分析', icon:'🏠', templateType:'summary', hasScore:true, enabled:true, industries:['房地产'], scenes:['客户拜访'], description:'看房跟进评分+报告', useCount:32, avgScore:'78分' },
  { id:12, name:'零售客户画像模板', icon:'🛒', templateType:'report', hasScore:false, enabled:false, industries:['零售消费'], scenes:['客户拜访'], description:'零售客户画像和消费分析', useCount:0, avgScore:'-' },
  { id:13, name:'面包店零售分析', icon:'🍞', templateType:'report', hasScore:false, enabled:true, industries:['零售消费'], scenes:['客户拜访'], description:'面包店专属经营分析', useCount:0, avgScore:'-' }
])

// 该企业可见的智能体（按行业+启用状态过滤）
const enterpriseAgents = computed(() => allAgents.value.filter(a => a.industries.includes(enterpriseIndustry.value)))

// 三区块分类
const sections = computed(() => {
  const agents = enterpriseAgents.value
  return [
    { icon:'📊', title:'公用评分智能体', items: agents.filter(a => a.templateType==='scoring') },
    { icon:'📝', title:'公用行业智能体', items: agents.filter(a => a.templateType!=='scoring' && a.enabled) },
    { icon:'⭐', title:'我的智能体', items: agents.filter(a => a.templateType!=='scoring' && !a.enabled) }
  ]
})

const visibleCount = computed(() => enterpriseAgents.value.filter(a => a.enabled).length)

const useAgent = (agent) => { ElMessage.success(`已选择智能体：${agent.name}`) }
const previewAgent = (agent) => { ElMessage.info(`预览智能体：${agent.name}（功能开发中）`) }
</script>

<style scoped>
.my-agents{max-width:1100px;margin:0 auto;padding:8px}
.ma-header{margin-bottom:24px}.ma-subtitle{font-size:13px;color:#909399;margin-top:6px}

.ma-section{margin-bottom:28px}.mas-header{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #f0f2f5}.mas-icon{font-size:22px}.mas-title{font-size:17px;font-weight:700;color:#1a1a2e}

.ma-card{transition:.2s;margin-bottom:14px}.ma-card:hover{transform:translateY(-2px)}.ma-card.disabled{opacity:.6}
.mac-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}.mac-icon{font-size:28px}.mac-title-area{flex:1}.mac-name{font-size:14px;font-weight:700;color:#303133;display:block}
.mac-desc{font-size:12px;color:#909399;line-height:1.5;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mac-stats{display:flex;justify-content:space-around;padding:10px 0;border-top:1px solid #f5f7fa;margin-bottom:10px}.macs-item{text-align:center}.macs-val{font-size:18px;font-weight:700;color:#409EFF;display:block}.macs-lbl{font-size:11px;color:#909399}
.mac-actions{display:flex;gap:8px;justify-content:center}
</style>
