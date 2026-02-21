<script setup lang="ts">
import { ref } from 'vue'
import type { NodeDefinition } from '@/types/nodes'
import PaletteItem from './PaletteItem.vue'

defineProps<{
  title: string
  nodes: NodeDefinition[]
}>()

const emit = defineEmits<{
  dragstart: [event: DragEvent, nodeType: string]
}>()

const expanded = ref(true)
</script>

<template>
  <div>
    <button @click="expanded = !expanded"
      class="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
      <span>{{ title }}</span>
      <span class="text-xs">{{ expanded ? '▾' : '▸' }}</span>
    </button>
    <div v-if="expanded" class="flex flex-col gap-0.5">
      <PaletteItem v-for="node in nodes" :key="node.type" :definition="node"
        @dragstart="(e, t) => emit('dragstart', e, t)" />
    </div>
  </div>
</template>
