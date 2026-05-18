<template>
  <div>
    <div class="page-title">{{ isEdit ? '编辑企业' : '创建企业' }}</div>
    <el-card shadow="hover">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" style="max-width:800px;">

        <el-divider content-position="left">📋 基本信息</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入企业全称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择" style="width:100%">
                <el-option label="集团" value="group" />
                <el-option label="分公司" value="branch" />
                <el-option label="合作伙伴" value="partner" />
                <el-option label="试用客户" value="trial" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="所属行业" prop="industry">
          <el-select v-model="form.industry" placeholder="请选择行业" style="width:100%" @change="onIndustryChange">
            <el-option v-for="i in industryOptions" :key="i.value" :label="i.label" :value="i.value">
              <span>{{ i.label }}</span>
              <span v-if="i.tag" style="color:#909399;font-size:12px;margin-left:8px;">{{ i.tag }}</span>
            </el-option>
          </el-select>
          <div class="form-tip">选择行业后，系统将自动加载行业专属AI分析模板、评价维度和话术模板</div>
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入企业邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址">
              <el-input v-model="form.address" placeholder="请输入企业地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="企业简介">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入企业简介" />
        </el-form-item>

        <el-divider content-position="left">🤖 AI配额配置</el-divider>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="AI总结可打开数量" prop="aiQuota">
              <el-input-number v-model="form.aiQuota" :min="0" :max="99999" :step="100" style="width:100%" />
              <div class="form-tip">该企业可查看AI总结报告的次数上限</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配额到期时间" prop="quotaExpire">
              <el-date-picker v-model="form.quotaExpire" type="date" placeholder="选择到期日期" style="width:100%" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="超额策略">
              <el-select v-model="form.overQuotaPolicy" style="width:100%">
                <el-option label="禁止使用" value="block" />
                <el-option label="按次计费" value="pay_per_use" />
                <el-option label="仅提醒" value="remind" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提前预警阈值">
              <el-input-number v-model="form.warningThreshold" :min="0" :max="100" :step="5" />
              <span style="margin-left:8px;color:#909399;">%</span>
              <div class="form-tip">配额使用达到此百分比时触发预警通知</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">🔧 功能模块开关</el-divider>
        <el-form-item label="启用模块">
          <el-checkbox-group v-model="form.modules">
            <el-checkbox label="audio_analysis">AI听记分析</el-checkbox>
            <el-checkbox label="clue_manage">线索管理</el-checkbox>
            <el-checkbox label="sales_profile">金牌销售画像</el-checkbox>
            <el-checkbox label="script_library">话术库</el-checkbox>
            <el-checkbox label="industry_analysis">行业专属AI分析</el-checkbox>
            <el-checkbox label="data_report">数据报表导出</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="行业专属功能" v-if="form.industry">
          <el-alert :title="`已选择【${selectedIndustryLabel}】，以下行业专属功能将自动启用：`" type="success" :closable="false" show-icon style="margin-bottom:8px;" />
          <el-tag v-for="f in industryFeatures" :key="f" style="margin:4px;" type="warning">{{ f }}</el-tag>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">{{ isEdit ? '保存修改' : '创建企业' }}</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.query.id)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
  name: '',
  type: '',
  industry: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  description: '',
  aiQuota: 100,
  quotaExpire: '',
  overQuotaPolicy: 'block',
  warningThreshold: 80,
  modules: ['audio_analysis', 'clue_manage']
})

const rules = {
  name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择企业类型', trigger: 'change' }],
  industry: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  aiQuota: [{ required: true, message: '请设置AI配额', trigger: 'change' }],
  quotaExpire: [{ required: true, message: '请选择配额到期时间', trigger: 'change' }]
}

const industryOptions = [
  { value: 'bank', label: '🏦 银行金融', tag: '支持拜访报告AI分析' },
  { value: 'auto', label: '🚗 汽车销售', tag: '支持试驾分析' },
  { value: 'medical', label: '🏥 医疗健康', tag: '开发中' },
  { value: 'education', label: '📚 教育培训', tag: '开发中' },
  { value: 'realestate', label: '🏠 房地产', tag: '开发中' },
  { value: 'retail', label: '🛒 零售消费', tag: '规划中' },
  { value: 'insurance', label: '🛡️ 保险', tag: '规划中' }
]

const industryFeatureMap = {
  bank: ['银行拜访报告AI生成', '贷款产品匹配分析', '客户资产评估', '银行合规性检查', '银行专属评价维度', '银行业话术模板库'],
  auto: ['试驾跟进AI分析', '车型需求匹配', '价格谈判辅助', '竞品对比分析', '汽车业专属评价维度', '汽车业话术模板库'],
  medical: ['合规话术检查', '医生沟通分析', '学术推广效果评估', '医疗业专属评价维度'],
  education: ['家长需求分析', '课程推荐匹配', '转化跟进建议', '教育业专属评价维度'],
  realestate: ['看房跟进分析', '户型推荐匹配', '决策链分析', '逼单能力评估'],
  retail: ['客户画像分析', '需求挖掘评估', '复购预测分析'],
  insurance: ['需求分析报告', '方案匹配评分', '异议处理评估', '信任建立分析']
}

const selectedIndustryLabel = computed(() => {
  const found = industryOptions.find(i => i.value === form.industry)
  return found ? found.label : ''
})

const industryFeatures = computed(() => industryFeatureMap[form.industry] || [])

const onIndustryChange = (val) => {
  if (val) {
    form.modules.push('industry_analysis')
    if (!form.modules.includes('sales_profile')) form.modules.push('sales_profile')
    if (!form.modules.includes('script_library')) form.modules.push('script_library')
  }
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true
      setTimeout(() => {
        submitting.value = false
        ElMessage.success(isEdit.value ? '企业信息已更新' : '企业创建成功')
        router.push('/enterprise/list')
      }, 1000)
    }
  })
}
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
.form-tip { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
