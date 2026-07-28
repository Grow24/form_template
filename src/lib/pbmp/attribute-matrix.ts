export type Applicability = "yes" | "equiv" | "no";

export interface AttributeRow {
  group: string;
  attribute: string;
  lineChart: Applicability;
  barChart: Applicability;
  text: Applicability;
  meaning: string;
}

/** Practical PBMP attribute matrix for Line Chart, Bar Chart, and Text */
export const ATTRIBUTE_MATRIX: AttributeRow[] = [
  { group: "Common container", attribute: "Background colour", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Background of the component or content area" },
  { group: "Common container", attribute: "Background image/gradient", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Decorative or branded background" },
  { group: "Common container", attribute: "Width / Height", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Component dimensions" },
  { group: "Common container", attribute: "Padding / Margin", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Inner and outer spacing" },
  { group: "Common container", attribute: "Border / Radius / Shadow", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Container elevation and outline" },
  { group: "Common typography", attribute: "Font family / size / weight", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Titles, labels, values or text" },
  { group: "Common typography", attribute: "Text colour", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Colour of titles, labels or content" },
  { group: "Common typography", attribute: "Text alignment", lineChart: "equiv", barChart: "equiv", text: "yes", meaning: "Chart-title/label or paragraph alignment" },
  { group: "Title and description", attribute: "Title visibility / text / position", lineChart: "yes", barChart: "yes", text: "equiv", meaning: "Whether and where the heading appears" },
  { group: "Data mapping", attribute: "Data source / category / measure", lineChart: "yes", barChart: "yes", text: "equiv", meaning: "Source fields and aggregation" },
  { group: "Data mapping", attribute: "Filtering / number / date format", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Displayed content rules and formats" },
  { group: "Axes", attribute: "X/Y visibility, labels, range", lineChart: "yes", barChart: "yes", text: "no", meaning: "Axis presentation and scale" },
  { group: "Axes", attribute: "Zero baseline", lineChart: "equiv", barChart: "yes", text: "no", meaning: "Whether values begin from zero" },
  { group: "Grid", attribute: "Visibility / colour / style", lineChart: "yes", barChart: "yes", text: "no", meaning: "Chart grid reference lines" },
  { group: "Series styling", attribute: "Series colour / opacity / visibility", lineChart: "yes", barChart: "yes", text: "equiv", meaning: "Primary visual emphasis colour" },
  { group: "Line-specific", attribute: "Line width / style / curve", lineChart: "yes", barChart: "no", text: "no", meaning: "Thickness and path shape" },
  { group: "Line-specific", attribute: "Point markers / area fill", lineChart: "yes", barChart: "no", text: "no", meaning: "Markers and shaded area under line" },
  { group: "Bar-specific", attribute: "Bar fill / width / gap / radius", lineChart: "no", barChart: "yes", text: "no", meaning: "Bar geometry and spacing" },
  { group: "Bar-specific", attribute: "Orientation / stacked mode", lineChart: "no", barChart: "yes", text: "no", meaning: "Vertical/horizontal and grouping" },
  { group: "Text-specific", attribute: "Paragraph / wrap / overflow", lineChart: "no", barChart: "no", text: "yes", meaning: "Text layout behaviour" },
  { group: "Text-specific", attribute: "Emphasis / heading level", lineChart: "no", barChart: "no", text: "yes", meaning: "Typographic hierarchy" },
  { group: "Labels", attribute: "Data-label visibility / position", lineChart: "yes", barChart: "yes", text: "equiv", meaning: "Whether values are shown directly" },
  { group: "Legend", attribute: "Visibility / position / marker", lineChart: "yes", barChart: "yes", text: "equiv", meaning: "Category/series key presentation" },
  { group: "Interaction", attribute: "Tooltip / hover / click", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Pointer and selection behaviour" },
  { group: "Interaction", attribute: "Zoom / Pan", lineChart: "yes", barChart: "equiv", text: "no", meaning: "Chart navigation" },
  { group: "Animation", attribute: "Initial / update / easing", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Appearance and transition motion" },
  { group: "Responsive", attribute: "Desktop / tablet / mobile", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Viewport-specific presentation" },
  { group: "Accessibility", attribute: "Title / keyboard / contrast", lineChart: "yes", barChart: "yes", text: "yes", meaning: "Assistive and inclusive behaviour" },
];

/** Three-layer template inheritance model */
export const TEMPLATE_LAYERS = [
  {
    layer: "Universal Style Template",
    purpose: "Attributes reusable across all Forms",
    examples: "Background, font, border, spacing, shadow, title style",
  },
  {
    layer: "Form-Family Template",
    purpose: "Attributes shared by related Forms",
    examples: "Axes, grids, legends and tooltips for charts",
  },
  {
    layer: "Form-Type Template",
    purpose: "Attributes unique to a specific Form",
    examples: "Line width, bar width, paragraph spacing",
  },
] as const;
