import { z } from "zod";

export const foundationTokensSchema = z.object({
  colours: z.object({
    surface: z.string(),
    surfaceAlt: z.string(),
    border: z.string(),
    grid: z.string(),
    shadow: z.string(),
  }),
  typography: z.object({
    fontFamily: z.string(),
    titleSize: z.number(),
    titleWeight: z.number(),
    bodySize: z.number(),
    labelSize: z.number(),
  }),
  spacing: z.object({
    padding: z.number(),
    gap: z.number(),
    margin: z.number(),
  }),
  borders: z.object({
    width: z.number(),
    radius: z.number(),
    style: z.enum(["solid", "dashed", "dotted", "none"]),
  }),
  shadows: z.object({
    elevation: z.string(),
  }),
  motion: z.object({
    durationMs: z.number(),
    easing: z.string(),
    emphasisScale: z.number(),
  }),
});

export const semanticTokensSchema = z.object({
  surface: z.object({
    primary: z.string(),
    elevated: z.string(),
    tooltip: z.string(),
  }),
  content: z.object({
    primary: z.string(),
    secondary: z.string(),
    muted: z.string(),
  }),
  data: z.object({
    primary: z.string(),
    secondary: z.string(),
    palette: z.array(z.string()),
  }),
  status: z.object({
    success: z.string(),
    warning: z.string(),
    danger: z.string(),
    info: z.string(),
  }),
  emphasis: z.object({
    colour: z.string(),
    scale: z.number(),
  }),
  interaction: z.object({
    hover: z.string(),
    selected: z.string(),
    focus: z.string(),
    disabled: z.string(),
  }),
});

export const animationSpecSchema = z.object({
  type: z
    .enum(["expand", "fade", "slide", "rotate", "pulse", "colour"])
    .optional(),
  targetProperty: z.string().optional(),
  startValue: z.union([z.number(), z.string()]).optional(),
  endValue: z.union([z.number(), z.string()]).optional(),
  durationMs: z.number(),
  delayMs: z.number().optional(),
  easing: z.enum(["linear", "easeIn", "easeOut", "easeInOut"]),
  direction: z.enum(["forward", "reverse"]).optional(),
  iterationCount: z.union([z.number(), z.literal("infinite")]).optional(),
  executionMode: z.enum(["sequential", "parallel"]).optional(),
  revertOnEventEnd: z.boolean().optional(),
  interruptBehaviour: z.enum(["reverse", "stop", "complete"]).optional(),
  fillBehaviour: z.enum(["retain", "none"]).optional(),
  reducedMotionFallback: z.enum(["immediate", "skip"]).optional(),
});

export const actionSchema = z.object({
  type: z.enum([
    "setSemanticStyle",
    "applyStyleTemplate",
    "resetStyle",
    "expand",
    "collapse",
    "show",
    "hide",
    "highlight",
    "showTooltip",
    "filter",
    "navigate",
    "setVariable",
    "emitEvent",
    "runProcess",
    "pulse",
    "changeColour",
    "showDetails",
  ]),
  target: z.string(),
  parameters: z.record(z.string(), z.unknown()).optional(),
  animation: animationSpecSchema.optional(),
});

export const interactionBranchSchema = z.object({
  sequence: z.number(),
  type: z.enum(["if", "elseIf", "else"]),
  condition: z.record(z.string(), z.unknown()).optional(),
  actions: z.array(actionSchema),
});

export const variableDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  dataType: z.enum([
    "string",
    "number",
    "boolean",
    "decimal",
    "date",
    "object",
    "array",
  ]),
  scope: z.enum([
    "component",
    "page",
    "workspace",
    "user",
    "process",
    "global",
    "dataRow",
    "formula",
  ]),
  sourceType: z.enum([
    "constant",
    "componentProperty",
    "dataField",
    "rowValue",
    "globalVariable",
    "workspaceVariable",
    "userVariable",
    "processVariable",
    "formula",
    "apiResponse",
    "environment",
    "anotherComponent",
  ]),
  sourceBinding: z.string().optional(),
  value: z.unknown().optional(),
  defaultValue: z.unknown().optional(),
  refreshTrigger: z.string().optional(),
  isReadOnly: z.boolean().optional(),
});

export const interactionRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  sourceComponent: z.string().optional(),
  sourceElementId: z.string(),
  event: z.object({
    type: z.string(),
    sourceElementId: z.string(),
  }),
  variables: z.array(variableDefinitionSchema),
  branches: z.array(interactionBranchSchema),
  priority: z.number().optional(),
  stopAfterMatch: z.boolean().optional(),
  isEnabled: z.boolean(),
  revertBehaviour: z.enum(["resetStyle", "collapse", "custom"]).optional(),
});

export const APPROVED_ACTIONS = [
  "setSemanticStyle",
  "applyStyleTemplate",
  "resetStyle",
  "expand",
  "collapse",
  "show",
  "hide",
  "highlight",
  "showTooltip",
  "filter",
  "navigate",
  "setVariable",
  "emitEvent",
  "runProcess",
  "pulse",
  "changeColour",
  "showDetails",
] as const;
