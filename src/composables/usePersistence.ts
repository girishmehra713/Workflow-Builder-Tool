import { watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useWorkflowStore } from "../stores/workflowStore";
import { saveToStorage, loadFromStorage } from "../utils/storage";
import type { WorkflowData } from "../types/workflow";

export function usePersistence() {
  const workflowStore = useWorkflowStore();

  const debouncedSave = useDebounceFn(() => {
    save();
  }, 2000);

  function save() {
    const data: WorkflowData = {
      nodes: workflowStore.nodes,
      edges: workflowStore.edges,
      viewport: workflowStore.viewport,
    };
    saveToStorage(data);
    workflowStore.markClean();
  }

  function load(): boolean {
    const data = loadFromStorage<WorkflowData>();
    if (data && data.nodes) {
      workflowStore.loadWorkflow(data);
      return true;
    }
    return false;
  }

  function startAutoSave() {
    watch(
      [() => workflowStore.nodes, () => workflowStore.edges],
      () => {
        if (workflowStore.isDirty) {
          debouncedSave();
        }
      },
      { deep: true }
    );
  }

  return {
    save,
    load,
    startAutoSave,
  };
}
