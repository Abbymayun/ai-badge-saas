<template>
  <div class="exec-page">
    <div class="page-header">
      <h2>📋 销售执行 SOP</h2>
      <p>选择客户 → 按阶段执行 → 上传资料 → AI辅助完成</p>
    </div>

    <!-- 客户选择 -->
    <el-card shadow="hover" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:16px">
        <span style="font-weight:600;white-space:nowrap">选择客户：</span>
        <el-select v-model="selectedCustomer" filterable placeholder="搜索客户" style="flex:1;max-width:300px" @change="loadCustomer">
          <el-option v-for="c in customers" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
        <el-button type="primary" @click="newCustomer">+ 新建客户</el-button>
      </div>
    </el-card>

    <!-- 进度概览 -->
    <el-card v-if="selectedCustomer" shadow="hover" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span style="font-weight:600">{{ customerName }}</span>
        <el-progress :percentage="totalProgress" :color="progressColor" style="flex:1;min-width:200px" />
        <span style="font-size:13px;color:#909399">{{ donePhases }}/{{ phases.length }} 阶段完成</span>
      </div>
    </el-card>

    <!-- SOP阶段执行 -->
    <div v-if="selectedCustomer" class="phase-list">
      <div v-for="(phase, pidx) in phases" :key="pidx" class="exec-phase" :class="{ done: phase._done, active: phase._active }">
        <div class="phase-header" @click="togglePhase(pidx)">
          <div class="phase-left" :style="{borderLeftColor: phase.color}">
            <span class="phase-num">{{ pidx+1 }}</span>
            <span class="phase-title">{{ phase.name }}</span>
            <el-tag :type="phase._done?'success':'info'" size="small">{{ phase._done ? '✅ 已完成' : '进行中' }}</el-tag>
          </div>
          <el-icon class="phase-arrow" :class="{rotated:phase._active}"><ArrowDown /></el-icon>
        </div>

        <div v-show="phase._active" class="phase-body">
          <div v-for="task in phase.tasks" :key="task.id" class="exec-task" :class="{completed: task._done}">
            <div class="task-header">
              <el-checkbox v-model="task._done" @change="onTaskChange(pidx, task)" />
              <span class="task-name">{{ task.name }}</span>
              <el-tag size="small" :type="task._done?'success':'warning'">{{ task._done?'已完成':'待执行' }}</el-tag>
            </div>
            <div class="task-info" v-if="!task._done || task._note">
              <div class="task-script"><strong>话术要点：</strong>{{ task.script }}</div>
              <div class="task-check"><strong>检查点：</strong>{{ task.checkpoint }}</div>
            </div>

            <!-- 执行资料 -->
            <div class="task-evidence" v-if="task._done || task._uploading">
              <div class="ev-bar">
                <span class="ev-label">📎 执行资料</span>
                <el-upload
                  :show-file-list="false"
                  :before-upload="(file)=>uploadFile(file, pidx, task)"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                >
                  <el-button size="small" type="primary" plain>上传文件</el-button>
                </el-upload>
              </div>

              <!-- 已上传文件 -->
              <div v-for="(file, fidx) in task._files" :key="fidx" class="ev-file">
                <span>📄 {{ file.name }}</span>
                <span class="ev-status" v-if="file.recognizing">🔍 AI识别中...</span>
                <span class="ev-status" v-else-if="file.recognized">✅ 已识别</span>
              </div>

              <!-- AI识别内容 -->
              <div v-if="task._aiText" class="ev-ai">
                <div class="ev-ai-header">🤖 AI自动补全</div>
                <div class="ev-ai-body">{{ task._aiText }}</div>
              </div>

              <!-- 手动备注 -->
              <el-input
                v-model="task._note"
                type="textarea"
                :rows="2"
                placeholder="补充备注或执行记录..."
                style="margin-top:8px"
                @change="saveProgress"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无客户提示 -->
    <el-empty v-if="!selectedCustomer" description="请先选择或新建一个客户开始执行SOP" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const customers = ref([
  { id: 'c1', name: '杭州银行西湖支行' },
  { id: 'c2', name: '深圳前海汽车集团' },
  { id: 'c3', name: '上海仁济医院' },
  { id: 'c4', name: '北京师范大学附属中学' }
])
const selectedCustomer = ref('')
const customerName = ref('')

const phases = ref([
  { name:'客户拜访前准备', color:'#409EFF', _done:false, _active:true, tasks:[
    {id:1,name:'客户背景调研',_done:false,script:'提前研究客户行业、规模、痛点，准备3个针对性问题',checkpoint:'是否完成客户公司官网/年报/新闻查阅？','duration':'15分钟',_files:[],_aiText:'',_note:''},
    {id:2,name:'拜访目标设定',_done:false,script:'明确本次拜访要达成的3个具体目标',checkpoint:'目标是否SMART？','duration':'5分钟',_files:[],_aiText:'',_note:''},
    {id:3,name:'准备资料包',_done:false,script:'产品手册+案例+名片+方案模板，按客户行业定制',checkpoint:'资料是否包含该行业案例？','duration':'10分钟',_files:[],_aiText:'',_note:''}
  ]},
  { name:'开场破冰', color:'#67C23A', _done:false, _active:false, tasks:[
    {id:4,name:'30秒自我介绍',_done:false,script:'姓名+公司+一句话价值定位，不超过30秒',checkpoint:'是否能在30秒内说清楚？','duration':'30秒',_files:[],_aiText:'',_note:''},
    {id:5,name:'议程确认',_done:false,script:'确定谈话议程和时间',checkpoint:'客户是否明确同意议程？','duration':'1分钟',_files:[],_aiText:'',_note:''}
  ]},
  { name:'需求挖掘', color:'#E6A23C', _done:false, _active:false, tasks:[
    {id:6,name:'开放式提问',_done:false,script:'至少问3个开放式问题',checkpoint:'是否至少问了3个？','duration':'5分钟',_files:[],_aiText:'',_note:''},
    {id:7,name:'痛点确认',_done:false,script:'主动总结并确认客户痛点',checkpoint:'客户是否确认？','duration':'2分钟',_files:[],_aiText:'',_note:''},
    {id:8,name:'决策链探测',_done:false,script:'了解决策人和预算范围',checkpoint:'是否明确了决策信息？','duration':'3分钟',_files:[],_aiText:'',_note:''}
  ]},
  { name:'产品介绍', color:'#F56C6C', _done:false, _active:false, tasks:[
    {id:9,name:'需求匹配展示',_done:false,script:'针对痛点对应产品功能',checkpoint:'每个痛点是否对应了功能？','duration':'8分钟',_files:[],_aiText:'',_note:''},
    {id:10,name:'案例佐证',_done:false,script:'准备2-3个同行业案例',checkpoint:'案例是否包含数字？','duration':'3分钟',_files:[],_aiText:'',_note:''}
  ]},
  { name:'异议处理', color:'#909399', _done:false, _active:false, tasks:[
    {id:11,name:'倾听+共情',_done:false,script:'先共情再解释',checkpoint:'是否先共情？','duration':'30秒',_files:[],_aiText:'',_note:''},
    {id:12,name:'证据回应',_done:false,script:'用证书、数据、案例回应',checkpoint:'是否包含客观证据？','duration':'2分钟',_files:[],_aiText:'',_note:''}
  ]},
  { name:'促成成交', color:'#fbbf24', _done:false, _active:false, tasks:[
    {id:13,name:'试探性收单',_done:false,script:'试探客户成交意愿',checkpoint:'是否得到口头承诺？','duration':'1分钟',_files:[],_aiText:'',_note:''},
    {id:14,name:'明确下一步',_done:false,script:'约定具体时间和内容',checkpoint:'是否约定了下一步？','duration':'1分钟',_files:[],_aiText:'',_note:''}
  ]},
  { name:'售后跟进', color:'#409EFF', _done:false, _active:false, tasks:[
    {id:15,name:'24小时感谢信',_done:false,script:'24小时内发送感谢邮件',checkpoint:'邮件是否发出？','duration':'5分钟',_files:[],_aiText:'',_note:''},
    {id:16,name:'7天回访',_done:false,script:'一周后主动回访',checkpoint:'回访是否完成？','duration':'5分钟',_files:[],_aiText:'',_note:''}
  ]}
])

const donePhases = computed(() => phases.value.filter(p => p._done).length)
const totalTasks = computed(() => phases.value.reduce((s,p) => s + p.tasks.length, 0))
const doneTasks = computed(() => phases.value.reduce((s,p) => s + p.tasks.filter(t => t._done).length, 0))
const totalProgress = computed(() => totalTasks.value > 0 ? Math.round(doneTasks.value/totalTasks.value*100) : 0)
const progressColor = computed(() => {
  if(totalProgress.value >= 80) return '#67C23A'
  if(totalProgress.value >= 40) return '#409EFF'
  return '#E6A23C'
})

function loadCustomer(id) {
  const c = customers.value.find(x => x.id === id)
  if(c) customerName.value = c.name
}

function newCustomer() {
  ElMessageBox.prompt('请输入客户名称', '新建客户').then(({value}) => {
    if(value) {
      const c = { id:'c'+Date.now(), name:value }
      customers.value.unshift(c)
      selectedCustomer.value = c.id
      customerName.value = c.name
    }
  }).catch(()=>{})
}

function togglePhase(pidx) {
  phases.value[pidx]._active = !phases.value[pidx]._active
}

function onTaskChange(pidx, task) {
  if(task._done) {
    ElMessage.success(`"${task.name}" 标记为已完成`)
  }
  // Check if all tasks in phase are done
  const phase = phases.value[pidx]
  phase._done = phase.tasks.every(t => t._done)
  saveProgress()
}

function uploadFile(file, pidx, task) {
  task._files = task._files || []
  task._files.push({ name: file.name, recognizing: true, recognized: false })
  ElMessage.info(`${file.name} 上传中，AI正在识别...`)

  // Simulate AI recognition
  setTimeout(() => {
    const fileItem = task._files.find(f => f.name === file.name)
    if(fileItem) {
      fileItem.recognizing = false
      fileItem.recognized = true
    }
    task._aiText = task._aiText || ''
    task._aiText += `\n[来自 ${file.name}]: AI识别到以下关键信息：客户关注成本控制和售后服务，决策周期约2-3周，预算范围中等。建议优先展示ROI数据和售后保障方案。`
    saveProgress()
    ElMessage.success(`${file.name} AI识别完成`)
  }, 1500)

  return false
}

function saveProgress() {
  // Save to localStorage for persistence
  const data = {
    customerId: selectedCustomer.value,
    phases: phases.value.map(p => ({
      _done: p._done,
      _active: p._active,
      tasks: p.tasks.map(t => ({
        _done: t._done,
        _files: t._files,
        _aiText: t._aiText,
        _note: t._note
      }))
    }))
  }
  localStorage.setItem('sop_progress_' + selectedCustomer.value, JSON.stringify(data))
}
</script>

<style scoped>
.exec-page { padding: 24px; background: #f5f7fa; min-height: 100vh }
.page-header { margin-bottom: 16px }
.page-header h2 { font-size: 24px; color: #303133 }
.page-header p { color: #909399; font-size: 14px; margin-top: 4px }

.phase-list { max-width: 1100px }
.exec-phase { margin-bottom: 8px; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #ebeef5 }
.exec-phase.done { opacity: .8 }
.exec-phase.active { border-color: #409EFF }

.phase-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; user-select: none }
.phase-header:hover { background: #fafbfc }
.phase-left { display: flex; align-items: center; gap: 10px; border-left: 4px solid; padding-left: 10px }
.phase-num { width: 26px; height: 26px; border-radius: 50%; background: #409EFF; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center }
.phase-title { font-size: 16px; font-weight: 600; color: #303133 }
.phase-arrow { font-size: 16px; color: #909399; transition: .2s }
.phase-arrow.rotated { transform: rotate(180deg) }

.phase-body { padding: 0 16px 16px }
.exec-task { padding: 12px; margin-bottom: 8px; background: #fafbfc; border-radius: 8px; border: 1px solid #ebeef5 }
.exec-task.completed { background: #f0f9eb; border-color: #c8e6c9 }

.task-header { display: flex; align-items: center; gap: 8px }
.task-name { font-size: 14px; font-weight: 600; color: #303133; flex: 1 }
.task-info { margin-top: 8px; font-size: 12px; color: #606266; line-height: 1.6 }
.task-script, .task-check { margin: 3px 0 }

.task-evidence { margin-top: 12px; padding-top: 12px; border-top: 1px dashed #ddd }
.ev-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px }
.ev-label { font-size: 12px; color: #909399; font-weight: 500 }
.ev-file { display: flex; align-items: center; gap: 8px; padding: 4px 8px; background: #fff; border-radius: 4px; margin: 4px 0; font-size: 12px }
.ev-status { color: #909399; font-size: 11px }
.ev-ai { margin-top: 8px; padding: 10px; background: #eff8ff; border-radius: 6px; border: 1px solid #b3d8ff }
.ev-ai-header { font-size: 12px; font-weight: 600; color: #409EFF; margin-bottom: 4px }
.ev-ai-body { font-size: 12px; color: #606266; line-height: 1.6; white-space: pre-wrap }
</style>
