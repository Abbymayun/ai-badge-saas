<template>
  <div class="sop-page">
    <div class="page-title">🤖 AI胸牌 · 销售SOP</div>
    <div class="page-subtitle">利尔达AI智能胸牌产品专属销售流程与话术指南</div>
    
    <el-row :gutter="16" class="sop-stats">
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val">{{ phases.length }}</div><div class="ssc-lbl">销售阶段</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#409EFF">{{ totalTasks }}</div><div class="ssc-lbl">标准动作</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#67C23A">{{ doneTasks }}</div><div class="ssc-lbl">已标准化</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#E6A23C">建议45分钟</div><div class="ssc-lbl">标准拜访时长</div></el-card></el-col>
    </el-row>

    <div v-for="(phase, pidx) in phases" :key="pidx" class="sop-phase">
      <div class="sop-phase-header" :style="{borderLeftColor: phase.color}">
        <span class="spph-num">{{ pidx+1 }}</span>
        <span class="spph-title">{{ phase.name }}</span>
        <el-tag size="small" :type="phase.status==='done'?'success':'warning'">{{ phase.status==='done'?'✅ 已标准化':'⟳ 优化中' }}</el-tag>
      </div>
      <el-row :gutter="12">
        <el-col :span="8" v-for="task in phase.tasks" :key="task.id">
          <el-card shadow="hover" class="sop-task-card" :class="{done:task.done}">
            <div class="stc-header">
              <span class="stc-dot" :style="{background:task.done?'#67C23A':'#E6A23C'}"></span>
              <span class="stc-name">{{ task.name }}</span>
            </div>
            <div class="stc-body">
              <div class="stc-script"><strong>💬 话术：</strong>{{ task.script }}</div>
              <div class="stc-check"><strong>✅ 检查点：</strong>{{ task.checkpoint }}</div>
              <div class="stc-duration"><strong>⏱ 时长：</strong>{{ task.duration }}</div>
            </div>
            <div class="stc-footer">
              <el-tag v-if="task.done" type="success" size="small">已标准化</el-tag>
              <el-tag v-else type="warning" size="small">待完善</el-tag>
              <span class="stc-owner">{{ task.owner }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const phases = [
  { name:'阶段一：拜访前准备（建议15分钟）', color:'#409EFF', status:'done', tasks:[
    {id:1,name:'客户行业研究',done:true,script:'针对银行/汽车/医疗/教育/地产/零售/保险7大行业，查阅客户近1年财报、行业报告。标注：销售团队规模、现有数字化程度、AI应用先例、营收趋势',checkpoint:'是否完成至少3项客户背景资料的查阅？','duration':'15分钟',owner:'销售个人'},
    {id:2,name:'AI胸牌价值定位',done:true,script:'根据客户行业准备3个核心价值点。银行："①合规话术实时监测 ②产品推荐准确率+35% ③客户画像自动生成"。汽车："①试驾话术落地率40%→95% ②竞品对比自动触发 ③客户意向AI预判"',checkpoint:'是否针对行业定制了3个价值点？','duration':'10分钟',owner:'销售个人'},
    {id:3,name:'决策链梳理',done:true,script:'明确客户内部角色：财务/采购→准备ROI计算表；业务VP→准备同行案例；CEO→准备战略价值阐述',checkpoint:'是否列出至少3个决策角色及关注点？','duration':'5分钟',owner:'销售个人'}
  ]},
  { name:'阶段二：开场破冰（3分钟）', color:'#67C23A', status:'done', tasks:[
    {id:4,name:'AI胸牌一句话介绍',done:true,script:'"李总您好，我是利尔达的XXX。我们做了一款AI智能胸牌，已经帮XX银行把话术标准化率从40%提到了95%，今天想跟您聊聊看能否帮到您的团队。" ——要点：产品+数据+目的',checkpoint:'能否30秒内完成介绍并引起兴趣？','duration':'30秒',owner:'销售个人'},
    {id:5,name:'议程确认+时间承诺',done:true,script:'"今天三件事：①10分钟了解您团队销售管理痛点 ②演示AI胸牌怎么解决 ③看看您的想法。总共不超过40分钟，可以吗？"',checkpoint:'客户是否同意议程？','duration':'1分钟',owner:'销售个人'},
    {id:6,name:'展示功课·建立信任',done:true,script:'"我们看了贵司年报，营收增长很好。不过销售费用占比偏高，这也是很多客户找我们的原因——用AI降低销售管理成本。"',checkpoint:'是否展示了对客户业务的了解？','duration':'1分钟',owner:'销售个人'}
  ]},
  { name:'阶段三：需求挖掘（8分钟）', color:'#E6A23C', status:'done', tasks:[
    {id:7,name:'现状提问',done:true,script:'①"目前销售过程怎么管理？" ②"新人从入职到独立见客户多久？" ③"销售管理最大的三个痛点？" ——先问现状再挖痛点',checkpoint:'是否完成了3个提问且客户回答？','duration':'3分钟',owner:'销售个人'},
    {id:8,name:'痛点量化',done:true,script:'追问数字："多少人需要管理？话术检查覆盖率？销售离职损失？客户数据怎么记录的？" ——用数字强化痛感',checkpoint:'是否获取了2个量化痛点数据？','duration':'3分钟',owner:'销售个人'},
    {id:9,name:'AI胸牌价值锚定',done:true,script:'"您提到三个问题：话术不标准、新人上手慢、客户数据丢失。AI胸牌恰好解决——实时话术提醒让标准落地，AI陪练让新人3天变老兵，录音自动生成客户画像。哪个最急？"',checkpoint:'是否将痛点一一对应到AI胸牌功能？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'阶段四：产品演示（15分钟）', color:'#F56C6C', status:'done', tasks:[
    {id:10,name:'场景化演示',done:true,script:'按行业选择演示场景：银行→理财经理面客；汽车→试驾接待；医疗→医生拜访。佩戴胸牌见"客户"→实时话术提示→后台自动生成报告（话术评分+客户画像+智能体分析）→管理者视角看团队数据',checkpoint:'是否按行业完成场景化演示？','duration':'10分钟',owner:'销售+技术'},
    {id:11,name:'同行案例+数据',done:true,script:'准备2-3个同行案例：①某银行100台部署3个月，话术合规率62%→97% ②某车行50台，新人培训4周→1周 ③某药企合规记录自动生成，省1.5h/天文书',checkpoint:'是否展示了2个案例数据？','duration':'3分钟',owner:'销售个人'},
    {id:12,name:'SaaS后台展示',done:true,script:'演示AI听记报告→销售画像（雷达图+进步曲线）→话术库（行业模板+评分）→设备管理（远程配置+OTA）。强调"AI自动生成，零人工录入"',checkpoint:'是否演示了3个核心功能？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'阶段五：异议处理', color:'#909399', status:'done', tasks:[
    {id:13,name:'价格异议→算ROI',done:true,script:'"50人团队，话术标准化率60%→90%，转化率+5%，每月多成交2.5单，一年多赚30万。设备投入不到3万，ROI>10倍。套餐20台+SaaS一年9999，每天每台1块3。"',checkpoint:'回应是否包含ROI计算？','duration':'2分钟',owner:'销售个人'},
    {id:14,name:'安全异议→三重保障',done:true,script:'"①AES-256加密传输 ②阿里云等保三级 ③数据自主保留/销毁。支持私有化部署。"',checkpoint:'是否列出3项安全措施？','duration':'1分钟',owner:'销售个人'},
    {id:15,name:'竞品异议→三差异化',done:true,script:'"我们不只转文字，是AI理解对话+判断话术+抓需求。7大行业模板非通用方案。硬件SaaS一体，无需对接多家。"',checkpoint:'是否用3个差异化回应？','duration':'2分钟',owner:'销售个人'},
    {id:16,name:'员工抵触→赋能非监控',done:true,script:'"AI胸牌帮销售——实时话术指导像老师在耳边，新人进步快；自动生成客户画像省写报告时间；数据用于能力提升非考核惩罚。"',checkpoint:'是否解释了赋能而非监控？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'阶段六：促成成交', color:'#fbbf24', status:'done', tasks:[
    {id:17,name:'试探成交信号',done:true,script:'"您认可话术标准化和新人培训。先拿20台试试？标准版套餐9999/年，含设备+SaaS后台，您觉得怎么样？"',checkpoint:'是否提出具体试用量和方案？','duration':'1分钟',owner:'销售个人'},
    {id:18,name:'降低决策门槛',done:true,script:'"免费试用1个月，5台设备先跑起来，无需承诺。觉得没用寄回来，不收钱。" ——零风险承诺',checkpoint:'是否提出免费试用？','duration':'1分钟',owner:'销售个人'},
    {id:19,name:'明确推进计划',done:true,script:'"我准备试用方案（设备清单+部署计划+效果指标），下周二下午2点跟您和销售总监沟通，15分钟，方便吗？"',checkpoint:'是否约定了具体时间？','duration':'1分钟',owner:'销售个人'}
  ]},
  { name:'阶段七：售后跟进', color:'#409EFF', status:'done', tasks:[
    {id:20,name:'24h会议纪要',done:true,script:'邮件标题："利尔达AI胸牌 | 拜访纪要 & 试用方案"，包含：会议要点+方案建议+下一步计划+联系方式',checkpoint:'邮件是否24h内发出？','duration':'15分钟',owner:'销售个人'},
    {id:21,name:'试用方案准备',done:true,script:'准备：设备清单5-10台+SaaS账号配置+试用指标+培训计划（1h线上+操作手册）',checkpoint:'是否准备了4项内容？','duration':'30分钟',owner:'销售+技术'},
    {id:22,name:'CRM内部立项',done:true,script:'CRM创建记录：客户等级+预计签约+设备数量+跟进阶段。>50台抄送总监申请资源',checkpoint:'是否完成CRM记录？','duration':'10分钟',owner:'销售个人'},
    {id:23,name:'7天持续跟进',done:true,script:'第3天发白皮书/案例集→第5天确认试用方案→第7天提醒会议+确认参会人',checkpoint:'第3/5/7天是否完成跟进？','duration':'15分钟',owner:'销售个人'}
  ]}
]

const totalTasks = computed(() => phases.reduce((s,p)=>s+p.tasks.length,0))
const doneTasks = computed(() => phases.reduce((s,p)=>s+p.tasks.filter(t=>t.done).length,0))
</script>

<style scoped>
.sop-page{max-width:1100px;margin:0 auto;padding:24px;background:#f5f7fa;min-height:100vh}
.page-title{font-size:24px;font-weight:700;color:#303133}
.page-subtitle{font-size:14px;color:#909399;margin:4px 0 20px}
.sop-stats{margin-bottom:24px}.sop-stat-card{text-align:center;padding:8px 0}.ssc-val{font-size:28px;font-weight:700}.ssc-lbl{font-size:13px;color:#909399;margin-top:4px}
.sop-phase{margin-bottom:24px}.sop-phase-header{display:flex;align-items:center;gap:10px;padding:10px 16px;border-left:4px solid;background:#fafbfc;border-radius:0 8px 8px 0;margin-bottom:10px}.spph-num{width:26px;height:26px;border-radius:50%;background:#409EFF;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.spph-title{font-size:16px;font-weight:700;color:#303133}
.sop-task-card{margin-bottom:12px;transition:.2s}.sop-task-card:hover{transform:translateY(-2px)}
.stc-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}.stc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}.stc-name{font-size:14px;font-weight:700;color:#303133}
.stc-body{font-size:12px;color:#606266;line-height:1.8}.stc-body>div{margin:4px 0}
.stc-footer{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:8px;border-top:1px solid #ebeef5}.stc-owner{font-size:11px;color:#c0c4cc;margin-left:auto}
</style>
