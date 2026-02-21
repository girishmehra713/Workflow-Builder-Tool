<script setup lang="ts">
import { computed } from 'vue'
import { getNodesByCategory } from '@/data/nodeRegistry'
import { useNodeDrop } from '@/composables/useNodeDrop'
import PaletteCategory from './PaletteCategory.vue'

const { onDragStart } = useNodeDrop()

const categories = computed(() => [
  { title: 'Triggers', nodes: getNodesByCategory('trigger') },
  { title: 'Actions', nodes: getNodesByCategory('action') },
  { title: 'Logic', nodes: getNodesByCategory('logic') },
])
</script>

<template>
  <aside
    class="w-56 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col shrink-0 overflow-hidden">
    <div class="px-3 py-2.5 border-b border-[var(--color-border)]">
      <h2 class="text-xs font-semibold text-[var(--color-text)]">Node Palette</h2>
    </div>
    <div class="flex-1 overflow-y-auto py-2 flex flex-col gap-2">
      <PaletteCategory v-for="cat in categories" :key="cat.title" :title="cat.title" :nodes="cat.nodes"
        @dragstart="onDragStart" />
    </div>
  </aside>
</template>
