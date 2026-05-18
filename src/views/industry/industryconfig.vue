<template>
  <div>
    <div class="page-title">行业配置 - {{ currentIndustryName }}</div>
    <el-alert :title="`${currentIndustryName}行业配置中心：管理行业专属AI分析模板、评价维度、话术模板和金牌画像标准。配置完成后，该行业下的所有企业将自动生效。`" type="info" :closable="false" show-icon style="margin-bottom:16px;" />

    <el-tabs v-model="activeTab" type="border-card">
      <!-- AI分析模板配置 -->
      <el-tab-pane label="🤖 AI分析模板" name="template">
        <div style="margin-bottom:12px;display:flex;justify-content:space-between;">
          <span style="font-weight:bold;">行业专属AI分析模板</span>
          <el-button type="primary" icon="Plus" size="small">新增分析模板</el-button>
        </div>
        <el-table :data="analysisTemplates" stripe>
          <el-table-column prop="name" label="模板名称" min-width="200" />
          <el-table-column prop="type" label="分析类型" width="120">
            <template #default="{row}"><el-tag size="small">{{ row.type }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="dims" label="分析维度" width="120" />
          <el-table-column prop="prompt" label="AI提示词概要" min-width="250" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{row}"><el-switch v-model="row.enabled" size="small" /></template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template #default>
              <el-button type="primary" link size="small">编辑</el-button>
              <el-button type="success" link size="small">预览效果</el-button>
              <el-button type="warning" link size="small">测试</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-divider>银行拜访报告AI分析示例</el-divider>
        <el-card shadow="never" style="background:#f5f7fa;">
          <h4 style="margin-bottom:12px;">📋 银行客户拜访AI分析报告结构</h4>
          <el-tree :data="reportStructure" :props="{label:'name',children:'children'}" default-expand-all />
        </el-card>
      </el-tab-pane>

      <!-- 评价维度配置 -->
      <el-tab-pane label="📊 评价维度" name="dimensions">
        <div style="margin-bottom:12px;display:flex;justify-content:space-between;">
          <span style="font-weight:bold;">行业专属评价维度树</span>
          <el-button type="primary" icon="Plus" size="small">新增维度</el-button>
        </div>
        <el-table :data="dimensionTree" stripe row-key="id" :tree-props="{children:'children'}">
          <el-table-column prop="name" label="维度名称" min-width="200" />
          <el-table-column prop="weight" label="权重" width="80">
            <template #default="{row}"><el-tag size="small" v-if="row.weight">{{ row.weight }}%</el-tag></template>
          </el-table-column>
          <el-table-column prop="scoreRange" label="评分范围" width="120" />
          <el-table-column prop="desc" label="说明" min-width="250" show-overflow-tooltip />
          <el-table-column label="操作" width="120">
            <template #default>
              <el-button type="primary" link size="small">编辑</el-button>
              <el-button type="danger" link size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 话术模板 -->
      <el-tab-pane label="💬 话术模板" name="scripts">
        <div style="margin-bottom:12px;display:flex;justify-content:space-between;">
          <span style="font-weight:bold;">行业话术模板管理</span>
          <el-button type="primary" icon="Plus" size="small">新增话术模板</el-button>
        </div>
        <el-table :data="scriptTemplates" stripe>
          <el-table-column prop="title" label="话术标题" min-width="200" />
          <el-table-column prop="stage" label="销售阶段" width="120">
            <template #default="{row}"><el-tag size="small" type="warning">{{ row.stage }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="scene" label="适用场景" width="120" />
          <el-table-column prop="effectScore" label="效果评分" width="90">
            <template #default="{row}"><span style="color:#E6A23C;font-weight:bold;">⭐ {{ row.effectScore }}</span></template>
          </el-table-column>
          <el-table-column prop="source" label="来源" width="120" />
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{row}"><el-tag :type="row.status==='已审核'?'success':'warning'" size="small">{{ row.status }}</el-tag></template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default>
              <el-button type="primary" link size="small">查看</el-button>
              <el-button type="success" link size="small">审核</el-button>
              <el-button type="danger" link size="small">下架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 金牌画像标准 -->
      <el-tab-pane label="🏆 金牌画像标准" name="goldStandard">
        <el-alert title="金牌销售画像标准：定义该行业下金牌销售的认定标准，系统将根据AI分析结果自动识别并生成金牌销售画像。" type="warning" :closable="false" show-icon style="margin-bottom:16px;" />
        <el-form label-width="140px" style="max-width:700px;">
          <el-form-item label="综合评分门槛">
            <el-input-number v-model="goldConfig.scoreThreshold" :min="60" :max="100" /> <span style="margin-left:8px;color:#909399;">分以上</span>
          </el-form-item>
          <el-form-item label="最低成交客户数">
            <el-input-number v-model="goldConfig.minDeals" :min="1" :max="100" /> <span style="margin-left:8px;color:#909399;">个/月</span>
          </el-form-item>
          <el-form-item label="最低转化率">
            <el-input-number v-model="goldConfig.minRate" :min="1" :max="100" :step="5" /> <span style="margin-left:8px;color:#909399;">%</span>
          </el-form-item>
          <el-form-item label="最低听记数量">
            <el-input-number v-model="goldConfig.minAudios" :min="1" :max="200" /> <span style="margin-left:8px;color:#909399;">条/月</span>
          </el-form-item>
          <el-form-item label="核心维度达标">
            <el-checkbox-group v-model="goldConfig.coreDims">
              <el-checkbox label="needDiscovery">客户需求挖掘</el-checkbox>
              <el-checkbox label="productIntro">产品介绍完整性</el-checkbox>
              <el-checkbox label="professionalism">专业性</el-checkbox>
              <el-checkbox label="serviceAttitude">服务态度</el-checkbox>
              <el-checkbox label="closingSkill">逼单技巧</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="话术贡献要求">
            <el-input-number v-model="goldConfig.minScripts" :min="0" :max="20" /> <span style="margin-left:8px;color:#909399;">条/月 贡献到话术库</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveConfig">保存配置</el-button>
            <el-button>重置默认</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 行业AI提示词 -->
      <el-tab-pane label="⚙️ AI提示词配置" name="prompts">
        <el-alert title="配置行业专属AI分析提示词，AI将根据这些提示词生成定制化的分析报告。" type="info" :closable="false" show-icon style="margin-bottom:16px;" />
        <el-form label-width="160px" style="max-width:900px;">
          <el-form-item label="综合分析提示词">
            <el-input v-model="prompts.general" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="客户画像提示词">
            <el-input v-model="prompts.profile" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="需求分析提示词">
            <el-input v-model="prompts.needs" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="话术提取提示词">
            <el-input v-model="prompts.scriptExtract" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="行动建议提示词">
            <el-input v-model="prompts.suggestion" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存提示词</el-button>
            <el-button>恢复默认</el-button>
            <el-button type="warning">AI生成提示词</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const activeTab = ref('template')

const industryNameMap = { bank: '银行金融', auto: '汽车销售', medical: '医疗健康', education: '教育培训', realestate: '房地产', retail: '零售消费', insurance: '保险' }
const currentIndustryName = computed(() => industryNameMap[route.query.industry] || '银行金融')

const analysisTemplates = ref([
  { name: '银行拜访报告生成', type: '报告生成', dims: '拜访概况/客户画像/需求洞察/行动建议', prompt: '基于银行客户拜访录音，生成结构化拜访报告...', enabled: true },
  { name: '客户资产评估分析', type: '专项分析', dims: '资产规模/风险偏好/理财需求', prompt: '分析客户对话中提及的资产信息...', enabled: true },
  { name: '合规性检查分析', type: '风险检查', dims: '合规用语/风险告知/适当性', prompt: '检查销售人员在沟通过程中的合规表现...', enabled: true },
  { name: '贷款产品匹配', type: '产品推荐', dims: '需求匹配/产品适配度/方案推荐', prompt: '根据客户需求和资产情况，推荐合适的贷款产品...', enabled: false }
])

const reportStructure = ref([
  { name: '📋 拜访概况', children: [{ name: '拜访时间/地点/对象' }, { name: '拜访时长' }, { name: '拜访类型（首次/跟进/签约/售后）' }] },
  { name: '👤 客户画像', children: [{ name: '客户基本信息' }, { name: '资产规模评估' }, { name: '理财偏好分析' }, { name: '风险承受能力' }, { name: '决策流程与关键人' }] },
  { name: '💡 需求洞察', children: [{ name: '已识别需求Top3' }, { name: '潜在需求预测' }, { name: '竞品渗透情况' }] },
  { name: '📊 销售能力评估', children: [{ name: '专业度评分' }, { name: '沟通能力评分' }, { name: '需求匹配度评分' }, { name: '成交信号强度' }] },
  { name: '📝 行动建议', children: [{ name: '下一步跟进建议' }, { name: '推荐产品方案' }, { name: '风险提示' }, { name: '推荐话术' }] },
  { name: '🏆 优秀话术提取', children: [{ name: '本场优秀话术Top3' }, { name: '可沉淀到话术库的片段' }] }
])

const dimensionTree = ref([
  { id: 1, name: '银行销售能力综合评分', weight: 100, scoreRange: '60-100', desc: '银行业销售拜访综合能力评估', children: [
    { id: 11, name: '专业度', weight: 25, scoreRange: '60-100', desc: '金融产品知识、合规用语、专业术语规范' },
    { id: 12, name: '需求挖掘', weight: 25, scoreRange: '60-100', desc: '客户需求识别深度、提问技巧、痛点挖掘' },
    { id: 13, name: '产品匹配', weight: 20, scoreRange: '60-100', desc: '产品推荐精准度、方案适配性' },
    { id: 14, name: '风险意识', weight: 15, scoreRange: '60-100', desc: '合规告知、风险提示、适当性评估' },
    { id: 15, name: '服务态度', weight: 15, scoreRange: '60-100', desc: '沟通礼仪、耐心程度、客户关怀' }
  ]}
])

const scriptTemplates = ref([
  { title: '银行理财首次拜访开场白', stage: '开场白', scene: '首次拜访', effectScore: 4.8, source: '金牌销售-王志华', status: '已审核' },
  { title: '客户风险偏好探测话术', stage: '需求挖掘', scene: '需求分析', effectScore: 4.5, source: 'AI生成', status: '已审核' },
  { title: '高净值客户产品推荐话术', stage: '产品介绍', scene: '产品推荐', effectScore: 4.6, source: '金牌销售-王志华', status: '已审核' },
  { title: '利率敏感客户异议处理', stage: '异议处理', scene: '价格异议', effectScore: 4.3, source: 'AI生成', status: '待审核' },
  { title: '贷款产品逼单话术', stage: '逼单促成', scene: '签约促成', effectScore: 4.1, source: '金牌销售-朱炫', status: '已审核' }
])

const goldConfig = reactive({
  scoreThreshold: 85,
  minDeals: 10,
  minRate: 20,
  minAudios: 30,
  coreDims: ['needDiscovery', 'professionalism', 'serviceAttitude'],
  minScripts: 2
})

const prompts = reactive({
  general: '你是一位资深的银行销售培训专家。请根据以下销售拜访录音转写文本，生成一份专业的银行客户拜访分析报告。报告需要包含：拜访概况、客户画像、需求洞察、销售能力评估和行动建议。',
  profile: '根据对话内容，分析客户画像。包括：1)客户基本信息（职位、年龄估计）2)资产规模评估（高/中/低）3)理财偏好（保守/稳健/进取）4)风险承受能力 5)决策流程与关键人。',
  needs: '深入分析客户需求：1)已明确表达的需求 2)通过对话推断的潜在需求 3)客户的核心关注点 4)竞品使用情况 5)预算范围和决策时间线。',
  scriptExtract: '从本次对话中提取优秀话术片段。标准：1)有效引导客户的话题转换 2)成功化解异议的话术 3)促成客户决策的关键表达 4)建立信任的专业表达。每条话术需标注适用场景。',
  suggestion: '基于本次拜访分析，为销售人员提供具体的行动建议：1)下次跟进的时间和方式 2)推荐的产品方案 3)需要注意的风险点 4)建议使用的沟通策略。'
})

const saveConfig = () => { ElMessage.success('金牌画像标准已保存') }
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
