"use client";

import dynamic from "next/dynamic";
import {
  Chart2D,
  TableFormPreview,
  TextFormPreview,
} from "./Chart2D";
import { monthlySalesContent } from "@/lib/pbmp/sample-data";
import { useStudioStore } from "@/lib/store/studio-store";

const Chart3D = dynamic(
  () => import("./Chart3D").then((m) => m.Chart3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] items-center justify-center rounded-lg border border-white/10 text-sm text-slate-400">
        Loading 3D runtime…
      </div>
    ),
  },
);

export function LivePreview() {
  const formType = useStudioStore((s) => s.formType);
  const previewMode = useStudioStore((s) => s.previewMode);
  const artifactContext = useStudioStore((s) => s.artifactContext);
  const runtimeOverride = useStudioStore((s) => s.runtimeOverride);
  const template = useStudioStore((s) => s.getActiveTemplate());
  const dispatchEvent = useStudioStore((s) => s.dispatchEvent);
  const setPreviewMode = useStudioStore((s) => s.setPreviewMode);
  const setArtifactContext = useStudioStore((s) => s.setArtifactContext);
  const dataset = useStudioStore((s) => s.dataset);
  const setDataset = useStudioStore((s) => s.setDataset);
  const cameraPreset = useStudioStore((s) => s.cameraPreset);
  const setCameraPreset = useStudioStore((s) => s.setCameraPreset);
  const lightingPreset = useStudioStore((s) => s.lightingPreset);
  const setLightingPreset = useStudioStore((s) => s.setLightingPreset);
  const activeScenarioId = useStudioStore((s) => s.activeScenarioId);
  const scenarios = useStudioStore((s) => s.scenarios);
  const runScenario = useStudioStore((s) => s.runScenario);

  const handlers = {
    onHoverEnter: () =>
      dispatchEvent(
        previewMode === "3d" ? "object.pointer.enter" : "pointer.hover.enter",
      ),
    onHoverExit: () =>
      dispatchEvent(
        previewMode === "3d" ? "object.pointer.exit" : "pointer.hover.exit",
      ),
    onClick: () =>
      dispatchEvent(previewMode === "3d" ? "object.click" : "pointer.click"),
  };

  const title = "Monthly Sales (₹ lakh)";
  const chartFormType =
    formType === "lineChart" || formType === "barChart" || formType === "pieChart"
      ? formType
      : "barChart";

  const render2d = () => {
    if (formType === "text" || formType === "kpiCard") {
      return (
        <TextFormPreview
          content={monthlySalesContent}
          template={template}
          runtime={runtimeOverride}
          title={formType === "kpiCard" ? "Sales KPI Card" : title}
          {...handlers}
        />
      );
    }
    if (formType === "table") {
      return (
        <TableFormPreview
          content={monthlySalesContent}
          template={template}
          runtime={runtimeOverride}
          title={title}
          {...handlers}
        />
      );
    }
    return (
      <Chart2D
        formType={chartFormType}
        content={monthlySalesContent}
        template={template}
        runtime={runtimeOverride}
        title={title}
        {...handlers}
      />
    );
  };

  const render3d = () => {
    if (
      formType === "text" ||
      formType === "kpiCard" ||
      formType === "table" ||
      formType === "pieChart"
    ) {
      return (
        <div
          className="flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-white/10 p-6 text-sm"
          style={{
            background: template.semantic.surface.primary,
            color: template.semantic.content.secondary,
          }}
        >
          This Form uses 2D packaging. Switch to Bar or Line for 3D Render Mode.
        </div>
      );
    }
    return (
      <Chart3D
        formType={chartFormType === "pieChart" ? "barChart" : chartFormType}
        content={monthlySalesContent}
        template={template}
        runtime={runtimeOverride}
        title={title}
        onHoverEnter={() => dispatchEvent("object.pointer.enter")}
        onHoverExit={() => dispatchEvent("object.pointer.exit")}
        onClick={() => dispatchEvent("object.click")}
      />
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(["2d", "3d", "split", "artifact"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setPreviewMode(mode)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              previewMode === mode
                ? "bg-teal-500/25 text-teal-100 ring-2 ring-teal-400/50"
                : "border-2 border-[var(--pbmp-border)] bg-black/25 text-slate-300 hover:bg-white/10"
            }`}
          >
            {mode === "2d"
              ? "2D"
              : mode === "3d"
                ? "3D"
                : mode === "split"
                  ? "Split"
                  : "Artifact"}
          </button>
        ))}
        {previewMode === "artifact" && (
          <div className="ml-2 flex gap-1">
            {(["dashboard", "email", "report", "presentation"] as const).map(
              (ctx) => (
                <button
                  key={ctx}
                  type="button"
                  onClick={() => setArtifactContext(ctx)}
                  className={`rounded px-2 py-1 text-[10px] capitalize ${
                    artifactContext === ctx
                      ? "bg-amber-500/20 text-amber-200"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  {ctx}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {previewMode === "2d" && render2d()}
        {previewMode === "3d" && render3d()}
        {previewMode === "split" && (
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wider text-slate-400">
                2D · same data · same Style · same rules
              </p>
              {render2d()}
            </div>
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wider text-slate-400">
                3D · same data · same Style · same rules
              </p>
              {render3d()}
            </div>
          </div>
        )}
        {previewMode === "artifact" && (
          <div
            className="rounded-xl p-4"
            style={{
              background:
                artifactContext === "email"
                  ? "#f4f4f5"
                  : template.semantic.surface.elevated,
            }}
          >
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{
                color:
                  artifactContext === "email"
                    ? "#52525b"
                    : template.semantic.content.secondary,
              }}
            >
              Artifact adapter · {artifactContext}
              {artifactContext === "email" && " (static fallback)"}
            </p>
            {artifactContext === "email" ? (
              <div className="rounded border border-zinc-200 bg-white p-4">
                {render2d()}
              </div>
            ) : (
              render2d()
            )}
          </div>
        )}
      </div>

      {/* Preview context controls — match mockup */}
      <div className="mt-4 flex flex-wrap gap-3 border-t-2 border-[var(--pbmp-border)] pt-4">
        <Select
          label="Dataset"
          value={dataset}
          onChange={setDataset}
          options={[
            ["sample1", "Sample 1"],
            ["negative", "Negative values"],
            ["large", "Very large values"],
            ["empty", "Empty data"],
          ]}
        />
        <Select
          label="Scenario"
          value={activeScenarioId}
          onChange={(id) => runScenario(id, true)}
          options={scenarios.map((s) => [s.id, s.name])}
        />
        <Select
          label="Camera"
          value={cameraPreset}
          onChange={(v) => setCameraPreset(v as typeof cameraPreset)}
          options={[
            ["isometric", "Isometric"],
            ["perspective", "Perspective"],
            ["orthographic", "Orthographic"],
          ]}
        />
        <Select
          label="Lighting"
          value={lightingPreset}
          onChange={(v) => setLightingPreset(v as typeof lightingPreset)}
          options={[
            ["studio", "Studio"],
            ["bright", "Bright"],
            ["dramatic", "Dramatic"],
            ["soft", "Soft"],
          ]}
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | [string, string])[];
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-400">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pbmp-input py-1.5 text-sm"
      >
        {options.map((opt) => {
          const [id, name] = Array.isArray(opt) ? opt : [opt, opt];
          return (
            <option key={id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </label>
  );
}
