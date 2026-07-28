"use client";

import { CheckCircle2, Clock3, FileWarning, Plus, Sparkles, type LucideIcon } from "lucide-react";
import { useStudioStore } from "@/lib/store/studio-store";
import { CreateWizard } from "./CreateWizard";

export function LibraryView() {
  const templates = useStudioStore((s) => s.templates);
  const filter = useStudioStore((s) => s.selectedLibraryFilter);
  const setLibraryFilter = useStudioStore((s) => s.setLibraryFilter);
  const setActiveTemplate = useStudioStore((s) => s.setActiveTemplate);
  const setWorkspace = useStudioStore((s) => s.setWorkspace);
  const setCreateWizardOpen = useStudioStore((s) => s.setCreateWizardOpen);

  const filtered =
    filter === "all"
      ? templates
      : templates.filter((t) => t.status === filter);

  const drafts = templates.filter((t) => t.status === "draft").length;
  const review = templates.filter((t) => t.status === "inReview").length;
  const approved = templates.filter(
    (t) => t.status === "approved" || t.status === "published",
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-50">
            Template Library
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Find Style Templates, Form coverage, versions and approvals. One
            semantic Template packs 2D and 3D Forms without duplicating data.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateWizardOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-400"
        >
          <Plus className="h-4 w-4" />
          Create Style Template
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={Sparkles} label="My Drafts" value={drafts} />
        <SummaryCard icon={Clock3} label="Awaiting Review" value={review} />
        <SummaryCard icon={CheckCircle2} label="Approved" value={approved} />
        <SummaryCard icon={FileWarning} label="With Issues" value={0} />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["all", "All"],
          ["draft", "Draft"],
          ["inReview", "In review"],
          ["approved", "Approved"],
          ["published", "Published"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setLibraryFilter(id)}
            className={`rounded-full px-3 py-1 text-xs ${
              filter === id
                ? "bg-white/15 text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-[#111821]/80">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Template</th>
              <th className="px-4 py-3 font-medium">Coverage</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Version</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Used by</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="cursor-pointer border-b border-white/5 transition hover:bg-white/[0.03]"
                onClick={() => {
                  setActiveTemplate(t.id);
                  setWorkspace("studio");
                }}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-100">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.family}</div>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {Object.values(t.coverage)
                    .flat()
                    .includes("3d")
                    ? "2D + 3D"
                    : "2D"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={t.status} />
                </td>
                <td className="px-4 py-3 text-slate-300">{t.version}</td>
                <td className="px-4 py-3 text-slate-300">{t.owner}</td>
                <td className="px-4 py-3 text-slate-400">{t.updatedAt}</td>
                <td className="px-4 py-3 text-slate-300">{t.usedByCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateWizard />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-gradient-to-br from-white/[0.06] to-transparent p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-slate-50">
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colours: Record<string, string> = {
    draft: "bg-slate-500/20 text-slate-300",
    inReview: "bg-amber-500/20 text-amber-200",
    approved: "bg-emerald-500/20 text-emerald-200",
    published: "bg-teal-500/20 text-teal-200",
    rejected: "bg-rose-500/20 text-rose-200",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] capitalize ${colours[status] ?? colours.draft}`}
    >
      {status === "inReview" ? "In review" : status}
    </span>
  );
}
