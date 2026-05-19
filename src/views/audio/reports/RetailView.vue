<template><div class="RetailView-stub"><SalesReport :data="data.sales" :template="{hasScore:true}" /></div></template>
<script setup>
import SalesReport from './SalesReport.vue'
defineProps({ data: Object })
</script>
