<template>
  <div class="meeting-report">
    <div class="mr-hero">
      <div class="mr-hero-badge">📝 会议纪要</div>
      <h2 class="mr-title">{{ data.meetingTitle || data.title }}</h2>
      <div class="mr-meta-row">
        <div class="mr-meta-item"><span class="mr-meta-icon">🕐</span>{{ data.date }} · {{ data.duration || '60分钟' }}</div>
        <div class="mr-meta-item"><span class="mr-meta-icon">📍</span>{{ data.location || '会议室A' }}</div>
        <div class="mr-meta-item"><span class="mr-meta-icon">👤</span>{{ data.organizer || '王志华' }} 发起</div>
      </div>
      <div class="mr-attendees">
        <span class="mr-att-label">参会人</span>
        <span v-for="(a,idx) in (data.attendees||attendeeList)" :key="idx" class="mr-att-chip" :class="a.role||'internal'">{{ a.name||a }}<small v-if="a.title">·{{ a.title }}</small></span>
      </div>
    </div>

    <el-row :gutter="16" class="mr-overview">
      <el-col :span="8"><div class="mr-ov-card"><div class="mro-icon" style="background:#ecf5ff;">📋</div><div class="mro-num">{{ (data.topics||[]).length }}</div><div class="mro-label">讨论议题</div></div></el-col>
      <el-col :span="8"><div class="mr-ov-card"><div class="mro-icon" style="background:#f0f9eb;">✅</div><div class="mro-num" style="color:#67C23A;">{{ (data.decisions||[]).length }}</div><div class="mro-label">达成决策</div></div></el-col>
      <el-col :span="8"><div class="mr-ov-card"><div class="mro-icon" style="background:#fdf6ec;">📌</div><div class="mro-num" style="color:#E6A23C;">{{ (data.actionItems||[]).filter(a=>a.status!=='done').length }}</div><div class="mro-label">待办事项</div></div></el-col>
    </el-row>

    <el-card shadow="never" class="mr-card">
      <div class="mr-section-header"><span class="mr-section-icon">💡</span>会议摘要</div>
      <div class="mr-summary">{{ data.summary }}</div>
    </el-card>

    <el-card shadow="never" class="mr-card">
      <div class="mr-section-header"><span class="mr-section-icon">💬</span>议题讨论</div>
      <el-timeline>
        <el-timeline-item v-for="(t,idx) in (data.topics||[])" :key="idx" :timestamp="t.duration||'约10分钟'" placement="top" :color="t.decision?'#67C23A':'#409EFF'" size="large">
          <div class="mrt-card">
            <div class="mrt-header"><span class="mrt-num">{{ idx+1 }}</span><span class="mrt-title">{{ t.topic }}</span><el-tag v-if="t.decision" type="success" size="small" effect="plain">✓ 已决策</el-tag><el-tag v-else size="small" effect="plain" type="info">讨论中</el-tag></div>
            <div class="mrt-discussion">{{ t.discussion }}</div>
            <div v-if="t.decision" class="mrt-decision"><span class="mrt-decision-label">📌 结论</span>{{ t.decision }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <el-card shadow="never" class="mr-card" v-if="(data.decisions||[]).length">
      <div class="mr-section-header"><span class="mr-section-icon">✅</span>决策记录</div>
      <div class="mr-decision-grid">
        <div v-for="(d,idx) in (data.decisions||[])" :key="idx" class="mrd-item"><div class="mrd-num">{{ idx+1 }}</div><div class="mrd-content"><div class="mrd-text">{{ typeof d === 'string' ? d : d.text }}</div></div></div>
      </div>
    </el-card>

    <el-card shadow="never" class="mr-card">
      <div class="mr-section-header"><span class="mr-section-icon">📋</span>待办事项<el-tag size="small" type="warning" style="margin-left:8px;">{{ ((data.actionItems||[]).filter(a=>a.status!=='done')).length }} 项待完成</el-tag></div>
      <el-table :data="data.actionItems||[]" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="task" label="待办任务" min-width="200">
          <template #default="{row}"><span :style="{textDecoration:row.status==='done'?'line-through':'none',color:row.status==='done'?'#c0c4cc':'#303133'}">{{ row.task }}</span></template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="100"><template #default="{row}"><div class="mr-owner"><div class="mr-owner-av" :style="{background:colorFor(row.owner)}">{{ row.owner[0] }}</div><span>{{ row.owner }}</span></div></template></el-table-column>
        <el-table-column prop="deadline" label="截止" width="100"><template #default="{row}"><el-tag :type="row.status==='done'?'success':row.status==='urgent'?'danger':'warning'" size="small">{{ row.status==='done'?'✅':'' }}{{ row.deadline }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="状态" width="90"><template #default="{row}"><el-tag :type="row.status==='done'?'success':row.status==='urgent'?'danger':''" size="small" effect="plain">{{ row.status==='done'?'已完成':row.status==='urgent'?'⚠ 紧急':'进行中' }}</el-tag></template></el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never" class="mr-card mr-next-card" v-if="data.nextMeeting">
      <div class="mr-section-header"><span class="mr-section-icon">📅</span>下次会议</div>
      <div class="mr-next-info"><div class="mrni-i"><span class="mrni-l">时间</span><span class="mrni-v">{{ data.nextMeeting.time||data.nextMeeting }}</span></div></div>
    </el-card>

    <div class="mr-footer"><span>纪要由 AI智能胸牌 自动生成</span><span>{{ data.generateTime||'2026-05-19' }}</span></div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const attendeeList = ['王志华','张总','李经理']

const colors = ['#409EFF','#67C23A','#E6A23C','#F56C6C','#909399']
const colorFor = n => colors[(n||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0)%colors.length]
</script>

<style scoped>
.meeting-report{max-width:860px;margin:0 auto}
.mr-hero{background:linear-gradient(135deg,#667eea,#764ba2);border-radius:20px;padding:32px;color:#fff;margin-bottom:20px}
.mr-hero-badge{display:inline-block;background:rgba(255,255,255,.2);padding:4px 14px;border-radius:20px;font-size:12px;margin-bottom:12px}
.mr-title{font-size:24px;font-weight:700;margin:0 0 14px;line-height:1.4}
.mr-meta-row{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:14px}
.mr-meta-item{font-size:13px;opacity:.9;display:flex;align-items:center;gap:4px}
.mr-attendees{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.mr-att-label{font-size:12px;opacity:.7;margin-right:4px}
.mr-att-chip{display:inline-flex;align-items:center;gap:2px;padding:3px 12px;border-radius:16px;font-size:12px;background:rgba(255,255,255,.2)}
.mr-att-chip small{font-size:10px;opacity:.7}
.mr-att-chip.customer{background:rgba(251,191,36,.3)}
.mr-overview{margin-bottom:20px}
.mr-ov-card{background:#fff;border-radius:14px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.04)}
.mro-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 10px}
.mro-num{font-size:32px;font-weight:700;color:#409EFF;line-height:1}
.mro-label{font-size:13px;color:#909399;margin-top:4px}
.mr-card{border-radius:14px;margin-bottom:16px;border:none;box-shadow:0 1px 8px rgba(0,0,0,.04)}
.mr-section-header{display:flex;align-items:center;font-size:17px;font-weight:700;color:#1a1a2e;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #f0f2f5}
.mr-section-icon{font-size:20px;margin-right:8px}
.mr-summary{font-size:14px;line-height:1.9;color:#4a5568}
.mrt-card{background:#fafbfc;border-radius:12px;padding:18px;border-left:3px solid #409EFF}
.mrt-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.mrt-num{width:24px;height:24px;border-radius:8px;background:#409EFF;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mrt-title{font-size:15px;font-weight:700;color:#1a1a2e;flex:1}
.mrt-discussion{font-size:13px;color:#606266;line-height:1.8;padding-left:34px}
.mrt-decision{margin-top:10px;padding:10px 14px;background:#f0f9eb;border-radius:8px;font-size:13px;color:#303133;line-height:1.6}
.mrt-decision-label{font-weight:700;color:#67C23A;margin-right:6px}
.mr-decision-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.mrd-item{display:flex;gap:12px;padding:16px;background:#f0f9eb;border-radius:12px;align-items:flex-start}
.mrd-num{width:26px;height:26px;border-radius:50%;background:#67C23A;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mrd-text{font-size:14px;font-weight:600;color:#1a1a2e;line-height:1.6}
.mr-owner{display:flex;align-items:center;gap:6px}
.mr-owner-av{width:24px;height:24px;border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
.mr-next-card{background:linear-gradient(135deg,#f0f5ff,#faf5ff)}
.mr-next-info{display:flex;gap:32px}
.mrni-l{font-size:12px;color:#909399;display:block;margin-bottom:4px}
.mrni-v{font-size:15px;font-weight:600;color:#303133}
.mr-footer{text-align:center;padding:20px;color:#c0c4cc;font-size:12px;display:flex;justify-content:center;gap:16px}
</style>
