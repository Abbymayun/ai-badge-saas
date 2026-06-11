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
    {id:1,name:'客户背景调研',done:true,script:'提前研究客户行业、规模、痛点，准备3个针对性问题',checkpoint:'是否完成客户公司官网/年报/新闻查阅？','duration':'15分钟',owner:'销售个人'},
    {id:2,name:'拜访目标设定',done:true,script:'明确本次拜访要达成的3个具体目标（了解需求/介绍产品/获取承诺）',checkpoint:'目标是否SMART？','duration':'5分钟',owner:'销售个人'},
    {id:3,name:'准备资料包',done:true,script:'产品手册+案例+名片+方案模板，按客户行业定制',checkpoint:'资料是否包含该行业案例？','duration':'10分钟',owner:'销售个人'}
  ]},
  { name:'开场破冰', color:'#67C23A', status:'done', tasks:[
    {id:4,name:'30秒自我介绍',done:true,script:'姓名+公司+一句话价值定位，不超过30秒',checkpoint:'是否能在30秒内说清楚"我是谁+做什么+为什么值得聊"？','duration':'30秒',owner:'销售个人'},
    {id:5,name:'议程确认',done:true,script:'"今天主要想了解X、介绍Y，大概需要Z分钟，您看可以吗？"',checkpoint:'客户是否明确同意议程？','duration':'1分钟',owner:'销售个人'}
  ]},
  { name:'需求挖掘', color:'#E6A23C', status:'ing', tasks:[
    {id:6,name:'开放式提问',done:true,script:'"目前最头疼的是什么？""理想状态是什么样？"',checkpoint:'是否至少问了3个开放式问题？','duration':'5分钟',owner:'销售个人'},
    {id:7,name:'痛点确认',done:true,script:'"所以您的核心问题是X和Y对吗？"主动总结并确认',checkpoint:'客户是否点头或口头确认？','duration':'2分钟',owner:'销售个人'},
    {id:8,name:'预算/决策链探测',done:false,script:'"这类项目在贵司一般谁拍板？""预算大概什么量级？"',checkpoint:'是否明确了决策人和预算范围？','duration':'3分钟',owner:'销售个人'}
  ]},
  { name:'产品介绍', color:'#F56C6C', status:'ing', tasks:[
    {id:9,name:'需求匹配展示',done:true,script:'针对客户痛点逐一对应产品功能，用"您刚才提到X，我们恰好能通过Y解决"的句式',checkpoint:'每个痛点是否都对应了产品功能？','duration':'8分钟',owner:'销售个人'},
    {id:10,name:'案例佐证',done:false,script:'准备2-3个同行业客户案例，包含具体数据',checkpoint:'案例是否包含数字？','duration':'3分钟',owner:'销售个人+团队'}
  ]},
  { name:'异议处理', color:'#909399', status:'ing', tasks:[
    {id:11,name:'倾听+共情',done:true,script:'"我完全理解您的顾虑" + 重复对方原话',checkpoint:'是否先共情再解释？','duration':'30秒',owner:'销售个人'},
    {id:12,name:'证据回应',done:false,script:'用证书、数据、案例回应，而非主观辩解',checkpoint:'回应是否包含客观证据？','duration':'2分钟',owner:'销售个人'}
  ]},
  { name:'促成成交', color:'#fbbf24', status:'todo', tasks:[
    {id:13,name:'试探性收单',done:false,script:'"如果我们能解决X问题，您愿意推进吗？"',checkpoint:'是否得到了客户的口头承诺？','duration':'1分钟',owner:'销售个人'},
    {id:14,name:'明确下一步',done:false,script:'"那我们先做X，下周三我再来跟您同步，您看方便吗？"',checkpoint:'是否约定了具体时间和内容？','duration':'1分钟',owner:'销售个人'}
  ]},
  { name:'售后跟进', color:'#409EFF', status:'todo', tasks:[
    {id:15,name:'24小时感谢信',done:false,script:'拜访后24小时内发送感谢邮件，附会议纪要和下一步计划',checkpoint:'邮件是否在24小时内发出？','duration':'5分钟',owner:'销售个人'},
    {id:16,name:'7天回访',done:false,script:'一周后主动回访，确认客户没有新问题',checkpoint:'回访是否完成？','duration':'5分钟',owner:'销售个人'}
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
