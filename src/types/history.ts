import type { WorkflowNode, WorkflowEdge } from "./workflow";

export interface WorkflowSnapshot {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface HistoryEntry {
  snapshot: WorkflowSnapshot;
  timestamp: number;
  description: string;
}
