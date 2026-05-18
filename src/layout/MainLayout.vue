<template>
  <div class="main-layout">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo-area">
        <img src="https://img.icons8.com/bubbles/50/artificial-intelligence.png" alt="AI" style="width:32px;height:32px" v-if="!isCollapse" />
        <span v-if="!isCollapse" class="logo-text">AI智能胸牌</span>
        <img src="https://img.icons8.com/bubbles/50/artificial-intelligence.png" alt="AI" style="width:32px;height:32px" v-else />
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据概览</template>
        </el-menu-item>

        <el-sub-menu index="device">
          <template #title><el-icon><Monitor /></el-icon><span>设备管理</span></template>
          <el-menu-item index="/device/list">设备列表</el-menu-item>
          <el-menu-item index="/device/setting">设备设置</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="audio">
          <template #title><el-icon><Headset /></el-icon><span>AI听记</span></template>
          <el-menu-item index="/audio/list">听记管理</el-menu-item>
          <el-menu-item index="/audio/template">评价模板管理</el-menu-item>
          <el-menu-item index="/audio/strategy">我的评价策略</el-menu-item>
          <el-menu-item index="/audio/product">产品卖点配置</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="clue">
          <template #title><el-icon><Connection /></el-icon><span>线索管理</span></template>
          <el-menu-item index="/clue/list">线索列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="sales">
          <template #title><el-icon><Trophy /></el-icon><span>金牌销售</span></template>
          <el-menu-item index="/sales/profile">销售画像</el-menu-item>
          <el-menu-item index="/sales/script">话术库</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/enterprise/list">
          <el-icon><OfficeBuilding /></el-icon>
          <template #title>企业管理</template>
        </el-menu-item>

        <el-sub-menu index="industry">
          <template #title><el-icon><Grid /></el-icon><span>行业管理</span></template>
          <el-menu-item index="/industry/list">行业列表</el-menu-item>
          <el-menu-item index="/industry/config">行业配置</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="system">
          <template #title><el-icon><Setting /></el-icon><span>系统管理</span></template>
          <el-menu-item index="/system/employee">员工管理</el-menu-item>
          <el-menu-item index="/system/role">角色管理</el-menu-item>
          <el-menu-item index="/system/permission">权限管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse"><Expand v-if="isCollapse" /><Fold v-else /></el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-select v-model="currentEnterprise" size="small" style="width: 180px; margin-right: 16px;">
            <el-option v-for="e in enterprises" :key="e.value" :label="e.label" :value="e.value" />
          </el-select>
          <el-badge :value="3" :max="99" style="margin-right: 16px; cursor: pointer;">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" style="background: #409EFF;">S</el-avatar>
              <span style="margin-left: 8px;">superAdmin</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>系统设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapse = ref(false)
const currentEnterprise = ref('lierda')

const enterprises = [
  { label: '利尔达集团', value: 'lierda' },
  { label: '杭州测试企业', value: 'hangzhou-test' },
  { label: '深圳演示企业', value: 'shenzhen-demo' }
]

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta?.title || '')
</script>

<style scoped>
.main-layout { display: flex; height: 100vh; }
.sidebar { background: #304156; overflow-y: auto; overflow-x: hidden; transition: width 0.3s; }
.sidebar::-webkit-scrollbar { width: 0; }
.logo-area { height: 60px; display: flex; align-items: center; justify-content: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.logo-text { color: #fff; font-size: 16px; font-weight: bold; white-space: nowrap; }
.main-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.header { height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.header-left { display: flex; align-items: center; gap: 16px; }
.header-right { display: flex; align-items: center; }
.collapse-btn { font-size: 20px; cursor: pointer; color: #606266; }
.collapse-btn:hover { color: #409EFF; }
.user-info { display: flex; align-items: center; cursor: pointer; color: #606266; }
.content { background: #f0f2f5; overflow-y: auto; padding: 20px; }
</style>
