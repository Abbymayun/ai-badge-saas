<template>
  <div>
    <div class="page-title">线索列表</div>
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12">
        <el-col :span="4"><el-select v-model="filterStatus" placeholder="线索状态" clearable><el-option label="新线索" value="new" /><el-option label="跟进中" value="following" /><el-option label="已成交" value="deal" /><el-option label="已流失" value="lost" /></el-select></el-col>
        <el-col :span="4"><el-select v-model="filterIntent" placeholder="意向等级" clearable><el-option label="高意向" value="high" /><el-option label="中意向" value="medium" /><el-option label="低意向" value="low" /></el-select></el-col>
        <el-col :span="5"><el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始" end-placeholder="结束" /></el-col>
        <el-col :span="4"><el-input v-model="search" placeholder="搜索客户/线索" clearable /></el-col>
        <el-col :span="2"><el-button type="primary">查询</el-button></el-col>
      </el-row>
    </el-card>
    <el-row :gutter="16" style="margin-bottom:16px;">
      <el-col :span="6"><el-card shadow="hover"><div class="mini-stat"><div class="ms-val" style="color:#409EFF">156</div><div class="ms-label">新线索</div></div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover"><div class="mini-stat"><div class="ms-val" style="color:#E6A23C">89</div><div class="ms-label">跟进中</div></div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover"><div class="mini-stat"><div class="ms-val" style="color:#67C23A">42</div><div class="ms-label">已成交</div></div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover"><div class="mini-stat"><div class="ms-val" style="color:#909399">25</div><div class="ms-label">已流失</div></div></el-card></el-col>
    </el-row>
    <el-card shadow="hover">
      <el-table :data="clueList" stripe>
        <el-table-column prop="id" label="线索编号" width="120" />
        <el-table-column prop="name" label="客户名称" min-width="150" />
        <el-table-column prop="intent" label="意向等级" width="100">
          <template #default="{row}"><el-tag :type="row.intent==='高'?'danger':row.intent==='中'?'warning':'info'" size="small">{{ row.intent }}意向</el-tag></template>
        </el-table-column>
        <el-table-column prop="dept" label="所属部门" width="100" />
        <el-table-column prop="follower" label="跟进人" width="100" />
        <el-table-column prop="source" label="来源" width="100">
          <template #default="{row}"><el-tag size="small">{{ row.source }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{row}"><el-tag :type="row.status==='已成交'?'success':row.status==='已流失'?'danger':''" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default><el-button type="primary" link size="small">查看详情</el-button><el-button type="warning" link size="small">跟进</el-button></template>
        </el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;"><el-pagination :total="312" :page-size="20" layout="total, prev, pager, next" /></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const search = ref('')
const filterStatus = ref('')
const filterIntent = ref('')
const dateRange = ref(null)
const clueList = ref([
  { id: 'CL-20260517-001', name: '兴业银行张总', intent: '高', dept: '华东区', follower: '王志华', source: 'AI提取', createdAt: '2026-05-17', status: '跟进中' },
  { id: 'CL-20260516-015', name: '李先生-试驾意向', intent: '中', dept: '华南区', follower: '朱炫', source: 'AI提取', createdAt: '2026-05-16', status: '跟进中' },
  { id: 'CL-20260515-008', name: '赵经理-保险方案', intent: '高', dept: '华北区', follower: '李飞', source: '手动录入', createdAt: '2026-05-15', status: '已成交' },
  { id: 'CL-20260514-022', name: '刘总-看房需求', intent: '低', dept: '西南区', follower: '张锐', source: 'AI提取', createdAt: '2026-05-14', status: '已流失' },
  { id: 'CL-20260513-006', name: '陈家长-课程咨询', intent: '中', dept: '华东区', follower: '静妍', source: 'AI提取', createdAt: '2026-05-13', status: '跟进中' }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
.mini-stat { text-align: center; padding: 8px; }
.ms-val { font-size: 28px; font-weight: bold; }
.ms-label { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
