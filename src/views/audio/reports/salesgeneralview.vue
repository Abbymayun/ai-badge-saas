<template>
  <div class="sales-report">
    <h2 class="sr-title">📈 销售分析报告</h2>
    <p class="sr-sub">Sales Analysis Report · AI自动生成</p>

    <!-- 一、销售概况 -->
    <div class="sr-section">
      <div class="srs-header">一、销售概况</div>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="销售阶段">方案评估阶段</el-descriptions-item>
        <el-descriptions-item label="销售代表">王志华</el-descriptions-item>
        <el-descriptions-item label="客户名称">杭州智联金融科技有限公司</el-descriptions-item>
        <el-descriptions-item label="客户行业">银行金融</el-descriptions-item>
        <el-descriptions-item label="接触方式">上门拜访</el-descriptions-item>
        <el-descriptions-item label="最近沟通">2026年5月27日</el-descriptions-item>
        <el-descriptions-item label="整体进展" :span="2">
          <el-progress :percentage="65" :stroke-width="8" color="#409EFF" />
          <span style="margin-left:8px;font-size:13px;color:#909399">推进至方案评估，预计2周内出结果</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 二、客户分析 -->
    <div class="sr-section">
      <div class="srs-header">二、客户分析</div>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="客户画像">张总 · 零售银行部总经理 · 45-50岁 · 理性务实</el-descriptions-item>
            <el-descriptions-item label="购买意向">
              <el-tag type="success">高意向</el-tag>
              <span style="font-size:12px;color:#909399;margin-left:8px">明确表达了试用意向</span>
            </el-descriptions-item>
            <el-descriptions-item label="预算范围">60-80万/年</el-descriptions-item>
            <el-descriptions-item label="决策周期">预计4-6周</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="12">
          <div class="sr-decision">
            <div class="srd-title">🔗 决策链分析</div>
            <div v-for="(d,idx) in decisionChain" :key="idx" class="srd-row">
              <span class="srd-avatar" :style="{background:['#409EFF','#67C23A','#E6A23C'][idx]}">{{ d.name[0] }}</span>
              <div class="srd-info">
                <span class="srd-name">{{ d.name }} · {{ d.role }}</span>
                <span class="srd-status" :style="{color:d.attitude==='支持'?'#67C23A':'#E6A23C'}">{{ d.attitude }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 三、需求匹配 -->
    <div class="sr-section">
      <div class="srs-header">三、需求与方案匹配</div>
      <el-table :data="needMatch" size="small" border>
        <el-table-column prop="need" label="客户需求" min-width="160" />
        <el-table-column label="紧急度" width="90">
          <template #default="{row}"><el-tag :type="row.urgency==='高'?'danger':'warning'" size="small">{{ row.urgency }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="solution" label="我方方案" min-width="180" />
        <el-table-column label="匹配度" width="100">
          <template #default="{row}"><el-progress :percentage="row.match" :stroke-width="6" :color="row.match>=90?'#67C23A':'#409EFF'" /></template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 四、竞争分析 -->
    <div class="sr-section">
      <div class="srs-header">四、竞争分析</div>
      <el-table :data="competitors" size="small" border>
        <el-table-column prop="name" label="竞品" width="150" />
        <el-table-column prop="strength" label="竞品优势" min-width="160" />
        <el-table-column prop="weakness" label="竞品劣势" min-width="160" />
        <el-table-column label="我方优势" width="100">
          <template #default><el-tag type="success" size="small">✓ 领先</el-tag></template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 五、推进策略 -->
    <div class="sr-section">
      <div class="srs-header">五、推进策略与行动计划</div>
      <el-descriptions :column="2" border size="small" style="margin-bottom:12px;">
        <el-descriptions-item label="成单概率">
          <span style="font-size:20px;font-weight:700;color:#67C23A;">78%</span>
        </el-descriptions-item>
        <el-descriptions-item label="预计成交">
          <span style="font-size:20px;font-weight:700;color:#F56C6C;">70万/年</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-table :data="strategies" size="small" border>
        <el-table-column type="index" label="#" width="40" />
        <el-table-column prop="action" label="关键行动" min-width="180" />
        <el-table-column prop="owner" label="负责人" width="90" />
        <el-table-column prop="deadline" label="截止时间" width="100" />
        <el-table-column prop="purpose" label="目的" min-width="160" />
      </el-table>
      <div class="sr-tip" style="margin-top:8px;">
        💡 <strong>关键推进策略：</strong>以招商银行成功案例为核心抓手，配合20人免费试用方案降低决策门槛，争取在竞品方案评估前锁定意向。
      </div>
    </div>

    <div class="sr-footer">报告由 AI智能胸牌 自动生成</div>
  </div>
</template>

<script setup>
defineProps({ data: Object, template: Object })

const funnel = [
  { label:'线索获取', value:8, color:'#909399' },
  { label:'需求确认', value:5, color:'#409EFF' },
  { label:'方案评估', value:3, color:'#E6A23C' },
  { label:'商务谈判', value:2, color:'#F56C6C' },
  { label:'合同签署', value:1, color:'#67C23A' },
  { label:'已成交', value:42, color:'#67C23A' }
]
const decisionChain = [
  { name:'张总', role:'关键决策人', attitude:'支持' },
  { name:'李经理', role:'技术评估', attitude:'中立' },
  { name:'王主任', role:'采购审批', attitude:'待沟通' }
]
const needMatch = [
  { need:'提升外拓拜访效率', urgency:'高', solution:'AI自动记录+分析报告', match:95 },
  { need:'客户经理过程管理', urgency:'高', solution:'实时数据看板+能力评分', match:90 },
  { need:'数据安全合规', urgency:'高', solution:'等保三级+私有化部署', match:92 },
  { need:'优秀经验复制', urgency:'中', solution:'话术自动沉淀+案例库', match:88 },
  { need:'降低培训成本', urgency:'中', solution:'AI辅助新人+话术库', match:85 }
]
const competitors = [
  { name:'传统录音笔方案', strength:'价格低、操作简单', weakness:'无AI分析能力，数据利用率低' },
  { name:'某SaaS销售工具', strength:'有CRM功能', weakness:'无硬件集成，缺乏真实对话数据' }
]
const strategies = [
  { action:'发送招商银行详细案例+ROI数据', owner:'王志华', deadline:'5月28日', purpose:'增强方案说服力' },
  { action:'安排技术团队对接会议', owner:'技术部', deadline:'6月2日', purpose:'消除技术疑虑' },
  { action:'提供20人3个月免费试用方案', owner:'王志华', deadline:'6月5日', purpose:'降低决策门槛' },
  { action:'跟进决策链三方沟通', owner:'王志华', deadline:'6月10日', purpose:'推动内部审批' }
]
</script>

<style scoped>
.sales-report{max-width:960px;margin:0 auto;padding:8px;font-family:'PingFang SC','Microsoft YaHei',sans-serif}
.sr-title{font-size:24px;text-align:center;color:#1a1a2e;margin:0 0 4px}.sr-sub{text-align:center;color:#909399;font-size:13px;margin:0 0 24px}

.sr-funnel{margin-bottom:20px}.srf-card{background:#fff;border-radius:12px;padding:16px;text-align:center;border-top:3px solid;box-shadow:0 1px 6px rgba(0,0,0,.03)}.srf-num{font-size:28px;font-weight:700}.srf-label{font-size:12px;color:#909399;margin-top:4px}

.sr-section{margin-bottom:18px}.srs-header{padding:10px 16px;background:#409EFF;color:#fff;font-size:15px;font-weight:700;border-radius:8px 8px 0 0}

.sr-decision{background:#fafbfc;border-radius:10px;padding:14px}.srd-title{font-size:14px;font-weight:600;color:#1a1a2e;margin-bottom:10px}
.srd-row{display:flex;align-items:center;gap:10px;padding:6px 0}.srd-avatar{width:32px;height:32px;border-radius:50%;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.srd-name{font-size:13px;color:#303133;font-weight:600}.srd-status{font-size:12px;margin-left:6px}

.sr-tip{background:#f0f5ff;border-radius:8px;padding:10px 14px;font-size:13px;color:#409EFF;line-height:1.6}
.sr-footer{text-align:center;padding:20px;color:#ccc;font-size:12px}
</style>
