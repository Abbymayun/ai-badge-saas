<template>
  <div class="audio-detail">
    <!-- 顶部信息栏 -->
    <el-card shadow="hover" class="detail-header">
      <el-row :gutter="16" align="middle">
        <el-col :span="18">
          <div class="header-info">
            <h2 class="record-title">{{ record.name }}</h2>
            <div class="record-meta">
              <el-tag size="small" type="warning">{{ record.industry }}</el-tag>
              <el-tag size="small" type="info" style="margin-left:6px;">{{ record.scene }}</el-tag>
              <span class="meta-item"><el-icon><User /></el-icon> {{ record.salesPerson }}</span>
              <span class="meta-item"><el-icon><Clock /></el-icon> {{ record.duration }}</span>
              <span class="meta-item"><el-icon><Calendar /></el-icon> {{ record.date }}</span>
              <span class="meta-item"><el-icon><iPhone /></el-icon> {{ record.device }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:right;">
          <el-button icon="Share">分享</el-button>
          <el-button icon="Download">导出报告</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 主内容区：左侧音频+转写，右侧AI报告 -->
    <el-row :gutter="16" style="margin-top:16px;">
      <!-- 左侧面板 -->
      <el-col :span="9">
        <!-- 音频播放器 -->
        <el-card shadow="hover" style="margin-bottom:16px;">
          <template #header>
            <span style="font-weight:bold;"><el-icon><Headset /></el-icon> 音频播放</span>
            <el-tag size="small" style="margin-left:8px;" type="success">AI转写已完成</el-tag>
          </template>
          <div class="audio-player">
            <div class="player-waveform">
              <div v-for="i in 40" :key="i" class="wave-bar" :style="{height: (15 + Math.random() * 35) + 'px', animationDelay: (i * 0.05) + 's'}"></div>
            </div>
            <div class="player-controls">
              <el-icon :size="32" style="cursor:pointer;color:#409EFF;"><VideoPlay /></el-icon>
              <div class="player-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width:35%"></div>
                </div>
                <span class="progress-time">06:12 / 18:30</span>
              </div>
              <el-slider v-model="playSpeed" :min="0.5" :max="2" :step="0.25" style="width:80px;" />
              <span style="font-size:12px;color:#909399;">{{ playSpeed }}x</span>
            </div>
          </div>
        </el-card>

        <!-- 转写文本 -->
        <el-card shadow="hover" class="transcript-panel">
          <template #header>
            <span style="font-weight:bold;"><el-icon><Document /></el-icon> 对话转写</span>
            <el-input v-model="transcriptSearch" placeholder="搜索对话内容" size="small" style="width:180px;margin-left:12px;" prefix-icon="Search" clearable />
          </template>
          <div class="transcript-list" ref="transcriptRef">
            <div v-for="(line, idx) in filteredTranscript" :key="idx"
              class="transcript-line" :class="{ active: currentTime >= line.start && currentTime <= line.end }"
              @click="seekTo(line.start)">
              <span class="tl-time">{{ formatTime(line.start) }}</span>
              <div class="tl-content">
                <span class="tl-speaker" :class="line.role">{{ line.speaker }}</span>
                <span class="tl-text">{{ line.text }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：AI报告 -->
      <el-col :span="15">
        <el-card shadow="hover" class="report-panel">
          <!-- 报告类型 Tabs -->
          <el-tabs v-model="activeReport" type="border-card" @tab-change="onReportChange">
            <el-tab-pane name="sales">
              <template #label><span>📊 销售能力总结</span></template>
              <SalesReport :data="reportData.sales" :template="activeTemplate" />
            </el-tab-pane>
            <el-tab-pane name="customer">
              <template #label><span>👤 客户分析总结</span></template>
              <CustomerReport :data="reportData.customer" :template="activeTemplate" />
            </el-tab-pane>
            <el-tab-pane name="product">
              <template #label><span>⭐ 产品力总结</span></template>
              <ProductReport :data="reportData.product" :template="activeTemplate" />
            </el-tab-pane>
            <el-tab-pane name="comprehensive">
              <template #label><span>📋 综合分析总结</span></template>
              <ComprehensiveReport :data="reportData.comprehensive" :template="activeTemplate" />
            </el-tab-pane>
            <el-tab-pane name="bankVisit" v-if="record.industry === '银行金融'">
              <template #label><span>🏦 银行拜访报告</span></template>
              <BankVisitReport :data="reportData.bankVisit" />
            </el-tab-pane>
          </el-tabs>

          <!-- 模板选择器 -->
          <div class="template-selector">
            <span style="font-size:13px;color:#606266;margin-right:8px;">当前使用模板：</span>
            <el-select v-model="activeTemplateId" size="small" style="width:220px;" @change="onTemplateChange" placeholder="选择评价模板">
              <el-option-group v-for="group in templateGroups" :key="group.label" :label="group.label">
                <el-option v-for="t in group.templates" :key="t.id" :label="t.name" :value="t.id">
                  <span>{{ t.name }}</span>
                  <el-tag size="small" :type="t.templateType==='scoring'?'':t.templateType==='report'?'success':'warning'" style="margin-left:6px;">
                    {{ t.templateType==='scoring'?'评分':t.templateType==='report'?'报告':'综合分析' }}
                  </el-tag>
                </el-option>
              </el-option-group>
            </el-select>
            <el-tag v-if="activeTemplate" size="small" style="margin-left:8px;">
              {{ activeTemplate.templateType === 'scoring' ? '含打分' : activeTemplate.templateType === 'report' ? '仅报告不打分' : '评分+报告' }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import SalesReport from './reports/SalesReport.vue'
import CustomerReport from './reports/CustomerReport.vue'
import ProductReport from './reports/ProductReport.vue'
import ComprehensiveReport from './reports/ComprehensiveReport.vue'
import BankVisitReport from './reports/BankVisitReport.vue'
import { generateRecordData } from './reportData.js'

const route = useRoute()

// 根据路由参数生成对应行业数据
const recordId = computed(() => parseInt(route.params.id) || 1)
const recordData = computed(() => generateRecordData(recordId.value))

const record = computed(() => recordData.value.record)

const playSpeed = ref(1)
const currentTime = ref(0)
const transcriptSearch = ref('')

// ============ 对话转写 ============
const transcript = ref([
  { start: 0, end: 45, speaker: '王志华', role: 'sales', text: '张总您好，感谢您抽出时间。我是利尔达AI科技的小王，今天主要是想跟您聊聊我们AI智能胸牌在银行客户经理外拓场景的应用。' },
  { start: 48, end: 120, speaker: '张总', role: 'customer', text: '你好小王。我们行最近确实在推进数字化转型，客户经理外出拜访的效率提升、过程管理一直是我们比较关注的问题。你们这个产品具体是怎么用的？' },
  { start: 125, end: 210, speaker: '王志华', role: 'sales', text: '我们的AI智能胸牌非常轻便，只有28克，客户经理佩戴后全程自动录音，AI会自动转写成文字并生成分析报告。比如您行的客户经理拜访完某个企业客户后，系统会自动生成客户画像、需求分析、销售能力评分，还能提取优秀话术供团队共享。' },
  { start: 215, end: 280, speaker: '张总', role: 'customer', text: '这个挺有意思。不过我们比较关心几个方面：一是数据安全，金融行业对合规要求很高；二是录音质量，客户经理经常在外面跑，环境噪音大；还有就是跟我们现有的CRM系统能不能对接。' },
  { start: 285, end: 380, speaker: '王志华', role: 'sales', text: '张总您这些问题问得非常专业。数据安全方面，我们通过了等保三级认证，数据全程加密传输，支持私有化部署。录音质量上，我们最新3S增强版配备了双麦阵列和降噪芯片，5米内清晰拾音。系统对接这块，我们有标准的API接口，已经和多家银行的CRM系统打通了。不如我给您看几个同业的案例？比如招商银行某分行上线三个月后，客户经理的有效拜访量提升了40%。' },
  { start: 385, end: 450, speaker: '张总', role: 'customer', text: '招商银行的案例具体怎么样？能详细说说吗？我们行大概有200多个客户经理，分布在省内各个支行，场景也比较复杂。' },
  { start: 455, end: 530, speaker: '王志华', role: 'sales', text: '招行这个案例很有参考性。他们最初也是200人规模试点，三个月后客户经理的日均有效拜访量从1.8次提升到2.5次，销售能力评分平均提升了12分。最关键的是，通过AI分析提炼出来的优秀话术，新人上手周期从3个月缩短到了1个月。我可以把具体的案例分析报告发给您。' },
  { start: 535, end: 580, speaker: '张总', role: 'customer', text: '不错。那价格方面呢？我们200人的规模，整体预算大概是什么样的？还有就是后续的服务支持。' },
  { start: 585, end: 660, speaker: '王志华', role: 'sales', text: '价格方面我们有灵活方案。200人规模的年费大概在60-80万，包含硬件设备和SaaS平台。如果签约三年，可以享受八折优惠，还包括一次免费的系统定制对接。服务方面，我们有专属客户成功经理，7×24小时技术支持。' },
  { start: 665, end: 720, speaker: '张总', role: 'customer', text: '好的，整体方案我了解了。这样吧，我回去和我们信息科技部和零售银行部一起碰一下，确定具体的试用岗位和人数。你先把这个方案和招商银行的案例发给我，我们内部讨论后会尽快给你反馈。' },
  { start: 725, end: 750, speaker: '王志华', role: 'sales', text: '好的张总，我今天就把详细方案和案例发给您。您看下周三或者周四方便的话我再过来一趟？到时候可以带一台样机给您实际体验一下。' }
])

const filteredTranscript = computed(() => {
  if (!transcriptSearch.value) return transcript.value
  const kw = transcriptSearch.value.toLowerCase()
  return transcript.value.filter(l => l.text.toLowerCase().includes(kw) || l.speaker.includes(kw))
})

const formatTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const seekTo = (time) => { currentTime.value = time }

// ============ 模板选择 ============
const activeReport = ref('sales')
const activeTemplateId = ref(1)
const activeTemplate = ref(null)

const templateGroups = ref([
  { label: '📊 评分模板', templates: [
    { id: 1, name: '销售能力综合评分', templateType: 'scoring', hasScore: true }
  ]},
  { label: '📝 报告模板', templates: [
    { id: 2, name: '银行客户拜访报告', templateType: 'report', hasScore: false },
    { id: 6, name: '销售复盘模板', templateType: 'report', hasScore: false }
  ]},
  { label: '📋 综合分析模板', templates: [
    { id: 5, name: '汽车销售综合评估', templateType: 'summary', hasScore: true }
  ]}
])

const onTemplateChange = (id) => {
  activeTemplate.value = templateGroups.value.flatMap(g => g.templates).find(t => t.id === id) || null
}

// 初始化默认模板
activeTemplate.value = templateGroups.value[0].templates[0]

const onReportChange = () => {}

// 报告数据从生成器获取（根据录音ID不同而变化）
const reportData = computed(() => recordData.value)
</script>

<style scoped>
.detail-header { margin-bottom: 0; }
.header-info { }
.record-title { font-size: 18px; margin: 0 0 8px 0; color: #303133; }
.record-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; color: #909399; }
.meta-item { display: flex; align-items: center; gap: 3px; margin-left: 8px; }

.audio-player { padding: 8px 0; }
.player-waveform { display: flex; align-items: flex-end; gap: 2px; height: 50px; margin-bottom: 12px; }
.wave-bar { flex: 1; background: #409EFF; border-radius: 2px; opacity: 0.6; min-height: 4px; animation: pulse 1.2s ease-in-out infinite alternate; }
@keyframes pulse { from { opacity: 0.3; } to { opacity: 0.8; } }
.player-controls { display: flex; align-items: center; gap: 12px; }
.player-progress { flex: 1; }
.progress-bar { height: 4px; background: #e4e7ed; border-radius: 2px; margin-bottom: 4px; }
.progress-fill { height: 4px; background: #409EFF; border-radius: 2px; }
.progress-time { font-size: 12px; color: #909399; }

.transcript-panel { max-height: calc(100vh - 340px); overflow: hidden; display: flex; flex-direction: column; }
.transcript-list { overflow-y: auto; max-height: calc(100vh - 500px); }
.transcript-line { display: flex; gap: 8px; padding: 8px 4px; cursor: pointer; border-bottom: 1px solid #f5f7fa; transition: background 0.2s; }
.transcript-line:hover { background: #f5f7fa; }
.transcript-line.active { background: #ecf5ff; border-left: 3px solid #409EFF; }
.tl-time { font-size: 11px; color: #c0c4cc; min-width: 36px; padding-top: 2px; }
.tl-content { flex: 1; }
.tl-speaker { font-size: 12px; font-weight: bold; margin-right: 6px; }
.tl-speaker.sales { color: #409EFF; }
.tl-speaker.customer { color: #E6A23C; }
.tl-text { font-size: 13px; color: #303133; line-height: 1.6; }

.report-panel { min-height: calc(100vh - 240px); }
.template-selector { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #ebeef5; margin-bottom: 12px; }
</style>
