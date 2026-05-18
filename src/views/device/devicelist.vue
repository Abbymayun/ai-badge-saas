<template>
  <div>
    <div class="page-title">设备列表</div>
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12">
        <el-col :span="6"><el-input v-model="searchSn" placeholder="搜索设备SN/名称" clearable prefix-icon="Search" /></el-col>
        <el-col :span="4"><el-select v-model="filterStatus" placeholder="设备状态" clearable><el-option label="全部" value="" /><el-option label="在线" value="online" /><el-option label="离线" value="offline" /><el-option label="异常" value="error" /></el-select></el-col>
        <el-col :span="4"><el-select v-model="filterDept" placeholder="所属部门" clearable><el-option v-for="d in departments" :key="d" :label="d" :value="d" /></el-select></el-col>
        <el-col :span="2"><el-button type="primary" icon="Search">查询</el-button></el-col>
        <el-col :span="2"><el-button icon="Download">导出</el-button></el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <el-table :data="deviceList" stripe>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="sn" label="设备SN" width="160" />
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="bindUser" label="绑定人员" />
        <el-table-column prop="dept" label="所属部门" />
        <el-table-column prop="mac" label="MAC地址" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status === '在线' ? 'success' : row.status === '离线' ? 'info' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="onlineRate" label="使用率" width="100" />
        <el-table-column prop="expireDate" label="到期时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看详情</el-button>
            <el-button type="warning" link size="small">设置</el-button>
            <el-button type="danger" link size="small">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;">
        <el-pagination :total="312" :page-size="20" layout="total, prev, pager, next" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const searchSn = ref('')
const filterStatus = ref('')
const filterDept = ref('')
const departments = ['华东区', '华南区', '华北区', '西南区', '西北区']
const deviceList = ref([
  { sn: '1B012617000029', name: '静妍2号设备', bindUser: '静妍测试', dept: '华东区', mac: 'AA:BB:CC:DD:EE:29', status: '离线', onlineRate: '78%', expireDate: '2027-05-31' },
  { sn: '1B012617000045', name: '志华1号设备', bindUser: '王志华', dept: '华东区', mac: 'AA:BB:CC:DD:EE:45', status: '在线', onlineRate: '92%', expireDate: '2027-05-31' },
  { sn: '1B012617000078', name: '朱炫测试机', bindUser: '朱炫', dept: '华南区', mac: 'AA:BB:CC:DD:EE:78', status: '在线', onlineRate: '88%', expireDate: '2027-05-31' },
  { sn: '1B012617000102', name: '张锐设备', bindUser: '张锐', dept: '西南区', mac: 'AA:BB:CC:DD:EE:02', status: '异常', onlineRate: '45%', expireDate: '2027-03-15' },
  { sn: '1B012617000156', name: '李飞2号设备', bindUser: '李飞', dept: '华北区', mac: 'AA:BB:CC:DD:EE:56', status: '在线', onlineRate: '91%', expireDate: '2027-05-31' }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
