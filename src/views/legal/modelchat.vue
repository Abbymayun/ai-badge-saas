<template>
  <div style="display:flex;height:calc(100vh - 100px)">
    <!-- 左侧模型列表 -->
    <div style="width:220px;background:#161b22;border-right:1px solid #21262d;padding:14px;overflow-y:auto">
      <h3 style="color:#58a6ff;font-size:14px;margin-bottom:4px">🔌 AI 模型调用</h3>
      <div style="font-size:11px;color:#8b949e;margin-bottom:14px">{{ isHTTP ? '🟢 HTTP环境·可直连' : '🔴 HTTPS·需本地打开' }}</div>
      
      <div v-for="m in models" :key="m.id" 
        style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;margin:2px 0;font-size:13px"
        :style="{background: selected===m.id?'#1f2937':'',border:selected===m.id?'1px solid #30363d':''}"
        @click="selectModel(m.id)">
        <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0" :style="{background:m.color}"></span>
        <span style="flex:1;color:#c9d1d9">{{ m.name }}</span>
        <span v-if="m.tag" style="font-size:9px;padding:1px 5px;border-radius:3px;background:#21262d;color:#8b949e">{{ m.tag }}</span>
        <span v-if="selected===m.id" style="color:#3fb950;font-size:12px">✓</span>
      </div>

      <el-button size="small" style="width:100%;margin-top:8px" @click="showConfig=true">⚙️ API配置</el-button>
      <div style="font-size:10px;color:#484f58;margin-top:8px;line-height:1.5">
        {{ cfg.apiKey ? 'Key: ' + cfg.apiKey.substring(0,12) + '...' : '未配置' }}<br>
        {{ isHTTP ? '🟢 可直连内网API' : '🔴 HTTPS环境，需切换到本地HTTP' }}
      </div>
    </div>

    <!-- 右侧对话 -->
    <div style="flex:1;display:flex;flex-direction:column;background:#0d1117">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid #21262d;background:#161b22">
        <span style="font-size:13px;font-weight:600">{{ currentModel?.name || '选择模型' }}</span>
        <el-button size="small" @click="clearCurrent" :disabled="!currentMsgs.length">清空当前对话</el-button>
      </div>

      <div style="flex:1;overflow-y:auto;padding:16px" ref="msgBox">
        <div v-if="!currentMsgs.length" style="text-align:center;padding:80px 20px;color:#484f58">
          <div style="font-size:48px;margin-bottom:12px">💬</div>
          <p style="font-size:14px;color:#8b949e">{{ currentModel?.name || '选择模型' }} · 开始对话</p>
          <p v-if="!isHTTP" style="font-size:12px;color:#f85149;margin-top:8px">⚠️ 当前为HTTPS环境，无法调用HTTP内网API。<br>请用 npm run dev 本地打开以连通API。</p>
        </div>
        <div v-for="(m,i) in currentMsgs" :key="i" :style="{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',marginBottom:'16px'}">
          <div v-if="m.role==='user'" style="max-width:75%;background:#1f2937;padding:10px 14px;border-radius:14px 14px 4px 14px;font-size:13px;color:#c9d1d9;line-height:1.7;white-space:pre-wrap">{{ m.content }}</div>
          <div v-else style="font-size:13px;color:#c9d1d9;line-height:1.8;max-width:85%">
            <div v-if="m.loading" style="color:#58a6ff;font-size:12px">⏳ 生成中...</div>
            <div v-else v-html="md(m.content)"></div>
            <div v-if="m.mock" style="margin-top:6px;padding:6px 10px;background:#1a1228;border:1px solid #6e40c9;border-radius:6px;font-size:11px;color:#d2a8ff">
              ⚠️ API调用失败（{{ m.mock }}），这是模拟回复。请用 <b>npm run dev</b> 在本地HTTP环境打开以连通API。
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid #21262d;background:#161b22">
        <el-input v-model="input" placeholder="输入消息..." @keyup.enter="send" :disabled="loading || !selected" size="small" style="flex:1" />
        <el-button type="primary" size="small" @click="send" :disabled="loading || !selected || !input.trim()" :loading="loading">发送</el-button>
      </div>
    </div>

    <!-- 配置弹窗 -->
    <el-dialog v-model="showConfig" title="⚙️ API 配置" width="450px">
      <el-form label-width="120px" size="small">
        <el-form-item label="API Key"><el-input v-model="cfg.apiKey" type="password" /></el-form-item>
        <el-form-item label="OpenAI地址"><el-input v-model="cfg.apiBase" /></el-form-item>
        <el-form-item label="Claude地址"><el-input v-model="cfg.apiClaude" /></el-form-item>
        <el-form-item label="当前环境"><el-tag :type="isHTTP?'success':'danger'">{{ isHTTP?'🟢 HTTP·可连通':'🔴 HTTPS·需本地' }}</el-tag></el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="testConn">🔌 测试</el-button>
        <el-button size="small" type="primary" @click="saveCfg">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const cfg = reactive({
  apiKey: 'voVHB960PuPIgHnHK42wb7q84XnJgd6jhACq009RUSeLWRyQ',
  apiBase: 'http://10.16.11.195/v1',
  apiClaude: 'http://10.16.11.195'
})

const isHTTP = computed(() => window.location.protocol === 'http:')

const models = [
  {id:'claude-sonnet-4-6',name:'Claude Sonnet 4',tag:'推荐',color:'#d4773a'},
  {id:'claude-opus-4-6',name:'Claude Opus 4',tag:'最强',color:'#b83bd4'},
  {id:'gpt-5.5',name:'GPT-5.5',color:'#10a37f'},
  {id:'gpt-5.4',name:'GPT-5.4',color:'#10a37f'},
  {id:'gpt-5.3-codex',name:'GPT-5.3 Codex',tag:'代码',color:'#10a37f'},
  {id:'deepseek-v4-pro',name:'DeepSeek V4 Pro',color:'#4f46e5'},
  {id:'deepseek-v4-flash',name:'DeepSeek V4 Flash',tag:'快速',color:'#4f46e5'},
  {id:'deepseek-r1',name:'DeepSeek R1',tag:'推理',color:'#4f46e5'},
  {id:'MiniMax-M2.7',name:'MiniMax M2.7',color:'#f59e0b'},
  {id:'qwen3.6-plus',name:'Qwen 3.6 Plus',color:'#06b6d4'},
  {id:'qwen3.5-plus',name:'Qwen 3.5 Plus',color:'#06b6d4'},
  {id:'qwen3-coder-plus',name:'Qwen Coder Plus',tag:'代码',color:'#06b6d4'}
]

const selected = ref('claude-sonnet-4-6')
const input = ref('')
const loading = ref(false)
const showConfig = ref(false)
const msgBox = ref(null)

// 每个模型独立的对话历史
const modelChats = reactive({})

const currentModel = computed(() => models.find(m=>m.id===selected.value))
const currentMsgs = computed(() => modelChats[selected.value] || [])

function selectModel(id){
  selected.value = id
  if(!modelChats[id]) modelChats[id] = []
}

function clearCurrent(){
  modelChats[selected.value] = []
}

async function send(){
  const t = input.value.trim()
  if(!t || loading.value) return
  input.value = ''
  loading.value = true

  const chat = modelChats[selected.value]
  chat.push({role:'user', content:t})
  const ai = chat.length
  chat.push({role:'ai', loading:true})
  scrollBottom()

  try {
    const base = selected.value.startsWith('claude-') ? (cfg.apiClaude || cfg.apiBase) : cfg.apiBase
    // 本地HTTP环境 → 通过Vite代理避免CORS
    const isLocal = window.location.hostname === 'localhost'
    const url = isLocal 
      ? (selected.value.startsWith('claude-') ? '/api/claude/chat/completions' : '/api/openai/chat/completions')
      : (base.replace(/\/$/,'') + '/chat/completions')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+cfg.apiKey},
      body: JSON.stringify({model: selected.value, messages: [{role:'user',content:t}], max_tokens: 2000}),
      signal: controller.signal
    })
    clearTimeout(timeout)
    if(!res.ok) throw new Error('HTTP '+res.status)
    const d = await res.json()
    chat[ai] = {role:'ai', content: d.choices?.[0]?.message?.content || '无内容'}
  } catch(e) {
    let errMsg = e.message
    if(e.name === 'AbortError') errMsg = '请求超时(10秒)'
    else if(errMsg.includes('Failed to fetch')) errMsg = '网络不通·请确认已连公司VPN'
    chat[ai] = {
      role:'ai', 
      content: mockResponse(currentModel.value?.name||'', t),
      mock: errMsg
    }
  }
  loading.value = false
  scrollBottom()
}

function mockResponse(modelName, msg){
  if(msg.length < 5) return '你好！我是' + modelName + '。有什么可以帮助你的？'
  return '## ' + modelName + ' 的回复\n\n收到你的消息：「' + msg.substring(0,40) + '...」\n\n由于当前为HTTPS环境，无法直连公司内网HTTP API（10.16.11.195），这是一条模拟回复。\n\n**如需真正调用API：**\n1. 在项目目录运行 `npm run dev`\n2. 打开 `http://localhost:5173` \n3. 在此页面即可正常调用所有12个模型\n\n> HTTP环境下API已配置，可直接连通。'
}

function scrollBottom(){
  nextTick(()=>{ if(msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight })
}

function md(s){
  return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/```(\w*)\n([\s\S]*?)```/g,'<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\n\n/g,'<br><br>')
}

function saveConfig(){ showConfig.value = false; ElMessage.success('已保存') }
async function testConn(){
  try {
    const res = await fetch(cfg.apiBase.replace(/\/$/,'')+'/models', {headers:{'Authorization':'Bearer '+cfg.apiKey}})
    if(res.ok) ElMessage.success('连接成功')
    else ElMessage.error('HTTP '+res.status)
  } catch(e) { ElMessage.error('失败: '+e.message+'（需连VPN+HTTP环境）') }
}
</script>
