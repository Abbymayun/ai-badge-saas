<template>
  <div class="payment-page">
    <div class="page-header">
      <h2>💳 确认订单</h2>
    </div>

    <el-row :gutter="20" style="max-width:1000px;margin:0 auto">
      <!-- 订单信息 -->
      <el-col :span="16">
        <el-card shadow="hover" style="margin-bottom:16px">
          <template #header><b>📋 订单明细</b></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="套餐">{{ planName }}</el-descriptions-item>
            <el-descriptions-item label="单价">¥{{ planPrice }} /年/台</el-descriptions-item>
            <el-descriptions-item label="设备数量">
              <el-input-number v-model="deviceCount" :min="1" :max="1000" size="small" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="hover" style="margin-bottom:16px">
          <template #header><b>🔧 硬件设备</b></template>
          <el-checkbox v-model="includeHardware">包含AI智能胸牌硬件设备</el-checkbox>
          <div v-if="includeHardware" style="margin-top:8px;display:flex;gap:12px">
            <el-radio-group v-model="hwVersion">
              <el-radio label="bw">{{ hwBwLabel }} — ¥{{ hwBwPrice }}/台</el-radio>
              <el-radio label="color">{{ hwColorLabel }} — ¥{{ hwColorPrice }}/台</el-radio>
            </el-radio-group>
          </div>
        </el-card>

        <el-card shadow="hover" style="margin-bottom:16px">
          <template #header><b>💰 费用汇总</b></template>
          <table class="fee-table">
            <tr><td>软件服务费</td><td>{{ deviceCount }}台 × ¥{{ planPrice }} = ¥{{ (planPrice * deviceCount).toLocaleString() }}</td></tr>
            <tr v-if="includeHardware"><td>硬件设备费</td><td>{{ deviceCount }}台 × ¥{{ hwUnitPrice }} = ¥{{ (hwUnitPrice * deviceCount).toLocaleString() }}</td></tr>
            <tr class="total-row"><td>合计</td><td>¥{{ totalPrice.toLocaleString() }}</td></tr>
          </table>
        </el-card>
      </el-col>

      <!-- 支付方式 -->
      <el-col :span="8">
        <el-card shadow="hover" style="margin-bottom:16px">
          <template #header><b>💳 支付方式</b></template>
          <el-radio-group v-model="payMethod" style="width:100%">
            <el-radio label="b2b" size="large" style="display:flex;align-items:flex-start;padding:10px 0;width:100%;border-bottom:1px solid #f0f0f0">
              <div>
                <div style="font-weight:600">🏦 对公转账</div>
                <div style="font-size:12px;color:#909399">支持企业网银、柜台转账，1-3个工作日到账</div>
              </div>
            </el-radio>
            <el-radio label="wechat" size="large" style="display:flex;align-items:flex-start;padding:10px 0;width:100%;border-bottom:1px solid #f0f0f0">
              <div>
                <div style="font-weight:600">💬 微信支付</div>
                <div style="font-size:12px;color:#909399">扫码支付，即时到账</div>
              </div>
            </el-radio>
            <el-radio label="alipay" size="large" style="display:flex;align-items:flex-start;padding:10px 0;width:100%">
              <div>
                <div style="font-weight:600">💙 支付宝</div>
                <div style="font-size:12px;color:#909399">扫码支付，即时到账</div>
              </div>
            </el-radio>
          </el-radio-group>
        </el-card>

        <el-card v-if="payMethod==='b2b'" shadow="hover" style="margin-bottom:16px">
          <template #header><b>📄 开票信息</b></template>
          <el-form label-width="80px" size="small">
            <el-form-item label="公司名称"><el-input v-model="invoice.company" placeholder="请输入公司全称" /></el-form-item>
            <el-form-item label="税号"><el-input v-model="invoice.taxNo" placeholder="统一社会信用代码" /></el-form-item>
            <el-form-item label="开户行"><el-input v-model="invoice.bank" placeholder="开户银行" /></el-form-item>
            <el-form-item label="银行账号"><el-input v-model="invoice.bankNo" placeholder="银行账号" /></el-form-item>
          </el-form>
        </el-card>

        <el-button type="primary" size="large" style="width:100%" @click="confirmPay">
          {{ payMethod==='b2b' ? '提交订单' : '确认支付 ¥'+totalPrice.toLocaleString() }}
        </el-button>
      </el-col>
    </el-row>

    <!-- 支付确认弹窗 -->
    <el-dialog v-model="payVisible" :title="payMethod==='b2b'?'订单已提交':'扫码支付'" width="400px" center>
      <div v-if="payMethod==='b2b'" style="text-align:center;padding:20px">
        <div style="font-size:48px;margin-bottom:16px">✅</div>
        <div style="font-size:16px;font-weight:600">订单已提交</div>
        <div style="font-size:13px;color:#909399;margin-top:8px;line-height:1.6">
          请将款项汇至以下账户：<br/>
          户名：利尔达科技集团股份有限公司<br/>
          开户行：招商银行杭州分行<br/>
          账号：5719 1234 5678 9012<br/>
          金额：¥{{ totalPrice.toLocaleString() }}
        </div>
        <div style="font-size:12px;color:#E6A23C;margin-top:12px">到账后自动开通服务，预计1-3个工作日</div>
      </div>
      <div v-else style="text-align:center;padding:20px">
        <div style="width:160px;height:160px;background:#f0f0f0;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:48px">
          {{ payMethod==='wechat'?'💬':'💙' }}
        </div>
        <div style="font-size:14px;color:#909399">请使用{{ payMethod==='wechat'?'微信':'支付宝' }}扫描二维码</div>
        <div style="font-size:16px;font-weight:600;margin-top:8px">¥{{ totalPrice.toLocaleString() }}</div>
      </div>
      <template #footer>
        <el-button type="primary" @click="payVisible=false;ElMessage.success('支付成功！')">完成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const planId = route.query.plan || 'pro'
const deviceCount = ref(20)
const includeHardware = ref(true)
const hwVersion = ref('bw')
const payMethod = ref('b2b')
const payVisible = ref(false)
const invoice = ref({ company: '', taxNo: '', bank: '', bankNo: '' })

const planPrices = { basic: 499, pro: 799, enterprise: 1099 }
const planNames = { basic: '标准版', pro: '高级版', enterprise: '专业版' }
const hwPrices = {
  basic: { bw: 450, color: 500, bwLabel: '黑白版', colorLabel: '多色版' },
  pro: { bw: 450, color: 500, bwLabel: '黑白版', colorLabel: '多色版' },
  enterprise: { bw: 450, color: 500, bwLabel: '黑白版', colorLabel: '多色版' }
}

const planPrice = computed(() => planPrices[planId] || 799)
const planName = computed(() => planNames[planId] || '高级版')
const hwBwPrice = computed(() => hwPrices[planId]?.bw || 450)
const hwColorPrice = computed(() => hwPrices[planId]?.color || 500)
const hwBwLabel = computed(() => hwPrices[planId]?.bwLabel || '黑白版')
const hwColorLabel = computed(() => hwPrices[planId]?.colorLabel || '多色版')
const hwUnitPrice = computed(() => hwVersion.value==='bw' ? hwBwPrice.value : hwColorPrice.value)
const totalPrice = computed(() => {
  let total = planPrice.value * deviceCount.value
  if(includeHardware.value) total += hwUnitPrice.value * deviceCount.value
  return total
})

function confirmPay() {
  if(payMethod.value==='b2b' && !invoice.value.company) {
    ElMessage.warning('请填写公司名称')
    return
  }
  payVisible.value = true
}
</script>

<style scoped>
.payment-page{padding:24px;background:#f5f7fa;min-height:100vh}
.page-header{margin-bottom:20px}.page-header h2{font-size:24px;color:#303133}
.fee-table{width:100%;font-size:13px}.fee-table td{padding:8px 0;border-bottom:1px solid #f0f0f0}.fee-table td:last-child{text-align:right;font-weight:500}
.fee-table .total-row td{font-size:16px;font-weight:700;color:#409EFF;border:none;padding-top:12px}
</style>
