<template>
  <div>
    <div class="page-title">💬 话术库</div>
    <el-row :gutter="16">
      <el-col :span="5">
        <el-card shadow="hover" style="max-height:calc(100vh - 180px);overflow-y:auto;">
          <template #header><span>话术分类</span></template>
          <el-tree :data="categoryTree" :props="{label:'name'}" node-key="id" default-expand-all highlight-current @node-click="handleNodeClick" />
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card shadow="hover" style="margin-bottom:16px;">
          <el-row :gutter="12">
            <el-col :span="6"><el-input v-model="search" placeholder="搜索话术关键词" clearable prefix-icon="Search" /></el-col>
            <el-col :span="3"><el-select v-model="sortMode" placeholder="排序"><el-option label="效果评分" value="score" /><el-option label="使用次数" value="usage" /><el-option label="最新" value="newest" /></el-select></el-col>
            <el-col :span="3"><el-button type="primary" icon="Plus">新增话术</el-button></el-col>
          </el-row>
        </el-card>
        <el-card shadow="hover">
          <div v-for="s in scripts" :key="s.id" class="script-item" @click="selectedScript = s">
            <div class="script-header">
              <div>
                <span class="script-title">{{ s.title }}</span>
                <el-tag size="small" type="" style="margin-left:6px;">{{ s.industry }}</el-tag>
                <el-tag size="small" type="warning" style="margin-left:4px;">{{ s.stage }}</el-tag>
              </div>
              <div class="script-meta">
                <span>⭐ {{ s.effectScore }}</span>
                <span>🔥 {{ s.usageCount }}次</span>
                <span>✅ {{ (s.successRate * 100).toFixed(0) }}%</span>
              </div>
            </div>
            <div class="script-preview">{{ s.content.substring(0, 80) }}...</div>
            <div class="script-tags">
              <el-tag size="small" v-for="t in s.tags" :key="t" style="margin:2px;" effect="plain">{{ t }}</el-tag>
            </div>
            <div class="script-source">贡献者：{{ s.contributor }} · 行业：{{ s.industry }} · 阶段：{{ s.stage }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showDetail" :title="selectedScript?.title" width="700px" top="5vh">
      <div v-if="selectedScript">
        <el-descriptions :column="2" border style="margin-bottom:16px;">
          <el-descriptions-item label="所属行业">{{ selectedScript.industry }}</el-descriptions-item>
          <el-descriptions-item label="销售阶段">{{ selectedScript.stage }}</el-descriptions-item>
          <el-descriptions-item label="效果评分">⭐ {{ selectedScript.effectScore }}</el-descriptions-item>
          <el-descriptions-item label="使用次数">🔥 {{ selectedScript.usageCount }}次</el-descriptions-item>
          <el-descriptions-item label="成功率">✅ {{ (selectedScript.successRate * 100).toFixed(0) }}%</el-descriptions-item>
          <el-descriptions-item label="贡献者">{{ selectedScript.contributor }}</el-descriptions-item>
        </el-descriptions>
        <h4 style="margin:12px 0 8px;">📝 话术正文</h4>
        <div class="script-content">{{ selectedScript.content }}</div>
        <h4 style="margin:16px 0 8px;">🔑 关键话术要点</h4>
        <el-tag v-for="p in selectedScript.keyPoints" :key="p" style="margin:4px;" type="success">{{ p }}</el-tag>
        <h4 style="margin:16px 0 8px;">🤖 AI优化建议</h4>
        <el-alert :title="selectedScript.aiTip" type="info" :closable="false" show-icon />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const search = ref('')
const sortMode = ref('score')
const selectedScript = ref(null)
const showDetail = computed(() => !!selectedScript.value)

const categoryTree = ref([
  { id: '1', name: '🏦 银行业', children: [
    { id: '1-1', name: '开场白' }, { id: '1-2', name: '需求挖掘' }, { id: '1-3', name: '产品介绍' }, { id: '1-4', name: '异议处理' }, { id: '1-5', name: '逼单促成' }
  ]},
  { id: '2', name: '🚗 汽车业', children: [
    { id: '2-1', name: '开场白' }, { id: '2-2', name: '需求挖掘' }, { id: '2-3', name: '试驾推荐' }, { id: '2-4', name: '价格谈判' }
  ]},
  { id: '3', name: '🏥 医疗业', children: [
    { id: '3-1', name: '开场白' }, { id: '3-2', name: '合规介绍' }, { id: '3-3', name: '学术推广' }
  ]},
  { id: '4', name: '📚 教育业', children: [
    { id: '4-1', name: '家长沟通' }, { id: '4-2', name: '课程推荐' }, { id: '4-3', name: '转化话术' }
  ]},
  { id: '5', name: '🏠 地产业', children: [
    { id: '5-1', name: '看房跟进' }, { id: '5-2', name: '户型推荐' }, { id: '5-3', name: '签约促成' }
  ]},
  { id: '6', name: '🛡️ 保险业', children: [
    { id: '6-1', name: '需求分析' }, { id: '6-2', name: '方案推荐' }, { id: '6-3', name: '异议处理' }
  ]}
])

const handleNodeClick = (node) => { console.log('Selected:', node.label) }

const scripts = ref([
  { id: 1, title: '银行理财首次拜访开场白', industry: '银行', stage: '开场白', effectScore: 4.8, usageCount: 156, successRate: 0.72, tags: ['亲和型', '建立信任', '破冰'], contributor: '王志华', content: '张总您好，我是利尔达AI科技的小王，感谢您百忙之中抽出时间。我们公司专注企业数字化转型，特别是在销售管理领域，通过AI技术帮助银行提升客户经理的销售效能。我了解到贵行最近在推进数字化转型项目，不知道目前在销售管理这块有没有遇到什么痛点？我可以根据贵行的实际情况，分享一些同业的成功经验。', keyPoints: ['先赞美再介绍', '提及对方关注话题', '用同业案例建立信任', '开放式提问引导需求'], aiTip: '建议在开场白后增加对客户具体业务的了解，如"贵行目前有多少客户经理在做外拓？"以便更有针对性地展开后续沟通。' },
  { id: 2, title: '汽车试驾后跟进逼单话术', industry: '汽车', stage: '逼单促成', effectScore: 4.6, usageCount: 89, successRate: 0.65, tags: ['效率型', '限时优惠', '决策推动'], contributor: '朱炫', content: '李先生，您刚才试驾完的感受怎么样？从您刚才的反馈来看，您对这款车的动力和空间都比较满意。现在正好我们这个月底有一个限时优惠活动，不仅能享受2万现金优惠，还能免费升级到豪华内饰包。我看您和家人都挺喜欢的，不如今天我们就把定金付了，先把优惠锁定下来，如果后续有任何不满意，定金是可以退的。', keyPoints: ['确认客户感受', '强调试驾满意点', '制造紧迫感', '降低决策门槛'], aiTip: '此话术适合已表现出明确意向的客户。对于还在犹豫的客户，建议先强化产品优势再引导决策，避免过早逼单导致客户反感。' },
  { id: 3, title: '保险需求分析话术', industry: '保险', stage: '需求分析', effectScore: 4.5, usageCount: 132, successRate: 0.68, tags: ['顾问型', '需求挖掘', '风险意识'], contributor: '李飞', content: '王女士，在给您推荐方案之前，我想先了解一下您目前的情况。您家里有几个成员？目前有没有配置任何商业保险？在您看来，一个家庭最需要保障的是哪些方面——是健康、意外还是教育金？另外，您对保费预算有什么期望范围吗？这样我才能给您推荐最适合的方案，而不是推荐最贵的方案。', keyPoints: ['先了解家庭结构', '确认现有保障缺口', '引导客户思考风险', '询问预算范围'], aiTip: '建议在需求分析后，总结客户的核心关切并确认，如"所以您最关心的是重疾保障和孩子的教育金对吗？"确保后续方案推荐精准匹配。' },
  { id: 4, title: '地产看房跟进话术', industry: '地产', stage: '看房跟进', effectScore: 4.3, usageCount: 67, successRate: 0.58, tags: ['专业型', '户型分析', '性价比'], contributor: '张锐', content: '刘总，上次您来看的那个89平三房，您回去之后和家人讨论得怎么样了？我帮您重新梳理一下这套房子的几个核心优势：第一，南北通透的户型在整个小区是非常稀缺的，只有8套；第二，这个楼层正好是黄金楼层12层，采光和视野都非常好；第三，小区对口的是实验小学，步行只要5分钟。另外，首付比例最低只要20%，月供大概在8千左右，以您的收入来说压力很小。', keyPoints: ['回顾上次看房情况', '强化稀缺性', '强调教育配套', '降低购房压力感'], aiTip: '话术中可以加入更多与竞品的对比信息，帮助客户做出更理性的判断。建议在跟进前先调研客户看过的竞品项目。' }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
.script-item { padding: 16px; border: 1px solid #ebeef5; border-radius: 8px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; }
.script-item:hover { border-color: #409EFF; box-shadow: 0 2px 12px rgba(64,158,255,0.15); }
.script-header { display: flex; justify-content: space-between; align-items: center; }
.script-title { font-size: 15px; font-weight: bold; color: #303133; }
.script-meta { font-size: 13px; color: #909399; display: flex; gap: 16px; }
.script-preview { font-size: 13px; color: #606266; margin: 8px 0; line-height: 1.6; }
.script-tags { margin-bottom: 8px; }
.script-source { font-size: 12px; color: #c0c4cc; }
.script-content { font-size: 14px; line-height: 1.8; color: #303133; padding: 16px; background: #f5f7fa; border-radius: 8px; white-space: pre-wrap; }
</style>
