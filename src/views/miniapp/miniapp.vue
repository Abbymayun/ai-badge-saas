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
          <div class="pp-menu">
            <div class="ppm-item" @click="goPage('guide')"><span class="ppm-icon">📖</span><span>操作使用说明</span><span class="ppm-arrow">›</span></div>
            <div class="ppm-item"><span class="ppm-icon">🔔</span><span>消息通知</span><span class="ppm-arrow">›</span></div>
            <div class="ppm-item"><span class="ppm-icon">ℹ️</span><span>关于我们</span><span class="ppm-arrow">›</span></div>
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

        <!-- ========== 录音详情 ========== -->
        <div v-if="currentPage==='recording-detail'" class="page-detail">
          <div class="prd-header">{{ detailRecording?.name }}</div>
          <div class="prd-meta">{{ detailRecording?.date }} · {{ detailRecording?.size }} · {{ detailRecording?.duration }}</div>
          <div class="prd-tabs">
            <span :class="{active:detailTab==='summary'}" @click="detailTab='summary'">AI总结</span>
            <span :class="{active:detailTab==='transcript'}" @click="detailTab='transcript'">转写</span>
            <span :class="{active:detailTab==='chapters'}" @click="detailTab='chapters'">章节速览</span>
            <span :class="{active:detailTab==='info'}" @click="detailTab='info'">基本信息</span>
          </div>
          <!-- AI总结 -->
          <div v-if="detailTab==='summary'" class="prd-summary">
            <div class="prds-loading" v-if="aiLoading">
              <div class="prdsl-spinner"></div><span>AI正在分析中...</span>
              <div class="prdsl-steps"><span class="done">✓ 语音转写完成</span><span class="active">⟳ 智能分析中</span><span>客户画像生成</span><span>报告输出</span></div>
            </div>
            <div v-else class="prds-done">
              <div class="prdsd-score-card">
                <div class="prdsds-left"><span class="prdsds-num">88</span><span class="prdsds-label">综合评分</span></div>
                <div class="prdsds-right"><div class="prdsdsr-item"><span>需求挖掘</span><span style="color:#34C759;">95</span></div><div class="prdsdsr-item"><span>产品介绍</span><span style="color:#007AFF;">91</span></div><div class="prdsdsr-item"><span>异议处理</span><span style="color:#FF9500;">82</span></div></div>
              </div>
              <div class="prdsd-section"><h4>👤 客户画像</h4><p>张总，银行零售部总经理，45-50岁。理性务实，注重合规和数据安全。当前阶段：数字化转型推进中，对外拓管理效率提升有迫切需求。</p></div>
              <div class="prdsd-section"><h4>💡 需求洞察</h4><p>1. 提升外拓拜访效率——客户经理外出过程无法量化管理<br>2. 优秀经验复制——新人上手周期长，Top Sales经验难沉淀<br>3. 数据安全合规——金融行业对数据不出行有硬性要求</p></div>
              <div class="prdsd-section"><h4>🧭 沟通逻辑</h4><div class="prdsd-flow"><span v-for="(s,i) in ['价值澄清','差异对比','场景落地','安全合规','案例佐证','试用推进']" :key="i" class="prdsdf-step">{{ i+1 }}. {{ s }}</span></div></div>
              <div class="prdsd-section highlight"><h4>⭐ 亮点</h4><p>• 精准识别客户三大痛点，开场3个问题锁定核心需求<br>• 产品介绍贴合银行外拓场景，价值传递清晰<br>• 招商银行案例有效建立信任</p></div>
              <div class="prdsd-section improve"><h4>📈 提升点</h4><p>• 可补充更多ROI数据增强说服力<br>• 建议更主动确认决策流程和时间节点</p></div>
              <div class="prdsd-section action"><h4>📝 下一步建议</h4><p>1. 今日发送招商银行详细案例+方案<br>2. 安排下周三带样机现场演示<br>3. 推动20人3个月免费试用方案</p></div>
            </div>
          </div>
          <!-- 转写 -->
          <div v-if="detailTab==='transcript'" class="prd-transcript">
            <div v-for="(line,idx) in transcriptLines" :key="idx" class="prdt-line" :class="line.role"><span class="prdt-time">{{ line.time }}</span><span class="prdt-speaker">{{ line.speaker }}</span><span class="prdt-text">{{ line.text }}</span></div>
          </div>
          <!-- 章节速览 -->
          <div v-if="detailTab==='chapters'" class="prd-chapters">
            <div v-for="(ch,idx) in chapters" :key="idx" class="prdc-item" @click="seekChapter(ch)">
              <span class="prdc-time">{{ ch.time }}</span>
              <div class="prdc-info"><span class="prdc-title">{{ ch.title }}</span><span class="prdc-desc">{{ ch.desc }}</span></div>
            </div>
          </div>
          <!-- 基本信息 -->
          <div v-if="detailTab==='info'" class="prd-info">
            <div class="prdi-row"><span>录音时长</span><span>{{ detailRecording?.duration }}</span></div>
            <div class="prdi-row"><span>文件大小</span><span>{{ detailRecording?.size }}</span></div>
            <div class="prdi-row"><span>录制时间</span><span>{{ detailRecording?.date }}</span></div>
            <div class="prdi-row"><span>设备SN</span><span>1B012617000045</span></div>
            <div class="prdi-row"><span>绑定人员</span><span>杨旭东</span></div>
            <div class="prdi-row"><span>AI分析状态</span><span style="color:#34C759;">已完成</span></div>
          </div>
        </div>

        <!-- ========== 操作说明 ========== -->
        <div v-if="currentPage==='guide'" class="page-guide">
          <div class="pg-device-visual">
            <div class="pgdv-body">
              <div class="pgdv-btn">①</div>
              <div class="pgdv-switch">②</div>
              <div class="pgdv-led">③</div>
              <div class="pgdv-mic1">④</div>
              <div class="pgdv-mic2">⑤</div>
              <div class="pgdv-screen-label">⑥ 显示屏</div>
              <div class="pgdv-pin">⑦ 别针(背)</div>
              <div class="pgdv-charge">⑧ 充电口(底)</div>
            </div>
            <div class="pgdv-label">产品外观说明</div>
          </div>

          <div class="pg-section" v-for="(sec, idx) in guideSections" :key="idx">
            <div class="pgs-header"><span class="pgs-num">{{ ['一','二','三','四','五','六','七','八'][idx] }}</span><span class="pgs-title">{{ sec.title }}</span></div>
            <div class="pgs-body">
              <div v-for="(item, iidx) in sec.items" :key="iidx" class="pgsi-item">
                <div class="pgsi-label" :class="item.type">{{ item.label }}</div>
                <div class="pgsi-content" v-html="item.content"></div>
              </div>
            </div>
          </div>
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
  const m = { home:'首页', recording:'录音列表', customers:'客户线索', profile:'我的', dataOverview:'数据概览', 'recording-detail':'录音详情', 'customer-detail':'客户详情', guide:'操作使用说明' }
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
  { time:'00:00', speaker:'杨旭东', role:'self', text:'张总您好，感谢您抽出时间。我是利尔达AI科技的小杨，今天主要是想跟您聊聊我们AI智能胸牌在银行客户经理外拓场景的应用。' },
  { time:'00:45', speaker:'张总', role:'other', text:'你好小杨。我们行最近确实在推进数字化转型，你们这个产品具体是怎么用的？' },
  { time:'01:20', speaker:'杨旭东', role:'self', text:'我们的AI智能胸牌非常轻便，只有28克，佩戴后全程自动录音，AI会自动转写成文字并生成分析报告。' },
  { time:'02:10', speaker:'张总', role:'other', text:'这个挺有意思。不过我们比较关心数据安全，金融行业对合规要求很高。' },
  { time:'03:00', speaker:'杨旭东', role:'self', text:'张总您放心，我们通过了等保三级认证，数据全程加密传输，支持私有化部署。招商银行就是我们的客户，他们上线后拜访量提升了40%。' }
]

// 章节速览
const chapters = [
  { time:'00:00-02:30', title:'开场破冰', desc:'自我介绍+行业话题切入，建立共鸣' },
  { time:'02:30-05:00', title:'需求挖掘', desc:'开放式提问锁定客户三大核心痛点' },
  { time:'05:00-08:00', title:'产品介绍', desc:'从硬件到AI分析全链路展示产品价值' },
  { time:'08:00-11:00', title:'异议处理', desc:'逐一回应安全、价格、对接等顾虑' },
  { time:'11:00-15:00', title:'案例佐证', desc:'招商银行案例+ROI数据建立信任' },
  { time:'15:00-18:00', title:'下一步推进', desc:'约定试用方案和后续跟进时间' }
]
const seekChapter = (ch) => { detailTab.value = 'transcript' }

const unbindDevice = () => { if (confirm('确定解绑设备？')) alert('设备已解绑') }

// 操作说明数据
const guideSections = [
  { title:'快速绑定', items:[
    { label:'步骤1', content:'扫胸牌背面二维码 → 自动跳转进入小程序', type:'step' },
    { label:'步骤2', content:'确认员工姓名、部门、工号等信息 → 点击提交', type:'step' },
    { label:'步骤3', content:'确保胸牌<b>非充电状态</b>（未连接充电线）→ 长按胸牌顶部<b>按键＞10秒</b>', type:'warn' },
    { label:'步骤4', content:'胸牌<b>绿灯闪烁</b> → 屏幕显示绑定员工<b>姓名</b> → 绑定成功 ✓', type:'done' }
  ]},
  { title:'开始 / 停止录音', items:[
    { label:'开启录音', content:'开关<b>向上拨动</b>（红色开关底座显示<b>绿点</b>）→ 指示灯<b>绿灯长亮2秒</b> → 开始录音', type:'on' },
    { label:'关闭录音', content:'开关<b>向下拨动</b>（红色开关底座<b>隐藏绿点</b>）→ 指示灯<b>绿灯闪烁2次</b> → 停止录音', type:'off' },
    { label:'隐私保护', content:'仅<b>工作时段</b>内可正常录音，<b>私人时间</b>内开关上下拨动均无效，保障个人隐私', type:'warn' }
  ]},
  { title:'快捷按键', items:[
    { label:'POI标记', content:'录音中（开关拨至<b>ON</b>档位）→ <b>单击按键</b> → 时间轴添加POI重点标记，方便后续快速定位关键对话', type:'action' },
    { label:'手动上传', content:'未录音状态（开关拨至<b>OFF</b>档位）→ <b>单击按键</b> → 立即上传本机未同步的录音数据', type:'upload' },
    { label:'查版本信息', content:'开关拨至<b>OFF</b>档位 + <b>长按按键＞5秒</b> → 屏幕依次显示：<b>SN序列号</b> / <b>固件版本</b> / <b>硬件版本</b>', type:'info' }
  ]},
  { title:'更新 / 解绑员工信息', items:[
    { label:'第1步', content:'将录音开关拨到<b>OFF</b>位置（红色底座上<b>隐藏绿点</b>）', type:'step' },
    { label:'第2步', content:'确认胸牌<b>非充电状态</b>（未连接充电线）→ 长按顶部按键<b>＞10秒</b>', type:'step' },
    { label:'第3步', content:'指示灯<b>绿灯闪烁</b> → 胸牌进入解绑模式 → 等待平台端同步数据', type:'step' },
    { label:'成功', content:'屏幕自动更新显示<b>新绑定员工姓名</b> / 屏幕<b>恢复显示二维码</b>（可重新扫码绑定）', type:'done' }
  ]},
  { title:'数据上传（3种方式）', items:[
    { label:'方式一', content:'平台SaaS端配置<b>自动周期上传</b>（可设置每日/每周/自定义时段），胸牌在设定时间自动上传录音数据', type:'upload' },
    { label:'方式二', content:'连接充电线 → 胸牌<b>充电时自动触发上传</b>，无需人工干预，充满电的同时完成数据同步', type:'upload' },
    { label:'方式三', content:'开关拨至<b>OFF</b>档位 → <b>单击按键</b> → 立即手动触发上传，适用于需要紧急查看录音分析的场景', type:'upload' }
  ]},
  { title:'指示灯一看就懂', items:[
    { label:'绿灯快闪', content:'数据上传中 / 设备绑定流程进行中', type:'led green' },
    { label:'绿灯慢闪', content:'正在录音中（正常工作状态）', type:'led green' },
    { label:'绿灯长亮2秒', content:'录音功能已启动，开始采集音频', type:'led green' },
    { label:'绿灯闪烁2次', content:'录音功能已停止，音频采集结束', type:'led green' },
    { label:'红灯慢闪', content:'电量不足（＜10%），请尽快连接充电线', type:'led red' },
    { label:'红灯快闪', content:'设备温度异常（过高或过低），暂停工作等待温度恢复正常', type:'led red' },
    { label:'红灯常亮', content:'正在充电中，请勿拔掉充电线', type:'led red' },
    { label:'绿灯常亮', content:'充电已完成，电池已充满，可拔掉充电线正常使用', type:'led green' }
  ]},
  { title:'充电与复位', items:[
    { label:'正常充电', content:'连接Type-C充电线 → 指示灯<b>红灯常亮</b>（充电中）→ 充满后<b>绿灯常亮</b> → 拔掉充电线即可使用', type:'charge' },
    { label:'设备复位', content:'连接充电线确保供电 → <b>长按按键＞10秒</b> → 设备自动重启复位（<b>录音数据不会删除</b>，仅重置系统状态）', type:'warn' }
  ]},
  { title:'到期提醒', items:[
    { label:'胸牌端', content:'胸牌设备<b>无到期提示</b>，到期后仅可充电和解绑操作', type:'info' },
    { label:'管理端', content:'<b>小程序</b>和<b>SaaS平台</b>的设备管理页面会显示<b>设备到期日</b>，到期前30天开始提醒', type:'warn' },
    { label:'到期后', content:'设备<b>仅可充电</b>和<b>解绑</b>，<b>无法启动录音</b>功能。请联系管理员续费或更换设备', type:'off' }
  ]}
]
</script>

<style scoped>
.mp-wrapper{display:flex;justify-content:center;align-items:center;padding:16px;min-height:calc(100vh - 100px)}
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
.prd-tabs{display:flex;gap:0;margin-bottom:12px;background:#fff;border-radius:10px;overflow:hidden}.prd-tabs span{flex:1;text-align:center;padding:8px 4px;font-size:12px;cursor:pointer;color:#8e8e93}.prd-tabs span.active{color:#007AFF;background:#E8F0FE;font-weight:600}
.prdt-line{display:flex;gap:6px;padding:8px;margin-bottom:4px;border-radius:8px}.prdt-line.self{background:#E8F0FE}.prdt-line.other{background:#f5f5f7}.prdt-time{font-size:10px;color:#c7c7cc;width:36px;flex-shrink:0;padding-top:2px}.prdt-speaker{font-size:11px;font-weight:600;width:44px;flex-shrink:0;color:#007AFF}.prdt-line.other .prdt-speaker{color:#E6A23C}.prdt-text{font-size:12px;color:#1a1a2e;line-height:1.6}
.prds-loading{text-align:center;padding:40px 20px}.prdsl-spinner{width:36px;height:36px;border:3px solid #e5e5ea;border-top-color:#007AFF;border-radius:50%;margin:0 auto 16px;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.prdsl-steps{display:flex;flex-direction:column;gap:8px;margin-top:16px;font-size:13px}.prdsl-steps span{color:#8e8e93}.prdsl-steps span.done{color:#34C759}.prdsl-steps span.active{color:#007AFF;font-weight:600}
.prdsd-score-card{background:linear-gradient(135deg,#f0f5ff,#e8f4fd);border-radius:12px;padding:16px;display:flex;gap:16px;margin-bottom:10px}.prdsds-num{font-size:44px;font-weight:700;color:#007AFF}.prdsds-label{font-size:11px;color:#8e8e93;display:block}.prdsds-right{flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px}.prdsdsr-item{display:flex;justify-content:space-between;font-size:13px;color:#1a1a2e}
.prdsd-section{background:#fff;border-radius:10px;padding:12px;margin-bottom:8px}.prdsd-section h4{font-size:13px;color:#1a1a2e;margin:0 0 6px}.prdsd-section p{font-size:12px;color:#606266;line-height:1.6;margin:0}.prdsd-section.highlight{border-left:3px solid #34C759}.prdsd-section.improve{border-left:3px solid #FF9500}.prdsd-section.action{border-left:3px solid #007AFF}
.prdsd-flow{display:flex;flex-wrap:wrap;gap:4px}.prdsdf-step{background:#E8F0FE;color:#007AFF;font-size:11px;padding:2px 8px;border-radius:8px}
.prd-chapters{}.prdc-item{display:flex;gap:10px;padding:12px;background:#fff;border-radius:10px;margin-bottom:6px;cursor:pointer;align-items:center}.prdc-time{font-size:12px;color:#007AFF;font-weight:600;width:80px;flex-shrink:0}.prdc-title{font-size:14px;font-weight:600;color:#1a1a2e;display:block}.prdc-desc{font-size:11px;color:#8e8e93;margin-top:2px}
.prd-info{}.prdi-row{display:flex;justify-content:space-between;padding:12px;background:#fff;border-radius:10px;margin-bottom:6px;font-size:13px;color:#1a1a2e}.prdi-row span:first-child{color:#8e8e93}

/* 客户详情 */
.pcd-header{font-size:18px;font-weight:700;margin-bottom:16px}.pcd-avatar-big{width:70px;height:70px;border-radius:50%;background:#007AFF;color:#fff;font-size:32px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}.pcd-info{text-align:center;font-size:14px;color:#606266;line-height:1.8;margin-bottom:16px}.pcd-actions{display:flex;gap:12px;justify-content:center}.pcd-actions span{background:#fff;border-radius:10px;padding:12px 20px;font-size:14px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.04)}

/* 我的菜单 */
.pp-menu{margin-top:12px;background:#fff;border-radius:16px;overflow:hidden}.ppm-item{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #f5f5f7;cursor:pointer;font-size:14px;color:#1a1a2e}.ppm-item:last-child{border-bottom:none}.ppm-icon{font-size:18px}.ppm-arrow{margin-left:auto;color:#c7c7cc;font-size:16px}

/* 操作说明 */
.page-guide{padding-bottom:20px}
.pg-device-visual{padding:16px;margin-bottom:16px}
.pgdv-body{position:relative;width:200px;height:280px;margin:0 auto 8px;border:2px solid #e0e0e0;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fafafa}
.pgdv-btn{position:absolute;top:16px;right:16px;font-size:11px;color:#666}
.pgdv-switch{position:absolute;top:45px;right:14px;font-size:11px;color:#666}
.pgdv-led{position:absolute;top:75px;right:16px;font-size:11px;color:#666}
.pgdv-mic1{position:absolute;top:16px;left:14px;font-size:11px;color:#666}
.pgdv-mic2{position:absolute;top:45px;left:14px;font-size:11px;color:#666}
.pgdv-screen-label{font-size:13px;font-weight:700;color:#1a1a2e}
.pgdv-pin{position:absolute;bottom:50px;font-size:11px;color:#666}
.pgdv-charge{position:absolute;bottom:20px;font-size:11px;color:#666}
.pgdv-label{text-align:center;font-size:12px;color:#8e8e93;margin-top:4px}

.pg-section{margin-bottom:16px}.pgs-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}.pgs-num{width:24px;height:24px;border-radius:6px;background:#007AFF;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.pgs-title{font-size:15px;font-weight:700;color:#1a1a2e}
.pgsi-item{display:flex;gap:8px;padding:8px 10px;margin-bottom:4px;background:#fff;border-radius:10px;align-items:flex-start}.pgsi-label{font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;flex-shrink:0;min-width:55px;text-align:center}
.pgsi-label.step{background:#E8F0FE;color:#007AFF}.pgsi-label.on{background:#E8F8ED;color:#34C759}.pgsi-label.off{background:#f5f5f7;color:#8e8e93}.pgsi-label.warn{background:#FFF3E0;color:#E65100}.pgsi-label.action{background:#F3E5F5;color:#7B1FA2}.pgsi-label.info{background:#E3F2FD;color:#1565C0}.pgsi-label.upload{background:#E8F5E9;color:#2E7D32}.pgsi-label.charge{background:#FFF8E1;color:#F57F17}.pgsi-label.led{background:#f5f5f7;color:#666}.pgsi-label.green{border-left:3px solid #34C759}.pgsi-label.red{border-left:3px solid #FF3B30}
.pgsi-content{font-size:12px;color:#606266;line-height:1.7;padding-top:2px}
</style>
