<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWorkflowStore } from '../../stores/workflowStore'
import { useHistoryStore } from '../../stores/historyStore'
import { useRunnerStore } from '../../stores/runnerStore'
import { useHistory } from '../../composables/useHistory'
import { usePersistence } from '../../composables/usePersistence'
import { useWorkflowRunner } from '../../composables/useWorkflowRunner'
import leadWelcome from '../../data/samples/lead-welcome.json'
import abandonedCart from '../../data/samples/abandoned-cart.json'

const workflowStore = useWorkflowStore()
const historyStore = useHistoryStore()
const runnerStore = useRunnerStore()
const { undo, redo } = useHistory()
const { save } = usePersistence()
const { run, stop } = useWorkflowRunner()

const canUndo = computed(() => historyStore.canUndo)
const canRedo = computed(() => historyStore.canRedo)
const isDirty = computed(() => workflowStore.isDirty)
const showSamples = ref(false)

function handleSave() {
  save()
}

function handleRun() {
  if (runnerStore.isRunning) {
    stop()
  } else {
    run()
  }
}

function handleClear() {
  if (confirm('Clear all nodes and edges?')) {
    workflowStore.clear()
  }
}

function loadSample(sample: any) {
  workflowStore.loadWorkflow(sample)
  showSamples.value = false
}
</script>

<template>
  <header
    class="h-12 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 shrink-0">
    <div class="flex items-center gap-3">
      <h1 class="text-sm font-semibold text-[var(--color-text)]">Workflow Builder</h1>
      <span v-if="isDirty" class="text-[10px] text-[var(--color-warning)] font-medium">Unsaved</span>
    </div>

    <div class="flex items-center gap-1">
      <button @click="undo" :disabled="!canUndo"
        class="px-2 py-1 text-xs rounded hover:bg-[var(--color-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Undo (Ctrl+Z)">
        Undo
      </button>
      <button @click="redo" :disabled="!canRedo"
        class="px-2 py-1 text-xs rounded hover:bg-[var(--color-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Redo (Ctrl+Shift+Z)">
        Redo
      </button>

      <div class="w-px h-5 bg-[var(--color-border)] mx-1"></div>

      <div class="relative">
        <button @click="showSamples = !showSamples"
          class="px-2 py-1 text-xs rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] transition-colors"
          title="Load sample workflow">
          Samples
        </button>
        <div v-if="showSamples"
          class="absolute top-full left-0 mt-1 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl z-50">
          <button @click="loadSample(leadWelcome)"
            class="w-full text-left px-3 py-2 text-xs hover:bg-[var(--color-surface-hover)] transition-colors rounded-t-lg">
            Lead Welcome Flow
          </button>
          <button @click="loadSample(abandonedCart)"
            class="w-full text-left px-3 py-2 text-xs hover:bg-[var(--color-surface-hover)] transition-colors rounded-b-lg">
            Abandoned Cart Flow
          </button>
        </div>
      </div>

      <button @click="handleSave"
        class="px-3 py-1 text-xs rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-colors"
        title="Save">
        Save
      </button>

      <button @click="handleRun" class="px-3 py-1 text-xs rounded text-white transition-colors"
        :class="runnerStore.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
        :title="runnerStore.isRunning ? 'Stop' : 'Run'">
        {{ runnerStore.isRunning ? 'Stop' : 'Run' }}
      </button>

      <button @click="handleClear"
        class="px-2 py-1 text-xs rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] transition-colors"
        title="Clear canvas">
        Clear
      </button>
    </div>
  </header>
</template>
