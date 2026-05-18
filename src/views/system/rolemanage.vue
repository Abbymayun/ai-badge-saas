<template>
  <div>
    <div class="page-title">角色管理</div>
    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="hover" style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:bold;">角色列表</span>
            <el-button type="primary" icon="Plus" size="small">新建角色</el-button>
          </div>
        </el-card>
        <el-card shadow="hover">
          <el-table :data="roleList" stripe highlight-current-row @current-change="handleRowClick">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="角色名称" width="140" />
            <el-table-column prop="code" label="角色标识" width="120" />
            <el-table-column prop="desc" label="描述" min-width="200" />
            <el-table-column prop="employeeCount" label="员工数" width="80" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{row}"><el-tag :type="row.type==='系统'?'':'success'" size="small">{{ row.type }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default>
                <el-button type="primary" link size="small">编辑</el-button>
                <el-button type="warning" link size="small" :disabled="true">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header><span>权限配置 - {{ selectedRole?.name || '请选择角色' }}</span></template>
          <div v-if="selectedRole">
            <el-tree ref="permTree" :data="permissionTree" :props="{label:'label',children:'children'}" show-checkbox node-key="id" :default-checked-keys="selectedRole.perms" />
            <div style="margin-top:16px;text-align:right;">
              <el-button type="primary" @click="savePerms">保存权限</el-button>
            </div>
          </div>
          <el-empty v-else description="请先选择左侧角色" :image-size="80" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const selectedRole = ref(null)
const permTree = ref(null)
const handleRowClick = (row) => { selectedRole.value = row }

const roleList = ref([
  { name: '超级管理员', code: 'super_admin', desc: '拥有系统全部权限', employeeCount: 2, type: '系统', perms: [1,2,3,4,5,6,7,8,9,10] },
  { name: '企业管理员', code: 'ent_admin', desc: '管理本企业所有功能（除系统配置）', employeeCount: 5, type: '系统', perms: [1,2,3,4,5,6] },
  { name: '部门经理', code: 'dept_manager', desc: '管理本部门员工和设备', employeeCount: 12, type: '系统', perms: [1,2,3,4] },
  { name: '一线销售', code: 'sales', desc: '查看个人听记和话术库', employeeCount: 45, type: '系统', perms: [1,3] },
  { name: '金牌销售', code: 'gold_sales', desc: '画像展示+话术贡献', employeeCount: 3, type: '自定义', perms: [1,3,5] },
  { name: '行业顾问', code: 'industry_advisor', desc: '行业配置和话术审核', employeeCount: 2, type: '自定义', perms: [5,6,7] }
])

const permissionTree = ref([
  { id: 1, label: '📊 数据概览', children: [{ id: 101, label: '查看概览' }] },
  { id: 2, label: '📱 设备管理', children: [{ id: 201, label: '查看设备' }, { id: 202, label: '设备设置' }, { id: 203, label: '解绑设备' }] },
  { id: 3, label: '🎙️ AI听记', children: [{ id: 301, label: '听记管理' }, { id: 302, label: '查看AI分析' }, { id: 303, label: '评价模板' }, { id: 304, label: '评价策略' }] },
  { id: 4, label: '🎯 线索管理', children: [{ id: 401, label: '查看线索' }, { id: 402, label: '跟进线索' }, { id: 403, label: '线索分配' }] },
  { id: 5, label: '🏆 金牌销售', children: [{ id: 501, label: '销售画像' }, { id: 502, label: '话术库' }, { id: 503, label: '话术贡献' }] },
  { id: 6, label: '🏭 行业管理', children: [{ id: 601, label: '行业配置' }, { id: 602, label: 'AI模板管理' }, { id: 603, label: '话术审核' }] },
  { id: 7, label: '🏢 企业管理', children: [{ id: 701, label: '企业列表' }, { id: 702, label: '创建企业' }, { id: 703, label: 'AI配额管理' }] },
  { id: 8, label: '👥 员工管理', children: [{ id: 801, label: '查看员工' }, { id: 802, label: '编辑员工' }, { id: 803, label: '部门管理' }] },
  { id: 9, label: '🔐 角色权限', children: [{ id: 901, label: '角色管理' }, { id: 902, label: '权限管理' }] },
  { id: 10, label: '⚙️ 系统配置', children: [{ id: 1001, label: '系统设置' }, { id: 1002, label: '日志查看' }] }
])

const savePerms = () => { ElMessage.success('权限已保存') }
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
