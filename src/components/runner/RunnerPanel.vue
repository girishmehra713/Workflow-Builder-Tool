<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import RunnerControls from './RunnerControls.vue'
import RunnerLog from './RunnerLog.vue'

const uiStore = useUiStore()
</script>

<template>
  <div v-if="uiStore.runnerPanelOpen"
    class="h-48 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex flex-col shrink-0">
    <div class="flex items-center justify-between px-3 py-1.5 border-b border-[var(--color-border)]">
      <div class="flex items-center gap-3">
        <h3 class="text-xs font-semibold text-[var(--color-text)]">Execution Log</h3>
        <RunnerControls />
      </div>
      <button @click="uiStore.closeRunnerPanel()"
        class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm transition-colors" title="Close">
        ✕
      </button>
    </div>
    <RunnerLog />
  </div>
</template>
