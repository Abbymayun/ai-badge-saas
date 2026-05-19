<template>
  <div class="template-manage">
    <div class="page-title">模板配置中心</div>

    <!-- 顶部统计 -->
    <el-row :gutter="16" style="margin-bottom:16px;">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
          <div class="stat-val">12</div>
          <div class="stat-lbl">全部模板</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card" :class="{ active: activeTab === 'scoring' }" @click="activeTab = 'scoring'">
          <div class="stat-val" style="color:#409EFF;">7</div>
          <div class="stat-lbl">📊 评分模板</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card" :class="{ active: activeTab === 'report' }" @click="activeTab = 'report'">
          <div class="stat-val" style="color:#67C23A;">3</div>
          <div class="stat-lbl">📝 报告模板</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card" :class="{ active: activeTab === 'summary' }" @click="activeTab = 'summary'">
          <div class="stat-val" style="color:#E6A23C;">2</div>
          <div class="stat-lbl">📋 综合分析模板</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12" align="middle">
        <el-col :span="4">
          <el-input v-model="search" placeholder="搜索模板名称" clearable prefix-icon="Search" @input="filterTemplates" />
        </el-col>
        <el-col :span="3">
          <el-select v-model="filterIndustry" placeholder="适用行业" clearable @change="filterTemplates">
            <el-option label="全部行业" value="" />
            <el-option v-for="i in industries" :key="i.value" :label="i.label" :value="i.value" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="filterScene" placeholder="使用场景" clearable @change="filterTemplates">
            <el-option label="全部场景" value="" />
            <el-option v-for="s in scenes" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="filterStatus" placeholder="启用状态" clearable @change="filterTemplates">
            <el-option label="全部" value="" />
            <el-option label="已启用" value="on" />
            <el-option label="已禁用" value="off" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="Plus" @click="openCreate">新建模板</el-button>
        </el-col>
        <el-col :span="3">
          <el-dropdown @command="handleBulkAction">
            <el-button>批量操作 <el-icon><ArrowDown /></el-icon></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="enable">批量启用</el-dropdown-item>
                <el-dropdown-item command="disable">批量禁用</el-dropdown-item>
                <el-dropdown-item command="export">导出配置</el-dropdown-item>
                <el-dropdown-item command="import">导入配置</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-card>

    <!-- 模板卡片列表 -->
    <el-row :gutter="16">
      <el-col :span="8" v-for="tpl in filteredTemplates" :key="tpl.id">
        <el-card shadow="hover" class="tpl-card" @click="openDetail(tpl)">
          <!-- 卡片头部 -->
          <div class="tpl-header">
            <div class="tpl-icon" :style="{ background: tpl.color }">{{ tpl.icon }}</div>
            <div class="tpl-title-area">
              <div class="tpl-name">{{ tpl.name }}</div>
              <div class="tpl-meta">
                <el-tag :type="tpl.templateType === 'scoring' ? '' : tpl.templateType === 'report' ? 'success' : 'warning'" size="small">
                  {{ tpl.templateType === 'scoring' ? '评分' : tpl.templateType === 'report' ? '报告' : '综合分析' }}
                </el-tag>
                <el-tag size="small" type="info" v-if="tpl.hasScore !== undefined">
                  {{ tpl.hasScore ? '含打分' : '不含打分' }}
                </el-tag>
              </div>
            </div>
            <el-switch v-model="tpl.enabled" size="small" @click.stop />
          </div>

          <!-- 模板描述 -->
          <div class="tpl-desc">{{ tpl.description }}</div>

          <!-- 行业/场景标签 -->
          <div class="tpl-tags">
            <el-tag v-for="ind in tpl.industries" :key="ind" size="small" effect="plain" type="warning" style="margin:2px;">{{ ind }}</el-tag>
          </div>
          <div class="tpl-tags" style="margin-top:4px;">
            <el-tag v-for="sc in tpl.scenes" :key="sc" size="small" effect="plain" style="margin:2px;">{{ sc }}</el-tag>
          </div>

          <!-- 配置摘要 -->
          <div class="tpl-config">
            <template v-if="tpl.templateType === 'scoring'">
              <div class="tpl-config-item">
                <el-icon><Grid /></el-icon>
                <span>{{ tpl.totalDims }}个维度 · 权重{{ tpl.totalWeight }}%</span>
              </div>
              <div class="tpl-config-item">
                <el-icon><Histogram /></el-icon>
                <span>评分区间 {{ tpl.scoreRange }}</span>
              </div>
            </template>
            <template v-else-if="tpl.templateType === 'report'">
              <div class="tpl-config-item">
                <el-icon><Document /></el-icon>
                <span>{{ tpl.sections?.length || 0 }}个报告章节</span>
              </div>
              <div class="tpl-config-item">
                <el-icon><EditPen /></el-icon>
                <span>AI自动生成</span>
              </div>
            </template>
            <template v-else>
              <div class="tpl-config-item">
                <el-icon><Grid /></el-icon>
                <span>{{ tpl.totalDims }}维评分 + {{ tpl.sections?.length || 0 }}章节报告</span>
              </div>
            </template>
          </div>

          <!-- 使用统计 -->
          <div class="tpl-stats">
            <div class="tps-item">
              <span class="tps-val">{{ tpl.enterpriseCount }}</span>
              <span class="tps-lbl">使用企业</span>
            </div>
            <div class="tps-item">
              <span class="tps-val">{{ tpl.useCount }}</span>
              <span class="tps-lbl">分析次数</span>
            </div>
            <div class="tps-item">
              <span class="tps-val">{{ tpl.avgScore || '-' }}</span>
              <span class="tps-lbl">{{ tpl.templateType === 'report' ? '生成报告' : '均分' }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="tpl-actions" @click.stop>
            <el-button type="primary" link size="small" @click="openDetail(tpl)">查看配置</el-button>
            <el-button type="success" link size="small" @click="cloneTemplate(tpl)">克隆</el-button>
            <el-button type="warning" link size="small" @click="previewTemplate(tpl)">预览效果</el-button>
            <el-popconfirm title="确定删除此模板？" @confirm="deleteTemplate(tpl.id)">
              <template #reference>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <div style="margin-top:16px;text-align:right;">
      <el-pagination :total="filteredTemplates.length" :page-size="9" layout="total, prev, pager, next" background />
    </div>

    <!-- ============ 创建/编辑模板弹窗 ============ -->
    <el-dialog v-model="showCreate" :title="editingId ? '编辑模板' : '新建模板'" width="900px" destroy-on-close top="3vh">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">

        <el-divider content-position="left">📋 基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="form.name" placeholder="如：银行客户拜访评分模板" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板类型" prop="templateType">
              <el-radio-group v-model="form.templateType" :disabled="!!editingId">
                <el-radio-button value="scoring">📊 评分模板</el-radio-button>
                <el-radio-button value="report">📝 报告模板</el-radio-button>
                <el-radio-button value="summary">📋 综合分析</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="模板描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="简要描述模板的用途和适用场景" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="适用行业" prop="industries">
              <el-select v-model="form.industries" multiple placeholder="选择适用行业" style="width:100%">
                <el-option v-for="i in industries" :key="i.value" :label="i.label" :value="i.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用场景" prop="scenes">
              <el-select v-model="form.scenes" multiple placeholder="选择使用场景" style="width:100%">
                <el-option v-for="s in scenes" :key="s.value" :label="s.label" :value="s.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- ============ 评分模板专用配置 ============ -->
        <template v-if="form.templateType === 'scoring' || form.templateType === 'summary'">
          <el-divider content-position="left">📊 评分维度配置</el-divider>
          <el-form-item label="是否包含打分">
            <el-switch v-model="form.hasScore" active-text="包含AI自动打分" inactive-text="仅做分析不打分" />
          </el-form-item>

          <template v-if="form.hasScore">
            <el-form-item label="评分区间" prop="scoreRange">
              <el-row :gutter="12" style="width:100%">
                <el-col :span="8"><el-input-number v-model="form.scoreMin" :min="0" :max="100" placeholder="最低分" /></el-col>
                <el-col :span="2" style="text-align:center;line-height:32px;">~</el-col>
                <el-col :span="8"><el-input-number v-model="form.scoreMax" :min="0" :max="100" placeholder="最高分" /></el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="评价维度">
              <div style="width:100%">
                <div v-for="(dim, idx) in form.dimensions" :key="idx" class="dim-row">
                  <!-- 父维度 -->
                  <el-row :gutter="8" align="middle" style="margin-bottom:6px;">
                    <el-col :span="10">
                      <el-input v-model="dim.name" placeholder="维度名称" size="small">
                        <template #prepend>{{ idx + 1 }}</template>
                      </el-input>
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="dim.weight" :min="1" :max="100" size="small" placeholder="权重" style="width:100%">
                        <template #suffix>%</template>
                      </el-input-number>
                    </el-col>
                    <el-col :span="5">
                      <el-input v-model="dim.desc" placeholder="评价说明" size="small" />
                    </el-col>
                    <el-col :span="4">
                      <el-button type="danger" link size="small" @click="removeDimension(idx)" :disabled="form.dimensions.length <= 1">删除</el-button>
                      <el-button type="primary" link size="small" @click="addSubDimension(idx)">+子维度</el-button>
                    </el-col>
                  </el-row>
                  <!-- 子维度 -->
                  <div v-for="(sub, sidx) in (dim.children || [])" :key="sidx" style="margin-left:32px;margin-bottom:4px;">
                    <el-row :gutter="8" align="middle">
                      <el-col :span="10">
                        <el-input v-model="sub.name" placeholder="子维度名称" size="small">
                          <template #prepend>{{ idx + 1 }}.{{ sidx + 1 }}</template>
                        </el-input>
                      </el-col>
                      <el-col :span="5">
                        <el-input-number v-model="sub.weight" :min="1" :max="100" size="small" placeholder="权重" style="width:100%">
                          <template #suffix>%</template>
                        </el-input-number>
                      </el-col>
                      <el-col :span="5">
                        <el-select v-model="sub.scoreRules" multiple placeholder="评价规则" size="small" style="width:100%">
                          <el-option label="关键词匹配" value="keyword" />
                          <el-option label="语义分析" value="semantic" />
                          <el-option label="AI综合判断" value="ai" />
                        </el-select>
                      </el-col>
                      <el-col :span="4">
                        <el-button type="danger" link size="small" @click="dim.children.splice(sidx, 1)">删除</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <el-button type="primary" link icon="Plus" @click="addDimension" style="margin-top:8px;">添加一级维度</el-button>
              </div>
            </el-form-item>

            <el-form-item label="综合评价逻辑">
              <el-input v-model="form.scoringLogic" type="textarea" :rows="2" placeholder="如：加权求和。各维度得分 = 子维度加权平均，综合得分 = 一级维度加权求和" />
            </el-form-item>
          </template>
        </template>

        <!-- ============ 报告模板专用配置 ============ -->
        <template v-if="form.templateType === 'report' || form.templateType === 'summary'">
          <el-divider content-position="left">📝 报告结构配置</el-divider>
          <el-form-item label="报告章节">
            <div style="width:100%">
              <div v-for="(sec, idx) in form.sections" :key="idx" class="section-row">
                <el-row :gutter="8" align="middle" style="margin-bottom:8px;">
                  <el-col :span="1">
                    <el-icon :size="20"><component :is="sec.icon || 'Document'" /></el-icon>
                  </el-col>
                  <el-col :span="5">
                    <el-input v-model="sec.title" placeholder="章节标题" size="small">
                      <template #prepend>{{ idx + 1 }}</template>
                    </el-input>
                  </el-col>
                  <el-col :span="5">
                    <el-select v-model="sec.type" placeholder="章节类型" size="small" style="width:100%">
                      <el-option label="📋 概要总结" value="summary" />
                      <el-option label="👤 客户画像" value="profile" />
                      <el-option label="💡 需求分析" value="needs" />
                      <el-option label="📊 数据统计" value="stats" />
                      <el-option label="📝 行动建议" value="suggestions" />
                      <el-option label="🏆 话术提取" value="scripts" />
                      <el-option label="📄 自定义" value="custom" />
                    </el-select>
                  </el-col>
                  <el-col :span="9">
                    <el-input v-model="sec.prompt" placeholder="AI生成该章节的提示词" size="small" />
                  </el-col>
                  <el-col :span="4">
                    <el-button type="danger" link size="small" @click="form.sections.splice(idx, 1)" :disabled="form.sections.length <= 1">删除</el-button>
                    <el-button type="primary" link size="small" @click="form.sections.splice(idx+1, 0, {title:'',type:'custom',prompt:'',icon:'Document'})">↓插入</el-button>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top:8px;display:flex;gap:8px;">
                <el-button type="primary" link icon="Plus" @click="addSection">添加章节</el-button>
                <el-button link @click="loadPresetSections('visit')">📋 拜访报告预设</el-button>
                <el-button link @click="loadPresetSections('meeting')">📝 会议总结预设</el-button>
                <el-button link @click="loadPresetSections('sales')">🏆 销售复盘预设</el-button>
              </div>
            </div>
          </el-form-item>
        </template>

        <el-divider content-position="left">🤖 AI生成配置</el-divider>
        <el-form-item label="AI分析提示词">
          <el-input v-model="form.aiPrompt" type="textarea" :rows="4" placeholder="输入AI分析的系统提示词，指导AI如何分析对话内容..." />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="适用企业">
              <el-select v-model="form.enterprises" multiple placeholder="留空表示全部企业可用" style="width:100%" filterable>
                <el-option label="利尔达集团" value="lierda" />
                <el-option label="杭州智联金融科技" value="hz-test" />
                <el-option label="上海瑞驰汽车服务" value="sh-test" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认启用">
              <el-switch v-model="form.defaultEnabled" active-text="新建企业自动启用" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">{{ editingId ? '保存修改' : '创建模板' }}</el-button>
      </template>
    </el-dialog>

    <!-- ============ 模板详情抽屉 ============ -->
    <el-drawer v-model="showDetail" :title="detailTpl?.name" size="650px" destroy-on-close>
      <template v-if="detailTpl">
        <el-descriptions :column="1" border style="margin-bottom:16px;">
          <el-descriptions-item label="模板类型">
            <el-tag :type="detailTpl.templateType === 'scoring' ? '' : detailTpl.templateType === 'report' ? 'success' : 'warning'" size="small">
              {{ detailTpl.templateType === 'scoring' ? '📊 评分模板' : detailTpl.templateType === 'report' ? '📝 报告模板' : '📋 综合分析模板' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="适用行业">{{ detailTpl.industries.join(' · ') }}</el-descriptions-item>
          <el-descriptions-item label="使用场景">{{ detailTpl.scenes.join(' · ') }}</el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-switch v-model="detailTpl.enabled" size="small" />
          </el-descriptions-item>
          <el-descriptions-item label="描述">{{ detailTpl.description }}</el-descriptions-item>
          <el-descriptions-item label="使用统计">{{ detailTpl.enterpriseCount }}企业 · {{ detailTpl.useCount }}次分析 · 均分{{ detailTpl.avgScore || 'N/A' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>维度配置</el-divider>
        <div v-if="detailTpl.dimensionConfig?.length">
          <el-tree :data="detailTpl.dimensionConfig" :props="{label:'name',children:'children'}" node-key="id" default-expand-all>
            <template #default="{node,data}">
              <span>{{ node.label }}</span>
              <el-tag v-if="data.weight" size="small" type="warning" style="margin-left:8px;">权重 {{ data.weight }}%</el-tag>
              <el-tag v-if="data.desc" size="small" type="info" style="margin-left:4px;">{{ data.desc }}</el-tag>
            </template>
          </el-tree>
        </div>
        <el-empty v-else description="该模板不含评分维度" :image-size="60" />

        <el-divider>报告结构</el-divider>
        <div v-if="detailTpl.sections?.length">
          <el-timeline>
            <el-timeline-item v-for="(sec, idx) in detailTpl.sections" :key="idx" :timestamp="'章节 ' + (idx+1)" placement="top" :icon="sec.icon">
              <el-card shadow="never" size="small">
                <div style="font-weight:bold;">{{ sec.title }}</div>
                <div style="font-size:12px;color:#909399;margin-top:4px;">类型: {{ sec.type }} | AI提示: {{ sec.prompt }}</div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <el-empty v-else description="该模板不含报告章节" :image-size="60" />

        <el-divider>AI提示词</el-divider>
        <el-alert :title="detailTpl.aiPrompt || '未配置AI提示词'" type="info" :closable="false" />

        <div style="margin-top:20px;text-align:right;">
          <el-button type="primary" @click="openEdit(detailTpl)">编辑模板</el-button>
          <el-button type="success" @click="cloneTemplate(detailTpl)">克隆模板</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- ============ 预览效果弹窗 ============ -->
    <el-dialog v-model="showPreview" :title="'预览效果 - ' + (previewTpl?.name || '')" width="95%" top="2vh" destroy-on-close>
      <div v-if="previewData" class="preview-container">
        <!-- 评分模板 → 仅显示销售能力总结 -->
        <SalesReport v-if="isScoringPreview" :data="previewData.sales" :template="previewTpl" class="preview-focused" />
        <!-- 银行报告模板 → 银行拜访报告 -->
        <BankVisitReport v-else-if="isBankPreview" :data="previewData.bankVisit" />
        <!-- 会议/医疗/教育/地产/零售/保险/营业厅 → 场景专属报告 -->
        <ScenarioReport v-else-if="previewData.scenario && previewData.scenario !== 'generic'" :data="previewData" :scenario="previewData.scenario" />
        <!-- 综合分析模板 → 多Tab -->
        <template v-else>
          <el-tabs v-model="previewTab" type="border-card">
            <el-tab-pane :name="previewDefaultTab">
              <template #label><span>{{ previewDefaultLabel }}</span></template>
              <CustomerReport v-if="!isBankPreview" :data="previewData.customer" :template="previewTpl" />
            </el-tab-pane>
            <el-tab-pane name="sales" v-if="previewTpl?.templateType === 'summary'">
              <template #label><span>📊 销售能力</span></template>
              <SalesReport :data="previewData.sales" :template="previewTpl" />
            </el-tab-pane>
            <el-tab-pane name="product" v-if="previewTpl?.templateType === 'summary'">
              <template #label><span>⭐ 产品力</span></template>
              <ProductReport :data="previewData.product" :template="previewTpl" />
            </el-tab-pane>
            <el-tab-pane name="comprehensive" v-if="previewTpl?.templateType === 'summary'">
              <template #label><span>📋 综合分析</span></template>
              <ComprehensiveReport :data="previewData.comprehensive" :template="previewTpl" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SalesReport from './reports/SalesReport.vue'
import CustomerReport from './reports/CustomerReport.vue'
import ProductReport from './reports/ProductReport.vue'
import ComprehensiveReport from './reports/ComprehensiveReport.vue'
import BankVisitReport from './reports/BankVisitReport.vue'
import ScenarioReport from './reports/ScenarioReport.vue'
import { generatePreviewData } from './reportData.js'
import { getScenarioPreviewData } from './scenarioData.js'

// ============ 筛选状态 ============
const search = ref('')
const filterIndustry = ref('')
const filterScene = ref('')
const filterStatus = ref('')
const activeTab = ref('all')

const industries = [
  { value: 'bank', label: '🏦 银行金融' },
  { value: 'auto', label: '🚗 汽车销售' },
  { value: 'medical', label: '🏥 医疗健康' },
  { value: 'education', label: '📚 教育培训' },
  { value: 'realestate', label: '🏠 房地产' },
  { value: 'retail', label: '🛒 零售消费' },
  { value: 'insurance', label: '🛡️ 保险' }
]

const scenes = [
  { value: 'visit', label: '客户拜访' },
  { value: 'meeting', label: '会议总结' },
  { value: 'follow', label: '售后跟进' },
  { value: 'demo', label: '产品演示' },
  { value: 'negotiate', label: '商务谈判' },
  { value: 'survey', label: '需求调研' },
  { value: 'train', label: '培训演练' }
]

// ============ 模板数据 ============
const templateList = ref([
  {
    id: 1, name: '销售能力综合评分', icon: '📊', color: '#ecf5ff',
    templateType: 'scoring', hasScore: true,
    description: '企业销售能力评估的核心模板，覆盖需求挖掘、产品介绍、专业术语、服务态度、逼单技巧五大维度',
    industries: ['银行金融', '汽车销售', '保险'], scenes: ['客户拜访', '产品演示'],
    totalDims: 5, totalWeight: 100, scoreRange: '60-100',
    enterpriseCount: 8, useCount: 1256, avgScore: '76分',
    enabled: true,
    dimensionConfig: [
      { id: 1, name: '需求挖掘', weight: 25, desc: '客户需求识别深度', children: [
        { name: '开放式提问', weight: 10 }, { name: '痛点识别', weight: 8 }, { name: '需求确认', weight: 7 }
      ]},
      { id: 2, name: '产品介绍', weight: 25, desc: '产品亮点传达质量', children: [
        { name: '核心卖点覆盖', weight: 10 }, { name: '竞品对比', weight: 8 }, { name: '场景化描述', weight: 7 }
      ]},
      { id: 3, name: '专业术语', weight: 20, desc: '行业知识掌握程度' },
      { id: 4, name: '服务态度', weight: 15, desc: '沟通礼仪与客户关怀' },
      { id: 5, name: '逼单技巧', weight: 15, desc: '促成决策的沟通策略' }
    ],
    sections: [],
    aiPrompt: '你是一位资深销售培训专家。请根据对话内容对销售人员进行综合评分...'
  },
  {
    id: 2, name: '银行客户拜访报告', icon: '🏦', color: '#fdf6ec',
    templateType: 'report', hasScore: false,
    description: '银行业专属拜访报告模板，AI自动生成结构化拜访报告，不含评分功能，专注内容提炼与行动建议',
    industries: ['银行金融'], scenes: ['客户拜访'],
    totalDims: 0, totalWeight: 0, scoreRange: '-',
    enterpriseCount: 5, useCount: 832, avgScore: '-',
    enabled: true,
    dimensionConfig: [],
    sections: [
      { title: '拜访概况', type: 'summary', prompt: '总结拜访时间、地点、参与人员、拜访目的', icon: 'Document' },
      { title: '客户画像分析', type: 'profile', prompt: '分析客户基本信息、资产规模、理财偏好、风险承受能力', icon: 'User' },
      { title: '需求洞察', type: 'needs', prompt: '识别客户已表达需求和潜在需求，分析竞品渗透情况', icon: 'Search' },
      { title: '产品推荐', type: 'suggestions', prompt: '根据客户需求推荐匹配的金融产品方案', icon: 'Goods' },
      { title: '下一步行动建议', type: 'suggestions', prompt: '给出具体的跟进时间、方式和沟通策略', icon: 'Connection' }
    ],
    aiPrompt: '你是一位资深银行客户经理顾问。请根据拜访录音生成专业、结构化的拜访报告。注意银行合规要求...'
  },
  {
    id: 3, name: '客户购买力打分', icon: '💰', color: '#ecf5ff',
    templateType: 'scoring', hasScore: true,
    description: '评估客户购买意向和支付能力的评分模板，从预算、决策权、紧迫度、需求匹配四个维度进行评估',
    industries: ['银行金融', '汽车销售', '房地产', '保险'], scenes: ['客户拜访', '需求调研'],
    totalDims: 4, totalWeight: 100, scoreRange: '50-100',
    enterpriseCount: 10, useCount: 2100, avgScore: '72分',
    enabled: true,
    dimensionConfig: [
      { id: 1, name: '预算匹配度', weight: 30 },
      { id: 2, name: '决策权评估', weight: 25 },
      { id: 3, name: '紧迫程度', weight: 25 },
      { id: 4, name: '需求匹配度', weight: 20 }
    ],
    sections: [],
    aiPrompt: '分析客户在对话中表现出的购买意向强度，从预算、决策权、紧迫度、需求匹配四个维度打分...'
  },
  {
    id: 4, name: '会议总结模板', icon: '📝', color: '#f0f9eb',
    templateType: 'report', hasScore: false,
    description: '通用会议总结模板，适用于销售周会、客户评审会、项目复盘会等场景，AI自动提炼会议要点和待办事项',
    industries: ['银行金融', '汽车销售', '医疗健康', '教育培训', '房地产'], scenes: ['会议总结'],
    totalDims: 0, totalWeight: 0, scoreRange: '-',
    enterpriseCount: 7, useCount: 560, avgScore: '-',
    enabled: true,
    dimensionConfig: [],
    sections: [
      { title: '会议概要', type: 'summary', prompt: '总结会议主题、时间、参与人员、核心议题', icon: 'Document' },
      { title: '讨论要点', type: 'custom', prompt: '按议题梳理讨论内容和各方观点', icon: 'ChatDotRound' },
      { title: '决策事项', type: 'custom', prompt: '汇总会议中形成的决策和结论', icon: 'Check' },
      { title: '待办事项', type: 'suggestions', prompt: '列出待办任务、责任人和截止时间', icon: 'Tickets' }
    ],
    aiPrompt: '你是一位专业的会议记录助手。请根据会议录音生成结构化的会议总结...'
  },
  {
    id: 5, name: '汽车销售综合评估', icon: '🚗', color: '#fdf6ec',
    templateType: 'summary', hasScore: true,
    description: '汽车行业专属综合分析模板，包含试驾能力评分+客户需求分析报告，评分与报告同时产出',
    industries: ['汽车销售'], scenes: ['客户拜访', '产品演示'],
    totalDims: 4, totalWeight: 100, scoreRange: '60-100',
    enterpriseCount: 3, useCount: 420, avgScore: '82分',
    enabled: true,
    dimensionConfig: [
      { id: 1, name: '车型推荐能力', weight: 30 },
      { id: 2, name: '试驾引导技巧', weight: 25 },
      { id: 3, name: '竞品对比能力', weight: 25 },
      { id: 4, name: '价格谈判能力', weight: 20 }
    ],
    sections: [
      { title: '试驾概况', type: 'summary', prompt: '总结试驾车型、路线、时长', icon: 'Document' },
      { title: '客户需求分析', type: 'needs', prompt: '分析客户用车需求、预算、决策因素', icon: 'Search' },
      { title: '竞品对比', type: 'custom', prompt: '对比客户提到的竞品车型优劣势', icon: 'Switch' }
    ],
    aiPrompt: '你是一位汽车销售培训专家。请综合分析试驾过程中的销售表现和客户需求...'
  },
  {
    id: 6, name: '销售复盘模板', icon: '🏆', color: '#fef0f0',
    templateType: 'report', hasScore: false,
    description: '销售过程复盘模板，帮助销售人员自我提升。聚焦对话亮点、改进空间和话术提炼',
    industries: ['银行金融', '汽车销售', '保险', '房地产'], scenes: ['客户拜访', '商务谈判'],
    totalDims: 0, totalWeight: 0, scoreRange: '-',
    enterpriseCount: 4, useCount: 680, avgScore: '-',
    enabled: false,
    dimensionConfig: [],
    sections: [
      { title: '对话流程梳理', type: 'summary', prompt: '按时间线梳理对话阶段和转折点', icon: 'Document' },
      { title: '亮点分析', type: 'custom', prompt: '提炼本次对话中的优秀表现和关键时刻', icon: 'Star' },
      { title: '改进空间', type: 'custom', prompt: '分析可优化的沟通环节和话术', icon: 'Warning' },
      { title: '话术沉淀', type: 'scripts', prompt: '提取可复用的优质话术片段', icon: 'ChatLineSquare' },
      { title: '下次策略建议', type: 'suggestions', prompt: '给出针对该客户的下次沟通策略', icon: 'Connection' }
    ],
    aiPrompt: '你是一位销售教练。请对销售对话进行复盘分析，聚焦可改进的环节和可沉淀的经验...'
  },
  {
    id: 7, name: '产品力打分', icon: '⭐', color: '#ecf5ff',
    templateType: 'scoring', hasScore: true,
    description: '评估销售人员在对话中对产品知识的掌握和传达能力',
    industries: ['银行金融', '汽车销售', '医疗健康', '教育培训'], scenes: ['产品演示', '客户拜访'],
    totalDims: 4, totalWeight: 100, scoreRange: '40-100',
    enterpriseCount: 6, useCount: 890, avgScore: '68分',
    enabled: true,
    dimensionConfig: [],
    sections: [],
    aiPrompt: '评估销售对话中产品介绍的专业度...'
  },
  {
    id: 8, name: '医疗合规沟通检查', icon: '🏥', color: '#fdf6ec',
    templateType: 'report', hasScore: false,
    description: '医疗行业专属合规检查模板，检查学术推广中的合规用语、不良反应告知等',
    industries: ['医疗健康'], scenes: ['客户拜访'],
    totalDims: 0, totalWeight: 0, scoreRange: '-',
    enterpriseCount: 2, useCount: 156, avgScore: '-',
    enabled: true,
    dimensionConfig: [],
    sections: [
      { title: '沟通概况', type: 'summary', prompt: '总结沟通场景和沟通对象', icon: 'Document' },
      { title: '合规检查', type: 'custom', prompt: '检查合规用语、不良反应告知、超适应症表述', icon: 'Warning' },
      { title: '专业性评估', type: 'custom', prompt: '评估医学知识的准确性和专业性', icon: 'Star' },
      { title: '改进建议', type: 'suggestions', prompt: '给出合规沟通的改进建议', icon: 'Connection' }
    ],
    aiPrompt: '你是一位医疗合规专家。请检查学术推广对话中的合规表现...'
  },
  { id: 9, name: '保险需求分析模板', icon: '🛡️', color: '#ecf5ff', templateType: 'scoring', hasScore: true, description: '保险行业专属评分模板', industries: ['保险'], scenes: ['需求调研'], totalDims: 3, totalWeight: 100, scoreRange: '50-100', enterpriseCount: 1, useCount: 88, avgScore: '74分', enabled: false, dimensionConfig: [], sections: [], aiPrompt: '分析保险销售对话...' },
  { id: 10, name: '教育课程推荐分析', icon: '📚', color: '#f0f9eb', templateType: 'report', hasScore: false, description: '教育行业课程推荐分析报告', industries: ['教育培训'], scenes: ['需求调研', '客户拜访'], totalDims: 0, totalWeight: 0, scoreRange: '-', enterpriseCount: 1, useCount: 45, avgScore: '-', enabled: true, dimensionConfig: [], sections: [], aiPrompt: '分析家长需求并推荐课程...' },
  { id: 11, name: '地产看房跟进分析', icon: '🏠', color: '#fdf6ec', templateType: 'summary', hasScore: true, description: '地产行业看房跟进的评分+报告模板', industries: ['房地产'], scenes: ['客户拜访'], totalDims: 3, totalWeight: 100, scoreRange: '55-100', enterpriseCount: 1, useCount: 32, avgScore: '78分', enabled: true, dimensionConfig: [], sections: [], aiPrompt: '分析看房跟进对话...' },
  { id: 12, name: '零售客户画像模板', icon: '🛒', color: '#fef0f0', templateType: 'report', hasScore: false, description: '零售行业客户画像和购买倾向分析', industries: ['零售消费'], scenes: ['客户拜访'], totalDims: 0, totalWeight: 0, scoreRange: '-', enterpriseCount: 0, useCount: 0, avgScore: '-', enabled: false, dimensionConfig: [], sections: [], aiPrompt: '分析零售客户画像...' }
])

// ============ 计算属性：筛选后的模板 ============
const filteredTemplates = computed(() => {
  let list = templateList.value

  // Tab 筛选
  if (activeTab.value === 'scoring') list = list.filter(t => t.templateType === 'scoring')
  else if (activeTab.value === 'report') list = list.filter(t => t.templateType === 'report')
  else if (activeTab.value === 'summary') list = list.filter(t => t.templateType === 'summary')

  // 搜索
  if (search.value) {
    const kw = search.value.toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw))
  }

  // 行业
  if (filterIndustry.value) {
    list = list.filter(t => t.industries.some(i => i.includes(filterIndustry.value.replace('bank','银行').replace('auto','汽车').replace('medical','医疗').replace('education','教育').replace('realestate','地产').replace('retail','零售').replace('insurance','保险')) || filterIndustry.value === ''))
  }

  // 场景
  if (filterScene.value) {
    const sm = { visit:'客户拜访', meeting:'会议总结', follow:'售后跟进', demo:'产品演示', negotiate:'商务谈判', survey:'需求调研', train:'培训演练' }
    list = list.filter(t => t.scenes.includes(sm[filterScene.value] || ''))
  }

  // 状态
  if (filterStatus.value === 'on') list = list.filter(t => t.enabled)
  else if (filterStatus.value === 'off') list = list.filter(t => !t.enabled)

  return list
})

// ============ 创建/编辑表单 ============
const showCreate = ref(false)
const editingId = ref(null)
const saving = ref(false)
const formRef = ref(null)

const defaultForm = () => ({
  name: '', templateType: 'scoring', description: '',
  industries: [], scenes: [],
  hasScore: true, scoreMin: 0, scoreMax: 100,
  dimensions: [{ name: '', weight: 25, desc: '', children: [] }],
  scoringLogic: '加权求和',
  sections: [{ title: '', type: 'summary', prompt: '', icon: 'Document' }],
  aiPrompt: '', enterprises: [], defaultEnabled: true
})

const form = reactive(defaultForm())

const rules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  templateType: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
  industries: [{ required: true, message: '请选择适用行业', trigger: 'change' }],
  scenes: [{ required: true, message: '请选择使用场景', trigger: 'change' }]
}

// ============ 详情抽屉 ============
const showDetail = ref(false)
const detailTpl = ref(null)

// ============ 操作函数 ============
const openCreate = () => {
  editingId.value = null
  Object.assign(form, defaultForm())
  showCreate.value = true
}

const openEdit = (tpl) => {
  showDetail.value = false
  editingId.value = tpl.id
  Object.assign(form, {
    name: tpl.name, templateType: tpl.templateType, description: tpl.description,
    industries: [...tpl.industries], scenes: [...tpl.scenes],
    hasScore: tpl.hasScore !== false, scoreMin: 0, scoreMax: 100,
    dimensions: tpl.dimensionConfig?.length ? tpl.dimensionConfig.map(d => ({ name: d.name, weight: d.weight, desc: d.desc || '', children: (d.children || []).map(c => ({ name: c.name, weight: c.weight, scoreRules: [] })) })) : [{ name: '', weight: 25, desc: '', children: [] }],
    scoringLogic: '加权求和',
    sections: tpl.sections?.length ? [...tpl.sections] : [{ title: '', type: 'summary', prompt: '', icon: 'Document' }],
    aiPrompt: tpl.aiPrompt || '', enterprises: [], defaultEnabled: tpl.enabled
  })
  showCreate.value = true
}

const openDetail = (tpl) => {
  detailTpl.value = tpl
  showDetail.value = true
}

const cloneTemplate = (tpl) => {
  const newTpl = JSON.parse(JSON.stringify(tpl))
  newTpl.id = Date.now()
  newTpl.name = tpl.name + ' - 副本'
  templateList.value.unshift(newTpl)
  ElMessage.success('模板已克隆')
}

const deleteTemplate = (id) => {
  templateList.value = templateList.value.filter(t => t.id !== id)
  ElMessage.success('模板已删除')
}

const showPreview = ref(false)
const previewTpl = ref(null)
const previewData = ref(null)
const previewTab = ref('sales')

const previewTemplate = (tpl) => {
  previewTpl.value = tpl
  const industries = tpl.industries || []
  // 使用场景数据生成器
  previewData.value = getScenarioPreviewData(tpl.name, tpl.templateType, industries)
  // 根据模板类型自动聚焦
  if (tpl.templateType === 'scoring') previewTab.value = 'sales'
  else if (industries.some(i => i.includes('银行'))) previewTab.value = 'bank'
  else previewTab.value = 'customer'
  showPreview.value = true
}

const isBankPreview = computed(() => previewTpl.value?.industries?.some(i => i.includes('银行')))
const isScoringPreview = computed(() => previewTpl.value?.templateType === 'scoring')
const previewDefaultTab = computed(() => isScoringPreview.value ? 'sales' : 'customer')
const previewDefaultLabel = computed(() => {
  if (isScoringPreview.value) return '📊 销售能力总结'
  if (isBankPreview.value) return '🏦 银行拜访报告'
  return '👤 客户分析总结'
})

const handleBulkAction = (cmd) => {
  if (cmd === 'enable') ElMessage.success('已批量启用选中模板')
  else if (cmd === 'disable') ElMessage.success('已批量禁用选中模板')
  else if (cmd === 'export') ElMessage.success('模板配置已导出')
  else if (cmd === 'import') ElMessage.info('请选择导入的配置文件')
}

// 维度操作
const addDimension = () => form.dimensions.push({ name: '', weight: 10, desc: '', children: [] })
const removeDimension = (idx) => form.dimensions.splice(idx, 1)
const addSubDimension = (idx) => {
  if (!form.dimensions[idx].children) form.dimensions[idx].children = []
  form.dimensions[idx].children.push({ name: '', weight: 5, scoreRules: [] })
}

// 章节操作
const addSection = () => form.sections.push({ title: '', type: 'custom', prompt: '', icon: 'Document' })

const loadPresetSections = (type) => {
  const presets = {
    visit: [
      { title: '拜访概况', type: 'summary', prompt: '总结拜访时间、地点、对象、目的', icon: 'Document' },
      { title: '客户画像', type: 'profile', prompt: '分析客户基本信息和特征', icon: 'User' },
      { title: '需求洞察', type: 'needs', prompt: '识别客户需求和痛点', icon: 'Search' },
      { title: '沟通亮点', type: 'custom', prompt: '提炼优秀沟通表现', icon: 'Star' },
      { title: '行动建议', type: 'suggestions', prompt: '给出下次跟进建议', icon: 'Connection' }
    ],
    meeting: [
      { title: '会议概要', type: 'summary', prompt: '总结会议主题、参与人、时长', icon: 'Document' },
      { title: '议题讨论', type: 'custom', prompt: '梳理各议题讨论内容', icon: 'ChatDotRound' },
      { title: '决策事项', type: 'custom', prompt: '汇总会议决策', icon: 'Check' },
      { title: '待办事项', type: 'suggestions', prompt: '列出任务和责任人', icon: 'Tickets' }
    ],
    sales: [
      { title: '对话流程', type: 'summary', prompt: '梳理对话阶段和关键转折', icon: 'Document' },
      { title: '优秀表现', type: 'custom', prompt: '提炼销售亮点', icon: 'Star' },
      { title: '改进建议', type: 'custom', prompt: '分析可优化环节', icon: 'Warning' },
      { title: '话术沉淀', type: 'scripts', prompt: '提取优质话术', icon: 'ChatLineSquare' },
      { title: '策略建议', type: 'suggestions', prompt: '下次沟通策略', icon: 'Connection' }
    ]
  }
  form.sections = presets[type] || []
  ElMessage.success(`已加载${type === 'visit' ? '拜访报告' : type === 'meeting' ? '会议总结' : '销售复盘'}预设章节`)
}

const handleSave = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    saving.value = true
    setTimeout(() => {
      saving.value = false
      if (editingId.value) {
        const idx = templateList.value.findIndex(t => t.id === editingId.value)
        if (idx >= 0) {
          const tpl = templateList.value[idx]
          tpl.name = form.name
          tpl.description = form.description
          tpl.industries = [...form.industries]
          tpl.scenes = [...form.scenes]
          tpl.templateType = form.templateType
          tpl.enabled = form.defaultEnabled
          tpl.hasScore = form.hasScore
          tpl.aiPrompt = form.aiPrompt
          tpl.dimensionConfig = form.dimensions.map(d => ({ name: d.name, weight: d.weight, desc: d.desc, children: d.children }))
          tpl.sections = [...form.sections]
          tpl.totalDims = form.dimensions.length
          tpl.totalWeight = form.dimensions.reduce((s, d) => s + d.weight, 0)
        }
        ElMessage.success('模板已更新')
      } else {
        templateList.value.unshift({
          id: Date.now(),
          name: form.name, icon: '📋', color: '#f5f7fa',
          templateType: form.templateType, hasScore: form.hasScore,
          description: form.description,
          industries: [...form.industries], scenes: [...form.scenes],
          totalDims: form.dimensions.length,
          totalWeight: form.dimensions.reduce((s, d) => s + d.weight, 0),
          scoreRange: `${form.scoreMin}-${form.scoreMax}`,
          enterpriseCount: 0, useCount: 0, avgScore: '-',
          enabled: form.defaultEnabled,
          dimensionConfig: form.dimensions.map(d => ({ name: d.name, weight: d.weight, desc: d.desc, children: d.children })),
          sections: [...form.sections],
          aiPrompt: form.aiPrompt
        })
        ElMessage.success('模板创建成功')
      }
      showCreate.value = false
    }, 800)
  })
}

const filterTemplates = () => {} // trigger computed refresh
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }

.stat-card { cursor: pointer; text-align: center; padding: 8px 0; border: 2px solid transparent; transition: all 0.2s; }
.stat-card:hover { border-color: #409EFF; }
.stat-card.active { border-color: #409EFF; background: #ecf5ff; }
.stat-val { font-size: 28px; font-weight: bold; color: #303133; }
.stat-lbl { font-size: 13px; color: #909399; margin-top: 4px; }

.tpl-card { cursor: pointer; transition: all 0.2s; margin-bottom: 16px; }
.tpl-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }

.tpl-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
.tpl-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.tpl-title-area { flex: 1; min-width: 0; }
.tpl-name { font-size: 15px; font-weight: bold; color: #303133; margin-bottom: 4px; }
.tpl-meta { display: flex; gap: 4px; }

.tpl-desc { font-size: 13px; color: #606266; line-height: 1.6; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.tpl-tags { min-height: 22px; }

.tpl-config { background: #f5f7fa; border-radius: 8px; padding: 8px 12px; margin: 10px 0; }
.tpl-config-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #606266; margin: 3px 0; }

.tpl-stats { display: flex; justify-content: space-around; padding: 10px 0; border-top: 1px solid #ebeef5; border-bottom: 1px solid #ebeef5; margin: 10px 0; }
.tps-item { text-align: center; }
.tps-val { font-size: 16px; font-weight: bold; color: #409EFF; display: block; }
.tps-lbl { font-size: 11px; color: #909399; }

.tpl-actions { display: flex; justify-content: center; gap: 8px; margin-top: 8px; }

.dim-row { background: #fafafa; border-radius: 8px; padding: 10px; margin-bottom: 8px; }
.section-row { background: #fafafa; border-radius: 8px; padding: 10px; margin-bottom: 4px; }
</style>
