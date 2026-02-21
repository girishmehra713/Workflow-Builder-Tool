import type { Node, Edge, Viewport } from "@vue-flow/core";

export interface WorkflowNode extends Node {
  data: {
    label: string;
    nodeType: string;
    config: Record<string, unknown>;
    status?: "idle" | "running" | "success" | "error" | "skipped";
  };
}

export interface WorkflowEdge extends Edge {
  data?: {
    label?: string;
  };
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: Viewport;
}
