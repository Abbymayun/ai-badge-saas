<template>
  <div class="sop-page">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <div>
        <div class="page-title">🤖 AI胸牌 · 销售SOP</div>
        <div class="page-subtitle">利尔达AI智能胸牌产品专属销售流程与话术指南</div>
      </div>
      <el-button :type="editMode ? 'success' : 'primary'" @click="toggleEdit">
        {{ editMode ? '💾 保存' : '✏️ 编辑' }}
      </el-button>
    </div>
    
    <el-row :gutter="16" class="sop-stats">
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val">{{ phases.length }}</div><div class="ssc-lbl">销售阶段</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#409EFF">{{ totalTasks }}</div><div class="ssc-lbl">标准动作</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#67C23A">{{ doneTasks }}</div><div class="ssc-lbl">已标准化</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#E6A23C">建议45分钟</div><div class="ssc-lbl">标准拜访时长</div></el-card></el-col>
    </el-row>

    <div v-for="(phase, pidx) in phases" :key="pidx" class="sop-phase">
      <div class="sop-phase-header" :style="{borderLeftColor: phase.color}">
        <span class="spph-num">{{ pidx+1 }}</span>
        <el-input v-if="editMode" v-model="phase.name" class="spph-input" size="small" />
        <span v-else class="spph-title">{{ phase.name }}</span>
        <el-tag size="small" :type="phase._done?'success':'warning'">{{ phase._done?'✅ 已标准化':'⟳ 优化中' }}</el-tag>
      </div>
      <el-row :gutter="12">
        <el-col :span="8" v-for="task in phase.tasks" :key="task.id">
          <el-card shadow="hover" class="sop-task-card" :class="{done:task._done}">
            <div class="stc-header">
              <span class="stc-dot" :style="{background:task._done?'#67C23A':'#E6A23C'}"></span>
              <el-input v-if="editMode" v-model="task.name" class="stc-input" size="small" />
              <span v-else class="stc-name">{{ task.name }}</span>
              <el-checkbox v-if="editMode" v-model="task._done" size="small" />
            </div>
            <div class="stc-body">
              <div class="stc-script"><strong>💬 话术：</strong>
                <el-input v-if="editMode" v-model="task.script" type="textarea" :rows="2" size="small" style="margin-top:4px" />
                <template v-else>
                  <span v-if="!task._expanded">{{ task.script?.substring(0, 80) }}{{ task.script?.length > 80 ? '...' : '' }}</span>
                  <span v-else>{{ task.script }}</span>
                  <el-button v-if="task.script?.length > 80" link type="primary" size="small" @click="task._expanded=!task._expanded">
                    {{ task._expanded ? '收起' : '展开详情' }}
                  </el-button>
                </template>
              </div>
              <div v-if="task.hardware" class="stc-hardware"><strong>🔧 硬件价值：</strong>
                <el-input v-if="editMode" v-model="task.hardware" type="textarea" :rows="2" size="small" style="margin-top:4px" />
                <template v-else>
                  <span v-if="!task._hwExpanded">{{ task.hardware?.substring(0, 60) }}{{ task.hardware?.length > 60 ? '...' : '' }}</span>
                  <span v-else>{{ task.hardware }}</span>
                  <el-button v-if="task.hardware?.length > 60" link type="primary" size="small" @click="task._hwExpanded=!task._hwExpanded">
                    {{ task._hwExpanded ? '收起' : '硬件详情' }}
                  </el-button>
                </template>
              </div>
              <div v-if="task.software" class="stc-software"><strong>💻 软件价值：</strong>
                <el-input v-if="editMode" v-model="task.software" type="textarea" :rows="2" size="small" style="margin-top:4px" />
                <template v-else>
                  <span v-if="!task._swExpanded">{{ task.software?.substring(0, 60) }}{{ task.software?.length > 60 ? '...' : '' }}</span>
                  <span v-else>{{ task.software }}</span>
                  <el-button v-if="task.software?.length > 60" link type="primary" size="small" @click="task._swExpanded=!task._swExpanded">
                    {{ task._swExpanded ? '收起' : '软件详情' }}
                  </el-button>
                </template>
              </div>
              <div class="stc-check"><strong>✅ 检查点：</strong>
                <el-input v-if="editMode" v-model="task.checkpoint" type="textarea" :rows="2" size="small" style="margin-top:4px" />
                <span v-else>{{ task.checkpoint }}</span>
              </div>
              <div class="stc-duration"><strong>⏱ 时长：</strong>
                <el-input v-if="editMode" v-model="task.duration" size="small" style="width:120px" />
                <span v-else>{{ task.duration }}</span>
              </div>
            </div>
            <div class="stc-footer">
              <el-tag v-if="task._done" type="success" size="small">已标准化</el-tag>
              <el-tag v-else type="warning" size="small">待完善</el-tag>
              <span class="stc-owner">{{ task.owner }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 硬件+软件价值定位详情弹窗 -->
    <el-dialog v-model="valueVisible" title="🔧💻 AI胸牌 · 硬件与软件价值定位" width="700px">
      <el-tabs v-model="valueTab">
        <el-tab-pane label="🔧 硬件价值" name="hw">
          <div class="value-detail" v-for="(item,idx) in hardwareValues" :key="idx">
            <h4>{{ item.title }}</h4>
            <p>{{ item.content }}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="💻 软件价值" name="sw">
          <div class="value-detail" v-for="(item,idx) in softwareValues" :key="idx">
            <h4>{{ item.title }}</h4>
            <p>{{ item.content }}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const editMode = ref(false)
const valueVisible = ref(false)
const valueTab = ref('hw')
const STORAGE_KEY = 'ai_badge_sop_data'

function toggleEdit() {
  if(editMode.value) {
    saveData()
    ElMessage.success('SOP 数据已保存')
  }
  editMode.value = !editMode.value
}

function saveData() {
  const data = phases.value.map(p => ({
    name: p.name,
    tasks: p.tasks.map(t => ({
      name: t.name, script: t.script, checkpoint: t.checkpoint,
      duration: t.duration, hardware: t.hardware, software: t.software,
      _done: t._done
    }))
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadData() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if(d && d.length) {
      phases.value.forEach((p, pi) => {
        if(d[pi]) {
          if(d[pi].name) p.name = d[pi].name
          p.tasks.forEach((t, ti) => {
            if(d[pi].tasks && d[pi].tasks[ti]) {
              const dt = d[pi].tasks[ti]
              if(dt.name) t.name = dt.name
              if(dt.script) t.script = dt.script
              if(dt.checkpoint) t.checkpoint = dt.checkpoint
              if(dt.duration) t.duration = dt.duration
              if(dt.hardware) t.hardware = dt.hardware
              if(dt.software) t.software = dt.software
              t._done = dt._done
            }
          })
        }
      })
    }
  } catch(e) {}
}

const phases = ref([
  { name:'阶段一：拜访前准备', _done:true, tasks:[
    {id:1,name:'客户行业研究',_done:true,_expanded:false,
      script:'针对银行/汽车/医疗/教育/地产/零售/保险7大行业，查阅客户近1年财报、行业报告、竞品动态。标注：①销售团队规模 ②现有CRM/数字化程度 ③是否有AI应用先例 ④近3年营收趋势',
      checkpoint:'是否完成至少3项客户背景资料的查阅和标注？','duration':'15分钟',owner:'销售个人'},
    {id:2,name:'AI胸牌价值定位',_done:true,_expanded:false,_hwExpanded:false,_swExpanded:false,
      script:'根据客户行业，准备软硬件两个维度的价值定位。核心话术："我们的AI胸牌不只是一个录音设备，它是一个完整的销售赋能系统。硬件方面...；软件方面..."。点击下方查看硬件和软件价值详情',
      hardware:'🔧 硬件价值：①AI智能胸牌佩戴轻便（仅28g），续航12小时，支持4G/WiFi/蓝牙三模通信 ②双麦降噪+远场拾音，嘈杂环境也能清晰录音 ③IP67防尘防水，适用于各种工作场景 ④磁吸/夹扣双佩戴模式 ⑤OTA远程升级，无需返厂。一句话：硬件是"听得清、戴得住、用得久"的销售随身助手',
      software:'💻 软件价值：①7大行业AI对话模板，开箱即用 ②实时话术提醒+事后AI评分 ③客户画像自动生成（需求/偏好/异议/意向等级）④智能体自定义配置 ⑤管理者实时看板：团队话术评分、销售能力雷达图、录音时长统计 ⑥API开放接口，可对接企业CRM ⑦数据全程加密，支持私有化部署。一句话：软件是"看得见、管得住、提得高"的销售管理大脑',
      checkpoint:'是否从硬件和软件两个维度准备了价值定位？', 'duration':'15分钟',owner:'销售个人'},
    {id:3,name:'客户决策链梳理',_done:true,_expanded:false,
      script:'明确客户内部：①谁关注成本（财务/采购）→ 准备ROI计算表 ②谁关注效果（业务VP/销售总监）→ 准备同行案例 ③谁拍板（CEO/GM）→ 准备战略价值阐述。列出每个角色的关注点和应对策略',
      checkpoint:'是否列出至少3个决策角色及其关注点？','duration':'10分钟',owner:'销售个人'}
  ]},
  { name:'阶段二：开场破冰（3分钟）', _done:true, tasks:[
    {id:4,name:'AI胸牌一句话介绍',_done:true,_expanded:false,
      script:'"李总您好，我是利尔达的XXX。我们做了一款AI智能胸牌，已经帮XX银行把话术标准化率从40%提到了95%，今天想跟您聊聊看能否帮到您的团队。" ——要点：①一句话说清产品 ②带同行数据 ③明确拜访目的',
      checkpoint:'能否30秒内完成介绍并引起兴趣？','duration':'30秒',owner:'销售个人'},
    {id:5,name:'议程确认',_done:true,_expanded:false,
      script:'"今天三件事：①10分钟了解您团队销售管理痛点 ②演示AI胸牌怎么解决 ③看看您的想法。不超过40分钟。"',
      checkpoint:'客户是否同意议程？','duration':'1分钟',owner:'销售个人'},
    {id:6,name:'建立信任锚点',_done:true,_expanded:false,
      script:'"我们看了贵司年报，营收增长很好。不过销售费用占比偏高，这也是很多客户找我们的原因——用AI降低销售管理成本。"',
      checkpoint:'是否展示了对客户业务的了解？','duration':'1分钟',owner:'销售个人'}
  ]},
  { name:'阶段三：需求挖掘（8分钟）', _done:true, tasks:[
    {id:7,name:'现状提问',_done:true,_expanded:false,
      script:'①"目前销售过程怎么管理？" ②"新人从入职到独立见客户多久？" ③"销售管理最大的三个痛点？" ——先问现状再挖痛点',
      checkpoint:'是否完成了3个提问且客户回答？','duration':'3分钟',owner:'销售个人'},
    {id:8,name:'痛点量化',_done:true,_expanded:false,
      script:'追问数字："多少人需要管理？话术检查覆盖率？销售离职损失？客户数据怎么记录的？" ——用数字强化痛感',
      checkpoint:'是否获取了2个量化痛点数据？','duration':'3分钟',owner:'销售个人'},
    {id:9,name:'价值锚定',_done:true,_expanded:false,
      script:'"您提到三个问题：话术不标准、新人上手慢、客户数据丢失。AI胸牌恰好解决——实时话术提醒让标准落地，AI陪练让新人3天变老兵，录音自动生成客户画像。哪个最急？"',
      checkpoint:'是否将痛点一一对应到AI胸牌功能？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'阶段四：产品演示（15分钟）', _done:true, tasks:[
    {id:10,name:'场景化演示',_done:true,_expanded:false,
      script:'按行业选择演示场景：银行→理财经理面客；汽车→试驾接待；医疗→医生拜访。佩戴胸牌→实时话术提示→后台自动生成报告（话术评分+客户画像+智能体分析）→管理者视角看团队数据',
      checkpoint:'是否按行业完成场景化演示？','duration':'10分钟',owner:'销售+技术'},
    {id:11,name:'同行案例',_done:true,_expanded:false,
      script:'某银行100台部署3个月，话术合规率62%→97%；某车行50台，新人培训4周→1周；某药企合规记录自动生成，省1.5h/天文书',
      checkpoint:'是否展示了2个案例数据？','duration':'3分钟',owner:'销售个人'},
    {id:12,name:'SaaS后台展示',_done:true,_expanded:false,
      script:'演示AI听记报告→销售画像（雷达图+进步曲线）→话术库（行业模板+评分）→设备管理（远程配置+OTA）',
      checkpoint:'是否演示了3个核心功能？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'阶段五：异议处理', _done:true, tasks:[
    {id:13,name:'价格异议→ROI',_done:true,_expanded:false,
      script:'"50人团队，话术标准化率60%→90%，转化率+5%，每月多成交2.5单，一年多赚30万。设备投入不到3万，ROI>10倍。套餐20台+SaaS一年9999，每天每台1块3。"',
      checkpoint:'回应是否包含ROI计算和具体数字？','duration':'2分钟',owner:'销售个人'},
    {id:14,name:'安全异议',_done:true,_expanded:false,
      script:'"①AES-256加密传输 ②阿里云等保三级 ③数据自主保留/销毁。支持私有化部署。"',
      checkpoint:'是否列出3项安全保障？','duration':'1分钟',owner:'销售个人'},
    {id:15,name:'竞品异议',_done:true,_expanded:false,
      script:'"我们不只转文字，是AI理解对话+判断话术+抓需求。7大行业模板非通用方案。硬件SaaS一体。"',
      checkpoint:'是否用3个差异化回应？','duration':'2分钟',owner:'销售个人'},
    {id:16,name:'员工抵触',_done:true,_expanded:false,
      script:'"AI胸牌帮销售——实时话术指导像老师在耳边，新人进步快；自动生成客户画像省写报告时间；数据用于能力提升非考核惩罚。"',
      checkpoint:'是否解释了赋能而非监控？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'阶段六：促成成交', _done:true, tasks:[
    {id:17,name:'试探成交',_done:true,_expanded:false,
      script:'"您认可话术标准化和新人培训。先拿20台试试？标准版套餐9999/年，含设备+SaaS后台，您觉得怎么样？"',
      checkpoint:'是否提出具体试用量和方案？','duration':'1分钟',owner:'销售个人'},
    {id:18,name:'降低决策门槛',_done:true,_expanded:false,
      script:'"免费试用1个月，5台设备先跑起来，无需承诺。觉得没用寄回来，不收钱。"',
      checkpoint:'是否提出免费试用？','duration':'1分钟',owner:'销售个人'},
    {id:19,name:'明确推进计划',_done:true,_expanded:false,
      script:'"我准备试用方案（设备清单+部署计划+效果指标），下周二下午2点跟您和销售总监沟通，15分钟，方便吗？"',
      checkpoint:'是否约定了具体时间？','duration':'1分钟',owner:'销售个人'}
  ]},
  { name:'阶段七：售后跟进', _done:true, tasks:[
    {id:20,name:'24h会议纪要',_done:true,_expanded:false,
      script:'邮件标题："利尔达AI胸牌 | 拜访纪要 & 试用方案"，包含：会议要点+方案建议+下一步计划+联系方式',
      checkpoint:'邮件是否24h内发出？','duration':'15分钟',owner:'销售个人'},
    {id:21,name:'试用方案准备',_done:true,_expanded:false,
      script:'准备：设备清单5-10台+SaaS账号配置+试用指标+培训计划（1h线上+操作手册）',
      checkpoint:'是否准备了4项内容？','duration':'30分钟',owner:'销售+技术'},
    {id:22,name:'CRM内部立项',_done:true,_expanded:false,
      script:'CRM创建记录：客户等级+预计签约+设备数量+跟进阶段。>50台抄送总监申请资源',
      checkpoint:'是否完成CRM记录？','duration':'10分钟',owner:'销售个人'},
    {id:23,name:'7天持续跟进',_done:true,_expanded:false,
      script:'第3天发白皮书/案例集→第5天确认试用方案→第7天提醒会议+确认参会人',
      checkpoint:'第3/5/7天是否完成跟进？','duration':'15分钟',owner:'销售个人'}
  ]}
])

// 硬件价值定位详情
const hardwareValues = ref([
  {title:'佩戴体验',content:'仅重28g，业界最轻量级AI穿戴设备。磁吸/夹扣双佩戴模式，适配衬衫、工装、白大褂等各种工作服。续航12小时满足全天佩戴需求。'},
  {title:'拾音能力',content:'双麦阵列+AI降噪算法，3米远场拾音，嘈杂环境（如4S店展厅、银行大厅、医院走廊）也能清晰录音。自动识别说话人，区分销售和客户对话。'},
  {title:'通讯能力',content:'支持4G/WiFi/蓝牙三模通信。4G全网通，无需依赖客户WiFi。断网本地缓存，联网自动上传。'},
  {title:'耐用设计',content:'IP67防尘防水，适应户外/雨天/车间等场景。通过1.5米跌落测试。工作温度-10°C~50°C。'},
  {title:'远程管理',content:'OTA远程升级，固件/话术/模板统一推送。设备在线状态实时监控，异常自动告警。远程锁定/擦除，保障数据安全。'},
  {title:'硬件对比优势',content:'相比手机录音方案：佩戴解放双手、拾音更清晰、续航更长、不需要销售主动操作。相比传统录音笔：AI实时分析、自动上传、无需导出。'}
])

// 软件价值定位详情
const softwareValues = ref([
  {title:'AI对话分析',content:'不只是录音转文字，而是深度理解对话内容。自动判断：销售是否按照话术执行？是否抓住了客户需求？是否处理了异议？每次对话后自动生成评分和改善建议。'},
  {title:'话术库系统',content:'7大行业300+条标准话术模板。支持企业自定义话术上传。AI自动比对销售对话与标准话术的差异，给出匹配度评分。话术星级评价体系，持续优化。'},
  {title:'销售画像',content:'基于每一次对话数据，AI自动生成销售个人能力画像：沟通能力雷达图、产品掌握度、异议处理能力、促成成交能力。追踪进步曲线，定位薄弱环节。'},
  {title:'客户画像',content:'AI从对话中自动提取客户信息：需求偏好、异议类型、意向等级、决策角色。无需销售手动填写CRM。所有客户数据自动归档，离职交接零损失。'},
  {title:'管理看板',content:'管理者实时查看：团队话术评分排名、个人进步趋势、录音时长统计、客户转化漏斗。支持按时间/团队/个人多维度筛选。数据驱动管理决策。'},
  {title:'安全合规',content:'AES-256全程加密。阿里云等保三级认证。数据自主设定保留期限。支持私有化部署，数据不出企业服务器。所有操作日志可审计。'},
  {title:'开放生态',content:'提供标准API接口，可对接企业现有CRM/ERP/OA系统。支持Webhook推送关键事件。支持LDAP/SSO企业账号集成。'}
])

const totalTasks = computed(() => phases.value.reduce((s,p)=>s+p.tasks.length,0))
const doneTasks = computed(() => phases.value.reduce((s,p)=>s+p.tasks.filter(t=>t._done).length,0))

loadData()
</script>

<style scoped>
.sop-page{max-width:1100px;margin:0 auto;padding:24px;background:#f5f7fa;min-height:100vh}
.page-title{font-size:24px;font-weight:700;color:#303133}
.page-subtitle{font-size:14px;color:#909399;margin-top:4px}
.sop-stats{margin-bottom:24px}.sop-stat-card{text-align:center;padding:8px 0}.ssc-val{font-size:28px;font-weight:700}.ssc-lbl{font-size:13px;color:#909399;margin-top:4px}
.sop-phase{margin-bottom:24px}.sop-phase-header{display:flex;align-items:center;gap:10px;padding:10px 16px;border-left:4px solid #409EFF;background:#fafbfc;border-radius:0 8px 8px 0;margin-bottom:10px}.spph-num{width:26px;height:26px;border-radius:50%;background:#409EFF;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.spph-title{font-size:16px;font-weight:700;color:#303133}.spph-input{max-width:400px}
.sop-task-card{margin-bottom:12px;transition:.2s}.sop-task-card:hover{transform:translateY(-2px)}
.stc-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}.stc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}.stc-name{font-size:14px;font-weight:700;color:#303133}.stc-input{max-width:200px}
.stc-body{font-size:12px;color:#606266;line-height:1.8}.stc-body>div{margin:4px 0}
.stc-hardware{background:#f0f5ff;padding:6px 8px;border-radius:4px;border-left:3px solid #409EFF;margin:4px 0}
.stc-software{background:#f0fff4;padding:6px 8px;border-radius:4px;border-left:3px solid #67C23A;margin:4px 0}
.stc-footer{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:8px;border-top:1px solid #ebeef5}.stc-owner{font-size:11px;color:#c0c4cc;margin-left:auto}
.value-detail{margin-bottom:16px}.value-detail h4{font-size:15px;color:#303133;margin-bottom:6px}.value-detail p{font-size:13px;color:#606266;line-height:1.7}
</style>
