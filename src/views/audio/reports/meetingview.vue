<template>
  <div class="fs-report">
    <!-- 标题区 -->
    <div class="fs-header">
      <h1 class="fs-title">{{ data.meetingTitle || data.title }}</h1>
      <p class="fs-subtitle">{{ data.summary }}</p>
      <div class="fs-meta">
        <span>{{ data.date }} · {{ data.duration || '90分钟' }}</span>
        <span>{{ data.location || '会议室' }}</span>
        <span>{{ (data.attendees||[]).map(a=>a.name||a).join('、') }} 参会</span>
      </div>
    </div>

    <!-- Section 01: 议题讨论 -->
    <div class="fs-section">
      <div class="fs-sec-head">
        <span class="fs-sec-badge" style="background:#A67C52;">01</span>
        <span class="fs-sec-title">议题讨论与决策</span>
      </div>
      <div class="fs-grid-2">
        <div v-for="(t,idx) in (data.topics||[])" :key="idx" class="fs-card">
          <div class="fsc-head">
            <span class="fsc-dot" :style="{background: t.decision ? '#67C23A' : '#E6A23C'}"></span>
            <span class="fsc-status" :style="{color: t.decision ? '#67C23A' : '#E6A23C'}">{{ t.decision ? '已决策' : '讨论中' }}</span>
            <span v-if="t.duration" class="fsc-time">{{ t.duration }}</span>
          </div>
          <div class="fsc-title">{{ t.topic }}</div>
          <ul class="fsc-list">
            <li>{{ t.discussion }}</li>
          </ul>
          <div v-if="t.decision" class="fsc-note">
            <strong>📌 结论：</strong>{{ t.decision }}
          </div>
        </div>
      </div>
    </div>

    <!-- Section 02: 决策记录 -->
    <div class="fs-section" v-if="(data.decisions||[]).length">
      <div class="fs-sec-head">
        <span class="fs-sec-badge" style="background:#E06666;">02</span>
        <span class="fs-sec-title">关键决策与共识</span>
      </div>
      <div class="fs-grid-3 decision-grid">
        <div v-for="(d,idx) in (data.decisions||[])" :key="idx" class="fs-card fs-decision-card">
          <div class="fsc-icon-circle" style="background:#FCE4EC;">
            <span style="color:#E06666;">✓</span>
          </div>
          <div class="fsc-title" style="font-size:13px;">{{ typeof d === 'string' ? d : d.text }}</div>
          <div v-if="typeof d === 'object' && d.impact" class="fsc-note" style="background:#FFF5F5;color:#E06666;margin-top:4px;">{{ d.impact }}</div>
        </div>
      </div>
    </div>

    <!-- Section 03: 待办事项 -->
    <div class="fs-section">
      <div class="fs-sec-head">
        <span class="fs-sec-badge" style="background:#3D85C6;">03</span>
        <span class="fs-sec-title">全局行动项汇总</span>
      </div>
      <div class="fs-table-wrap">
        <table class="fs-table">
          <thead><tr><th>行动项</th><th>负责人</th><th>时间节点</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-for="(a,idx) in (data.actionItems||[])" :key="idx">
              <td>{{ a.task }}</td>
              <td>
                <span class="fs-owner-chip" :style="{background: colorFor(a.owner)}">{{ a.owner[0] }}</span>
                {{ a.owner }}
              </td>
              <td>{{ a.deadline }}</td>
              <td>
                <span class="fs-status-tag" :class="a.status" :style="{background: statusBg(a.status), color: statusColor(a.status)}">
                  {{ statusText(a.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 04: 核心洞察与建议 -->
    <div class="fs-section" v-if="data.insights">
      <div class="fs-sec-head">
        <span class="fs-sec-badge" style="background:#6AA84F;">04</span>
        <span class="fs-sec-title">核心洞察与建议</span>
      </div>
      <div class="fs-insight-card">
        <div class="fsic-icon">🎯</div>
        <div class="fsic-text">{{ data.insights }}</div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="fs-footer">内容由 AI智能胸牌 自动生成 · {{ data.generateTime || '2026-05-19' }}</div>
  </div>
</template>

<script setup>
defineProps({ data: Object })

const colors = ['#3D85C6','#6AA84F','#E06666','#A67C52','#8E7CC3','#CC9933']
const colorFor = n => colors[((n||'').charCodeAt(0)||0) % colors.length]

const statusBg = s => s==='done'?'#E8F5E9':s==='urgent'?'#FFEBEE':s==='pending'?'#E3F2FD':'#F5F5F5'
const statusColor = s => s==='done'?'#2E7D32':s==='urgent'?'#C62828':s==='pending'?'#1565C0':'#666'
const statusText = s => s==='done'?'✓ 已完成':s==='urgent'?'⚠ 紧急':s==='pending'?'进行中':'待启动'
</script>

<style scoped>
.fs-report{max-width:960px;margin:0 auto;padding:32px 24px;background:#FAFBFC;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;}
.fs-header{text-align:center;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid #eee}
.fs-title{font-size:28px;font-weight:700;color:#1a1a2e;margin:0 0 12px}
.fs-subtitle{font-size:14px;color:#888;margin:0 auto 16px;max-width:640px;line-height:1.7}
.fs-meta{font-size:12px;color:#aaa;display:flex;justify-content:center;gap:20px}

.fs-section{margin-bottom:36px}
.fs-sec-head{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.fs-sec-badge{width:32px;height:24px;border-radius:6px;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.fs-sec-title{font-size:18px;font-weight:700;color:#222}

.fs-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fs-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.fs-grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}

.fs-card{background:#fff;border-radius:12px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.04);border:1px solid #f0f0f0;transition:.2s}
.fs-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.06)}
.fsc-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.fsc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.fsc-status{font-size:12px;font-weight:600}
.fsc-time{font-size:11px;color:#aaa;margin-left:auto}
.fsc-title{font-size:14px;font-weight:700;color:#222;margin-bottom:8px;line-height:1.5}
.fsc-list{margin:0;padding-left:16px;font-size:13px;color:#555;line-height:1.7}
.fsc-list li{margin-bottom:2px}
.fsc-note{margin-top:10px;padding:8px 12px;background:#FFF8E1;border-radius:8px;font-size:12px;color:#795548;line-height:1.6}

.fsc-icon-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;margin-bottom:8px}
.fs-decision-card{text-align:center;padding:16px 12px}

.fs-table-wrap{overflow-x:auto}
.fs-table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.fs-table thead{background:#E3F2FD}
.fs-table th{padding:12px 16px;text-align:left;font-size:13px;font-weight:700;color:#1565C0;border-bottom:2px solid #BBDEFB}
.fs-table td{padding:12px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0}
.fs-table tr:last-child td{border-bottom:none}
.fs-owner-chip{display:inline-flex;width:22px;height:22px;border-radius:50%;color:#fff;font-size:11px;font-weight:700;align-items:center;justify-content:center;margin-right:6px;vertical-align:middle}
.fs-status-tag{display:inline-block;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:600}

.fs-insight-card{display:flex;gap:16px;align-items:flex-start;background:#E8F5E9;border-radius:12px;padding:20px}
.fsic-icon{font-size:28px;flex-shrink:0}
.fsic-text{font-size:14px;color:#2E7D32;line-height:1.8}

.fs-footer{text-align:center;padding:24px;color:#ccc;font-size:11px}
</style>
