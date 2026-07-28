"use client";

import { InteractionFlow } from "./InteractionFlow";
import { achievementHoverInteraction } from "@/lib/pbmp/sample-data";
import { useStudioStore } from "@/lib/store/studio-store";

const RULE_ROWS = [
  {
    event: "On Hover",
    condition: "Value ≥ Target",
    actions: "Success Style + Expand (400ms)",
    status: "Enabled",
  },
  {
    event: "On Hover",
    condition: "Value 70–95",
    actions: "Warning Style + Expand (400ms)",
    status: "Enabled",
  },
  {
    event: "On Hover",
    condition: "Value < 70",
    actions: "Danger Style + Pulse ×2",
    status: "Enabled",
  },
  {
    event: "On Hover Exit",
    condition: "Always",
    actions: "Reset Style + Restore Size",
    status: "Enabled",
  },
  {
    event: "On Click",
    condition: "Always",
    actions: "Show Details",
    status: "Enabled",
  },
];

export function InteractionPanel() {
  const variables = useStudioStore((s) => s.variables);
  const setVariable = useStudioStore((s) => s.setVariable);
  const template = useStudioStore((s) => s.getActiveTemplate());
  const dispatchEvent = useStudioStore((s) => s.dispatchEvent);

  return (
    <div className="grid min-h-[300px] gap-4 border-t-2 border-[var(--pbmp-border-strong)] bg-[#0a1017] p-4 lg:grid-cols-[220px_1fr_260px]">
      {/* Variables */}
      <div className="pbmp-panel overflow-auto p-4">
        <p className="pbmp-label mb-3">Variables</p>
        {(
          [
            ["achievementPercent", "Value"],
            ["targetMinimum", "Target"],
            ["warningMinimum", "WarningMin"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="mb-3 block text-sm font-semibold text-slate-400">
            {label}
            <input
              type="number"
              value={variables[key]}
              onChange={(e) => setVariable(key, Number(e.target.value))}
              className="pbmp-input mt-1.5 w-full font-mono text-teal-200"
            />
          </label>
        ))}
        <div className="mt-4 space-y-2.5">
          <ColourRow label="SuccessColor" value={template.semantic.status.success} />
          <ColourRow label="WarningColor" value={template.semantic.status.warning} />
          <ColourRow label="DangerColor" value={template.semantic.status.danger} />
        </div>
        <button
          type="button"
          onClick={() => dispatchEvent("pointer.hover.enter")}
          className="pbmp-btn pbmp-btn-primary mt-4 w-full py-2.5 text-sm"
        >
          Fire On Hover
        </button>
      </div>

      {/* Rules + Flow */}
      <div className="min-w-0 space-y-3 overflow-auto">
        <div className="pbmp-panel overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-[var(--pbmp-border)] bg-black/30">
              <tr className="pbmp-label">
                <th className="px-3 py-2.5">Event</th>
                <th className="px-3 py-2.5">Condition</th>
                <th className="px-3 py-2.5">Actions</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {RULE_ROWS.map((row) => (
                <tr
                  key={`${row.event}-${row.condition}`}
                  className="border-t border-[var(--pbmp-border)] font-medium text-slate-300"
                >
                  <td className="px-3 py-2.5">{row.event}</td>
                  <td className="px-3 py-2.5">{row.condition}</td>
                  <td className="px-3 py-2.5">{row.actions}</td>
                  <td className="px-3 py-2.5 font-bold text-emerald-300">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pbmp-panel overflow-hidden p-1">
          <InteractionFlow />
        </div>
      </div>

      {/* Rule details */}
      <div className="pbmp-panel overflow-auto p-4">
        <p className="pbmp-label mb-3">Rule details · On Hover</p>
        <p className="text-sm font-semibold text-slate-400">Condition builder</p>
        <div className="pbmp-panel-inset mt-2 space-y-1 p-3 font-mono text-xs font-medium leading-relaxed text-slate-300">
          <p>IF Value &gt;= Target</p>
          <p className="pl-3 font-semibold text-emerald-300">→ setSemanticStyle(success)</p>
          <p className="pl-3 font-semibold text-emerald-300">→ expand(1.15, 400ms)</p>
          <p>ELSE IF Value &gt;= WarningMin</p>
          <p className="pl-3 font-semibold text-amber-300">→ setSemanticStyle(warning)</p>
          <p className="pl-3 font-semibold text-amber-300">→ expand(1.10, 400ms)</p>
          <p>ELSE</p>
          <p className="pl-3 font-semibold text-rose-300">→ setSemanticStyle(danger)</p>
          <p className="pl-3 font-semibold text-rose-300">→ pulse(×2, 700ms)</p>
        </div>
        <p className="mb-2 mt-4 text-sm font-semibold text-slate-400">Ordered Action Set</p>
        <ol className="list-decimal space-y-1.5 pl-5 text-xs font-medium text-slate-400">
          {achievementHoverInteraction.rules[0].branches[1].actions.map((a, i) => (
            <li key={i}>
              {a.type}
              {a.animation ? ` · ${a.animation.durationMs}ms` : ""}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ColourRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm font-semibold text-slate-400">
      <span>{label}</span>
      <span className="flex items-center gap-2 font-mono text-xs text-slate-300">
        <span
          className="inline-block h-4 w-4 rounded border-2 border-white/25 shadow-sm"
          style={{ background: value }}
        />
        {value}
      </span>
    </div>
  );
}
