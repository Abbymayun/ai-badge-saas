<template>
  <div class="customer-report">
    <!-- 客户画像 -->
    <el-card shadow="never" class="profile-card">
      <template #header><span class="section-title">👤 客户画像</span></template>
      <el-row :gutter="16">
        <el-col :span="16">
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="姓名">{{ data.profile.name }}</el-descriptions-item>
            <el-descriptions-item label="职位">{{ data.profile.position }}</el-descriptions-item>
            <el-descriptions-item label="行业">{{ data.profile.industry }}</el-descriptions-item>
            <el-descriptions-item label="预估年龄">{{ data.profile.estimatedAge }}</el-descriptions-item>
            <el-descriptions-item label="决策角色">
              <el-tag type="danger" size="small">{{ data.profile.decisionRole }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="资产等级">
              <span style="font-weight:bold;color:#E6A23C;">{{ data.assetLevel.level }}</span>
              <span style="font-size:12px;color:#909399;">（可信度：{{ data.assetLevel.confidence }}）</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="8">
          <div class="traits-box">
            <h4>性格特征</h4>
            <el-tag v-for="t in data.profile.traits" :key="t" size="small" style="margin:2px;">{{ t }}</el-tag>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 需求分析 -->
    <el-card shadow="never" class="needs-card">
      <template #header><span class="section-title">💡 需求分析</span></template>
      <el-row :gutter="16">
        <el-col :span="12">
          <h4>📋 已识别需求</h4>
          <div v-for="n in data.needAnalysis.explicit" :key="n.need" class="need-item">
            <el-tag :type="n.urgency === '高' ? 'danger' : 'warning'" size="small">{{ n.urgency }}优先</el-tag>
            <span style="margin-left:6px;">{{ n.need }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <h4>🔍 潜在需求（AI推断）</h4>
          <div v-for="n in data.needAnalysis.implicit" :key="n.need" class="need-item">
            <span>{{ n.need }}</span>
            <el-progress :percentage="n.confidence" :stroke-width="3" style="width:80px;margin-left:8px;" :color="n.confidence >= 80 ? '#67C23A' : '#E6A23C'" />
            <span style="font-size:11px;color:#909399;">{{ n.confidence }}%可信</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 意向评估 -->
    <el-row :gutter="16" class="intent-row">
      <el-col :span="8">
        <el-card shadow="never" class="intent-card">
          <h4>🎯 意向等级</h4>
          <div class="intent-big" style="color:#67C23A;">{{ data.intentLevel.level }}</div>
          <el-progress :percentage="data.intentLevel.score" :color="'#67C23A'" :stroke-width="8" />
          <div class="intent-signal">{{ data.intentLevel.signal }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <h4>🏢 竞品信息</h4>
          <div v-for="c in data.competitorInfo" :key="c" class="info-line">{{ c }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <h4>💰 预算预估</h4>
          <div class="budget-big">{{ data.budgetRange }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 决策链 + 下一步 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="section-title">🔗 决策链</span></template>
          <el-timeline>
            <el-timeline-item v-for="(step, idx) in data.decisionChain" :key="idx" :timestamp="'第' + (idx+1) + '步'" placement="top">
              {{ step }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="section-title">📝 下一步行动建议</span></template>
          <el-steps direction="vertical" :active="data.nextSteps.length">
            <el-step v-for="(step, idx) in data.nextSteps" :key="idx" :title="step" />
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
  template: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
.customer-report { }
.section-title { font-size: 14px; font-weight: bold; color: #303133; }
.profile-card, .needs-card { margin-bottom: 12px; }
.traits-box { padding: 12px; background: #f5f7fa; border-radius: 8px; }
.traits-box h4 { margin: 0 0 8px 0; font-size: 13px; color: #303133; }
.needs-card h4 { font-size: 13px; margin: 0 0 8px 0; color: #303133; }
.need-item { display: flex; align-items: center; padding: 4px 0; font-size: 13px; color: #606266; }
.intent-row { margin-bottom: 12px; }
.intent-card { }
.intent-big { font-size: 32px; font-weight: bold; margin: 8px 0; }
.intent-signal { font-size: 12px; color: #909399; margin-top: 6px; }
.budget-big { font-size: 18px; font-weight: bold; color: #409EFF; margin: 12px 0; }
.info-line { font-size: 13px; color: #606266; padding: 3px 0; }
h4 { font-size: 13px; color: #303133; margin: 0 0 8px 0; }
</style>
