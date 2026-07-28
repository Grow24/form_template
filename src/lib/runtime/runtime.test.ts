import { describe, expect, it } from "vitest";
import { achievementHoverInteraction, TEST_SCENARIOS } from "@/lib/pbmp/sample-data";
import { STYLE_TEMPLATES, getStyleTemplate } from "@/lib/pbmp/style-templates";
import { resolveStyle, interpretSemanticToken } from "@/lib/pbmp/style-resolver";
import { evaluateCondition, selectBranch } from "./condition-evaluator";
import { dispatchInteraction } from "./form-runtime";
import { resolveVariables } from "./variable-resolver";
import { interactionRuleSchema } from "@/lib/pbmp/schemas";

describe("Variable Resolver", () => {
  it("resolves overrides before defaults", () => {
    const vars = achievementHoverInteraction.rules[0].variables;
    const result = resolveVariables(vars, {
      achievementPercent: 88,
      targetMinimum: 95,
      warningMinimum: 70,
    });
    expect(result.achievementPercent).toBe(88);
    expect(result.targetMinimum).toBe(95);
    expect(result.warningMinimum).toBe(70);
  });
});

describe("Condition Evaluator", () => {
  const vars = { achievementPercent: 88, targetMinimum: 95, warningMinimum: 70 };

  it("selects IF branch when value >= target", () => {
    const branch = selectBranch(achievementHoverInteraction.rules[0].branches, {
      achievementPercent: 98,
      targetMinimum: 95,
      warningMinimum: 70,
    });
    expect(branch?.type).toBe("if");
    expect(
      evaluateCondition(branch?.condition, {
        achievementPercent: 98,
        targetMinimum: 95,
        warningMinimum: 70,
      }),
    ).toBe(true);
  });

  it("selects ELSE IF branch for warning range", () => {
    const branch = selectBranch(
      achievementHoverInteraction.rules[0].branches,
      vars,
    );
    expect(branch?.type).toBe("elseIf");
  });

  it("selects ELSE branch for low values", () => {
    const branch = selectBranch(achievementHoverInteraction.rules[0].branches, {
      achievementPercent: 60,
      targetMinimum: 95,
      warningMinimum: 70,
    });
    expect(branch?.type).toBe("else");
  });
});

describe("Interaction Runtime — hover scenarios", () => {
  const template = getStyleTemplate("st-executive-dark")!;

  it("applies success status on high achievement", () => {
    const result = dispatchInteraction({
      eventType: "pointer.hover.enter",
      interaction: achievementHoverInteraction,
      styleTemplate: template,
      variableOverrides: {
        achievementPercent: 98,
        targetMinimum: 95,
        warningMinimum: 70,
      },
    });
    expect(result.override.statusColour).toBe("success");
    expect(result.override.scale).toBeGreaterThan(1);
    expect(result.traces.length).toBeGreaterThan(3);
  });

  it("applies warning status in mid range", () => {
    const result = dispatchInteraction({
      eventType: "pointer.hover.enter",
      interaction: achievementHoverInteraction,
      styleTemplate: template,
      variableOverrides: {
        achievementPercent: 82,
        targetMinimum: 95,
        warningMinimum: 70,
      },
    });
    expect(result.override.statusColour).toBe("warning");
  });

  it("applies danger + pulse on low values", () => {
    const result = dispatchInteraction({
      eventType: "pointer.hover.enter",
      interaction: achievementHoverInteraction,
      styleTemplate: template,
      variableOverrides: {
        achievementPercent: 60,
        targetMinimum: 95,
        warningMinimum: 70,
      },
    });
    expect(result.override.statusColour).toBe("danger");
    expect(result.override.pulsing).toBe(true);
  });

  it("restores style on hover exit", () => {
    const hovered = dispatchInteraction({
      eventType: "pointer.hover.enter",
      interaction: achievementHoverInteraction,
      styleTemplate: template,
      variableOverrides: { achievementPercent: 88, targetMinimum: 95, warningMinimum: 70 },
    });
    const exited = dispatchInteraction({
      eventType: "pointer.hover.exit",
      interaction: achievementHoverInteraction,
      styleTemplate: template,
      currentOverride: hovered.override,
    });
    expect(exited.override.scale).toBe(1);
    expect(exited.override.pulsing).toBeFalsy();
  });

  it("handles click show details", () => {
    const result = dispatchInteraction({
      eventType: "pointer.click",
      interaction: achievementHoverInteraction,
      styleTemplate: template,
    });
    expect(result.override.tooltipVisible).toBe(true);
  });
});

describe("All TEST_SCENARIOS expectations", () => {
  it.each(TEST_SCENARIOS.filter((s) => s.expectedStatus))(
    "$name → $expectedStatus",
    (scenario) => {
      const template = getStyleTemplate(scenario.styleTemplateId)!;
      const result = dispatchInteraction({
        eventType: scenario.event,
        interaction: achievementHoverInteraction,
        styleTemplate: template,
        variableOverrides: scenario.variables,
      });
      if (scenario.event === "pointer.hover.enter") {
        expect(result.override.statusColour).toBe(scenario.expectedStatus);
      }
    },
  );
});

describe("Style Resolver", () => {
  it("maps semantic tokens per form type", () => {
    expect(interpretSemanticToken("data.primary", "lineChart")).toBe("lineColour");
    expect(interpretSemanticToken("data.primary", "barChart")).toBe("barFillColour");
    expect(interpretSemanticToken("data.primary", "text")).toBe("textColour");
  });

  it("applies runtime status colour override", () => {
    const template = STYLE_TEMPLATES[0];
    const resolved = resolveStyle(template, "barChart", "2d", {
      statusColour: "warning",
    });
    expect(resolved.dataPrimary).toBe(template.semantic.status.warning);
  });

  it("resolves 2D and 3D with same template", () => {
    const template = getStyleTemplate("st-executive-dark")!;
    const r2d = resolveStyle(template, "barChart", "2d", {});
    const r3d = resolveStyle(template, "barChart", "3d", {});
    expect(r2d.surface).toBeTruthy();
    expect(r3d.sceneBackground).toBeTruthy();
    expect(r3d.barDepth).toBeGreaterThan(0);
  });
});

describe("Schema validation", () => {
  it("validates interaction rules", () => {
    for (const rule of achievementHoverInteraction.rules) {
      expect(interactionRuleSchema.safeParse(rule).success).toBe(true);
    }
  });
});

describe("Style Templates", () => {
  it("has required templates", () => {
    expect(getStyleTemplate("st-executive-dark")).toBeDefined();
    expect(getStyleTemplate("st-executive-light")).toBeDefined();
    expect(STYLE_TEMPLATES.length).toBeGreaterThanOrEqual(4);
  });
});
