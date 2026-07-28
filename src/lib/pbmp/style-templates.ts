import type { StyleTemplate } from "./types";

const sharedAnimation = {
  expand: {
    type: "expand" as const,
    targetProperty: "scale",
    startValue: 1,
    endValue: 1.15,
    durationMs: 500,
    easing: "easeOut" as const,
    revertOnEventEnd: true,
    reducedMotionFallback: "immediate" as const,
  },
  collapse: {
    type: "expand" as const,
    targetProperty: "scale",
    startValue: 1.15,
    endValue: 1,
    durationMs: 300,
    easing: "easeIn" as const,
  },
  colourTransition: {
    type: "colour" as const,
    targetProperty: "colour",
    durationMs: 250,
    easing: "easeInOut" as const,
  },
  pulse: {
    type: "pulse" as const,
    targetProperty: "scale",
    durationMs: 700,
    iterationCount: 2,
    easing: "easeInOut" as const,
  },
};

/** Executive Light — reports, daytime dashboards, printing */
export const executiveLight: StyleTemplate = {
  id: "st-executive-light",
  name: "Executive Light",
  description:
    "White surface, PBMP blue data, Inter typography — for daytime dashboards and print.",
  family: "Corporate",
  version: "2.0.0",
  status: "approved",
  owner: "Design Team",
  updatedAt: "2026-07-22",
  intendedContexts: ["dashboard", "report", "presentation", "email"],
  coverage: {
    barChart: ["2d", "3d"],
    lineChart: ["2d", "3d"],
    text: ["2d"],
    kpiCard: ["2d"],
  },
  usedByCount: 18,
  foundation: {
    colours: {
      surface: "#FFFFFF",
      surfaceAlt: "#F7F9FC",
      border: "#D6DEE8",
      grid: "#E6EBF2",
      shadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      titleSize: 18,
      titleWeight: 600,
      bodySize: 14,
      labelSize: 12,
    },
    spacing: { padding: 16, gap: 12, margin: 8 },
    borders: { width: 1, radius: 8, style: "solid" },
    shadows: { elevation: "0 8px 24px rgba(15, 23, 42, 0.08)" },
    motion: { durationMs: 400, easing: "easeOut", emphasisScale: 1.1 },
  },
  semantic: {
    surface: {
      primary: "#FFFFFF",
      elevated: "#F7F9FC",
      tooltip: "#FFFFFF",
    },
    content: {
      primary: "#1F2937",
      secondary: "#6B7280",
      muted: "#9CA3AF",
    },
    data: {
      primary: "#2563EB",
      secondary: "#60A5FA",
      palette: ["#2563EB", "#0EA5E9", "#14B8A6", "#F59E0B"],
    },
    status: {
      success: "#16A34A",
      warning: "#EAB308",
      danger: "#DC2626",
      info: "#0284C7",
    },
    emphasis: { colour: "#2563EB", scale: 1.15 },
    interaction: {
      hover: "#1D4ED8",
      selected: "#1E40AF",
      focus: "#93C5FD",
      disabled: "#CBD5E1",
    },
  },
  formFamilies: {
    charts: {
      seriesColour: "#2563EB",
      gridColour: "#E6EBF2",
      axisLabelColour: "#6B7280",
      legendPosition: "top-right",
      tooltipSurface: "#FFFFFF",
      barRadius: 6,
      lineWidth: 2,
      markerSize: 6,
    },
    charts3d: {
      materialColour: "#2563EB",
      materialRoughness: 0.45,
      materialMetalness: 0.1,
      barDepth: 0.6,
      sceneBackground: "#F3F6FA",
      lightIntensity: 1.35,
      shadowSoftness: "soft",
      cameraAngle: "isometric",
      floorGrid: true,
      selectedOutline: "#1D4ED8",
    },
    text: {
      textColour: "#1F2937",
      background: "#FFFFFF",
      fontFamily: "Inter, sans-serif",
      fontSize: 16,
      fontWeight: 500,
      alignment: "left",
      lineHeight: 1.5,
    },
  },
  stateStyles: {
    hovered: { scale: 1.15 },
    selected: { borderColour: "#1D4ED8" },
    disabled: { opacity: 0.5 },
    error: { dataColour: "#DC2626", textColour: "#DC2626" },
  },
  animationProfiles: sharedAnimation,
};

/** Executive Dark — executive dashboards, control rooms, dark mode */
export const executiveDark: StyleTemplate = {
  id: "st-executive-dark",
  name: "Executive Dark",
  description:
    "Charcoal surface, bright cyan data — for executive dashboards and control rooms.",
  family: "Corporate",
  version: "2.1.0",
  status: "approved",
  owner: "Design Team",
  updatedAt: "2026-07-22",
  intendedContexts: ["dashboard", "presentation", "report"],
  coverage: {
    barChart: ["2d", "3d"],
    lineChart: ["2d", "3d"],
    pieChart: ["2d"],
    text: ["2d"],
    kpiCard: ["2d"],
    table: ["2d"],
  },
  usedByCount: 24,
  foundation: {
    colours: {
      surface: "#1A1F26",
      surfaceAlt: "#232A33",
      border: "transparent",
      grid: "#2F3844",
      shadow: "none",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      titleSize: 18,
      titleWeight: 600,
      bodySize: 14,
      labelSize: 12,
    },
    spacing: { padding: 16, gap: 12, margin: 8 },
    borders: { width: 0, radius: 10, style: "none" },
    shadows: { elevation: "none" },
    motion: { durationMs: 450, easing: "easeOut", emphasisScale: 1.12 },
  },
  semantic: {
    surface: {
      primary: "#1A1F26",
      elevated: "#232A33",
      tooltip: "#2A323D",
    },
    content: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
      muted: "#94A3B8",
    },
    data: {
      primary: "#22D3EE",
      secondary: "#67E8F9",
      palette: ["#22D3EE", "#34D399", "#FBBF24", "#F472B6"],
    },
    status: {
      success: "#22C55E",
      warning: "#FACC15",
      danger: "#F87171",
      info: "#38BDF8",
    },
    emphasis: { colour: "#FACC15", scale: 1.15 },
    interaction: {
      hover: "#67E8F9",
      selected: "#06B6D4",
      focus: "#22D3EE",
      disabled: "#475569",
    },
  },
  formFamilies: {
    charts: {
      seriesColour: "#22D3EE",
      gridColour: "#2F3844",
      axisLabelColour: "#CBD5E1",
      legendPosition: "top-right",
      tooltipSurface: "#2A323D",
      barRadius: 6,
      lineWidth: 2,
      markerSize: 6,
    },
    charts3d: {
      materialColour: "#22D3EE",
      materialRoughness: 0.35,
      materialMetalness: 0.25,
      barDepth: 0.65,
      sceneBackground: "#12161C",
      lightIntensity: 1.1,
      shadowSoftness: "medium",
      cameraAngle: "isometric",
      floorGrid: true,
      selectedOutline: "#22D3EE",
    },
    text: {
      textColour: "#F8FAFC",
      background: "#1A1F26",
      fontFamily: "Inter, sans-serif",
      fontSize: 16,
      fontWeight: 500,
      alignment: "left",
      lineHeight: 1.5,
    },
  },
  stateStyles: {
    hovered: { scale: 1.15 },
    selected: { borderColour: "#22D3EE" },
    disabled: { opacity: 0.45 },
    error: { dataColour: "#F87171", textColour: "#F87171" },
  },
  animationProfiles: {
    ...sharedAnimation,
    expand: { ...sharedAnimation.expand, durationMs: 450 },
  },
};

export const corporateLight: StyleTemplate = {
  ...executiveLight,
  id: "st-corporate-light",
  name: "Corporate Light",
  description: "Branded light variant with grey grid and top legend.",
  version: "1.4.0",
  status: "inReview",
  owner: "Ravi",
  updatedAt: "2026-07-21",
  usedByCount: 9,
};

export const highContrast: StyleTemplate = {
  ...executiveLight,
  id: "st-high-contrast",
  name: "High Contrast",
  description: "Accessible high-contrast treatment with large readable fonts.",
  version: "0.3.0",
  status: "draft",
  owner: "Anita",
  updatedAt: "2026-07-20",
  usedByCount: 0,
  coverage: {
    barChart: ["2d"],
    lineChart: ["2d"],
    text: ["2d"],
  },
  semantic: {
    ...executiveLight.semantic,
    content: { primary: "#000000", secondary: "#111111", muted: "#333333" },
    data: {
      primary: "#0000EE",
      secondary: "#006600",
      palette: ["#0000EE", "#006600", "#990000", "#000000"],
    },
    status: {
      success: "#006600",
      warning: "#996600",
      danger: "#990000",
      info: "#0000EE",
    },
  },
  foundation: {
    ...executiveLight.foundation,
    typography: {
      ...executiveLight.foundation.typography,
      titleSize: 22,
      bodySize: 16,
      labelSize: 14,
    },
  },
};

export const STYLE_TEMPLATES: StyleTemplate[] = [
  executiveDark,
  executiveLight,
  corporateLight,
  highContrast,
];

export function getStyleTemplate(id: string): StyleTemplate | undefined {
  return STYLE_TEMPLATES.find((t) => t.id === id);
}
