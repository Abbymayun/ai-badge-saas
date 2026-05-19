<template>
  <div class="scenario-report">
    <!-- ====== 会议总结 ====== -->
    <template v-if="scenario === 'meeting'">
      <div class="sr-hero meeting-hero">
        <h2>📝 {{ data.scenarioData.title }}</h2>
        <div class="sr-hero-meta">
          <span><el-icon><Clock /></el-icon> {{ data.scenarioData.date }}</span>
          <span><el-icon><UserFilled /></el-icon> {{ data.scenarioData.attendees }}</span>
        </div>
      </div>
      <el-alert :title="data.scenarioData.summary" type="info" :closable="false" show-icon style="margin-bottom:16px;" />

      <el-row :gutter="16">
        <el-col :span="14">
          <el-card shadow="never" class="sr-card">
            <template #header><div class="sr-card-title">💬 议题讨论</div></template>
            <div v-for="(t, idx) in data.scenarioData.topics" :key="idx" class="topic-block">
              <div class="topic-header">
                <span class="topic-num">{{ idx + 1 }}</span>
                <span class="topic-title">{{ t.topic }}</span>
                <el-tag size="small" type="success">{{ t.decision }}</el-tag>
              </div>
              <div class="topic-discussion">{{ t.discussion }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card shadow="never" class="sr-card">
            <template #header><div class="sr-card-title">✅ 会议决策</div></template>
            <div v-for="(d, idx) in data.scenarioData.decisions" :key="idx" class="decision-item">
              <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
              <span>{{ d }}</span>
            </div>
          </el-card>
          <el-card shadow="never" class="sr-card" style="margin-top:12px;">
            <template #header><div class="sr-card-title">📋 待办事项</div></template>
            <div v-for="(a, idx) in data.scenarioData.actionItems" :key="idx" class="action-item">
              <el-tag size="small" round>{{ a.deadline }}</el-tag>
              <span class="action-task">{{ a.task }}</span>
              <span class="action-owner">{{ a.owner }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- ====== 医疗合规 ====== -->
    <template v-else-if="scenario === 'medical'">
      <div class="sr-hero medical-hero">
        <el-row :gutter="16" align="middle">
          <el-col :span="16">
            <h2>🏥 学术拜访合规评估报告</h2>
            <div class="sr-hero-meta">
              <span>{{ data.scenarioData.doctor.hospital }}</span>
              <span>{{ data.scenarioData.doctor.dept }} · {{ data.scenarioData.doctor.name }}</span>
              <span>{{ data.scenarioData.doctor.level }}</span>
            </div>
            <div style="margin-top:8px;">
              <el-tag type="success" size="small">产品：{{ data.scenarioData.product }}</el-tag>
            </div>
          </el-col>
          <el-col :span="8" style="text-align:center;">
            <div class="compliance-badge" :class="data.scenarioData.compliance.overall === '合规' ? 'pass' : 'fail'">
              {{ data.scenarioData.compliance.overall === '合规' ? '✅ 合规' : '⚠️ 不合规' }}
            </div>
          </el-col>
        </el-row>
      </div>

      <el-card shadow="never" class="sr-card">
        <template #header><div class="sr-card-title">🔍 合规检查清单</div></template>
        <div v-for="item in data.scenarioData.compliance.issues" :key="item.item" class="compliance-row">
          <el-icon :color="item.status === 'pass' ? '#67C23A' : '#F56C6C'" :size="18">
            <CircleCheckFilled v-if="item.status === 'pass'" />
            <CircleCloseFilled v-else />
          </el-icon>
          <div class="compliance-info">
            <div class="compliance-name">{{ item.item }}</div>
            <div class="compliance-detail">{{ item.detail }}</div>
          </div>
          <el-tag :type="item.status === 'pass' ? 'success' : 'danger'" size="small">{{ item.status === 'pass' ? '通过' : '不通过' }}</el-tag>
        </div>
      </el-card>

      <el-card shadow="never" class="sr-card" style="margin-top:12px;">
        <template #header><div class="sr-card-title">📊 拜访质量评估</div></template>
        <el-row :gutter="16">
          <el-col :span="6" v-for="d in data.scenarioData.visitQuality.dimensions" :key="d.name">
            <div class="quality-card">
              <div class="qc-score" :style="{color: d.score >= 90 ? '#67C23A' : d.score >= 80 ? '#409EFF' : '#E6A23C'}">{{ d.score }}</div>
              <div class="qc-name">{{ d.name }}</div>
              <el-progress :percentage="d.score" :stroke-width="4" :show-text="false" :color="d.score >= 90 ? '#67C23A' : '#409EFF'" />
              <div class="qc-comment">{{ d.comment }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </template>

    <!-- ====== 教育课程 ====== -->
    <template v-else-if="scenario === 'education'">
      <div class="sr-hero edu-hero">
        <h2>📚 课程推荐分析报告</h2>
        <div class="sr-hero-meta">
          <span>学员：{{ data.scenarioData.parent.child.name }}（{{ data.scenarioData.parent.child.grade }}）</span>
          <span>家长：{{ data.scenarioData.parent.name }}</span>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-card shadow="never" class="sr-card">
            <template #header><div class="sr-card-title">👤 学员画像与需求</div></template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="学习目标">{{ data.scenarioData.needs.goal }}</el-descriptions-item>
              <el-descriptions-item label="薄弱环节">
                <el-tag type="danger" size="small">{{ data.scenarioData.needs.painPoint }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="预算范围">{{ data.scenarioData.needs.budget }}</el-descriptions-item>
              <el-descriptions-item label="辅导科目">{{ data.scenarioData.parent.child.subjects.join('、') }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never" class="sr-card recommend-card">
            <template #header><div class="sr-card-title">🎯 推荐方案</div></template>
            <div class="recommend-course">{{ data.scenarioData.recommendation.course }}</div>
            <div class="recommend-teacher">👨‍🏫 {{ data.scenarioData.recommendation.teacher }}</div>
            <el-divider />
            <div class="recommend-price">
              <span class="rp-label">课程费用</span>
              <span class="rp-value">{{ data.scenarioData.recommendation.price }}</span>
            </div>
            <el-button type="primary" style="width:100%;margin-top:12px;">安排免费试听</el-button>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- ====== 地产看房 ====== -->
    <template v-else-if="scenario === 'realestate'">
      <div class="sr-hero estate-hero">
        <h2>🏠 看房跟进分析报告</h2>
        <div class="sr-hero-meta">
          <span>客户：{{ data.scenarioData.customer.name }}（{{ data.scenarioData.customer.family }}）</span>
          <span>预算：{{ data.scenarioData.customer.budget }}</span>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :span="10">
          <el-card shadow="never" class="sr-card">
            <template #header><div class="sr-card-title">🏗️ 推荐房源</div></template>
            <div class="property-name">{{ data.scenarioData.property.name }}</div>
            <el-descriptions :column="1" border size="small" style="margin-top:8px;">
              <el-descriptions-item label="户型">{{ data.scenarioData.property.type }} · {{ data.scenarioData.property.area }}</el-descriptions-item>
              <el-descriptions-item label="总价">
                <span style="font-size:20px;font-weight:bold;color:#F56C6C;">{{ data.scenarioData.property.price }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="学区">
                <el-tag type="warning" size="small">{{ data.scenarioData.property.school }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
          <el-card shadow="never" class="sr-card" style="margin-top:12px;">
            <template #header><div class="sr-card-title">🎯 成交概率评估</div></template>
            <div style="text-align:center;">
              <div class="deal-big-score">{{ data.scenarioData.dealProbability.score }}%</div>
              <el-progress :percentage="data.scenarioData.dealProbability.score" :stroke-width="10" color="#67C23A" />
              <div style="margin-top:8px;color:#606266;">{{ data.scenarioData.dealProbability.signal }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card shadow="never" class="sr-card">
            <template #header><div class="sr-card-title">📊 销售能力评分</div></template>
            <SalesReport :data="data.sales" :template="{ hasScore: true }" />
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- ====== 零售客户画像 ====== -->
    <template v-else-if="scenario === 'retail'">
      <div class="sr-hero retail-hero">
        <h2>🛒 客户画像与消费分析</h2>
        <div class="sr-hero-meta">
          <span>{{ data.scenarioData.customer.name }}</span>
          <span>{{ data.scenarioData.customer.occupation }} · {{ data.scenarioData.customer.age }}岁</span>
          <el-tag size="small" type="warning">{{ data.scenarioData.behavior.memberLevel }}</el-tag>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :span="8">
          <el-card shadow="never" class="sr-card">
            <template #header><div class="sr-card-title">🛍️ 本次消费</div></template>
            <div style="text-align:center;">
              <div class="big-amount">{{ data.scenarioData.behavior.totalSpend }}</div>
              <div style="font-size:12px;color:#909399;">{{ data.scenarioData.behavior.purchased }}</div>
              <el-divider />
              <div style="font-size:12px;color:#909399;">浏览时长：{{ data.scenarioData.behavior.browsingTime }}</div>
            </div>
          </el-card>

          <el-card shadow="never" class="sr-card" style="margin-top:12px;">
            <template #header><div class="sr-card-title">🏷️ 消费偏好</div></template>
            <el-tag v-for="p in ['偏爱日系品牌','关注成分','重视抗衰老','价格不敏感']" :key="p" size="small" style="margin:3px;">{{ p }}</el-tag>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card shadow="never" class="sr-card">
            <template #header><div class="sr-card-title">📈 客户价值分析</div></template>
            <el-row :gutter="12">
              <el-col :span="6" v-for="stat in retailStats" :key="stat.label">
                <div class="mini-stat-card">
                  <div class="msc-value">{{ stat.value }}</div>
                  <div class="msc-label">{{ stat.label }}</div>
                </div>
              </el-col>
            </el-row>
            <el-divider />
            <h4 style="margin:0 0 8px;">💡 AI推荐策略</h4>
            <el-alert title="建议2周后推送同品牌新上市面膜+会员专属折扣" type="success" :closable="false" show-icon />
            <el-alert title="客户复购周期约45天，建议在消费后第30天发送关怀+优惠券" type="info" :closable="false" show-icon style="margin-top:6px;" />
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- ====== 保险需求分析 ====== -->
    <template v-else-if="scenario === 'insurance'">
      <div class="sr-hero insurance-hero">
        <h2>🛡️ 家庭保障需求分析报告</h2>
        <div class="sr-hero-meta">
          <span>{{ data.scenarioData.customer.name }} · {{ data.scenarioData.customer.age }}岁</span>
          <span>家庭结构：{{ data.scenarioData.customer.family }}</span>
          <span>年收入：{{ data.scenarioData.customer.income }}</span>
        </div>
      </div>

      <el-card shadow="never" class="sr-card" style="margin-bottom:12px;">
        <template #header><div class="sr-card-title">⚠️ 保障缺口分析</div></template>
        <div v-for="(gap, idx) in data.scenarioData.gapAnalysis" :key="idx" class="gap-card">
          <div class="gap-header">
            <el-tag type="danger" size="small">保障缺口 {{ idx + 1 }}</el-tag>
            <span class="gap-title">{{ gap.gap }}</span>
          </div>
          <div class="gap-risk"><strong>风险：</strong>{{ gap.risk }}</div>
          <div class="gap-suggestion"><strong>建议：</strong>{{ gap.suggestion }}</div>
        </div>
      </el-card>

      <el-card shadow="never" class="sr-card">
        <template #header><div class="sr-card-title">💼 推荐保障方案</div></template>
        <el-table :data="insurancePlan" size="small" border>
          <el-table-column prop="product" label="产品" />
          <el-table-column prop="coverage" label="保额/方案" width="150" />
          <el-table-column prop="premium" label="年缴保费" width="130" />
          <el-table-column prop="reason" label="推荐理由" min-width="180" />
        </el-table>
        <div style="text-align:right;margin-top:12px;font-size:14px;">
          合计年缴保费：<strong style="color:#409EFF;font-size:18px;">约3.1万元</strong>
          <span style="color:#909399;font-size:12px;">（占家庭年收入6.2%，在合理范围内）</span>
        </div>
      </el-card>
    </template>

    <!-- ====== 营业厅服务 ====== -->
    <template v-else-if="scenario === 'serviceHall'">
      <div class="sr-hero service-hero">
        <h2>🏢 营业厅服务质量评估</h2>
        <div class="sr-hero-meta">
          <span>客户：{{ data.scenarioData.customer.name }}（{{ data.scenarioData.customer.type }}）</span>
          <span>服务时长：{{ data.scenarioData.service.serviceTime }}</span>
          <span>等待时间：{{ data.scenarioData.service.waitTime }}</span>
        </div>
        <div style="text-align:center;margin-top:12px;">
          <span class="satisfaction-big">{{ data.scenarioData.service.satisfaction }}分</span>
          <span style="color:#909399;">客户满意度</span>
          <el-rate v-model="satisfactionStars" disabled show-score style="justify-content:center;" />
        </div>
      </div>

      <el-card shadow="never" class="sr-card">
        <template #header><div class="sr-card-title">📋 服务流程评分</div></template>
        <div class="service-flow">
          <div v-for="(step, idx) in serviceSteps" :key="idx" class="sf-step">
            <div class="sf-step-num" :style="{background: step.score >= 95 ? '#67C23A' : step.score >= 90 ? '#409EFF' : '#E6A23C'}">{{ idx + 1 }}</div>
            <div class="sf-step-content">
              <div class="sf-step-header">
                <span class="sf-step-name">{{ step.step }}</span>
                <span class="sf-step-score" :style="{color: step.score >= 95 ? '#67C23A' : '#409EFF'}">{{ step.score }}分</span>
              </div>
              <div class="sf-step-detail">{{ step.detail }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </template>

    <!-- ====== 默认（含销售评分） ====== -->
    <template v-else>
      <SalesReport :data="data.sales" :template="{ hasScore: true }" />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SalesReport from './SalesReport.vue'

const props = defineProps({
  data: { type: Object, required: true },
  scenario: { type: String, default: 'generic' }
})

const satisfactionStars = computed(() => Math.round((props.data.scenarioData?.service?.satisfaction || 98) / 20))

const retailStats = [
  { label: '累计消费次数', value: '8次' },
  { label: '累计消费金额', value: '¥9,600' },
  { label: '平均客单价', value: '¥1,200' },
  { label: '复购周期', value: '45天' }
]

const insurancePlan = [
  { product: 'XX重疾险', coverage: '100万', premium: '约8,000元/年', reason: '覆盖70种重疾+30种轻症，含轻症豁免' },
  { product: 'XX定期寿险', coverage: '200万', premium: '约3,000元/年', reason: '保障至60岁，覆盖房贷+子女教育关键期' },
  { product: 'XX教育年金', coverage: '年缴2万', premium: '2万/年', reason: '18-21岁每年领取5万教育金' }
]

const serviceSteps = [
  { step: '迎接引导', score: 98, detail: '主动迎接，微笑问候，快速识别VIP身份引导至贵宾室' },
  { step: '需求了解', score: 95, detail: '耐心倾听，确认业务需求，了解客户偏好' },
  { step: '业务办理', score: 100, detail: '操作熟练，一次性完成多项业务' },
  { step: '产品推荐', score: 90, detail: '根据客户偏好精准推荐匹配产品' },
  { step: '送别服务', score: 96, detail: '送至门口，提醒注意事项，预约下次服务' }
]
</script>

<style scoped>
.scenario-report { }

.sr-hero { padding: 24px; border-radius: 16px; margin-bottom: 16px; }
.sr-hero h2 { margin: 0 0 8px; font-size: 20px; color: #303133; }
.sr-hero-meta { display: flex; gap: 16px; font-size: 13px; color: #909399; flex-wrap: wrap; }
.sr-hero-meta span { display: flex; align-items: center; gap: 4px; }
.meeting-hero { background: linear-gradient(135deg, #f0f5ff, #e8f4fd); }
.medical-hero { background: linear-gradient(135deg, #f6ffed, #e8f8f0); }
.edu-hero { background: linear-gradient(135deg, #fef0f0, #fdf6ec); }
.estate-hero { background: linear-gradient(135deg, #fdf6ec, #fef9f0); }
.retail-hero { background: linear-gradient(135deg, #f0f5ff, #f5f0ff); }
.insurance-hero { background: linear-gradient(135deg, #f0f9ff, #f0fff4); }
.service-hero { background: linear-gradient(135deg, #ecf5ff, #f0f9ff); }

.sr-card { border-radius: 12px; margin-bottom: 12px; }
.sr-card-title { font-size: 15px; font-weight: bold; color: #303133; }

/* 会议 */
.topic-block { padding: 12px; margin-bottom: 8px; background: #fafbfc; border-radius: 10px; }
.topic-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.topic-num { width: 22px; height: 22px; border-radius: 50%; background: #409EFF; color: #fff; font-size: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.topic-title { font-size: 14px; font-weight: bold; color: #303133; flex: 1; }
.topic-discussion { font-size: 13px; color: #606266; line-height: 1.7; padding-left: 30px; }
.decision-item, .action-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 13px; }
.action-task { flex: 1; color: #303133; }
.action-owner { font-size: 12px; color: #909399; }

/* 医疗 */
.compliance-badge { font-size: 20px; font-weight: bold; padding: 16px; border-radius: 12px; }
.compliance-badge.pass { background: #f0f9eb; color: #67C23A; }
.compliance-badge.fail { background: #fef0f0; color: #F56C6C; }
.compliance-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px; border-bottom: 1px solid #f5f7fa; }
.compliance-name { font-size: 14px; font-weight: bold; color: #303133; }
.compliance-detail { font-size: 12px; color: #909399; margin-top: 2px; }
.quality-card { text-align: center; padding: 8px; }
.qc-score { font-size: 32px; font-weight: bold; }
.qc-name { font-size: 13px; color: #606266; margin: 4px 0; }
.qc-comment { font-size: 11px; color: #909399; margin-top: 6px; }

/* 教育 */
.recommend-card { border: 2px solid #67C23A; }
.recommend-course { font-size: 18px; font-weight: bold; color: #67C23A; }
.recommend-teacher { font-size: 14px; color: #606266; margin-top: 4px; }
.recommend-price { display: flex; justify-content: space-between; align-items: baseline; }
.rp-label { font-size: 13px; color: #909399; }
.rp-value { font-size: 22px; font-weight: bold; color: #F56C6C; }

/* 地产 */
.property-name { font-size: 18px; font-weight: bold; color: #303133; }
.deal-big-score { font-size: 48px; font-weight: bold; color: #67C23A; }

/* 零售 */
.big-amount { font-size: 36px; font-weight: bold; color: #F56C6C; }
.mini-stat-card { text-align: center; padding: 8px; background: #fafbfc; border-radius: 8px; }
.msc-value { font-size: 18px; font-weight: bold; color: #409EFF; }
.msc-label { font-size: 11px; color: #909399; margin-top: 2px; }

/* 保险 */
.gap-card { padding: 12px; margin-bottom: 8px; background: #fef0f0; border-radius: 10px; border-left: 3px solid #F56C6C; }
.gap-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.gap-title { font-size: 14px; font-weight: bold; color: #303133; }
.gap-risk, .gap-suggestion { font-size: 13px; color: #606266; line-height: 1.7; }

/* 服务厅 */
.satisfaction-big { font-size: 48px; font-weight: bold; color: #67C23A; display: block; }
.service-flow { }
.sf-step { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid #f5f7fa; }
.sf-step-num { width: 28px; height: 28px; border-radius: 50%; color: #fff; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sf-step-content { flex: 1; }
.sf-step-header { display: flex; justify-content: space-between; align-items: center; }
.sf-step-name { font-size: 14px; font-weight: bold; color: #303133; }
.sf-step-score { font-size: 16px; font-weight: bold; }
.sf-step-detail { font-size: 12px; color: #909399; margin-top: 3px; }
</style>
