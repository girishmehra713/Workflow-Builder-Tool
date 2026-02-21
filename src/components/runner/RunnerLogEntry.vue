<script setup lang="ts">
import { Loader2, Check, X, Circle, Minus } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { StepLog } from '../../types/runner'

defineProps<{
  log: StepLog
}>()

const STATUS_ICONS: Record<string, Component> = {
  running: Loader2,
  success: Check,
  error: X,
  skipped: Circle,
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString()
}

function statusIcon(status: string): Component {
  return STATUS_ICONS[status] ?? Minus
}

function statusColor(status: string): string {
  switch (status) {
    case 'running': return 'text-blue-400'
    case 'success': return 'text-green-400'
    case 'error': return 'text-red-400'
    case 'skipped': return 'text-gray-500'
    default: return 'text-gray-400'
  }
}
</script>

<template>
  <div class="flex items-start gap-2 px-3 py-1.5 text-xs hover:bg-[var(--color-surface-hover)] transition-colors">
    <span :class="[statusColor(log.status), log.status === 'running' && 'animate-spin']"
      class="shrink-0 flex items-center">
      <component :is="statusIcon(log.status)" :size="14" />
    </span>
    <span class="text-[var(--color-text-muted)] shrink-0 font-mono w-16">
      {{ formatTime(log.timestamp) }}
    </span>
    <span class="font-medium text-[var(--color-text)] shrink-0 w-28 truncate">
      {{ log.nodeLabel }}
    </span>
    <span class="text-[var(--color-text-muted)] flex-1 truncate">
      {{ log.message }}
    </span>
    <span v-if="log.duration" class="text-[var(--color-text-muted)] shrink-0 font-mono">
      {{ log.duration }}ms
    </span>
  </div>
</template>
