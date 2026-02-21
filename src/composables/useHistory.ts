import { useHistoryStore } from "../stores/historyStore";
import { useWorkflowStore } from "../stores/workflowStore";
import type { WorkflowSnapshot } from "../types/history";

export function useHistory() {
  const historyStore = useHistoryStore();
  const workflowStore = useWorkflowStore();

  function getCurrentSnapshot(): WorkflowSnapshot {
    return {
      nodes: JSON.parse(JSON.stringify(workflowStore.nodes)),
      edges: JSON.parse(JSON.stringify(workflowStore.edges)),
    };
  }

  function pushSnapshot() {
    historyStore.pushSnapshot(getCurrentSnapshot());
  }

  function undo() {
    const snapshot = historyStore.undo(getCurrentSnapshot());
    if (snapshot) {
      workflowStore.restoreSnapshot(snapshot);
    }
  }

  function redo() {
    const snapshot = historyStore.redo(getCurrentSnapshot());
    if (snapshot) {
      workflowStore.restoreSnapshot(snapshot);
    }
  }

  return {
    pushSnapshot,
    undo,
    redo,
    canUndo: historyStore.canUndo,
    canRedo: historyStore.canRedo,
  };
}
