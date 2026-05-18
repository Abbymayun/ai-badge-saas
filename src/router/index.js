import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/dashboard/Dashboard.vue'), meta: { title: '数据概览', icon: 'DataAnalysis' } },
      { path: 'device/list', name: 'DeviceList', component: () => import('../views/device/DeviceList.vue'), meta: { title: '设备列表', icon: 'Monitor' } },
      { path: 'device/setting', name: 'DeviceSetting', component: () => import('../views/device/DeviceSetting.vue'), meta: { title: '设备设置', icon: 'Setting' } },
      { path: 'audio/list', name: 'AudioList', component: () => import('../views/audio/AudioList.vue'), meta: { title: '听记管理', icon: 'Headset' } },
      { path: 'audio/template', name: 'TemplateManage', component: () => import('../views/audio/TemplateManage.vue'), meta: { title: '评价模板管理', icon: 'Document' } },
      { path: 'audio/strategy', name: 'StrategyList', component: () => import('../views/audio/StrategyList.vue'), meta: { title: '我的评价策略', icon: 'Tickets' } },
      { path: 'audio/product', name: 'ProductSelling', component: () => import('../views/audio/ProductSelling.vue'), meta: { title: '产品卖点配置', icon: 'Goods' } },
      { path: 'clue/list', name: 'ClueList', component: () => import('../views/clue/ClueList.vue'), meta: { title: '线索列表', icon: 'Connection' } },
      { path: 'sales/profile', name: 'SalesProfile', component: () => import('../views/sales/SalesProfile.vue'), meta: { title: '销售画像', icon: 'UserFilled' } },
      { path: 'sales/script', name: 'ScriptLibrary', component: () => import('../views/sales/ScriptLibrary.vue'), meta: { title: '话术库', icon: 'ChatDotRound' } },
      { path: 'enterprise/list', name: 'EnterpriseList', component: () => import('../views/enterprise/EnterpriseList.vue'), meta: { title: '企业列表', icon: 'OfficeBuilding' } },
      { path: 'enterprise/create', name: 'EnterpriseCreate', component: () => import('../views/enterprise/EnterpriseCreate.vue'), meta: { title: '创建企业', icon: 'Plus' } },
      { path: 'industry/list', name: 'IndustryList', component: () => import('../views/industry/IndustryList.vue'), meta: { title: '行业列表', icon: 'Grid' } },
      { path: 'industry/config', name: 'IndustryConfig', component: () => import('../views/industry/IndustryConfig.vue'), meta: { title: '行业配置', icon: 'Tools' } },
      { path: 'system/employee', name: 'EmployeeManage', component: () => import('../views/system/EmployeeManage.vue'), meta: { title: '员工管理', icon: 'User' } },
      { path: 'system/role', name: 'RoleManage', component: () => import('../views/system/RoleManage.vue'), meta: { title: '角色管理', icon: 'UserFilled' } },
      { path: 'system/permission', name: 'PermissionManage', component: () => import('../views/system/PermissionManage.vue'), meta: { title: '权限管理', icon: 'Lock' } },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
