<template>
  <div class="comprehensive-report">
    <!-- 综合评分头部 -->
    <div class="comp-hero">
      <el-row :gutter="16" align="middle">
        <el-col :span="10">
          <div class="comp-total">
            <div class="comp-big-score">{{ data.totalScore }}</div>
            <div class="comp-label">综合评分<span class="comp-max">/100</span></div>
            <el-tag type="success" size="small">🏆 优秀</el-tag>
          </div>
        </el-col>
        <el-col :span="14">
          <el-row :gutter="12">
            <el-col :span="6" v-for="item in data.scoreBreakdown" :key="item.label">
              <div class="mini-score">
                <div class="ms-val">{{ item.score }}</div>
                <div class="ms-label">{{ item.label }}</div>
                <el-progress :percentage="item.score" :color="item.score >= 90 ? '#67C23A' : item.score >= 80 ? '#409EFF' : '#E6A23C'" :stroke-width="4" :show-text="false" />
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- 多维度雷达图 -->
    <el-card shadow="never" class="radar-section">
      <template #header><span class="section-title">🎯 多维度能力分布</span></template>
      <div ref="compRadarRef" style="height:320px;"></div>
    </el-card>

    <!-- 综合结论 -->
    <el-card shadow="never" class="conclusion-card">
      <template #header><span class="section-title">📝 综合评估结论</span></template>
      <el-alert :title="data.conclusion" type="info" :closable="false" show-icon style="font-size:14px;line-height:1.8;" />
    </el-card>

    <!-- 推进时间线 -->
    <el-card shadow="never">
      <template #header><span class="section-title">📅 建议推进计划</span></template>
      <el-timeline>
        <el-timeline-item v-for="(t, idx) in data.timeline" :key="idx" :timestamp="t.step" placement="top" :color="idx === 0 ? '#409EFF' : idx === data.timeline.length - 1 ? '#67C23A' : '#E6A23C'">
          <el-card shadow="never" size="small">
            {{ t.action }}
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: { type: Object, required: true },
  template: { type: Object, default: () => ({}) }
})

const compRadarRef = ref(null)

onMounted(() => {
  nextTick(() => {
    if (!compRadarRef.value) return
    const chart = echarts.init(compRadarRef.value)
    chart.setOption({
      radar: {
        indicator: props.data.radarData.map(d => ({ name: d.name, max: 100 })),
        center: ['50%', '55%'],
        radius: '65%'
      },
      series: [{
        type: 'radar',
        data: [
          { value: props.data.radarData.map(d => d.value), name: '本次评分', areaStyle: { color: 'rgba(64,158,255,0.15)' }, lineStyle: { color: '#409EFF', width: 2 }, itemStyle: { color: '#409EFF' } },
          { value: [85, 80, 82, 75, 88, 82], name: '团队平均', areaStyle: { color: 'rgba(144,147,153,0.08)' }, lineStyle: { color: '#c0c4cc', width: 1, type: 'dashed' }, itemStyle: { color: '#c0c4cc' } }
        ]
      }],
      legend: { data: ['本次评分', '团队平均'], bottom: 0 }
    })
  })
})
</script>

<style scoped>
.comprehensive-report { }
.comp-hero { padding: 24px; background: linear-gradient(135deg, #f0f5ff, #f6ffed); border-radius: 12px; margin-bottom: 16px; }
.comp-total { text-align: center; }
.comp-big-score { font-size: 56px; font-weight: bold; background: linear-gradient(135deg, #409EFF, #67C23A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.comp-label { font-size: 14px; color: #606266; margin: 4px 0 8px; }
.comp-max { font-size: 12px; color: #c0c4cc; }

.mini-score { text-align: center; }
.ms-val { font-size: 22px; font-weight: bold; color: #409EFF; }
.ms-label { font-size: 11px; color: #909399; margin: 2px 0 4px; }

.radar-section, .conclusion-card { margin-bottom: 12px; }
.section-title { font-size: 14px; font-weight: bold; color: #303133; }
</style>
