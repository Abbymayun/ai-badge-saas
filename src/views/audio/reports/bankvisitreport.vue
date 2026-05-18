<template>
  <div class="bank-report">
    <!-- 报告标题 -->
    <div class="report-header">
      <h2>银行客户走访调查报告</h2>
      <div class="report-meta">
        <span>客户经理：{{ data.salesPerson }}</span>
        <span>走访日期：{{ data.visitDate }}</span>
        <span>企业名称：{{ data.profile.name }}</span>
        <span>报告编号：{{ data.reportNo }}</span>
      </div>
    </div>

    <!-- ============ 一、企业情况简介 ============ -->
    <el-card shadow="never" class="section-card">
      <template #header><div class="section-num">一</div><span class="section-title">企业情况简介</span></template>

      <!-- 1.1 基本情况 -->
      <h4 class="sub-title">1. 基本情况</h4>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="企业名称">{{ data.company.name }}</el-descriptions-item>
        <el-descriptions-item label="注册地">{{ data.company.registeredAddress }}</el-descriptions-item>
        <el-descriptions-item label="实际经营地">{{ data.company.actualAddress }}</el-descriptions-item>
        <el-descriptions-item label="占地面积">{{ data.company.landArea }}亩 · 建筑面积 {{ data.company.buildingArea }}㎡</el-descriptions-item>
        <el-descriptions-item label="权属性质">
          {{ data.company.propertyType }}
          <el-tag size="small" :type="data.company.hasPropertyCert ? 'success' : 'warning'">{{ data.company.hasPropertyCert ? '有权证' : '无权证' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="评估价值">{{ data.company.assessedValue }}万元</el-descriptions-item>
        <el-descriptions-item label="抵押情况">
          <span v-if="data.company.mortgageTo === '我行'"><el-tag type="success" size="small">抵押我行</el-tag></span>
          <span v-else-if="data.company.mortgageTo === '他行'"><el-tag type="warning" size="small">抵押他行</el-tag></span>
          <span v-else>无抵押</span>
        </el-descriptions-item>
        <el-descriptions-item label="成立时间">{{ data.company.establishedYear }}年</el-descriptions-item>
        <el-descriptions-item label="生产经营年限">{{ data.company.operationYears }}年</el-descriptions-item>
        <el-descriptions-item label="所属行业">{{ data.company.industry }}</el-descriptions-item>
        <el-descriptions-item label="是否环境敏感行业">
          <el-tag :type="data.company.envSensitive ? 'danger' : 'success'" size="small">{{ data.company.envSensitive ? '是' : '否' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="主要产品/服务" :span="2">{{ data.company.mainProducts }}</el-descriptions-item>
        <el-descriptions-item label="本地行业经营情况" :span="2">
          <el-tag size="small" :type="data.company.localStatus === '好' ? 'success' : data.company.localStatus === '一般' ? 'warning' : 'info'">
            {{ data.company.localStatus }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 1.2 资本构成及实际控制人 -->
      <h4 class="sub-title" style="margin-top:16px;">2. 资本构成及实际控制人情况</h4>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="注册资本">{{ data.company.registeredCapital }}万元</el-descriptions-item>
        <el-descriptions-item label="实收资本">{{ data.company.paidCapital }}万元</el-descriptions-item>
        <el-descriptions-item label="法人代表">{{ data.company.legalPerson }} · 国籍：{{ data.company.legalPersonNationality }}</el-descriptions-item>
        <el-descriptions-item label="实际控制人">{{ data.company.actualController }} · 国籍：{{ data.company.controllerNationality }}</el-descriptions-item>
      </el-descriptions>

      <!-- 股东出资表 -->
      <div style="margin-top:8px;">
        <span style="font-weight:bold;font-size:13px;">股东出资情况：</span>
        <el-table :data="data.company.shareholders" size="small" border style="margin-top:4px;">
          <el-table-column prop="name" label="出资人" />
          <el-table-column prop="amount" label="出资额(万元)" width="120" />
          <el-table-column prop="ratio" label="占比" width="100" />
          <el-table-column prop="remark" label="备注" min-width="150" />
        </el-table>
      </div>

      <!-- 风投信息 -->
      <div v-if="data.company.vcInfo && data.company.vcInfo.length" style="margin-top:12px;">
        <span style="font-weight:bold;font-size:13px;">风投/融资情况：</span>
        <el-table :data="data.company.vcInfo" size="small" border style="margin-top:4px;">
          <el-table-column prop="name" label="风投名称" width="120" />
          <el-table-column prop="background" label="风投背景" width="100" />
          <el-table-column prop="round" label="融资轮次" width="80" />
          <el-table-column prop="date" label="投资日期" width="100" />
          <el-table-column prop="method" label="投资方式" width="100" />
          <el-table-column prop="amount" label="投资金额/估值" width="140" />
          <el-table-column prop="ratio" label="持股比例" width="80" />
          <el-table-column prop="terms" label="对赌条款/退出机制" min-width="180" />
        </el-table>
      </div>

      <!-- 1.3 基本风险点 -->
      <h4 class="sub-title" style="margin-top:16px;">3. 基本风险点</h4>
      <el-row :gutter="12">
        <el-col :span="8">
          <div class="risk-item"><span class="risk-label">环保达标：</span>
            <el-tag :type="data.risk.envCompliant ? 'success' : 'danger'" size="small">{{ data.risk.envCompliant ? '☑ 达标' : '☒ 未达标' }}</el-tag>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="risk-item"><span class="risk-label">民间融资：</span>
            <el-tag :type="data.risk.privateLending ? 'danger' : 'success'" size="small">{{ data.risk.privateLending ? '☑ 发现' : '☑ 未发现' }}</el-tag>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="risk-item"><span class="risk-label">工商行政处罚：</span>
            <el-tag :type="data.risk.adminPenalty ? 'danger' : 'success'" size="small">{{ data.risk.adminPenalty ? '☑ 有' : '☑ 无' }}</el-tag>
          </div>
        </el-col>
        <el-col :span="24" style="margin-top:6px;">
          <div class="risk-item"><span class="risk-label">法院被执行人信息（含实控人及配偶）：</span>
            <el-tag :type="data.risk.courtExecution ? 'danger' : 'success'" size="small">{{ data.risk.courtExecution ? '☑ 有' : '☑ 无' }}</el-tag>
          </div>
        </el-col>
      </el-row>

      <!-- 1.4 融资现状 -->
      <h4 class="sub-title" style="margin-top:16px;">4. 融资现状</h4>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="他行融资总额">{{ data.financing.otherBankTotal }}万元</el-descriptions-item>
      </el-descriptions>
      <el-table :data="data.financing.otherBankDetails" size="small" border style="margin-top:4px;">
        <el-table-column prop="bank" label="融资银行" />
        <el-table-column prop="amount" label="额度(万元)" width="120" />
        <el-table-column prop="term" label="期限" width="100" />
        <el-table-column prop="type" label="品种" width="120" />
        <el-table-column prop="guarantee" label="担保方式" width="120" />
      </el-table>
      <div style="margin-top:8px;font-size:13px;">
        实际控制人及配偶个人融资总额：<strong>{{ data.financing.personalTotal }}万元</strong>
        （{{ data.financing.personalDetails }}）
      </div>

      <!-- 1.5 关联企业 -->
      <h4 class="sub-title" style="margin-top:16px;">5. 关联企业情况</h4>
      <div class="text-block" v-if="data.relatedCompanies">{{ data.relatedCompanies }}</div>
      <el-empty v-else description="未发现异常关联企业" :image-size="40" />

      <!-- 1.6 对外投资 -->
      <h4 class="sub-title" style="margin-top:16px;">6. 企业（或企业主）对外投资</h4>
      <div class="text-block" v-if="data.externalInvestment">{{ data.externalInvestment }}</div>
      <el-empty v-else description="无大额对外投资" :image-size="40" />
    </el-card>

    <!-- ============ 二、企业财务情况 ============ -->
    <el-card shadow="never" class="section-card">
      <template #header><div class="section-num">二</div><span class="section-title">企业财务情况</span></template>

      <el-alert :title="'经分析，企业提供的财务报表数据' + (data.finance.dataReliable ? '基本真实' : '基本不真实') + '。'" 
        :type="data.finance.dataReliable ? 'success' : 'warning'" :closable="false" show-icon style="margin-bottom:12px;" />

      <h4 class="sub-title">1. 财务数据摘要</h4>
      <el-table :data="data.finance.financialTable" size="small" border>
        <el-table-column prop="item" label="项目" min-width="150" fixed />
        <el-table-column v-for="y in data.finance.years" :key="y" :label="y + '年'" width="120">
          <template #default="{row}">{{ row[y] || '-' }}</template>
        </el-table-column>
        <el-table-column prop="note" label="说明" min-width="180" />
      </el-table>

      <h4 class="sub-title" style="margin-top:16px;">2. 报表科目分析</h4>
      <div class="analysis-block">
        <h5>资产科目分析：</h5>
        <div class="text-block">{{ data.finance.assetAnalysis }}</div>
        <h5 style="margin-top:8px;">负债科目分析：</h5>
        <div class="text-block">{{ data.finance.liabilityAnalysis }}</div>
        <h5 style="margin-top:8px;">所有者权益分析：</h5>
        <div class="text-block">{{ data.finance.equityAnalysis }}</div>
      </div>

      <h4 class="sub-title" style="margin-top:16px;">3. 融资一致性说明</h4>
      <div class="text-block">{{ data.finance.financingConsistency }}</div>
    </el-card>

    <!-- ============ 三、企业经营情况 ============ -->
    <el-card shadow="never" class="section-card">
      <template #header><div class="section-num">三</div><span class="section-title">企业经营情况</span></template>

      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="主要产品/服务">{{ data.operations.mainProducts }}</el-descriptions-item>
        <el-descriptions-item label="产品品牌">{{ data.operations.brand }}</el-descriptions-item>
        <el-descriptions-item label="行业地位">
          <el-tag size="small" :type="data.operations.marketPosition === '龙头' ? 'success' : ''">{{ data.operations.marketPosition }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="主要销售区域">{{ data.operations.salesRegion }}</el-descriptions-item>
        <el-descriptions-item label="主要上游供应商" :span="2">{{ data.operations.mainSuppliers }}</el-descriptions-item>
        <el-descriptions-item label="主要下游客户" :span="2">{{ data.operations.mainCustomers }}</el-descriptions-item>
      </el-descriptions>

      <h4 class="sub-title" style="margin-top:16px;">1. 销售利润情况</h4>
      <el-table :data="data.operations.salesProfitTable" size="small" border>
        <el-table-column prop="label" label="指标" min-width="180" />
        <el-table-column prop="value" label="数值" width="180">
          <template #default="{row}">
            <span :style="{color: row.trend === 'up' ? '#67C23A' : row.trend === 'down' ? '#F56C6C' : '#303133', fontWeight: 'bold'}">{{ row.value }}</span>
            <span v-if="row.change" :style="{color: row.trend === 'up' ? '#67C23A' : '#F56C6C', fontSize: '12px', marginLeft: '4px'}">{{ row.change }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="分析说明" min-width="200" />
      </el-table>

      <h4 class="sub-title" style="margin-top:16px;">2. 销售归行情况</h4>
      <div class="text-block">{{ data.operations.salesReturn }}</div>
    </el-card>

    <!-- ============ 四、对外担保情况 ============ -->
    <el-card shadow="never" class="section-card">
      <template #header><div class="section-num">四</div><span class="section-title">对外担保情况</span></template>

      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="企业对外担保总额">{{ data.guarantee.corporateTotal }}万元</el-descriptions-item>
        <el-descriptions-item label="实控人及配偶担保总额">{{ data.guarantee.personalTotal }}万元</el-descriptions-item>
        <el-descriptions-item label="担保类型">
          <el-tag v-if="data.guarantee.type === '互保'" type="warning" size="small">关联互保</el-tag>
          <el-tag v-else-if="data.guarantee.type === '担保圈'" type="danger" size="small">担保圈</el-tag>
          <el-tag v-else type="success" size="small">一般担保</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="人行征信一致性">
          <el-tag :type="data.guarantee.creditMatch ? 'success' : 'warning'" size="small">{{ data.guarantee.creditMatch ? '一致' : '不一致（已说明原因）' }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="data.guarantee.details" size="small" border style="margin-top:12px;">
        <el-table-column prop="target" label="担保对象" />
        <el-table-column prop="amount" label="担保金额(万元)" width="120" />
        <el-table-column prop="bank" label="融资银行" width="120" />
        <el-table-column prop="creditStatus" label="人行征信分类" width="120" />
        <el-table-column prop="operationStatus" label="经营是否正常" width="120">
          <template #default="{row}">
            <el-tag :type="row.operationStatus === '正常' ? 'success' : 'danger'" size="small">{{ row.operationStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="legalStatus" label="诉讼/被执行" width="120">
          <template #default="{row}">
            <el-tag :type="row.legalStatus === '无' ? 'success' : 'danger'" size="small">{{ row.legalStatus }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- ============ 五、综合评估与建议 ============ -->
    <el-card shadow="never" class="section-card conclusion-card">
      <template #header><div class="section-num">五</div><span class="section-title">综合评估与授信建议</span></template>

      <el-row :gutter="16">
        <el-col :span="12">
          <h4>优势与亮点</h4>
          <div class="highlight-item" v-for="(h, idx) in data.assessment.strengths" :key="idx">
            <el-icon style="color:#67C23A;"><CircleCheckFilled /></el-icon>
            <span>{{ h }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <h4>风险关注点</h4>
          <div class="highlight-item" v-for="(r, idx) in data.assessment.risks" :key="idx">
            <el-icon style="color:#E6A23C;"><WarningFilled /></el-icon>
            <span>{{ r }}</span>
          </div>
        </el-col>
      </el-row>

      <el-divider />
      <div class="conclusion-text">
        <h4>综合结论</h4>
        <p>{{ data.assessment.conclusion }}</p>
        <h4 style="margin-top:12px;">授信建议</h4>
        <p>{{ data.assessment.creditSuggestion }}</p>
      </div>
    </el-card>

    <!-- 底部签章 -->
    <div class="report-footer">
      <div class="footer-item">客户经理：________________</div>
      <div class="footer-item">支行行长：________________</div>
      <div class="footer-item">日期：________________</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true }
})
</script>

<style scoped>
.bank-report { padding: 8px; max-width: 100%; }
.report-header { text-align: center; padding: 20px; background: linear-gradient(135deg, #f0f5ff, #f6ffed); border-radius: 8px; margin-bottom: 16px; }
.report-header h2 { margin: 0 0 12px 0; font-size: 22px; color: #303133; }
.report-meta { display: flex; justify-content: center; gap: 24px; font-size: 13px; color: #909399; flex-wrap: wrap; }

.section-card { margin-bottom: 16px; }
.section-num { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #409EFF; color: #fff; border-radius: 50%; font-size: 14px; font-weight: bold; margin-right: 10px; flex-shrink: 0; }
.section-title { font-size: 16px; font-weight: bold; color: #303133; }

.sub-title { font-size: 14px; color: #303133; margin: 8px 0; padding-left: 8px; border-left: 3px solid #409EFF; }

.text-block { font-size: 13px; color: #606266; line-height: 1.8; padding: 8px 12px; background: #f5f7fa; border-radius: 6px; }

.risk-item { display: flex; align-items: center; gap: 6px; font-size: 13px; padding: 4px 0; }
.risk-label { color: #606266; }

.analysis-block { }
.analysis-block h5 { font-size: 13px; color: #303133; margin: 0 0 4px 0; }

.highlight-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; font-size: 13px; color: #606266; line-height: 1.6; }

.conclusion-card { background: #fafbfc; }
.conclusion-text h4 { font-size: 14px; color: #303133; margin: 0 0 6px 0; }
.conclusion-text p { font-size: 13px; color: #606266; line-height: 1.8; }

.report-footer { display: flex; justify-content: space-around; padding: 20px 0; margin-top: 20px; border-top: 1px solid #ebeef5; font-size: 13px; color: #606266; }
.footer-item { font-size: 13px; }
</style>
