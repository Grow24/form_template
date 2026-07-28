"use client";

import { useState } from "react";
import { LivePreview } from "@/components/preview/LivePreview";
import { executiveDark, executiveLight } from "@/lib/pbmp/style-templates";
import { useStudioStore } from "@/lib/store/studio-store";

export function WorkflowView() {
  const workflow = useStudioStore((s) => s.workflow);
  const approveStage = useStudioStore((s) => s.approveStage);
  const rejectStage = useStudioStore((s) => s.rejectStage);
  const setActiveTemplate = useStudioStore((s) => s.setActiveTemplate);
  const [comment, setComment] = useState("");

  const active = workflow.stages.find((s) => s.id === workflow.currentStageId);

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-50">
          Approval Workflow
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Draft → Self-Test → Design → Accessibility → Technical → Business →
          Approved → Published. Approved versions are immutable.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {workflow.stages.map((stage) => (
          <div
            key={stage.id}
            className={`min-w-[110px] rounded-lg border px-3 py-2 ${
              stage.status === "active"
                ? "border-teal-400/50 bg-teal-500/10"
                : stage.status === "completed"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : stage.status === "rejected"
                    ? "border-rose-500/40 bg-rose-500/10"
                    : "border-white/8 bg-white/[0.02]"
            }`}
          >
            <p className="text-xs font-medium text-slate-200">{stage.name}</p>
            <p className="text-[10px] capitalize text-slate-500">
              {stage.status}
              {stage.completedAt ? ` · ${stage.completedAt}` : ""}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/8 bg-[#111821]/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Current approved · v2.1
            </h3>
            <button
              type="button"
              className="text-[10px] text-teal-300"
              onClick={() => setActiveTemplate(executiveDark.id)}
            >
              Load
            </button>
          </div>
          <div className="pointer-events-none opacity-90">
            <ComparePreview templateId={executiveDark.id} />
          </div>
        </div>
        <div className="rounded-xl border border-teal-400/30 bg-[#111821]/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Proposed version · {workflow.templateVersion}
            </h3>
            <button
              type="button"
              className="text-[10px] text-teal-300"
              onClick={() => setActiveTemplate(executiveDark.id)}
            >
              Load draft
            </button>
          </div>
          <LivePreview />
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-[#111821]/80 p-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Changes in this version
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
          <li>Warning colour adjusted for dark environments</li>
          <li>Hover expand duration 300 → 450 ms</li>
          <li>3D shadow quality reduced for performance</li>
        </ul>

        <div className="mt-4">
          <p className="text-xs text-slate-500">
            Active stage: {active?.name} ({active?.role})
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Pin a review comment to a token, Form, rule or failed test…"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
            rows={3}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={!active || active.status !== "active"}
              onClick={() => {
                if (!active) return;
                approveStage(active.id, comment || "Approved");
                setComment("");
              }}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-40"
            >
              Approve stage
            </button>
            <button
              type="button"
              disabled={!active || active.status !== "active"}
              onClick={() => {
                if (!active) return;
                rejectStage(active.id, comment || "Changes requested");
                setComment("");
              }}
              className="rounded-lg border border-rose-400/40 px-4 py-2 text-sm text-rose-200 disabled:opacity-40"
            >
              Request changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparePreview({ templateId }: { templateId: string }) {
  const setActiveTemplate = useStudioStore((s) => s.setActiveTemplate);
  // Show light as "approved baseline" contrast when comparing dark draft
  const label =
    templateId === executiveDark.id ? executiveDark.name : executiveLight.name;
  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={() => setActiveTemplate(templateId)}
    >
      <div
        className="rounded-lg p-4"
        style={{
          background: executiveDark.semantic.surface.primary,
          color: executiveDark.semantic.content.primary,
        }}
      >
        <p className="text-sm font-semibold">{label}</p>
        <div className="mt-3 flex h-24 items-end gap-2">
          {[40, 70, 55, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${h}%`,
                background: executiveDark.semantic.data.primary,
              }}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-slate-400">
          Static snapshot of approved packaging
        </p>
      </div>
    </button>
  );
}
