import type { WorkflowNode } from "@/types/workflow";
import type { NodeType } from "@/types/nodes";
import { createNodeId } from "./id";
import { NODE_REGISTRY } from "@/data/nodeRegistry";

export function createWorkflowNode(
  nodeType: NodeType,
  position: { x: number; y: number }
): WorkflowNode {
  const definition = NODE_REGISTRY[nodeType];
  if (!definition) throw new Error(`Unknown node type: ${nodeType}`);

  return {
    id: createNodeId(),
    type: nodeType,
    position,
    data: {
      label: definition.label,
      nodeType: nodeType,
      config: { ...definition.defaults },
      status: "idle",
    },
  };
}
