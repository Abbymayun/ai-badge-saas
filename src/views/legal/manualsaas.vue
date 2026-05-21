<template>
  <div class="manual-page">
    <el-card shadow="never" class="manual-card">
      <div class="manual-content">
        <h2>AI智能胸牌 · SaaS管理平台 使用手册</h2>
        <p class="manual-subtitle">适用对象：企业管理员 | 版本：V1.0 | 更新日期：2026年5月</p>

        <h3>一、快速入门</h3>
        <h4>1.1 登录系统</h4>
        <p>打开浏览器访问SaaS平台地址，使用企业管理员账号和密码登录。首次登录建议修改初始密码。</p>
        <h4>1.2 系统界面概览</h4>
        <p>登录后进入数据概览页面，左侧为功能导航菜单，顶部为企业切换和用户信息区，主区域显示数据内容。</p>
        <el-table :data="navMenu" size="small" border style="margin:12px 0;">
          <el-table-column prop="menu" label="菜单" width="140" />
          <el-table-column prop="desc" label="功能说明" min-width="300" />
          <el-table-column prop="role" label="角色" width="100" />
        </el-table>

        <h3>二、设备管理</h3>
        <h4>2.1 查看设备列表</h4>
        <p>点击「设备管理 → 设备列表」，查看所有已绑定的智能胸牌设备。支持按设备SN、状态、部门筛选。</p>
        <h4>2.2 设备绑定</h4>
        <p>新设备需通过小程序扫码绑定。绑定后自动在设备列表显示，管理员可查看绑定人员、在线状态、电量等信息。</p>
        <h4>2.3 设备设置</h4>
        <p>在「设备设置」中可配置：屏幕显示模板、工作时间段（仅工作时间可录音）、录音上传时间策略。</p>

        <h3>三、AI听记管理</h3>
        <h4>3.1 查看录音列表</h4>
        <p>点击「AI听记 → 听记管理」，查看所有录音记录。支持按人员、部门、时间筛选。录音状态包括：待分析、分析中、已完成。</p>
        <h4>3.2 查看AI分析报告</h4>
        <p>点击录音条目「查看详情」，进入听记详情页。包含：</p>
        <ul>
          <li><b>AI总结</b>：销售能力评分、客户画像、需求洞察、对话逻辑梳理、亮点改进建议</li>
          <li><b>转写</b>：完整的对话文本，支持按时间戳定位播放</li>
          <li><b>章节速览</b>：对话的结构化分段摘要</li>
          <li><b>基本信息</b>：录音文件元数据</li>
        </ul>
        <h4>3.4 智能体配置</h4>
        <p>「AI听记 → 智能体配置」提供系统预设的分析模板，按行业和场景分类。管理员可以根据企业需求启用/禁用模板，预览模板效果。</p>

        <h3>四、线索管理</h3>
        <p>「线索管理 → 线索列表」展示AI从对话中自动提取的客户线索。可按意向等级（高/中/低）和状态（新线索/跟进中/已成交/已流失）筛选。跟进人员可在列表中更新跟进状态。</p>

        <h3>五、企业设置</h3>
        <h4>5.1 企业信息</h4>
        <p>在「企业管理」查看和编辑企业基本信息、行业归属。</p>
        <h4>5.2 AI配额管理</h4>
        <p>创建或编辑企业时可设置AI总结可打开数量（配额）。配额到期后可续费。系统会提前预警配额使用情况。</p>
        <h4>5.3 员工管理</h4>
        <p>「系统管理 → 员工管理」：添加/编辑员工信息，分配部门和角色。角色包括：超级管理员、企业管理员、部门经理、一线销售等。</p>
        <h4>5.4 角色权限</h4>
        <p>「系统管理 → 角色管理」：定义角色权限范围。支持菜单权限、数据权限（集团/分公司/部门/个人）和操作权限（查看/编辑/删除/导出）。</p>

        <h3>六、数据安全</h3>
        <ul>
          <li>录音数据AES-256加密存储，传输TLS 1.3加密</li>
          <li>通过信息安全等级保护三级认证（等保三级）</li>
          <li>支持私有化部署方案</li>
          <li>数据默认保留2年，管理员可自定义保留期限</li>
        </ul>

        <h3>七、常见问题</h3>
        <el-collapse>
          <el-collapse-item title="Q: 设备绑定时长按按键无反应？"><p>A: 请确认：1）设备非充电状态 2）长按时间需超过10秒 3）指示灯是否开始闪烁。如仍无反应请联系技术支持。</p></el-collapse-item>
          <el-collapse-item title="Q: 录音文件一直没有AI分析结果？"><p>A: 请确认：1）录音时长是否超过1分钟 2）设备是否已上传数据 3）网络连接是否正常。通常分析在录音上传后5-10分钟内完成。</p></el-collapse-item>
          <el-collapse-item title="Q: 如何更换绑定人员？"><p>A: 需先解绑当前人员：设备关机+长按按键>10秒，绿灯闪烁后等待平台同步，重新扫码绑定新人员。</p></el-collapse-item>
          <el-collapse-item title="Q: AI配额用完怎么办？"><p>A: 联系销售人员续费或升级套餐。到期后AI总结功能将暂停，但不影响录音和转写功能。</p></el-collapse-item>
        </el-collapse>

        <p class="manual-footer">© 2026 利尔达集团 · AI智能胸牌产品团队</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const navMenu = [
  { menu:'数据概览', desc:'核心指标看板：客户数据、AI评分、设备状态、排行榜', role:'全部' },
  { menu:'设备管理', desc:'设备列表、设备详情、设备设置（屏幕模板/工作时间配置）', role:'管理员' },
  { menu:'AI听记', desc:'听记管理、智能体配置、我的智能体、产品卖点', role:'全部' },
  { menu:'线索管理', desc:'客户线索列表、跟进管理、意向等级筛选', role:'全部' },
  { menu:'金牌销售', desc:'销售画像、话术库', role:'全部' },
  { menu:'企业管理', desc:'企业列表、创建企业、行业选择、AI配额设置', role:'超级管理员' },
  { menu:'行业管理', desc:'行业配置中心（AI模板/评价维度/话术模板/金牌标准）', role:'超级管理员' },
  { menu:'系统管理', desc:'员工管理、角色管理、权限管理', role:'管理员' }
]
</script>

<style scoped>
.manual-page{max-width:900px;margin:0 auto;padding:16px}
.manual-card{border-radius:12px}
.manual-content{font-size:14px;color:#333;line-height:1.9}
.manual-content :deep(h2){font-size:24px;margin:0 0 8px;color:#1a1a2e}
.manual-content :deep(h3){font-size:18px;margin:28px 0 12px;color:#303133;border-bottom:1px solid #f0f0f0;padding-bottom:6px}
.manual-content :deep(h4){font-size:15px;margin:16px 0 8px;color:#606266}
.manual-content :deep(ul){margin:4px 0;padding-left:20px}
.manual-content :deep(li){margin:4px 0}
.manual-subtitle{color:#909399;font-size:13px;margin-bottom:20px}
.manual-footer{text-align:center;color:#c0c4cc;font-size:13px;margin-top:32px;padding-top:16px;border-top:1px solid #f0f0f0}
</style>
