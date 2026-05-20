<template>
  <div class="legal-page">
    <el-card shadow="never" class="legal-card">
      <div class="legal-content">
        <h2>AI智能胸牌 · SaaS管理平台法律声明</h2>
        <p class="legal-date">更新日期：2026年5月20日 &nbsp;|&nbsp; 生效日期：2026年5月20日</p>
        
        <h3>一、服务条款</h3>
        <h4>1.1 服务说明</h4>
        <p>AI智能胸牌SaaS管理平台（以下简称"本平台"）由利尔达集团（以下简称"本公司"）提供，是一个面向企业用户的AI销售赋能管理平台。本平台通过智能胸牌设备采集销售对话音频，利用人工智能技术提供语音转写、智能分析、销售能力评估、客户画像生成等服务。</p>
        <h4>1.2 服务对象</h4>
        <p>本平台仅供企业客户使用。您确认已获得所在企业的合法授权，有权代表企业注册和使用本平台服务。</p>
        <h4>1.3 账号管理</h4>
        <p>企业管理员账号由本公司分配。您应对账号下的所有操作行为负责，账号不得转借、出租或转让给第三方使用。</p>
        
        <h3>二、隐私政策</h3>
        <h4>2.1 信息收集</h4>
        <el-table :data="infoCollection" size="small" border style="margin:12px 0;">
          <el-table-column prop="type" label="信息类型" width="120" />
          <el-table-column prop="content" label="具体内容" min-width="200" />
          <el-table-column prop="purpose" label="收集目的" min-width="200" />
        </el-table>
        <h4>2.2 信息使用</h4>
        <p>您的数据仅用于为您提供本平台约定的服务。录音数据和AI分析结果归属于企业用户，本公司不会将您的数据用于其他商业目的。</p>
        <h4>2.3 数据存储与安全</h4>
        <p>所有数据存储于中华人民共和国境内的服务器。录音数据采用AES-256加密存储，传输采用TLS 1.3加密。本平台已通过信息安全等级保护三级认证（等保三级）。支持私有化部署方案。</p>
        <h4>2.4 数据保留与删除</h4>
        <p>录音数据默认保留2年，企业可自定义保留期限。企业管理员可随时删除指定录音数据，删除后不可恢复。</p>

        <h3>三、AI分析说明</h3>
        <h4>3.1 AI技术说明</h4>
        <p>本平台使用自然语言处理（NLP）、语音识别（ASR）、大语言模型（LLM）等人工智能技术对销售对话进行分析。AI分析结果仅供参考，不构成任何形式的决策建议或法律意见。</p>
        <h4>3.2 AI分析范围</h4>
        <p>语音转写（准确率约95%-98%）、智能评分、客户画像、话术提取、报告生成。</p>

        <h3>四、知识产权</h3>
        <p>本平台的软件、界面设计、算法模型、文档等知识产权归本公司所有。您的企业数据知识产权归您所有。</p>

        <h3>五、免责声明</h3>
        <p>AI分析结果仅供参考，不构成任何形式的承诺或保证。本平台SLA承诺可用性不低于99.5%。在法律允许的最大范围内，本公司对因使用本平台而产生的任何间接损害不承担责任。</p>

        <h3>六、合规说明</h3>
        <p>本平台严格遵守《中华人民共和国个人信息保护法》《中华人民共和国数据安全法》《中华人民共和国网络安全法》等相关法律法规。企业用户应确保在使用录音功能前取得相关人员的知情同意。</p>

        <h3>七、争议解决</h3>
        <p>本声明的订立、执行和解释适用中华人民共和国法律。因本声明引起的争议，双方应友好协商解决；协商不成的，任何一方均可向本公司所在地有管辖权的人民法院提起诉讼。</p>

        <h3>八、联系方式</h3>
        <p>企业名称：利尔达科技集团股份有限公司<br>联系地址：浙江省杭州市余杭区仓前街道利尔达科技园<br>电子邮箱：legal@lierda.com</p>

        <p class="legal-copyright">© 2026 利尔达集团 · 保留所有权利</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const infoCollection = [
  { type:'企业信息', content:'企业名称、行业、联系人、联系方式', purpose:'账号管理、服务提供' },
  { type:'员工信息', content:'姓名、工号、部门、职位', purpose:'设备绑定、权限管理、数据分析' },
  { type:'设备数据', content:'设备SN、MAC地址、使用状态、电量', purpose:'设备管理、运维监控' },
  { type:'录音数据', content:'销售对话音频、转写文本', purpose:'AI分析、报告生成、话术提取' },
  { type:'分析数据', content:'AI评分、客户画像、销售能力评估', purpose:'服务质量提升、管理决策支持' },
  { type:'日志数据', content:'操作日志、登录记录、设备连接记录', purpose:'安全审计、问题排查' }
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
