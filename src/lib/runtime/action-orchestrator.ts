import type {
  EventTraceEntry,
  PbmpAction,
  RuntimeOverride,
  StyleTemplate,
} from "../pbmp/types";

export interface ActionResult {
  override: RuntimeOverride;
  traces: EventTraceEntry[];
  variables: Record<string, unknown>;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Whitelisted Action Registry executor.
 * Actions are semantic — Form adapters interpret them per Form Type.
 */
export function executeActions(
  actions: PbmpAction[],
  template: StyleTemplate,
  current: RuntimeOverride,
  variables: Record<string, unknown>,
): ActionResult {
  let override: RuntimeOverride = { ...current };
  const traces: EventTraceEntry[] = [];
  const nextVars = { ...variables };

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    const params = action.parameters ?? {};

    switch (action.type) {
      case "setSemanticStyle": {
        const property = String(params.property ?? "");
        const value = String(params.value ?? "");
        if (property === "statusColour") {
          override.statusColour = value as RuntimeOverride["statusColour"];
          traces.push({
            id: uid(),
            timestamp: Date.now(),
            step: `${i + 1}. setSemanticStyle`,
            detail: `statusColour → ${value} (${template.semantic.status[value as keyof typeof template.semantic.status] ?? value})`,
            level: "success",
          });
        } else if (property === "textColour" || property === "dataColour") {
          override = {
            ...override,
            [property]: String(params.value),
          };
          traces.push({
            id: uid(),
            timestamp: Date.now(),
            step: `${i + 1}. setSemanticStyle`,
            detail: `${property} → ${params.value}`,
            level: "success",
          });
        }
        break;
      }
      case "expand": {
        const scaleTo = Number(params.scaleTo ?? template.foundation.motion.emphasisScale);
        override.scale = scaleTo;
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. expand`,
          detail: `scale → ${scaleTo}${action.animation ? ` (${action.animation.durationMs}ms ${action.animation.easing})` : ""}`,
          level: "success",
        });
        break;
      }
      case "collapse": {
        override.scale = Number(params.scaleTo ?? 1);
        override.pulsing = false;
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. collapse`,
          detail: `scale → ${override.scale}`,
          level: "info",
        });
        break;
      }
      case "resetStyle": {
        override = {
          scale: 1,
          highlightedIndex: null,
          tooltipVisible: false,
          pulsing: false,
        };
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. resetStyle`,
          detail: "Restored base Style Template",
          level: "info",
        });
        break;
      }
      case "highlight": {
        override.highlightedIndex = 3;
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. highlight`,
          detail: "Highlighted matching data point / bar / text",
          level: "success",
        });
        break;
      }
      case "showTooltip":
      case "showDetails": {
        override.tooltipVisible = true;
        override.tooltipContent = String(params.content ?? "Details");
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. ${action.type}`,
          detail: String(params.content ?? "Details shown"),
          level: "info",
        });
        break;
      }
      case "hide": {
        if (params.property === "tooltip") {
          override.tooltipVisible = false;
          override.tooltipContent = undefined;
        }
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. hide`,
          detail: "Hidden tooltip / overlay",
          level: "info",
        });
        break;
      }
      case "pulse": {
        override.pulsing = true;
        override.scale = 1.08;
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. pulse`,
          detail: `Pulse × ${params.times ?? 2}${action.animation ? ` (${action.animation.durationMs}ms)` : ""}`,
          level: "warning",
        });
        break;
      }
      case "setVariable": {
        const name = String(params.name);
        nextVars[name] = params.value;
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. setVariable`,
          detail: `${name} = ${JSON.stringify(params.value)}`,
          level: "info",
        });
        break;
      }
      case "changeColour": {
        override.dataColour = String(params.colour ?? params.value);
        override.textColour = String(params.colour ?? params.value);
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. changeColour`,
          detail: `colour → ${params.colour ?? params.value}`,
          level: "success",
        });
        break;
      }
      default:
        traces.push({
          id: uid(),
          timestamp: Date.now(),
          step: `${i + 1}. ${action.type}`,
          detail: "Action registered (no-op in preview)",
          level: "info",
        });
    }
  }

  return { override, traces, variables: nextVars };
}
