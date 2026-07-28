"use client";

import {
  Monitor,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { LivePreview } from "@/components/preview/LivePreview";
import { InteractionPanel } from "@/components/studio/InteractionPanel";
import { TestConsole } from "@/components/studio/TestConsole";
import { useStudioStore } from "@/lib/store/studio-store";
import type { FormType, InspectorSection, StudioCanvasTab } from "@/lib/pbmp/types";

const FORMS: { id: FormType; label: string; modes: string }[] = [
  { id: "barChart", label: "Bar Chart", modes: "2D / 3D" },
  { id: "lineChart", label: "Line Chart", modes: "2D / 3D" },
  { id: "pieChart", label: "Pie / Donut", modes: "2D" },
  { id: "text", label: "Text", modes: "2D" },
  { id: "kpiCard", label: "KPI Card", modes: "2D" },
  { id: "table", label: "Table", modes: "2D" },
];

const TABS: { id: StudioCanvasTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "2d", label: "2D" },
  { id: "3d", label: "3D" },
  { id: "states", label: "States" },
  { id: "interactions", label: "Interactions" },
  { id: "animations", label: "Animations" },
  { id: "accessibility", label: "Accessibility" },
];

const SECTIONS: { id: InspectorSection; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "formMapping", label: "Form Mapping" },
  { id: "states", label: "States" },
  { id: "interactions", label: "Interactions" },
  { id: "animations", label: "Animations" },
  { id: "accessibility", label: "Accessibility" },
  { id: "performance", label: "Performance" },
];

export function StudioView() {
  const template = useStudioStore((s) => s.getActiveTemplate());
  const formType = useStudioStore((s) => s.formType);
  const setFormType = useStudioStore((s) => s.setFormType);
  const setRenderMode = useStudioStore((s) => s.setRenderMode);
  const setPreviewMode = useStudioStore((s) => s.setPreviewMode);
  const inspectorSection = useStudioStore((s) => s.inspectorSection);
  const setInspectorSection = useStudioStore((s) => s.setInspectorSection);
  const inspectorAdvanced = useStudioStore((s) => s.inspectorAdvanced);
  const setInspectorAdvanced = useStudioStore((s) => s.setInspectorAdvanced);
  const canvasTab = useStudioStore((s) => s.canvasTab);
  const setCanvasTab = useStudioStore((s) => s.setCanvasTab);
  const devicePreview = useStudioStore((s) => s.devicePreview);
  const setDevicePreview = useStudioStore((s) => s.setDevicePreview);
  const saved = useStudioStore((s) => s.saved);
  const markSaved = useStudioStore((s) => s.markSaved);
  const submitForReview = useStudioStore((s) => s.submitForReview);
  const updateSemanticColour = useStudioStore((s) => s.updateSemanticColour);
  const updateBarRadius = useStudioStore((s) => s.updateBarRadius);
  const updateBarDepth = useStudioStore((s) => s.updateBarDepth);
  const animationSpeedMs = useStudioStore((s) => s.animationSpeedMs);
  const setAnimationSpeedMs = useStudioStore((s) => s.setAnimationSpeedMs);
  const setArtifactContext = useStudioStore((s) => s.setArtifactContext);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Studio toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--pbmp-border-strong)] bg-[#0a1018]/80 px-5 py-3.5">
        <div>
          <div className="flex items-center gap-3 text-base">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-50">
              {template.name}
            </span>
            <span className="rounded-lg border-2 border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-100">
              Draft v2.2.0
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {saved ? "Saved just now" : "Unsaved changes"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" className="rounded-lg border-2 border-[var(--pbmp-border)] p-2.5 text-slate-400 hover:bg-white/5" aria-label="Undo">
            <Undo2 size={16} strokeWidth={2.5} />
          </button>
          <button type="button" className="rounded-lg border-2 border-[var(--pbmp-border)] p-2.5 text-slate-400 hover:bg-white/5" aria-label="Redo">
            <Redo2 size={16} strokeWidth={2.5} />
          </button>
          <div className="mx-1 flex rounded-xl border-2 border-[var(--pbmp-border)] bg-black/25 p-1">
            {(
              [
                ["desktop", Monitor],
                ["tablet", Tablet],
                ["mobile", Smartphone],
              ] as const
            ).map(([id, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDevicePreview(id)}
                className={`rounded-lg p-2 ${
                  devicePreview === id
                    ? "bg-teal-500/25 text-teal-100 ring-2 ring-teal-400/40"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                aria-label={id}
              >
                <Icon size={16} strokeWidth={2.2} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={markSaved}
            className="pbmp-btn text-slate-200 hover:bg-white/5"
          >
            Save
          </button>
          <button
            type="button"
            onClick={submitForReview}
            className="pbmp-btn pbmp-btn-primary"
          >
            Submit for Review
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_1fr_300px]">
        {/* Form Navigator */}
        <div className="overflow-auto border-r-2 border-[var(--pbmp-border)] bg-[#0a1018]/50 p-4">
          <p className="pbmp-label mb-3">Foundation</p>
          {["Colors", "Typography", "Spacing", "Borders", "Shadows", "Motion"].map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setInspectorSection("basics")}
                className="mb-1 block w-full rounded-lg border-2 border-transparent px-3 py-2 text-left text-sm font-semibold text-slate-400 hover:border-[var(--pbmp-border)] hover:bg-white/[0.06]"
              >
                {item}
              </button>
            ),
          )}

          <p className="pbmp-label mb-3 mt-5">Forms</p>
          {FORMS.map((f) => (
            <div key={f.id} className="mb-1.5">
              <button
                type="button"
                onClick={() => setFormType(f.id)}
                className={`block w-full rounded-lg border-2 px-3 py-2 text-left text-sm font-semibold ${
                  formType === f.id
                    ? "border-teal-400/40 bg-teal-500/20 text-teal-100"
                    : "border-transparent text-slate-400 hover:border-[var(--pbmp-border)] hover:bg-white/[0.06]"
                }`}
              >
                {f.label}
              </button>
              {formType === f.id && f.modes.includes("3D") && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-[var(--pbmp-border)] pl-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRenderMode("2d");
                      setPreviewMode("2d");
                    }}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-xs font-semibold text-slate-500 hover:bg-white/5"
                  >
                    ↳ 2D
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRenderMode("3d");
                      setPreviewMode("3d");
                    }}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-xs font-semibold text-slate-500 hover:bg-white/5"
                  >
                    ↳ 3D
                  </button>
                </div>
              )}
            </div>
          ))}

          <p className="pbmp-label mb-3 mt-5">States</p>
          {["Default", "Hover", "Selected", "Disabled", "Error"].map((s) => (
            <div key={s} className="px-3 py-1.5 text-sm font-medium text-slate-500">
              {s}
            </div>
          ))}

          <p className="pbmp-label mb-3 mt-5">Artifact Adapters</p>
          {(["dashboard", "email", "report", "presentation"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setArtifactContext(a);
                setPreviewMode("artifact");
              }}
              className="mb-1 block w-full rounded-lg border-2 border-transparent px-3 py-2 text-left text-sm font-semibold capitalize text-slate-400 hover:border-[var(--pbmp-border)] hover:bg-white/[0.06]"
            >
              {a}
            </button>
          ))}
        </div>

        {/* Centre canvas */}
        <div className="flex min-h-0 flex-col overflow-hidden bg-[#0c1219]/40">
          <div className="flex flex-wrap gap-2 border-b-2 border-[var(--pbmp-border)] px-4 py-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setCanvasTab(t.id);
                  if (t.id === "2d") setPreviewMode("2d");
                  if (t.id === "3d") setPreviewMode("3d");
                  if (t.id === "overview") setPreviewMode("split");
                  if (t.id === "interactions") setInspectorSection("interactions");
                }}
                className={`pbmp-tab ${
                  canvasTab === t.id ? "pbmp-tab-active" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div
            className={`min-h-0 flex-1 overflow-auto p-4 ${
              devicePreview === "mobile"
                ? "mx-auto w-full max-w-[390px]"
                : devicePreview === "tablet"
                  ? "mx-auto w-full max-w-[768px]"
                  : ""
            }`}
          >
            <LivePreview />
          </div>
          <InteractionPanel />
        </div>

        {/* Inspector */}
        <div className="overflow-auto border-l-2 border-[var(--pbmp-border)] bg-[#0a1018]/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1 rounded-xl border-2 border-[var(--pbmp-border)] bg-black/25 p-1">
              <button
                type="button"
                onClick={() => setInspectorAdvanced(false)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  !inspectorAdvanced ? "bg-white/12 text-white" : "text-slate-500"
                }`}
              >
                Basic
              </button>
              <button
                type="button"
                onClick={() => setInspectorAdvanced(true)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  inspectorAdvanced ? "bg-white/12 text-white" : "text-slate-500"
                }`}
              >
                Advanced
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setInspectorSection(s.id)}
                className={`rounded-lg border-2 px-2 py-1 text-xs font-bold ${
                  inspectorSection === s.id
                    ? "border-[var(--pbmp-border)] bg-white/12 text-white"
                    : "border-transparent text-slate-500 hover:border-[var(--pbmp-border)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {(inspectorSection === "basics" || inspectorSection === "tokens") && (
            <div className="space-y-4">
              <ColourField
                label="Primary colour"
                value={template.semantic.data.primary}
                onChange={(v) => updateSemanticColour("data.primary", v)}
              />
              <ColourField
                label="Background"
                value={template.semantic.surface.primary}
                onChange={(v) => updateSemanticColour("surface.primary", v)}
              />
              <label className="block text-sm font-semibold text-slate-400">
                Font Family
                <select className="pbmp-input mt-1.5 w-full" defaultValue="Inter">
                  <option>Inter</option>
                  <option>Manrope</option>
                  <option>Arial</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-400">
                Font Size
                <select className="pbmp-input mt-1.5 w-full" defaultValue="14">
                  <option value="12">12px</option>
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-400">
                Common · Bar radius
                <input
                  type="range"
                  min={0}
                  max={16}
                  value={template.formFamilies.charts?.barRadius ?? 6}
                  onChange={(e) => updateBarRadius(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-500"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-400">
                Spacing
                <input
                  type="range"
                  min={4}
                  max={32}
                  defaultValue={template.foundation.spacing.gap}
                  className="mt-2 w-full accent-teal-500"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-400">
                Animation speed ({animationSpeedMs}ms)
                <input
                  type="range"
                  min={100}
                  max={1000}
                  step={50}
                  value={animationSpeedMs}
                  onChange={(e) => setAnimationSpeedMs(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-500"
                />
              </label>
            </div>
          )}

          {inspectorSection === "formMapping" && (
            <div className="space-y-3 text-xs text-slate-300">
              <p className="rounded border border-teal-400/20 bg-teal-500/5 p-2 text-[11px] text-teal-100/80">
                Style tokens are semantic. Form adapters interpret them for 2D and 3D.
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Common
              </p>
              <p>Primary data colour → bar fill / line / material</p>
              <p>Warning colour → warning emphasis</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                2D-specific
              </p>
              <label className="block text-slate-400">
                Bar radius
                <input
                  type="range"
                  min={0}
                  max={16}
                  value={template.formFamilies.charts?.barRadius ?? 6}
                  onChange={(e) => updateBarRadius(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </label>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                3D-specific
              </p>
              <label className="block text-slate-400">
                Bar depth
                <input
                  type="range"
                  min={0.2}
                  max={1.2}
                  step={0.05}
                  value={template.formFamilies.charts3d?.barDepth ?? 0.6}
                  onChange={(e) => updateBarDepth(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </label>
              {inspectorAdvanced && (
                <div className="rounded border border-white/8 bg-black/20 p-2 text-[10px] text-slate-500">
                  <p>Roughness: {template.formFamilies.charts3d?.materialRoughness}</p>
                  <p>Metalness: {template.formFamilies.charts3d?.materialMetalness}</p>
                  <p>Camera: {template.formFamilies.charts3d?.cameraAngle}</p>
                  <p>Light: {template.formFamilies.charts3d?.lightIntensity}</p>
                </div>
              )}
            </div>
          )}

          {inspectorSection === "interactions" && (
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                Interaction Template is separate from Style Template. Runtime
                overrides do not permanently mutate the approved Style.
              </p>
              <p className="text-teal-200">Resolution order:</p>
              <ol className="list-decimal space-y-1 pl-4 text-[11px]">
                <li>Base Style Template</li>
                <li>Form-specific Style</li>
                <li>Instance Override</li>
                <li>State Style</li>
                <li>Event Runtime Override</li>
              </ol>
            </div>
          )}

          {(inspectorSection === "states" ||
            inspectorSection === "animations" ||
            inspectorSection === "accessibility" ||
            inspectorSection === "performance") && (
            <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3 text-xs text-slate-400">
              {inspectorSection === "states" &&
                "Default → Hover → Selected → Focused → Disabled → Error. Event overrides sit above State Style."}
              {inspectorSection === "animations" &&
                `Expand ${animationSpeedMs}ms · Colour 250ms · Pulse 700ms ×2. Animation is a child of Action, not a flat Style attribute.`}
              {inspectorSection === "accessibility" &&
                "Reduced-motion fallback applies immediate style without scale. High Contrast template available for colour-blind-safe packaging."}
              {inspectorSection === "performance" &&
                "3D quality profile, LOD, object budget and on-demand rendering configured per Scene Template."}
            </div>
          )}
        </div>
      </div>

      <TestConsole />
    </div>
  );
}

function ColourField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-300">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={value.startsWith("#") ? value : "#22d3ee"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-11 cursor-pointer rounded-lg border-2 border-[var(--pbmp-border)] bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pbmp-input w-[96px] font-mono text-xs"
        />
      </span>
    </label>
  );
}
