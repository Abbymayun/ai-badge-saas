<template>
  <div class="pricing-page">
    <div class="page-header">
      <h2>💰 定价方案</h2>
      <p>选择适合您企业的AI智能胸牌方案</p>
    </div>

    <!-- 套餐切换 -->
    <div class="billing-toggle">
      <span :class="{ active: billingCycle === 'monthly' }" @click="billingCycle = 'monthly'">月付</span>
      <span :class="{ active: billingCycle === 'yearly' }" @click="billingCycle = 'yearly'">年付</span>
      <el-tag v-if="billingCycle === 'yearly'" type="danger" size="small" style="margin-left:8px">省20%</el-tag>
    </div>

    <!-- 套餐卡片 -->
    <div class="plan-cards">
      <div class="plan-card" v-for="plan in plans" :key="plan.id" :class="{ featured: plan.featured }">
        <div class="plan-badge" v-if="plan.featured">推荐</div>
        <h3>{{ plan.name }}</h3>
        <p class="plan-desc">{{ plan.desc }}</p>
        <div class="plan-price">
          <span class="currency">¥</span>
          <span class="amount">{{ billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice }}</span>
          <span class="period">/{{ billingCycle === 'yearly' ? '年' : '月' }}/设备</span>
        </div>
        <el-divider />
        <ul class="plan-features">
          <li v-for="feat in plan.features" :key="feat">
            <el-icon :color="feat.enabled ? '#67C23A' : '#C0C4CC'">
              <component :is="feat.enabled ? 'Check' : 'Close'" />
            </el-icon>
            <span :style="{ color: feat.enabled ? '#333' : '#C0C4CC' }">{{ feat.label }}</span>
          </li>
        </ul>
        <el-button :type="plan.featured ? 'primary' : 'default'" size="large" style="width:100%;margin-top:20px" @click="handleBuy(plan)">
          {{ plan.featured ? '立即购买' : '免费试用' }}
        </el-button>
      </div>
    </div>

    <!-- 功能对比 -->
    <div class="compare-section">
      <h3>功能对比</h3>
      <el-table :data="compareData" border style="width:100%">
        <el-table-column prop="feature" label="功能" width="200" />
        <el-table-column v-for="plan in plans" :key="plan.id" :label="plan.name" align="center">
          <template #default="{ row }">
            <el-icon :size="20" :color="row[plan.id] ? '#67C23A' : '#C0C4CC'">
              <component :is="row[plan.id] ? 'Check' : 'Close'" />
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 购买弹窗 -->
    <el-dialog v-model="buyVisible" :title="'购买 ' + selectedPlan?.name" width="500px">
      <el-form :model="buyForm" label-width="100px">
        <el-form-item label="设备数量">
          <el-input-number v-model="buyForm.deviceCount" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="购买周期">
          <el-radio-group v-model="buyForm.period">
            <el-radio label="monthly">月付 (¥{{ selectedPlan?.monthlyPrice }}/月/台)</el-radio>
            <el-radio label="yearly">年付 (¥{{ selectedPlan?.yearlyPrice }}/年/台)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider />
        <el-form-item label="合计">
          <span class="total-price">¥{{ totalPrice.toLocaleString() }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="buyVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBuy">确认购买</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'

const billingCycle = ref('monthly')
const buyVisible = ref(false)
const selectedPlan = ref(null)
const buyForm = ref({ deviceCount: 1, period: 'monthly' })

const plans = ref([
  {
    id: 'basic', name: '标准版', desc: '适合小微团队，基础AI听记功能',
    monthlyPrice: 499, yearlyPrice: 4790,
    features: [
      { label: 'AI听记分析', enabled: true },
      { label: '基础报告', enabled: true },
      { label: '设备管理', enabled: true },
      { label: '3个智能体', enabled: true },
      { label: '话术库', enabled: false },
      { label: '销售画像', enabled: false },
      { label: '自定义模板', enabled: false },
      { label: 'API接口', enabled: false },
      { label: '硬件设备 ¥500/台', enabled: true }
    ]
  },
  {
    id: 'pro', name: '高级版', desc: '适合成长型企业，全功能AI赋能',
    monthlyPrice: 799, yearlyPrice: 7670, featured: true,
    features: [
      { label: 'AI听记分析', enabled: true },
      { label: '高级报告', enabled: true },
      { label: '设备管理', enabled: true },
      { label: '3个智能体', enabled: true },
      { label: '话术库', enabled: true },
      { label: '销售画像', enabled: true },
      { label: '自定义模板', enabled: true },
      { label: 'API接口', enabled: false },
      { label: '硬件设备 ¥500/台', enabled: true }
    ]
  },
  {
    id: 'enterprise', name: '专业版', desc: '适合大型企业，专属定制方案',
    monthlyPrice: 1099, yearlyPrice: 10550,
    features: [
      { label: 'AI听记分析', enabled: true },
      { label: '专属报告', enabled: true },
      { label: '设备管理', enabled: true },
      { label: '6个智能体', enabled: true },
      { label: '话术库', enabled: true },
      { label: '销售画像', enabled: true },
      { label: '自定义模板', enabled: true },
      { label: 'API接口', enabled: true },
      { label: '硬件设备 ¥500/台', enabled: true }
    ]
  }
])

const compareData = ref([
  { feature: 'AI听记分析', basic: true, pro: true, enterprise: true },
  { feature: '录音时长/月', basic: '100h', pro: '500h', enterprise: '无限' },
  { feature: '智能体数量', basic: '3个', pro: '3个', enterprise: '6个' },
  { feature: '话术库', basic: false, pro: true, enterprise: true },
  { feature: '销售画像', basic: false, pro: true, enterprise: true },
  { feature: '自定义AI模板', basic: false, pro: true, enterprise: true },
  { feature: 'API接口', basic: false, pro: false, enterprise: true },
  { feature: '硬件设备', basic: '¥500/台', pro: '¥500/台', enterprise: '¥500/台' },
  { feature: '专属客服', basic: false, pro: false, enterprise: true },
  { feature: '数据导出', basic: false, pro: true, enterprise: true },
  { feature: '私有化部署', basic: false, pro: false, enterprise: true }
])

const totalPrice = computed(() => {
  if (!selectedPlan.value) return 0
  const price = buyForm.value.period === 'yearly' ? selectedPlan.value.yearlyPrice : selectedPlan.value.monthlyPrice
  return price * buyForm.value.deviceCount
})

function handleBuy(plan) {
  selectedPlan.value = plan
  buyForm.value = { deviceCount: 1, period: billingCycle.value }
  buyVisible.value = true
}

function confirmBuy() {
  ElMessage.success(`成功购买 ${buyForm.value.deviceCount} 台设备，合计 ¥${totalPrice.value.toLocaleString()}`)
  buyVisible.value = false
}
</script>

<style scoped>
.pricing-page { padding: 24px; background: #f5f7fa; min-height: 100vh }
.page-header { text-align: center; margin-bottom: 24px }
.page-header h2 { font-size: 28px; color: #303133; margin-bottom: 8px }
.page-header p { color: #909399; font-size: 14px }

.billing-toggle {
  display: flex; align-items: center; justify-content: center; margin-bottom: 32px;
  background: #fff; border-radius: 8px; padding: 4px; width: 240px; margin-left: auto; margin-right: auto
}
.billing-toggle span {
  flex: 1; text-align: center; padding: 8px 16px; border-radius: 6px;
  cursor: pointer; font-size: 14px; color: #606266; transition: all .2s
}
.billing-toggle span.active { background: #409EFF; color: #fff; font-weight: 600 }

.plan-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto }
.plan-card {
  background: #fff; border-radius: 12px; padding: 32px 24px; text-align: center;
  position: relative; box-shadow: 0 2px 12px rgba(0,0,0,.06); transition: transform .2s
}
.plan-card:hover { transform: translateY(-4px) }
.plan-card.featured { border: 2px solid #409EFF; box-shadow: 0 4px 20px rgba(64,158,255,.15) }
.plan-badge {
  position: absolute; top: 16px; right: 16px; background: #409EFF; color: #fff;
  padding: 2px 12px; border-radius: 12px; font-size: 12px
}
.plan-card h3 { font-size: 22px; color: #303133; margin-bottom: 8px }
.plan-desc { color: #909399; font-size: 13px; margin-bottom: 16px }
.plan-price { margin: 16px 0 }
.currency { font-size: 20px; color: #409EFF; vertical-align: top }
.amount { font-size: 40px; color: #409EFF; font-weight: 700 }
.period { font-size: 14px; color: #909399 }
.plan-features { list-style: none; text-align: left; padding: 0 }
.plan-features li { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 14px }

.compare-section { max-width: 1100px; margin: 48px auto 0 }
.compare-section h3 { font-size: 20px; margin-bottom: 16px; color: #303133 }
.total-price { font-size: 24px; color: #409EFF; font-weight: 700 }
</style>
