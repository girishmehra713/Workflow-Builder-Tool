<script setup lang="ts">
import { EdgeLabelRenderer } from '@vue-flow/core'

defineProps<{
  label: string
  labelX: number
  labelY: number
  color?: string
}>()
</script>

<template>
  <EdgeLabelRenderer>
    <div class="absolute text-[10px] font-medium px-1.5 py-0.5 rounded pointer-events-none" :style="{
      transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
      background: color ?? 'var(--color-surface)',
      color: color ? 'white' : 'var(--color-text-muted)',
      border: '1px solid var(--color-border)',
    }">
      {{ label }}
    </div>
  </EdgeLabelRenderer>
</template>
