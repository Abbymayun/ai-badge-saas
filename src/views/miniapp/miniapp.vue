<template>
  <div class="mp-wrapper">
    <!-- 手机外框 -->
    <div class="phone-frame">
      <!-- 状态栏 -->
      <div class="pf-statusbar">
        <span>9:41</span>
        <span>📶 🔵 📶 🔋 90%</span>
      </div>
      <!-- 导航栏 -->
      <div class="pf-navbar">
        <span class="pfn-back" v-if="currentPage !== 'home'" @click="goPage('home')">‹</span>
        <span class="pfn-title">{{ pageTitle }}</span>
        <span class="pfn-actions">
          <span class="pfn-dot" @click="showMenu=!showMenu">···</span>
          <span class="pfn-circle">○</span>
        </span>
      </div>

      <!-- 页面内容 -->
      <div class="pf-content" @scroll.passive>
        <!-- ========== 首页 ========== -->
        <div v-if="currentPage==='home'" class="page-home">
          <div class="ph-status">
            <span class="phs-online"><span class="phs-dot"></span>在线</span>
            <span class="phs-battery">🔋 90%</span>
          </div>
          <div class="ph-device">
            <div class="phd-screen">
              <div class="phds-brand">Lierda</div>
              <div class="phds-name">利小达</div>
              <div class="phds-info"><span>产品部</span><span>项目经理</span><span>NO: 920249</span></div>
            </div>
            <div class="phd-label"><span class="phd-dot"></span>设备已绑定</div>
          </div>
          <div class="ph-user-card">
            <div class="phuc-row">
              <div class="phuc-main"><span class="phuc-name">杨旭东</span><span class="phuc-sub">绑定人员</span></div>
              <div class="phuc-storage"><span>1.2G/120G</span></div>
            </div>
            <div class="phuc-progress"><div class="phucp-fill" style="width:1%"></div></div>
          </div>
          <div class="ph-quick-actions">
            <div class="phqa-item" @click="goPage('recording')"><span class="phqa-icon">🎙️</span><span>新建录音</span></div>
            <div class="phqa-item" @click="goPage('customers')"><span class="phqa-icon">👤</span><span>客户线索</span></div>
            <div class="phqa-item" @click="goPage('dataOverview')"><span class="phqa-icon">📊</span><span>数据概览</span></div>
            <div class="phqa-item" @click="goPage('profile')"><span class="phqa-icon">⚙️</span><span>设备设置</span></div>
          </div>
        </div>

        <!-- ========== 录音列表 ========== -->
        <div v-if="currentPage==='recording'" class="page-recording">
          <div class="pr-search"><span class="prs-icon">🔍</span><input placeholder="请输入" v-model="recSearch" /></div>
          <div class="pr-filters"><span @click="recFilter=recFilter===''?'generated':''">AI报告状态 ▾</span><span>时间筛选 ▾</span></div>
          <div class="pr-header">录音列表 <span class="prh-ai">🤖 AI</span></div>
          <div v-for="r in filteredRecordings" :key="r.id" class="pr-item" @click="goRecordingDetail(r)">
            <span class="pri-play" :class="{playing: r.id===playingId}" @click.stop="togglePlay(r.id)">{{ r.id===playingId?'⏸':'▶' }}</span>
            <div class="pri-info"><div class="pri-name">{{ r.name }}</div><div class="pri-meta">{{ r.date }} · {{ r.size }}</div><div v-if="r.id===playingId" class="pri-progress"><div class="prip-fill" :style="{width:playProgress+'%'}"></div></div></div>
            <span class="pri-status" :class="r.status">{{ statusLabel(r.status) }}</span>
          </div>
        </div>

        <!-- ========== 客户列表 ========== -->
        <div v-if="currentPage==='customers'" class="page-customers">
          <div class="pr-search"><span class="prs-icon">🔍</span><input placeholder="搜索客户名称" /></div>
          <div v-for="c in customerList" :key="c.id" class="pc-item" @click="goCustomerDetail(c)">
            <div class="pci-avatar" :style="{background:['#409EFF','#67C23A','#E6A23C','#F56C6C'][c.id%4]}">{{ c.name[0] }}</div>
            <div class="pci-info"><div class="pci-name">{{ c.name }}<span class="pci-tag">{{ c.level }}</span></div><div class="pci-meta">{{ c.company }} · {{ c.industry }}</div></div>
            <span class="pci-arrow">›</span>
          </div>
        </div>

        <!-- ========== 我的 ========== -->
        <div v-if="currentPage==='profile'" class="page-profile">
          <div class="pp-user">
            <div class="ppu-avatar">杨</div>
            <div class="ppu-info"><div class="ppu-name">杨旭东 <span class="ppu-setting" @click="showSetting=true">⚙️</span></div><div class="ppu-meta"><span>🏠 研发部门</span><span>📞 17495839485</span><span>👤 matjidl973</span></div></div>
          </div>
          <div class="pp-device">
            <div class="ppd-header"><span>设备信息</span><span class="ppd-status"><span class="ppd-dot"></span>已绑定</span></div>
            <div class="ppd-body">
              <div class="ppd-screen-sm">Lierda<br>利小达</div>
              <div class="ppd-detail"><div>XXXXXXXX设备</div><div>sin27342</div><div>电量: 80%</div><div>绑定时间: 2023-01-23</div><div class="ppd-unbind" @click="unbindDevice">解绑设备</div></div>
            </div>
          </div>
        </div>

        <!-- ========== 数据概览 ========== -->
        <div v-if="currentPage==='dataOverview'" class="page-data">
          <div class="pd-stats">
            <div class="pds-item"><span class="pds-val">1,720</span><span class="pds-lbl">新增客户</span></div>
            <div class="pds-item"><span class="pds-val">330</span><span class="pds-lbl">高意向</span></div>
            <div class="pds-item"><span class="pds-val">156</span><span class="pds-lbl">成交客户</span></div>
            <div class="pds-item"><span class="pds-val">76</span><span class="pds-lbl">能力均分</span></div>
          </div>
          <div class="pd-card"><div class="pdc-title">📊 近7天客户趋势</div><div class="pdc-chart"><div v-for="i in 7" :key="i" class="pdc-bar" :style="{height:(20+Math.random()*60)+'px'}"></div></div></div>
          <div class="pd-card"><div class="pdc-title">📈 设备使用率</div><div class="pdc-big-num">84.3%</div><div class="pdc-sub">已绑定312台 · 在线263台</div></div>
        </div>

        <!-- ========== 录音详情/AI总结 ========== -->
        <div v-if="currentPage==='recording-detail'" class="page-detail">
          <div class="prd-header">{{ detailRecording?.name }}</div>
          <div class="prd-meta">{{ detailRecording?.date }} · {{ detailRecording?.size }}</div>
          <div class="prd-tabs">
            <span :class="{active:detailTab==='transcript'}" @click="detailTab='transcript'">转写</span>
            <span :class="{active:detailTab==='summary'}" @click="detailTab='summary'">AI总结</span>
          </div>
          <!-- 转写 -->
          <div v-if="detailTab==='transcript'" class="prd-transcript">
            <div v-for="(line,idx) in transcriptLines" :key="idx" class="prdt-line" :class="line.role"><span class="prdt-speaker">{{ line.speaker }}</span><span class="prdt-text">{{ line.text }}</span></div>
          </div>
          <!-- AI总结 -->
          <div v-if="detailTab==='summary'" class="prd-summary">
            <div class="prds-loading" v-if="aiLoading">
              <div class="prdsl-spinner"></div>
              <span>AI正在分析中...</span>
              <div class="prdsl-steps"><span class="done">✓ 语音转写完成</span><span class="active">⟳ 智能分析中</span><span>客户画像生成</span><span>报告输出</span></div>
            </div>
            <div v-else class="prds-done">
              <div class="prdsd-score"><span class="prdsds-num">88</span><span class="prdsds-label">综合评分</span></div>
              <div class="prdsd-section"><h4>客户画像</h4><p>张总，银行零售部总经理，45-50岁，理性务实风格。关注数字化转型和客户经理外拓管理效率。</p></div>
              <div class="prdsd-section"><h4>需求分析</h4><p>1.提升外拓拜访效率 2.客户经理过程管理 3.数据安全合规</p></div>
              <div class="prdsd-section"><h4>行动建议</h4><p>发送详细方案+案例，安排样机演示，推动20人试用方案</p></div>
            </div>
          </div>
        </div>

        <!-- ========== 客户详情 ========== -->
        <div v-if="currentPage==='customer-detail'" class="page-cust-detail">
          <div class="pcd-header">{{ detailCustomer?.name }}</div>
          <div class="pcd-avatar-big">{{ detailCustomer?.name?.[0] }}</div>
          <div class="pcd-info"><div>{{ detailCustomer?.company }}</div><div>{{ detailCustomer?.industry }}</div><div>意向等级：{{ detailCustomer?.level }}</div></div>
          <div class="pcd-actions"><span @click="goPage('recording')">📋 关联录音</span><span @click="newRecording">🎙️ 新建跟进</span></div>
        </div>
      </div>

      <!-- 底部导航 -->
      <div class="pf-tabbar">
        <div class="pft-item" :class="{active:['home','dataOverview'].includes(currentPage)}" @click="goPage('home')"><span>🏠</span><span>首页</span></div>
        <div class="pft-item" :class="{active:['recording','recording-detail'].includes(currentPage)}" @click="goPage('recording')"><span>🎤</span><span>录音列表</span></div>
        <div class="pft-item" :class="{active:['customers','customer-detail'].includes(currentPage)}" @click="goPage('customers')"><span>📄</span><span>客户线索</span></div>
        <div class="pft-item" :class="{active:currentPage==='profile'}" @click="goPage('profile')"><span>👤</span><span>我的</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentPage = ref('home')
const showMenu = ref(false)
const recSearch = ref('')
const recFilter = ref('')
const playingId = ref(null)
const playProgress = ref(35)
const detailTab = ref('transcript')
const aiLoading = ref(false)
const detailRecording = ref(null)
const detailCustomer = ref(null)
const showSetting = ref(false)

const pageTitle = computed(() => {
  const m = { home:'首页', recording:'录音列表', customers:'客户线索', profile:'我的', dataOverview:'数据概览', 'recording-detail':'录音详情', 'customer-detail':'客户详情' }
  return m[currentPage.value] || ''
})

const goPage = (p) => { currentPage.value = p; if (p==='recording') { detailRecording.value = null } }

const statusLabel = (s) => ({ generated:'已生成', generating:'生成中', failed:'生成失败' }[s]||s)

// 录音列表
const recordings = ref([
  { id:1, name:'音频20260106-083', date:'2025-05-10 16:53', size:'3.07MB', status:'generated', duration:'15:00' },
  { id:2, name:'音频20260106-082', date:'2025-05-10 14:20', size:'5.12MB', status:'generated', duration:'22:30' },
  { id:3, name:'音频20260106-081', date:'2025-05-10 10:05', size:'2.45MB', status:'generating', duration:'10:15' },
  { id:4, name:'音频20260105-078', date:'2025-05-09 16:30', size:'4.80MB', status:'failed', duration:'18:00' },
  { id:5, name:'音频20260105-077', date:'2025-05-09 14:00', size:'3.22MB', status:'generated', duration:'12:00' }
])
const filteredRecordings = computed(() => {
  let list = recordings.value
  if (recSearch.value) list = list.filter(r => r.name.includes(recSearch.value))
  if (recFilter.value) list = list.filter(r => r.status === recFilter.value)
  return list
})

const togglePlay = (id) => { playingId.value = playingId.value===id ? null : id }
const goRecordingDetail = (r) => { detailRecording.value = r; currentPage.value = 'recording-detail'; aiLoading.value = true; setTimeout(()=>{aiLoading.value=false},2000) }

// 客户列表
const customerList = ref([
  { id:1, name:'张总', company:'兴业银行', industry:'银行金融', level:'高意向' },
  { id:2, name:'李先生', company:'XX汽车4S店', industry:'汽车销售', level:'中意向' },
  { id:3, name:'赵经理', company:'XX保险经纪', industry:'保险', level:'高意向' },
  { id:4, name:'刘总', company:'XX房地产', industry:'房地产', level:'低意向' }
])
const goCustomerDetail = (c) => { detailCustomer.value = c; currentPage.value = 'customer-detail' }

// 转写内容
const transcriptLines = [
  { speaker:'杨旭东', role:'self', text:'张总您好，感谢您抽出时间。我是利尔达AI科技的小杨，今天主要是想跟您聊聊我们AI智能胸牌在银行客户经理外拓场景的应用。' },
  { speaker:'张总', role:'other', text:'你好小杨。我们行最近确实在推进数字化转型，你们这个产品具体是怎么用的？' },
  { speaker:'杨旭东', role:'self', text:'我们的AI智能胸牌非常轻便，只有28克，佩戴后全程自动录音，AI会自动转写成文字并生成分析报告。' },
  { speaker:'张总', role:'other', text:'这个挺有意思。不过我们比较关心数据安全，金融行业对合规要求很高。' },
  { speaker:'杨旭东', role:'self', text:'张总您放心，我们通过了等保三级认证，数据全程加密传输，支持私有化部署。招商银行就是我们的客户。' }
]

const unbindDevice = () => { if (confirm('确定解绑设备？')) alert('设备已解绑') }
const newRecording = () => { goPage('recording') }
</script>

<style scoped>
.mp-wrapper{display:flex;justify-content:flex-start;padding:16px;min-height:calc(100vh - 100px)}
.phone-frame{width:390px;height:760px;background:#f5f5f7;border-radius:36px;border:6px solid #1a1a2e;overflow:hidden;display:flex;flex-direction:column;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.pf-statusbar{display:flex;justify-content:space-between;padding:8px 24px 0;font-size:11px;font-weight:600;color:#1a1a2e;background:#fff}
.pf-navbar{display:flex;align-items:center;justify-content:center;padding:8px 16px;background:#fff;position:relative;border-bottom:1px solid #f0f0f0}
.pfn-back{position:absolute;left:16px;font-size:28px;color:#007AFF;cursor:pointer;line-height:1}
.pfn-title{font-size:17px;font-weight:600;color:#1a1a2e}
.pfn-actions{position:absolute;right:16px;display:flex;gap:12px;font-size:14px;color:#007AFF;cursor:pointer}
.pfn-circle{font-size:16px;border:1.5px solid #007AFF;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center}
.pf-content{flex:1;overflow-y:auto;background:#f5f5f7;padding:16px}
.pf-tabbar{display:flex;background:#fff;border-top:1px solid #e5e5ea;padding:6px 0 20px}
.pft-item{flex:1;text-align:center;font-size:10px;color:#8e8e93;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}.pft-item span:first-child{font-size:20px}.pft-item.active{color:#007AFF}

/* 首页 */
.page-home{}.ph-status{display:flex;justify-content:space-between;margin-bottom:12px}.phs-online{display:flex;align-items:center;gap:4px;font-size:12px;color:#34C759;background:#E8F8ED;padding:2px 10px;border-radius:10px}.phs-dot{width:6px;height:6px;background:#34C759;border-radius:50%}.phs-battery{font-size:12px;color:#8e8e93}
.ph-device{text-align:center;margin:16px 0}.phd-screen{background:linear-gradient(135deg,#1a1a2e,#2d2d44);border-radius:16px;padding:24px;color:#fff;display:inline-block;min-width:200px}.phds-brand{font-size:14px;font-style:italic;opacity:.8}.phds-name{font-size:28px;font-weight:700;margin:8px 0}.phds-info{font-size:10px;opacity:.7;display:flex;gap:12px;justify-content:center}.phd-label{font-size:13px;color:#8e8e93;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:4px}.phd-dot{width:6px;height:6px;background:#34C759;border-radius:50%}
.ph-user-card{background:#fff;border-radius:16px;padding:16px;margin-bottom:16px}.phuc-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.phuc-name{font-size:17px;font-weight:600;display:block}.phuc-sub{font-size:11px;color:#8e8e93}.phuc-progress{height:4px;background:#e5e5ea;border-radius:2px}.phucp-fill{height:4px;background:#007AFF;border-radius:2px;transition:.5s}
.ph-quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px}.phqa-item{background:#fff;border-radius:14px;padding:16px;text-align:center;font-size:13px;color:#1a1a2e;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 1px 4px rgba(0,0,0,.04)}.phqa-icon{font-size:28px}

/* 录音列表 */
.pr-search{background:#fff;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:6px;margin-bottom:8px}.prs-icon{font-size:14px}.pr-search input{border:none;outline:none;flex:1;font-size:14px;background:transparent}
.pr-filters{display:flex;gap:12px;margin-bottom:12px;font-size:13px;color:#007AFF}.pr-filters span{cursor:pointer}
.pr-header{font-size:16px;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px}.prh-ai{font-size:12px;background:#007AFF;color:#fff;padding:1px 6px;border-radius:4px}
.pr-item{display:flex;align-items:center;gap:10px;background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;cursor:pointer}
.pri-play{width:36px;height:36px;border-radius:50%;background:#007AFF;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}.pri-play.playing{background:#34C759}
.pri-info{flex:1;min-width:0}.pri-name{font-size:14px;font-weight:600;color:#1a1a2e}.pri-meta{font-size:11px;color:#8e8e93;margin-top:2px}.pri-progress{height:3px;background:#e5e5ea;border-radius:2px;margin-top:6px}.prip-fill{height:3px;background:#007AFF;border-radius:2px;transition:.3s}
.pri-status{font-size:11px;padding:2px 8px;border-radius:8px;flex-shrink:0}.pri-status.generated{color:#34C759;background:#E8F8ED}.pri-status.generating{color:#007AFF;background:#E8F0FE}.pri-status.failed{color:#FF3B30;background:#FFEEEE}

/* 客户列表 */
.pc-item{display:flex;align-items:center;gap:10px;background:#fff;border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer}.pci-avatar{width:40px;height:40px;border-radius:50%;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.pci-info{flex:1}.pci-name{font-size:14px;font-weight:600;color:#1a1a2e}.pci-tag{font-size:10px;background:#FFF3E0;color:#E65100;padding:1px 6px;border-radius:4px;margin-left:6px}.pci-meta{font-size:11px;color:#8e8e93;margin-top:2px}.pci-arrow{font-size:18px;color:#c7c7cc}

/* 我的 */
.pp-user{background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;display:flex;gap:12px}.ppu-avatar{width:50px;height:50px;border-radius:50%;background:#007AFF;color:#fff;font-size:22px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.ppu-name{font-size:17px;font-weight:600;display:flex;align-items:center;gap:8px}.ppu-setting{font-size:18px;cursor:pointer}.ppu-meta{font-size:11px;color:#8e8e93;margin-top:4px;display:flex;flex-direction:column;gap:2px}
.pp-device{background:#fff;border-radius:16px;padding:16px}.ppd-header{display:flex;justify-content:space-between;font-size:15px;font-weight:600;margin-bottom:12px}.ppd-status{font-size:12px;color:#34C759;display:flex;align-items:center;gap:4px}.ppd-dot{width:6px;height:6px;background:#34C759;border-radius:50%}.ppd-body{display:flex;gap:12px}.ppd-screen-sm{background:#1a1a2e;color:#fff;border-radius:10px;padding:12px 16px;font-size:12px;text-align:center;line-height:1.6;flex-shrink:0}.ppd-detail{font-size:12px;color:#8e8e93;line-height:1.8}.ppd-unbind{color:#FF3B30;cursor:pointer;margin-top:4px}

/* 数据概览 */
.pd-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}.pds-item{background:#fff;border-radius:12px;padding:14px;text-align:center}.pds-val{font-size:24px;font-weight:700;color:#007AFF;display:block}.pds-lbl{font-size:11px;color:#8e8e93;margin-top:2px}
.pd-card{background:#fff;border-radius:12px;padding:14px;margin-bottom:12px}.pdc-title{font-size:14px;font-weight:600;margin-bottom:10px}.pdc-chart{display:flex;align-items:flex-end;gap:8px;height:80px}.pdc-bar{flex:1;background:linear-gradient(to top,#007AFF,#409EFF);border-radius:4px 4px 0 0;min-height:4px}.pdc-big-num{font-size:32px;font-weight:700;color:#007AFF}.pdc-sub{font-size:12px;color:#8e8e93;margin-top:4px}

/* 录音详情 */
.prd-header{font-size:16px;font-weight:600;margin-bottom:4px}.prd-meta{font-size:12px;color:#8e8e93;margin-bottom:12px}
.prd-tabs{display:flex;gap:0;margin-bottom:12px;background:#fff;border-radius:10px;overflow:hidden}.prd-tabs span{flex:1;text-align:center;padding:10px;font-size:14px;cursor:pointer;color:#8e8e93}.prd-tabs span.active{color:#007AFF;background:#E8F0FE;font-weight:600}
.prdt-line{display:flex;gap:8px;padding:8px;margin-bottom:4px;border-radius:8px}.prdt-line.self{background:#E8F0FE}.prdt-line.other{background:#f5f5f7}.prdt-speaker{font-size:12px;font-weight:600;width:50px;flex-shrink:0;color:#007AFF}.prdt-line.other .prdt-speaker{color:#E6A23C}.prdt-text{font-size:13px;color:#1a1a2e;line-height:1.6}
.prds-loading{text-align:center;padding:40px 20px}.prdsl-spinner{width:36px;height:36px;border:3px solid #e5e5ea;border-top-color:#007AFF;border-radius:50%;margin:0 auto 16px;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.prdsl-steps{display:flex;flex-direction:column;gap:8px;margin-top:16px;font-size:13px}.prdsl-steps span{color:#8e8e93}.prdsl-steps span.done{color:#34C759}.prdsl-steps span.active{color:#007AFF;font-weight:600}
.prdsd-score{text-align:center;padding:16px}.prdsds-num{font-size:48px;font-weight:700;color:#007AFF}.prdsds-label{font-size:13px;color:#8e8e93;display:block}.prdsd-section{background:#fff;border-radius:10px;padding:12px;margin-bottom:8px}.prdsd-section h4{font-size:14px;color:#1a1a2e;margin:0 0 6px}.prdsd-section p{font-size:13px;color:#606266;line-height:1.6;margin:0}

/* 客户详情 */
.pcd-header{font-size:18px;font-weight:700;margin-bottom:16px}.pcd-avatar-big{width:70px;height:70px;border-radius:50%;background:#007AFF;color:#fff;font-size:32px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}.pcd-info{text-align:center;font-size:14px;color:#606266;line-height:1.8;margin-bottom:16px}.pcd-actions{display:flex;gap:12px;justify-content:center}.pcd-actions span{background:#fff;border-radius:10px;padding:12px 20px;font-size:14px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.04)}
</style>
