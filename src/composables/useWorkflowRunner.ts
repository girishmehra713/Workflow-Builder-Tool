import { useWorkflowStore } from "@/stores/workflowStore";
import { useRunnerStore } from "@/stores/runnerStore";
import { useUiStore } from "@/stores/uiStore";
import { topologicalSort } from "@/utils/graph";
import { NodeType } from "@/types/nodes";

let abortController: AbortController | null = null;
let pauseResolve: (() => void) | null = null;

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("Aborted"));
    });
  });
}

export function useWorkflowRunner() {
  const workflowStore = useWorkflowStore();
  const runnerStore = useRunnerStore();
  const uiStore = useUiStore();

  async function waitIfPaused() {
    if (runnerStore.isPaused) {
      await new Promise<void>((resolve) => {
        pauseResolve = resolve;
      });
    }
  }

  function evaluateCondition(
    config: Record<string, unknown>,
    _context: Record<string, unknown>
  ): boolean {
    const { field, operator, value } = config as {
      field: string;
      operator: string;
      value: string;
    };
    const fieldValue = String(_context[field] ?? "");

    switch (operator) {
      case "equals":
        return fieldValue === value;
      case "not_equals":
        return fieldValue !== value;
      case "contains":
        return fieldValue.includes(value);
      case "greater_than":
        return Number(fieldValue) > Number(value);
      case "less_than":
        return Number(fieldValue) < Number(value);
      default:
        return true;
    }
  }

  async function mockExecuteNode(
    nodeType: string,
    config: Record<string, unknown>
  ): Promise<{
    success: boolean;
    message: string;
    output?: Record<string, unknown>;
  }> {
    const delay = 500 + Math.random() * 1000;

    switch (nodeType) {
      case NodeType.TriggerManual:
        await sleep(delay, abortController?.signal);
        return { success: true, message: "Manual trigger activated" };

      case NodeType.TriggerWebhook:
        await sleep(delay, abortController?.signal);
        return {
          success: true,
          message: `Webhook received at ${config.webhookUrl || "N/A"}`,
        };

      case NodeType.ActionHttp:
        await sleep(delay, abortController?.signal);
        return {
          success: true,
          message: `${config.method} ${config.url} → 200 OK`,
          output: { statusCode: 200, body: { data: "mock response" } },
        };

      case NodeType.ActionEmail:
        await sleep(delay, abortController?.signal);
        return { success: true, message: `Email sent to ${config.to}` };

      case NodeType.ActionSms:
        await sleep(delay, abortController?.signal);
        return { success: true, message: `SMS sent to ${config.phoneNumber}` };

      case NodeType.ActionDelay: {
        const dur = Number(config.duration) || 1;
        const displayMs = Math.min(dur * 200, 2000);
        await sleep(displayMs, abortController?.signal);
        return {
          success: true,
          message: `Waited ${config.duration} ${config.unit}`,
        };
      }

      case NodeType.LogicTransform:
        await sleep(delay, abortController?.signal);
        return {
          success: true,
          message: `Transform applied: ${config.expression}`,
          output: { [String(config.outputVariable)]: "transformed_value" },
        };

      default:
        await sleep(delay, abortController?.signal);
        return { success: true, message: "Executed" };
    }
  }

  async function run() {
    const sorted = topologicalSort(workflowStore.nodes, workflowStore.edges);
    if (!sorted) {
      runnerStore.addLog({
        nodeId: "",
        nodeLabel: "System",
        nodeType: "",
        status: "error",
        message: "Workflow contains a cycle. Cannot execute.",
        timestamp: Date.now(),
      });
      return;
    }

    abortController = new AbortController();
    runnerStore.start();
    workflowStore.resetAllStatuses();
    uiStore.openRunnerPanel();

    const context: Record<string, unknown> = {
      status: "active",
      email: "user@example.com",
      amount: 100,
      name: "Test User",
    };

    const skippedNodes = new Set<string>();

    try {
      for (const nodeId of sorted) {
        if (abortController.signal.aborted) break;

        await waitIfPaused();
        if (abortController.signal.aborted) break;

        const node = workflowStore.nodes.find((n: any) => n.id === nodeId);
        if (!node) continue;

        if (skippedNodes.has(nodeId)) {
          workflowStore.updateNodeStatus(nodeId, "skipped");
          runnerStore.addLog({
            nodeId,
            nodeLabel: node.data.label,
            nodeType: node.data.nodeType,
            status: "skipped",
            message: "Skipped (condition not met)",
            timestamp: Date.now(),
          });
          const downstream = workflowStore.edges.filter(
            (e: { source: string; target: string }) => e.source === nodeId
          );
          downstream.forEach((e: { target: string }) =>
            skippedNodes.add(e.target)
          );
          continue;
        }

        workflowStore.updateNodeStatus(nodeId, "running");
        runnerStore.setCurrentNode(nodeId);

        const startTs = Date.now();

        if (node.data.nodeType === NodeType.LogicCondition) {
          const result = evaluateCondition(node.data.config, context);
          const duration = Date.now() - startTs;

          workflowStore.updateNodeStatus(nodeId, "success");
          runnerStore.addLog({
            nodeId,
            nodeLabel: node.data.label,
            nodeType: node.data.nodeType,
            status: "success",
            message: `Condition evaluated: ${result ? "TRUE" : "FALSE"}`,
            timestamp: Date.now(),
            duration,
          });

          const outEdges = workflowStore.edges.filter(
            (e: { source: string }) => e.source === nodeId
          );
          for (const edge of outEdges) {
            const isTrueBranch = edge.sourceHandle === "source-true";
            const isFalseBranch = edge.sourceHandle === "source-false";

            if (result && isFalseBranch) {
              skippedNodes.add(edge.target);
            } else if (!result && isTrueBranch) {
              skippedNodes.add(edge.target);
            }
          }
          continue;
        }

        try {
          const result = await mockExecuteNode(
            node.data.nodeType,
            node.data.config
          );
          const duration = Date.now() - startTs;

          if (result.output) {
            Object.assign(context, result.output);
          }

          workflowStore.updateNodeStatus(
            nodeId,
            result.success ? "success" : "error"
          );
          runnerStore.addLog({
            nodeId,
            nodeLabel: node.data.label,
            nodeType: node.data.nodeType,
            status: result.success ? "success" : "error",
            message: result.message,
            timestamp: Date.now(),
            duration,
          });
        } catch (err) {
          if ((err as Error).message === "Aborted") break;
          const duration = Date.now() - startTs;
          workflowStore.updateNodeStatus(nodeId, "error");
          runnerStore.addLog({
            nodeId,
            nodeLabel: node.data.label,
            nodeType: node.data.nodeType,
            status: "error",
            message: `Error: ${(err as Error).message}`,
            timestamp: Date.now(),
            duration,
          });
        }
      }

      if (!abortController.signal.aborted) {
        runnerStore.complete();
      }
    } catch (err) {
      if ((err as Error).message !== "Aborted") {
        runnerStore.addLog({
          nodeId: "",
          nodeLabel: "System",
          nodeType: "",
          status: "error",
          message: `Execution error: ${(err as Error).message}`,
          timestamp: Date.now(),
        });
      }
      runnerStore.stop();
    }
  }

  function pause() {
    runnerStore.pause();
  }

  function resume() {
    runnerStore.resume();
    if (pauseResolve) {
      pauseResolve();
      pauseResolve = null;
    }
  }

  function stop() {
    abortController?.abort();
    runnerStore.stop();
    workflowStore.resetAllStatuses();
  }

  function reset() {
    stop();
    runnerStore.reset();
    workflowStore.resetAllStatuses();
  }

  return {
    run,
    pause,
    resume,
    stop,
    reset,
  };
}
