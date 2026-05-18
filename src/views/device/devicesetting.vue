<template>
  <div>
    <div class="page-title">设备设置</div>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>屏幕模板配置</span></template>
          <el-table :data="templates" size="small" stripe>
            <el-table-column prop="name" label="模板名称" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{row}"><el-tag :type="row.status==='已启用'?'success':'info'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default>
                <el-button type="primary" link size="small">预览</el-button>
                <el-button type="warning" link size="small">编辑</el-button>
                <el-button type="success" link size="small">下发</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" style="margin-top:12px;" icon="Plus">新建模板</el-button>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="margin-bottom:16px;">
          <template #header><span>工作时间配置</span></template>
          <el-form label-width="120px">
            <el-form-item label="工作时段"><el-time-select v-model="workStart" :max-time="workEnd" placeholder="开始" style="width:140px;" /> 至 <el-time-select v-model="workEnd" :min-time="workStart" placeholder="结束" style="width:140px;" /></el-form-item>
            <el-form-item label="非工作时段"><el-tag type="info">自动停止录音</el-tag></el-form-item>
            <el-form-item label="适用范围"><el-radio-group v-model="scope"><el-radio label="all">全部设备</el-radio><el-radio label="selected">指定设备</el-radio></el-radio-group></el-form-item>
            <el-form-item><el-button type="primary">保存配置</el-button></el-form-item>
          </el-form>
        </el-card>
        <el-card shadow="hover">
          <template #header><span>录音上传时间配置</span></template>
          <el-form label-width="120px">
            <el-form-item label="上传频率"><el-select v-model="uploadFreq"><el-option label="实时上传" value="realtime" /><el-option label="每小时" value="hourly" /><el-option label="每日汇总" value="daily" /></el-select></el-form-item>
            <el-form-item label="上传时间窗"><el-time-select v-model="uploadStart" placeholder="开始" style="width:140px;" /> 至 <el-time-select v-model="uploadEnd" placeholder="结束" style="width:140px;" /></el-form-item>
            <el-form-item><el-button type="primary">保存配置</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const workStart = ref('09:00')
const workEnd = ref('18:00')
const scope = ref('all')
const uploadFreq = ref('realtime')
const uploadStart = ref('09:00')
const uploadEnd = ref('21:00')
const templates = ref([
  { name: '默认欢迎模板', type: '系统模板', status: '已启用' },
  { name: '金融行业模板', type: '行业模板', status: '已启用' },
  { name: '医疗行业模板', type: '行业模板', status: '未启用' }
])
</script>

<style scoped>
.page-title { font-size: 20px; font-weight: bold; color: #303133; margin-bottom: 16px; }
</style>
