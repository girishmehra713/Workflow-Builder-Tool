import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ExecutionStatus, StepLog } from "../types/runner";

export const useRunnerStore = defineStore("runner", () => {
  const status = ref<ExecutionStatus>("idle");
  const logs = ref<StepLog[]>([]);
  const currentNodeId = ref<string | null>(null);
  const startTime = ref<number | null>(null);

  const isRunning = computed(() => status.value === "running");
  const isPaused = computed(() => status.value === "paused");
  const isIdle = computed(() => status.value === "idle");

  function setStatus(s: ExecutionStatus) {
    status.value = s;
  }

  function setCurrentNode(nodeId: string | null) {
    currentNodeId.value = nodeId;
  }

  function addLog(log: StepLog) {
    logs.value = [...logs.value, log];
  }

  function clearLogs() {
    logs.value = [];
    currentNodeId.value = null;
    startTime.value = null;
  }

  function start() {
    status.value = "running";
    startTime.value = Date.now();
    logs.value = [];
  }

  function pause() {
    status.value = "paused";
  }

  function resume() {
    status.value = "running";
  }

  function stop() {
    status.value = "stopped";
    currentNodeId.value = null;
  }

  function complete() {
    status.value = "completed";
    currentNodeId.value = null;
  }

  function reset() {
    status.value = "idle";
    logs.value = [];
    currentNodeId.value = null;
    startTime.value = null;
  }

  return {
    status,
    logs,
    currentNodeId,
    startTime,
    isRunning,
    isPaused,
    isIdle,
    setStatus,
    setCurrentNode,
    addLog,
    clearLogs,
    start,
    pause,
    resume,
    stop,
    complete,
    reset,
  };
});
