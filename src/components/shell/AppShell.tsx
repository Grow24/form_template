"use client";

import { LibraryView } from "@/components/library/LibraryView";
import { StudioView } from "@/components/studio/StudioView";
import { TestLabView } from "@/components/test-lab/TestLabView";
import { WorkflowView } from "@/components/workflow/WorkflowView";
import {
  ApplicationsView,
  ImpactView,
  PublishedView,
  SettingsView,
} from "@/components/shared/OtherViews";
import { FunctionalityView } from "@/components/shared/FunctionalityView";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { useStudioStore } from "@/lib/store/studio-store";
import { ATTRIBUTE_MATRIX, TEMPLATE_LAYERS } from "@/lib/pbmp/attribute-matrix";

export function AppShell() {
  const workspace = useStudioStore((s) => s.workspace);

  return (
    <div className="flex h-screen overflow-hidden bg-[#070b10] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% -10%, rgba(20,184,166,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 0%, rgba(56,189,248,0.12), transparent 50%), linear-gradient(180deg, #0a121a 0%, #070b10 40%, #0b1016 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex min-h-0 w-full">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="min-h-0 flex-1 overflow-auto">
            {workspace === "library" && <LibraryView />}
            {workspace === "studio" && <StudioView />}
            {workspace === "test-lab" && <TestLabView />}
            {workspace === "workflow" && <WorkflowView />}
            {workspace === "published" && <PublishedView />}
            {workspace === "applications" && <ApplicationsView />}
            {workspace === "impact" && <ImpactView />}
            {workspace === "functionality" && <FunctionalityView />}
            {workspace === "settings" && (
              <>
                <SettingsView />
                <ModelReference />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ModelReference() {
  return (
    <div className="space-y-4 border-t border-white/8 p-6">
      <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-50">
        PBMP model reference
      </h3>
      <div className="grid gap-3 md:grid-cols-3">
        {TEMPLATE_LAYERS.map((layer) => (
          <div
            key={layer.layer}
            className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
          >
            <p className="text-sm font-medium text-teal-200">{layer.layer}</p>
            <p className="mt-1 text-xs text-slate-400">{layer.purpose}</p>
            <p className="mt-2 text-[11px] text-slate-500">{layer.examples}</p>
          </div>
        ))}
      </div>
      <div className="overflow-auto rounded-xl border border-white/8">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 py-2">Group</th>
              <th className="px-3 py-2">Attribute</th>
              <th className="px-3 py-2">Line</th>
              <th className="px-3 py-2">Bar</th>
              <th className="px-3 py-2">Text</th>
              <th className="px-3 py-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {ATTRIBUTE_MATRIX.map((row) => (
              <tr key={`${row.group}-${row.attribute}`} className="border-b border-white/5">
                <td className="px-3 py-2 text-slate-500">{row.group}</td>
                <td className="px-3 py-2 text-slate-200">{row.attribute}</td>
                <td className="px-3 py-2">{mark(row.lineChart)}</td>
                <td className="px-3 py-2">{mark(row.barChart)}</td>
                <td className="px-3 py-2">{mark(row.text)}</td>
                <td className="px-3 py-2 text-slate-500">{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-slate-500">
        Content/Data → Form Type (Line / Bar / Text) → Style Template →
        Interaction Template → Variable Bindings → Animation → Rendered Component
        (2D | 3D) → Artifact Adapter
      </p>
    </div>
  );
}

function mark(v: "yes" | "equiv" | "no") {
  if (v === "yes") return <span className="text-emerald-400">✓</span>;
  if (v === "equiv") return <span className="text-amber-300">△</span>;
  return <span className="text-slate-600">—</span>;
}
