<template>
  <div class="compare-page">
    <div class="page-header">
      <h2>📊 方案对比 · 怎么买最划算</h2>
      <p>定价方案 vs 按套餐定价</p>
    </div>

    <el-card shadow="hover" style="max-width:1200px;margin:0 auto 16px">
      <template #header><b>💰 价格对比（10台设备为例）</b></template>
      <el-table :data="priceData" border stripe size="small">
        <el-table-column prop="plan" label="方案" width="100" />
        <el-table-column prop="model" label="模式" width="90" />
        <el-table-column prop="yearly" label="年费" width="110" />
        <el-table-column prop="perDevice" label="每台/年" width="100" />
        <el-table-column prop="perDay" label="每台/天" width="100" />
        <el-table-column prop="devices" label="含设备" width="80" />
        <el-table-column prop="includes" label="包含内容" min-width="280" />
      </el-table>
    </el-card>

    <el-card shadow="hover" style="max-width:1200px;margin:0 auto 16px">
      <template #header><b>🎯 按设备数量推荐</b></template>
      <el-table :data="recData" border stripe size="small">
        <el-table-column prop="range" label="设备数量" width="100" />
        <el-table-column prop="plan" label="推荐方案" width="160" />
        <el-table-column prop="yearly" label="年费" width="110" />
        <el-table-column prop="perDevice" label="每台/年" width="100" />
        <el-table-column prop="perDay" label="每台/天" width="100" />
        <el-table-column prop="reason" label="推荐理由" min-width="250" />
      </el-table>
    </el-card>

    <el-card shadow="hover" style="max-width:1200px;margin:0 auto 16px;background:#f0f9eb">
      <template #header><b style="color:#67C23A">✅ 购买建议</b></template>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:14px;line-height:1.6">
        <div>🟢 <b>1-10台</b>：按年订阅更划算，¥499-1099/年/台，日均 ¥1.37-3.01</div>
        <div>🟡 <b>10-20台</b>：套餐·标准版 ¥9,999/20台，含硬件+保修1年，日均 ¥1.37</div>
        <div>🟡 <b>20-50台</b>：套餐·专业版 ¥24,999/50台，+话术库+销售画像，日均 ¥1.37</div>
        <div>🔵 <b>50-100台</b>：套餐·旗舰版 ¥49,999/100台，+API+专属客服，日均 ¥1.37</div>
        <div>🔴 <b>100台以上</b>：定制版，不限功能+5年保修+专属经理</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const priceData = [
  { plan: '标准版', model: '订阅', yearly: '¥4,990', perDevice: '¥499', perDay: '¥1.37', devices: '-', includes: 'SaaS后台 + 3个智能体 + 基础报告' },
  { plan: '高级版', model: '订阅', yearly: '¥7,990', perDevice: '¥799', perDay: '¥2.19', devices: '-', includes: 'SaaS后台 + 3个智能体 + 话术库 + 销售画像' },
  { plan: '专业版', model: '订阅', yearly: '¥10,990', perDevice: '¥1,099', perDay: '¥3.01', devices: '-', includes: 'SaaS后台 + 6个智能体 + 全部功能 + API' },
  { plan: '标准版', model: '套餐', yearly: '¥9,999', perDevice: '¥500', perDay: '¥1.37', devices: '20台', includes: '含20台设备 + SaaS后台 + 3个智能体 + 保修1年' },
  { plan: '专业版', model: '套餐', yearly: '¥24,999', perDevice: '¥500', perDay: '¥1.37', devices: '50台', includes: '含50台设备 + 6个智能体 + 话术库 + 保修2年' },
  { plan: '旗舰版', model: '套餐', yearly: '¥49,999', perDevice: '¥500', perDay: '¥1.37', devices: '100台', includes: '含100台设备 + 10个智能体 + API + 保修3年' },
]

const recData = [
  { range: '1-9台', plan: '按年订阅·标准版', yearly: '¥499~4,491', perDevice: '¥499', perDay: '¥1.37', reason: '套餐起售20台，少量设备选订阅更灵活' },
  { range: '10-19台', plan: '套餐·标准版', yearly: '¥9,999', perDevice: '¥500~667', perDay: '¥1.37~1.83', reason: '20台套餐价比订阅15台还便宜，多的设备备用' },
  { range: '20-29台', plan: '套餐·标准版', yearly: '¥9,999', perDevice: '¥500', perDay: '¥1.37', reason: '每台日均仅¥1.37，含硬件+保修' },
  { range: '30-49台', plan: '套餐·专业版', yearly: '¥24,999', perDevice: '¥500~833', perDay: '¥1.37~2.28', reason: '50台套餐比订阅30台还多20台设备' },
  { range: '50-99台', plan: '套餐·专业版', yearly: '¥24,999', perDevice: '¥500', perDay: '¥1.37', reason: '含硬件+6智能体+话术库+保修2年' },
  { range: '100台+', plan: '套餐·旗舰版', yearly: '¥49,999', perDevice: '¥500', perDay: '¥1.37', reason: 'API+专属客服+上门部署+保修3年' },
]
</script>

<style scoped>
.compare-page { padding: 24px; background: #f5f7fa; min-height: 100vh }
.page-header { text-align: center; margin-bottom: 24px }
.page-header h2 { font-size: 24px; color: #303133 }
.page-header p { color: #909399; font-size: 14px; margin-top: 4px }
</style>
