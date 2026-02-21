import { useWorkflowStore } from "../stores/workflowStore";
import { useHistory } from "./useHistory";
import { createWorkflowNode } from "../utils/nodeFactory";
import type { NodeType } from "../types/nodes";

export function useNodeDrop() {
  const workflowStore = useWorkflowStore();
  const { pushSnapshot } = useHistory();

  function onDragStart(event: DragEvent, nodeType: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData("application/workflow-node", nodeType);
      event.dataTransfer.effectAllowed = "move";
    }
  }

  function onDrop(
    event: DragEvent,
    screenToFlowPosition: (pos: { x: number; y: number }) => {
      x: number;
      y: number;
    }
  ) {
    const nodeType = event.dataTransfer?.getData("application/workflow-node");
    if (!nodeType) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    pushSnapshot();
    const node = createWorkflowNode(nodeType as NodeType, position);
    workflowStore.addNode(node);
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  return {
    onDragStart,
    onDrop,
    onDragOver,
  };
}
