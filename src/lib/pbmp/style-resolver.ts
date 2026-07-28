import type {
  FormType,
  RenderMode,
  RuntimeOverride,
  StyleTemplate,
} from "./types";

export interface ResolvedStyle {
  surface: string;
  elevated: string;
  tooltip: string;
  contentPrimary: string;
  contentSecondary: string;
  dataPrimary: string;
  grid: string;
  border: string;
  borderRadius: number;
  shadow: string;
  fontFamily: string;
  titleSize: number;
  titleWeight: number;
  lineWidth: number;
  markerSize: number;
  barRadius: number;
  legendPosition: string;
  scale: number;
  opacity: number;
  statusColour?: string;
  highlightedIndex: number | null;
  tooltipVisible: boolean;
  tooltipContent?: string;
  pulsing: boolean;
  // 3D
  materialColour: string;
  materialRoughness: number;
  materialMetalness: number;
  barDepth: number;
  sceneBackground: string;
  lightIntensity: number;
  selectedOutline: string;
  floorGrid: boolean;
  // text
  textColour: string;
  textSize: number;
  textWeight: number;
  textAlign: "left" | "center" | "right" | "justify";
  lineHeight: number;
}

/**
 * Style resolution order (last wins):
 * Base Style Template → Form-specific Style → Instance Override → State Style → Event Runtime Override
 */
export function resolveStyle(
  template: StyleTemplate,
  formType: FormType,
  renderMode: RenderMode,
  runtime?: RuntimeOverride,
): ResolvedStyle {
  const charts = template.formFamilies.charts;
  const charts3d = template.formFamilies.charts3d;
  const text = template.formFamilies.text;

  let dataPrimary = template.semantic.data.primary;
  let textColour = text?.textColour ?? template.semantic.content.primary;
  let scale = 1;
  let opacity = 1;
  let statusColour: string | undefined;

  if (runtime?.statusColour) {
    statusColour = template.semantic.status[runtime.statusColour];
    dataPrimary = statusColour;
    textColour = statusColour;
  }
  if (runtime?.dataColour) dataPrimary = runtime.dataColour;
  if (runtime?.textColour) textColour = runtime.textColour;
  if (runtime?.scale != null) scale = runtime.scale;
  if (runtime?.opacity != null) opacity = runtime.opacity;

  return {
    surface: template.semantic.surface.primary,
    elevated: template.semantic.surface.elevated,
    tooltip: template.semantic.surface.tooltip,
    contentPrimary: template.semantic.content.primary,
    contentSecondary: template.semantic.content.secondary,
    dataPrimary,
    grid: charts?.gridColour ?? template.foundation.colours.grid,
    border: template.foundation.colours.border,
    borderRadius: template.foundation.borders.radius,
    shadow: template.foundation.shadows.elevation,
    fontFamily: template.foundation.typography.fontFamily,
    titleSize: template.foundation.typography.titleSize,
    titleWeight: template.foundation.typography.titleWeight,
    lineWidth: charts?.lineWidth ?? 2,
    markerSize: charts?.markerSize ?? 6,
    barRadius: charts?.barRadius ?? 4,
    legendPosition: charts?.legendPosition ?? "top-right",
    scale,
    opacity,
    statusColour,
    highlightedIndex: runtime?.highlightedIndex ?? null,
    tooltipVisible: runtime?.tooltipVisible ?? false,
    tooltipContent: runtime?.tooltipContent,
    pulsing: runtime?.pulsing ?? false,
    materialColour: dataPrimary,
    materialRoughness: charts3d?.materialRoughness ?? 0.4,
    materialMetalness: charts3d?.materialMetalness ?? 0.1,
    barDepth: charts3d?.barDepth ?? 0.6,
    sceneBackground:
      renderMode === "3d"
        ? (charts3d?.sceneBackground ?? template.semantic.surface.primary)
        : template.semantic.surface.primary,
    lightIntensity: charts3d?.lightIntensity ?? 1.2,
    selectedOutline:
      charts3d?.selectedOutline ?? template.semantic.interaction.selected,
    floorGrid: charts3d?.floorGrid ?? true,
    textColour,
    textSize: text?.fontSize ?? 16,
    textWeight: text?.fontWeight ?? 500,
    textAlign: text?.alignment ?? "left",
    lineHeight: text?.lineHeight ?? 1.5,
  };
}

/** Map semantic style intentions to Form-specific properties */
export function interpretSemanticToken(
  token: string,
  formType: FormType,
): string {
  const map: Record<string, Record<FormType, string>> = {
    "data.primary": {
      lineChart: "lineColour",
      barChart: "barFillColour",
      pieChart: "sliceColour",
      text: "textColour",
      kpiCard: "valueColour",
      table: "headerAccent",
    },
    "status.success": {
      lineChart: "lineColour",
      barChart: "barFillColour",
      pieChart: "sliceColour",
      text: "textColour",
      kpiCard: "statusIndicator",
      table: "cellHighlight",
    },
    "emphasis.scale": {
      lineChart: "containerScale",
      barChart: "containerScale",
      pieChart: "containerScale",
      text: "textContainerScale",
      kpiCard: "cardScale",
      table: "rowScale",
    },
  };
  return map[token]?.[formType] ?? token;
}
