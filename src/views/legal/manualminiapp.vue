<template>
  <div class="manual-page">
    <el-card shadow="never" class="manual-card">
      <div class="manual-content">
        <h2>AI智能胸牌 · 小程序 使用手册</h2>
        <p class="manual-subtitle">适用对象：企业管理员及一线销售 | 版本：V1.0 | 更新日期：2026年5月</p>

        <h3>一、快速绑定设备</h3>
        <el-steps :active="4" finish-status="success" simple style="margin:16px 0;">
          <el-step title="扫码" description="扫胸牌二维码→进入小程序" />
          <el-step title="确认" description="确认员工信息→提交" />
          <el-step title="长按" description="非充电状态→长按按键>10秒" />
          <el-step title="成功" description="绿灯闪烁→屏幕显示姓名→绑定成功" />
        </el-steps>

        <h3>二、小程序首页</h3>
        <p>登录后进入首页，顶部显示设备在线状态和电量。中间展示已绑定的智能胸牌设备信息（品牌型号、序列号）。下方为快捷功能入口：</p>
        <ul>
          <li><b>新建录音</b>：跳转到录音列表页</li>
          <li><b>客户线索</b>：查看AI提取的客户线索</li>
          <li><b>数据概览</b>：查看个人统计数据</li>
          <li><b>设备设置</b>：跳转到我的页面管理设备</li>
        </ul>

        <h3>三、录音管理</h3>
        <h4>3.1 查看录音列表</h4>
        <p>点击底部「录音列表」Tab或首页快捷入口进入。列表展示所有录音文件，每条显示文件名、录制时间、文件大小、AI分析状态（生成中/已生成/生成失败）。支持按AI报告状态和时间筛选。</p>
        <h4>3.2 查看录音详情</h4>
        <p>点击录音条目进入详情页，包含四个Tab：</p>
        <ul>
          <li><b>AI总结</b>：综合评分+客户画像+需求洞察+沟通逻辑+亮点改进+下一步建议</li>
          <li><b>转写</b>：完整的对话文字记录，区分说话人角色</li>
          <li><b>章节速览</b>：按对话阶段分段摘要（开场破冰→需求挖掘→产品介绍→异议处理→案例佐证→推进）</li>
          <li><b>基本信息</b>：录音时长、文件大小、录制时间、设备SN、AI分析状态</li>
        </ul>

        <h3>四、客户线索</h3>
        <p>点击底部「客户线索」Tab，查看AI自动从对话中提取的客户信息。每条线索包含客户名称、公司、行业、意向等级（高/中/低）。点击可查看客户详情，支持关联录音和新建跟进。</p>

        <h3>五、我的</h3>
        <h4>5.1 个人信息</h4>
        <p>展示当前登录员工的姓名、部门、手机号、工号。点击设置图标可修改个人信息。</p>
        <h4>5.2 设备信息</h4>
        <p>查看已绑定设备的详细信息：设备名称、序列号、电量、绑定时间。支持解绑设备操作。</p>

        <h3>六、设备操作说明</h3>
        <h4>6.1 开始 / 停止录音</h4>
        <ul>
          <li><b>开启录音</b>：关机上拨（显示绿点）→ 绿灯长亮2秒 → 开始录音</li>
          <li><b>关闭录音</b>：关机下拨（隐藏绿点）→ 绿灯闪2次 → 停止录音</li>
          <li><b>隐私保护</b>：仅工作时可录音，私人时间开关无效</li>
        </ul>
        <h4>6.2 快捷按键</h4>
        <ul>
          <li>录音中（开机ON）：单击 → POI重点标记</li>
          <li>未录音（关机OFF）：单击 → 手动上传数据</li>
          <li>查版本：开关OFF + 长按>5秒 → 显示SN/版本号</li>
        </ul>
        <h4>6.3 数据上传方式</h4>
        <ol>
          <li>平台配置自动周期上传</li>
          <li>充电时自动上传</li>
          <li>开关OFF + 单击按键立即上传</li>
        </ol>

        <h3>七、指示灯说明</h3>
        <el-table :data="ledStatus" size="small" border style="margin:12px 0;">
          <el-table-column prop="light" label="指示灯" width="140" />
          <el-table-column prop="meaning" label="含义" min-width="300" />
        </el-table>

        <h3>八、常见问题</h3>
        <el-collapse>
          <el-collapse-item title="Q: 小程序登录失败？"><p>A: 请确认：1）使用企业管理员分配的账号 2）网络连接正常 3）确认账号未被禁用。如仍无法登录请联系企业管理员。</p></el-collapse-item>
          <el-collapse-item title="Q: 扫码绑定设备无反应？"><p>A: 请在良好的光线下扫描，确认二维码清晰完整。也可以手动输入设备SN进行绑定。</p></el-collapse-item>
          <el-collapse-item title="Q: 录音列表中没有新录音？"><p>A: 请确认：1）设备已正常录音 2）数据已上传（开关OFF+单击按键或充电上传）3）等待1-3分钟数据同步。</p></el-collapse-item>
          <el-collapse-item title="Q: AI分析一直显示生成中？"><p>A: AI分析通常在5-10分钟内完成。如超过30分钟尚未完成，可能是录音质量或时长不足，请联系技术支持。</p></el-collapse-item>
        </el-collapse>

        <p class="manual-footer">© 2026 利尔达集团 · AI智能胸牌产品团队</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const ledStatus = [
  { light:'绿灯快闪', meaning:'上传 / 绑定中' },
  { light:'绿灯慢闪', meaning:'录音中' },
  { light:'绿灯长亮2秒', meaning:'开始录音' },
  { light:'绿灯闪2次', meaning:'停止录音' },
  { light:'红灯慢闪', meaning:'电量低（<10%），请充电' },
  { light:'红灯快闪', meaning:'温度异常，暂停使用等待恢复' },
  { light:'红灯常亮', meaning:'充电中' },
  { light:'绿灯常亮', meaning:'充电完成' }
]
</script>

<style scoped>
.manual-page{max-width:900px;margin:0 auto;padding:16px}
.manual-card{border-radius:12px}
.manual-content{font-size:14px;color:#333;line-height:1.9}
.manual-content :deep(h2){font-size:24px;margin:0 0 8px;color:#1a1a2e}
.manual-content :deep(h3){font-size:18px;margin:28px 0 12px;color:#303133;border-bottom:1px solid #f0f0f0;padding-bottom:6px}
.manual-content :deep(h4){font-size:15px;margin:16px 0 8px;color:#606266}
.manual-content :deep(ul),.manual-content :deep(ol){margin:4px 0;padding-left:20px}
.manual-content :deep(li){margin:4px 0}
.manual-subtitle{color:#909399;font-size:13px;margin-bottom:20px}
.manual-footer{text-align:center;color:#c0c4cc;font-size:13px;margin-top:32px;padding-top:16px;border-top:1px solid #f0f0f0}
</style>
