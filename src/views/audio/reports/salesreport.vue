<template>
  <div class="sales-report-enhanced">
    <!-- 顶部渐变评分Hero -->
    <div class="score-hero-enhanced">
      <div class="hero-bg-shape"></div>
      <el-row :gutter="24" align="middle">
        <el-col :span="8" class="hero-score-col">
          <div class="hero-score-ring">
            <svg viewBox="0 0 120 120" class="score-ring">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e4e7ed" stroke-width="6"/>
              <circle cx="60" cy="60" r="52" fill="none" :stroke="scoreColor" stroke-width="6"
                :stroke-dasharray="2 * Math.PI * 52" :stroke-dashoffset="2 * Math.PI * 52 * (1 - data.totalScore / 100)"
                stroke-linecap="round" transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 1s ease;"/>
            </svg>
            <div class="ring-center">
              <span class="ring-score">{{ data.totalScore }}</span>
              <span class="ring-max">/100</span>
            </div>
          </div>
          <div class="hero-level">
            <el-tag :type="data.totalScore >= 90 ? 'danger' : data.totalScore >= 80 ? 'warning' : ''" size="small" effect="dark" round>
              {{ data.totalScore >= 95 ? '🏆 卓越' : data.totalScore >= 90 ? '🏆 优秀' : data.totalScore >= 80 ? '⭐ 良好' : '📋 一般' }}
            </el-tag>
          </div>
        </el-col>
        <el-col :span="16">
          <h3 class="hero-title">销售能力综合评分</h3>
          <p class="hero-subtitle">满分100分 · 基于{{ data.dimensions?.length || 3 }}个核心维度 · {{ flatDimensions.length }}项细分指标</p>
        </el-col>
      </el-row>
    </div>

    <!-- 三大能力仪表盘 - 横向进度环 -->
    <el-row :gutter="16" class="gauges-enhanced" v-if="data.dimensions?.length">
      <el-col :span="8" v-for="dim in data.dimensions" :key="dim.name">
        <div class="gauge-card-enhanced" :style="{ '--gauge-color': dim.color }">
          <div class="gauge-header">
            <span class="gauge-icon">{{ ['🎯','📋','🚀'][data.dimensions.indexOf(dim)] || '📊' }}</span>
            <span class="gauge-name">{{ dim.name }}</span>
          </div>
          <div class="gauge-body">
            <div class="gauge-big-score" :style="{color: dim.color}">{{ dim.score }}</div>
            <div class="gauge-meta">
              <span>权重 {{ dim.weight }}%</span>
              <el-progress :percentage="dim.score" :color="dim.color" :stroke-width="5" :show-text="false" style="width:60%;" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 维度得分明细 + 雷达图 -->
    <el-row :gutter="16" class="dimensions-enhanced">
      <el-col :span="14">
        <el-card shadow="never" class="inner-card">
          <template #header><div class="card-header-title">📊 维度得分明细</div></template>
          <div v-for="dim in data.dimensions" :key="dim.name" class="dim-group">
            <div class="dim-cat-header">
              <el-tag :color="dim.color" effect="dark" size="small" style="border:none;">{{ dim.name }}</el-tag>
              <span class="dim-cat-score" :style="{color: dim.color}">{{ dim.score }}分</span>
              <span class="dim-cat-weight">权重{{ dim.weight }}%</span>
            </div>
            <div v-for="sub in (dim.subDimensions || [])" :key="sub.name" class="dim-sub-row">
              <span class="dim-sub-name">{{ sub.name }}</span>
              <div class="dim-sub-bar">
                <div class="dim-sub-fill" :style="{width: sub.score + '%', background: dim.color}"></div>
              </div>
              <span class="dim-sub-score">{{ sub.score }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" class="inner-card">
          <template #header><div class="card-header-title">🎯 能力雷达图</div></template>
          <div ref="radarRef" style="height:340px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 对话核心逻辑梳理 -->
    <el-card shadow="never" class="logic-card-enhanced">
      <template #header><div class="card-header-title">💡 对话核心逻辑梳理</div></template>
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="logic-block">
            <div class="logic-block-title">🎯 客户目标</div>
            <el-tag v-for="g in data.conversationLogic.goal" :key="g" size="small" effect="plain" round style="margin:3px;">{{ g }}</el-tag>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="logic-block">
            <div class="logic-block-title">⚠️ 核心痛点</div>
            <el-tag v-for="p in data.conversationLogic.painPoints" :key="p" size="small" type="danger" effect="plain" round style="margin:3px;">{{ p }}</el-tag>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="logic-block">
            <div class="logic-block-title">🧭 销售逻辑</div>
            <div class="logic-flow">
              <el-tag v-for="(step, i) in data.conversationLogic.logicFlow.split(' → ')" :key="i" size="small" effect="plain" style="margin:2px;">{{ step }}</el-tag>
            </div>
            <div class="logic-result">
              <el-icon style="color:#67C23A;"><CircleCheckFilled /></el-icon>
              <span>{{ data.conversationLogic.result }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 亮点 + 改进 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never" class="inner-card highlights-card">
          <template #header><div class="card-header-title">⭐ 核心得分亮点</div></template>
          <div v-for="(h, idx) in data.highlights" :key="idx" class="highlight-row">
            <span class="hl-badge">{{ idx + 1 }}</span>
            <span>{{ h }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="inner-card improvements-card">
          <template #header><div class="card-header-title">📈 可提升点</div></template>
          <div v-for="(imp, idx) in data.improvements" :key="idx" class="imp-row">
            <el-icon style="color:#E6A23C;flex-shrink:0;"><WarningFilled /></el-icon>
            <span>{{ imp }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 综合总结 -->
    <el-card shadow="never" class="overall-card-enhanced">
      <template #header><div class="card-header-title">📝 销售分析综合总结</div></template>
      <div class="overall-content">
        <el-icon :size="20" style="color:#409EFF;flex-shrink:0;margin-top:2px;"><ChatDotRound /></el-icon>
        <p>{{ data.overall }}</p>
      </div>
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

const scoreColor = computed(() => {
  const s = props.data.totalScore
  if (s >= 90) return '#67C23A'
  if (s >= 80) return '#409EFF'
  if (s >= 70) return '#E6A23C'
  return '#F56C6C'
})

const flatDimensions = computed(() => {
  const result = []
  ;(props.data.dimensions || []).forEach(dim => {
    (dim.subDimensions || []).forEach(sub => result.push({ ...sub, catColor: dim.color }))
  })
  return result
})

onMounted(() => {
  nextTick(() => {
    if (!radarRef.value) return
    const chart = echarts.init(radarRef.value)
    const allSubs = flatDimensions.value
    if (!allSubs.length) return
    chart.setOption({
      radar: {
        indicator: allSubs.map(s => ({ name: s.name, max: 100 })),
        center: ['50%', '52%'], radius: '68%',
        axisName: { color: '#606266', fontSize: 11 }
      },
      series: [{
        type: 'radar',
        data: [{
          value: allSubs.map(s => s.score), name: '本次评分',
          areaStyle: { color: 'rgba(64,158,255,0.2)' },
          lineStyle: { color: '#409EFF', width: 2 },
          itemStyle: { color: '#409EFF' }
        }]
      }]
    })
  })
})
</script>

<style scoped>
.sales-report-enhanced { }

.score-hero-enhanced { position: relative; overflow: hidden; padding: 28px; background: linear-gradient(135deg, #f0f5ff 0%, #e8f4fd 50%, #f0f9ff 100%); border-radius: 16px; margin-bottom: 20px; }
.hero-bg-shape { position: absolute; right: -40px; top: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(64,158,255,0.08) 0%, transparent 70%); border-radius: 50%; }
.hero-score-col { text-align: center; position: relative; }
.score-ring { width: 110px; height: 110px; }
.ring-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
.ring-score { font-size: 32px; font-weight: bold; color: #303133; line-height: 1; }
.ring-max { font-size: 12px; color: #c0c4cc; display: block; }
.hero-level { margin-top: 6px; }
.hero-title { margin: 0 0 6px; font-size: 20px; color: #303133; }
.hero-subtitle { margin: 0; font-size: 13px; color: #909399; }

.gauges-enhanced { margin-bottom: 20px; }
.gauge-card-enhanced { background: #fff; border-radius: 14px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); border-top: 3px solid var(--gauge-color); transition: transform .2s; }
.gauge-card-enhanced:hover { transform: translateY(-2px); }
.gauge-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.gauge-icon { font-size: 22px; }
.gauge-name { font-size: 14px; font-weight: bold; color: #303133; }
.gauge-big-score { font-size: 38px; font-weight: bold; }
.gauge-meta { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #909399; margin-top: 6px; }

.dimensions-enhanced { margin-bottom: 16px; }
.inner-card { border-radius: 12px; }
.card-header-title { font-size: 15px; font-weight: bold; color: #303133; }

.dim-group { margin-bottom: 14px; }
.dim-cat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.dim-cat-score { font-size: 16px; font-weight: bold; }
.dim-cat-weight { font-size: 12px; color: #c0c4cc; margin-left: auto; }
.dim-sub-row { display: flex; align-items: center; gap: 10px; padding: 3px 0; font-size: 13px; }
.dim-sub-name { width: 120px; flex-shrink: 0; color: #606266; }
.dim-sub-bar { flex: 1; height: 6px; background: #f0f2f5; border-radius: 3px; overflow: hidden; }
.dim-sub-fill { height: 6px; border-radius: 3px; transition: width 1s ease; }
.dim-sub-score { width: 36px; text-align: right; font-weight: bold; color: #409EFF; font-size: 12px; }

.logic-card-enhanced { margin-bottom: 16px; border-radius: 12px; }
.logic-block { background: #fafbfc; border-radius: 10px; padding: 14px; min-height: 120px; }
.logic-block-title { font-size: 13px; font-weight: bold; color: #303133; margin-bottom: 8px; }
.logic-flow { margin: 8px 0; }
.logic-result { display: flex; align-items: flex-start; gap: 6px; font-size: 12px; color: #67C23A; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e4e7ed; }

.highlights-card { border-radius: 12px; }
.highlight-row { display: flex; align-items: flex-start; gap: 10px; padding: 7px 0; font-size: 13px; color: #303133; line-height: 1.6; }
.hl-badge { width: 20px; height: 20px; border-radius: 50%; background: #ecf5ff; color: #409EFF; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.improvements-card { border-radius: 12px; }
.imp-row { display: flex; align-items: flex-start; gap: 8px; padding: 7px 0; font-size: 13px; color: #606266; line-height: 1.6; }

.overall-card-enhanced { border-radius: 12px; background: #fafbfc; }
.overall-content { display: flex; align-items: flex-start; gap: 12px; }
.overall-content p { margin: 0; font-size: 14px; color: #303133; line-height: 1.8; }
</style>
