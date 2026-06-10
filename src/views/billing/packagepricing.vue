<template>
  <div class="package-page">
    <div class="page-header">
      <h2>📦 按套餐定价</h2>
      <p>设备 + SaaS 后台一体化，一口价全包</p>
    </div>

    <div class="package-cards">
      <div class="pkg-card" v-for="pkg in packages" :key="pkg.id" :class="{ featured: pkg.featured }">
        <div class="pkg-badge" v-if="pkg.featured">推荐</div>
        <div class="pkg-top">
          <h3>{{ pkg.name }}</h3>
          <p class="pkg-desc">{{ pkg.desc }}</p>
          <div class="pkg-price">
            <span class="currency">¥</span>
            <span class="amount">{{ pkg.price.toLocaleString() }}</span>
            <span class="unit">/年</span>
          </div>
          <el-tag type="warning" size="small" style="margin-top:4px">含硬件设备 + SaaS后台</el-tag>
        </div>
        <el-divider />
        <div class="pkg-body">
          <div class="pkg-highlight">
            <div class="hl-item">
              <span class="hl-val">{{ pkg.devices }}</span>
              <span class="hl-lbl">台设备</span>
            </div>
            <div class="hl-item">
              <span class="hl-val">{{ pkg.agents }}</span>
              <span class="hl-lbl">个智能体</span>
            </div>
            <div class="hl-item">
              <span class="hl-val">{{ pkg.recording }}</span>
              <span class="hl-lbl">h/年/台</span>
            </div>
            <div class="hl-item">
              <span class="hl-val">{{ pkg.warranty }}</span>
              <span class="hl-lbl">硬件保修</span>
            </div>
          </div>
          <ul class="pkg-features">
            <li v-for="feat in pkg.features" :key="feat">
              <el-icon color="#67C23A"><Check /></el-icon>
              <span>{{ feat }}</span>
            </li>
          </ul>
        </div>
        <el-button :type="pkg.featured ? 'primary' : 'default'" size="large" style="width:100%;margin-top:16px" @click="handleBuy(pkg)">
          {{ pkg.featured ? '立即购买' : '咨询购买' }}
        </el-button>
      </div>
    </div>

    <!-- 购买弹窗 -->
    <el-dialog v-model="buyVisible" :title="'购买 ' + selectedPkg?.name" width="500px">
      <el-form label-width="100px">
        <el-form-item label="套餐">
          <span style="font-weight:600">{{ selectedPkg?.name }} · {{ selectedPkg?.devices }}台设备</span>
        </el-form-item>
        <el-form-item label="单价">
          <span style="font-size:18px;color:#409EFF;font-weight:700">¥{{ selectedPkg?.price?.toLocaleString() }}/年</span>
        </el-form-item>
        <el-form-item label="购买数量">
          <el-input-number v-model="buyForm.qty" :min="1" :max="100" />
        </el-form-item>
        <el-divider />
        <el-form-item label="合计">
          <span class="total">¥{{ ((selectedPkg?.price || 0) * buyForm.qty).toLocaleString() }}</span>
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
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

const buyVisible = ref(false)
const selectedPkg = ref(null)
const buyForm = ref({ qty: 1 })

const packages = ref([
  {
    id: 'starter', name: '标准版', desc: '适合小团队快速上手',
    price: 9999, devices: 20, agents: 3, recording: '1200h', warranty: '1年',
    features: [
      '20台AI智能胸牌设备',
      'SaaS管理后台完整功能',
      '3个智能体配置',
      'AI听记分析 · 基础报告',
      '设备远程管理 · OTA升级',
      '标准技术支持（工作日9:00-18:00）',
      '1200h/年/台录音时长',
      '硬件保修1年',
      '1年免费软件更新'
    ]
  },
  {
    id: 'growth', name: '专业版', desc: '适合中型团队规模部署',
    price: 24999, devices: 50, agents: 6, recording: '3000h', warranty: '2年', featured: true,
    features: [
      '50台AI智能胸牌设备',
      'SaaS管理后台完整功能',
      '6个智能体配置',
      'AI听记分析 · 基础报告',
      '话术库 · 销售画像',
      '自定义策略 · 数据导出',
      '设备远程管理 · OTA升级',
      '3000h/年/台录音时长',
      '硬件保修2年',
      '优先技术支持（7×12小时）',
      '2年免费软件更新'
    ]
  },
  {
    id: 'business', name: '旗舰版', desc: '适合大型企业全面部署',
    price: 49999, devices: 100, agents: 10, recording: '6000h', warranty: '3年',
    features: [
      '100台AI智能胸牌设备',
      'SaaS管理后台完整功能',
      '10个智能体配置',
      'AI听记分析 · 基础报告',
      '话术库 · 销售画像 · 自定义策略',
      'API接口 · 数据导出',
      '设备远程管理 · OTA升级',
      '6000h/年/台录音时长',
      '硬件保修3年',
      '专属技术支持（7×24小时）',
      '3年免费软件更新',
      '上门部署培训服务'
    ]
  },
  {
    id: 'enterprise', name: '定制版', desc: '量身定制，按需配置',
    price: 99999, devices: '200+', agents: '不限', recording: '不限', warranty: '5年',
    features: [
      '200台以上AI智能胸牌设备',
      'SaaS管理后台完整功能',
      '不限数量智能体配置',
      '全部AI分析功能',
      'API接口 · 私有化部署可选',
      '设备远程管理 · OTA升级',
      '不限录音时长',
      '硬件保修5年',
      '专属客户成功经理',
      '无限期软件更新',
      '定制化培训 · 上门部署',
      '数据迁移服务',
      'SLA 99.9%保障'
    ]
  }
])

function handleBuy(pkg) {
  selectedPkg.value = pkg
  buyForm.value = { qty: 1 }
  buyVisible.value = true
}

function confirmBuy() {
  ElMessage.success('购买成功！')
  buyVisible.value = false
}
</script>

<style scoped>
.package-page { padding: 24px; background: #f5f7fa; min-height: 100vh }
.page-header { text-align: center; margin-bottom: 32px }
.page-header h2 { font-size: 24px; color: #303133 }
.page-header p { color: #909399; font-size: 14px; margin-top: 4px }

.package-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 1300px; margin: 0 auto }
.pkg-card {
  background: #fff; border-radius: 12px; padding: 28px 20px;
  position: relative; box-shadow: 0 2px 12px rgba(0,0,0,.06); transition: transform .2s
}
.pkg-card:hover { transform: translateY(-4px) }
.pkg-card.featured { border: 2px solid #409EFF; box-shadow: 0 4px 20px rgba(64,158,255,.15) }
.pkg-badge {
  position: absolute; top: 16px; right: 16px; background: #409EFF; color: #fff;
  padding: 2px 12px; border-radius: 12px; font-size: 12px
}

.pkg-top { text-align: center }
.pkg-top h3 { font-size: 20px; color: #303133; margin-bottom: 4px }
.pkg-desc { font-size: 13px; color: #909399; margin-bottom: 16px }
.pkg-price { margin: 12px 0 4px }
.pkg-price .currency { font-size: 18px; color: #409EFF; vertical-align: top }
.pkg-price .amount { font-size: 36px; color: #409EFF; font-weight: 700 }
.pkg-price .unit { font-size: 14px; color: #909399 }

.pkg-highlight {
  display: flex; justify-content: space-around; padding: 12px 0;
  background: #f5f7fa; border-radius: 8px; margin-bottom: 16px
}
.hl-item { text-align: center }
.hl-val { display: block; font-size: 22px; font-weight: 700; color: #303133 }
.hl-lbl { display: block; font-size: 11px; color: #909399; margin-top: 2px }

.pkg-features { list-style: none; padding: 0 }
.pkg-features li { display: flex; align-items: flex-start; gap: 6px; padding: 5px 0; font-size: 13px; color: #606266; line-height: 1.4 }
.pkg-features li .el-icon { margin-top: 2px; flex-shrink: 0 }

.total { font-size: 22px; color: #409EFF; font-weight: 700 }
</style>
