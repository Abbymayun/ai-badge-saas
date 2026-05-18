<template>
  <div>
    <div class="page-title">企业管理</div>
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12">
        <el-col :span="5"><el-input v-model="search" placeholder="搜索企业名称" clearable prefix-icon="Search" /></el-col>
        <el-col :span="4"><el-select v-model="filterIndustry" placeholder="行业筛选" clearable><el-option v-for="i in industries" :key="i" :label="i" :value="i" /></el-select></el-col>
        <el-col :span="3"><el-select v-model="filterStatus" placeholder="状态" clearable><el-option label="正常" value="normal" /><el-option label="已过期" value="expired" /><el-option label="已禁用" value="disabled" /></el-select></el-col>
        <el-col :span="2"><el-button type="primary">查询</el-button></el-col>
        <el-col :span="3"><el-button type="success" icon="Plus" @click="$router.push('/enterprise/create')">创建企业</el-button></el-col>
        <el-col :span="2"><el-button icon="Download">导出</el-button></el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <el-table :data="enterpriseList" stripe>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="所属行业" width="100">
          <template #default="{row}"><el-tag size="small" type="warning">{{ row.industry }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="type" label="企业类型" width="100" />
        <el-table-column prop="contact" label="联系人" width="80" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column label="AI配额" width="140">
          <template #default="{row}">
            <span>{{ row.aiUsed }}</span><span style="color:#909399"> / {{ row.aiTotal }}</span>
            <el-progress :percentage="(row.aiUsed / row.aiTotal * 100).toFixed(0)" :stroke-width="4" style="width:60px;display:inline-block;margin-left:4px;vertical-align:middle;" :color="row.aiUsed/row.aiTotal > 0.8 ? '#F56C6C' : '#409EFF'" />
          </template>
        </el-table-column>
        <el-table-column prop="expireDate" label="配额到期" width="110" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{row}"><el-tag :type="row.status==='正常'?'success':row.status==='已过期'?'danger':'info'" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="devices" label="设备数" width="80" />
        <el-table-column prop="employees" label="员工数" width="80" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="warning" link size="small">编辑</el-button>
            <el-button type="success" link size="small">配额</el-button>
            <el-button type="danger" link size="small">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;"><el-pagination :total="28" :page-size="20" layout="total, prev, pager, next" /></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const search = ref('')
const filterIndustry = ref('')
const filterStatus = ref('')
const industries = ['银行', '汽车', '医疗', '教育', '地产', '零售', '保险']
const enterpriseList = ref([
  { name: '利尔达集团', industry: '综合', type: '集团', contact: '马云云', phone: '138****5678', aiUsed: 820, aiTotal: 1000, expireDate: '2027-05-31', status: '正常', devices: 312, employees: 85 },
  { name: '杭州智联金融科技', industry: '银行', type: '分公司', contact: '陈经理', phone: '139****1234', aiUsed: 156, aiTotal: 200, expireDate: '2027-03-15', status: '正常', devices: 45, employees: 22 },
  { name: '上海瑞驰汽车服务', industry: '汽车', type: '合作伙伴', contact: '李总', phone: '137****5678', aiUsed: 98, aiTotal: 100, expireDate: '2026-06-30', status: '正常', devices: 32, employees: 15 },
  { name: '深圳健康医疗科技', industry: '医疗', type: '合作伙伴', contact: '王总', phone: '136****9012', aiUsed: 200, aiTotal: 200, expireDate: '2026-04-30', status: '已过期', devices: 18, employees: 10 },
  { name: '北京育才教育集团', industry: '教育', type: '合作伙伴', contact: '张校', phone: '135****3456', aiUsed: 45, aiTotal: 150, expireDate: '2027-08-31', status: '正常', devices: 22, employees: 12 }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
