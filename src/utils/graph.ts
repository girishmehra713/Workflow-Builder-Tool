import type { WorkflowNode, WorkflowEdge } from "@/types/workflow";

export function topologicalSort(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): string[] | null {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adjacency.set(id, []);
  }

  for (const edge of edges) {
    const source = (edge as any).source;
    const target = (edge as any).target;
    if (!nodeIds.has(source) || !nodeIds.has(target)) continue;
    adjacency.get(source)!.push(target);
    inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const neighbor of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  return sorted.length === nodeIds.size ? sorted : null;
}

export function wouldCreateCycle(
  edges: WorkflowEdge[],
  newSource: string,
  newTarget: string
): boolean {
  const adj = new Map<string, string[]>();
  for (const edge of edges) {
    const source = (edge as any).source;
    const target = (edge as any).target;
    if (!adj.has(source)) adj.set(source, []);
    adj.get(source)!.push(target);
  }
  if (!adj.has(newSource)) adj.set(newSource, []);
  adj.get(newSource)!.push(newTarget);

  const visited = new Set<string>();
  const stack = [newTarget];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node === newSource) return true;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const neighbor of adj.get(node) ?? []) {
      stack.push(neighbor);
    }
  }
  return false;
}

export function getDownstreamNodes(
  edges: WorkflowEdge[],
  sourceId: string
): Set<string> {
  const adj = new Map<string, string[]>();
  for (const edge of edges) {
    const source = (edge as any).source;
    const target = (edge as any).target;
    if (!adj.has(source)) adj.set(source, []);
    adj.get(source)!.push(target);
  }

  const downstream = new Set<string>();
  const stack = [sourceId];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (downstream.has(node)) continue;
    if (node !== sourceId) downstream.add(node);
    for (const neighbor of adj.get(node) ?? []) {
      stack.push(neighbor);
    }
  }
  return downstream;
}
