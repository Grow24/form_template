"use client";

import { LivePreview } from "@/components/preview/LivePreview";
import { useStudioStore } from "@/lib/store/studio-store";

export function TestLabView() {
  const scenarios = useStudioStore((s) => s.scenarios);
  const activeScenarioId = useStudioStore((s) => s.activeScenarioId);
  const runScenario = useStudioStore((s) => s.runScenario);
  const eventTrace = useStudioStore((s) => s.eventTrace);
  const variables = useStudioStore((s) => s.variables);
  const clearTrace = useStudioStore((s) => s.clearTrace);
  const active = scenarios.find((s) => s.id === activeScenarioId);

  return (
    <div className="grid h-full min-h-0 gap-4 p-4 lg:grid-cols-[280px_1fr]">
      <div className="overflow-auto rounded-xl border border-white/8 bg-[#111821]/80 p-3">
        <h3 className="font-[family-name:var(--font-display)] text-lg text-slate-50">
          Scenarios
        </h3>
        <p className="mb-3 text-xs text-slate-500">
          Data × Form × Render mode × Style × Event combinations
        </p>
        <div className="space-y-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => runScenario(s.id)}
              className={`block w-full rounded-lg border px-3 py-2 text-left ${
                activeScenarioId === s.id
                  ? "border-teal-400/40 bg-teal-500/10"
                  : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <p className="text-sm text-slate-100">{s.name}</p>
              <p className="mt-1 text-[10px] text-slate-500">
                {s.formType} · {s.renderMode} · {s.event}
              </p>
              {s.expectedStatus && (
                <p className="mt-1 text-[10px] capitalize text-amber-200/80">
                  Expect: {s.expectedStatus}
                  {s.expectedBranch ? ` · ${s.expectedBranch}` : ""}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-3 overflow-auto">
        <div className="rounded-xl border border-white/8 bg-[#111821]/80 p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-lg text-slate-50">
                Scenario: {active?.name ?? "—"}
              </h3>
              <p className="text-xs text-slate-500">
                Variables · Live Preview · Event Trace
              </p>
            </div>
            <button
              type="button"
              onClick={clearTrace}
              className="text-xs text-slate-400 hover:text-white"
            >
              Reset
            </button>
          </div>
          <div className="mb-4 flex flex-wrap gap-4 text-xs">
            <VarChip label="Value" value={variables.achievementPercent} />
            <VarChip label="Target" value={variables.targetMinimum} />
            <VarChip label="WarningMin" value={variables.warningMinimum} />
          </div>
          <LivePreview />
        </div>

        <div className="rounded-xl border border-white/8 bg-black/30 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Event Trace
          </h4>
          <ol className="space-y-1 font-mono text-[11px] text-slate-400">
            {eventTrace.length === 0 && (
              <li>Run a scenario or hover the preview to capture the Interaction Runtime path.</li>
            )}
            {[...eventTrace].reverse().map((t, i) => (
              <li key={t.id}>
                <span className="text-slate-600">{i + 1}.</span>{" "}
                <span
                  className={
                    t.level === "success"
                      ? "text-emerald-400"
                      : t.level === "warning"
                        ? "text-amber-300"
                        : "text-slate-300"
                  }
                >
                  {t.step}
                </span>{" "}
                — {t.detail}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function VarChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
      {label} = <strong className="text-teal-200">{value}</strong>
    </span>
  );
}
