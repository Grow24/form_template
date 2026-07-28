"use client";

import {
  BookOpen,
  Boxes,
  FlaskConical,
  GitBranch,
  Layers3,
  LayoutGrid,
  Radar,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useStudioStore } from "@/lib/store/studio-store";
import type { WorkspaceId } from "@/lib/pbmp/types";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  id: WorkspaceId;
  label: string;
  icon: LucideIcon;
  children?: string[];
};

const NAV: NavItem[] = [
  { id: "library", label: "Library", icon: BookOpen, children: ["Templates"] },
  {
    id: "studio",
    label: "Studio",
    icon: Sparkles,
    children: ["Create/Edit", "Tokens", "Forms", "Interactions", "Animations"],
  },
  {
    id: "test-lab",
    label: "Test Lab",
    icon: FlaskConical,
    children: ["Scenarios", "Test Suites", "Results"],
  },
  {
    id: "workflow",
    label: "Workflow",
    icon: GitBranch,
    children: ["My Tasks", "All Submissions"],
  },
  {
    id: "published",
    label: "Published",
    icon: LayoutGrid,
    children: ["Approved Templates", "Versions"],
  },
  {
    id: "applications",
    label: "Applications",
    icon: Boxes,
    children: ["Dashboards", "Email Templates", "Reports", "Presentations"],
  },
  {
    id: "impact",
    label: "Impact",
    icon: Radar,
    children: ["Dependency Map", "Impact Analysis"],
  },
  {
    id: "functionality",
    label: "Functionality",
    icon: Layers3,
    children: ["Forms Map", "Variants", "Matrix"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: ["Workflows", "Users & Roles", "System"],
  },
];

export function Sidebar() {
  const workspace = useStudioStore((s) => s.workspace);
  const setWorkspace = useStudioStore((s) => s.setWorkspace);

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r-2 border-[var(--pbmp-border-strong)] bg-[#0a1018] shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
      <div className="border-b-2 border-[var(--pbmp-border)] px-5 py-5">
        <p className="pbmp-label text-teal-300/90">PBMP</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold leading-tight text-slate-50">
          Form & Style Studio
        </h1>
      </div>
      <nav className="flex-1 space-y-2 overflow-auto p-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = workspace === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setWorkspace(item.id)}
                className={cn(
                  "pbmp-nav-btn flex w-full items-center gap-3 text-left",
                  active
                    ? "pbmp-nav-btn-active"
                    : "text-slate-400 hover:border-[var(--pbmp-border)] hover:bg-white/[0.06] hover:text-slate-200",
                )}
              >
                <Icon size={18} strokeWidth={2.2} className="shrink-0" />
                {item.label}
              </button>
              {active && item.children && (
                <div className="ml-8 mt-2 space-y-1 border-l-2 border-[var(--pbmp-border)] pl-3">
                  {item.children.map((child) => (
                    <div
                      key={child}
                      className="rounded-md px-2 py-1.5 text-xs font-semibold text-slate-500"
                    >
                      {child}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t-2 border-[var(--pbmp-border)] p-5 text-xs font-medium leading-relaxed text-slate-500">
        One Functionality → Multiple Forms. Style, Interaction and Render Mode
        package the same content.
      </div>
    </aside>
  );
}
