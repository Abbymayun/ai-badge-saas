<template>
  <div>
    <div class="page-title">🏭 行业管理</div>
    <el-alert title="行业管理说明：不同行业有不同的销售场景和分析需求。配置行业专属AI分析模板后，对应企业将自动获得行业级别的定制化能力。" type="info" :closable="false" show-icon style="margin-bottom:16px;" />

    <el-row :gutter="16">
      <el-col :span="8" v-for="item in industryList" :key="item.key">
        <el-card shadow="hover" class="industry-card">
          <div class="ic-header">
            <span class="ic-icon">{{ item.icon }}</span>
            <div>
              <div class="ic-name">{{ item.name }}</div>
              <div class="ic-desc">{{ item.desc }}</div>
            </div>
          </div>
          <div class="ic-stats">
            <div class="ics-item">
              <span class="ics-val">{{ item.enterprises }}</span>
              <span class="ics-lbl">已配置企业</span>
            </div>
            <div class="ics-item">
              <span class="ics-val">{{ item.templates }}</span>
              <span class="ics-lbl">AI模板</span>
            </div>
            <div class="ics-item">
              <span class="ics-val">{{ item.scripts }}</span>
              <span class="ics-lbl">话术模板</span>
            </div>
          </div>
          <div class="ic-progress">
            <span style="font-size:12px;color:#909399;">配置完成度</span>
            <el-progress :percentage="item.progress" :color="item.progress===100?'#67C23A':'#E6A23C'" :stroke-width="6" style="flex:1;" />
          </div>
          <el-tag :type="item.status==='已上线'?'success':item.status==='测试中'?'warning':'info'" size="small">{{ item.status }}</el-tag>
          <div class="ic-actions">
            <el-button type="primary" size="small" @click="goConfig(item.key)">行业配置</el-button>
            <el-button size="small">数据看板</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const industryList = ref([
  { key: 'bank', icon: '🏦', name: '银行金融', desc: '拜访报告AI分析、客户资产评估、合规检查', enterprises: 12, templates: 6, scripts: 45, progress: 100, status: '已上线' },
  { key: 'auto', icon: '🚗', name: '汽车销售', desc: '试驾跟进、车型推荐、价格谈判分析', enterprises: 8, templates: 5, scripts: 32, progress: 85, status: '已上线' },
  { key: 'medical', icon: '🏥', name: '医疗健康', desc: '合规话术检查、医生沟通、学术推广', enterprises: 5, templates: 3, scripts: 18, progress: 60, status: '测试中' },
  { key: 'education', icon: '📚', name: '教育培训', desc: '家长需求分析、课程推荐、转化话术', enterprises: 3, templates: 2, scripts: 12, progress: 45, status: '测试中' },
  { key: 'realestate', icon: '🏠', name: '房地产', desc: '看房跟进、户型推荐、签约促成', enterprises: 2, templates: 2, scripts: 8, progress: 30, status: '开发中' },
  { key: 'retail', icon: '🛒', name: '零售消费', desc: '客户画像、需求挖掘、复购预测', enterprises: 0, templates: 0, scripts: 0, progress: 10, status: '规划中' },
  { key: 'insurance', icon: '🛡️', name: '保险', desc: '需求分析、方案推荐、异议处理', enterprises: 0, templates: 0, scripts: 0, progress: 5, status: '规划中' }
])

const goConfig = (key) => {
  router.push({ path: '/industry/config', query: { industry: key } })
}
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
.industry-card { margin-bottom: 16px; transition: transform 0.2s; }
.industry-card:hover { transform: translateY(-2px); }
.ic-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.ic-icon { font-size: 36px; }
.ic-name { font-size: 18px; font-weight: bold; color: #303133; }
.ic-desc { font-size: 13px; color: #909399; margin-top: 2px; }
.ic-stats { display: flex; justify-content: space-around; margin-bottom: 12px; padding: 12px 0; border-top: 1px solid #ebeef5; border-bottom: 1px solid #ebeef5; }
.ics-item { text-align: center; }
.ics-val { font-size: 20px; font-weight: bold; color: #409EFF; display: block; }
.ics-lbl { font-size: 11px; color: #909399; }
.ic-progress { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.ic-actions { margin-top: 12px; display: flex; gap: 8px; }
</style>
