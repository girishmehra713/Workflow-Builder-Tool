# Workflow Builder

A node‐based workflow builder as a pure frontend app using VueJS. Focus on canvas
UX, dynamic configuration forms, undo/redo state management, local persistence, and a visual
Run Preview (simulation).

# How To Start the App

```bash
npm install
npm run dev
npm run build
```

# Architecture Overview

Framework | Vue 3 + TypeScript + Vite |
Graph/Canvas | `@vue-flow/core` + `@vue-flow/background` + `@vue-flow/controls` + `@vue-flow/minimap` |
State | Pinia + Immer (immutable snapshots for undo/redo) |
Validation | Zod (schema-driven config forms) |
Styling | TailwindCSS v4 |
Utilities | `@vueuse/core` (debounce), `nanoid` (IDs)

# Folder Structure

```
src/
├── main.ts
├── App.vue
├── types/
│   ├── workflow.ts
│   ├── nodes.ts
│   ├── runner.ts
│   └── history.ts
├── schemas/
│   ├── trigger-manual.schema.ts
│   ├── trigger-webhook.schema.ts
│   ├── action-http.schema.ts
│   ├── action-email.schema.ts
│   ├── action-sms.schema.ts
│   ├── action-delay.schema.ts
│   ├── logic-condition.schema.ts
│   └── logic-transform.schema.ts
├── data/
│   ├── nodeRegistry.ts         # NODE_REGISTRY: single source of truth
│   └── samples/                # 2 sample workflow JSONs
├── stores/
│   ├── workflowStore.ts
│   ├── historyStore.ts
│   ├── uiStore.ts
│   └── runnerStore.ts
├── composables/
│   ├── useHistory.ts
│   ├── useGraphRules.ts
│   ├── usePersistence.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useNodeDrop.ts
│   └── useWorkflowRunner.ts
├── utils/
│   ├── graph.ts
│   ├── schemaToFields.ts
│   ├── nodeFactory.ts
│   ├── id.ts
│   └── storage.ts
├── components/
│   ├── layout/
│   ├── palette/
│   ├── canvas/
│   ├── nodes/
│   ├── config/
│   └── runner/
```

# State Shape

```typescript
{
  nodes: WorkflowNode[]    // VueFlow nodes with data.config, data.status
  edges: WorkflowEdge[]    // VueFlow edges with optional sourceHandle
  viewport: Viewport       // { x, y, zoom }
  isDirty: boolean         // Unsaved changes indicator
}

// historyStore - Undo/redo
{
  undoStack: WorkflowSnapshot[]  // Max 50 entries
  redoStack: WorkflowSnapshot[]  // Cleared on new push
}

// uiStore - UI state
{
  selectedNodeId: string | null
  configPanelOpen: boolean
  runnerPanelOpen: boolean
  snapToGrid: boolean
}

// runnerStore - Execution state
{
  status: 'idle' | 'running' | 'paused' | 'completed' | 'stopped'
  logs: StepLog[]
  currentNodeId: string | null
}
```

# How to Add a New Node Type

Adding a new node type requires 3 files:

# 1. Create a Zod Schema

```typescript
import { z } from "zod";

export const actionSlackSchema = z.object({
  label: z.string().min(1, "Label is required"),
  channel: z.string().min(1, "Channel is required"),
  message: z.string().min(1, "Message is required"),
});
```

# 2. Create a Node Component

```vue
<script setup lang="ts">
import BaseNode from "./BaseNode.vue";
defineProps<{
  id: string;
  data: {
    label: string;
    nodeType: string;
    config: Record<string, unknown>;
    status?: string;
  };
  selected?: boolean;
}>();
</script>
<template>
  <BaseNode :id="id" :data="data" :selected="selected">
    <span>#{{ data.config.channel || "no channel" }}</span>
  </BaseNode>
</template>
```

# 3. Register in NODE_REGISTRY

```typescript
[NodeType.ActionSlack]: {
  type: NodeType.ActionSlack,
  label: 'Send Slack',
  description: 'Post to Slack channel',
  category: 'action',
  color: '#3b82f6',
  icon: '#',
  schema: actionSlackSchema,
  component: ActionSlackNode,
  handles: [
    { id: 'target', type: 'target', position: 'top' },
    { id: 'source', type: 'source', position: 'bottom' },
  ],
  defaults: { label: 'Send Slack', channel: '', message: '' },
},
```

# Undo/Redo Logic

1. Before any mutating action (add/remove/move node, add/remove edge, update config), `pushSnapshot()` captures the current `{ nodes, edges }` using Immer's structural sharing.
2. The snapshot is pushed onto `undoStack` (max 50). `redoStack` is cleared.
3. **Undo**: Pops from `undoStack`, pushes current state to `redoStack`, restores the popped snapshot.
4. **Redo**: Pops from `redoStack`, pushes current state to `undoStack`, restores the popped snapshot.
5. Keyboard bindings: `Ctrl+Z` (undo), `Ctrl+Shift+Z` / `Ctrl+Y` (redo).

## Sample Workflows

Two sample workflows are included and can be loaded from the "Samples" dropdown in the top bar:

1. **Lead Welcome Flow**: Webhook trigger -> Condition (check status) -> Email (welcome) / SMS (notify sales) -> Delay -> HTTP (update CRM)
2. **Abandoned Cart Flow**: Webhook trigger -> Delay -> HTTP (check status) -> Condition -> Email (reminder) + SMS follow-up / Transform (log conversion)
