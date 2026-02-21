import { defineStore } from "pinia";
import { ref } from "vue";
import type { WorkflowNode, WorkflowEdge } from "@/types/workflow";
import type { Viewport } from "@vue-flow/core";
import { createEdgeId, createNodeId } from "@/utils/id";

export const useWorkflowStore = defineStore("workflow", () => {
  const nodes = ref<WorkflowNode[]>([]);
  const edges = ref<WorkflowEdge[]>([]);
  const viewport = ref<Viewport>({ x: 0, y: 0, zoom: 1 });
  const isDirty = ref(false);

  // Pending edges to be applied by the canvas after nodes are registered
  const pendingEdges = ref<WorkflowEdge[] | null>(null);

  function addNode(node: WorkflowNode) {
    nodes.value = [...nodes.value, node];
    isDirty.value = true;
  }

  function removeNode(nodeId: string) {
    const remainingEdges = edges.value.filter(
      (e) => (e as any).source !== nodeId && (e as any).target !== nodeId
    );
    nodes.value = nodes.value.filter((n) => n.id !== nodeId);
    edges.value = [];
    pendingEdges.value = remainingEdges;
    isDirty.value = true;
  }

  function updateNodeConfig(nodeId: string, config: Record<string, unknown>) {
    nodes.value = nodes.value.map((n) =>
      n.id === nodeId
        ? {
            ...n,
            data: {
              ...n.data,
              config: { ...n.data.config, ...config },
              label: (config.label as string) ?? n.data.label,
            },
          }
        : n
    );
    isDirty.value = true;
  }

  function updateNodePosition(
    nodeId: string,
    position: { x: number; y: number }
  ) {
    nodes.value = nodes.value.map((n) =>
      n.id === nodeId ? { ...n, position } : n
    );
    isDirty.value = true;
  }

  function updateNodeStatus(
    nodeId: string,
    status: WorkflowNode["data"]["status"]
  ) {
    nodes.value = nodes.value.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, status } } : n
    );
  }

  function resetAllStatuses() {
    nodes.value = nodes.value.map((n) => ({
      ...n,
      data: { ...n.data, status: "idle" },
    }));
  }

  function addEdge(
    source: string,
    target: string,
    sourceHandle?: string,
    targetHandle?: string
  ) {
    const id = createEdgeId(source, target);
    const newEdge: WorkflowEdge = {
      id,
      source,
      target,
      sourceHandle: sourceHandle ?? undefined,
      targetHandle: targetHandle ?? undefined,
      animated: false,
    };
    edges.value = [...edges.value, newEdge];
    isDirty.value = true;
  }

  function removeEdge(edgeId: string) {
    edges.value = edges.value.filter((e) => e.id !== edgeId);
    isDirty.value = true;
  }

  function updateEdgeAnimation(edgeId: string, animated: boolean) {
    edges.value = edges.value.map((e) =>
      e.id === edgeId ? { ...e, animated } : e
    );
  }

  function resetAllEdgeAnimations() {
    edges.value = edges.value.map((e) => ({ ...e, animated: false }));
  }

  function setViewport(vp: Viewport) {
    viewport.value = vp;
  }

  function setNodes(newNodes: WorkflowNode[]) {
    nodes.value = newNodes;
  }

  function setEdges(newEdges: WorkflowEdge[]) {
    edges.value = newEdges;
  }

  function loadWorkflow(data: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    viewport?: Viewport;
  }) {
    nodes.value = data.nodes;
    edges.value = [];
    pendingEdges.value = data.edges;
    if (data.viewport) viewport.value = data.viewport;
    isDirty.value = false;
  }

  function restoreSnapshot(snapshot: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  }) {
    nodes.value = snapshot.nodes;
    edges.value = [];
    pendingEdges.value = snapshot.edges;
    isDirty.value = true;
  }

  function consumePendingEdges(): WorkflowEdge[] | null {
    const pending = pendingEdges.value;
    pendingEdges.value = null;
    return pending;
  }

  function clear() {
    nodes.value = [];
    edges.value = [];
    isDirty.value = true;
  }

  function markClean() {
    isDirty.value = false;
  }

  function duplicateNode(nodeId: string) {
    const original = nodes.value.find((n) => n.id === nodeId);
    if (!original) return;
    const newNode: WorkflowNode = {
      ...original,
      id: createNodeId(),
      position: {
        x: original.position.x + 50,
        y: original.position.y + 50,
      },
      data: { ...original.data, status: "idle" },
      selected: false,
    };
    nodes.value = [...nodes.value, newNode];
    isDirty.value = true;
  }

  return {
    nodes,
    edges,
    viewport,
    isDirty,
    pendingEdges,
    addNode,
    removeNode,
    updateNodeConfig,
    updateNodePosition,
    updateNodeStatus,
    resetAllStatuses,
    addEdge,
    removeEdge,
    updateEdgeAnimation,
    resetAllEdgeAnimations,
    setViewport,
    setNodes,
    setEdges,
    loadWorkflow,
    clear,
    markClean,
    duplicateNode,
    restoreSnapshot,
    consumePendingEdges,
  };
});
