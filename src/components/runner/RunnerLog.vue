<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRunnerStore } from '@/stores/runnerStore'
import RunnerLogEntry from './RunnerLogEntry.vue'

const runnerStore = useRunnerStore()
const logContainer = ref<HTMLElement>()

watch(() => runnerStore.logs.length, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})
</script>

<template>
  <div ref="logContainer" class="flex-1 overflow-y-auto">
    <div v-if="runnerStore.logs.length === 0"
      class="flex items-center justify-center h-full text-xs text-[var(--color-text-muted)]">
      No logs yet. Click Run to start.
    </div>
    <div v-else class="py-1">
      <RunnerLogEntry v-for="(log, i) in runnerStore.logs" :key="i" :log="log" />
    </div>
  </div>
</template>
