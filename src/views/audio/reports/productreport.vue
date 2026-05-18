<template>
  <div class="product-report">
    <!-- 产品力总评分 -->
    <div class="score-hero" style="background: linear-gradient(135deg, #67c23a0d, #409EFF0d);">
      <div class="score-big" style="color:#67C23A;">{{ data.score }}</div>
      <div class="score-desc">产品力综合评分<span class="score-max">（满分100）</span></div>
    </div>

    <!-- 四个细分维度 -->
    <el-row :gutter="16" class="product-gauges">
      <el-col :span="6" v-for="item in productItems" :key="item.label">
        <div class="p-gauge">
          <div class="pg-score" :style="{color: item.color}">{{ item.score }}</div>
          <div class="pg-label">{{ item.label }}</div>
          <el-progress :percentage="item.score" :color="item.color" :stroke-width="5" :show-text="false" />
          <div class="pg-comment">{{ item.comment }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 核心卖点展示 -->
    <el-card shadow="never" class="selling-card">
      <template #header><span class="section-title">💎 本次沟通中有效传递的核心卖点</span></template>
      <div v-for="(sp, idx) in data.keySellingPoints" :key="idx" class="sp-item">
        <el-icon :size="18" style="color:#67C23A;"><CircleCheckFilled /></el-icon>
        <div>
          <div class="sp-text">{{ sp }}</div>
        </div>
      </div>
    </el-card>

    <!-- 产品介绍分析 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="section-title">📋 产品介绍清晰度</span></template>
          <div class="score-row">
            <span class="score-val" style="color:#409EFF;">{{ data.clarity.score }}</span>
            <span class="score-label">分</span>
          </div>
          <el-alert :title="data.clarity.comment" type="info" :closable="false" show-icon />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="section-title">🎯 需求与产品匹配度</span></template>
          <div class="score-row">
            <span class="score-val" style="color:#67C23A;">{{ data.match.score }}</span>
            <span class="score-label">分</span>
          </div>
          <el-alert :title="data.match.comment" type="success" :closable="false" show-icon />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top:12px;">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="section-title">🛡️ 异议处理能力</span></template>
          <div class="score-row">
            <span class="score-val" style="color:#E6A23C;">{{ data.objection.score }}</span>
            <span class="score-label">分</span>
          </div>
          <el-alert :title="data.objection.comment" type="warning" :closable="false" show-icon />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="section-title">⚔️ 竞品应对</span></template>
          <div class="score-row">
            <span class="score-val" style="color:#909399;">{{ data.competitorHandling.score }}</span>
            <span class="score-label">分</span>
          </div>
          <el-alert :title="data.competitorHandling.comment" type="info" :closable="false" show-icon />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
  template: { type: Object, default: () => ({}) }
})

const productItems = computed(() => [
  { label: '产品介绍清晰度', score: props.data.clarity.score, color: '#409EFF', comment: props.data.clarity.comment },
  { label: '需求产品匹配度', score: props.data.match.score, color: '#67C23A', comment: props.data.match.comment },
  { label: '异议处理能力', score: props.data.objection.score, color: '#E6A23C', comment: props.data.objection.comment },
  { label: '竞品应对能力', score: props.data.competitorHandling.score, color: '#909399', comment: props.data.competitorHandling.comment }
])
</script>

<style scoped>
.product-report { }
.score-hero { text-align: center; padding: 20px; border-radius: 12px; margin-bottom: 16px; }
.score-big { font-size: 48px; font-weight: bold; line-height: 1; }
.score-desc { font-size: 14px; color: #606266; margin-top: 8px; }
.score-max { font-size: 12px; color: #c0c4cc; }

.product-gauges { margin-bottom: 16px; }
.p-gauge { text-align: center; padding: 12px; background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.pg-score { font-size: 32px; font-weight: bold; margin: 4px 0; }
.pg-label { font-size: 12px; color: #606266; margin-bottom: 6px; }
.pg-comment { font-size: 11px; color: #909399; margin-top: 8px; line-height: 1.5; }

.selling-card { margin-bottom: 12px; }
.sp-item { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f5f7fa; }
.sp-text { font-size: 13px; color: #303133; line-height: 1.6; }

.section-title { font-size: 14px; font-weight: bold; color: #303133; }
.score-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 8px; }
.score-val { font-size: 36px; font-weight: bold; }
.score-label { font-size: 14px; color: #909399; }
</style>
