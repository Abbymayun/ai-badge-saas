<template>
  <div>
    <div class="page-title">员工管理</div>
    <el-row :gutter="16">
      <el-col :span="5">
        <el-card shadow="hover">
          <template #header><span>部门结构</span></template>
          <el-tree :data="deptTree" :props="{label:'name',children:'children'}" node-key="id" default-expand-all highlight-current @node-click="handleDeptClick" />
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card shadow="hover" style="margin-bottom:16px;">
          <el-row :gutter="12">
            <el-col :span="5"><el-input v-model="search" placeholder="搜索姓名/工号" clearable prefix-icon="Search" /></el-col>
            <el-col :span="3"><el-select v-model="filterRole" placeholder="角色" clearable><el-option label="管理员" value="admin" /><el-option label="经理" value="manager" /><el-option label="销售" value="sales" /></el-select></el-col>
            <el-col :span="3"><el-select v-model="filterStatus" placeholder="状态" clearable><el-option label="在职" value="active" /><el-option label="离职" value="inactive" /></el-select></el-col>
            <el-col :span="2"><el-button type="primary" icon="Search">查询</el-button></el-col>
            <el-col :span="2"><el-button type="success" icon="Plus">新增</el-button></el-col>
            <el-col :span="2"><el-button icon="Download">导出</el-button></el-col>
          </el-row>
        </el-card>
        <el-card shadow="hover">
          <el-table :data="employeeList" stripe>
            <el-table-column type="selection" width="50" />
            <el-table-column prop="name" label="姓名" width="80" />
            <el-table-column prop="id" label="工号" width="100" />
            <el-table-column prop="dept" label="部门" width="120" />
            <el-table-column prop="position" label="职位" width="100" />
            <el-table-column prop="device" label="绑定设备" width="150" />
            <el-table-column prop="role" label="角色" width="100">
              <template #default="{row}"><el-tag size="small">{{ row.role }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="audioCount" label="听记数" width="80" />
            <el-table-column prop="score" label="综合评分" width="90">
              <template #default="{row}"><span style="color:#409EFF;font-weight:bold;">{{ row.score }}</span></template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{row}"><el-tag :type="row.status==='在职'?'success':'info'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default>
                <el-button type="primary" link size="small">查看</el-button>
                <el-button type="warning" link size="small">编辑</el-button>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:16px;text-align:right;"><el-pagination :total="85" :page-size="20" layout="total, prev, pager, next" /></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const search = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const handleDeptClick = (node) => { console.log('Dept selected:', node.label) }
const deptTree = ref([
  { id: 1, name: '利尔达集团', children: [
    { id: 11, name: '华东区', children: [{ id: 111, name: '销售一部' }, { id: 112, name: '销售二部' }] },
    { id: 12, name: '华南区', children: [{ id: 121, name: '销售一部' }] },
    { id: 13, name: '华北区' },
    { id: 14, name: '西南区' },
    { id: 15, name: '产品研发部' }
  ]}
])
const employeeList = ref([
  { name: '王志华', id: 'EMP-001', dept: '华东区-销售一部', position: '高级客户经理', device: '1B012617000045', role: '金牌销售', audioCount: 186, score: 92, status: '在职' },
  { name: '朱炫', id: 'EMP-002', dept: '华南区-销售一部', position: '客户经理', device: '1B012617000078', role: '销售', audioCount: 152, score: 88, status: '在职' },
  { name: '李飞', id: 'EMP-003', dept: '华北区', position: '客户经理', device: '1B012617000156', role: '销售', audioCount: 128, score: 85, status: '在职' },
  { name: '张锐', id: 'EMP-004', dept: '西南区', position: '客户经理', device: '1B012617000102', role: '销售', audioCount: 96, score: 82, status: '在职' },
  { name: '静妍', id: 'EMP-005', dept: '华东区-销售二部', position: '销售代表', device: '1B012617000029', role: '销售', audioCount: 68, score: 75, status: '在职' }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
