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
      { path: 'audio/detail/:id', name: 'AudioDetail', component: () => import('../views/audio/AudioDetail.vue'), meta: { title: '听记详情', icon: 'Headset' } },
      { path: 'audio/template', name: 'TemplateManage', component: () => import('../views/audio/TemplateManage.vue'), meta: { title: '智能体配置', icon: 'Document' } },
      { path: 'audio/strategy', name: 'StrategyList', component: () => import('../views/audio/StrategyList.vue'), meta: { title: '我的智能体', icon: 'Tickets' } },
      { path: 'audio/product', name: 'ProductSelling', component: () => import('../views/audio/ProductSelling.vue'), meta: { title: '产品卖点配置', icon: 'Goods' } },
      { path: 'clue/list', name: 'ClueList', component: () => import('../views/clue/ClueList.vue'), meta: { title: '线索列表', icon: 'Connection' } },
      { path: 'sales/profile', name: 'SalesProfile', component: () => import('../views/sales/SalesProfile.vue'), meta: { title: '销售画像', icon: 'UserFilled' } },
      { path: 'sales/profile/:id', name: 'SalesProfileDetail', component: () => import('../views/sales/SalesProfileDetail.vue'), meta: { title: '画像详情', icon: 'UserFilled' } },
      { path: 'sales/script', name: 'ScriptLibrary', component: () => import('../views/sales/ScriptLibrary.vue'), meta: { title: '话术库', icon: 'ChatDotRound' } },
      { path: 'sales/sop', name: 'SalesSOP', component: () => import('../views/sales/SalesSOP.vue'), meta: { title: '销售SOP', icon: 'Tickets' } },
      { path: 'sales/ai-sop', name: 'AIBadgeSOP', component: () => import('../views/sales/AIBadgeSOP.vue'), meta: { title: 'AI胸牌SOP', icon: 'Tickets' } },
      { path: 'sales/sop-execute', name: 'SOPExecute', component: () => import('../views/sales/SOPExecute.vue'), meta: { title: '销售执行SOP', icon: 'Tickets' } },
      { path: 'sales/marketing', name: 'MarketingLaunch', component: () => import('../views/sales/MarketingLaunch.vue'), meta: { title: '市场推广', icon: 'Promotion' } },
      { path: 'enterprise/list', name: 'EnterpriseList', component: () => import('../views/enterprise/EnterpriseList.vue'), meta: { title: '企业列表', icon: 'OfficeBuilding' } },
      { path: 'enterprise/create', name: 'EnterpriseCreate', component: () => import('../views/enterprise/EnterpriseCreate.vue'), meta: { title: '创建企业', icon: 'Plus' } },
      { path: 'industry/list', name: 'IndustryList', component: () => import('../views/industry/IndustryList.vue'), meta: { title: '行业列表', icon: 'Grid' } },
      { path: 'industry/config', name: 'IndustryConfig', component: () => import('../views/industry/IndustryConfig.vue'), meta: { title: '行业配置', icon: 'Tools' } },
      { path: 'system/employee', name: 'EmployeeManage', component: () => import('../views/system/EmployeeManage.vue'), meta: { title: '员工管理', icon: 'User' } },
      { path: 'system/role', name: 'RoleManage', component: () => import('../views/system/RoleManage.vue'), meta: { title: '角色管理', icon: 'UserFilled' } },
      { path: 'system/permission', name: 'PermissionManage', component: () => import('../views/system/PermissionManage.vue'), meta: { title: '权限管理', icon: 'Lock' } },
      { path: 'miniapp', name: 'MiniApp', component: () => import('../views/miniapp/miniapp.vue'), meta: { title: '小程序预览', icon: 'Iphone' } },
      { path: 'legal/saas', name: 'LegalSaaS', component: () => import('../views/legal/LegalSaaS.vue'), meta: { title: 'SaaS平台法律声明', icon: 'Document' } },
      { path: 'legal/miniapp', name: 'LegalMiniApp', component: () => import('../views/legal/LegalMiniApp.vue'), meta: { title: '小程序法律声明', icon: 'Document' } },
      { path: 'manual/saas', name: 'ManualSaaS', component: () => import('../views/legal/ManualSaaS.vue'), meta: { title: 'SaaS平台使用手册', icon: 'Document' } },
      { path: 'manual/miniapp', name: 'ManualMiniApp', component: () => import('../views/legal/ManualMiniApp.vue'), meta: { title: '小程序使用手册', icon: 'Document' } },
      { path: 'ai-assistant', name: 'AiAssistant', component: () => import('../views/legal/AiAssistant.vue'), meta: { title: 'AI智能助手', icon: 'MagicStick' } },
      { path: 'model-chat', name: 'ModelChat', component: () => import('../views/legal/ModelChat.vue'), meta: { title: 'AI模型调用', icon: 'Connection' } },
      { path: 'billing/pricing', name: 'Pricing', component: () => import('../views/billing/pricing.vue'), meta: { title: '定价方案', icon: 'TrendCharts' } },
      { path: 'billing/payment', name: 'Payment', component: () => import('../views/billing/Payment.vue'), meta: { title: '确认订单', icon: 'TrendCharts' } },
      { path: 'billing/subscription', name: 'Subscription', component: () => import('../views/billing/subscription.vue'), meta: { title: '订阅管理', icon: 'TrendCharts' } },
      { path: 'billing/addon', name: 'AddonPricing', component: () => import('../views/billing/AddonPricing.vue'), meta: { title: '增值服务', icon: 'TrendCharts' } },
      { path: 'billing/package', name: 'PackagePricing', component: () => import('../views/billing/PackagePricing.vue'), meta: { title: '按套餐定价', icon: 'TrendCharts' } },
      { path: 'billing/compare', name: 'Compare', component: () => import('../views/billing/Compare.vue'), meta: { title: '方案对比', icon: 'TrendCharts' } },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
