<template>
  <div>
    <div class="page-title">权限管理</div>
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12">
        <el-col :span="5"><el-input v-model="search" placeholder="搜索权限名称/标识" clearable /></el-col>
        <el-col :span="4"><el-select v-model="filterModule" placeholder="功能模块" clearable><el-option v-for="m in modules" :key="m" :label="m" :value="m" /></el-select></el-col>
        <el-col :span="2"><el-button type="primary">查询</el-button></el-col>
        <el-col :span="2"><el-button type="success" icon="Plus">新增</el-button></el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <el-table :data="filteredPermissions" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="权限名称" min-width="180" />
        <el-table-column prop="code" label="权限标识" width="200" />
        <el-table-column prop="module" label="功能模块" width="120">
          <template #default="{row}"><el-tag size="small">{{ row.module }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="type" label="权限类型" width="100">
          <template #default="{row}"><el-tag :type="row.type==='菜单'?'':row.type==='按钮'?'warning':'success'" size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{row}"><el-tag :type="row.status==='启用'?'success':'info'" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">编辑</el-button>
            <el-button type="danger" link size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;"><el-pagination :total="68" :page-size="20" layout="total, prev, pager, next" /></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const search = ref('')
const filterModule = ref('')
const modules = ['数据概览', '设备管理', 'AI听记', '线索管理', '金牌销售', '行业管理', '企业管理', '员工管理', '角色权限', '系统配置']
const permissions = ref([
  { name: '数据概览-查看', code: 'dashboard:view', module: '数据概览', type: '菜单', sort: 1, status: '启用' },
  { name: '设备管理-列表', code: 'device:list', module: '设备管理', type: '菜单', sort: 1, status: '启用' },
  { name: '设备管理-设置', code: 'device:setting', module: '设备管理', type: '按钮', sort: 2, status: '启用' },
  { name: '设备管理-解绑', code: 'device:unbind', module: '设备管理', type: '按钮', sort: 3, status: '启用' },
  { name: '听记管理-列表', code: 'audio:list', module: 'AI听记', type: '菜单', sort: 1, status: '启用' },
  { name: '听记管理-查看AI分析', code: 'audio:analysis', module: 'AI听记', type: '按钮', sort: 2, status: '启用' },
  { name: '听记管理-导出', code: 'audio:export', module: 'AI听记', type: '按钮', sort: 3, status: '启用' },
  { name: '评价模板-管理', code: 'audio:template', module: 'AI听记', type: '菜单', sort: 4, status: '启用' },
  { name: '评价策略-管理', code: 'audio:strategy', module: 'AI听记', type: '菜单', sort: 5, status: '启用' },
  { name: '线索管理-列表', code: 'clue:list', module: '线索管理', type: '菜单', sort: 1, status: '启用' },
  { name: '线索管理-跟进', code: 'clue:follow', module: '线索管理', type: '按钮', sort: 2, status: '启用' },
  { name: '销售画像-查看', code: 'sales:profile:view', module: '金牌销售', type: '菜单', sort: 1, status: '启用' },
  { name: '话术库-查看', code: 'sales:script:view', module: '金牌销售', type: '菜单', sort: 2, status: '启用' },
  { name: '话术库-贡献', code: 'sales:script:contribute', module: '金牌销售', type: '按钮', sort: 3, status: '启用' },
  { name: '行业管理-列表', code: 'industry:list', module: '行业管理', type: '菜单', sort: 1, status: '启用' },
  { name: '行业管理-配置', code: 'industry:config', module: '行业管理', type: '按钮', sort: 2, status: '启用' },
  { name: '企业管理-列表', code: 'enterprise:list', module: '企业管理', type: '菜单', sort: 1, status: '启用' },
  { name: '企业管理-创建', code: 'enterprise:create', module: '企业管理', type: '按钮', sort: 2, status: '启用' },
  { name: '企业管理-AI配额', code: 'enterprise:quota', module: '企业管理', type: '按钮', sort: 3, status: '启用' }
])
const filteredPermissions = computed(() => permissions.value)
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
