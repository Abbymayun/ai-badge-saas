<template>
  <div class="ai-assistant-page">
    <el-row :gutter="0" style="height:calc(100vh - 100px)">
      <!-- 左侧模型面板 -->
      <el-col :span="5" style="background:#161b22;border-right:1px solid #21262d;overflow-y:auto;padding:12px">
        <h3 style="color:#58a6ff;font-size:15px;margin-bottom:4px">🤖 AI 智能助手</h3>
        <p style="color:#8b949e;font-size:11px;margin-bottom:16px">利尔达 · Agent 多模型协同</p>

        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:#8b949e;margin-bottom:6px">🎯 主控模型</div>
          <div v-for="m in primaryModels" :key="m.id" class="model-item" :class="{active:orchestrator===m.id}" @click="selectOrch(m.id)">
            <span class="model-dot" :style="{background:m.color}"></span>
            <span class="model-name">{{ m.name }}</span>
            <el-tag v-if="m.tag" size="small" type="info">{{ m.tag }}</el-tag>
            <span v-if="orchestrator===m.id" style="color:#3fb950;margin-left:auto">✓</span>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:#8b949e;margin-bottom:6px">🔧 工作模型（多选）</div>
          <div v-for="m in workerModels" :key="m.id" class="model-item" @click="toggleW(m.id)">
            <span class="model-dot" :style="{background:m.color}"></span>
            <span class="model-name">{{ m.name }}</span>
            <el-tag v-if="m.tag" size="small" type="info">{{ m.tag }}</el-tag>
            <span v-if="workers.includes(m.id)" style="color:#3fb950;margin-left:auto">✓</span>
          </div>
        </div>

        <el-button size="small" style="width:100%;margin-bottom:6px" @click="newChat">➕ 新建对话</el-button>
        <el-button size="small" style="width:100%;margin-bottom:6px" @click="showSettings=!showSettings">⚙️ API 设置</el-button>
        <div style="font-size:10px;color:#484f58;margin-top:8px">
          🔧 {{ workers.length }} Workers · 🎯 {{ MODELS.find(m=>m.id===orchestrator)?.name }}
        </div>
      </el-col>

      <!-- 右侧对话区 -->
      <el-col :span="19" style="display:flex;flex-direction:column;background:#0d1117">
        <div style="padding:8px 16px;border-bottom:1px solid #21262d;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:13px;font-weight:600">{{ chat.title }}</span>
          <div>
            <el-tag size="small" type="success" v-if="connectionOK">🟢 已连接</el-tag>
            <el-tag size="small" type="danger" v-else>🔴 未连接</el-tag>
          </div>
        </div>

        <div class="msg-area" ref="msgArea">
          <div v-if="!chat.msgs.length" style="text-align:center;padding:60px 20px;color:#484f58">
            <div style="font-size:48px;margin-bottom:16px">🧠</div>
            <h3 style="color:#8b949e">Agent 多模型协同</h3>
            <p style="margin:8px 0 16px;font-size:13px">主控分析任务→返回JSON→前端调Worker API→汇总</p>
            <el-button size="small" @click="sendQuick('调用 GPT-5.3 Codex 写 Python 快速排序，然后让 Claude Opus 审查代码')">🧑‍💻 代码协作</el-button>
            <el-button size="small" style="margin-left:6px" @click="sendQuick('分别用 DeepSeek V4 Pro 和 Qwen 3.6 Plus 分析AI胸牌定价策略')">📊 双模型对比</el-button>
          </div>

          <div v-for="(m,i) in chat.msgs" :key="i">
            <!-- 用户消息 -->
            <div v-if="m.role==='user'" style="display:flex;justify-content:flex-end;margin:12px 0">
              <div style="max-width:75%;background:#1f2937;padding:10px 16px;border-radius:12px 12px 4px 12px;font-size:14px;color:#c9d1d9;line-height:1.7">{{ m.content }}</div>
            </div>

            <!-- Agent消息 -->
            <div v-else style="margin:12px 0">
              <div style="font-size:11px;color:#58a6ff;margin-bottom:4px">🤖 Agent</div>
              
              <!-- 思考过程 -->
              <div v-if="m.thinking?.length" style="margin:6px 0;border:1px solid #21262d;border-radius:8px;overflow:hidden">
                <div style="padding:6px 10px;background:#161b22;font-size:11px;color:#d2a8ff;cursor:pointer" @click="m.thinkOpen=!m.thinkOpen">💭 思考({{ m.thinking.length }}步) {{ m.thinkOpen?'▾':'▸' }}</div>
                <div v-if="m.thinkOpen" style="padding:8px 12px;font-size:11px;color:#8b949e;line-height:1.6;border-top:1px solid #21262d">
                  <div v-for="t in m.thinking" :key="t.time">[{{ t.time }}] {{ t.text }}</div>
                </div>
              </div>

              <!-- 模型调用 -->
              <div v-for="c in (m.calls||[])" :key="c.model" style="margin:6px 0;border:1px solid #1f6feb;border-left:3px solid #1f6feb;border-radius:6px">
                <div style="padding:6px 10px;background:#0d213b;font-size:11px;display:flex;align-items:center;gap:6px">
                  <span class="model-dot" :style="{background:c.color}"></span>{{ c.model }}
                  <el-tag size="small" :type="c.status==='done'?'success':c.status==='running'?'':'danger'">{{ c.status==='done'?'✓':c.status==='running'?'⟳':'✗' }}</el-tag>
                </div>
                <div v-if="c.result" style="padding:8px 12px;font-size:13px;color:#c9d1d9;line-height:1.6;max-height:250px;overflow-y:auto;white-space:pre-wrap;background:#0d1117">{{ c.result }}</div>
                <div v-if="c.error" style="padding:8px 12px;color:#f85149;font-size:12px;background:#0d1117">{{ c.error }}</div>
              </div>

              <!-- 内容 -->
              <div v-if="m.content" style="font-size:14px;color:#c9d1d9;line-height:1.8;white-space:pre-wrap">{{ m.content }}</div>
              <div v-else-if="!m.thinking?.length&&!m.calls?.length" style="color:#8b949e;font-size:13px">思考中...</div>
            </div>
          </div>
        </div>

        <div style="padding:12px 16px;border-top:1px solid #21262d;display:flex;gap:8px">
          <el-input v-model="inputText" placeholder="输入任务，Agent会分析并调用Worker模型..." @keyup.enter="sendMsg" :disabled="running" size="small" style="flex:1" />
          <el-button type="primary" size="small" @click="sendMsg" :disabled="running||!inputText.trim()" :loading="running">发送</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 设置弹窗 -->
    <el-dialog v-model="showSettings" title="⚙️ API 设置" width="500px">
      <el-form label-width="140px" size="small">
        <el-form-item label="API Key"><el-input v-model="apiKey" type="password" /></el-form-item>
        <el-form-item label="OpenAI模型地址"><el-input v-model="apiOpenAI" placeholder="http://10.16.11.195/v1" /></el-form-item>
        <el-form-item label="Claude模型地址"><el-input v-model="apiClaude" placeholder="http://10.16.11.195" /></el-form-item>
        <el-form-item label="连接状态"><el-tag :type="connectionOK?'success':'danger'">{{ connectionOK?'已连接':'未连接，请测试' }}</el-tag></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="testConn" size="small">🔌 测试连接</el-button>
        <el-button @click="showSettings=false" size="small">取消</el-button>
        <el-button type="primary" @click="saveCfg" size="small">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const MODELS = [
  {id:'claude-sonnet-4-6',name:'Claude Sonnet 4',tag:'推荐',color:'#d4773a',cat:'p'},
  {id:'claude-opus-4-6',name:'Claude Opus 4',tag:'最强',color:'#b83bd4',cat:'p'},
  {id:'gpt-5.5',name:'GPT-5.5',tag:'',color:'#10a37f',cat:'p'},
  {id:'gpt-5.4',name:'GPT-5.4',tag:'',color:'#10a37f',cat:'p'},
  {id:'gpt-5.3-codex',name:'GPT-5.3 Codex',tag:'代码',color:'#10a37f',cat:'b'},
  {id:'deepseek-v4-pro',name:'DeepSeek V4 Pro',tag:'',color:'#4f46e5',cat:'b'},
  {id:'deepseek-v4-flash',name:'DeepSeek V4 Flash',tag:'快速',color:'#4f46e5',cat:'w'},
  {id:'deepseek-r1',name:'DeepSeek R1',tag:'推理',color:'#4f46e5',cat:'w'},
  {id:'MiniMax-M2.7',name:'MiniMax M2.7',tag:'',color:'#f59e0b',cat:'w'},
  {id:'qwen3.6-plus',name:'Qwen 3.6 Plus',tag:'',color:'#06b6d4',cat:'w'},
  {id:'qwen3.5-plus',name:'Qwen 3.5 Plus',tag:'',color:'#06b6d4',cat:'w'},
  {id:'qwen3-coder-plus',name:'Qwen Coder Plus',tag:'代码',color:'#06b6d4',cat:'w'}
]

const primaryModels = MODELS.filter(m=>m.cat==='p'||m.cat==='b')
const workerModels = MODELS.filter(m=>m.cat==='w'||m.cat==='b')

const showSettings = ref(false); const running = ref(false); const connectionOK = ref(false)
const inputText = ref(''); const msgArea = ref(null)
const apiKey = ref('voVHB960PuPIgHnHK42wb7q84XnJgd6jhACq009RUSeLWRyQ')
const apiOpenAI = ref('http://10.16.11.195/v1'); const apiClaude = ref('http://10.16.11.195')
const orchestrator = ref('claude-sonnet-4-6'); const workers = ref(['gpt-5.3-codex','deepseek-v4-pro','qwen3.6-plus'])

const chat = reactive({title:'新对话',msgs:[]})

function selectOrch(id){orchestrator.value=id}
function toggleW(id){const i=workers.value.indexOf(id);if(i>=0)workers.value.splice(i,1);else workers.value.push(id)}
function newChat(){chat.title='新对话';chat.msgs=[]}
function sendQuick(t){inputText.value=t;sendMsg()}

async function sendMsg(){
  const t = inputText.value.trim(); if(!t||running.value) return
  inputText.value = ''; running.value = true
  const now = new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})
  chat.msgs.push({role:'user',content:t})
  const ai = chat.msgs.length
  chat.msgs.push({role:'assistant',thinking:[],calls:[],thinkOpen:true})
  scrollBottom()

  try{
    addThink(ai,'🔍 主控分析任务...');await sleep(200)
    const wlist = workers.value.map(w=>MODELS.find(m=>m.id===w)?.name||w).join('、')
    const planRaw = await api(orchestrator.value,`【只返回JSON】分析任务。可用:${wlist}。格式:{"steps":[{"call":true/false,"model":"模型名","task":"子任务"}],"reason":"原因"}。用户:${t}`,1200)
    let plan = {steps:[],reason:''}
    try{const j=planRaw.replace(/```json\n?/g,'').replace(/```/g,'').trim();const m=j.match(/\{[\s\S]*\}/);if(m)plan=JSON.parse(m[0])}catch(e){}
    addThink(ai,`📋 ${plan.reason||'直接回答'}\n${(plan.steps||[]).map(p=>p.call?`📞${p.model}:${p.task}`:'直接回答').join('\n')}`)
    scrollBottom();await sleep(200)

    let ctx=t;const results=[]
    for(const s of (plan.steps||[])){
      if(!s.call) continue
      const mid = workers.value.find(w=>MODELS.find(m=>m.id===w)?.name===s.model)||workers.value[0]
      if(!mid) continue
      const c={model:MODELS.find(m=>m.id===mid)?.name||mid,color:MODELS.find(m=>m.id===mid)?.color,status:'running',result:'',error:''}
      chat.msgs[ai].calls.push(c);scrollBottom();await sleep(200)
      try{
        c.result = await api(mid,`${s.task}\n上下文:${ctx}`,1500)
        c.status='done';ctx+=`\n[${c.model}]:${c.result}`;results.push({m:c.model,r:c.result})
      }catch(e){c.status='error';c.error=e.message}
      scrollBottom();await sleep(200)
    }
    addThink(ai,'🤝 汇总...');scrollBottom()
    const fp = results.length ? `综合回答:${t}\n\n${results.map(r=>`【${r.m}】${r.r}`).join('\n\n')}` : t
    chat.msgs[ai].content = await api(orchestrator.value,fp,2000)
    addThink(ai,'✅ 完成')
  }catch(e){
    chat.msgs[ai].content = `❌ ${e.message}`
    addThink(ai,`❌ ${e.message}`)
    if(e.message.includes('请先配置')) showSettings.value=true
  }
  running.value=false;scrollBottom()
}

function addThink(i,t){chat.msgs[i].thinking.push({time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}),text:t})}
function scrollBottom(){nextTick(()=>{if(msgArea.value)msgArea.value.scrollTop=msgArea.value.scrollHeight})}

async function api(modelId,prompt,maxT=2000){
  const base = modelId.startsWith('claude-') ? apiClaude.value : apiOpenAI.value
  if(!base||!apiKey.value) throw new Error('请先配置API地址和Key（点击⚙️）')
  const r = await fetch(`${base.replace(/\/$/,'')}/chat/completions`,{
    method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey.value}`},
    body:JSON.stringify({model:modelId,temperature:0.7,max_tokens:maxT,
      messages:[{role:'system',content:'你是任务分析器。只返回JSON。'},{role:'user',content:prompt}]})})
  if(!r.ok){const e=await r.text();throw new Error(`HTTP ${r.status}`)}
  const d=await r.json();return d.choices?.[0]?.message?.content||''
}

async function testConn(){
  try{
    await api('gpt-5.5','hello',50)
    connectionOK.value=true;ElMessage.success('连接成功')
  }catch(e){
    connectionOK.value=false;ElMessage.error('连接失败: '+e.message)
  }
}
function saveCfg(){ElMessage.success('已保存');showSettings.value=false}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
</script>

<style scoped>
.ai-assistant-page{background:#0d1117;color:#c9d1d9}
.model-item{display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:4px;cursor:pointer;font-size:13px;margin-bottom:2px}
.model-item:hover{background:#1c2128}
.model-item.active{background:#1f2937;border:1px solid #30363d}
.model-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.model-name{flex:1;color:#c9d1d9}
.msg-area{flex:1;overflow-y:auto;padding:16px}
</style>
