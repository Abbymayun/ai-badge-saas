<template>
  <div>
    <div class="page-title">听记管理</div>
    <el-row :gutter="16" style="margin-bottom:16px;" class="stat-cards">
      <el-col :span="6"><el-card shadow="hover"><div class="mini-stat"><div class="ms-val">210</div><div class="ms-label">报告总数</div></div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover"><div class="mini-stat"><div class="ms-val">181</div><div class="ms-label">有效报告</div></div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover"><div class="mini-stat"><div class="ms-val">20.8<small>分钟</small></div><div class="ms-label">平均时长</div></div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover"><div class="mini-stat"><div class="ms-val">86%</div><div class="ms-label">AI分析率</div></div></el-card></el-col>
    </el-row>
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12">
        <el-col :span="5"><el-input v-model="search" placeholder="搜索录音/人员" clearable prefix-icon="Search" /></el-col>
        <el-col :span="4"><el-select v-model="filterDept" placeholder="部门" clearable><el-option v-for="d in depts" :key="d" :label="d" :value="d" /></el-select></el-col>
        <el-col :span="4"><el-select v-model="filterIndustry" placeholder="行业" clearable><el-option v-for="i in industries" :key="i" :label="i" :value="i" /></el-select></el-col>
        <el-col :span="4"><el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" /></el-col>
        <el-col :span="2"><el-button type="primary">查询</el-button></el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <el-table :data="audioList" stripe>
        <el-table-column prop="name" label="录音名称" min-width="220" />
        <el-table-column prop="device" label="关联设备" width="150" />
        <el-table-column prop="user" label="销售人员" width="100" />
        <el-table-column prop="industry" label="行业" width="90">
          <template #default="{row}"><el-tag size="small" type="warning">{{ row.industry }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="scene" label="场景" width="90">
          <template #default="{row}"><el-tag size="small" type="info">{{ row.scene }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="90" />
        <el-table-column prop="date" label="创建时间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status==='已完成'?'success':row.status==='分析中'?'warning':'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="综合得分" width="90">
          <template #default="{row}">
            <span v-if="row.score" style="font-weight:bold;color:#409EFF;">{{ row.score }}</span>
            <span v-else style="color:#c0c4cc;">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{row}">
            <el-button type="primary" link size="small" @click="$router.push('/audio/detail/' + row.id)" :disabled="row.status !== '已完成'">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;">
        <el-pagination :total="210" :page-size="20" layout="total, prev, pager, next" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const search = ref('')
const filterDept = ref('')
const filterIndustry = ref('')
const dateRange = ref(null)
const depts = ['华东区', '华南区', '华北区', '西南区']
const industries = ['银行金融', '汽车销售', '保险', '房地产', '教育培训', '医疗健康', '零售消费']
const audioList = ref([
  { id: 1, name: '王志华-银行客户拜访-兴业银行张总', industry: '银行金融', scene: '客户拜访', device: '1B012617000045', user: '王志华', duration: '32分钟', date: '2026-05-17', status: '已完成', score: 88 },
  { id: 2, name: '朱炫-汽车展厅-试驾跟进-李先生', industry: '汽车销售', scene: '产品演示', device: '1B012617000078', user: '朱炫', duration: '45分钟', date: '2026-05-17', status: '已完成', score: 92 },
  { id: 3, name: '李飞-保险方案推荐-赵经理', industry: '保险', scene: '客户拜访', device: '1B012617000156', user: '李飞', duration: '28分钟', date: '2026-05-16', status: '已完成', score: 76 },
  { id: 4, name: '张锐-地产项目-看房跟进-刘总', industry: '房地产', scene: '客户拜访', device: '1B012617000102', user: '张锐', duration: '55分钟', date: '2026-05-16', status: '分析中', score: null },
  { id: 5, name: '静妍-教育课程推荐-陈家长', industry: '教育培训', scene: '需求调研', device: '1B012617000029', user: '静妍', duration: '22分钟', date: '2026-05-16', status: '待分析', score: null },
  { id: 6, name: '郑凯-医疗产品介绍-王主任', industry: '医疗健康', scene: '客户拜访', device: '1B012617000088', user: '郑凯', duration: '18分钟', date: '2026-05-15', status: '已完成', score: 85 },
  { id: 7, name: '潘璐-零售门店-客户回访-周女士', industry: '零售消费', scene: '售后跟进', device: '1B012617000099', user: '潘璐', duration: '15分钟', date: '2026-05-15', status: '已完成', score: 79 },
  { id: 8, name: '王志华-银行理财-二次跟进-张总', industry: '银行金融', scene: '商务谈判', device: '1B012617000045', user: '王志华', duration: '25分钟', date: '2026-05-14', status: '已完成', score: 91 }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
.mini-stat { text-align: center; padding: 8px; }
.ms-val { font-size: 28px; font-weight: bold; color: #409EFF; }
.ms-val small { font-size: 14px; color: #909399; }
.ms-label { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
