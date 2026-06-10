<template>
  <div class="addon-page">
    <div class="page-header">
      <h2>📦 增值服务定价</h2>
      <p>按需选购，灵活搭配</p>
    </div>

    <!-- 服务卡片 -->
    <div class="addon-cards">
      <div class="addon-card" v-for="item in addons" :key="item.id">
        <div class="addon-icon">{{ item.icon }}</div>
        <h3>{{ item.name }}</h3>
        <p class="addon-desc">{{ item.desc }}</p>
        <div class="addon-price">
          <span class="amount">¥{{ item.price }}</span>
          <span class="unit">/{{ item.unit }}</span>
        </div>
        <el-divider />
        <ul class="addon-features">
          <li v-for="feat in item.features" :key="feat">
            <el-icon color="#67C23A"><Check /></el-icon>
            <span>{{ feat }}</span>
          </li>
        </ul>
        <el-button type="primary" style="width:100%;margin-top:16px" @click="handleBuy(item)">立即开通</el-button>
      </div>
    </div>

    <!-- 购买弹窗 -->
    <el-dialog v-model="buyVisible" :title="'开通 ' + selectedItem?.name" width="450px">
      <el-form label-width="100px">
        <el-form-item label="数量">
          <el-input-number v-model="buyForm.qty" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="购买时长">
          <el-select v-model="buyForm.months">
            <el-option :value="1" label="1个月" />
            <el-option :value="3" label="3个月" />
            <el-option :value="6" label="6个月" />
            <el-option :value="12" label="1年" />
          </el-select>
        </el-form-item>
        <el-divider />
        <el-form-item label="合计">
          <span class="total">¥{{ (selectedItem?.price || 0) * buyForm.qty * buyForm.months }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="buyVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBuy">确认开通</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

const buyVisible = ref(false)
const selectedItem = ref(null)
const buyForm = ref({ qty: 1, months: 1 })

const addons = ref([
  {
    id: 'agent', name: '智能体扩展包', icon: '🤖',
    desc: '每包增加1个智能体配置',
    price: 99, unit: '月/包',
    features: ['增加1个智能体', '支持自定义策略', '独立数据空间', 'API调用权限']
  },
  {
    id: 'storage', name: '存储扩展包', icon: '💾',
    desc: '每包增加50GB云存储空间',
    price: 49, unit: '月/包',
    features: ['50GB云端存储', '录音永久保存', '自动备份', '多地容灾']
  },
  {
    id: 'device', name: '设备扩展包', icon: '📱',
    desc: '每包增加5台设备授权',
    price: 199, unit: '月/包',
    features: ['5台设备授权', '远程管理', 'OTA升级', '设备诊断']
  },
  {
    id: 'api', name: 'API调用包', icon: '🔌',
    desc: '每包10万次API调用额度',
    price: 299, unit: '月/包',
    features: ['10万次调用', '全模型支持', '优先响应', 'SLA保障99.9%']
  },
  {
    id: 'train', name: '定制训练服务', icon: '🎯',
    desc: '行业专属模型微调',
    price: 1999, unit: '次',
    features: ['行业数据训练', '专属模型部署', '效果评估报告', '持续优化']
  }
])

function handleBuy(item) {
  selectedItem.value = item
  buyForm.value = { qty: 1, months: 1 }
  buyVisible.value = true
}

function confirmBuy() {
  ElMessage.success('开通成功！')
  buyVisible.value = false
}
</script>

<style scoped>
.addon-page { padding: 24px; background: #f5f7fa; min-height: 100vh }
.page-header { text-align: center; margin-bottom: 32px }
.page-header h2 { font-size: 24px; color: #303133 }
.page-header p { color: #909399; font-size: 14px; margin-top: 4px }

.addon-cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; max-width: 1200px; margin: 0 auto }
.addon-card { background: #fff; border-radius: 12px; padding: 24px 16px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,.06); transition: transform .2s }
.addon-card:hover { transform: translateY(-4px) }
.addon-icon { font-size: 32px; margin-bottom: 12px }
.addon-card h3 { font-size: 16px; color: #303133; margin-bottom: 4px }
.addon-desc { font-size: 12px; color: #909399; margin-bottom: 12px }
.addon-price { margin: 8px 0 }
.addon-price .amount { font-size: 24px; color: #409EFF; font-weight: 700 }
.addon-price .unit { font-size: 12px; color: #909399 }
.addon-features { list-style: none; text-align: left; padding: 0 }
.addon-features li { display: flex; align-items: center; gap: 6px; padding: 4px 0; font-size: 13px; color: #606266 }

.total { font-size: 22px; color: #409EFF; font-weight: 700 }
</style>
