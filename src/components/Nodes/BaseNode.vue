<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'
import { Zap } from 'lucide-vue-next'
import { NODE_REGISTRY } from '../../data/nodeRegistry';

const props = defineProps<{
  id: string
  data: {
    label: string
    nodeType: string
    config: Record<string, unknown>
    status?: string
  }
  selected?: boolean
}>()

const definition = computed(() => NODE_REGISTRY[props.data.nodeType as keyof typeof NODE_REGISTRY])

const statusClass = computed(() => {
  switch (props.data.status) {
    case 'running': return 'node-running'
    case 'success': return 'node-success'
    case 'error': return 'node-error'
    case 'skipped': return 'node-skipped'
    default: return ''
  }
})

const statusBadge = computed(() => {
  switch (props.data.status) {
    case 'running': return { text: 'Running', color: 'bg-blue-500' }
    case 'success': return { text: 'Done', color: 'bg-green-500' }
    case 'error': return { text: 'Error', color: 'bg-red-500' }
    case 'skipped': return { text: 'Skipped', color: 'bg-gray-500' }
    default: return null
  }
})

const handles = computed(() => definition.value?.handles ?? [])

function positionToVueFlow(pos: string): Position {
  const map: Record<string, Position> = {
    top: Position.Top,
    bottom: Position.Bottom,
    left: Position.Left,
    right: Position.Right,
  }
  return map[pos] ?? Position.Bottom
}
</script>

<template>
  <div class="rounded-lg border-2 shadow-lg min-w-[180px] max-w-[220px] transition-all" :class="[
    statusClass,
    selected ? 'border-blue-400' : 'border-[var(--color-border)]',
  ]" :style="{ background: 'var(--color-surface)' }">
    <div class="px-3 py-2 rounded-t-md flex items-center gap-2 text-white text-sm font-medium"
      :style="{ background: definition?.color ?? '#475569' }">
      <component :is="definition?.icon ?? Zap" :size="16" class="shrink-0 text-white" />
      <span class="truncate">{{ data.label }}</span>
    </div>

    <div class="px-3 py-2 text-xs text-[var(--color-text-muted)]">
      <slot>
        <span>{{ definition?.description ?? '' }}</span>
      </slot>
    </div>

    <div v-if="statusBadge" class="px-3 pb-2">
      <span class="text-[10px] font-medium px-2 py-0.5 rounded-full text-white" :class="statusBadge.color">
        {{ statusBadge.text }}
      </span>
    </div>

    <Handle v-for="handle in handles" :key="handle.id" :id="handle.id" :type="handle.type"
      :position="positionToVueFlow(handle.position)" class="!w-3 !h-3" />
  </div>
</template>
