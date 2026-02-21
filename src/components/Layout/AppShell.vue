<script setup lang="ts">
import TopBar from './TopBar.vue'
import StatusBar from './StatusBar.vue'
import NodePalette from '../Palette/NodePalette.vue'
import WorkflowCanvas from '../Canvas/WorkflowCanvas.vue'
import ConfigPanel from '../ConfigPanel/ConfigPanel.vue'
import RunnerPanel from '../runner/RunnerPanel.vue'
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden">
    <TopBar />

    <div class="flex flex-1 overflow-hidden">
      <NodePalette />

      <div class="flex flex-col flex-1 overflow-hidden">
        <WorkflowCanvas />
        <RunnerPanel />
      </div>

      <ConfigPanel />
    </div>

    <StatusBar />
  </div>
</template>