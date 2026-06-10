<template>
  <div class="subscription-page">
    <div class="page-header">
      <h2>📋 订阅管理</h2>
      <el-button type="primary" @click="$router.push('/billing/pricing')">升级方案</el-button>
    </div>

    <!-- 当前套餐 -->
    <el-card class="current-plan" shadow="hover">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:600;font-size:16px">当前套餐</span>
          <el-tag :type="planStatusType">{{ planStatusText }}</el-tag>
        </div>
      </template>
      <div class="plan-info">
        <div>
          <h3>{{ currentPlan.name }}</h3>
          <p>{{ currentPlan.deviceCount }} 台设备 · 年付</p>
        </div>
        <div class="plan-price-info">
          <span class="price">¥{{ currentPlan.price.toLocaleString() }}</span>
          <span>元/年/台</span>
        </div>
      </div>
      <el-divider />
      <div class="plan-detail">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="开始时间">{{ currentPlan.startDate }}</el-descriptions-item>
          <el-descriptions-item label="到期时间">{{ currentPlan.expireDate }}</el-descriptions-item>
          <el-descriptions-item label="剩余天数">
            <span :style="{ color: remainingDays <= 7 ? '#F56C6C' : '#67C23A' }">{{ remainingDays }} 天</span>
          </el-descriptions-item>
          <el-descriptions-item label="设备数量">{{ currentPlan.deviceCount }} 台</el-descriptions-item>
          <el-descriptions-item label="已用设备">{{ currentPlan.usedDevices }} 台</el-descriptions-item>
          <el-descriptions-item label="可用设备">{{ currentPlan.deviceCount - currentPlan.usedDevices }} 台</el-descriptions-item>
        </el-descriptions>
      </div>
      <div style="margin-top:16px;display:flex;gap:12px">
        <el-button type="primary" @click="renewVisible = true">续费</el-button>
        <el-button @click="upgradeVisible = true">升级套餐</el-button>
      </div>
    </el-card>

    <!-- 用量统计 -->
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="12" v-for="stat in usageStats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" :style="{ background: stat.bg }">{{ stat.icon }}</div>
            <div class="stat-info">
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}<span class="stat-unit">/{{ stat.unit }}</span></div>
              <el-progress :percentage="stat.percent" :color="stat.color" :stroke-width="6" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单记录 -->
    <el-card style="margin-top:16px" shadow="hover">
      <template #header><span style="font-weight:600;font-size:16px">订单记录</span></template>
      <el-table :data="orders" stripe>
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === '续费' ? 'success' : 'primary'" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="plan" label="套餐" width="100" />
        <el-table-column prop="count" label="设备数量" width="100" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="date" label="时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="invoice" label="发票" width="100">
          <template #default="{ row }">
            <el-button v-if="row.invoice" link type="primary" size="small">下载</el-button>
            <span v-else style="color:#C0C4CC">-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 续费弹窗 -->
    <el-dialog v-model="renewVisible" title="续费" width="450px">
      <el-form label-width="80px">
        <el-form-item label="续费周期">
          <el-radio-group v-model="renewForm.period">
            <el-radio label="yearly">年付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="续费时长">
          <el-select v-model="renewForm.months">
            <el-option :value="1" label="1个月" />
            <el-option :value="3" label="3个月" />
            <el-option :value="6" label="6个月" />
            <el-option :value="12" label="1年" />
          </el-select>
        </el-form-item>
        <el-divider />
        <el-form-item label="应付金额">
          <span style="font-size:22px;color:#409EFF;font-weight:700">¥{{ renewAmount.toLocaleString() }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="renewVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRenew">确认续费</el-button>
      </template>
    </el-dialog>

    <!-- 升级弹窗 -->
    <el-dialog v-model="upgradeVisible" title="升级套餐" width="500px">
      <div class="upgrade-options">
        <div class="upgrade-card" v-for="plan in upgradePlans" :key="plan.id" @click="selectedUpgrade = plan.id" :class="{ selected: selectedUpgrade === plan.id }">
          <h4>{{ plan.name }}</h4>
          <p>¥{{ plan.price }}/月/台</p>
          <ul>
            <li v-for="feat in plan.features" :key="feat">✓ {{ feat }}</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="upgradeVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUpgrade" :disabled="!selectedUpgrade">确认升级</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const renewVisible = ref(false)
const upgradeVisible = ref(false)
const selectedUpgrade = ref('')
const renewForm = ref({ period: 'monthly', months: 1 })

const currentPlan = ref({
  name: '高级版',
  deviceCount: 10,
  usedDevices: 7,
  price: 799,
  period: 'yearly',
  startDate: '2026-03-15',
  expireDate: '2027-03-15'
})

const remainingDays = computed(() => {
  const now = new Date()
  const expire = new Date(currentPlan.value.expireDate)
  return Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
})

const planStatusType = computed(() => remainingDays.value <= 7 ? 'danger' : remainingDays.value <= 30 ? 'warning' : 'success')
const planStatusText = computed(() => remainingDays.value <= 0 ? '已过期' : `${remainingDays.value}天后到期`)

const renewAmount = computed(() => {
  const base = renewForm.value.period === 'yearly' ? 7670 * (renewForm.value.months / 12) : 799 * renewForm.value.months
  return Math.round(base * currentPlan.value.deviceCount)
})

const usageStats = ref([
  { label: '录音时长', value: '856', unit: '1200h', percent: 71, color: '#409EFF', icon: '🎙️', bg: '#ecf5ff' },
  { label: '智能体数量', value: '2', unit: '3个', percent: 67, color: '#67C23A', icon: '🤖', bg: '#f0f9eb' }
])

const orders = ref([
  { orderNo: 'ORD20260601001', type: '续费', plan: '高级版', count: 10, amount: 7990, date: '2026-06-01 14:30', status: '已完成', invoice: true },
  { orderNo: 'ORD20260501001', type: '续费', plan: '高级版', count: 8, amount: 6392, date: '2026-05-01 10:15', status: '已完成', invoice: true },
  { orderNo: 'ORD20260315001', type: '新购', plan: '高级版', count: 10, amount: 7990, date: '2026-03-15 09:00', status: '已完成', invoice: true }
])

const upgradePlans = ref([
  { id: 'pro', name: '高级版', price: 799, features: ['全功能AI赋能', '100个智能体', '话术库', '销售画像'] },
  { id: 'enterprise', name: '专业版', price: 1099, features: ['专属定制', 'API接口', '私有化部署', '7x24客服'] }
])

function confirmRenew() {
  ElMessage.success(`续费成功！有效期延长至 ${new Date(Date.now() + renewForm.value.months * 30 * 86400000).toLocaleDateString()}`)
  renewVisible.value = false
}

function confirmUpgrade() {
  ElMessage.success('套餐升级成功！')
  upgradeVisible.value = false
}
</script>

<style scoped>
.subscription-page { padding: 24px; background: #f5f7fa; min-height: 100vh }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px }
.page-header h2 { font-size: 24px; color: #303133 }

.plan-info { display: flex; justify-content: space-between; align-items: center }
.plan-info h3 { font-size: 20px; color: #303133 }
.plan-info p { color: #909399; font-size: 13px; margin-top: 4px }
.plan-price-info .price { font-size: 28px; color: #409EFF; font-weight: 700 }
.plan-price-info span { font-size: 14px; color: #909399 }

.stat-item { display: flex; gap: 12px; align-items: center }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0 }
.stat-info { flex: 1 }
.stat-label { font-size: 13px; color: #909399; margin-bottom: 4px }
.stat-value { font-size: 18px; font-weight: 600; color: #303133 }
.stat-unit { font-size: 12px; color: #909399; font-weight: 400 }

.upgrade-options { display: flex; gap: 16px }
.upgrade-card {
  flex: 1; border: 2px solid #E4E7ED; border-radius: 10px; padding: 20px;
  cursor: pointer; transition: all .2s; text-align: center
}
.upgrade-card:hover { border-color: #409EFF }
.upgrade-card.selected { border-color: #409EFF; background: #ecf5ff }
.upgrade-card h4 { font-size: 18px; margin-bottom: 8px }
.upgrade-card p { font-size: 22px; color: #409EFF; font-weight: 700; margin-bottom: 12px }
.upgrade-card ul { list-style: none; text-align: left; font-size: 13px; color: #606266 }
.upgrade-card li { padding: 3px 0 }
</style>
