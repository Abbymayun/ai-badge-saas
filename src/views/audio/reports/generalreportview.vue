<template>
  <div class="visit-report">
    <h2 class="vr-title">📋 销售拜访报告</h2>
    <p class="vr-sub">Sales Visit Report · AI自动生成</p>

    <!-- 一、拜访基本信息 -->
    <div class="vr-section">
      <div class="vrs-header" style="background:#409EFF;">一、拜访基本信息</div>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="拜访日期">2026年5月27日</el-descriptions-item>
        <el-descriptions-item label="拜访时间">14:30 - 15:05</el-descriptions-item>
        <el-descriptions-item label="拜访方式">上门拜访</el-descriptions-item>
        <el-descriptions-item label="销售人员">王志华</el-descriptions-item>
        <el-descriptions-item label="所属部门">华东区销售一部</el-descriptions-item>
        <el-descriptions-item label="联系电话">138****5678</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 二、客户信息 -->
    <div class="vr-section">
      <div class="vrs-header" style="background:#409EFF;">二、客户信息</div>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="客户单位">杭州智联金融科技有限公司</el-descriptions-item>
        <el-descriptions-item label="客户行业">银行金融</el-descriptions-item>
        <el-descriptions-item label="客户规模">200-500人</el-descriptions-item>
        <el-descriptions-item label="对接人姓名">张总</el-descriptions-item>
        <el-descriptions-item label="对接人职位">零售银行部总经理</el-descriptions-item>
        <el-descriptions-item label="对接人电话">139****1234</el-descriptions-item>
        <el-descriptions-item label="客户地址" :span="3">杭州市滨江区XX路188号</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 三、拜访主要内容 -->
    <div class="vr-section">
      <div class="vrs-header" style="background:#409EFF;">三、拜访主要内容</div>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="拜访目的">产品介绍与需求调研。向客户展示AI智能胸牌在银行客户经理外拓场景的应用方案，了解客户数字化转型中的痛点和具体需求。</el-descriptions-item>
        <el-descriptions-item label="拜访过程记录">
          <div class="vr-process">
            <p><strong>14:30-14:40</strong> 开场破冰。通过行业数字化转型话题切入，了解客户目前外拓管理现状。客户表示客户经理外出拜访的过程管理一直是薄弱环节。</p>
            <p><strong>14:40-14:55</strong> 产品演示。展示了AI智能胸牌的录音转写、AI分析报告生成和优秀话术提取功能。客户对自动生成客户画像和拜访报告的功能表示浓厚兴趣。</p>
            <p><strong>14:55-15:00</strong> 交流答疑。客户询问了数据安全、系统对接、试用方案等问题。我方逐一解答并提供了招商银行的参考案例。</p>
            <p><strong>15:00-15:05</strong> 总结与下一步。双方确认了后续沟通安排：发送详细方案，安排技术对接，推动试用方案。</p>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 四、客户需求与痛点分析 -->
    <div class="vr-section">
      <div class="vrs-header" style="background:#409EFF;">四、客户需求与痛点分析</div>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="客户核心需求">
          <div class="vr-list">
            <div v-for="n in needs" :key="n" class="vrl-item"><span class="vrl-dot" style="background:#409EFF;"></span>{{ n }}</div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="客户痛点/问题">
          <div class="vr-list">
            <div v-for="p in pains" :key="p" class="vrl-item"><span class="vrl-dot" style="background:#E6A23C;"></span>{{ p }}</div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="我方产品/方案匹配度">
          <div class="vr-match">
            <div v-for="m in matches" :key="m.need" class="vrm-row">
              <span class="vrm-need">{{ m.need }}</span>
              <el-icon color="#409EFF"><ArrowRight /></el-icon>
              <span class="vrm-solution">{{ m.solution }}</span>
              <el-tag size="small" type="success">✓ 匹配</el-tag>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 五、竞品情况 -->
    <div class="vr-section">
      <div class="vrs-header" style="background:#409EFF;">五、竞品情况</div>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="客户提及的竞品">
          <div class="vr-compare">
            <div v-for="c in competitors" :key="c.name" class="vrc-item">
              <span class="vrc-name">{{ c.name }}</span>
              <span class="vrc-detail">{{ c.detail }}</span>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="我方竞争优势">
          <div class="vr-advantage">
            <div v-for="(a,idx) in advantages" :key="idx" class="vra-item">
              <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
              <span>{{ a }}</span>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 六、后续跟进计划 -->
    <div class="vr-section">
      <div class="vrs-header" style="background:#409EFF;">六、后续跟进计划</div>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="本次拜访成果总结">
          双方就AI智能胸牌在银行外拓场景的应用达成初步共识。客户对产品功能认可度高，确认了数据安全合规方案和系统对接的可行性。客户提出先进行小范围试用验证效果。
        </el-descriptions-item>
        <el-descriptions-item label="下一步跟进措施">
          <el-table :data="followUps" size="small" border>
            <el-table-column type="index" label="#" width="40" />
            <el-table-column prop="task" label="跟进措施" min-width="180" />
            <el-table-column prop="owner" label="负责人" width="100" />
            <el-table-column prop="deadline" label="预计完成时间" width="110" />
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
      <el-row :gutter="16" style="margin-top:12px;">
        <el-col :span="8">
          <div class="vr-follow-card">
            <div class="vrfc-label">预计成单时间</div>
            <div class="vrfc-value">2026年6月下旬</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="vr-follow-card">
            <div class="vrfc-label">预计成交金额</div>
            <div class="vrfc-value" style="color:#F56C6C;">70万/年</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="vr-follow-card">
            <div class="vrfc-label">客户合作意向</div>
            <div class="vrfc-value" style="color:#67C23A;">高意向 ✓</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 七、备注 -->
    <div class="vr-section">
      <div class="vrs-header" style="background:#409EFF;">七、备注</div>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="其他说明">
          客户对招商银行的参考案例特别感兴趣，建议后续重点准备类似银行的成功案例数据。另外客户提到信息科技部对数据安全要求较高，建议在技术对接时提前准备等保三级证书和ISO27001认证文件。
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 签名区 -->
    <div class="vr-signature">
      <div class="vrsig-item">
        <div class="vrsig-label">销售人员签字</div>
        <div class="vrsig-line">王志华</div>
        <div class="vrsig-date">日期：2026年5月27日</div>
      </div>
      <div class="vrsig-item">
        <div class="vrsig-label">审批人签字</div>
        <div class="vrsig-line">____________</div>
        <div class="vrsig-date">日期：____________</div>
      </div>
    </div>

    <div class="vr-footer">报告由 AI智能胸牌 自动生成</div>
  </div>
</template>

<script setup>
defineProps({ data: Object, template: Object })

const needs = [
  '提升客户经理外拓拜访的效率管理',
  '建立标准化销售流程，降低新人培训成本',
  '实现销售经验（优秀话术）的沉淀和复制',
  '增强客户拜访数据的可视化和管理决策支持'
]
const pains = [
  '客户经理外出拜访过程无法量化评估',
  'Top Sales的优秀经验难以复制给新人',
  '现有CRM系统与移动办公场景脱节',
  '金融行业对数据安全合规有严格要求'
]
const matches = [
  { need:'拜访效率管理', solution:'AI自动记录+分析报告，全程数据化' },
  { need:'新人培训', solution:'话术自动提取+案例库，新人上手周期缩短50%' },
  { need:'经验沉淀', solution:'金牌销售画像+话术库，优秀经验可复制' },
  { need:'数据安全', solution:'等保三级+私有化部署+数据加密传输' }
]
const competitors = [
  { name:'某传统录音笔方案', detail:'价格较低但无AI分析能力，仅为基础录音功能' },
  { name:'某SaaS销售管理工具', detail:'有过程管理但无硬件集成，缺乏真实对话数据' }
]
const advantages = [
  'AI分析能力是核心差异化优势，竞品不具备',
  '硬件+软件一体化方案，数据采集到分析全闭环',
  '招商银行等头部客户案例背书',
  '等保三级+私有化部署满足金融合规要求'
]
const followUps = [
  { task:'发送详细产品方案+招商银行案例', owner:'王志华', deadline:'5月28日' },
  { task:'安排技术团队对接，讨论系统集成方案', owner:'技术部', deadline:'6月2日' },
  { task:'提供20人3个月免费试用方案', owner:'王志华', deadline:'6月5日' }
]
</script>

<style scoped>
.visit-report{max-width:960px;margin:0 auto;padding:8px;font-family:'PingFang SC','Microsoft YaHei',sans-serif}
.vr-title{font-size:24px;text-align:center;color:#1a1a2e;margin:0 0 4px}.vr-sub{text-align:center;color:#909399;font-size:13px;margin:0 0 24px}
.vr-section{margin-bottom:18px}
.vrs-header{padding:10px 16px;color:#fff;font-size:15px;font-weight:700;border-radius:8px 8px 0 0}
.vr-process p{font-size:13px;color:#606266;line-height:1.8;margin:4px 0}
.vr-list{}.vrl-item{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;color:#303133;line-height:1.8}.vrl-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.vr-match{}.vrm-row{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px;border-bottom:1px solid #f5f7fa}.vrm-need{color:#E6A23C;font-weight:600;width:120px;flex-shrink:0}.vrm-solution{flex:1;color:#303133}
.vr-compare{}.vrc-item{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px}.vrc-name{font-weight:600;color:#E6A23C;width:140px;flex-shrink:0}.vrc-detail{color:#606266}
.vr-advantage{}.vra-item{display:flex;align-items:center;gap:8px;padding:5px 0;font-size:13px;color:#303133}
.vr-follow-card{background:#fafbfc;border-radius:10px;padding:16px;text-align:center}.vrfc-label{font-size:12px;color:#909399;margin-bottom:6px}.vrfc-value{font-size:18px;font-weight:700;color:#409EFF}
.vr-signature{display:flex;justify-content:space-around;padding:20px 0;margin-top:16px;border-top:2px solid #409EFF}.vrsig-item{text-align:center}.vrsig-label{font-size:14px;color:#606266;margin-bottom:8px}.vrsig-line{font-size:16px;color:#303133;padding:4px 40px;border-bottom:1px solid #303133;min-width:120px}.vrsig-date{font-size:12px;color:#909399;margin-top:6px}
.vr-footer{text-align:center;padding:20px;color:#ccc;font-size:12px}
</style>
