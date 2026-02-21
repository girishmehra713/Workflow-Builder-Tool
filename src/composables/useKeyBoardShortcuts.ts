import { onMounted, onUnmounted } from "vue";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUiStore } from "@/stores/uiStore";
import { useHistory } from "@/composables/useHistory";

export function useKeyboardShortcuts() {
  const workflowStore = useWorkflowStore();
  const uiStore = useUiStore();
  const { undo, redo, pushSnapshot } = useHistory();

  function handleKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    ) {
      return;
    }

    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
      e.preventDefault();
      undo();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") {
      e.preventDefault();
      redo();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      redo();
      return;
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const selectedNodes = workflowStore.nodes.filter(
        (n: { selected: boolean }) => n.selected
      );
      const selectedEdges = workflowStore.edges.filter(
        (edge: { selected: boolean }) => edge.selected
      );
      if (selectedNodes.length > 0 || selectedEdges.length > 0) {
        e.preventDefault();
        pushSnapshot();
        selectedNodes.forEach((n: { id: string }) =>
          workflowStore.removeNode(n.id)
        );
        selectedEdges.forEach((edge: { id: string }) =>
          workflowStore.removeEdge(edge.id)
        );
      }
      return;
    }

    if (e.key === "Escape") {
      uiStore.closeConfigPanel();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      workflowStore.setNodes(
        workflowStore.nodes.map((n: { [key: string]: any }) => ({
          ...n,
          selected: true,
        }))
      );
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault();
      const selected = workflowStore.nodes.filter(
        (n: { selected: boolean }) => n.selected
      );
      if (selected.length > 0) {
        pushSnapshot();
        selected.forEach((n: { id: string }) =>
          workflowStore.duplicateNode(n.id)
        );
      }
      return;
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
}
