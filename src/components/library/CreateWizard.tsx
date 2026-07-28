"use client";

import { useState } from "react";
import { useStudioStore } from "@/lib/store/studio-store";

const STEPS = ["Identity", "Coverage", "Starting style", "Test data"] as const;

export function CreateWizard() {
  const open = useStudioStore((s) => s.createWizardOpen);
  const setOpen = useStudioStore((s) => s.setCreateWizardOpen);
  const setWorkspace = useStudioStore((s) => s.setWorkspace);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Executive Accent");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#121a24] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-50">
            Create Style Template
          </h3>
          <button
            type="button"
            className="text-slate-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="mb-6 flex gap-2">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex-1 rounded-full px-2 py-1 text-center text-[10px] ${
                i === step
                  ? "bg-teal-500/20 text-teal-200"
                  : i < step
                    ? "bg-white/10 text-slate-300"
                    : "bg-white/5 text-slate-500"
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-3">
            <label className="block text-xs text-slate-400">
              Template name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-slate-400">
              Description
              <textarea
                defaultValue="Dark executive reporting style with cyan data emphasis"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                rows={3}
              />
            </label>
            <label className="block text-xs text-slate-400">
              Template family
              <select className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                <option>Corporate</option>
                <option>Accessible</option>
                <option>Presentation</option>
              </select>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-2 text-sm text-slate-300">
            <p className="text-xs text-slate-500">
              Select Forms and Render Modes this Template supports.
            </p>
            {[
              ["Bar Chart", "2D + 3D"],
              ["Line Chart", "2D + optional 3D"],
              ["Text", "2D"],
              ["KPI Card", "2D + optional 3D"],
            ].map(([form, coverage]) => (
              <label
                key={form}
                className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2"
              >
                <span>{form}</span>
                <span className="text-xs text-teal-300">{coverage}</span>
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2 text-sm">
            {[
              "Start from PBMP defaults",
              "Clone Executive Dark",
              "Inherit from Corporate Base",
              "Import approved design tokens",
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                className="block w-full rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5 text-left text-slate-200 hover:border-teal-400/40"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm text-slate-300">
            <p className="text-xs text-slate-500">
              Choose representative sample data for live preview.
            </p>
            {[
              "Standard monthly sales",
              "Negative values",
              "Very large values",
              "Empty data",
              "Long labels / many categories",
            ].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 rounded-lg border border-white/8 px-3 py-2"
              >
                <input type="radio" name="testdata" defaultChecked={opt.startsWith("Standard")} />
                {opt}
              </label>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-lg px-4 py-2 text-sm text-slate-400 disabled:opacity-30"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              if (step < STEPS.length - 1) setStep((s) => s + 1);
              else {
                setOpen(false);
                setWorkspace("studio");
                setStep(0);
              }
            }}
            className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            {step < STEPS.length - 1 ? "Continue" : `Open Studio · ${name}`}
          </button>
        </div>
      </div>
    </div>
  );
}
