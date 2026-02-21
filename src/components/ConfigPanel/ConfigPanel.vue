<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useWorkflowStore } from '@/stores/workflowStore'
import { useUiStore } from '@/stores/uiStore'
import { useHistory } from '@/composables/useHistory'
import { NODE_REGISTRY } from '@/data/nodeRegistry'
import SchemaForm from './SchemaForm.vue'

const workflowStore = useWorkflowStore()
const uiStore = useUiStore()
const { pushSnapshot } = useHistory()

const isValid = ref(false)
const formData = ref<Record<string, unknown>>({})

const selectedNode = computed(() =>
  workflowStore.nodes.find((n: any) => n.id === uiStore.selectedNodeId)
)

const definition = computed(() =>
  selectedNode.value ? NODE_REGISTRY[selectedNode.value.data.nodeType] : null
)

watch(selectedNode, (node) => {
  if (node) {
    formData.value = { ...node.data.config }
  }
}, { immediate: true })

function handleSave() {
  if (!selectedNode.value || !isValid.value) return
  pushSnapshot()
  workflowStore.updateNodeConfig(selectedNode.value.id, formData.value)
}

function handleDelete() {
  if (!selectedNode.value) return
  pushSnapshot()
  workflowStore.removeNode(selectedNode.value.id)
  uiStore.closeConfigPanel()
}

function handleClose() {
  uiStore.closeConfigPanel()
}
</script>

<template>
  <aside v-if="uiStore.configPanelOpen && selectedNode && definition"
    class="w-72 bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col shrink-0 overflow-hidden">

    <div class="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border)]">
      <div class="flex items-center gap-2 min-w-0">
        <span class="w-5 h-5 rounded flex items-center justify-center text-white shrink-0"
          :style="{ background: definition.color }">
          <component :is="definition.icon" :size="14" />
        </span>
        <span class="text-xs font-semibold text-[var(--color-text)] truncate">
          {{ selectedNode.data.label }}
        </span>
      </div>
      <button @click="handleClose"
        class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm transition-colors" title="Close">
        ✕
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-3">
      <SchemaForm :schema="definition.schema" v-model="formData" @update:is-valid="isValid = $event" />
    </div>

    <div class="flex gap-2 p-3 border-t border-[var(--color-border)]">
      <button @click="handleSave" :disabled="!isValid"
        class="flex-1 px-3 py-1.5 text-xs font-medium rounded text-white transition-colors"
        :class="isValid ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]' : 'bg-gray-600 cursor-not-allowed opacity-50'">
        Save
      </button>
      <button @click="handleDelete"
        class="px-3 py-1.5 text-xs font-medium rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors">
        Delete
      </button>
    </div>
  </aside>
</template>
