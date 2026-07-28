/** PBMP canonical type model — Functionality → Content → Form → Style → Interaction → Variables → Rendered */

export type FormType =
  | "lineChart"
  | "barChart"
  | "pieChart"
  | "text"
  | "kpiCard"
  | "table";
export type FormFamily = "text" | "chart2d" | "chart3d" | "table" | "container";
export type RenderMode = "2d" | "3d";
export type ArtifactContext = "dashboard" | "email" | "report" | "presentation";
export type FormVariantId =
  | "corporateLight"
  | "executiveDark"
  | "pbmpBranded"
  | "presentation"
  | "mobile"
  | "accessible"
  | "print";
export type StudioCanvasTab =
  | "overview"
  | "2d"
  | "3d"
  | "states"
  | "interactions"
  | "animations"
  | "accessibility";
export type DevicePreview = "desktop" | "tablet" | "mobile";
export type CameraPreset = "isometric" | "perspective" | "orthographic";
export type LightingPreset = "studio" | "bright" | "dramatic" | "soft";
export type TemplateStatus =
  | "draft"
  | "selfTest"
  | "inReview"
  | "approved"
  | "published"
  | "rejected";

export type InteractionState =
  | "default"
  | "hovered"
  | "selected"
  | "focused"
  | "disabled"
  | "error";

export type PbmpEventType =
  | "pointer.hover.enter"
  | "pointer.hover.exit"
  | "pointer.click"
  | "pointer.doubleClick"
  | "value.change"
  | "focus.enter"
  | "focus.exit"
  | "component.load"
  | "component.render"
  | "data.updated"
  | "data.thresholdCrossed"
  | "timer.delay"
  | "object.pointer.enter"
  | "object.pointer.exit"
  | "object.click"
  | "object.selected"
  | "collision.enter"
  | "animation.finished"
  | "scene.ready";

export type ActionType =
  | "setSemanticStyle"
  | "applyStyleTemplate"
  | "resetStyle"
  | "expand"
  | "collapse"
  | "show"
  | "hide"
  | "highlight"
  | "showTooltip"
  | "filter"
  | "navigate"
  | "setVariable"
  | "emitEvent"
  | "runProcess"
  | "pulse"
  | "changeColour"
  | "showDetails";

export type VariableScope =
  | "component"
  | "page"
  | "workspace"
  | "user"
  | "process"
  | "global"
  | "dataRow"
  | "formula";

export type VariableSourceType =
  | "constant"
  | "componentProperty"
  | "dataField"
  | "rowValue"
  | "globalVariable"
  | "workspaceVariable"
  | "userVariable"
  | "processVariable"
  | "formula"
  | "apiResponse"
  | "environment"
  | "anotherComponent";

export type DataType =
  | "string"
  | "number"
  | "boolean"
  | "decimal"
  | "date"
  | "object"
  | "array";

export interface FoundationTokens {
  colours: {
    surface: string;
    surfaceAlt: string;
    border: string;
    grid: string;
    shadow: string;
  };
  typography: {
    fontFamily: string;
    titleSize: number;
    titleWeight: number;
    bodySize: number;
    labelSize: number;
  };
  spacing: {
    padding: number;
    gap: number;
    margin: number;
  };
  borders: {
    width: number;
    radius: number;
    style: "solid" | "dashed" | "dotted" | "none";
  };
  shadows: {
    elevation: string;
  };
  motion: {
    durationMs: number;
    easing: string;
    emphasisScale: number;
  };
}

export interface SemanticTokens {
  surface: { primary: string; elevated: string; tooltip: string };
  content: { primary: string; secondary: string; muted: string };
  data: { primary: string; secondary: string; palette: string[] };
  status: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  emphasis: { colour: string; scale: number };
  interaction: {
    hover: string;
    selected: string;
    focus: string;
    disabled: string;
  };
}

export interface Chart2DMappings {
  seriesColour: string;
  gridColour: string;
  axisLabelColour: string;
  legendPosition: "top" | "top-right" | "bottom" | "left" | "right";
  tooltipSurface: string;
  barRadius?: number;
  lineWidth?: number;
  markerSize?: number;
}

export interface Chart3DMappings {
  materialColour: string;
  materialRoughness: number;
  materialMetalness: number;
  barDepth: number;
  sceneBackground: string;
  lightIntensity: number;
  shadowSoftness: "soft" | "medium" | "hard";
  cameraAngle: "isometric" | "perspective" | "orthographic";
  floorGrid: boolean;
  selectedOutline: string;
}

export interface TextMappings {
  textColour: string;
  background: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  alignment: "left" | "center" | "right" | "justify";
  lineHeight: number;
}

export interface StyleTemplate {
  id: string;
  name: string;
  description: string;
  family: string;
  version: string;
  status: TemplateStatus;
  owner: string;
  updatedAt: string;
  intendedContexts: ArtifactContext[];
  coverage: Partial<Record<FormType, RenderMode[]>>;
  usedByCount: number;
  foundation: FoundationTokens;
  semantic: SemanticTokens;
  formFamilies: {
    charts?: Chart2DMappings;
    charts3d?: Chart3DMappings;
    text?: TextMappings;
  };
  stateStyles: Partial<
    Record<
      InteractionState,
      Partial<{
        dataColour: string;
        textColour: string;
        scale: number;
        opacity: number;
        borderColour: string;
      }>
    >
  >;
  animationProfiles: {
    expand: AnimationSpec;
    collapse: AnimationSpec;
    colourTransition: AnimationSpec;
    pulse: AnimationSpec;
  };
}

export interface AnimationSpec {
  type?: "expand" | "fade" | "slide" | "rotate" | "pulse" | "colour";
  targetProperty?: string;
  startValue?: number | string;
  endValue?: number | string;
  durationMs: number;
  delayMs?: number;
  easing: "linear" | "easeIn" | "easeOut" | "easeInOut";
  direction?: "forward" | "reverse";
  iterationCount?: number | "infinite";
  executionMode?: "sequential" | "parallel";
  revertOnEventEnd?: boolean;
  interruptBehaviour?: "reverse" | "stop" | "complete";
  fillBehaviour?: "retain" | "none";
  reducedMotionFallback?: "immediate" | "skip";
}

export interface VariableDefinition {
  id: string;
  name: string;
  dataType: DataType;
  scope: VariableScope;
  sourceType: VariableSourceType;
  sourceBinding?: string;
  value?: unknown;
  defaultValue?: unknown;
  refreshTrigger?: string;
  isReadOnly?: boolean;
}

export interface ConditionNode {
  [operator: string]: unknown;
}

export interface PbmpAction {
  type: ActionType;
  target: string;
  parameters?: Record<string, unknown>;
  animation?: AnimationSpec;
}

export interface InteractionBranch {
  sequence: number;
  type: "if" | "elseIf" | "else";
  condition?: ConditionNode;
  actions: PbmpAction[];
}

export interface InteractionRule {
  id: string;
  name: string;
  sourceComponent?: string;
  sourceElementId: string;
  event: { type: PbmpEventType; sourceElementId: string };
  variables: VariableDefinition[];
  branches: InteractionBranch[];
  priority?: number;
  stopAfterMatch?: boolean;
  isEnabled: boolean;
  revertBehaviour?: "resetStyle" | "collapse" | "custom";
  errorAction?: PbmpAction;
}

export interface InteractionTemplate {
  id: string;
  name: string;
  description: string;
  rules: InteractionRule[];
}

export interface DataPoint {
  category: string;
  value: number;
  target?: number;
  priorYear?: number;
  achievementPercent?: number;
}

export interface ContentDefinition {
  id: string;
  name: string;
  functionality: string;
  dataSource: string;
  categoryField: string;
  measureField: string;
  aggregation: "sum" | "avg" | "count" | "min" | "max";
  sorting: "asc" | "desc" | "none";
  numberFormat: "currency" | "percent" | "decimal" | "compact";
  data: DataPoint[];
  unitLabel?: string;
}

/** One Functionality → Multiple Forms */
export interface FunctionalityDefinition {
  id: string;
  name: string;
  intendedOutcome: string;
  inputs: string[];
  outputs: string[];
  constraints: string[];
  contentId: string;
  forms: {
    formId: string;
    formType: FormType;
    channel: string;
    medium: string;
    mediaType: string;
    format: string;
    targetRole: string;
    targetDevice: string;
    templateIds: string[];
  }[];
}

export interface FormVariantDefinition {
  id: FormVariantId;
  name: string;
  background: string;
  font: string;
  presentation: string;
  otherSettings: string;
  styleTemplateId: string;
}

export interface ComponentInstance {
  id: string;
  name: string;
  formType: FormType;
  renderMode: RenderMode;
  contentId: string;
  styleTemplateId: string;
  interactionTemplateId?: string;
  title: string;
  subtitle?: string;
  artifactContext: ArtifactContext;
  instanceStyleOverrides?: Record<string, unknown>;
}

export interface RuntimeOverride {
  scale?: number;
  dataColour?: string;
  textColour?: string;
  statusColour?: "success" | "warning" | "danger" | "info";
  opacity?: number;
  highlightedIndex?: number | null;
  tooltipVisible?: boolean;
  tooltipContent?: string;
  pulsing?: boolean;
}

export interface EventTraceEntry {
  id: string;
  timestamp: number;
  step: string;
  detail: string;
  level: "info" | "success" | "warning" | "error";
}

export interface WorkflowStage {
  id: string;
  name: string;
  role: string;
  status: "pending" | "active" | "completed" | "rejected" | "skipped";
  completedAt?: string;
  comment?: string;
}

export interface WorkflowInstance {
  id: string;
  templateId: string;
  templateVersion: string;
  stages: WorkflowStage[];
  currentStageId: string;
}

export interface ArtifactBinding {
  id: string;
  artifactName: string;
  artifactType: ArtifactContext;
  templateId: string;
  templateVersion: string;
  mode: "linked" | "pinned" | "forked";
  compatibility: "pass" | "warning" | "breaking";
}

export interface TestScenario {
  id: string;
  name: string;
  variables: Record<string, number | string | boolean>;
  formType: FormType;
  renderMode: RenderMode;
  styleTemplateId: string;
  event: PbmpEventType;
  expectedBranch?: string;
  expectedStatus?: "success" | "warning" | "danger";
}

export type WorkspaceId =
  | "library"
  | "studio"
  | "test-lab"
  | "workflow"
  | "published"
  | "applications"
  | "impact"
  | "functionality"
  | "settings";

export type PreviewMode = "2d" | "3d" | "split" | "artifact";
export type InspectorSection =
  | "basics"
  | "tokens"
  | "formMapping"
  | "states"
  | "interactions"
  | "animations"
  | "accessibility"
  | "performance";
