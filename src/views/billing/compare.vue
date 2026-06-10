<template>
  <div class="compare-page">
    <div class="page-header">
      <h2>📊 方案对比 · 怎么买最划算</h2>
      <p>定价方案 vs 按套餐定价，帮您做出最优选择</p>
    </div>

    <!-- 核心对比 -->
    <el-card class="section-card" shadow="hover">
      <template #header><span style="font-weight:600;font-size:16px">💰 价格对比（以10台设备为例）</span></template>
      <el-table :data="priceCompare" border stripe>
        <el-table-column prop="plan" label="方案" width="140" />
        <el-table-column prop="model" label="定价模式" width="100" />
        <el-table-column prop="yearly" label="年费" width="120" align="right">
          <template #default="{row}">¥{{ row.yearly?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="perDevice" label="每台/年" width="120" align="right">
          <template #default="{row}">¥{{ row.perDevice?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="perDay" label="每台/天" width="120" align="right">
          <template #default="{row}">¥{{ row.perDay }}</template>
        </el-table-column>
        <el-table-column prop="devices" label="含设备数" width="100" align="center" />
        <el-table-column prop="includes" label="包含内容" min-width="280" />
      </el-table>
    </el-card>

    <!-- 不同数量段的推荐 -->
    <el-card class="section-card" shadow="hover">
      <template #header><span style="font-weight:600;font-size:16px">🎯 按设备数量推荐方案</span></template>
      <el-table :data="recommendations" border stripe>
        <el-table-column prop="range" label="设备数量" width="140" />
        <el-table-column prop="bestPlan" label="推荐方案" width="160">
          <template #default="{row}">
            <el-tag :type="row.bestType">{{ row.bestPlan }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="yearlyCost" label="年费" width="140" align="right">
          <template #default="{row}">¥{{ row.yearlyCost?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="perDevice" label="每台/年" width="140" align="right">
          <template #default="{row}">¥{{ row.perDevice?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="perDay" label="每台/天" width="140" align="right">
          <template #default="{row}">¥{{ row.perDay }}</template>
        </el-table-column>
        <el-table-column prop="reason" label="推荐理由" min-width="220" />
      </el-table>
    </el-card>

    <!-- 性价比曲线 -->
    <el-card class="section-card" shadow="hover">
      <template #header><span style="font-weight:600;font-size:16px">📈 每台每天成本对比</span></template>
      <el-table :data="dailyCost" border stripe>
        <el-table-column prop="devices" label="设备数" width="100" align="center" />
        <el-table-column label="按年订阅" align="center">
          <el-table-column label="标准版(¥499/年)" width="140" align="right">
            <template #default="{row}">¥{{ (499/365).toFixed(2) }}/天</template>
          </el-table-column>
          <el-table-column label="高级版(¥799/年)" width="140" align="right">
            <template #default="{row}">¥{{ (799/365).toFixed(2) }}/天</template>
          </el-table-column>
          <el-table-column label="专业版(¥1099/年)" width="140" align="right">
            <template #default="{row}">¥{{ (1099/365).toFixed(2) }}/天</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="按套餐" align="center">
          <el-table-column label="标准版(¥9,999)" width="140" align="right">
            <template #default="{row}">¥{{ row.basicPerDay }}</template>
          </el-table-column>
          <el-table-column label="专业版(¥24,999)" width="140" align="right">
            <template #default="{row}">¥{{ row.proPerDay }}</template>
          </el-table-column>
          <el-table-column label="旗舰版(¥49,999)" width="140" align="right">
            <template #default="{row}">¥{{ row.bizPerDay }}</template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 总结 -->
    <el-card class="section-card" style="background:#f0f9eb" shadow="hover">
      <template #header><span style="font-weight:600;font-size:16px;color:#67C23A">✅ 购买建议</span></template>
      <div class="advice-list">
        <div class="advice-item">
          <span class="advice-icon">1-10台</span>
          <div>
            <strong>按年订阅更划算。</strong>
            无需一次性大额投入，¥499-1099/年/台，日均仅 ¥1.37-3.01。
          </div>
        </div>
        <div class="advice-item">
          <span class="advice-icon">10-20台</span>
          <div>
            <strong>推荐套餐·标准版(¥9,999/20台)。</strong>
            含硬件设备，每台日均仅 ¥1.37，且保修1年。
          </div>
        </div>
        <div class="advice-item">
          <span class="advice-icon">20-50台</span>
          <div>
            <strong>推荐套餐·专业版(¥24,999/50台)。</strong>
            每台日均 ¥1.37+智能体+话术库，性价比最优区间。
          </div>
        </div>
        <div class="advice-item">
          <span class="advice-icon">50-100台</span>
          <div>
            <strong>推荐套餐·旗舰版(¥49,999/100台)。</strong>
            每台日均仅 ¥1.37，享API+专属客服+上门部署。
          </div>
        </div>
        <div class="advice-item">
          <span class="advice-icon">100台以上</span>
          <div>
            <strong>推荐定制版。</strong>
            不限智能体+录音时长，5年保修，专属客户成功经理。
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const priceCompare = ref([
  { plan: '标准版', model: '按年订阅', yearly: 4990, perDevice: 499, perDay: '1.37', devices: '-', includes: 'SaaS后台 + 3个智能体 + 基础报告' },
  { plan: '高级版', model: '按年订阅', yearly: 7990, perDevice: 799, perDay: '2.19', devices: '-', includes: 'SaaS后台 + 3个智能体 + 话术库 + 销售画像' },
  { plan: '专业版', model: '按年订阅', yearly: 10990, perDevice: 1099, perDay: '3.01', devices: '-', includes: 'SaaS后台 + 6个智能体 + 全部功能 + API' },
  { plan: '标准版', model: '套餐', yearly: 9999, perDevice: 500, perDay: '1.37', devices: '20台', includes: '含20台设备 + SaaS后台 + 3个智能体 + 保修1年' },
  { plan: '专业版', model: '套餐', yearly: 24999, perDevice: 500, perDay: '1.37', devices: '50台', includes: '含50台设备 + SaaS后台 + 6个智能体 + 话术库 + 保修2年' },
  { plan: '旗舰版', model: '套餐', yearly: 49999, perDevice: 500, perDay: '1.37', devices: '100台', includes: '含100台设备 + SaaS后台 + 10个智能体 + API + 保修3年' },
])

const recommendations = ref([
  { range: '1-9台', bestPlan: '按年订阅·标准版', bestType: 'success', yearlyCost: 4491, perDevice: 499, perDay: '1.37', reason: '套餐起售20台，少量设备选订阅更灵活' },
  { range: '10-19台', bestPlan: '套餐·标准版', bestType: 'warning', yearlyCost: 9999, perDevice: 667, perDay: '1.37-2.74', reason: '套餐含20台设备，多余设备可备用或扩展' },
  { range: '20-29台', bestPlan: '套餐·标准版', bestType: '', yearlyCost: 9999, perDevice: 500, perDay: '1.37', reason: '每台日均仅¥1.37，比订阅省¥0' },
  { range: '30-49台', bestPlan: '套餐·专业版', bestType: 'warning', yearlyCost: 24999, perDevice: 500, perDay: '1.37', reason: '50台套餐价比按年订30台还便宜，多出设备可扩展' },
  { range: '50-99台', bestPlan: '套餐·专业版', bestType: '', yearlyCost: 24999, perDevice: 500, perDay: '1.37', reason: '每台日均¥1.37+6智能体+话术库，含硬件保修2年' },
  { range: '100台以上', bestPlan: '套餐·旗舰版', bestType: 'danger', yearlyCost: 49999, perDevice: 500, perDay: '1.37', reason: 'API接口+专属客服+上门部署，企业级首选' },
])

const dailyCost = ref([
  { devices: '10台', basicPerDay: '1.37', proPerDay: '1.37', bizPerDay: '-' },
  { devices: '20台', basicPerDay: '1.37', proPerDay: '1.37', bizPerDay: '-' },
  { devices: '30台', basicPerDay: '1.37', proPerDay: '1.37', bizPerDay: '-' },
  { devices: '50台', basicPerDay: '—', proPerDay: '1.37', bizPerDay: '-' },
  { devices: '80台', basicPerDay: '—', proPerDay: '1.37', bizPerDay: '-' },
  { devices: '100台', basicPerDay: '—', proPerDay: '—', bizPerDay: '1.37' },
  { devices: '120台', basicPerDay: '—', proPerDay: '—', bizPerDay: '1.37' },
])
</script>

<style scoped>
.compare-page { padding: 24px; background: #f5f7fa; min-height: 100vh }
.page-header { text-align: center; margin-bottom: 24px }
.page-header h2 { font-size: 24px; color: #303133 }
.page-header p { color: #909399; font-size: 14px; margin-top: 4px }
.section-card { max-width: 1200px; margin: 0 auto 16px }
.advice-list { display: flex; flex-direction: column; gap: 12px }
.advice-item { display: flex; gap: 12px; align-items: flex-start }
.advice-icon { 
  background: #67C23A; color: #fff; padding: 2px 10px; border-radius: 12px;
  font-size: 12px; font-weight: 600; white-space: nowrap; flex-shrink: 0
}
.advice-item div { font-size: 14px; color: #333; line-height: 1.6 }
</style>
