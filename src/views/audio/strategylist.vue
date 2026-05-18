<template>
  <div>
    <div class="page-title">我的评价策略</div>
    <el-card shadow="hover" style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;">策略列表</span>
        <el-button type="primary" icon="Plus">新建策略</el-button>
      </div>
    </el-card>
    <el-card shadow="hover">
      <el-table :data="strategyList" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="策略名称" min-width="200" />
        <el-table-column prop="source" label="来源" width="120">
          <template #default="{row}"><el-tag :type="row.source==='系统模板'?'':'warning'" size="small">{{ row.source }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="status" label="启用状态" width="100">
          <template #default="{row}"><el-tag :type="row.status==='启用'?'success':'info'" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="scope" label="应用范围" width="120" />
        <el-table-column prop="dims" label="维度数" width="80" />
        <el-table-column prop="updatedAt" label="更新时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="warning" link size="small">编辑</el-button>
            <el-button type="success" link size="small">复制</el-button>
            <el-button type="danger" link size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="hover" style="margin-top:16px;">
      <template #header><span>配置流程说明</span></template>
      <el-steps :active="4" finish-status="success" simple>
        <el-step title="策略框架搭建" description="选择系统模板或空白创建，搭建多层级维度树" />
        <el-step title="评价标准配置" description="为每个维度配置评价标准，支持AI辅助生成" />
        <el-step title="权重智能分配" description="AI自动分配权重，支持手动微调，权重合计100%" />
        <el-step title="应用范围选择" description="选择全员或指定成员，保存后立即生效" />
      </el-steps>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const strategyList = ref([
  { name: '产品力打分-副本', source: '系统模板', status: '启用', scope: '全员', dims: 4, updatedAt: '2026-05-15' },
  { name: '银行业务专项评分', source: '系统模板', status: '启用', scope: '银行业企业', dims: 6, updatedAt: '2026-05-12' },
  { name: '汽车销售综合评分', source: '自定义', status: '启用', scope: '华南区', dims: 5, updatedAt: '2026-05-10' },
  { name: '客户购买力分析', source: '系统模板', status: '未启用', scope: '-', dims: 5, updatedAt: '2026-04-28' }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
