<template>
  <div class="scenario-report">
    <!-- ================================================================ -->
    <!-- 会议总结 -->
    <!-- ================================================================ -->
    <template v-if="scenario === 'meeting'">
      <div class="sr-hero meeting-hero">
        <el-row :gutter="20" align="middle">
          <el-col :span="16"><h2>📝 {{ data.scenarioData.title }}</h2>
            <div class="sr-hero-meta"><span><el-icon><Clock /></el-icon> {{ data.scenarioData.date }}</span><span><el-icon><UserFilled /></el-icon> {{ data.scenarioData.attendees }}</span></div>
          </el-col>
          <el-col :span="8" style="text-align:center;">
            <div class="hero-kpi"><div class="hk-val" style="color:#67C23A;">{{ data.scenarioData.decisions.length }}</div><div class="hk-lbl">达成决策</div></div>
            <div class="hero-kpi"><div class="hk-val" style="color:#409EFF;">{{ data.scenarioData.actionItems.length }}</div><div class="hk-lbl">待办事项</div></div>
          </el-col>
        </el-row>
      </div>
      <el-alert :title="data.scenarioData.summary" type="info" :closable="false" show-icon style="margin-bottom:16px;" />
      <el-row :gutter="16">
        <el-col :span="14">
          <el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">💬 议题讨论详情</div></template>
            <div v-for="(t, idx) in data.scenarioData.topics" :key="idx" class="topic-block">
              <div class="topic-header"><span class="topic-num">{{ idx + 1 }}</span><span class="topic-title">{{ t.topic }}</span><el-tag size="small" type="success">{{ t.decision }}</el-tag></div>
              <div class="topic-discussion">{{ t.discussion }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">✅ 会议决策</div></template>
            <div v-for="(d, idx) in data.scenarioData.decisions" :key="idx" class="decision-item"><el-icon color="#67C23A"><CircleCheckFilled /></el-icon><span>{{ d }}</span></div>
          </el-card>
          <el-card shadow="never" class="sr-card" style="margin-top:12px;"><template #header><div class="sr-card-title">📋 待办事项</div></template>
            <el-table :data="data.scenarioData.actionItems" size="small"><el-table-column type="index" width="40" /><el-table-column prop="task" label="任务" /><el-table-column prop="owner" label="负责人" width="90" /><el-table-column prop="deadline" label="截止日期" width="90"><template #default="{row}"><el-tag size="small" type="warning">{{ row.deadline }}</el-tag></template></el-table-column></el-table>
          </el-card>
          <el-card shadow="never" class="sr-card next-meeting" style="margin-top:12px;"><template #header><div class="sr-card-title">📅 下次会议</div></template>
            <div class="nm-info">{{ data.scenarioData.nextMeeting || '待确认' }}</div>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- ================================================================ -->
    <!-- 汽车销售综合评估 -->
    <!-- ================================================================ -->
    <template v-else-if="scenario === 'auto'">
      <div class="sr-hero auto-hero">
        <el-row :gutter="20" align="middle">
          <el-col :span="6" style="text-align:center;">
            <div class="auto-big-score" style="color:#F56C6C;">{{ data.scenarioData.totalScore }}</div>
            <div class="auto-big-label">综合评估分</div>
            <el-tag type="danger" size="small">🚗 试驾体验优秀</el-tag>
          </el-col>
          <el-col :span="18">
            <h2>🚗 {{ data.scenarioData.customer?.name }} · 试驾跟进分析</h2>
            <div class="sr-hero-meta">
              <span>意向车型：{{ data.scenarioData.targetCar }}</span>
              <span>预算：{{ data.scenarioData.budget }}</span>
              <span>竞品对比：{{ data.scenarioData.competitors }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">🎯 客户需求画像</div></template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="用车场景">{{ data.scenarioData.useCase }}</el-descriptions-item>
              <el-descriptions-item label="核心关注点">{{ data.scenarioData.concerns }}</el-descriptions-item>
              <el-descriptions-item label="决策因素排序">{{ data.scenarioData.decisionFactors }}</el-descriptions-item>
              <el-descriptions-item label="家庭情况">{{ data.scenarioData.familyInfo }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">💡 销售策略评估</div></template>
            <div v-for="(s, idx) in data.scenarioData.salesStrategies" :key="idx" class="strategy-eval">
              <div class="se-header"><span class="se-num" :style="{background: s.effective ? '#67C23A' : '#E6A23C'}">{{ idx+1 }}</span><span class="se-title">{{ s.point }}</span><el-tag :type="s.effective ? 'success' : 'warning'" size="small">{{ s.effective ? '✓ 有效' : '需改进' }}</el-tag></div>
              <div class="se-detail">{{ s.detail }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="16" style="margin-top:12px;">
        <el-col :span="8"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">💬 客户原话反馈</div></template><div class="quote-card" v-for="(q,idx) in data.scenarioData.quotes" :key="idx"><div class="qc-text">"{{ q.text }}"</div><div class="qc-signal" :style="{color: q.signal === 'positive' ? '#67C23A' : '#E6A23C'}">{{ q.signal === 'positive' ? '✓ 积极信号' : '⚠ 顾虑' }}</div></div></el-card></el-col>
        <el-col :span="8"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">🏆 成交概率</div></template><div style="text-align:center;padding:20px;"><div class="deal-big" style="color:#67C23A;">{{ data.scenarioData.dealProbability }}%</div><el-progress :percentage="data.scenarioData.dealProbability" :stroke-width="10" color="#67C23A" /><div style="margin-top:8px;color:#909399;font-size:12px;">{{ data.scenarioData.dealSignal }}</div></div></el-card></el-col>
        <el-col :span="8"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">📋 跟进建议</div></template><div v-for="(f,idx) in data.scenarioData.followUps" :key="idx" class="follow-item"><el-tag size="small" round>{{ f.time }}</el-tag><span>{{ f.action }}</span></div></el-card></el-col>
      </el-row>
    </template>

    <!-- ================================================================ -->
    <!-- 产品力打分 -->
    <!-- ================================================================ -->
    <template v-else-if="scenario === 'product'">
      <div class="sr-hero product-hero">
        <el-row :gutter="20" align="middle">
          <el-col :span="10" style="text-align:center;">
            <div class="product-big-ring">
              <svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="6"/><circle cx="70" cy="70" r="58" fill="none" stroke="#67C23A" stroke-width="6" :stroke-dasharray="2*Math.PI*58" :stroke-dashoffset="2*Math.PI*58*(1 - (data.scenarioData.totalScore||88)/100)" stroke-linecap="round" transform="rotate(-90 70 70)"/></svg>
              <div class="pb-center"><span class="pb-score">{{ data.scenarioData.totalScore || 88 }}</span><span class="pb-unit">/100</span></div>
            </div>
            <el-tag type="success" size="small" style="margin-top:8px;">⭐ 产品力优秀</el-tag>
          </el-col>
          <el-col :span="14"><h2>⭐ 产品力综合评估</h2><div class="sr-hero-meta"><span>产品：{{ data.scenarioData.productName }}</span><span>行业：{{ data.scenarioData.industry }}</span></div></el-col>
        </el-row>
      </div>
      <el-row :gutter="16">
        <el-col :span="6" v-for="d in data.scenarioData.productDims" :key="d.name"><el-card shadow="never" class="sr-card dim-card" :style="{borderTopColor:d.color}"><div class="dim-score" :style="{color:d.color}">{{ d.score }}</div><div class="dim-name">{{ d.name }}</div><el-progress :percentage="d.score" :color="d.color" :stroke-width="5" :show-text="false" /><div class="dim-desc">{{ d.desc }}</div><el-tag v-for="t in d.tags" :key="t" size="small" effect="plain" style="margin:2px;">{{ t }}</el-tag></el-card></el-col>
      </el-row>
      <el-row :gutter="16" style="margin-top:12px;">
        <el-col :span="12"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">💎 卖点传递热力图</div></template><div v-for="(sp,idx) in data.scenarioData.sellingHeatmap" :key="idx" class="heat-row"><div class="heat-label">{{ sp.name }}</div><div class="heat-bar"><div class="heat-fill" :style="{width:sp.coverage+'%', background: sp.coverage>=90?'#67C23A':sp.coverage>=70?'#409EFF':'#E6A23C'}">{{ sp.coverage }}%</div></div><el-tag size="small" :type="sp.coverage>=90?'success':sp.coverage>=70?'':'warning'">{{ sp.coverage>=90?'充分覆盖':sp.coverage>=70?'已提及':'未充分' }}</el-tag></div></el-card></el-col>
        <el-col :span="12"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">📊 竞品对比优势</div></template><div v-for="(c,idx) in data.scenarioData.competitorCompare" :key="idx" class="comp-row2"><span class="cr2-label">{{ c.dim }}</span><div class="cr2-bars"><div class="cr2-us" :style="{width:c.us+'%'}">我方{{ c.us }}</div><div class="cr2-them" :style="{width:c.them+'%'}">竞品{{ c.them }}</div></div></div></el-card></el-col>
      </el-row>
    </template>

    <!-- ================================================================ -->
    <!-- 医疗合规 -->
    <!-- ================================================================ -->
    <template v-else-if="scenario === 'medical'">
      <div class="sr-hero medical-hero">
        <el-row :gutter="16" align="middle">
          <el-col :span="16"><h2>🏥 学术拜访合规评估报告</h2><div class="sr-hero-meta"><span>{{ data.scenarioData.doctor.hospital }}</span><span>{{ data.scenarioData.doctor.dept }} · {{ data.scenarioData.doctor.name }}</span><span>{{ data.scenarioData.doctor.level }}</span></div><div style="margin-top:8px;"><el-tag type="success" size="small">产品：{{ data.scenarioData.product }}</el-tag></div></el-col>
          <el-col :span="8" style="text-align:center;"><div class="compliance-badge" :class="data.scenarioData.compliance.overall==='合规'?'pass':'fail'">{{ data.scenarioData.compliance.overall==='合规'?'✅ 合规' : '⚠️ 不合规' }}</div></el-col>
        </el-row>
      </div>
      <el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">🔍 合规检查清单</div></template>
        <div v-for="item in data.scenarioData.compliance.issues" :key="item.item" class="compliance-row">
          <el-icon :color="item.status==='pass'?'#67C23A':'#F56C6C'" :size="18"><CircleCheckFilled v-if="item.status==='pass'"/><CircleCloseFilled v-else/></el-icon>
          <div class="compliance-info"><div class="compliance-name">{{ item.item }}</div><div class="compliance-detail">{{ item.detail }}</div></div>
          <el-tag :type="item.status==='pass'?'success':'danger'" size="small">{{ item.status==='pass'?'通过':'不通过' }}</el-tag>
        </div>
      </el-card>
      <el-card shadow="never" class="sr-card" style="margin-top:12px;"><template #header><div class="sr-card-title">📊 拜访质量评估</div></template>
        <el-row :gutter="16"><el-col :span="6" v-for="d in data.scenarioData.visitQuality.dimensions" :key="d.name"><div class="quality-card"><div class="qc-score" :style="{color:d.score>=90?'#67C23A':d.score>=80?'#409EFF':'#E6A23C'}">{{ d.score }}</div><div class="qc-name">{{ d.name }}</div><el-progress :percentage="d.score" :stroke-width="4" :show-text="false" :color="d.score>=90?'#67C23A':'#409EFF'"/><div class="qc-comment">{{ d.comment }}</div></div></el-col></el-row>
      </el-card>
      <el-card shadow="never" class="sr-card" style="margin-top:12px;"><template #header><div class="sr-card-title">💬 医生反馈与下一步</div></template><el-alert :title="data.scenarioData.doctorFeedback" type="info" :closable="false" show-icon /></el-card>
    </template>

    <!-- ================================================================ -->
    <!-- 教育课程 -->
    <!-- ================================================================ -->
    <template v-else-if="scenario === 'education'">
      <div class="sr-hero edu-hero"><h2>📚 课程推荐分析报告</h2><div class="sr-hero-meta"><span>学员：{{ data.scenarioData.parent.child.name }}（{{ data.scenarioData.parent.child.grade }}）</span><span>家长：{{ data.scenarioData.parent.name }}</span></div></div>
      <el-row :gutter="16">
        <el-col :span="12"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">👤 学员画像</div></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="学习目标">{{ data.scenarioData.needs.goal }}</el-descriptions-item>
            <el-descriptions-item label="薄弱环节"><el-tag type="danger" size="small">{{ data.scenarioData.needs.painPoint }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="辅导科目">{{ data.scenarioData.parent.child.subjects.join('、') }}</el-descriptions-item>
            <el-descriptions-item label="预算">{{ data.scenarioData.needs.budget }}</el-descriptions-item>
            <el-descriptions-item label="时间">{{ data.scenarioData.needs.schedule }}</el-descriptions-item>
          </el-descriptions></el-card>
          <el-card shadow="never" class="sr-card" style="margin-top:12px;"><template #header><div class="sr-card-title">📊 沟通评估</div></template>
            <div v-for="(sa,idx) in data.scenarioData.salesAnalysis" :key="idx" class="sa-row"><el-tag size="small" :type="idx===0?'success':idx===1?'':'warning'">维度{{ idx+1 }}</el-tag><span class="sa-text">{{ sa }}</span></div>
          </el-card>
        </el-col>
        <el-col :span="12"><el-card shadow="never" class="sr-card recommend-card"><template #header><div class="sr-card-title">🎯 推荐方案</div></template>
          <div class="recommend-course">{{ data.scenarioData.recommendation.course }}</div><div class="recommend-teacher">👨‍🏫 {{ data.scenarioData.recommendation.teacher }}</div><el-divider/>
          <div class="recommend-price"><span class="rp-label">课程费用</span><span class="rp-value">{{ data.scenarioData.recommendation.price }}</span></div>
          <el-button type="primary" style="width:100%;margin-top:12px;">安排免费试听</el-button>
          <div class="next-step-hint">{{ data.scenarioData.nextStep }}</div></el-card>
          <el-card shadow="never" class="sr-card" style="margin-top:12px;"><template #header><div class="sr-card-title">📈 学习提升预期</div></template>
          <div v-for="(ex,idx) in data.scenarioData.expectedOutcomes" :key="idx" class="expect-row"><el-icon color="#67C23A"><CircleCheckFilled /></el-icon><span>{{ ex }}</span></div></el-card>
        </el-col>
      </el-row>
    </template>

    <!-- ================================================================ -->
    <!-- 地产看房 -->
    <!-- ================================================================ -->
    <template v-else-if="scenario === 'realestate'">
      <div class="sr-hero estate-hero"><h2>🏠 看房跟进分析报告</h2><div class="sr-hero-meta"><span>客户：{{ data.scenarioData.customer.name }}（{{ data.scenarioData.customer.family }}）</span><span>预算：{{ data.scenarioData.customer.budget }}</span><span>紧迫度：{{ data.scenarioData.customer.urgency }}</span></div></div>
      <el-row :gutter="16">
        <el-col :span="10"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">🏗️ 推荐房源</div></template>
          <div class="property-name">{{ data.scenarioData.property.name }}</div>
          <el-descriptions :column="1" border size="small" style="margin-top:8px;">
            <el-descriptions-item label="户型">{{ data.scenarioData.property.type }} · {{ data.scenarioData.property.area }}</el-descriptions-item>
            <el-descriptions-item label="总价"><span style="font-size:20px;font-weight:bold;color:#F56C6C;">{{ data.scenarioData.property.price }}</span></el-descriptions-item>
            <el-descriptions-item label="楼层">{{ data.scenarioData.property.floor }}</el-descriptions-item>
            <el-descriptions-item label="学区"><el-tag type="warning" size="small">{{ data.scenarioData.property.school }}</el-tag></el-descriptions-item>
          </el-descriptions></el-card>
          <el-card shadow="never" class="sr-card" style="margin-top:12px;"><template #header><div class="sr-card-title">🎯 成交概率</div></template>
            <div style="text-align:center;padding:16px;"><div class="deal-big" style="color:#67C23A;">{{ data.scenarioData.dealProbability.score }}%</div><el-progress :percentage="data.scenarioData.dealProbability.score" :stroke-width="10" color="#67C23A"/><div style="margin-top:8px;color:#606266;">{{ data.scenarioData.dealProbability.signal }}</div></div></el-card>
        </el-col>
        <el-col :span="14"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">🔍 客户偏好分析</div></template>
          <div class="pref-section"><h4>✅ 满意点</h4><div v-for="l in data.scenarioData.visitAnalysis.liked" :key="l" class="pref-tag good">{{ l }}</div></div>
          <div class="pref-section"><h4>⚠️ 顾虑点</h4><div v-for="c in data.scenarioData.visitAnalysis.concerns" :key="c" class="pref-tag concern">{{ c }}</div></div>
          <div class="pref-section" style="margin-top:12px;"><h4>💬 异议处理</h4><div v-for="o in data.scenarioData.visitAnalysis.objections" :key="o.concern" class="obj-block"><div class="obj-concern">🤔 {{ o.concern }}</div><div class="obj-response">💡 {{ o.response }}</div></div></div>
        </el-card></el-col>
      </el-row>
    </template>

    <!-- ================================================================ -->
    <!-- 零售客户画像 -->
    <!-- ================================================================ -->
    <template v-else-if="scenario === 'retail'">
      <div class="sr-hero retail-hero"><h2>🛒 客户画像与消费分析</h2><div class="sr-hero-meta"><span>{{ data.scenarioData.customer.name }}</span><span>{{ data.scenarioData.customer.occupation }} · {{ data.scenarioData.customer.age }}岁</span><el-tag size="small" type="warning">{{ data.scenarioData.behavior.memberLevel }}</el-tag></div></div>
      <el-row :gutter="16">
        <el-col :span="8"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">🛍️ 本次消费</div></template>
          <div style="text-align:center;"><div class="big-amount">{{ data.scenarioData.behavior.totalSpend }}</div><div style="color:#909399;">{{ data.scenarioData.behavior.purchased }}</div><el-divider/><div class="meta-flex"><span>浏览 {{ data.scenarioData.behavior.browsingTime }}</span></div></div></el-card>
          <el-card shadow="never" class="sr-card" style="margin-top:12px;"><template #header><div class="sr-card-title">🏷️ 偏好标签</div></template>
            <el-tag v-for="p in data.scenarioData.insights.preferences" :key="p" size="small" style="margin:3px;">{{ p }}</el-tag>
            <div class="trigger-info" style="margin-top:8px;font-size:12px;color:#606266;">🎯 购买触发：{{ data.scenarioData.insights.purchaseTriggers }}</div></el-card>
        </el-col>
        <el-col :span="16"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">📈 客户价值分析</div></template>
          <el-row :gutter="12"><el-col :span="6" v-for="stat in retailStats" :key="stat.label"><div class="mini-stat-card"><div class="msc-value">{{ stat.value }}</div><div class="msc-label">{{ stat.label }}</div></div></el-col></el-row>
          <el-divider/><h4 style="margin:0 0 8px;">💡 AI推荐策略</h4>
          <el-alert title="建议2周后推送同品牌新上市面膜+会员专属折扣" type="success" :closable="false" show-icon />
          <el-alert :title="`客户复购周期约${data.scenarioData.insights.loyalty}，建议消费后第30天发送关怀+优惠券`" type="info" :closable="false" show-icon style="margin-top:6px;"/>
          <el-alert :title="data.scenarioData.insights.nextRecommend" type="warning" :closable="false" show-icon style="margin-top:6px;"/></el-card></el-col>
      </el-row>
    </template>

    <!-- ================================================================ -->
    <!-- 保险需求 -->
    <!-- ================================================================ -->
    <template v-else-if="scenario === 'insurance'">
      <div class="sr-hero insurance-hero"><h2>🛡️ 家庭保障需求分析报告</h2><div class="sr-hero-meta"><span>{{ data.scenarioData.customer.name }} · {{ data.scenarioData.customer.age }}岁</span><span>{{ data.scenarioData.customer.family }}</span><span>{{ data.scenarioData.customer.income }}</span></div></div>
      <el-row :gutter="16"><el-col :span="14">
        <el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">⚠️ 保障缺口分析</div></template>
          <div v-for="(gap,idx) in data.scenarioData.gapAnalysis" :key="idx" class="gap-card">
            <div class="gap-header"><el-tag type="danger" size="small">缺口 {{ idx+1 }}</el-tag><span class="gap-title">{{ gap.gap }}</span></div>
            <div class="gap-risk"><strong>风险：</strong>{{ gap.risk }}</div><div class="gap-suggestion"><strong>建议：</strong>{{ gap.suggestion }}</div></div>
        </el-card>
        <el-card shadow="never" class="sr-card" style="margin-top:12px;"><template #header><div class="sr-card-title">📊 现有保障 vs 建议保障</div></template>
          <div v-for="(c,idx) in data.scenarioData.coverageCompare" :key="idx" class="cov-row"><span class="cov-name">{{ c.name }}</span><span class="cov-current">{{ c.current }}</span><el-icon><ArrowRight /></el-icon><span class="cov-suggest" style="color:#409EFF;font-weight:bold;">{{ c.suggested }}</span></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">💼 推荐方案</div></template>
          <div v-for="(r,idx) in data.scenarioData.recommendation" :key="idx" class="rec-plan"><div class="rp-name">{{ r.product }}</div><div class="rp-detail">保额：{{ r.coverage }} | 年缴：{{ r.premium }}</div><div class="rp-reason">{{ r.reason }}</div></div>
          <el-divider/><div class="total-premium">合计年缴：<strong style="color:#409EFF;font-size:20px;">{{ data.scenarioData.totalPremium }}</strong><br/><span style="color:#909399;font-size:12px;">占家庭年收入6.2%，合理范围</span></div>
        </el-card>
      </el-col></el-row>
    </template>

    <!-- ================================================================ -->
    <!-- 营业厅服务 -->
    <!-- ================================================================ -->
    <template v-else-if="scenario === 'serviceHall'">
      <div class="sr-hero service-hero"><h2>🏢 营业厅服务质量评估</h2><div class="sr-hero-meta"><span>{{ data.scenarioData.customer.name }}（{{ data.scenarioData.customer.type }}）</span><span>服务 {{ data.scenarioData.service.serviceTime }}</span><span>等待 {{ data.scenarioData.service.waitTime }}</span></div>
        <div style="text-align:center;margin-top:12px;"><span class="satisfaction-big">{{ data.scenarioData.service.satisfaction }}分</span><span style="color:#909399;">客户满意度</span><el-rate v-model="satisfactionStars" disabled show-score style="justify-content:center;"/></div></div>
      <el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">📋 服务流程评分</div></template>
        <div v-for="(step,idx) in data.scenarioData.serviceFlow||serviceDefaultSteps" :key="idx" class="sf-step"><div class="sf-step-num" :style="{background:step.score>=95?'#67C23A':step.score>=90?'#409EFF':'#E6A23C'}">{{ idx+1 }}</div><div class="sf-step-content"><div class="sf-step-header"><span class="sf-step-name">{{ step.step }}</span><span class="sf-step-score" :style="{color:step.score>=95?'#67C23A':'#409EFF'}">{{ step.score }}分</span></div><div class="sf-step-detail">{{ step.detail }}</div></div></div>
      </el-card>
      <el-row :gutter="16" style="margin-top:12px;"><el-col :span="12"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">⭐ 服务亮点</div></template><div v-for="h in (data.scenarioData.highlights||serviceHighlights)" :key="h" class="hl-item"><el-icon color="#67C23A"><CircleCheckFilled /></el-icon><span>{{ h }}</span></div></el-card></el-col>
      <el-col :span="12"><el-card shadow="never" class="sr-card"><template #header><div class="sr-card-title">📈 改进建议</div></template><div v-for="i in (data.scenarioData.improvements||serviceImprovements)" :key="i" class="hl-item"><el-icon color="#E6A23C"><WarningFilled /></el-icon><span>{{ i }}</span></div></el-card></el-col></el-row>
    </template>

    <!-- 默认通用 -->
    <template v-else><SalesReport :data="data.sales" :template="{ hasScore: true }" /></template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SalesReport from './SalesReport.vue'

const props = defineProps({ data: Object, scenario: { type: String, default: 'generic' }})
const satisfactionStars = computed(() => Math.round((props.data.scenarioData?.service?.satisfaction||98)/20))

const retailStats = [{ label:'累计消费次数',value:'8次' },{ label:'累计消费金额',value:'¥9,600' },{ label:'平均客单价',value:'¥1,200' },{ label:'复购周期',value:'45天' }]
const serviceDefaultSteps = [{ step:'迎接引导',score:98,detail:'主动迎接微笑问候快速识别VIP' },{ step:'需求了解',score:95,detail:'耐心倾听确认业务需求' },{ step:'业务办理',score:100,detail:'操作熟练一次性完成' },{ step:'产品推荐',score:90,detail:'精准匹配客户偏好' },{ step:'送别服务',score:96,detail:'提醒注意事项预约下次' }]
const serviceHighlights = ['VIP快速识别引导','一站式业务办理','精准产品推荐匹配需求']
const serviceImprovements = ['可添加企业微信便于后续服务','大额业务后增加安全提醒短信']
</script>

<style scoped>
.scenario-report{}.sr-hero{padding:24px;border-radius:16px;margin-bottom:16px}.sr-hero h2{margin:0 0 8px;font-size:20px}.sr-hero-meta{display:flex;gap:16px;font-size:13px;color:#909399;flex-wrap:wrap}.sr-hero-meta span{display:flex;align-items:center;gap:4px}
.meeting-hero{background:linear-gradient(135deg,#f0f5ff,#e8f4fd)}.auto-hero{background:linear-gradient(135deg,#fef0f0,#fdf6ec)}.product-hero{background:linear-gradient(135deg,#f6ffed,#e8f8f0)}.medical-hero{background:linear-gradient(135deg,#f6ffed,#e8f8f0)}.edu-hero{background:linear-gradient(135deg,#fef0f0,#fdf6ec)}.estate-hero{background:linear-gradient(135deg,#fdf6ec,#fef9f0)}.retail-hero{background:linear-gradient(135deg,#f0f5ff,#f5f0ff)}.insurance-hero{background:linear-gradient(135deg,#f0f9ff,#f0fff4)}.service-hero{background:linear-gradient(135deg,#ecf5ff,#f0f9ff)}
.sr-card{border-radius:12px;margin-bottom:12px}.sr-card-title{font-size:15px;font-weight:bold;color:#303133}
.hero-kpi{display:inline-block;text-align:center;padding:8px 16px}.hk-val{font-size:28px;font-weight:bold}.hk-lbl{font-size:11px;color:#909399}
.topic-block{padding:12px;margin-bottom:8px;background:#fafbfc;border-radius:10px}.topic-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}.topic-num{width:22px;height:22px;border-radius:50%;background:#409EFF;color:#fff;font-size:12px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0}.topic-title{font-size:14px;font-weight:bold;color:#303133;flex:1}.topic-discussion{font-size:13px;color:#606266;line-height:1.7;padding-left:30px}
.decision-item{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px}.next-meeting{background:#f0f9ff}.nm-info{font-size:16px;font-weight:bold;color:#409EFF;text-align:center;padding:8px}
.auto-big-score{font-size:56px;font-weight:bold;line-height:1}.auto-big-label{font-size:13px;color:#909399;margin:4px 0}
.strategy-eval{padding:10px;margin-bottom:6px;background:#fafbfc;border-radius:8px}.se-header{display:flex;align-items:center;gap:8px;margin-bottom:4px}.se-num{width:20px;height:20px;border-radius:50%;color:#fff;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0}.se-title{font-size:13px;font-weight:bold;color:#303133}.se-detail{font-size:12px;color:#606266;padding-left:28px}.quote-card{padding:10px;margin-bottom:6px;background:#fafbfc;border-radius:8px;border-left:3px solid #409EFF}.qc-text{font-size:13px;color:#303133;font-style:italic;line-height:1.6}.qc-signal{font-size:11px;margin-top:4px}.deal-big{font-size:48px;font-weight:bold}.follow-item{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px}
.product-big-ring{position:relative;width:120px;height:120px;margin:0 auto}.pb-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}.pb-score{font-size:36px;font-weight:bold;color:#67C23A}.pb-unit{font-size:12px;color:#94a3b8;display:block}
.dim-card{text-align:center;padding:8px 0;border-top:3px solid}.dim-score{font-size:32px;font-weight:bold}.dim-name{font-size:13px;color:#606266;margin:4px 0}.dim-desc{font-size:12px;color:#909399;margin-top:6px;line-height:1.4}
.heat-row{display:flex;align-items:center;gap:10px;padding:6px 0}.heat-label{width:100px;font-size:13px;color:#606266;flex-shrink:0}.heat-bar{flex:1;height:22px;background:#f0f2f5;border-radius:11px;overflow:hidden}.heat-fill{height:22px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:bold;transition:width 1s}
.comp-row2{display:flex;align-items:center;gap:8px;padding:5px 0}.cr2-label{width:80px;font-size:12px;color:#606266;flex-shrink:0}.cr2-bars{flex:1;display:flex;gap:4px}.cr2-us{background:#409EFF;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;text-align:center;min-width:50px}.cr2-them{background:#c0c4cc;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;text-align:center;min-width:50px}
.compliance-badge{font-size:20px;font-weight:bold;padding:16px;border-radius:12px}.compliance-badge.pass{background:#f0f9eb;color:#67C23A}.compliance-row{display:flex;align-items:flex-start;gap:12px;padding:10px;border-bottom:1px solid #f5f7fa}.compliance-name{font-size:14px;font-weight:bold;color:#303133}.compliance-detail{font-size:12px;color:#909399;margin-top:2px}.quality-card{text-align:center;padding:8px}.qc-score{font-size:32px;font-weight:bold}.qc-name{font-size:13px;color:#606266;margin:4px 0}.qc-comment{font-size:11px;color:#909399;margin-top:6px}
.sa-row{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px}.sa-text{color:#606266}
.recommend-card{border:2px solid #67C23A}.recommend-course{font-size:18px;font-weight:bold;color:#67C23A}.recommend-teacher{font-size:14px;color:#606266;margin-top:4px}.recommend-price{display:flex;justify-content:space-between;align-items:baseline}.rp-label{font-size:13px;color:#909399}.rp-value{font-size:22px;font-weight:bold;color:#F56C6C}.next-step-hint{font-size:12px;color:#409EFF;text-align:center;margin-top:8px}.expect-row{display:flex;align-items:center;gap:6px;padding:4px 0;font-size:13px;color:#303133}
.property-name{font-size:18px;font-weight:bold;color:#303133}.pref-section h4{font-size:13px;color:#303133;margin:6px 0}.pref-tag{display:inline-block;padding:3px 10px;margin:2px;border-radius:12px;font-size:12px}.pref-tag.good{background:#f0f9eb;color:#67C23A}.pref-tag.concern{background:#fef0f0;color:#E6A23C}.obj-block{background:#fafbfc;border-radius:8px;padding:8px;margin-bottom:4px}.obj-concern{font-size:13px;font-weight:bold;color:#E6A23C}.obj-response{font-size:12px;color:#606266;margin-top:3px}
.big-amount{font-size:36px;font-weight:bold;color:#F56C6C}.mini-stat-card{text-align:center;padding:8px;background:#fafbfc;border-radius:8px}.msc-value{font-size:18px;font-weight:bold;color:#409EFF}.msc-label{font-size:11px;color:#909399;margin-top:2px}.meta-flex{font-size:12px;color:#909399}.trigger-info{}
.gap-card{padding:12px;margin-bottom:8px;background:#fef0f0;border-radius:10px;border-left:3px solid #F56C6C}.gap-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}.gap-title{font-size:14px;font-weight:bold;color:#303133}.gap-risk,.gap-suggestion{font-size:13px;color:#606266;line-height:1.7}
.cov-row{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px}.cov-name{width:90px;color:#606266}.cov-current{color:#c0c4cc;text-decoration:line-through;width:80px}.rec-plan{padding:10px;margin-bottom:6px;background:#fafbfc;border-radius:8px}.rp-name{font-size:14px;font-weight:bold;color:#409EFF}.rp-detail{font-size:12px;color:#606266;margin:2px 0}.rp-reason{font-size:11px;color:#909399}.total-premium{text-align:center;padding:8px}
.satisfaction-big{font-size:48px;font-weight:bold;color:#67C23A;display:block}.sf-step{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid #f5f7fa}.sf-step-num{width:28px;height:28px;border-radius:50%;color:#fff;font-size:13px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0}.sf-step-content{flex:1}.sf-step-header{display:flex;justify-content:space-between;align-items:center}.sf-step-name{font-size:14px;font-weight:bold;color:#303133}.sf-step-score{font-size:16px;font-weight:bold}.sf-step-detail{font-size:12px;color:#909399;margin-top:3px}.hl-item{display:flex;align-items:center;gap:8px;padding:5px 0;font-size:13px;color:#606266}
</style>
