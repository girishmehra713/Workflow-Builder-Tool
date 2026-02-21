<script setup lang="ts">
import type { NodeDefinition } from 'src/types/nodes.ts'

defineProps<{
  definition: NodeDefinition
}>()

const emit = defineEmits<{
  dragstart: [event: DragEvent, nodeType: string]
}>()

function onDragStart(event: DragEvent, nodeType: string) {
  emit('dragstart', event, nodeType)
}
</script>

<template>
  <div
    class="flex items-center gap-2 px-3 py-2 rounded-md cursor-grab active:cursor-grabbing hover:bg-[var(--color-surface-hover)] border border-transparent hover:border-[var(--color-border)] transition-all select-none"
    draggable="true" @dragstart="onDragStart($event, definition.type)"
    :aria-label="`Drag ${definition.label} node to canvas`">
    <span class="w-6 h-6 rounded flex items-center justify-center text-white shrink-0"
      :style="{ background: definition.color }">
      <component :is="definition.icon" :size="14" />
    </span>
    <div class="min-w-0">
      <div class="text-xs font-medium text-[var(--color-text)] truncate">{{ definition.label }}</div>
      <div class="text-[10px] text-[var(--color-text-muted)] truncate">{{ definition.description }}</div>
    </div>
  </div>
</template>
