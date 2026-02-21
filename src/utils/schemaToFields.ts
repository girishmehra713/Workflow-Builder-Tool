import { z } from "zod";

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "textarea"
  | "keyvalue"
  | "checkbox";

export interface FieldDescriptor {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
  defaultValue?: unknown;
}

function getZodDef(schema: any): any {
  return schema?._zod?.def ?? schema?.def ?? {};
}

function getZodType(schema: any): string {
  return getZodDef(schema).type ?? "";
}

export function schemaToFields(
  schema: z.ZodObject<z.ZodRawShape>
): FieldDescriptor[] {
  const shape = schema.shape;
  const fields: FieldDescriptor[] = [];

  for (const [name, fieldSchema] of Object.entries(shape)) {
    const field = parseZodField(name, fieldSchema as z.ZodType);
    if (field) fields.push(field);
  }

  return fields;
}

function parseZodField(
  name: string,
  schema: z.ZodType
): FieldDescriptor | null {
  let current: any = schema;
  let required = true;
  let defaultValue: unknown;
  let description: string | undefined;

  description = current.description ?? undefined;

  if (getZodType(current) === "optional") {
    required = false;
    current = getZodDef(current).innerType;
  }

  if (getZodType(current) === "default") {
    defaultValue = getZodDef(current).defaultValue;
    current = getZodDef(current).innerType;
  }

  if (!description && current.description) {
    description = current.description;
  }

  const label = name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, " ")
    .trim();

  const typeName = getZodType(current);

  if (typeName === "string") {
    const format = current.format ?? null;
    const isUrl = format === "url";
    const isEmail = format === "email";

    return {
      name,
      label,
      type: "text",
      required,
      placeholder: isUrl
        ? "https://..."
        : isEmail
        ? "user@example.com"
        : undefined,
      description,
      defaultValue,
    };
  }

  if (typeName === "number") {
    return {
      name,
      label,
      type: "number",
      required,
      description,
      defaultValue,
    };
  }

  if (typeName === "boolean") {
    return {
      name,
      label,
      type: "checkbox",
      required: false,
      description,
      defaultValue: defaultValue ?? false,
    };
  }

  if (typeName === "enum") {
    const entries = getZodDef(current).entries ?? {};
    const values = Object.keys(entries);
    return {
      name,
      label,
      type: "select",
      required,
      description,
      options: values.map((v) => ({ label: v, value: v })),
      defaultValue,
    };
  }

  if (typeName === "record") {
    return {
      name,
      label,
      type: "keyvalue",
      required,
      description,
      defaultValue: defaultValue ?? {},
    };
  }

  if (typeName === "array") {
    return {
      name,
      label,
      type: "keyvalue",
      required,
      description,
      defaultValue: defaultValue ?? [],
    };
  }

  return {
    name,
    label,
    type: "text",
    required,
    description,
    defaultValue,
  };
}
