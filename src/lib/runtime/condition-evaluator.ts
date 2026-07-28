import jsonLogic from "json-logic-js";
import type { ConditionNode, InteractionBranch } from "../pbmp/types";

export function evaluateCondition(
  condition: ConditionNode | undefined,
  variables: Record<string, unknown>,
): boolean {
  if (!condition) return true;
  try {
    return Boolean(jsonLogic.apply(condition, variables));
  } catch {
    return false;
  }
}

/** Select first matching IF / ELSE IF branch, else ELSE */
export function selectBranch(
  branches: InteractionBranch[],
  variables: Record<string, unknown>,
): InteractionBranch | null {
  const ordered = [...branches].sort((a, b) => a.sequence - b.sequence);
  for (const branch of ordered) {
    if (branch.type === "else") return branch;
    if (evaluateCondition(branch.condition, variables)) return branch;
  }
  return null;
}

export function describeBranch(branch: InteractionBranch | null): string {
  if (!branch) return "No branch matched";
  if (branch.type === "else") return "ELSE — no earlier condition matched";
  if (branch.type === "if") return `IF branch #${branch.sequence}`;
  return `ELSE IF branch #${branch.sequence}`;
}
