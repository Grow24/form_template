"use client";

import { Bell, Search, User } from "lucide-react";
import { useStudioStore } from "@/lib/store/studio-store";

const TITLES: Record<string, string> = {
  library: "Template Library",
  studio: "Template Studio",
  "test-lab": "Test Lab",
  workflow: "Approval Workflow",
  published: "Published Versions",
  applications: "Artifact Applications",
  impact: "Impact & Dependencies",
  functionality: "Functionality → Forms",
  settings: "Studio Settings",
};

export function TopBar() {
  const workspace = useStudioStore((s) => s.workspace);
  const template = useStudioStore((s) => s.getActiveTemplate());

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b-2 border-[var(--pbmp-border-strong)] bg-[#0a1018]/95 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-50">
          {TITLES[workspace] ?? "PBMP"}
        </h2>
        <p className="mt-0.5 text-xs font-semibold text-slate-500">
          {template.name} › Draft v2.2.0 · {template.status}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2.5 rounded-xl border-2 border-[var(--pbmp-border)] bg-black/30 px-4 py-2.5 text-sm font-medium text-slate-400 md:flex">
          <Search size={16} strokeWidth={2.5} />
          <span>Search templates…</span>
        </div>
        <button
          type="button"
          className="rounded-xl border-2 border-[var(--pbmp-border)] bg-black/30 p-2.5 text-slate-300 hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={2.2} />
        </button>
        <div className="flex items-center gap-2.5 rounded-xl border-2 border-[var(--pbmp-border)] bg-black/30 px-3 py-2 text-sm font-semibold text-slate-200">
          <User size={16} strokeWidth={2.2} />
          <span>
            Ravi Kumar
            <span className="ml-1 font-medium text-slate-500">· Designer</span>
          </span>
        </div>
      </div>
    </header>
  );
}
