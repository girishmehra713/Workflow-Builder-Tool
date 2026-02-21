import { markRaw } from "vue";
import {
  Play,
  Link,
  Globe,
  Mail,
  MessageCircle,
  Timer,
  GitBranch,
  Settings,
} from "lucide-vue-next";
import { NodeType } from "@/types/nodes";
import type { NodeDefinition } from "@/types/nodes";
import {
  triggerManualSchema,
  triggerWebhookSchema,
  actionHttpSchema,
  actionEmailSchema,
  actionSmsSchema,
  actionDelaySchema,
  logicConditionSchema,
  logicTransformSchema,
} from "@/schemas";

import TriggerManualNode from "@/components/Nodes/TriggerManualNode.vue";
import TriggerWebhookNode from "@/components/Nodes/TriggerWebhookNode.vue";
import ActionHttpNode from "@/components/Nodes/ActionHttpNode.vue";
import ActionEmailNode from "@/components/Nodes/ActionEmailNode.vue";
import ActionSmsNode from "@/components/Nodes/ActionSmsNode.vue";
import ActionDelayNode from "@/components/Nodes/ActionDelayNode.vue";
import LogicConditionNode from "@/components/Nodes/LogicConditionNode.vue";
import LogicTransformNode from "../components/Nodes/LogicTransformNode.vue";

export const NODE_REGISTRY: Record<string, NodeDefinition> = {
  [NodeType.TriggerManual]: {
    type: NodeType.TriggerManual,
    label: "Manual Trigger",
    description: "Start workflow manually",
    category: "trigger",
    color: "#8b5cf6",
    icon: markRaw(Play),
    schema: triggerManualSchema,
    component: markRaw(TriggerManualNode),
    handles: [
      { id: "target", type: "target", position: "top" },
      { id: "source", type: "source", position: "bottom" },
    ],
    defaults: { label: "Manual Trigger" },
  },
  [NodeType.TriggerWebhook]: {
    type: NodeType.TriggerWebhook,
    label: "Webhook Trigger",
    description: "Start on webhook event",
    category: "trigger",
    color: "#8b5cf6",
    icon: markRaw(Link),
    schema: triggerWebhookSchema,
    component: markRaw(TriggerWebhookNode),
    handles: [
      { id: "target", type: "target", position: "top" },
      { id: "source", type: "source", position: "bottom" },
    ],
    defaults: { label: "Webhook Trigger", webhookUrl: "", method: "POST" },
  },
  [NodeType.ActionHttp]: {
    type: NodeType.ActionHttp,
    label: "HTTP Request",
    description: "Make an HTTP request",
    category: "action",
    color: "#3b82f6",
    icon: markRaw(Globe),
    schema: actionHttpSchema,
    component: markRaw(ActionHttpNode),
    handles: [
      { id: "target", type: "target", position: "top" },
      { id: "source", type: "source", position: "bottom" },
    ],
    defaults: {
      label: "HTTP Request",
      url: "",
      method: "GET",
      headers: {},
      body: "",
    },
  },
  [NodeType.ActionEmail]: {
    type: NodeType.ActionEmail,
    label: "Send Email",
    description: "Send an email message",
    category: "action",
    color: "#3b82f6",
    icon: markRaw(Mail),
    schema: actionEmailSchema,
    component: markRaw(ActionEmailNode),
    handles: [
      { id: "target", type: "target", position: "top" },
      { id: "source", type: "source", position: "bottom" },
    ],
    defaults: { label: "Send Email", to: "", subject: "", body: "" },
  },
  [NodeType.ActionSms]: {
    type: NodeType.ActionSms,
    label: "Send SMS",
    description: "Send an SMS message",
    category: "action",
    color: "#3b82f6",
    icon: markRaw(MessageCircle),
    schema: actionSmsSchema,
    component: markRaw(ActionSmsNode),
    handles: [
      { id: "target", type: "target", position: "top" },
      { id: "source", type: "source", position: "bottom" },
    ],
    defaults: { label: "Send SMS", phoneNumber: "", message: "" },
  },
  [NodeType.ActionDelay]: {
    type: NodeType.ActionDelay,
    label: "Delay",
    description: "Wait for a specified time",
    category: "action",
    color: "#3b82f6",
    icon: markRaw(Timer),
    schema: actionDelaySchema,
    component: markRaw(ActionDelayNode),
    handles: [
      { id: "target", type: "target", position: "top" },
      { id: "source", type: "source", position: "bottom" },
    ],
    defaults: { label: "Delay", duration: 5, unit: "seconds" },
  },
  [NodeType.LogicCondition]: {
    type: NodeType.LogicCondition,
    label: "Condition",
    description: "Branch based on condition",
    category: "logic",
    color: "#f59e0b",
    icon: markRaw(GitBranch),
    schema: logicConditionSchema,
    component: markRaw(LogicConditionNode),
    handles: [
      { id: "target", type: "target", position: "top" },
      { id: "source-true", type: "source", position: "bottom", label: "True" },
      { id: "source-false", type: "source", position: "right", label: "False" },
    ],
    defaults: { label: "Condition", field: "", operator: "equals", value: "" },
  },
  [NodeType.LogicTransform]: {
    type: NodeType.LogicTransform,
    label: "Transform",
    description: "Transform data",
    category: "logic",
    color: "#f59e0b",
    icon: markRaw(Settings),
    schema: logicTransformSchema,
    component: markRaw(LogicTransformNode),
    handles: [
      { id: "target", type: "target", position: "top" },
      { id: "source", type: "source", position: "bottom" },
    ],
    defaults: { label: "Transform", expression: "", outputVariable: "" },
  },
};

export function getNodesByCategory(category: string): NodeDefinition[] {
  return Object.values(NODE_REGISTRY).filter((n) => n.category === category);
}
