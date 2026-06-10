<template>
  <div class="launch-page">
    <div class="page-title">🚀 胸牌市场推广 · 发布前准备</div>

    <el-row :gutter="16" class="la-stats">
      <el-col :span="6"><el-card shadow="hover" class="la-stat"><div class="las-val" style="color:#409EFF">{{ totalTasks }}</div><div class="las-lbl">总任务</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="la-stat"><div class="las-val" style="color:#67C23A">{{ doneCount }}</div><div class="las-lbl">已完成</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="la-stat"><div class="las-val" style="color:#E6A23C">{{ totalTasks-doneCount }}</div><div class="las-lbl">进行中</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="hover" class="la-stat"><div class="las-val" style="color:#F56C6C">{{ urgentCount }}</div><div class="las-lbl">紧急</div></el-card></el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="16">
        <div v-for="phase in phases" :key="phase.id" class="la-phase">
          <div class="lap-header">
            <span class="laph-dot" :style="{background:phase.color}"></span>
            <span class="laph-title">{{ phase.name }}</span>
            <el-tag size="small" :type="phase.status==='done'?'success':phase.status==='ing'?'warning':'info'">{{ phase.status==='done'?'✅ 完成':phase.status==='ing'?'⟳ 进行中':'📋 待启动' }}</el-tag>
            <span class="laph-progress">{{ phase.tasks.filter(t=>t.status==='done').length }}/{{ phase.tasks.length }}</span>
          </div>
          <el-table :data="phase.tasks" size="small" stripe>
            <el-table-column type="index" width="40" />
            <el-table-column prop="name" label="任务" min-width="180" />
            <el-table-column prop="owner" label="负责人" width="90" />
            <el-table-column prop="deadline" label="截止" width="90">
              <template #default="{row}"><el-tag size="small" :type="row.status==='urgent'?'danger':''">{{ row.deadline }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{row}">
                <el-tag size="small" :type="row.status==='done'?'success':row.status==='ing'?'warning':row.status==='urgent'?'danger':'info'">
                  {{ row.status==='done'?'✅':row.status==='ing'?'⟳':row.status==='urgent'?'🔴':'📋' }} {{ {done:'完成',ing:'进行中',urgent:'紧急',todo:'待启动'}[row.status] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="depends" label="依赖" width="100" show-overflow-tooltip />
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="la-timeline-card">
          <template #header><span style="font-weight:700">📅 关键里程碑</span></template>
          <el-timeline>
            <el-timeline-item v-for="(m,idx) in milestones" :key="idx" :timestamp="m.date" placement="top" :color="m.status==='done'?'#67C23A':m.status==='ing'?'#409EFF':'#909399'">
              <div style="font-size:13px;font-weight:600">{{ m.name }}</div>
              <div style="font-size:11px;color:#909399">{{ m.desc }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card shadow="hover" style="margin-top:12px">
          <template #header><span style="font-weight:700">⚠️ 风险关注</span></template>
          <div v-for="r in risks" :key="r.title" class="la-risk">
            <el-icon :color="r.level==='high'?'#F56C6C':'#E6A23C'"><WarningFilled /></el-icon>
            <div><span class="lar-title">{{ r.title }}</span><span class="lar-desc">{{ r.desc }}</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const phases = [
  { id:1, name:'市场调研与定位', color:'#409EFF', status:'ing', tasks:[
    { name:'竞品分析报告', owner:'王佳敏', deadline:'6月5日', status:'ing', depends:'-' },
    { name:'目标客户画像', owner:'王佳敏', deadline:'6月8日', status:'ing', depends:'竞品分析' },
    { name:'产品核心卖点提炼', owner:'王志华', deadline:'6月8日', status:'ing', depends:'-' },
    { name:'定价策略初稿', owner:'王志华+朱炫', deadline:'6月10日', status:'todo', depends:'竞品分析+客户画像' }
  ]},
  { id:2, name:'销售物料准备', color:'#67C23A', status:'ing', tasks:[
    { name:'销售话术整理(银行)', owner:'潘峰', deadline:'6月5日', status:'urgent', depends:'-' },
    { name:'销售话术整理(汽车)', owner:'朱炫', deadline:'6月5日', status:'urgent', depends:'-' },
    { name:'产品手册设计', owner:'王佳敏', deadline:'6月12日', status:'ing', depends:'核心卖点' },
    { name:'案例集整理', owner:'王志华', deadline:'6月10日', status:'ing', depends:'-' },
    { name:'FAQ文档', owner:'王佳敏', deadline:'6月12日', status:'todo', depends:'话术+案例' }
  ]},
  { id:3, name:'渠道与宣发', color:'#E6A23C', status:'todo', tasks:[
    { name:'公众号/官网内容', owner:'王佳敏', deadline:'6月15日', status:'todo', depends:'产品手册' },
    { name:'行业媒体合作', owner:'王佳敏', deadline:'6月20日', status:'todo', depends:'-' },
    { name:'客户试用邀请', owner:'朱炫+潘峰', deadline:'6月18日', status:'todo', depends:'话术+手册' }
  ]},
  { id:4, name:'内部培训', color:'#F56C6C', status:'todo', tasks:[
    { name:'销售团队培训', owner:'王志华', deadline:'6月15日', status:'todo', depends:'话术+FAQ' },
    { name:'代理商培训', owner:'朱炫', deadline:'6月22日', status:'todo', depends:'销售培训' }
  ]}
]

const milestones = [
  { date:'6月5日', name:'话术V1完成', status:'ing', desc:'银行+汽车话术初稿' },
  { date:'6月10日', name:'定价+案例完成', status:'ing', desc:'销售物料齐套' },
  { date:'6月15日', name:'内部培训', status:'todo', desc:'销售团队就绪' },
  { date:'6月20日', name:'对外发布', status:'todo', desc:'官网+媒体同步上线' }
]

const risks = [
  { level:'high', title:'话术准备延期', desc:'银行/汽车话术6月5日节点紧张' },
  { level:'medium', title:'定价未定型', desc:'竞品对标数据不足' }
]

const totalTasks = computed(() => phases.reduce((s,p)=>s+p.tasks.length,0))
const doneCount = computed(() => phases.reduce((s,p)=>s+p.tasks.filter(t=>t.status==='done').length,0))
const urgentCount = computed(() => phases.reduce((s,p)=>s+p.tasks.filter(t=>t.status==='urgent').length,0))
</script>

<style scoped>
.launch-page{max-width:1100px;margin:0 auto;padding:8px}
.page-title{font-size:20px;font-weight:700;color:#303133;margin-bottom:16px}
.la-stats{margin-bottom:20px}.la-stat{text-align:center;padding:8px 0}.las-val{font-size:28px;font-weight:700}.las-lbl{font-size:13px;color:#909399;margin-top:4px}

.la-phase{margin-bottom:20px}
.lap-header{display:flex;align-items:center;gap:10px;padding:8px 0;margin-bottom:8px}.laph-dot{width:10px;height:10px;border-radius:50%}.laph-title{font-size:15px;font-weight:700;color:#303133}.laph-progress{font-size:12px;color:#909399;margin-left:auto}

.la-timeline-card{border-radius:12px}
.la-risk{display:flex;align-items:flex-start;gap:8px;padding:6px 0;font-size:12px}.lar-title{font-weight:600;color:#303133;display:block}.lar-desc{color:#909399}
</style>
