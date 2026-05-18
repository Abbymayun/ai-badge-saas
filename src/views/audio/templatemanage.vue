<template>
  <div>
    <div class="page-title">评价模板管理</div>
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12">
        <el-col :span="5"><el-input v-model="search" placeholder="搜索模板名称" clearable /></el-col>
        <el-col :span="4"><el-select v-model="filterType" placeholder="模板类型" clearable><el-option label="系统内置" value="system" /><el-option label="行业专属" value="industry" /><el-option label="自定义" value="custom" /></el-select></el-col>
        <el-col :span="4"><el-select v-model="filterStatus" placeholder="状态" clearable><el-option label="已启用" value="on" /><el-option label="已禁用" value="off" /></el-select></el-col>
        <el-col :span="2"><el-button type="primary">查询</el-button></el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <el-table :data="templateList" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="策略名称" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}"><el-switch v-model="row.enabled" active-text="启用" inactive-text="禁用" /></template>
        </el-table-column>
        <el-table-column prop="scope" label="应用范围" width="120" />
        <el-table-column prop="type" label="模板类型" width="120">
          <template #default="{row}"><el-tag :type="row.type==='系统内置'?'':row.type==='行业专属'?'warning':'success'" size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="dims" label="评价维度" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="success" link size="small">复制</el-button>
            <el-button type="warning" link size="small">启用/禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const search = ref('')
const filterType = ref('')
const filterStatus = ref('')
const templateList = ref([
  { name: '销售能力打分', status: '启用', enabled: true, scope: '全员', type: '系统内置', dims: '5维' },
  { name: '客户购买力打分', status: '启用', enabled: true, scope: '全员', type: '系统内置', dims: '5维' },
  { name: '产品力打分', status: '启用', enabled: true, scope: '全员', type: '系统内置', dims: '4维' },
  { name: '银行业务拜访评分', status: '启用', enabled: true, scope: '银行业企业', type: '行业专属', dims: '6维' },
  { name: '汽车销售评分', status: '启用', enabled: true, scope: '汽车业企业', type: '行业专属', dims: '5维' },
  { name: '医疗行业沟通评分', status: '未启用', enabled: false, scope: '医疗业企业', type: '行业专属', dims: '5维' },
  { name: '自定义销售策略A', status: '启用', enabled: true, scope: '华东区', type: '自定义', dims: '4维' }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
