<template>
  <div class="sop-page">
    <div class="page-title">📋 销售SOP</div>
    
    <el-row :gutter="16" class="sop-stats">
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val">{{ phases.filter(p=>p.status==='done').length }}</div><div class="ssc-lbl">已完成阶段</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#409EFF">{{ totalTasks }}</div><div class="ssc-lbl">标准动作</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#67C23A">{{ doneTasks }}</div><div class="ssc-lbl">已标准化</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="sop-stat-card"><div class="ssc-val" style="color:#E6A23C">{{ totalTasks-doneTasks }}</div><div class="ssc-lbl">待完善</div></el-card></el-col>
    </el-row>

    <div v-for="(phase, pidx) in phases" :key="pidx" class="sop-phase">
      <div class="sop-phase-header" :style="{borderLeftColor: phase.color}">
        <span class="spph-num">{{ pidx+1 }}</span>
        <span class="spph-title">{{ phase.name }}</span>
        <el-tag size="small" :type="phase.status==='done'?'success':'warning'">{{ phase.status==='done'?'✅ 已完成':'⟳ 优化中' }}</el-tag>
      </div>
      <el-row :gutter="12">
        <el-col :span="8" v-for="task in phase.tasks" :key="task.id">
          <el-card shadow="hover" class="sop-task-card" :class="{done:task.done}">
            <div class="stc-header">
              <span class="stc-dot" :style="{background:task.done?'#67C23A':'#E6A23C'}"></span>
              <span class="stc-name">{{ task.name }}</span>
            </div>
            <div class="stc-body">
              <div class="stc-script"><strong>话术要点：</strong>{{ task.script }}</div>
              <div class="stc-check"><strong>检查点：</strong>{{ task.checkpoint }}</div>
              <div class="stc-duration"><strong>建议时长：</strong>{{ task.duration }}</div>
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
  { name:'客户拜访前准备', color:'#409EFF', status:'done', tasks:[
    {id:1,name:'客户行业研究',done:true,script:'针对银行/汽车/医疗/教育/地产/零售/保险7大行业，查阅客户近1年财报、行业报告、竞品动态。重点标注：①客户当前销售团队规模 ②现有CRM/数字化程度 ③是否有AI应用先例 ④近3年营收趋势',checkpoint:'是否完成至少3项客户背景资料的查阅和标注？','duration':'30分钟',owner:'销售个人'},
    {id:2,name:'AI胸牌价值定位',done:true,script:'根据客户行业，准备3个AI胸牌的核心价值点。例如银行："①合规话术实时监测，降低监管风险80% ②产品推荐准确率提升35% ③客户画像自动生成，减少手工录入"。汽车："①试驾话术标准落地率从40%提升到95% ②竞品对比自动触发 ③客户意向等级AI预判"',checkpoint:'是否针对客户行业定制了3个AI胸牌价值点？','duration':'15分钟',owner:'销售个人'},
    {id:3,name:'客户决策链梳理',done:true,script:'明确客户内部：①谁关注成本（财务/采购）→ 准备ROI计算表 ②谁关注效果（业务VP/销售总监）→ 准备同行案例 ③谁拍板（CEO/GM）→ 准备战略价值阐述。列出每个角色的关注点和应对策略',checkpoint:'是否列出至少3个决策角色及其关注点？','duration':'10分钟',owner:'销售个人'},
    {id:4,name:'竞品分析准备',done:true,script:'了解客户是否考察过竞品（如科大讯飞/思必驰等）。准备差异化卖点：①我们：7大行业AI模板+硬件SaaS一体化 ②竞品：通常只有通用方案。准备1-2个客户从竞品转投我们的真实案例',checkpoint:'是否准备了至少2个差异化卖点？','duration':'10分钟',owner:'销售个人'}
  ]},
  { name:'开场破冰（3分钟）', color:'#67C23A', status:'done', tasks:[
    {id:5,name:'AI胸牌一句话介绍',done:true,script:'"李总您好，我是利尔达的XXX。我们做了一款AI智能胸牌，已经帮XX银行/XX车行的销售团队把话术标准化率从40%提到了95%，今天想跟您聊聊看能否帮到您的团队。" ——要点：①一句话说清产品 ②带同行数据 ③明确拜访目的',checkpoint:'能否在30秒内完成产品介绍+引起兴趣？','duration':'30秒',owner:'销售个人'},
    {id:6,name:'议程确认+时间承诺',done:true,script:'"今天主要三件事：①花10分钟了解一下您团队目前销售管理的痛点 ②我用15分钟给您演示AI胸牌怎么解决这些问题 ③剩下时间看看您这边有什么想法。总共不超过40分钟，您看可以吗？" ——要点：结构清晰+时间可控+尊重对方',checkpoint:'客户是否明确同意了议程和时间？','duration':'1分钟',owner:'销售个人'},
    {id:7,name:'建立信任锚点',done:true,script:'"对了，我们来之前看了贵司上个月的年报，营收增长15%很厉害。不过我们也注意到销售费用占比有点高，这也是很多客户找我们的原因——帮他们用AI降低销售管理成本。" ——要点：展示做过功课+关联到产品价值',checkpoint:'是否展示了至少1项对客户业务的了解？','duration':'1分钟',owner:'销售个人'}
  ]},
  { name:'需求挖掘（8分钟）', color:'#E6A23C', status:'done', tasks:[
    {id:8,name:'现状提问',done:true,script:'①"目前团队销售过程怎么管理的？用什么系统或工具吗？" ②"一个新销售从入职到能独立见客户大概多久？" ③"你觉得目前销售管理最大的三个痛点是什么？" ——按顺序问，先问现状再挖痛点',checkpoint:'是否完成了3个现状提问且客户回答了？','duration':'3分钟',owner:'销售个人'},
    {id:9,name:'痛点量化',done:true,script:'追问具体数字：①"大概多少人需要管理？" ②"目前话术检查覆盖率多少？抽查还是全量？" ③"有没有算过销售离职带来的损失？一个人走了大概损失多少？" ④"客户数据现在怎么记录的？靠销售自己填还是系统？" ——用数字强化痛感',checkpoint:'是否获取了至少2个可以量化的痛点数据？','duration':'3分钟',owner:'销售个人'},
    {id:10,name:'AI胸牌价值锚定',done:true,script:'总结痛点并关联产品："您刚才提到三个问题：话术不标准、新人上手慢、客户数据丢失。我们AI胸牌恰好就是解决这三个问题的——实时话术提醒让标准落地，AI陪练让新人3天变老兵，录音自动生成客户画像不怕丢。您觉得这三个里面哪个最急？" ——要点：先总结再关联再追问优先级',checkpoint:'是否将客户痛点一一对应到AI胸牌功能？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'产品演示（15分钟）', color:'#F56C6C', status:'done', tasks:[
    {id:11,name:'场景化演示',done:true,script:'根据客户行业选择演示场景：银行→理财经理面客场景；汽车→试驾接待场景；医疗→医生拜访场景。演示流程：①佩戴胸牌见"客户"（同事扮演） ②胸牌实时录音并显示话术提示 ③面客结束后SaaS后台自动生成报告（展示：话术评分/客户画像/智能体分析） ④管理者视角查看团队数据',checkpoint:'是否按照客户行业完成了场景化演示？','duration':'10分钟',owner:'销售个人+技术'},
    {id:12,name:'同行案例展示',done:true,script:'准备2-3个同行业客户案例（隐去敏感信息）：①某银行：100台胸牌部署3个月，话术合规率从62%→97%，投诉率下降45% ②某车行：50台胸牌，新人培训周期从4周→1周，客户满意度+28% ③某药企：合规拜访记录自动生成，省去每人每天1.5小时文书工作。展示数据+截图+客户评价',checkpoint:'是否展示了至少2个同行客户案例的数据？','duration':'3分钟',owner:'销售个人'},
    {id:13,name:'SaaS后台展示',done:true,script:'重点演示：①AI听记报告（展示智能体如何自动分析对话）②销售画像（展示能力雷达图+进步曲线）③话术库（展示行业模板+评分机制）④设备管理（展示远程配置+OTA升级）。强调："所有数据AI自动生成，零人工录入"',checkpoint:'是否演示了至少3个SaaS核心功能模块？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'异议处理', color:'#909399', status:'done', tasks:[
    {id:14,name:'价格异议',done:true,script:'"理解您对价格的考虑。我们帮客户算过一笔账：以一个50人销售团队为例，如果话术标准化率从60%提升到90%，按客单价1万、转化率提升5%来算，每月多成交2.5单，一年多赚30万。设备投入不到3万，ROI超过10倍。而且我们还有套餐模式，20台设备+SaaS后台一年9999元，相当于每天每台只要1块3。" ——核心：算ROI+转单台日成本+提供套餐选项',checkpoint:'回应是否包含了ROI计算和具体数字？','duration':'2分钟',owner:'销售个人'},
    {id:15,name:'数据安全异议',done:true,script:'"安全问题您放心，我们有三个保障：①录音数据全程加密传输，银行级AES-256 ②数据存储在国内阿里云，通过等保三级 ③客户可自主选择数据保留时长，到期自动销毁。我们还支持私有化部署，数据不出企业服务器。" ——要点：技术保障+合规认证+灵活方案',checkpoint:'是否列出了至少3项安全保障措施？','duration':'1分钟',owner:'销售个人'},
    {id:16,name:'竞品比较异议',done:true,script:'"您提到XX公司也在做类似产品，他们确实在语音识别方面不错。我们的差异化在于三点：①我们不只做录音转文字，重点是AI理解对话内容——能判断销售有没有说错话、有没有抓住客户需求 ②我们有7大行业专属模板，不是通用方案 ③硬件+SaaS一体化，不需要对接多家供应商。" ——要点：不贬低竞品+突出差异化',checkpoint:'是否用3个差异化点回应了竞品对比？','duration':'2分钟',owner:'销售个人'},
    {id:17,name:'员工抵触异议',done:true,script:'"员工担心被监控，这个我们特别理解。说实话，我们的客户最开始也有这个顾虑。后来他们发现AI胸牌其实是帮销售的——①实时话术提醒就像有个老师在耳边指导，新人进步特别快 ②AI自动生成客户画像和拜访记录，省了写报告的时间，销售反而更愿意用 ③我们的数据只用于销售能力提升，不用于绩效考核惩罚。" ——要点：共情+转"监控"为"赋能"',checkpoint:'是否解释了AI胸牌如何帮助而非监控销售？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'促成成交', color:'#fbbf24', status:'done', tasks:[
    {id:18,name:'试探成交信号',done:true,script:'"听下来您对这几个方面比较认可：话术标准化和新人培训这块。要不我们先拿20台试试？我们标准版套餐9999一年，含设备和SaaS后台，您觉得这个方案怎么样？" ——要点：总结认可点+提出具体方案+观察反应',checkpoint:'是否提出了具体的试用量和方案？','duration':'1分钟',owner:'销售个人'},
    {id:19,name:'解决最后顾虑',done:true,script:'"我理解第一次合作您有顾虑。这样，我们可以先免费试用1个月，给您5台设备先跑起来，不需要任何承诺。如果1个月后您觉得没用，设备寄回来就行，一分钱不收。" ——要点：降低决策门槛+零风险承诺',checkpoint:'是否提出了降低决策门槛的方案？','duration':'1分钟',owner:'销售个人'},
    {id:20,name:'明确推进计划',done:true,script:'"那这样，我回去准备一个试用方案，包括设备清单、部署计划、预期效果指标。下周二下午我来跟您和您的销售总监一起沟通，15分钟就够了。您看周二下午2点方便吗？" ——要点：具体方案+明确时间+拉决策人一起',checkpoint:'是否约定了具体时间、内容和参与人？','duration':'1分钟',owner:'销售个人'}
  ]},
  { name:'售后跟进', color:'#409EFF', status:'done', tasks:[
    {id:21,name:'24小时内发送会议纪要',done:true,script:'拜访结束后24小时内发送邮件，包括：①会议要点总结（客户痛点+讨论内容）②AI胸牌方案建议（试用方案+产品资料）③下一步计划（下周二见销售总监的具体议程）④联系方式。邮件标题："利尔达AI胸牌 | X月X日拜访纪要 & 试用方案"',checkpoint:'邮件是否在24小时内发出且包含4项内容？','duration':'15分钟',owner:'销售个人'},
    {id:22,name:'试用方案准备',done:true,script:'根据客户行业和规模准备：①试用设备清单（建议5-10台，覆盖不同岗位）②SaaS账号配置（行业模板+智能体）③试用期预期指标（话术评分提升/新人上手时间/客户满意度）④培训计划（1小时线上培训+操作手册）',checkpoint:'是否准备了包含4项内容的试用方案文档？','duration':'30分钟',owner:'销售个人+技术'},
    {id:23,name:'内部立项',done:true,script:'在CRM系统创建客户跟进记录，标注：①客户等级（A/B/C）②预计签约时间 ③预计设备数量 ④跟进阶段。通知技术团队准备演示设备和测试账号。如果客户体量>50台，抄送销售总监申请资源支持',checkpoint:'是否在CRM完成客户记录并通知了相关团队？','duration':'10分钟',owner:'销售个人'},
    {id:24,name:'7天持续跟进',done:true,script:'①第3天：微信发送一份AI胸牌行业白皮书/案例集（证明专业度）②第5天：确认试用方案是否收到，是否需要调整（推进流程）③第7天：提醒下周二的会议，确认参会人员（确保会议不取消）',checkpoint:'是否在第3/5/7天分别完成了跟进动作？','duration':'累计15分钟',owner:'销售个人'}
  ]}
]

const totalTasks = computed(() => phases.reduce((s,p)=>s+p.tasks.length,0))
const doneTasks = computed(() => phases.reduce((s,p)=>s+p.tasks.filter(t=>t.done).length,0))
</script>

<style scoped>
.sop-page{max-width:1100px;margin:0 auto;padding:8px}
.page-title{font-size:20px;font-weight:700;color:#303133;margin-bottom:16px}
.sop-stats{margin-bottom:20px}.sop-stat-card{text-align:center;padding:8px 0}.ssc-val{font-size:28px;font-weight:700}.ssc-lbl{font-size:13px;color:#909399;margin-top:4px}
.sop-phase{margin-bottom:24px}.sop-phase-header{display:flex;align-items:center;gap:10px;padding:10px 16px;border-left:4px solid;background:#fafbfc;border-radius:0 8px 8px 0;margin-bottom:10px}.spph-num{width:26px;height:26px;border-radius:50%;background:#409EFF;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.spph-title{font-size:16px;font-weight:700;color:#303133}
.sop-task-card{margin-bottom:12px;transition:.2s}.sop-task-card.done{opacity:.7}.sop-task-card:hover{transform:translateY(-2px)}
.stc-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}.stc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}.stc-name{font-size:14px;font-weight:700;color:#303133}
.stc-body{font-size:12px;color:#606266;line-height:1.7}.stc-body>div{margin:3px 0}
.stc-footer{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:8px;border-top:1px solid #ebeef5}.stc-owner{font-size:11px;color:#c0c4cc;margin-left:auto}
</style>
