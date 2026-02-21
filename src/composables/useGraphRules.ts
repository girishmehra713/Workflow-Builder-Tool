import { useWorkflowStore } from "../stores/workflowStore";
import { wouldCreateCycle } from "../utils/graph";
import type { Connection } from "@vue-flow/core";

export function useGraphRules() {
  const workflowStore = useWorkflowStore();

  function isValidConnection(connection: Connection): boolean {
    // No self-connections
    if (connection.source === connection.target) return false;

    // No duplicate edges
    const exists = workflowStore.edges.some(
      (e: any) =>
        e.source === connection.source &&
        e.target === connection.target &&
        (e.sourceHandle ?? null) === (connection.sourceHandle ?? null)
    );
    if (exists) return false;

    if (
      wouldCreateCycle(
        workflowStore.edges,
        connection.source,
        connection.target
      )
    ) {
      return false;
    }

    return true;
  }

  return {
    isValidConnection,
  };
}
