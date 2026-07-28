"use client";

import { ARTIFACT_BINDINGS } from "@/lib/pbmp/sample-data";
import { STYLE_TEMPLATES } from "@/lib/pbmp/style-templates";
import { useStudioStore } from "@/lib/store/studio-store";

export function PublishedView() {
  const published = STYLE_TEMPLATES.filter(
    (t) => t.status === "approved" || t.status === "published",
  );

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-50">
          Published Versions
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Approved Template versions are immutable. Any change creates a new
          draft version.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {published.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-white/8 bg-[#111821]/80 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg text-slate-100">{t.name}</h3>
                <p className="text-xs text-slate-500">
                  v{t.version} · {t.family}
                </p>
              </div>
              <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] text-teal-200">
                {t.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">{t.description}</p>
            <div className="mt-4 flex gap-2">
              <Swatch colour={t.semantic.surface.primary} label="Surface" />
              <Swatch colour={t.semantic.data.primary} label="Data" />
              <Swatch colour={t.semantic.status.success} label="Success" />
              <Swatch colour={t.semantic.status.warning} label="Warning" />
              <Swatch colour={t.semantic.status.danger} label="Danger" />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Used by {t.usedByCount} artifacts · Contexts:{" "}
              {t.intendedContexts.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApplicationsView() {
  const setWorkspace = useStudioStore((s) => s.setWorkspace);

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-50">
          Apply to Artifacts
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Select artifact → approved Template → map elements → preview & apply.
          Modes: Linked, Pinned, or Forked.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {["Sales Dashboard", "Monthly Email Report", "Executive Presentation", "Operational Report"].map(
          (name, i) => (
            <div
              key={name}
              className="rounded-xl border border-white/8 bg-gradient-to-b from-white/[0.06] to-transparent p-4"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Step {i + 1 === 1 ? "1 · Artifact" : "Ready"}
              </p>
              <h3 className="mt-1 text-sm font-medium text-slate-100">{name}</h3>
              <p className="mt-2 text-xs text-slate-500">
                Adapter translates Style Template tokens into artifact-safe
                packaging.
              </p>
            </div>
          ),
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/8">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 bg-white/[0.03] text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Artifact</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Compatibility</th>
            </tr>
          </thead>
          <tbody>
            {ARTIFACT_BINDINGS.map((b) => (
              <tr key={b.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-3 text-slate-100">{b.artifactName}</td>
                <td className="px-4 py-3 capitalize">{b.artifactType}</td>
                <td className="px-4 py-3">{b.templateId}</td>
                <td className="px-4 py-3">{b.templateVersion}</td>
                <td className="px-4 py-3 capitalize">{b.mode}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      b.compatibility === "pass"
                        ? "text-emerald-300"
                        : b.compatibility === "warning"
                          ? "text-amber-300"
                          : "text-rose-300"
                    }
                  >
                    {b.compatibility}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setWorkspace("impact")}
        className="text-sm text-teal-300 hover:underline"
      >
        Review impact before publishing →
      </button>
    </div>
  );
}

export function ImpactView() {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-50">
          Impact & Dependencies
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Executive Dark v2.2 affects 12 Dashboards, 4 Email Templates, 2
          Reports, 8 Bar Charts and 3 3D Scenes.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/8">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Artifact</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Proposed</th>
              <th className="px-4 py-3">Compatibility</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {[
              ["Sales Dashboard", "2.1", "2.2", "Pass", "Update"],
              ["Monthly Email", "2.1", "2.2", "Warning", "Review fallback"],
              ["Football Simulator", "2.0", "2.2", "Pass", "Update"],
              ["Legacy Report", "1.8", "2.2", "Breaking", "Keep pinned"],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-white/5">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-4 py-3 ${
                      i === 3
                        ? cell === "Pass"
                          ? "text-emerald-300"
                          : cell === "Warning"
                            ? "text-amber-300"
                            : "text-rose-300"
                        : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SettingsView() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-50">
        Studio Settings
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Action Registry", "Whitelisted Actions only — no arbitrary JavaScript"],
          ["Event Registry", "Normalized browser, ECharts and 3D Events"],
          ["Workflow config", "Serial / parallel / quorum / segregation of duties"],
          ["Quality profiles", "Low / medium / high / auto for 3D performance"],
          ["Versioning", "Major breaking · Minor coverage · Patch visual"],
          ["Reduced motion", "Immediate style change without scale animation"],
        ].map(([title, body]) => (
          <div
            key={title}
            className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
          >
            <h3 className="text-sm font-medium text-slate-100">{title}</h3>
            <p className="mt-1 text-xs text-slate-500">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Swatch({ colour, label }: { colour: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="h-8 w-8 rounded-md border border-white/10"
        style={{ background: colour }}
      />
      <p className="mt-1 text-[9px] text-slate-500">{label}</p>
    </div>
  );
}
