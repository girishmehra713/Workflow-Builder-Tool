import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { produce } from "immer";
import type { WorkflowSnapshot } from "../types/history";

const MAX_HISTORY = 50;

export const useHistoryStore = defineStore("history", () => {
  const undoStack = ref<WorkflowSnapshot[]>([]);
  const redoStack = ref<WorkflowSnapshot[]>([]);

  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);

  function pushSnapshot(snapshot: WorkflowSnapshot) {
    const immutable = produce(snapshot, () => {});
    undoStack.value = [...undoStack.value.slice(-MAX_HISTORY + 1), immutable];
    redoStack.value = [];
  }

  function undo(currentSnapshot: WorkflowSnapshot): WorkflowSnapshot | null {
    if (undoStack.value.length === 0) return null;
    const previous = undoStack.value[undoStack.value.length - 1] ?? null;
    undoStack.value = undoStack.value.slice(0, -1);
    redoStack.value = [...redoStack.value, produce(currentSnapshot, () => {})];
    return previous;
  }

  function redo(currentSnapshot: WorkflowSnapshot): WorkflowSnapshot | null {
    if (redoStack.value.length === 0) return null;
    const next = redoStack.value[redoStack.value.length - 1] ?? null;
    redoStack.value = redoStack.value.slice(0, -1);
    undoStack.value = [...undoStack.value, produce(currentSnapshot, () => {})];
    return next;
  }

  function clear() {
    undoStack.value = [];
    redoStack.value = [];
  }

  return {
    undoStack,
    redoStack,
    canUndo,
    canRedo,
    pushSnapshot,
    undo,
    redo,
    clear,
  };
});
