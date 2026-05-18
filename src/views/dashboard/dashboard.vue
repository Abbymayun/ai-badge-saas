<template>
  <div class="dashboard">
    <div class="page-title">数据概览</div>
    <div style="margin-bottom:12px;">
      <el-radio-group v-model="timeRange" size="small">
        <el-radio-button label="today">今日</el-radio-button>
        <el-radio-button label="week">近7天</el-radio-button>
        <el-radio-button label="month">近30天</el-radio-button>
        <el-radio-button label="custom">自定义</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 核心指标 -->
    <el-row :gutter="16" class="stat-cards">
      <el-col :span="3" v-for="item in stats" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value" :style="{color: item.color}">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-trend" :class="item.trend > 0 ? 'up' : 'down'">
            {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16" style="margin-top:16px;">
      <el-col :span="8">
        <el-card shadow="hover"><template #header><span>客户数据趋势</span></template><div ref="trendChartRef" style="height:300px;"></div></el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover"><template #header><span>AI评分均分走势</span></template><div ref="scoreChartRef" style="height:300px;"></div></el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover"><template #header><span>团队销售能力雷达图</span></template><div ref="radarChartRef" style="height:300px;"></div></el-card>
      </el-col>
    </el-row>

    <!-- 设备数据 + 排行榜 -->
    <el-row :gutter="16" style="margin-top:16px;">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>设备数据</span></template>
          <el-row :gutter="12">
            <el-col :span="12" v-for="d in deviceStats" :key="d.label">
              <div class="device-stat"><div class="ds-value">{{ d.value }}</div><div class="ds-label">{{ d.label }}</div></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span>全国销售能力评分榜</span></template>
          <el-table :data="rankingData" size="small" stripe>
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="dept" label="部门" />
            <el-table-column prop="score" label="综合评分" width="100">
              <template #default="{row}"><el-tag :type="row.score >= 90 ? 'success' : row.score >= 70 ? '' : 'warning'">{{ row.score }}分</el-tag></template>
            </el-table-column>
            <el-table-column prop="clues" label="有效线索" width="100" />
            <el-table-column prop="deals" label="成交客户" width="100" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('week')

const stats = ref([
  { label: '新增客户数', value: '1,720', color: '#409EFF', trend: 18 },
  { label: '高意向客户', value: '330', color: '#E6A23C', trend: 8 },
  { label: '成交客户', value: '156', color: '#67C23A', trend: 12 },
  { label: '客户转化率', value: '9.1%', color: '#F56C6C', trend: -3 },
  { label: '销售能力均分', value: '76', color: '#409EFF', trend: 4.4 },
  { label: '购买意向均分', value: '72', color: '#E6A23C', trend: 4.7 },
  { label: '产品力均分', value: '68', color: '#67C23A', trend: 0 },
  { label: '综合得分', value: '72', color: '#909399', trend: 4.4 }
])

const deviceStats = ref([
  { label: '已绑定设备', value: '312' },
  { label: '在线设备', value: '263' },
  { label: '设备在线率', value: '84.3%' },
  { label: '今日录音时长', value: '126h' }
])

const rankingData = ref([
  { name: '王志华', dept: '华东区', score: 92, clues: 45, deals: 18 },
  { name: '朱炫', dept: '华南区', score: 88, clues: 38, deals: 15 },
  { name: '李飞', dept: '华北区', score: 85, clues: 32, deals: 12 },
  { name: '张锐', dept: '西南区', score: 82, clues: 28, deals: 10 },
  { name: '余希', dept: '华东区', score: 79, clues: 25, deals: 9 }
])

const trendChartRef = ref(null)
const scoreChartRef = ref(null)
const radarChartRef = ref(null)

onMounted(() => {
  nextTick(() => {
    // 趋势图
    const trend = echarts.init(trendChartRef.value)
    trend.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['05-11', '05-12', '05-13', '05-14', '05-15', '05-16', '05-17'] },
      yAxis: { type: 'value' },
      series: [
        { name: '新增客户', type: 'line', smooth: true, data: [220, 280, 310, 250, 340, 290, 312], areaStyle: { color: 'rgba(64,158,255,0.1)' }, itemStyle: { color: '#409EFF' } },
        { name: '成交客户', type: 'line', smooth: true, data: [18, 22, 25, 19, 28, 24, 26], itemStyle: { color: '#67C23A' } }
      ],
      grid: { left: 40, right: 20, top: 30, bottom: 30 },
      legend: { data: ['新增客户', '成交客户'], bottom: 0 }
    })

    // 评分走势
    const score = echarts.init(scoreChartRef.value)
    score.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'] },
      yAxis: { type: 'value', min: 50, max: 100 },
      series: [
        { name: '销售能力', type: 'line', smooth: true, data: [65, 68, 72, 70, 75, 74, 76, 78], itemStyle: { color: '#409EFF' } },
        { name: '购买意向', type: 'line', smooth: true, data: [60, 64, 66, 68, 70, 71, 72, 74], itemStyle: { color: '#E6A23C' } },
        { name: '产品力', type: 'line', smooth: true, data: [58, 60, 62, 63, 65, 66, 68, 70], itemStyle: { color: '#67C23A' } }
      ],
      grid: { left: 40, right: 20, top: 30, bottom: 30 },
      legend: { data: ['销售能力', '购买意向', '产品力'], bottom: 0 }
    })

    // 雷达图
    const radar = echarts.init(radarChartRef.value)
    radar.setOption({
      radar: {
        indicator: [
          { name: '需求挖掘', max: 100 },
          { name: '产品介绍', max: 100 },
          { name: '专业术语', max: 100 },
          { name: '服务态度', max: 100 },
          { name: '逼单技巧', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [
          { value: [88, 82, 76, 92, 70], name: '团队平均', areaStyle: { color: 'rgba(64,158,255,0.2)' }, lineStyle: { color: '#409EFF' }, itemStyle: { color: '#409EFF' } },
          { value: [95, 90, 85, 96, 88], name: '金牌销售', lineStyle: { color: '#F56C6C' }, itemStyle: { color: '#F56C6C' } }
        ]
      }],
      legend: { data: ['团队平均', '金牌销售'], bottom: 0 }
    })

    window.addEventListener('resize', () => { trend.resize(); score.resize(); radar.resize() })
  })
})
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
.stat-card { text-align: center; padding: 16px 0; }
.stat-value { font-size: 28px; font-weight: bold; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.stat-trend { font-size: 12px; margin-top: 4px; }
.stat-trend.up { color: #67C23A; }
.stat-trend.down { color: #F56C6C; }
.device-stat { text-align: center; padding: 12px 0; border: 1px solid #ebeef5; border-radius: 8px; margin-bottom: 12px; }
.ds-value { font-size: 24px; font-weight: bold; color: #409EFF; }
.ds-label { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
