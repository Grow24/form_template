import type {
  FormType,
  FormVariantDefinition,
  FunctionalityDefinition,
} from "./types";

/** Form variants of the same Line/Bar Chart functionality (presentation only) */
export const FORM_VARIANTS: FormVariantDefinition[] = [
  {
    id: "corporateLight",
    name: "Corporate Light",
    background: "White",
    font: "Arial",
    presentation: "Solid line / blue bars",
    otherSettings: "Grey grid, legend at top",
    styleTemplateId: "st-corporate-light",
  },
  {
    id: "executiveDark",
    name: "Executive Dark",
    background: "Dark charcoal",
    font: "Inter",
    presentation: "Bright cyan line / bars",
    otherSettings: "Minimal grid, large KPI labels",
    styleTemplateId: "st-executive-dark",
  },
  {
    id: "pbmpBranded",
    name: "PBMP Branded",
    background: "PBMP background",
    font: "PBMP font",
    presentation: "Brand-styled series",
    otherSettings: "Logo, branded title area",
    styleTemplateId: "st-executive-dark",
  },
  {
    id: "presentation",
    name: "Presentation Form",
    background: "Transparent/light",
    font: "Large font",
    presentation: "Thick series",
    otherSettings: "Fewer axis labels",
    styleTemplateId: "st-executive-light",
  },
  {
    id: "mobile",
    name: "Mobile Form",
    background: "Compact",
    font: "Smaller responsive font",
    presentation: "Simplified series",
    otherSettings: "Collapsed legend",
    styleTemplateId: "st-executive-light",
  },
  {
    id: "accessible",
    name: "Accessible Form",
    background: "High contrast",
    font: "Large readable font",
    presentation: "Thick distinguishable series",
    otherSettings: "Enhanced labels and markers",
    styleTemplateId: "st-high-contrast",
  },
  {
    id: "print",
    name: "Print Form",
    background: "White",
    font: "Print-safe font",
    presentation: "Black/grey line styles",
    otherSettings: "No animation or hover controls",
    styleTemplateId: "st-executive-light",
  },
];

export const FUNCTIONALITIES: FunctionalityDefinition[] = [
  {
    id: "FN-SALES-TREND",
    name: "Show monthly sales performance",
    intendedOutcome:
      "Display monthly sales trend for comparison and achievement tracking",
    inputs: ["Month", "Sales", "Target", "Prior Year", "AchievementPercent"],
    outputs: ["Rendered Form instance", "Hover status", "Tooltip details"],
    constraints: [
      "Content/data and analytical meaning must remain unchanged across Forms",
      "Style Template must use semantic tokens, not Form-type hardcoding",
      "Interaction Template is reusable across Line, Bar and Text",
    ],
    contentId: "content-monthly-sales",
    forms: [
      {
        formId: "FRM-BAR-2D3D",
        formType: "barChart",
        channel: "dashboard",
        medium: "visual",
        mediaType: "chart",
        format: "2d|3d",
        targetRole: "executive",
        targetDevice: "desktop",
        templateIds: ["st-executive-dark", "st-executive-light"],
      },
      {
        formId: "FRM-LINE-2D3D",
        formType: "lineChart",
        channel: "dashboard",
        medium: "visual",
        mediaType: "chart",
        format: "2d|3d",
        targetRole: "analyst",
        targetDevice: "desktop",
        templateIds: ["st-executive-dark", "st-executive-light"],
      },
      {
        formId: "FRM-TEXT",
        formType: "text",
        channel: "report",
        medium: "document",
        mediaType: "text",
        format: "paragraph",
        targetRole: "reader",
        targetDevice: "any",
        templateIds: ["st-executive-dark", "st-executive-light"],
      },
      {
        formId: "FRM-KPI",
        formType: "kpiCard",
        channel: "dashboard",
        medium: "visual",
        mediaType: "card",
        format: "2d",
        targetRole: "executive",
        targetDevice: "desktop|mobile",
        templateIds: ["st-executive-dark"],
      },
      {
        formId: "FRM-TABLE",
        formType: "table",
        channel: "report",
        medium: "document",
        mediaType: "table",
        format: "grid",
        targetRole: "analyst",
        targetDevice: "desktop",
        templateIds: ["st-executive-light"],
      },
    ],
  },
  {
    id: "FN-APPROVAL",
    name: "Obtain the user’s approval",
    intendedOutcome: "Capture an approval decision for a request",
    inputs: ["requestId", "userId", "approvalState"],
    outputs: ["approval decision", "audit trail"],
    constraints: [
      "Linguistic sentence type changes are functional configuration, not mere Form packaging",
      "UI / API / chatbot / spoken are different Forms of the same Functionality",
    ],
    contentId: "content-monthly-sales",
    forms: [
      {
        formId: "FRM-UI-APPROVE",
        formType: "text",
        channel: "ui",
        medium: "interactive",
        mediaType: "form-control",
        format: "checkbox+button",
        targetRole: "approver",
        targetDevice: "desktop|mobile",
        templateIds: ["st-executive-light"],
      },
      {
        formId: "FRM-API-APPROVE",
        formType: "text",
        channel: "api",
        medium: "message",
        mediaType: "json",
        format: '{"action":"approve","requestId":"123"}',
        targetRole: "system",
        targetDevice: "server",
        templateIds: ["st-executive-light"],
      },
    ],
  },
];

/** Combination matrix: Form Type × Style Template */
export const COMBINATION_MATRIX: {
  formType: FormType;
  executiveLight: string;
  executiveDark: string;
}[] = [
  {
    formType: "lineChart",
    executiveLight: "Blue line on white background",
    executiveDark: "Cyan line on dark background",
  },
  {
    formType: "barChart",
    executiveLight: "Blue bars on white background",
    executiveDark: "Cyan bars on dark background",
  },
  {
    formType: "text",
    executiveLight: "Dark text on white surface",
    executiveDark: "Light text on charcoal surface",
  },
];

export const TEST_CONSOLE_METRICS = {
  visual: { passed: 36, total: 36 },
  interaction: { passed: 24, total: 24 },
  accessibility: { passed: 18, total: 18 },
  performance: { passed: 12, total: 12 },
  lastRunAt: "2026-07-28 11:28",
};
