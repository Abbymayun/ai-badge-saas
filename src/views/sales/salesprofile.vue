<template>
  <div>
    <div class="page-title">🏆 销售画像</div>
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-row :gutter="12">
        <el-col :span="4"><el-select v-model="filterIndustry" placeholder="行业筛选" clearable><el-option label="全部" value="" /><el-option label="银行" value="bank" /><el-option label="汽车" value="auto" /><el-option label="医疗" value="medical" /><el-option label="教育" value="edu" /><el-option label="地产" value="realestate" /><el-option label="保险" value="insurance" /></el-select></el-col>
        <el-col :span="4"><el-select v-model="filterDept" placeholder="部门" clearable><el-option v-for="d in depts" :key="d" :label="d" :value="d" /></el-select></el-col>
        <el-col :span="4"><el-select v-model="sortBy" placeholder="排序方式"><el-option label="综合评分" value="score" /><el-option label="成交数量" value="deals" /><el-option label="线索转化率" value="rate" /></el-select></el-col>
        <el-col :span="4"><el-input v-model="search" placeholder="搜索姓名" clearable /></el-col>
      </el-row>
    </el-card>
    <el-row :gutter="16">
      <el-col :span="24">
        <el-row :gutter="16">
          <el-col :span="6" v-for="s in salesProfiles" :key="s.name">
            <el-card shadow="hover" class="profile-card" style="margin-bottom:16px;">
              <div class="profile-header">
                <el-avatar :size="56" :style="{background: s.color}">{{ s.name[0] }}</el-avatar>
                <div class="profile-info">
                  <div class="profile-name">{{ s.name }} <el-tag v-if="s.gold" type="warning" size="small" style="margin-left:4px;">🏆 金牌</el-tag></div>
                  <div class="profile-dept">{{ s.dept }} · {{ s.industry }}</div>
                </div>
              </div>
              <div class="profile-score">
                <span class="score-num">{{ s.score }}</span>
                <span class="score-label">综合评分</span>
              </div>
              <div class="profile-tags">
                <el-tag size="small" type="" v-for="tag in s.tags" :key="tag" style="margin:2px;">{{ tag }}</el-tag>
              </div>
              <div class="profile-stats">
                <div class="ps-item"><span class="ps-val">{{ s.deals }}</span><span class="ps-lbl">成交客户</span></div>
                <div class="ps-item"><span class="ps-val">{{ s.rate }}%</span><span class="ps-lbl">转化率</span></div>
                <div class="ps-item"><span class="ps-val">{{ s.audioCount }}</span><span class="ps-lbl">听记数</span></div>
              </div>
              <el-button type="primary" style="width:100%;margin-top:12px;" size="small">查看画像详情</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const search = ref('')
const filterIndustry = ref('')
const filterDept = ref('')
const sortBy = ref('score')
const depts = ['华东区', '华南区', '华北区', '西南区']
const salesProfiles = ref([
  { name: '王志华', dept: '华东区', industry: '银行', score: 92, gold: true, color: '#409EFF', tags: ['顾问型', '银行专家', '高风险客户', '需求深挖'], deals: 45, rate: 32, audioCount: 186 },
  { name: '朱炫', dept: '华南区', industry: '汽车', score: 88, gold: true, color: '#67C23A', tags: ['专业型', '汽车专家', '产品演示', '试驾促成'], deals: 38, rate: 28, audioCount: 152 },
  { name: '李飞', dept: '华北区', industry: '保险', score: 85, gold: false, color: '#E6A23C', tags: ['亲和型', '保险顾问', '信任建立', '方案匹配'], deals: 32, rate: 25, audioCount: 128 },
  { name: '张锐', dept: '西南区', industry: '地产', score: 82, gold: false, color: '#F56C6C', tags: ['效率型', '地产专家', '预算匹配', '逼单促成'], deals: 28, rate: 22, audioCount: 96 }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
.profile-card { cursor: pointer; transition: transform 0.2s; }
.profile-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.profile-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.profile-name { font-size: 16px; font-weight: bold; display: flex; align-items: center; }
.profile-dept { font-size: 12px; color: #909399; }
.profile-score { text-align: center; margin: 12px 0; }
.score-num { font-size: 32px; font-weight: bold; color: #409EFF; }
.score-label { font-size: 12px; color: #909399; margin-left: 8px; }
.profile-tags { min-height: 30px; }
.profile-stats { display: flex; justify-content: space-around; margin-top: 12px; padding-top: 12px; border-top: 1px solid #ebeef5; }
.ps-item { text-align: center; }
.ps-val { font-size: 18px; font-weight: bold; color: #303133; display: block; }
.ps-lbl { font-size: 11px; color: #909399; }
</style>
