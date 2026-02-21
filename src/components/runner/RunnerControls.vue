<script setup lang="ts">
import { useRunnerStore } from '../../stores/runnerStore'
import { useWorkflowRunner } from '../../composables/useWorkflowRunner'

const runnerStore = useRunnerStore()
const { run, pause, resume, stop, reset } = useWorkflowRunner()
</script>

<template>
  <div class="flex items-center gap-1">
    <button v-if="runnerStore.isIdle || runnerStore.status === 'completed' || runnerStore.status === 'stopped'"
      @click="run" class="px-2 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white transition-colors"
      title="Run workflow">
      Run
    </button>

    <button v-if="runnerStore.isPaused" @click="resume"
      class="px-2 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white transition-colors" title="Resume">
      Resume
    </button>

    <button v-if="runnerStore.isRunning" @click="pause"
      class="px-2 py-1 text-xs rounded bg-yellow-600 hover:bg-yellow-700 text-white transition-colors" title="Pause">
      Pause
    </button>


    <button v-if="runnerStore.isRunning || runnerStore.isPaused" @click="stop"
      class="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white transition-colors" title="Stop">
      Stop
    </button>


    <button v-if="runnerStore.status === 'completed' || runnerStore.status === 'stopped'" @click="reset"
      class="px-2 py-1 text-xs rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] transition-colors"
      title="Reset">
      Reset
    </button>

    <span class="ml-2 text-[10px] font-medium" :class="{
      'text-green-400': runnerStore.status === 'running',
      'text-yellow-400': runnerStore.status === 'paused',
      'text-blue-400': runnerStore.status === 'completed',
      'text-red-400': runnerStore.status === 'stopped',
      'text-gray-400': runnerStore.status === 'idle',
    }">
      {{ runnerStore.status.toUpperCase() }}
    </span>
  </div>
</template>
