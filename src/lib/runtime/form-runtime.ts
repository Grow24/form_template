import type {
  EventTraceEntry,
  InteractionTemplate,
  PbmpEventType,
  RuntimeOverride,
  StyleTemplate,
} from "../pbmp/types";
import { describeBranch, selectBranch } from "./condition-evaluator";
import { executeActions } from "./action-orchestrator";
import { resolveVariables } from "./variable-resolver";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface RuntimeDispatchInput {
  eventType: PbmpEventType;
  interaction: InteractionTemplate;
  styleTemplate: StyleTemplate;
  variableOverrides?: Record<string, unknown>;
  currentOverride?: RuntimeOverride;
}

export interface RuntimeDispatchResult {
  override: RuntimeOverride;
  traces: EventTraceEntry[];
  matchedRuleId?: string;
  matchedBranchLabel?: string;
  variables: Record<string, unknown>;
}

/**
 * PBMP Form Runtime:
 * Event Adapter → Resolve Variables → Evaluate Rules → Select Branch
 * → Execute Ordered Actions → Style Resolver → Form Adapter → Animation
 */
export function dispatchInteraction(
  input: RuntimeDispatchInput,
): RuntimeDispatchResult {
  const traces: EventTraceEntry[] = [];
  const {
    eventType,
    interaction,
    styleTemplate,
    variableOverrides = {},
    currentOverride = {},
  } = input;

  traces.push({
    id: uid(),
    timestamp: Date.now(),
    step: "1. Event received",
    detail: eventType,
    level: "info",
  });

  const rules = interaction.rules
    .filter((r) => r.isEnabled && r.event.type === eventType)
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  if (rules.length === 0) {
    traces.push({
      id: uid(),
      timestamp: Date.now(),
      step: "2. No matching rule",
      detail: `No enabled Interaction Rule for ${eventType}`,
      level: "warning",
    });
    return {
      override: currentOverride,
      traces,
      variables: variableOverrides,
    };
  }

  const rule = rules[0];
  const variables = resolveVariables(rule.variables, variableOverrides);

  traces.push({
    id: uid(),
    timestamp: Date.now(),
    step: "2. Variables resolved",
    detail: Object.entries(variables)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ") || "(none)",
    level: "info",
  });

  const branch = selectBranch(rule.branches, variables);
  const branchLabel = describeBranch(branch);

  traces.push({
    id: uid(),
    timestamp: Date.now(),
    step: "3. Branch selected",
    detail: branchLabel,
    level: branch ? "success" : "warning",
  });

  if (!branch) {
    return {
      override: currentOverride,
      traces,
      matchedRuleId: rule.id,
      matchedBranchLabel: branchLabel,
      variables,
    };
  }

  const result = executeActions(
    branch.actions,
    styleTemplate,
    currentOverride,
    variables,
  );

  traces.push(...result.traces.map((t, idx) => ({
    ...t,
    step: t.step.replace(/^\d+\./, `${4 + idx}.`),
  })));

  traces.push({
    id: uid(),
    timestamp: Date.now(),
    step: `${4 + result.traces.length}. Render update`,
    detail: "Style resolved → Form adapter → Animation applied",
    level: "success",
  });

  return {
    override: result.override,
    traces,
    matchedRuleId: rule.id,
    matchedBranchLabel: branchLabel,
    variables: result.variables,
  };
}
