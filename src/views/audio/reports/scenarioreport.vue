<template>
  <div class="scenario-report">
    <!-- ================================================================ -->
    <!-- 会议总结（全新设计-钉钉风格） -->
    <!-- ================================================================ -->
    <template v-if="scenario === 'meeting'">
      <MeetingView :data="data.scenarioData" />
    </template>

    <!-- 汽车销售 -->
    <template v-else-if="scenario === 'auto'"><AutoView :data="data" /></template>
    <!-- 产品力 -->
    <template v-else-if="scenario === 'product'"><ProductSceneView :data="data" /></template>
    <!-- 医疗 -->
    <template v-else-if="scenario === 'medical'"><MedicalView :data="data" /></template>
    <!-- 教育 -->
    <template v-else-if="scenario === 'education'"><EduView :data="data" /></template>
    <!-- 地产 -->
    <template v-else-if="scenario === 'realestate'"><EstateView :data="data" /></template>
    <!-- 零售 -->
    <template v-else-if="scenario === 'retail'"><RetailView :data="data" /></template>
    <!-- 保险 -->
    <template v-else-if="scenario === 'insurance'"><InsuranceView :data="data" /></template>
    <!-- 营业厅 -->
    <template v-else-if="scenario === 'serviceHall'"><ServiceView :data="data" /></template>
    <!-- 默认 -->
    <template v-else><SalesReport :data="data.sales" :template="{ hasScore: true }" /></template>
  </div>
</template>

<script setup>
import SalesReport from './SalesReport.vue'
import MeetingView from './MeetingView.vue'
import AutoView from './AutoView.vue'
import ProductSceneView from './ProductSceneView.vue'
import MedicalView from './MedicalView.vue'
import EduView from './EduView.vue'
import EstateView from './EstateView.vue'
import RetailView from './RetailView.vue'
import InsuranceView from './InsuranceView.vue'
import ServiceView from './ServiceView.vue'

defineProps({ data: Object, scenario: { type: String, default: 'generic' }})
</script>

<style scoped>
.scenario-report { }
</style>
