import type {
  ArtifactBinding,
  ContentDefinition,
  InteractionTemplate,
  TestScenario,
  WorkflowInstance,
} from "./types";

/** Monthly sales — same content packaged as Line / Bar / Text (Jan–Jun, multi-series) */
export const monthlySalesContent: ContentDefinition = {
  id: "content-monthly-sales",
  name: "Monthly Sales",
  functionality: "Show monthly sales performance",
  dataSource: "Sales.Monthly",
  categoryField: "Month",
  measureField: "Sales",
  aggregation: "sum",
  sorting: "asc",
  numberFormat: "currency",
  unitLabel: "₹ lakh",
  data: [
    { category: "Jan", value: 1000000, target: 1200000, priorYear: 900000, achievementPercent: 72 },
    { category: "Feb", value: 1400000, target: 1300000, priorYear: 1100000, achievementPercent: 88 },
    { category: "Mar", value: 1200000, target: 1400000, priorYear: 1250000, achievementPercent: 82 },
    { category: "Apr", value: 1800000, target: 1500000, priorYear: 1400000, achievementPercent: 98 },
    { category: "May", value: 1600000, target: 1550000, priorYear: 1450000, achievementPercent: 91 },
    { category: "Jun", value: 1700000, target: 1600000, priorYear: 1500000, achievementPercent: 94 },
  ],
};

export const CONTENTS: ContentDefinition[] = [monthlySalesContent];

export const achievementHoverInteraction: InteractionTemplate = {
  id: "IT-ACHIEVEMENT-HOVER",
  name: "Achievement Hover Rules",
  description:
    "On hover, colour and expand based on AchievementPercent vs Target/Warning thresholds.",
  rules: [
    {
      id: "IR-HOVER-STATUS",
      name: "Hover status colour + expand",
      sourceElementId: "salesForm",
      event: {
        type: "pointer.hover.enter",
        sourceElementId: "salesForm",
      },
      isEnabled: true,
      stopAfterMatch: true,
      revertBehaviour: "resetStyle",
      variables: [
        {
          id: "VAR-ACH-001",
          name: "achievementPercent",
          dataType: "decimal",
          scope: "component",
          sourceType: "dataField",
          sourceBinding: "sales.achievementPercent",
          defaultValue: 88,
          isReadOnly: true,
        },
        {
          id: "VAR-TGT-001",
          name: "targetMinimum",
          dataType: "decimal",
          scope: "workspace",
          sourceType: "workspaceVariable",
          sourceBinding: "targets.greenMinimum",
          defaultValue: 95,
        },
        {
          id: "VAR-WARN-001",
          name: "warningMinimum",
          dataType: "decimal",
          scope: "workspace",
          sourceType: "constant",
          value: 70,
          defaultValue: 70,
        },
      ],
      branches: [
        {
          sequence: 1,
          type: "if",
          condition: {
            ">=": [{ var: "achievementPercent" }, { var: "targetMinimum" }],
          },
          actions: [
            {
              type: "setSemanticStyle",
              target: "salesForm",
              parameters: { property: "statusColour", value: "success" },
              animation: {
                type: "colour",
                durationMs: 250,
                easing: "easeOut",
              },
            },
            {
              type: "expand",
              target: "salesForm",
              parameters: { scaleTo: 1.15 },
              animation: {
                type: "expand",
                durationMs: 500,
                easing: "easeOut",
                startValue: 1,
                endValue: 1.15,
              },
            },
            {
              type: "showTooltip",
              target: "salesForm",
              parameters: {
                content: "Achievement meets or exceeds target",
              },
            },
            {
              type: "highlight",
              target: "salesForm",
              parameters: { matchCurrentPeriod: true },
            },
          ],
        },
        {
          sequence: 2,
          type: "elseIf",
          condition: {
            ">=": [{ var: "achievementPercent" }, { var: "warningMinimum" }],
          },
          actions: [
            {
              type: "setSemanticStyle",
              target: "salesForm",
              parameters: { property: "statusColour", value: "warning" },
              animation: {
                type: "colour",
                durationMs: 250,
                easing: "easeOut",
              },
            },
            {
              type: "expand",
              target: "salesForm",
              parameters: { scaleTo: 1.1 },
              animation: {
                type: "expand",
                durationMs: 500,
                easing: "easeOut",
                startValue: 1,
                endValue: 1.1,
              },
            },
            {
              type: "showTooltip",
              target: "salesForm",
              parameters: { content: "Achievement in warning range" },
            },
          ],
        },
        {
          sequence: 3,
          type: "else",
          actions: [
            {
              type: "setSemanticStyle",
              target: "salesForm",
              parameters: { property: "statusColour", value: "danger" },
            },
            {
              type: "pulse",
              target: "salesForm",
              parameters: { times: 2 },
              animation: {
                type: "pulse",
                durationMs: 700,
                iterationCount: 2,
                easing: "easeInOut",
              },
            },
            {
              type: "showTooltip",
              target: "salesForm",
              parameters: { content: "Achievement below warning threshold" },
            },
          ],
        },
      ],
    },
    {
      id: "IR-HOVER-EXIT",
      name: "Hover exit restore",
      sourceElementId: "salesForm",
      event: {
        type: "pointer.hover.exit",
        sourceElementId: "salesForm",
      },
      isEnabled: true,
      variables: [],
      branches: [
        {
          sequence: 1,
          type: "else",
          actions: [
            { type: "resetStyle", target: "salesForm" },
            { type: "collapse", target: "salesForm", parameters: { scaleTo: 1 } },
            {
              type: "hide",
              target: "tooltip",
              parameters: { property: "tooltip" },
            },
            {
              type: "setVariable",
              target: "interaction",
              parameters: { name: "isHovered", value: false },
            },
          ],
        },
      ],
    },
    {
      id: "IR-CLICK-DETAILS",
      name: "Click show details",
      sourceElementId: "salesForm",
      event: {
        type: "pointer.click",
        sourceElementId: "salesForm",
      },
      isEnabled: true,
      variables: [],
      branches: [
        {
          sequence: 1,
          type: "else",
          actions: [
            {
              type: "showDetails",
              target: "salesForm",
              parameters: {
                content: "Monthly sales performance details",
              },
            },
          ],
        },
      ],
    },
  ],
};

export const INTERACTION_TEMPLATES: InteractionTemplate[] = [
  achievementHoverInteraction,
];

export const DEFAULT_WORKFLOW: WorkflowInstance = {
  id: "wf-exec-dark-2-2",
  templateId: "st-executive-dark",
  templateVersion: "2.2.0-draft",
  currentStageId: "design-review",
  stages: [
    {
      id: "draft",
      name: "Draft",
      role: "Style Designer",
      status: "completed",
      completedAt: "2026-07-24",
    },
    {
      id: "self-test",
      name: "Self-Test",
      role: "Tester",
      status: "completed",
      completedAt: "2026-07-25",
    },
    {
      id: "design-review",
      name: "Design Review",
      role: "Reviewer",
      status: "active",
    },
    {
      id: "a11y-review",
      name: "Accessibility Review",
      role: "Reviewer",
      status: "pending",
    },
    {
      id: "tech-review",
      name: "Technical Review",
      role: "Reviewer",
      status: "pending",
    },
    {
      id: "business",
      name: "Business Approval",
      role: "Approver",
      status: "pending",
    },
    {
      id: "approved",
      name: "Approved",
      role: "Publisher",
      status: "pending",
    },
    {
      id: "published",
      name: "Published",
      role: "Publisher",
      status: "pending",
    },
  ],
};

export const ARTIFACT_BINDINGS: ArtifactBinding[] = [
  {
    id: "ab-1",
    artifactName: "Sales Dashboard",
    artifactType: "dashboard",
    templateId: "st-executive-dark",
    templateVersion: "2.1.0",
    mode: "linked",
    compatibility: "pass",
  },
  {
    id: "ab-2",
    artifactName: "Monthly Email Report",
    artifactType: "email",
    templateId: "st-executive-dark",
    templateVersion: "2.1.0",
    mode: "pinned",
    compatibility: "warning",
  },
  {
    id: "ab-3",
    artifactName: "Executive Presentation",
    artifactType: "presentation",
    templateId: "st-executive-light",
    templateVersion: "2.0.0",
    mode: "linked",
    compatibility: "pass",
  },
  {
    id: "ab-4",
    artifactName: "Operational Report",
    artifactType: "report",
    templateId: "st-executive-light",
    templateVersion: "2.0.0",
    mode: "pinned",
    compatibility: "pass",
  },
  {
    id: "ab-5",
    artifactName: "Football Simulator Scene",
    artifactType: "dashboard",
    templateId: "st-executive-dark",
    templateVersion: "2.0.0",
    mode: "linked",
    compatibility: "pass",
  },
];

export const TEST_SCENARIOS: TestScenario[] = [
  {
    id: "ts-green",
    name: "Success value on hover",
    variables: { achievementPercent: 98, targetMinimum: 95, warningMinimum: 70 },
    formType: "barChart",
    renderMode: "2d",
    styleTemplateId: "st-executive-light",
    event: "pointer.hover.enter",
    expectedBranch: "IF ≥ target",
    expectedStatus: "success",
  },
  {
    id: "ts-yellow",
    name: "Warning value on hover",
    variables: { achievementPercent: 82, targetMinimum: 95, warningMinimum: 70 },
    formType: "lineChart",
    renderMode: "2d",
    styleTemplateId: "st-executive-dark",
    event: "pointer.hover.enter",
    expectedBranch: "ELSE IF ≥ warning",
    expectedStatus: "warning",
  },
  {
    id: "ts-red",
    name: "Danger value on hover",
    variables: { achievementPercent: 60, targetMinimum: 95, warningMinimum: 70 },
    formType: "barChart",
    renderMode: "3d",
    styleTemplateId: "st-executive-light",
    event: "pointer.hover.enter",
    expectedBranch: "ELSE",
    expectedStatus: "danger",
  },
  {
    id: "ts-text",
    name: "Text form success expand",
    variables: { achievementPercent: 98, targetMinimum: 95, warningMinimum: 70 },
    formType: "text",
    renderMode: "2d",
    styleTemplateId: "st-executive-dark",
    event: "pointer.hover.enter",
    expectedStatus: "success",
  },
  {
    id: "ts-exit",
    name: "Hover exit restore",
    variables: { achievementPercent: 88, targetMinimum: 95, warningMinimum: 70 },
    formType: "barChart",
    renderMode: "2d",
    styleTemplateId: "st-executive-dark",
    event: "pointer.hover.exit",
  },
];

export function formatSalesINR(value: number): string {
  const lakhs = value / 100000;
  return `₹${lakhs} lakh`;
}
