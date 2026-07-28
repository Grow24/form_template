"use client";

import { create } from "zustand";
import {
  ARTIFACT_BINDINGS,
  DEFAULT_WORKFLOW,
  TEST_SCENARIOS,
  achievementHoverInteraction,
  monthlySalesContent,
} from "@/lib/pbmp/sample-data";
import {
  STYLE_TEMPLATES,
  executiveDark,
  getStyleTemplate,
} from "@/lib/pbmp/style-templates";
import type {
  ArtifactBinding,
  ArtifactContext,
  CameraPreset,
  DevicePreview,
  EventTraceEntry,
  FormType,
  InspectorSection,
  LightingPreset,
  PreviewMode,
  RenderMode,
  RuntimeOverride,
  StyleTemplate,
  StudioCanvasTab,
  TestScenario,
  WorkflowInstance,
  WorkspaceId,
} from "@/lib/pbmp/types";
import { dispatchInteraction } from "@/lib/runtime/form-runtime";

interface StudioState {
  workspace: WorkspaceId;
  templates: StyleTemplate[];
  activeTemplateId: string;
  formType: FormType;
  renderMode: RenderMode;
  previewMode: PreviewMode;
  artifactContext: ArtifactContext;
  inspectorSection: InspectorSection;
  inspectorAdvanced: boolean;
  canvasTab: StudioCanvasTab;
  devicePreview: DevicePreview;
  dataset: string;
  cameraPreset: CameraPreset;
  lightingPreset: LightingPreset;
  animationSpeedMs: number;
  runtimeOverride: RuntimeOverride;
  eventTrace: EventTraceEntry[];
  variables: {
    achievementPercent: number;
    targetMinimum: number;
    warningMinimum: number;
  };
  workflow: WorkflowInstance;
  artifacts: ArtifactBinding[];
  scenarios: TestScenario[];
  activeScenarioId: string;
  saved: boolean;
  createWizardOpen: boolean;
  selectedLibraryFilter: string;

  setWorkspace: (w: WorkspaceId) => void;
  setActiveTemplate: (id: string) => void;
  setFormType: (f: FormType) => void;
  setRenderMode: (m: RenderMode) => void;
  setPreviewMode: (m: PreviewMode) => void;
  setArtifactContext: (a: ArtifactContext) => void;
  setInspectorSection: (s: InspectorSection) => void;
  setInspectorAdvanced: (v: boolean) => void;
  setCanvasTab: (t: StudioCanvasTab) => void;
  setDevicePreview: (d: DevicePreview) => void;
  setDataset: (d: string) => void;
  setCameraPreset: (c: CameraPreset) => void;
  setLightingPreset: (l: LightingPreset) => void;
  setAnimationSpeedMs: (ms: number) => void;
  updateSemanticColour: (
    path: "data.primary" | "status.success" | "status.warning" | "status.danger" | "content.primary" | "surface.primary",
    value: string,
  ) => void;
  updateBarRadius: (v: number) => void;
  updateBarDepth: (v: number) => void;
  setVariable: (key: keyof StudioState["variables"], value: number) => void;
  dispatchEvent: (
    eventType:
      | "pointer.hover.enter"
      | "pointer.hover.exit"
      | "pointer.click"
      | "object.pointer.enter"
      | "object.pointer.exit"
      | "object.click",
  ) => void;
  runScenario: (id: string, stayInWorkspace?: boolean) => void;
  clearTrace: () => void;
  markSaved: () => void;
  submitForReview: () => void;
  approveStage: (stageId: string, comment?: string) => void;
  rejectStage: (stageId: string, comment: string) => void;
  setCreateWizardOpen: (v: boolean) => void;
  setLibraryFilter: (v: string) => void;
  getActiveTemplate: () => StyleTemplate;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  workspace: "library",
  templates: STYLE_TEMPLATES.map((t) => structuredClone(t)),
  activeTemplateId: executiveDark.id,
  formType: "barChart",
  renderMode: "2d",
  previewMode: "split",
  artifactContext: "dashboard",
  inspectorSection: "basics",
  inspectorAdvanced: false,
  canvasTab: "overview",
  devicePreview: "desktop",
  dataset: "sample1",
  cameraPreset: "isometric",
  lightingPreset: "studio",
  animationSpeedMs: 400,
  runtimeOverride: {},
  eventTrace: [],
  variables: {
    achievementPercent: 82,
    targetMinimum: 95,
    warningMinimum: 70,
  },
  workflow: structuredClone(DEFAULT_WORKFLOW),
  artifacts: ARTIFACT_BINDINGS,
  scenarios: TEST_SCENARIOS,
  activeScenarioId: "ts-yellow",
  saved: true,
  createWizardOpen: false,
  selectedLibraryFilter: "all",

  setWorkspace: (workspace) => set({ workspace }),
  setActiveTemplate: (activeTemplateId) =>
    set({ activeTemplateId, saved: true, runtimeOverride: {} }),
  setFormType: (formType) => set({ formType, runtimeOverride: {} }),
  setRenderMode: (renderMode) => set({ renderMode }),
  setPreviewMode: (previewMode) =>
    set({
      previewMode,
      renderMode:
        previewMode === "3d" ? "3d" : previewMode === "2d" ? "2d" : get().renderMode,
    }),
  setArtifactContext: (artifactContext) => set({ artifactContext }),
  setInspectorSection: (inspectorSection) => set({ inspectorSection }),
  setInspectorAdvanced: (inspectorAdvanced) => set({ inspectorAdvanced }),
  setCanvasTab: (canvasTab) => set({ canvasTab }),
  setDevicePreview: (devicePreview) => set({ devicePreview }),
  setDataset: (dataset) => set({ dataset }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setLightingPreset: (lightingPreset) => set({ lightingPreset }),
  setAnimationSpeedMs: (animationSpeedMs) => {
    const { templates, activeTemplateId } = get();
    set({
      animationSpeedMs,
      saved: false,
      templates: templates.map((t) => {
        if (t.id !== activeTemplateId) return t;
        const clone = structuredClone(t);
        clone.foundation.motion.durationMs = animationSpeedMs;
        clone.animationProfiles.expand.durationMs = animationSpeedMs;
        return clone;
      }),
    });
  },

  updateSemanticColour: (path, value) => {
    const { templates, activeTemplateId } = get();
    const next = templates.map((t) => {
      if (t.id !== activeTemplateId) return t;
      const clone = structuredClone(t);
      if (path === "data.primary") {
        clone.semantic.data.primary = value;
        if (clone.formFamilies.charts) clone.formFamilies.charts.seriesColour = value;
        if (clone.formFamilies.charts3d)
          clone.formFamilies.charts3d.materialColour = value;
      } else if (path === "status.success") clone.semantic.status.success = value;
      else if (path === "status.warning") clone.semantic.status.warning = value;
      else if (path === "status.danger") clone.semantic.status.danger = value;
      else if (path === "content.primary") {
        clone.semantic.content.primary = value;
        if (clone.formFamilies.text) clone.formFamilies.text.textColour = value;
      } else if (path === "surface.primary") {
        clone.semantic.surface.primary = value;
        clone.foundation.colours.surface = value;
      }
      return clone;
    });
    set({ templates: next, saved: false });
  },

  updateBarRadius: (v) => {
    const { templates, activeTemplateId } = get();
    set({
      saved: false,
      templates: templates.map((t) => {
        if (t.id !== activeTemplateId) return t;
        const clone = structuredClone(t);
        if (clone.formFamilies.charts) clone.formFamilies.charts.barRadius = v;
        return clone;
      }),
    });
  },

  updateBarDepth: (v) => {
    const { templates, activeTemplateId } = get();
    set({
      saved: false,
      templates: templates.map((t) => {
        if (t.id !== activeTemplateId) return t;
        const clone = structuredClone(t);
        if (clone.formFamilies.charts3d) clone.formFamilies.charts3d.barDepth = v;
        return clone;
      }),
    });
  },

  setVariable: (key, value) =>
    set((s) => ({ variables: { ...s.variables, [key]: value } })),

  dispatchEvent: (eventType) => {
    const state = get();
    const template =
      state.templates.find((t) => t.id === state.activeTemplateId) ??
      getStyleTemplate(state.activeTemplateId)!;

    const mappedEvent =
      eventType === "object.pointer.enter"
        ? "pointer.hover.enter"
        : eventType === "object.pointer.exit"
          ? "pointer.hover.exit"
          : eventType === "object.click"
            ? "pointer.click"
            : eventType;

    const result = dispatchInteraction({
      eventType: mappedEvent,
      interaction: achievementHoverInteraction,
      styleTemplate: template,
      variableOverrides: state.variables,
      currentOverride: state.runtimeOverride,
    });

    set({
      runtimeOverride: result.override,
      eventTrace: [...result.traces, ...state.eventTrace].slice(0, 40),
    });
  },

  runScenario: (id, stayInWorkspace = false) => {
    const scenario = get().scenarios.find((s) => s.id === id);
    if (!scenario) return;
    set({
      activeScenarioId: id,
      formType: scenario.formType,
      renderMode: scenario.renderMode,
      activeTemplateId: scenario.styleTemplateId,
      variables: {
        achievementPercent: Number(scenario.variables.achievementPercent),
        targetMinimum: Number(scenario.variables.targetMinimum),
        warningMinimum: Number(scenario.variables.warningMinimum),
      },
      runtimeOverride: {},
      eventTrace: [],
      ...(stayInWorkspace ? {} : { workspace: "test-lab" as const }),
    });
    setTimeout(() => get().dispatchEvent(scenario.event as "pointer.hover.enter"), 50);
  },

  clearTrace: () => set({ eventTrace: [], runtimeOverride: {} }),
  markSaved: () => set({ saved: true }),
  submitForReview: () => {
    const workflow = structuredClone(get().workflow);
    const draft = workflow.stages.find((s) => s.id === "draft");
    const self = workflow.stages.find((s) => s.id === "self-test");
    const design = workflow.stages.find((s) => s.id === "design-review");
    if (draft) draft.status = "completed";
    if (self) self.status = "completed";
    if (design) design.status = "active";
    workflow.currentStageId = "design-review";
    set({ workflow, workspace: "workflow", saved: true });
  },
  approveStage: (stageId, comment) => {
    const workflow = structuredClone(get().workflow);
    const idx = workflow.stages.findIndex((s) => s.id === stageId);
    if (idx < 0) return;
    workflow.stages[idx].status = "completed";
    workflow.stages[idx].comment = comment;
    workflow.stages[idx].completedAt = new Date().toISOString().slice(0, 10);
    if (idx + 1 < workflow.stages.length) {
      workflow.stages[idx + 1].status = "active";
      workflow.currentStageId = workflow.stages[idx + 1].id;
    }
    set({ workflow });
  },
  rejectStage: (stageId, comment) => {
    const workflow = structuredClone(get().workflow);
    const stage = workflow.stages.find((s) => s.id === stageId);
    if (!stage) return;
    stage.status = "rejected";
    stage.comment = comment;
    const draft = workflow.stages.find((s) => s.id === "draft");
    if (draft) {
      draft.status = "active";
      workflow.currentStageId = "draft";
    }
    set({ workflow });
  },
  setCreateWizardOpen: (createWizardOpen) => set({ createWizardOpen }),
  setLibraryFilter: (selectedLibraryFilter) => set({ selectedLibraryFilter }),
  getActiveTemplate: () => {
    const { templates, activeTemplateId } = get();
    return (
      templates.find((t) => t.id === activeTemplateId) ??
      getStyleTemplate(activeTemplateId) ??
      executiveDark
    );
  },
}));

export { monthlySalesContent, achievementHoverInteraction };
