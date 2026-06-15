<template>
  <div class="pricing-page">
    <div class="page-header">
      <h2>💰 定价方案</h2>
      <p>选择适合您企业的AI智能胸牌方案</p>
    </div>

    <!-- 移除月付/年付切换 -->

    <!-- 套餐卡片 -->
    <div class="plan-cards">
      <div class="plan-card" v-for="plan in plans" :key="plan.id" :class="{ featured: plan.featured }">
        <div class="plan-badge" v-if="plan.featured">推荐</div>
        <h3>{{ plan.name }}</h3>
        <p class="plan-desc">{{ plan.desc }}</p>
        <div class="plan-price">
          <span class="currency">¥</span>
          <span class="amount">{{ plan.yearlyPrice }}</span>
          <span class="period"></span>
          <div class="device-price" v-if="plan.deviceInfo">{{ plan.deviceInfo }}</div>
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
import { ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'

const billingCycle = ref('yearly')

const plans = ref([
  {
    id: 'basic', name: '标准版', desc: '适合小微团队，基础AI听记功能',
    yearlyPrice: 499, deviceInfo:'首年含设备：949（黑白版）、999（多色版）',
    features: [
      { label: 'AI听记分析', enabled: true },
      { label: '基础报告', enabled: true },
      { label: '设备管理', enabled: true },
      { label: '3个智能体', enabled: true },
      { label: '600h录音时长', enabled: true },
      { label: '话术库', enabled: false },
      { label: '销售画像', enabled: false },
      { label: '自定义策略', enabled: false },
      { label: 'API接口', enabled: false }
    ]
  },
  {
    id: 'pro', name: '高级版', desc: '适合成长型企业，全功能AI赋能',
    yearlyPrice: 799, featured: true, deviceInfo:'首年含设备：1249（黑白版）、1299（多色版）',
    features: [
      { label: 'AI听记分析', enabled: true },
      { label: '基础报告', enabled: true },
      { label: '设备管理', enabled: true },
      { label: '3个智能体', enabled: true },
      { label: '1200h录音时长', enabled: true },
      { label: '话术库', enabled: true },
      { label: '销售画像', enabled: true },
      { label: '自定义策略', enabled: true },
      { label: 'API接口', enabled: false },
      { label: '首年含设备：1249（黑白版）、1299（多色版）', enabled: true, special: true }
    ]
  },
  {
    id: 'enterprise', name: '专业版', desc: '适合大型企业，专属定制方案',
    yearlyPrice: 1099, deviceInfo:'首年含设备：1549（黑白版）、1599（多色版）',
    features: [
      { label: 'AI听记分析', enabled: true },
      { label: '基础报告', enabled: true },
      { label: '设备管理', enabled: true },
      { label: '6个智能体', enabled: true },
      { label: '不限录音时长', enabled: true },
      { label: '话术库', enabled: true },
      { label: '销售画像', enabled: true },
      { label: '自定义策略', enabled: true },
      { label: 'API接口', enabled: true },
      { label: '首年含设备：1549（黑白版）、1599（多色版）', enabled: true, special: true }
    ]
  }
])

const compareData = ref([
  { feature: 'AI听记分析', basic: true, pro: true, enterprise: true },
  { feature: '基础报告', basic: true, pro: true, enterprise: true },
  { feature: '录音时长/月', basic: '600h', pro: '1200h', enterprise: '不限' },
  { feature: '智能体数量', basic: '3个', pro: '3个', enterprise: '6个' },
  { feature: '话术库', basic: false, pro: true, enterprise: true },
  { feature: '销售画像', basic: false, pro: true, enterprise: true },
  { feature: '自定义策略', basic: false, pro: true, enterprise: true },
  { feature: 'API接口', basic: false, pro: false, enterprise: true },
  { feature: '专属客服', basic: false, pro: false, enterprise: true },
  { feature: '数据导出', basic: false, pro: true, enterprise: true },
  { feature: '私有化部署', basic: false, pro: false, enterprise: true }
])

</script>

<style scoped>
.pricing-page { padding: 24px; background: #f5f7fa; min-height: 100vh }
.page-header { text-align: center; margin-bottom: 24px }
.page-header h2 { font-size: 28px; color: #303133; margin-bottom: 8px }
.page-header p { color: #909399; font-size: 14px }

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
</style>
