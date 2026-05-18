<template>
  <div>
    <div class="page-title">产品卖点配置</div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="产品管理" name="product">
        <div style="margin-bottom:12px;"><el-button type="primary" icon="Plus">新增产品</el-button></div>
        <el-table :data="products" stripe>
          <el-table-column prop="name" label="产品名称" />
          <el-table-column prop="model" label="型号" width="150" />
          <el-table-column prop="sellingPoints" label="卖点数量" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{row}"><el-tag :type="row.status==='已上架'?'success':'info'" size="small">{{ row.status }}</el-tag></template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default>
              <el-button type="primary" link size="small">详情</el-button>
              <el-button type="warning" link size="small">编辑</el-button>
              <el-button type="danger" link size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="卖点管理" name="points">
        <el-row :gutter="12" style="margin-bottom:12px;">
          <el-col :span="5"><el-select v-model="filterProduct" placeholder="筛选产品" clearable><el-option v-for="p in products" :key="p.model" :label="p.name" :value="p.model" /></el-select></el-col>
          <el-col :span="5"><el-input v-model="searchPoint" placeholder="搜索卖点" clearable /></el-col>
        </el-row>
        <el-table :data="sellingPoints" stripe>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="product" label="所属产品" width="180" />
          <el-table-column prop="content" label="卖点内容" min-width="300" />
          <el-table-column prop="source" label="来源" width="100">
            <template #default="{row}"><el-tag :type="row.source==='手动录入'?'':'success'" size="small">{{ row.source }}</el-tag></template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default>
              <el-button type="primary" link size="small">编辑</el-button>
              <el-button type="success" link size="small">AI润色</el-button>
              <el-button type="danger" link size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('product')
const filterProduct = ref('')
const searchPoint = ref('')
const products = ref([
  { name: 'AI智能胸牌3S标准版', model: 'XZ-3S-001', sellingPoints: 5, status: '已上架' },
  { name: 'AI智能胸牌3S增强版', model: 'XZ-3S-002', sellingPoints: 3, status: '已上架' },
  { name: 'AI智能胸牌Mini版', model: 'XZ-M-001', sellingPoints: 4, status: '已下架' }
])
const sellingPoints = ref([
  { product: 'AI智能胸牌3S标准版', content: 'AI实时语音转写，准确率高达98%，支持多人对话自动区分发言人', source: 'AI生成' },
  { product: 'AI智能胸牌3S标准版', content: '智能总结报告，自动生成客户画像、需求分析和销售建议', source: 'AI生成' },
  { product: 'AI智能胸牌3S标准版', content: '超长续航12小时，满足全天工作需求，Type-C快充1.5小时满电', source: '手动录入' },
  { product: 'AI智能胸牌3S标准版', content: '轻量化设计仅28g，佩戴无感，商务外观适配各类场景', source: '手动录入' },
  { product: 'AI智能胸牌3S标准版', content: '银行级数据加密，端到端隐私保护，符合等保三级标准', source: 'AI生成' },
  { product: 'AI智能胸牌3S增强版', content: '新增降噪芯片，嘈杂环境5米内清晰拾音', source: 'AI生成' },
  { product: 'AI智能胸牌3S增强版', content: '双麦阵列，360°全向收音，会议场景全覆盖', source: 'AI生成' },
  { product: 'AI智能胸牌3S增强版', content: 'IP67防水防尘，户外场景无忧使用', source: '手动录入' }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
