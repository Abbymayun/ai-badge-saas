<template>
  <div class="legal-page">
    <el-card shadow="never" class="legal-card">
      <div class="legal-content">
        <h2>AI智能胸牌 · 小程序法律声明</h2>
        <p class="legal-date">更新日期：2026年5月20日 &nbsp;|&nbsp; 生效日期：2026年5月20日</p>

        <h3>一、服务条款</h3>
        <h4>1.1 服务说明</h4>
        <p>AI智能胸牌小程序（以下简称"本小程序"）是利尔达集团推出的移动端应用，为用户提供AI智能胸牌设备的绑定管理、录音查看、AI分析报告查阅、客户线索管理等功能。</p>
        <h4>1.2 用户资格</h4>
        <p>您确认已获得所在企业的合法授权，拥有有效的企业账号，方可使用本小程序。本小程序不向个人用户开放注册。</p>
        <h4>1.3 账号安全</h4>
        <p>使用本小程序需先通过企业分配的账号登录。您应妥善保管账号和密码，不得泄露给他人。如手机丢失或账号异常，应立即联系企业管理员或本公司进行账号冻结。</p>

        <h3>二、隐私政策</h3>
        <h4>2.1 信息收集</h4>
        <el-table :data="infoCollection" size="small" border style="margin:12px 0;">
          <el-table-column prop="type" label="信息类型" width="120" />
          <el-table-column prop="content" label="具体内容" min-width="200" />
          <el-table-column prop="purpose" label="收集目的" min-width="200" />
        </el-table>
        <h4>2.2 权限说明</h4>
        <el-table :data="permissions" size="small" border style="margin:12px 0;">
          <el-table-column prop="name" label="权限" width="120" />
          <el-table-column prop="use" label="用途" min-width="200" />
          <el-table-column prop="required" label="是否必须" width="100" />
        </el-table>
        <h4>2.3 数据安全</h4>
        <p>小程序端不存储录音文件，所有数据通过加密通道传输至SaaS平台服务器。小程序与服务器之间的通信采用HTTPS加密。</p>

        <h3>三、功能说明</h3>
        <h4>3.1 设备管理</h4>
        <p>支持扫码或手动输入设备SN绑定智能胸牌，查看设备在线状态、电量和存储使用情况。</p>
        <h4>3.2 录音查看</h4>
        <p>查看已绑设备生成的录音列表及AI分析状态（生成中/已生成/生成失败），点击查看转写文本和AI分析报告。</p>
        <h4>3.3 AI报告查看</h4>
        <p>查看AI生成的销售能力评分、客户画像、需求分析和改进建议。AI分析结果仅供参考。</p>
        <h4>3.4 客户线索与数据概览</h4>
        <p>查看基于AI提取的客户线索和销售数据统计。</p>

        <h3>四、知识产权</h3>
        <p>本小程序的软件代码、界面设计、图标等知识产权归本公司所有。小程序中展示的业务数据知识产权归企业用户所有。</p>

        <h3>五、免责声明</h3>
        <p>本小程序依赖网络连接和SaaS平台服务，因网络故障、服务器维护等原因可能导致服务暂时不可用。AI分析结果仅供内部参考。</p>

        <h3>六、合规说明</h3>
        <p>本小程序严格遵守《中华人民共和国个人信息保护法》《数据安全法》《网络安全法》以及《微信小程序平台运营规范》。企业用户应确保在使用录音功能前取得相关人员的知情同意。</p>

        <h3>七、争议解决</h3>
        <p>本声明的解释和适用以中华人民共和国法律为准。因本小程序引起的争议，双方应友好协商解决；协商不成的，提交本公司所在地人民法院管辖。</p>

        <h3>八、联系方式</h3>
        <p>开发运营方：利尔达科技集团股份有限公司<br>联系地址：浙江省杭州市余杭区仓前街道利尔达科技园<br>电子邮箱：legal@lierda.com</p>

        <p class="legal-copyright">© 2026 利尔达集团 · 保留所有权利</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const infoCollection = [
  { type:'账号信息', content:'登录账号、企业信息、角色权限', purpose:'身份验证、权限控制' },
  { type:'设备信息', content:'手机型号、操作系统版本、网络状态', purpose:'兼容性适配、问题排查' },
  { type:'位置信息', content:'粗略位置（用于设备绑定）', purpose:'设备定位、安全验证' },
  { type:'使用数据', content:'页面访问记录、功能使用频率', purpose:'产品优化、体验改进' },
  { type:'业务数据', content:'录音查阅、AI报告查看、客户信息查看', purpose:'核心功能服务' }
]
const permissions = [
  { name:'相机', use:'扫码绑定设备', required:'否（可手动输入）' },
  { name:'存储', use:'缓存AI报告和图片', required:'否' },
  { name:'位置', use:'设备绑定时的位置验证', required:'否' }
]
</script>

<style scoped>
.legal-page{max-width:900px;margin:0 auto;padding:16px}
.legal-card{border-radius:12px}
.legal-content{font-size:14px;color:#333;line-height:1.9}
.legal-content :deep(h2){font-size:24px;margin:0 0 8px;color:#1a1a2e}
.legal-content :deep(h3){font-size:18px;margin:28px 0 12px;color:#303133;border-bottom:1px solid #f0f0f0;padding-bottom:6px}
.legal-content :deep(h4){font-size:15px;margin:16px 0 8px;color:#606266}
.legal-date{color:#909399;font-size:13px;margin-bottom:20px}
.legal-copyright{text-align:center;color:#c0c4cc;font-size:13px;margin-top:32px;padding-top:16px;border-top:1px solid #f0f0f0}
</style>
