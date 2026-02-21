export type ExecutionStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "stopped";

export interface StepLog {
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  status: "running" | "success" | "error" | "skipped";
  message: string;
  timestamp: number;
  duration?: number;
}

export interface RunState {
  status: ExecutionStatus;
  logs: StepLog[];
  currentNodeId: string | null;
  startTime: number | null;
}
