<template>
  <div class="edu-report">
    <!-- Hero -->
    <div class="er-hero">
      <h2>📚 课堂总结报告</h2>
      <div class="er-meta"><span>课程：{{ courseName }}</span><span>教师：{{ teacher }}</span><span>年级：{{ grade }}</span><span>日期：{{ date }}</span><span>时长：{{ duration }}</span></div>
    </div>

    <!-- 课程概览 -->
    <el-card shadow="never" class="er-card"><template #header><span class="erc-title">📋 课程概览</span></template>
      <div class="overview-grid">
        <div class="og-item"><span class="og-label">课程主题</span><span class="og-value">{{ topic }}</span></div>
        <div class="og-item"><span class="og-label">教学目标</span><span class="og-value">{{ objectives }}</span></div>
        <div class="og-item"><span class="og-label">重点难点</span><span class="og-value">{{ keyPoints }}</span></div>
        <div class="og-item"><span class="og-label">知识结构</span><span class="og-value">{{ knowledgeStructure.length }}个模块 · {{ totalItems }}个知识点</span></div>
      </div>
    </el-card>

    <!-- 知识点梳理 -->
    <div v-for="(mod, midx) in knowledgeStructure" :key="midx" class="er-module">
      <div class="erm-header">
        <span class="erm-num">{{ midx+1 }}</span>
        <span class="erm-title">{{ mod.title }}</span>
        <el-tag size="small" type="warning">{{ mod.duration }}</el-tag>
      </div>
      <div v-for="(k, kidx) in mod.items" :key="kidx" class="erm-item">
        <div class="ermi-header">
          <span class="ermi-dot" :style="{background: mod.color}"></span>
          <span class="ermi-name">{{ k.name }}</span>
          <el-tag size="small" effect="plain" :type="k.importance==='核心'?'danger':k.importance==='重点'?'warning':'info'">{{ k.importance }}</el-tag>
        </div>
        <div class="ermi-body">
          <div class="ermi-definition"><strong>📖 定义：</strong>{{ k.definition }}</div>
          <div v-if="k.keyFormula" class="ermi-formula"><strong>📐 公式：</strong><code>{{ k.keyFormula }}</code></div>
          <div v-if="k.examples" class="ermi-examples">
            <strong>💡 举例：</strong>
            <div v-for="(ex, eidx) in k.examples" :key="eidx" class="example-item">
              <span class="ex-num">例{{ eidx+1 }}</span>
              <span>{{ ex }}</span>
            </div>
          </div>
          <div v-if="k.tips" class="ermi-tips"><strong>⚠️ 易错提醒：</strong>{{ k.tips }}</div>
        </div>
      </div>
    </div>

    <!-- 课堂练习题 -->
    <el-card shadow="never" class="er-card"><template #header><span class="erc-title">✏️ 课堂巩固练习</span><el-tag size="small" type="warning">{{ exercises.length }}道练习题</el-tag></template>
      <div v-for="(ex, idx) in exercises" :key="idx" class="exercise-card">
        <div class="exc-header">
          <span class="exc-num">{{ idx+1 }}</span>
          <span class="exc-type" :style="{background: ex.difficulty==='基础'?'#f0f9eb':ex.difficulty==='进阶'?'#ecf5ff':'#fef0f0', color: ex.difficulty==='基础'?'#67C23A':ex.difficulty==='进阶'?'#409EFF':'#E6A23C'}">{{ ex.difficulty }}</span>
          <el-tag size="small" effect="plain">对应知识点：{{ ex.related }}</el-tag>
        </div>
        <div class="exc-question">{{ ex.question }}</div>
        <el-collapse><el-collapse-item title="查看答案与解析">
          <div class="exc-answer"><strong>答案：</strong>{{ ex.answer }}</div>
          <div class="exc-analysis"><strong>解析：</strong>{{ ex.analysis }}</div>
        </el-collapse-item></el-collapse>
      </div>
    </el-card>

    <!-- 拓展阅读 -->
    <el-card shadow="never" class="er-card"><template #header><span class="erc-title">📖 拓展与延伸</span></template>
      <div v-for="(ext, idx) in extensions" :key="idx" class="ext-row">
        <span class="ext-icon">{{ ['🔗','📺','📄'][idx] }}</span>
        <div class="ext-body"><div class="ext-title">{{ ext.title }}</div><div class="ext-desc">{{ ext.desc }}</div></div>
      </div>
    </el-card>

    <div class="er-footer">课堂总结由 AI智能胸牌 自动生成 · 帮助学生在课后高效复习</div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const courseName = '小学数学 · 分数乘除法'; const teacher = '张老师'; const grade = '五年级'; const date = '2026-05-16'; const duration = '45分钟'
const topic = '分数乘法（分数×整数、分数×分数）'; const objectives = '1.理解分数乘法的意义 2.掌握分数乘整数和分数乘分数的计算方法 3.能运用分数乘法解决实际问题'
const keyPoints = '重点：分数乘分数的计算法则；难点：理解"求一个数的几分之几"用乘法计算'
const totalItems = 8

const knowledgeStructure = [
  { title:'分数乘法的意义', duration:'8分钟', color:'#409EFF', items:[
    { name:'分数×整数的意义', importance:'核心', definition:'表示求几个相同分数的和的简便运算。例如：2/5 × 3 表示 3个2/5相加', keyFormula:'a/b × n = (a×n)/b', examples:['2/5 × 3 = (2×3)/5 = 6/5 = 1 1/5','一班有40人，其中3/8是男生，男生有几人？40 × 3/8 = 15人'], tips:'注意区分：分数×整数 和 整数×分数 的计算顺序不同，但结果相同（乘法交换律）' },
    { name:'分数×分数的意义', importance:'核心', definition:'表示求一个数的几分之几是多少。例如：1/2 × 3/4 表示 1/2的3/4是多少', keyFormula:'a/b × c/d = (a×c)/(b×d)', examples:['1/2 × 3/4 = (1×3)/(2×4) = 3/8','一根绳子长2/3米，用去了3/5，用去了多少米？2/3 × 3/5 = 6/15 = 2/5米'], tips:'计算结果要约分为最简分数！很多同学忘记约分导致扣分' }
  ]},
  { title:'分数乘法的计算法则', duration:'15分钟', color:'#67C23A', items:[
    { name:'分数×整数的计算', importance:'重点', definition:'分子与整数相乘，分母不变，结果能约分的要约分', keyFormula:'a/b × n = (a×n)/b', examples:['3/7 × 2 = (3×2)/7 = 6/7','5/12 × 4 = (5×4)/12 = 20/12 = 5/3 = 1 2/3'], tips:'整数可以和分母先约分再计算，减少计算量：5/12 × 4 = 5/(12÷4) × (4÷4) = 5/3' },
    { name:'分数×分数的计算', importance:'核心', definition:'分子乘分子，分母乘分母，结果要约分', keyFormula:'a/b × c/d = (a×c)/(b×d)', examples:['2/3 × 4/5 = (2×4)/(3×5) = 8/15','3/4 × 2/9 = (3×2)/(4×9) = 6/36 = 1/6'], tips:'计算前先交叉约分：3/4 × 2/9 → 3和9可约→ 1/4 × 2/3 → 2和4可约 → 1/2 × 1/3 = 1/6' },
    { name:'带分数的乘法', importance:'重点', definition:'先将带分数化为假分数，再按分数乘法法则计算', keyFormula:'a b/c = (a×c+b)/c', examples:['1 1/2 × 2/3 = 3/2 × 2/3 = (3×2)/(2×3) = 1','2 1/4 × 1 1/3 = 9/4 × 4/3 = 3'], tips:'带分数直接相乘容易出错，务必先化假分数！' }
  ]},
  { title:'分数乘法的应用', duration:'12分钟', color:'#E6A23C', items:[
    { name:'求一个数的几分之几', importance:'核心', definition:'已知整体和部分占比，求部分量，用乘法', keyFormula:'整体 × 几分之几 = 部分', examples:['一杯牛奶200ml，喝了3/5，喝了多少？200 × 3/5 = 120ml','一本故事书120页，已看5/8，看了多少页？120 × 5/8 = 75页'], tips:'找准"单位1"是关键——谁是整体，谁就是乘数' },
    { name:'连续求几分之几', importance:'重点', definition:'连续两次"求几分之几"，使用连乘', keyFormula:'整体 × a/b × c/d', examples:['一根绳子3米，先用去1/3，再用去剩下的1/2，最后剩多少？3×(1-1/3)×(1-1/2)=3×2/3×1/2=1米'], tips:'注意区分"用去1/3"和"用去1/3米"的差别！一个是分率一个是具体量' },
    { name:'分数乘法比较大小', importance:'拓展', definition:'一个数(>0)乘以小于1的分数，积小于原数；乘以大于1的分数，积大于原数', examples:['24 × 3/4 = 18 < 24','24 × 5/4 = 30 > 24'], tips:'这个规律在做选择题和判断题时非常实用' }
  ]}
]

const exercises = [
  { difficulty:'基础', related:'分数×整数', question:'计算：3/8 × 4 = ?', answer:'3/2 = 1 1/2', analysis:'分子3×4=12，分母不变8，得12/8，约分为3/2=1 1/2。也可以在计算前先约分：3/8×4→4与8约分→3/2×1=3/2' },
  { difficulty:'基础', related:'分数×分数', question:'计算：2/5 × 3/4 = ?', answer:'3/10', analysis:'2/5×3/4=(2×3)/(5×4)=6/20=3/10。可以先约分：2/5×3/4→分子2与分母4约→1/5×3/2=3/10' },
  { difficulty:'进阶', related:'带分数乘法', question:'计算：1 2/3 × 2 1/4 = ?', answer:'15/4 = 3 3/4', analysis:'先化假分数：1 2/3=5/3，2 1/4=9/4。5/3×9/4=(5×9)/(3×4)=45/12=15/4=3 3/4' },
  { difficulty:'进阶', related:'实际应用', question:'小明有48元，买书用了3/8，买文具用了剩下的1/2，还剩多少元？', answer:'15元', analysis:'买书：48×3/8=18元，剩下30元。买文具：30×1/2=15元，剩余：48-18-15=15元' },
  { difficulty:'挑战', related:'复杂应用', question:'一根绳子，第一次用去1/3，第二次用去剩下的2/5，结果还剩12米。这根绳子原来长多少米？', answer:'30米', analysis:'设原长x米。第一次剩(1-1/3)x=2x/3。第二次剩(1-2/5)×2x/3=3/5×2x/3=2x/5。2x/5=12，x=30' }
]

const extensions = [
  { title:'分数乘法的生活应用', desc:'思考：超市打折"满100减30"相当于打几折？食谱材料按人数换算，分数乘法在日常生活中的实用场景' },
  { title:'分数除法预习', desc:'下次课学习分数除法。关键思路：除以一个分数等于乘以它的倒数。提前思考：为什么3/4 ÷ 1/2 = 3/4 × 2/1？' },
  { title:'在线练习推荐', desc:'推荐练习平台：XX数学APP"分数运算专项训练"，可自动批改并生成错题集，针对性巩固薄弱环节' }
]
</script>

<style scoped>
.edu-report{max-width:960px;margin:0 auto;padding:8px}
.er-hero{background:linear-gradient(135deg,#5b2c6e,#8e44ad,#6c3483);border-radius:16px;padding:28px;color:#fff;margin-bottom:20px}
.er-hero h2{margin:0 0 10px;font-size:22px}.er-meta{display:flex;gap:16px;font-size:13px;opacity:.85;flex-wrap:wrap}

.er-card{border-radius:12px;margin-bottom:14px}.erc-title{font-size:15px;font-weight:700;color:#1a1a2e}
.overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.og-item{padding:12px;background:#fafbfc;border-radius:10px}.og-label{font-size:11px;color:#909399;display:block;margin-bottom:4px}.og-value{font-size:14px;color:#303133;line-height:1.6}

.er-module{margin-bottom:20px}.erm-header{display:flex;align-items:center;gap:10px;padding:10px 16px;background:linear-gradient(90deg,#f0f5ff,transparent);border-radius:10px;margin-bottom:10px}
.erm-num{width:30px;height:30px;border-radius:8px;background:#5b2c6e;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.erm-title{font-size:16px;font-weight:700;color:#303133}

.erm-item{padding:14px;margin-bottom:8px;background:#fff;border-radius:10px;border:1px solid #f0f0f0;border-left:3px solid #8e44ad}
.ermi-header{display:flex;align-items:center;gap:8px;margin-bottom:10px}.ermi-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}.ermi-name{font-size:15px;font-weight:700;color:#1a1a2e}
.ermi-body>div{font-size:13px;color:#606266;line-height:1.8;margin:6px 0}
.ermi-formula code{background:#fdf6ec;padding:3px 10px;border-radius:6px;font-size:14px;color:#E6A23C;font-family:'Courier New',monospace}
.example-item{display:flex;gap:6px;padding:4px 0;margin-left:8px}.ex-num{background:#ecf5ff;color:#409EFF;padding:0 6px;border-radius:4px;font-size:11px;font-weight:700;flex-shrink:0}
.ermi-tips{background:#fef0f0;border-radius:6px;padding:6px 10px;color:#E6A23C;font-size:12px}

.exercise-card{padding:14px;margin-bottom:10px;background:#fafbfc;border-radius:10px}.exc-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.exc-num{width:24px;height:24px;border-radius:50%;background:#8e44ad;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.exc-type{padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700}.exc-question{font-size:14px;color:#303133;line-height:1.6}
.exc-answer{font-size:13px;color:#67C23A;margin-bottom:4px}.exc-analysis{font-size:13px;color:#606266;line-height:1.7}

.ext-row{display:flex;gap:10px;padding:10px;margin-bottom:6px;background:#fafbfc;border-radius:10px;align-items:flex-start}.ext-icon{font-size:24px;flex-shrink:0}.ext-title{font-size:14px;font-weight:600;color:#303133}.ext-desc{font-size:12px;color:#909399;margin-top:3px;line-height:1.6}
.er-footer{text-align:center;padding:20px;color:#ccc;font-size:11px}
</style>
