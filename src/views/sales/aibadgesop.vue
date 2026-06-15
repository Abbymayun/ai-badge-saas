<template>
  <div class="sop-page">
    <div class="top-bar">
      <div>
        <div class="page-title">🤖 AI胸牌 · 销售SOP</div>
        <div class="page-subtitle">流程在左 · 话术在右 · 基于销售心理学</div>
      </div>
      <el-button :type="editMode ? 'success' : 'primary'" size="small" @click="toggleEdit">{{ editMode ? '💾 保存' : '✏️ 编辑' }}</el-button>
    </div>

    <div class="sop-layout">
      <div class="sop-left">
        <div class="left-header">📋 销售流程</div>
        <div v-for="(phase, pidx) in phases" :key="pidx" class="left-phase">
          <div class="lp-title" @click="activePhase=pidx" :class="{active:activePhase===pidx}">
            <span class="lp-num">{{ pidx+1 }}</span><span class="lp-name">{{ phase.name }}</span>
            <span class="lp-progress">{{ phase.tasks.filter(t=>t._done).length }}/{{ phase.tasks.length }}</span>
          </div>
          <div v-show="activePhase===pidx" class="lp-tasks">
            <div v-for="task in phase.tasks" :key="task.id" class="lp-task" :class="{active:activeTask===task.id}" @click="activeTask=task.id">
              <span class="lpt-dot" :style="{background:task._done?'#67C23A':'#ccc'}"></span>
              <span class="lpt-name">{{ task.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="sop-right" v-if="currentTask">
        <div class="right-header"><span class="rh-phase">{{ currentPhase?.name }}</span><span class="rh-arrow">→</span><span class="rh-task">{{ currentTask.name }}</span></div>
        <div class="script-block"><div class="sb-label">💬 标准话术</div><div class="sb-content">{{ currentTask.script }}</div></div>
        <div class="psych-block" v-if="currentTask.psychology?.length"><div class="pb-label">🧠 销售心理学</div>
          <div class="pb-item" v-for="(item,ix) in currentTask.psychology" :key="ix">
            <span class="pb-theory">{{ item.theory }}</span><span class="pb-apply">{{ item.apply }}</span>
          </div>
        </div>
        <div class="demo-block" v-if="currentTask.demo?.length"><div class="db-label">🎭 示例对话</div>
          <div class="db-item" v-for="(line,lx) in currentTask.demo" :key="lx" :class="line.role">
            <span class="db-role">{{ line.role==='sales'?'销售':'客户' }}：</span><span class="db-text">{{ line.text }}</span>
          </div>
        </div>
        <div class="check-block"><div class="cb-label">✅ 执行检查</div><div class="cb-content">{{ currentTask.checkpoint }}</div></div>
        <div class="right-footer">
          <span>⏱ {{ currentTask.duration }}</span>
          <el-tag v-if="currentTask._done" type="success" size="small">已完成</el-tag>
          <el-button v-else type="primary" size="small" @click="currentTask._done=true;saveData()">标记完成</el-button>
        </div>
      </div>
      <div class="sop-right empty" v-else><el-empty description="点击左侧流程查看话术详情" /></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
const editMode=ref(false),activePhase=ref(0),activeTask=ref(1),SK='ai_badge_sop_v3'
function toggleEdit(){if(editMode.value){saveData();ElMessage.success('已保存')}editMode.value=!editMode.value}
function saveData(){localStorage.setItem(SK,JSON.stringify(phases.value.map(p=>({name:p.name,tasks:p.tasks.map(t=>({id:t.id,_done:t._done,script:t.script,psychology:t.psychology,demo:t.demo,checkpoint:t.checkpoint,duration:t.duration}))}))))}
function loadData(){try{var d=JSON.parse(localStorage.getItem(SK));if(d&&d.length){d.forEach(function(dp,pi){if(phases.value[pi]){if(dp.name)phases.value[pi].name=dp.name;if(dp.tasks){dp.tasks.forEach(function(dt,ti){var t=phases.value[pi].tasks[ti];if(t&&dt.script)t.script=dt.script;if(t&&dt.checkpoint)t.checkpoint=dt.checkpoint;if(t&&dt.duration)t.duration=dt.duration;t._done=dt._done})}}})}}catch(e){}}

const phases=ref([{name:'阶段一：拜访前准备(15min)',tasks:[{id:1,name:'客户行业研究',_done:true,duration:'15分钟',checkpoint:'完成客户官网/年报/新闻查阅，标注:团队规模、数字化程度、AI先例、营收趋势',script:'在拜访前完成客户行业深度研究。①客户近1年财报/年报——了解营收规模、利润率、销售费用占比，数据在拜访中引用建立专业信任 ②行业报告——该行业销售管理的普遍痛点（银行监管严、汽车竞争大、医疗合规紧）③客户新闻——近期数字化转型/新业务拓展/人事变动等动态，可作为破冰话题 ④竞品动态——客户当前使用哪些类似产品或方案。将以上整理成1页"客户简报"。',psychology:[{theory:'首因效应(Primacy Effect)',apply:'提前研究客户背景，见面前3分钟展示"我了解你"，能快速建立专业信任。研究显示，客户对"做了功课"的销售好感度提升60%。'},{theory:'相似吸引效应(Similarity-Attraction)',apply:'找到与客户行业/业务的共同语言，拉近心理距离。引用客户所在行业的具体痛点比泛泛而谈更能引起共鸣。'}],demo:[{role:'sales',text:'李总，来之前我看了贵司去年的年报，营收增长15%确实不错。不过我也注意到销售费用占比有28%，比行业平均高出5个点。这也是很多银行客户找我们的原因——用AI把销售管理成本打下来。'},{role:'client',text:'（感兴趣）哦？你们具体怎么做的？'}]},{id:2,name:'价值定位准备',_done:true,duration:'10分钟',checkpoint:'是否从硬件和软件两个维度准备了价值定位？',script:'准备硬件+软件双维度价值定位。硬件：①仅重28g佩戴无感②12h续航③双麦降噪+3m拾音④IP67防水防尘⑤OTA远程升级。软件：①7大行业AI模板②实时话术提醒+评分③客户画像自动生成④管理者数据看板⑤API开放接口。将以上整理成"一页纸产品价值"文档，用客户行业语言翻译每个功能的价值。',psychology:[{theory:'锚定效应(Anchoring Effect)',apply:'先讲完整价值（高锚点），再谈价格时客户会觉得"物超所值"。如果一上来就谈价格，客户会把注意力锁定在成本上。'},{theory:'框架效应(Framing Effect)',apply:'用"帮你省时间/省钱/提效"的正向框架描述产品，而非"替代人工/监控员工"的负向框架。正向框架客户接受度提高40%。'}],demo:[{role:'sales',text:'我们的AI胸牌不只是一个录音笔。它是一个完整的销售赋能系统——硬件让你"听得清"，软件让你"看得见效果"。最厉害的是，所有数据AI自动分析，零人工录入。'},{role:'client',text:'自动分析？能分析到什么程度？'}]},{id:3,name:'决策链梳理',_done:false,duration:'5分钟',checkpoint:'是否列出至少3个决策角色及关注点？',script:'梳理客户内部决策链，为每个角色准备不同沟通策略。①财务/采购——关注成本，准备ROI计算表，用数字说话"50人团队话术标准化率提升30%，一年多赚30万"②业务VP/销售总监——关注效果，准备同行案例和产品演示，用场景说话"某银行100台部署3个月，合规率62%→97%"③CEO/GM——关注战略价值，准备行业趋势和竞争分析，用格局说话"AI销售赋能是趋势，贵司的竞争对手已经在用了"。',psychology:[{theory:'角色代入(Empathy Mapping)',apply:'不同决策角色关注点不同。财务要数字、业务要效果、老板要战略。用对方感兴趣的语言沟通，沟通效率提升3倍。'},{theory:'互惠原理(Reciprocity)',apply:'为每个角色准备有价值的信息（ROI/案例/趋势白皮书），对方接受"礼物"后更有义务认真考虑你的方案。'}],demo:[{role:'sales',text:'跟您聊完之后，我还想约财务总监和销售总监一起沟通。财务那边我准备了一份ROI计算表，销售那边我准备了同行案例。这样大家各取所需。'},{role:'client',text:'你考虑得很周到，我帮你约。'}]}]},{name:'阶段二：开场破冰(3min)',tasks:[{id:4,name:'AI胸牌一句话介绍',_done:true,duration:'30秒',checkpoint:'能否在30秒内完成介绍并引起兴趣？',script:'"X总您好，我是利尔达的XXX。我们做了一款AI智能胸牌，已经帮XX银行/XX车行把话术标准化率从40%提到了95%，今天想跟您聊聊看能否帮到您的团队。"——要点：①一句话说清产品（AI智能胸牌）②带同行数据（40%→95%）③明确拜访目的（帮到您团队）。控制在30秒内，不超50字。',psychology:[{theory:'峰终定律(Peak-End Rule)',apply:'开场的第一印象（峰）决定了后续沟通的心理基调。一个好开场能让客户潜意识"愿意听下去"。前30秒是黄金窗口。'},{theory:'社会认同(Social Proof)',apply:'引用同行案例数据（XX银行/XX车行），触发"他们都在用，我也应该了解"的社会认同心理。同行推荐的说服力是销售的6倍。'}],demo:[{role:'sales',text:'张总您好，我是利尔达的小王。我们做AI智能胸牌的，已经帮招商银行把话术合规率从62%提到了97%。今天想跟您聊聊，看能不能帮您的团队也提效。'},{role:'client',text:'招商银行也在用？效果怎么样？'}]},{id:5,name:'议程确认+时间承诺',_done:true,duration:'1分钟',checkpoint:'客户是否明确同意议程和时间？',script:'"今天主要三件事：①花10分钟了解一下您团队目前销售管理的痛点②我用15分钟给您演示AI胸牌怎么解决这些问题③剩下时间看看您这边有什么想法。总共不超过40分钟，您看可以吗？"——要点：结构清晰（3件事）+时间可控（40分钟）+尊重对方（您看可以吗）。客户一旦同意议程，就等于给了你40分钟的"承诺"。',psychology:[{theory:'承诺一致性(Commitment Consistency)',apply:'人一旦做出承诺（同意议程），就会倾向于保持行为一致性。客户口头答应"40分钟可以"，后续就不太会中途打断或提前结束。'},{theory:'选择错觉(Illusion of Control)',apply:'用"您看可以吗"让客户感觉自己在掌控节奏，降低防御心理。实际上议程是你定的，但让他有选择感。'}],demo:[{role:'sales',text:'今天主要三件事：了解您团队的现状痛点、演示我们的AI胸牌、聊聊您的想法。总共40分钟，可以吗？'},{role:'client',text:'可以的，来吧。'}]},{id:6,name:'建立信任锚点',_done:false,duration:'1分钟',checkpoint:'是否展示了对客户业务的了解？',script:'"我们来之前看了贵司的年报/官网/新闻，注意到XX方面做得很好。不过也看到XX方面有些挑战，这也是很多客户找我们的原因——帮他们用AI解决这个问题。"——要点：①真诚赞美（做得好的地方）②精准指出（可改进的空间）③关联价值（AI帮解决）。赞美+挑战的组合，比单纯赞美或单纯挑战更能建立信任。',psychology:[{theory:'三明治反馈法(Sandwich Feedback)',apply:'赞美→挑战→方案，三层递进。先赞美降低防御心理，再指出挑战制造紧迫感，最后给出方案让客户看到希望。三层结构使信息接受度提升70%。'},{theory:'损失厌恶(Loss Aversion)',apply:'"你的竞争对手已经在用"触发损失厌恶心理。人对损失的敏感度是收益的2倍，客户更怕"落后"而非"进步"。'}],demo:[{role:'sales',text:'我们来之前看了贵司的年报，营收增长很不错。不过也注意到销售费用占比偏高，同行已经在用AI降本增效了。'},{role:'client',text:'（点头）确实，我们也在想怎么优化这块。'}]}]},{name:'阶段三：需求挖掘(8min)',tasks:[{id:7,name:'现状提问-SPIN法则',_done:false,duration:'3分钟',checkpoint:'是否完成了4类提问且客户回答了？',script:'使用SPIN提问法挖掘需求：S(Situation)现状问题——"目前团队销售过程怎么管理的？用什么工具？"P(Problem)困难问题——"话术检查覆盖率多少？抽查还是全量？新销售多久能独立见客户？"I(Implication)暗示问题——"如果话术不标准，客户投诉率大概多少？销售离职导致的客户流失有多少？"N(Need-payoff)需求效益——"如果我们能把话术落地率提升到95%，对您的团队意味着什么？"按S→P→I→N顺序提问，层层深入。',psychology:[{theory:'SPIN提问法(SPIN Selling)',apply:'S→P→I→N四层递进，让客户自己"发现"需求而非被告知。研究表明，SPIN法比传统推销的成交率高63%。关键是让客户自己说出痛点，而非你告诉他。'},{theory:'认知失调(Cognitive Dissonance)',apply:'当客户意识到"现状很糟糕"与"本可以更好"之间的差距时，产生认知失调。这种心理不适会驱使他们采取行动（接受方案）来恢复一致性。'}],demo:[{role:'sales',text:'请问目前你们销售过程怎么管理的？话术检查覆盖率大概多少？如果话术落地率提升到95%，对你来说意味着什么？'},{role:'client',text:'我们主要靠抽查，覆盖率大概30%吧。如果能到95%，那客户投诉肯定少很多，新人上手也快。'}]},{id:8,name:'痛点量化',_done:false,duration:'3分钟',checkpoint:'是否获取了2个量化痛点数据？',script:'把客户的感性痛点转化为理性数字：①"大概多少人需要管理？"②"目前话术检查覆盖率多少？抽查还是全量？"③"有没有算过销售离职带来的损失？一个人走了大概损失多少？"④"客户数据现在怎么记录的？靠销售自己填还是系统？"⑤"如果这些问题都解决了，一年能多赚/省多少钱？"。用数字强化痛感，数字越具体，客户越想解决。',psychology:[{theory:'具体化效应(Concreteness Effect)',apply:'抽象问题("管理困难")的说服力远不如具体数字("覆盖率30%，每月漏检70%")。具体数字让问题变得不可回避，大脑对数字的反应比对文字描述强烈3倍。'},{theory:'心理账户(Mental Accounting)',apply:'帮客户在心理上把"买AI胸牌的成本"划入"投资"账户而非"支出"账户。"一年省30万"比"一年花3万"更有说服力。'}],demo:[{role:'sales',text:'50人的团队，如果话术标准化率从60%提到90%，转化率提高5%，按客单价1万算，每月多成交2.5单，一年多赚30万。设备投入不到3万。'},{role:'client',text:'这么算的话，ROI确实很高。'}]},{id:9,name:'价值锚定+优先级确认',_done:false,duration:'2分钟',checkpoint:'是否将痛点一一对应到AI胸牌功能并确认优先级？',script:'总结客户痛点并关联产品："您刚才提到三个问题：话术不标准、新人上手慢、客户数据丢失。我们的AI胸牌恰好就是解决这三个问题的——实时话术提醒让标准落地，AI陪练让新人3天变老兵，录音自动生成客户画像不怕丢。您觉得这三个里面哪个最急？"——核心：先总结（回顾客户说的）→再关联（逐一对应功能）→最后追问优先级（引导客户自己排顺序）。',psychology:[{theory:'蔡格尼克效应(Zeigarnik Effect)',apply:'让客户自己说出"最急"的那个问题，他们会因为"问题没解决"而产生心理紧张感，这种紧张感驱使他们推进购买。'},{theory:'选择减少(Choice Reduction)',apply:'面对3个问题比面对10个问题更容易决策。帮客户提炼出TOP3痛点，降低决策复杂度，推进速度提升2倍。'}],demo:[{role:'sales',text:'总结一下：话术标准、新人培训、客户数据，这三个是您的核心痛点。我们来逐一对应：实时话术提醒→话术标准，AI陪练→新人培训，自动客户画像→数据留存。您觉得哪个最急？'},{role:'client',text:'话术标准最急，最近客户投诉了好几次。'}]}]},{name:'阶段四：产品演示(15min)',tasks:[{id:10,name:'场景化演示',_done:false,duration:'10分钟',checkpoint:'是否按客户行业完成场景化演示？',script:'根据客户行业选择演示场景：银行→理财经理面客场景；汽车→试驾接待场景；医疗→医生拜访场景；教育→家长沟通场景。演示流程：①佩戴胸牌见"客户"（同事扮演）②胸牌实时录音并在屏幕上显示话术提示③面客结束后SaaS后台自动生成报告（展示：话术评分/客户画像/智能体分析/情绪曲线）④切换到管理者视角查看团队数据Dashboard。关键：演示中让客户亲自试戴体验，"自己试过才知道好"。',psychology:[{theory:'自我体验效应(Endowment Effect)',apply:'让客户亲自试戴胸牌，一旦"拥有过"，就会高估它的价值。试戴体验过的客户成交率比只看演示的高40%。体验创造"心理所有权"。'},{theory:'生动性效应(Vividness Effect)',apply:'抽象描述不如现场演示。亲眼看到话术实时提示和数据自动生成，比听10遍PPT更有说服力。大脑对视觉+听觉+触觉的多感官信息记忆留存率是纯听觉的6倍。'}],demo:[{role:'sales',text:'来，您试戴一下。随便聊几句，看屏幕上——这里实时显示您说的话术是否符合标准。再看这里，对话结束5秒后自动生成客户画像和评分报告。'},{role:'client',text:'（试戴后）这确实挺智能的，评分还挺准。'}]},{id:11,name:'同行案例展示',_done:false,duration:'3分钟',checkpoint:'是否展示了2个同行案例数据？',script:'准备2-3个同行业客户案例（隐去敏感信息）：①某银行：100台胸牌部署3个月，话术合规率从62%→97%，客户投诉率下降45%，监管检查零问题②某车行：50台胸牌，新人培训周期从4周→1周，试驾话术执行率从40%→92%，客户满意度+28%③某药企：合规拜访记录自动生成，省去每人每天1.5小时文书工作，销售人均拜访量+35%。展示时包含：数据+截图+客户评价。案例要说"客户故事"而非"数据报告"。',psychology:[{theory:'叙事说服(Narrative Persuasion)',apply:'数据+故事比纯数据更有说服力。人脑对"故事"的记忆和理解深度是纯数据的22倍。用一个真实客户的成功故事，比列出10个统计数据更有效。'},{theory:'从众心理(Bandwagon Effect)',apply:'"招商银行用了""宝马车行用了"——当客户看到同行都在用，会产生"我也不能落后"的心理。同行效应是最强的社会证明。'}],demo:[{role:'sales',text:'去年招商银行刚上线时，销售团队也有抵触。3个月后，话术合规率从62%到了97%。最意外的是投诉率降了45%——原来很多投诉是因为销售说错话。'},{role:'client',text:'这个数据很有说服力，监管合规确实是我们头疼的。'}]},{id:12,name:'SaaS后台+ROI展示',_done:false,duration:'2分钟',checkpoint:'是否演示了3个核心功能并算了ROI？',script:'重点演示4个SaaS核心模块：①AI听记报告（展示智能体如何自动分析对话，哪些话说得好、哪些需要改进）②销售画像（能力雷达图+进步曲线，帮助管理者发现团队短板）③话术库（300+条行业模板+评分机制+迭代记录）④设备管理（远程配置+固件OTA+在线状态监控）。最后给出ROI速算："以50人团队为例，年投入2.5万，预期年增收30万+，ROI超过10倍。"',psychology:[{theory:'近因效应(Recency Effect)',apply:'演示最后以ROI数据收尾，确保客户在结束演示时记住"投资回报>10倍"这个关键信息。最后说的往往记得最牢。'},{theory:'损失框架(Loss Frame)',apply:'"如果不做改变，每年可能损失30万"比"做了能赚30万"更有驱动力。用损失框架包装ROI，行动意愿提升50%。'}],demo:[{role:'sales',text:'算一笔账：50人团队，年投入2.5万。如果话术标准化率提升30%，转化率提高5%，一年多赚30万。ROI超过10倍。而且这些都是AI自动分析的，不用额外招人。'},{role:'client',text:'这么一算确实划算。'}]
}]}])

const currentPhase=computed(()=>phases.value[activePhase.value])
const currentTask=computed(()=>{for(let p of phases.value)for(let t of p.tasks)if(t.id===activeTask.value)return t;return null})
loadData()
</script>

<style scoped>
.sop-page{height:100vh;display:flex;flex-direction:column;background:#f5f7fa}
.top-bar{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#fff;border-bottom:1px solid #e8e8e8;flex-shrink:0}
.page-title{font-size:18px;font-weight:700;color:#303133}.page-subtitle{font-size:12px;color:#909399;margin-top:2px}
.sop-layout{flex:1;display:flex;overflow:hidden}
.sop-left{width:260px;background:#fff;border-right:1px solid #e8e8e8;overflow-y:auto;flex-shrink:0;padding:8px 0}
.left-header{font-size:13px;font-weight:600;color:#666;padding:8px 12px;border-bottom:1px solid #f0f0f0}
.left-phase{margin-bottom:2px}
.lp-title{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;font-size:13px;transition:background .15s}.lp-title:hover{background:#f5f7fa}.lp-title.active{background:#e8f0fe;color:#1a73e8}
.lp-num{width:20px;height:20px;border-radius:50%;background:#409EFF;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.lp-name{flex:1;font-weight:500}.lp-progress{font-size:11px;color:#909399;flex-shrink:0}
.lp-tasks{padding-left:28px;padding-bottom:4px}
.lp-task{display:flex;align-items:center;gap:6px;padding:5px 12px 5px 0;cursor:pointer;font-size:12px;color:#666}.lp-task:hover{color:#303133}.lp-task.active{color:#1a73e8;font-weight:600}
.lpt-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}.lpt-name{line-height:1.3}

.sop-right{flex:1;overflow-y:auto;padding:20px 24px;background:#fff}.sop-right.empty{display:flex;align-items:center;justify-content:center}
.right-header{padding-bottom:14px;margin-bottom:16px;border-bottom:2px solid #409EFF;font-size:14px}.rh-phase{color:#909399}.rh-arrow{color:#c0c4cc;margin:0 8px}.rh-task{color:#303133;font-weight:700}

.script-block{margin-bottom:20px}.sb-label{font-size:13px;font-weight:700;color:#409EFF;margin-bottom:8px}.sb-content{font-size:14px;color:#333;line-height:1.8;padding:14px 16px;background:#f9fafb;border-radius:8px;border-left:3px solid #409EFF}

.psych-block{margin-bottom:20px}.pb-label{font-size:13px;font-weight:700;color:#E6A23C;margin-bottom:8px}
.pb-item{display:flex;gap:12px;padding:10px 14px;margin-bottom:6px;background:#fef7e0;border-radius:6px;font-size:12px;line-height:1.6}.pb-theory{font-weight:700;color:#b88230;white-space:nowrap;min-width:120px}.pb-apply{color:#666}

.demo-block{margin-bottom:20px}.db-label{font-size:13px;font-weight:700;color:#67C23A;margin-bottom:8px}
.db-item{padding:8px 14px;margin-bottom:4px;border-radius:6px;font-size:13px;line-height:1.6}.db-item.sales{background:#f0f9eb;color:#333}.db-item.client{background:#fef0f0;color:#555;margin-left:20px}.db-role{font-weight:700;font-size:11px;margin-right:4px}.db-text{font-size:13px}

.check-block{margin-bottom:16px}.cb-label{font-size:13px;font-weight:700;color:#909399;margin-bottom:6px}.cb-content{font-size:13px;color:#666;padding:10px 14px;background:#fafafa;border-radius:6px;line-height:1.6}

.right-footer{display:flex;align-items:center;gap:12px;padding-top:14px;border-top:1px solid #eee;font-size:12px;color:#909399}
</style>
