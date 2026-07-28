import type { PbmpEventType, VariableDefinition } from "../pbmp/types";

/** Normalize browser / ECharts / R3F events into PBMP events */
export function toPbmpEvent(
  native:
    | "mouseenter"
    | "mouseleave"
    | "click"
    | "dblclick"
    | "change"
    | "focus"
    | "blur"
    | "echarts.mouseover"
    | "echarts.mouseout"
    | "echarts.click"
    | "r3f.pointerenter"
    | "r3f.pointerleave"
    | "r3f.click",
): PbmpEventType {
  const map: Record<string, PbmpEventType> = {
    mouseenter: "pointer.hover.enter",
    mouseleave: "pointer.hover.exit",
    click: "pointer.click",
    dblclick: "pointer.doubleClick",
    change: "value.change",
    focus: "focus.enter",
    blur: "focus.exit",
    "echarts.mouseover": "pointer.hover.enter",
    "echarts.mouseout": "pointer.hover.exit",
    "echarts.click": "pointer.click",
    "r3f.pointerenter": "object.pointer.enter",
    "r3f.pointerleave": "object.pointer.exit",
    "r3f.click": "object.click",
  };
  return map[native] ?? "pointer.click";
}

export function resolveVariables(
  definitions: VariableDefinition[],
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const def of definitions) {
    if (overrides[def.name] !== undefined) {
      result[def.name] = overrides[def.name];
      continue;
    }
    if (def.value !== undefined) {
      result[def.name] = def.value;
      continue;
    }
    if (def.defaultValue !== undefined) {
      result[def.name] = def.defaultValue;
      continue;
    }
    result[def.name] = null;
  }
  return result;
}
