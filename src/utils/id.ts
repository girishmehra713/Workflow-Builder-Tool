import { nanoid } from "nanoid";

export function createNodeId(): string {
  return `node_${nanoid(8)}`;
}

export function createEdgeId(source: string, target: string): string {
  return `edge_${source}_${target}_${nanoid(4)}`;
}
