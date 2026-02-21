import type { Component } from "vue";
import type { ZodObject, ZodRawShape } from "zod";

export const NodeType = {
  TriggerManual: "trigger-manual",
  TriggerWebhook: "trigger-webhook",
  ActionHttp: "action-http",
  ActionEmail: "action-email",
  ActionSms: "action-sms",
  ActionDelay: "action-delay",
  LogicCondition: "logic-condition",
  LogicTransform: "logic-transform",
} as const;

export type NodeType = (typeof NodeType)[keyof typeof NodeType];

export type NodeCategory = "trigger" | "action" | "logic";

export interface HandleDefinition {
  id: string;
  type: "source" | "target";
  position: "top" | "bottom" | "left" | "right";
  label?: string;
}

export interface NodeDefinition {
  type: NodeType;
  label: string;
  description: string;
  category: NodeCategory;
  color: string;
  icon: Component;
  schema: ZodObject<ZodRawShape>;
  component: Component;
  handles: HandleDefinition[];
  defaults: Record<string, unknown>;
}
