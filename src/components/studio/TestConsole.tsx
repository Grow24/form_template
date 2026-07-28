"use client";

import { TEST_CONSOLE_METRICS } from "@/lib/pbmp/functionality";
import { useStudioStore } from "@/lib/store/studio-store";

export function TestConsole() {
  const eventTrace = useStudioStore((s) => s.eventTrace);
  const m = TEST_CONSOLE_METRICS;
  const allPass =
    m.visual.passed === m.visual.total &&
    m.interaction.passed === m.interaction.total &&
    m.accessibility.passed === m.accessibility.total &&
    m.performance.passed === m.performance.total;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t-2 border-[var(--pbmp-border-strong)] bg-[#060910] px-5 py-3.5 text-sm font-semibold shadow-[0_-4px_20px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2.5">
        <span
          className={`h-3 w-3 rounded-full ring-2 ring-offset-2 ring-offset-[#060910] ${
            allPass
              ? "bg-emerald-400 ring-emerald-500/50"
              : "bg-amber-400 ring-amber-500/50"
          }`}
        />
        <span className={allPass ? "font-bold text-emerald-300" : "text-amber-200"}>
          {allPass ? "All Tests Passed" : "Tests need attention"}
        </span>
        <span className="text-xs font-medium text-slate-500">{m.lastRunAt}</span>
      </div>
      <Metric label="Visual" passed={m.visual.passed} total={m.visual.total} />
      <Metric
        label="Interaction"
        passed={m.interaction.passed}
        total={m.interaction.total}
      />
      <Metric
        label="Accessibility"
        passed={m.accessibility.passed}
        total={m.accessibility.total}
      />
      <Metric
        label="Performance"
        passed={m.performance.passed}
        total={m.performance.total}
      />
      <div className="ml-auto max-w-lg truncate text-xs font-medium text-slate-500">
        {eventTrace[0]
          ? `Last: ${eventTrace[0].step} — ${eventTrace[0].detail}`
          : "Hover preview or fire On Hover to update Event Trace"}
      </div>
    </div>
  );
}

function Metric({
  label,
  passed,
  total,
}: {
  label: string;
  passed: number;
  total: number;
}) {
  const ok = passed === total;
  return (
    <span className="rounded-lg border-2 border-[var(--pbmp-border)] bg-black/25 px-3 py-1 text-slate-400">
      {label}{" "}
      <strong className={ok ? "text-emerald-300" : "text-amber-300"}>
        {passed}/{total}
      </strong>
    </span>
  );
}
