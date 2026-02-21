import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const selectedNodeId = ref<string | null>(null);
  const configPanelOpen = ref(false);
  const runnerPanelOpen = ref(false);
  const snapToGrid = ref(true);
  const gridSize = ref(20);

  function selectNode(nodeId: string | null) {
    selectedNodeId.value = nodeId;
    configPanelOpen.value = !!nodeId;
  }

  function closeConfigPanel() {
    selectedNodeId.value = null;
    configPanelOpen.value = false;
  }

  function toggleRunnerPanel() {
    runnerPanelOpen.value = !runnerPanelOpen.value;
  }

  function openRunnerPanel() {
    runnerPanelOpen.value = true;
  }

  function closeRunnerPanel() {
    runnerPanelOpen.value = false;
  }

  function toggleSnapToGrid() {
    snapToGrid.value = !snapToGrid.value;
  }

  return {
    selectedNodeId,
    configPanelOpen,
    runnerPanelOpen,
    snapToGrid,
    gridSize,
    selectNode,
    closeConfigPanel,
    toggleRunnerPanel,
    openRunnerPanel,
    closeRunnerPanel,
    toggleSnapToGrid,
  };
});
