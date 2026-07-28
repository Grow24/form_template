"use client";

import {
  COMBINATION_MATRIX,
  FORM_VARIANTS,
  FUNCTIONALITIES,
} from "@/lib/pbmp/functionality";
import { useStudioStore } from "@/lib/store/studio-store";

export function FunctionalityView() {
  const setWorkspace = useStudioStore((s) => s.setWorkspace);
  const setFormType = useStudioStore((s) => s.setFormType);
  const setActiveTemplate = useStudioStore((s) => s.setActiveTemplate);
  const setPreviewMode = useStudioStore((s) => s.setPreviewMode);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-50">
          Functionality → Forms
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          One Functionality → one functional definition → one content/data
          structure → multiple Form Variants, each governed by a Form-specific /
          Style Template. Content, meaning, data and logic stay unchanged.
        </p>
      </div>

      {FUNCTIONALITIES.map((fn) => (
        <div
          key={fn.id}
          className="rounded-xl border border-white/8 bg-[#111821]/80 p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-teal-300/80">
                {fn.id}
              </p>
              <h3 className="mt-1 text-lg text-slate-50">{fn.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{fn.intendedOutcome}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <MetaBlock title="Inputs" items={fn.inputs} />
            <MetaBlock title="Outputs" items={fn.outputs} />
            <MetaBlock title="Constraints" items={fn.constraints} />
          </div>

          <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Forms of this Functionality
          </p>
          <div className="overflow-auto rounded-lg border border-white/8">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="border-b border-white/8 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-3 py-2">Form</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Channel</th>
                  <th className="px-3 py-2">Medium</th>
                  <th className="px-3 py-2">Format</th>
                  <th className="px-3 py-2">Device</th>
                  <th className="px-3 py-2">Templates</th>
                </tr>
              </thead>
              <tbody>
                {fn.forms.map((form) => (
                  <tr
                    key={form.formId}
                    className="cursor-pointer border-b border-white/5 text-slate-300 hover:bg-white/[0.03]"
                    onClick={() => {
                      setFormType(form.formType);
                      setActiveTemplate(form.templateIds[0]);
                      setPreviewMode(
                        form.format.includes("3d") ? "split" : "2d",
                      );
                      setWorkspace("studio");
                    }}
                  >
                    <td className="px-3 py-2 text-slate-100">{form.formId}</td>
                    <td className="px-3 py-2">{form.formType}</td>
                    <td className="px-3 py-2">{form.channel}</td>
                    <td className="px-3 py-2">{form.medium}</td>
                    <td className="px-3 py-2 font-mono text-[10px]">
                      {form.format}
                    </td>
                    <td className="px-3 py-2">{form.targetDevice}</td>
                    <td className="px-3 py-2">{form.templateIds.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-white/8 bg-[#111821]/80 p-5">
        <h3 className="text-lg text-slate-50">
          Form variants (same Line/Bar Functionality)
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Presentation packaging only — Corporate Light, Executive Dark, Mobile,
          Accessible, Print, etc.
        </p>
        <div className="mt-4 overflow-auto rounded-lg border border-white/8">
          <table className="w-full min-w-[800px] text-left text-xs">
            <thead className="border-b border-white/8 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-2">Form variant</th>
                <th className="px-3 py-2">Background</th>
                <th className="px-3 py-2">Font</th>
                <th className="px-3 py-2">Presentation</th>
                <th className="px-3 py-2">Other settings</th>
              </tr>
            </thead>
            <tbody>
              {FORM_VARIANTS.map((v) => (
                <tr
                  key={v.id}
                  className="cursor-pointer border-b border-white/5 text-slate-300 hover:bg-white/[0.03]"
                  onClick={() => {
                    setActiveTemplate(v.styleTemplateId);
                    setWorkspace("studio");
                  }}
                >
                  <td className="px-3 py-2 text-slate-100">{v.name}</td>
                  <td className="px-3 py-2">{v.background}</td>
                  <td className="px-3 py-2">{v.font}</td>
                  <td className="px-3 py-2">{v.presentation}</td>
                  <td className="px-3 py-2">{v.otherSettings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-[#111821]/80 p-5">
        <h3 className="text-lg text-slate-50">Combination matrix</h3>
        <p className="mt-1 text-sm text-slate-400">
          One dataset · one Functionality · Form Type × Style Template
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-white/8">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/8 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-2">Form Type</th>
                <th className="px-3 py-2">Executive Light</th>
                <th className="px-3 py-2">Executive Dark</th>
              </tr>
            </thead>
            <tbody>
              {COMBINATION_MATRIX.map((row) => (
                <tr key={row.formType} className="border-b border-white/5 text-slate-300">
                  <td className="px-3 py-2 text-slate-100">{row.formType}</td>
                  <td className="px-3 py-2">{row.executiveLight}</td>
                  <td className="px-3 py-2">{row.executiveDark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetaBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-400">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
