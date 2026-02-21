<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { computed, watch, nextTick } from 'vue'

import { useUiStore } from '@/stores/uiStore'
import { useHistory } from '@/composables/useHistory'
import { useGraphRules } from '@/composables/useGraphRules'
import { useNodeDrop } from '@/composables/useNodeDrop'
import type { Connection, NodeDragEvent } from '@vue-flow/core'
import { useWorkflowStore } from '@/stores/workflowStore'
import { NODE_REGISTRY } from '@/data/nodeRegistry'

const workflowStore = useWorkflowStore();
const uiStore = useUiStore();
const { pushSnapshot } = useHistory();
const { isValidConnection } = useGraphRules();
const { onDrop, onDragOver } = useNodeDrop();


const nodeTypes = computed(() => {
  const types: Record<string, any> = {}
  for (const [key, def] of Object.entries(NODE_REGISTRY)) {
    types[key] = def.component
  }
  return types
})

const { screenToFlowCoordinate, onNodeDragStop, onPaneReady, setEdges, addEdges } = useVueFlow({
  id: 'workflow-canvas',
})

onPaneReady((instance) => {
  if (workflowStore.viewport) {
    instance.setViewport(workflowStore.viewport)
  }
})

watch(
  () => workflowStore.pendingEdges,
  (pending) => {
    if (pending && pending.length > 0) {
      // Wait for VueFlow to register the new nodes
      nextTick(() => {
        nextTick(() => {
          const edgesToApply = workflowStore.consumePendingEdges()
          if (edgesToApply && edgesToApply.length > 0) {
            setEdges(edgesToApply)
          }
        })
      })
    }
  },
  { immediate: true }
)


function handleConnect(connection: Connection) {
  if (!isValidConnection(connection)) return
  pushSnapshot()
  const edgeId = `${connection.source}-${connection.sourceHandle ?? 'default'}-${connection.target}`
  addEdges([{
    id: edgeId,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    type: 'smoothstep',
    animated: false,
  }])
}

onNodeDragStop((event: NodeDragEvent) => {
  pushSnapshot()
  if (event.node) {
    workflowStore.updateNodePosition(event.node.id, event.node.position)
  }
})

function handleNodeClick({ node }: { node: { id: string } }) {
  uiStore.selectNode(node.id)
}

function handlePaneClick() {
  uiStore.closeConfigPanel()
}

function handleDrop(event: DragEvent) {
  onDrop(event, screenToFlowCoordinate)
}

function handleViewportChange(viewport: { x: number; y: number; zoom: number }) {
  workflowStore.setViewport(viewport)
}
</script>

<template>
  <div class="flex-1 relative" @drop="handleDrop" @dragover="onDragOver">
    <VueFlow v-model:nodes="workflowStore.nodes" v-model:edges="workflowStore.edges" :node-types="nodeTypes"
      :snap-to-grid="uiStore.snapToGrid" :snap-grid="[uiStore.gridSize, uiStore.gridSize]"
      :is-valid-connection="isValidConnection" :fit-view-on-init="false"
      :default-edge-options="{ type: 'smoothstep', animated: false }" :min-zoom="0.2" :max-zoom="4"
      :delete-key-code="null" @connect="handleConnect" @node-click="handleNodeClick" @pane-click="handlePaneClick"
      @viewport-change="handleViewportChange" class="h-full">
      <Background :gap="uiStore.gridSize" :size="1" pattern-color="#1e293b" />
      <Controls position="bottom-left" />
      <MiniMap position="bottom-right" />
    </VueFlow>
  </div>
</template>
