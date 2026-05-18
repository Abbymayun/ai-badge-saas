<template>
  <div class="sales-report">
    <!-- 综合评分 -->
    <div class="score-hero" v-if="template.hasScore !== false">
      <div class="score-big">{{ data.totalScore }}</div>
      <div class="score-desc">销售能力综合评分<span class="score-max">（满分100）</span></div>
      <el-tag type="warning" size="small">🏆 优秀</el-tag>
    </div>

    <!-- 三大能力仪表盘 -->
    <el-row :gutter="16" class="gauges">
      <el-col :span="8" v-for="dim in data.dimensions" :key="dim.name">
        <div class="gauge-card" :style="{borderTopColor: dim.color}">
          <div class="gauge-name">{{ dim.name }}</div>
          <div class="gauge-score" :style="{color: dim.color}">{{ dim.score }}</div>
          <div class="gauge-weight">权重：{{ dim.weight }}%</div>
          <el-progress :percentage="dim.score" :color="dim.color" :stroke-width="6" :show-text="false" />
        </div>
      </el-col>
    </el-row>

    <!-- 维度得分明细 + 雷达图 -->
    <el-row :gutter="16" class="dimensions-section">
      <el-col :span="14">
        <div class="section-title">📊 维度得分明细</div>
        <el-table :data="flatDimensions" size="small" :show-header="true" stripe>
          <el-table-column prop="catName" label="一级维度" width="100">
            <template #default="{row}"><el-tag size="small" :color="row.color" effect="dark" style="border:none;">{{ row.catName }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="name" label="二级维度" />
          <el-table-column prop="weight" label="权重" width="80">
            <template #default="{row}">{{ row.weight }}%</template>
          </el-table-column>
          <el-table-column prop="score" label="得分" width="80">
            <template #default="{row}"><span style="font-weight:bold;color:#409EFF;">{{ row.score }}</span></template>
          </el-table-column>
          <el-table-column label="评价" width="160">
            <template #default="{row}">
              <el-progress :percentage="row.score" :color="row.score >= 90 ? '#67C23A' : row.score >= 80 ? '#409EFF' : '#E6A23C'" :stroke-width="4" :show-text="false" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10">
        <div class="section-title">🎯 能力雷达图</div>
        <div ref="radarRef" style="height:300px;"></div>
      </el-col>
    </el-row>

    <!-- 对话核心逻辑 -->
    <el-card shadow="never" class="logic-card">
      <template #header><span class="section-title">💡 对话核心逻辑梳理</span></template>
      <el-row :gutter="16">
        <el-col :span="12">
          <h4>🎯 客户目标</h4>
          <ul><li v-for="g in data.conversationLogic.goal" :key="g">{{ g }}</li></ul>
          <h4 style="margin-top:12px;">⚠️ 客户核心痛点</h4>
          <ul><li v-for="p in data.conversationLogic.painPoints" :key="p">{{ p }}</li></ul>
        </el-col>
        <el-col :span="12">
          <h4>🧭 销售逻辑</h4>
          <el-tag v-for="(step, i) in data.conversationLogic.logicFlow.split(' → ')" :key="i" size="small" style="margin:2px;">{{ step }}</el-tag>
          <h4 style="margin-top:12px;">📝 沟通结果</h4>
          <el-alert :title="data.conversationLogic.result" type="success" :closable="false" show-icon />
        </el-col>
      </el-row>
    </el-card>

    <!-- 核心得分亮点 -->
    <el-card shadow="never" class="highlights-card">
      <template #header><span class="section-title">⭐ 核心得分亮点</span></template>
      <el-row :gutter="16">
        <el-col :span="12" v-for="(h, idx) in data.highlights" :key="idx">
          <el-alert :title="'优势' + (idx+1)" :description="h" type="success" :closable="false" show-icon style="margin-bottom:8px;" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 可提升点 -->
    <el-card shadow="never" class="improvements-card">
      <template #header><span class="section-title">📈 可提升点</span></template>
      <div v-for="(imp, idx) in data.improvements" :key="idx" class="imp-item">
        <el-icon style="color:#E6A23C;"><WarningFilled /></el-icon>
        <span>{{ imp }}</span>
      </div>
    </el-card>

    <!-- 综合总结 -->
    <el-card shadow="never" class="overall-card">
      <template #header><span class="section-title">📝 销售分析综合总结</span></template>
      <el-alert :title="data.overall" type="info" :closable="false" show-icon />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: { type: Object, required: true },
  template: { type: Object, default: () => ({}) }
})

const radarRef = ref(null)

const flatDimensions = computed(() => {
  const result = []
  props.data.dimensions.forEach(dim => {
    (dim.subDimensions || []).forEach(sub => {
      result.push({ catName: dim.name, color: dim.color, ...sub })
    })
  })
  return result
})

onMounted(() => {
  nextTick(() => {
    if (!radarRef.value) return
    const chart = echarts.init(radarRef.value)
    const allSubs = flatDimensions.value
    chart.setOption({
      radar: {
        indicator: allSubs.map(s => ({ name: s.name, max: 100 })),
        center: ['50%', '50%'],
        radius: '70%'
      },
      series: [{
        type: 'radar',
        data: [{ value: allSubs.map(s => s.score), name: '本次评分', areaStyle: { color: 'rgba(64,158,255,0.2)' }, lineStyle: { color: '#409EFF' }, itemStyle: { color: '#409EFF' } }]
      }]
    })
  })
})
</script>

<style scoped>
.sales-report { }
.score-hero { text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea0d, #764ba20d); border-radius: 12px; margin-bottom: 16px; }
.score-big { font-size: 56px; font-weight: bold; color: #409EFF; line-height: 1; }
.score-desc { font-size: 14px; color: #606266; margin: 8px 0; }
.score-max { font-size: 12px; color: #c0c4cc; }

.gauges { margin-bottom: 16px; }
.gauge-card { text-align: center; padding: 16px; background: #fff; border-radius: 12px; border-top: 3px solid; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.gauge-name { font-size: 14px; font-weight: bold; color: #303133; margin-bottom: 8px; }
.gauge-score { font-size: 36px; font-weight: bold; }
.gauge-weight { font-size: 12px; color: #909399; margin: 4px 0 8px; }

.dimensions-section { margin-bottom: 16px; }
.section-title { font-size: 14px; font-weight: bold; color: #303133; }

.logic-card, .highlights-card, .improvements-card, .overall-card { margin-bottom: 12px; }
.logic-card h4 { font-size: 13px; color: #303133; margin: 0 0 6px 0; }
.logic-card ul { margin: 0; padding-left: 18px; }
.logic-card li { font-size: 13px; color: #606266; line-height: 1.8; }

.imp-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; font-size: 13px; color: #606266; }
</style>
