<template>
  <div class="product-report-enhanced">
    <div class="pr-hero">
      <div class="pr-hero-score">
        <span class="pr-big">{{ data.score }}</span>
        <span class="pr-unit">/100</span>
      </div>
      <div class="pr-hero-info">
        <h3>产品力综合评分</h3>
        <p>评估销售对产品的理解深度、介绍清晰度、客户需求匹配及异议处理能力</p>
      </div>
    </div>

    <el-row :gutter="16" class="pr-gauges">
      <el-col :span="6" v-for="item in gaugeItems" :key="item.label">
        <div class="pr-gauge-card" :style="{borderTopColor: item.color}">
          <div class="prg-icon">{{ item.icon }}</div>
          <div class="prg-score" :style="{color: item.color}">{{ item.score }}</div>
          <div class="prg-label">{{ item.label }}</div>
          <el-progress :percentage="item.score" :color="item.color" :stroke-width="5" :show-text="false" />
          <div class="prg-comment">{{ item.comment }}</div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="never" class="pr-selling">
      <template #header><div class="card-title">💎 核心卖点传递效果</div></template>
      <el-row :gutter="12">
        <el-col :span="12" v-for="(sp, idx) in data.keySellingPoints" :key="idx">
          <div class="sp-row">
            <span class="sp-num">{{ idx + 1 }}</span>
            <span class="sp-text">{{ sp }}</span>
            <el-icon style="color:#67C23A;flex-shrink:0;"><CircleCheckFilled /></el-icon>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ data: Object, template: Object })

const gaugeItems = computed(() => [
  { icon: '📋', label: '介绍清晰度', score: props.data.clarity.score, color: '#409EFF', comment: props.data.clarity.comment },
  { icon: '🎯', label: '需求匹配度', score: props.data.match.score, color: '#67C23A', comment: props.data.match.comment },
  { icon: '🛡️', label: '异议处理', score: props.data.objection.score, color: '#E6A23C', comment: props.data.objection.comment },
  { icon: '⚔️', label: '竞品应对', score: props.data.competitorHandling.score, color: '#909399', comment: props.data.competitorHandling.comment }
])
</script>

<style scoped>
.product-report-enhanced { }
.pr-hero { display: flex; align-items: center; gap: 24px; padding: 24px; background: linear-gradient(135deg, #f6ffed, #f0f9ff); border-radius: 16px; margin-bottom: 20px; }
.pr-hero-score { text-align: center; }
.pr-big { font-size: 54px; font-weight: bold; color: #67C23A; }
.pr-unit { font-size: 16px; color: #c0c4cc; margin-left: 4px; }
.pr-hero-info h3 { margin: 0 0 6px; font-size: 18px; color: #303133; }
.pr-hero-info p { margin: 0; font-size: 13px; color: #909399; }

.pr-gauges { margin-bottom: 20px; }
.pr-gauge-card { background: #fff; border-radius: 12px; padding: 18px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border-top: 3px solid; transition: .2s; }
.pr-gauge-card:hover { transform: translateY(-2px); }
.prg-icon { font-size: 28px; margin-bottom: 6px; }
.prg-score { font-size: 32px; font-weight: bold; }
.prg-label { font-size: 13px; color: #606266; margin: 4px 0 8px; }
.prg-comment { font-size: 11px; color: #909399; margin-top: 8px; line-height: 1.5; }

.pr-selling { border-radius: 12px; }
.card-title { font-size: 15px; font-weight: bold; color: #303133; }
.sp-row { display: flex; align-items: center; gap: 8px; padding: 8px; margin-bottom: 4px; background: #fafbfc; border-radius: 8px; }
.sp-num { width: 22px; height: 22px; border-radius: 6px; background: #ecf5ff; color: #409EFF; font-size: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sp-text { flex: 1; font-size: 13px; color: #303133; }
</style>
