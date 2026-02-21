<script setup lang="ts">
import { computed } from 'vue'
import { useWorkflowStore } from '@/stores/workflowStore'
import { useUiStore } from '@/stores/uiStore'

const workflowStore = useWorkflowStore()
const uiStore = useUiStore()

const nodeCount = computed(() => workflowStore.nodes.length)
const edgeCount = computed(() => workflowStore.edges.length)
</script>

<template>
  <footer
    class="h-7 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-between px-4 text-[10px] text-[var(--color-text-muted)] shrink-0">
    <div class="flex items-center gap-3">
      <span>Nodes: {{ nodeCount }}</span>
      <span>Edges: {{ edgeCount }}</span>
    </div>
    <div class="flex items-center gap-3">
      <button @click="uiStore.toggleSnapToGrid()" class="hover:text-[var(--color-text)] transition-colors"
        :class="{ 'text-[var(--color-primary)]': uiStore.snapToGrid }">
        Grid: {{ uiStore.snapToGrid ? 'ON' : 'OFF' }}
      </button>
    </div>
  </footer>
</template>
