"use client";

import ReactECharts from "echarts-for-react";
import { motion } from "motion/react";
import type {
  ContentDefinition,
  FormType,
  RuntimeOverride,
  StyleTemplate,
} from "@/lib/pbmp/types";
import { formatSalesINR } from "@/lib/pbmp/sample-data";
import { resolveStyle, type ResolvedStyle } from "@/lib/pbmp/style-resolver";

interface Chart2DProps {
  formType: FormType;
  content: ContentDefinition;
  template: StyleTemplate;
  runtime: RuntimeOverride;
  title: string;
  onHoverEnter: () => void;
  onHoverExit: () => void;
  onClick: () => void;
}

export function Chart2D({
  formType,
  content,
  template,
  runtime,
  title,
  onHoverEnter,
  onHoverExit,
  onClick,
}: Chart2DProps) {
  const style = resolveStyle(template, formType, "2d", runtime);
  const categories = content.data.map((d) => d.category);
  const actual = content.data.map((d) => d.value / 100000);
  const target = content.data.map((d) => (d.target ?? d.value) / 100000);
  const prior = content.data.map((d) => (d.priorYear ?? d.value * 0.85) / 100000);

  const seriesColour = style.dataPrimary;
  const isLine = formType === "lineChart";
  const isPie = formType === "pieChart";

  const barData = actual.map((v, i) => {
    const highlighted =
      runtime.highlightedIndex === i ||
      (runtime.statusColour && i === 2); /* Mar demo highlight */
    return {
      value: v,
      itemStyle: {
        color: highlighted
          ? (style.statusColour ?? template.semantic.status.warning)
          : seriesColour,
        borderRadius: [style.barRadius, style.barRadius, 0, 0],
      },
    };
  });

  const option = isPie
    ? {
        backgroundColor: "transparent",
        textStyle: { fontFamily: style.fontFamily, color: style.contentSecondary },
        tooltip: { trigger: "item" },
        legend: {
          top: 0,
          right: 0,
          textStyle: { color: style.contentSecondary },
        },
        series: [
          {
            type: "pie",
            radius: ["35%", "65%"],
            data: content.data.map((d, i) => ({
              name: d.category,
              value: d.value / 100000,
              itemStyle: {
                color:
                  template.semantic.data.palette[
                    i % template.semantic.data.palette.length
                  ],
              },
            })),
          },
        ],
      }
    : {
        backgroundColor: "transparent",
        textStyle: { fontFamily: style.fontFamily, color: style.contentSecondary },
        grid: { left: 48, right: 16, top: 36, bottom: 28 },
        tooltip: {
          trigger: "axis",
          backgroundColor: style.tooltip,
          borderColor: style.border === "transparent" ? style.grid : style.border,
          textStyle: { color: style.contentPrimary },
        },
        legend: {
          show: true,
          right: 4,
          top: 0,
          textStyle: { color: style.contentSecondary, fontSize: 11 },
        },
        xAxis: {
          type: "category",
          data: categories,
          axisLine: { lineStyle: { color: style.grid } },
          axisLabel: { color: style.contentSecondary },
        },
        yAxis: {
          type: "value",
          name: content.unitLabel ?? "₹ lakh",
          nameTextStyle: { color: style.contentSecondary, fontSize: 10 },
          splitLine: { lineStyle: { color: style.grid } },
          axisLabel: { color: style.contentSecondary },
        },
        series: isLine
          ? [
              {
                name: "Actual",
                type: "line",
                data: actual,
                smooth: true,
                symbolSize: style.markerSize,
                lineStyle: { width: style.lineWidth, color: seriesColour },
                itemStyle: { color: seriesColour },
              },
              {
                name: "Target",
                type: "line",
                data: target,
                smooth: true,
                symbol: "none",
                lineStyle: {
                  width: 1.5,
                  type: "dashed",
                  color: template.semantic.status.warning,
                },
              },
              {
                name: "Prior Year",
                type: "line",
                data: prior,
                smooth: true,
                symbol: "none",
                lineStyle: {
                  width: 1.5,
                  color: template.semantic.content.muted,
                },
              },
            ]
          : [
              {
                name: "Actual",
                type: "bar",
                data: barData,
                barGap: "20%",
                barWidth: "28%",
              },
              {
                name: "Target",
                type: "bar",
                data: target,
                itemStyle: {
                  color: template.semantic.status.warning,
                  opacity: 0.35,
                  borderRadius: [style.barRadius, style.barRadius, 0, 0],
                },
                barWidth: "28%",
              },
              {
                name: "Prior Year",
                type: "bar",
                data: prior,
                itemStyle: {
                  color: template.semantic.content.muted,
                  opacity: 0.45,
                  borderRadius: [style.barRadius, style.barRadius, 0, 0],
                },
                barWidth: "28%",
              },
            ],
        animationDuration: template.foundation.motion.durationMs,
      };

  return (
    <PreviewChrome
      style={style}
      title={title}
      badge="2D"
      formType={formType}
      onHoverEnter={onHoverEnter}
      onHoverExit={onHoverExit}
      onClick={onClick}
    >
      <ReactECharts
        option={option}
        style={{ height: 260, width: "100%" }}
        opts={{ renderer: "canvas" }}
        onEvents={{
          mouseover: onHoverEnter,
          globalout: onHoverExit,
          click: onClick,
        }}
      />
    </PreviewChrome>
  );
}

export function TextFormPreview({
  content,
  template,
  runtime,
  title,
  onHoverEnter,
  onHoverExit,
  onClick,
}: Omit<Chart2DProps, "formType">) {
  const style = resolveStyle(template, "text", "2d", runtime);
  const latest = content.data[content.data.length - 1];
  const prev = content.data[content.data.length - 2];
  const delta = ((latest.value - prev.value) / prev.value) * 100;

  return (
    <PreviewChrome
      style={style}
      title={title}
      badge="TEXT"
      formType="text"
      onHoverEnter={onHoverEnter}
      onHoverExit={onHoverExit}
      onClick={onClick}
    >
      <motion.div
        animate={{ scale: style.scale, color: style.textColour }}
        transition={{
          duration: (template.animationProfiles.expand.durationMs ?? 500) / 1000,
          ease: "easeOut",
        }}
        className="flex min-h-[260px] flex-col justify-center px-2"
        style={{
          fontFamily: style.fontFamily,
          textAlign: style.textAlign,
          lineHeight: style.lineHeight,
        }}
      >
        <p
          className="text-sm uppercase tracking-[0.14em]"
          style={{ color: style.contentSecondary }}
        >
          Sales Achievement
        </p>
        <p
          className="mt-3 text-3xl font-semibold leading-tight"
          style={{
            color: style.textColour,
            fontWeight: style.textWeight,
            fontSize: style.textSize + 12,
          }}
        >
          Sales increased by {delta.toFixed(0)}% this month.
        </p>
        <p className="mt-4 text-sm" style={{ color: style.contentSecondary }}>
          {latest.category}: {formatSalesINR(latest.value)} · Achievement{" "}
          {latest.achievementPercent}%
        </p>
      </motion.div>
    </PreviewChrome>
  );
}

export function TableFormPreview({
  content,
  template,
  runtime,
  title,
  onHoverEnter,
  onHoverExit,
  onClick,
}: Omit<Chart2DProps, "formType">) {
  const style = resolveStyle(template, "table", "2d", runtime);
  return (
    <PreviewChrome
      style={style}
      title={title}
      badge="TABLE"
      formType="table"
      onHoverEnter={onHoverEnter}
      onHoverExit={onHoverExit}
      onClick={onClick}
    >
      <div className="min-h-[260px] overflow-auto">
        <table className="w-full text-left text-xs" style={{ color: style.contentPrimary }}>
          <thead>
            <tr style={{ color: style.contentSecondary }}>
              <th className="py-2">Month</th>
              <th className="py-2">Actual</th>
              <th className="py-2">Target</th>
              <th className="py-2">Prior</th>
              <th className="py-2">Ach %</th>
            </tr>
          </thead>
          <tbody>
            {content.data.map((row) => (
              <tr key={row.category} className="border-t" style={{ borderColor: style.grid }}>
                <td className="py-1.5">{row.category}</td>
                <td className="py-1.5">{formatSalesINR(row.value)}</td>
                <td className="py-1.5">
                  {formatSalesINR(row.target ?? row.value)}
                </td>
                <td className="py-1.5">
                  {formatSalesINR(row.priorYear ?? row.value)}
                </td>
                <td className="py-1.5">{row.achievementPercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PreviewChrome>
  );
}

function PreviewChrome({
  style,
  title,
  badge,
  formType,
  children,
  onHoverEnter,
  onHoverExit,
  onClick,
}: {
  style: ResolvedStyle;
  title: string;
  badge: string;
  formType: string;
  children: React.ReactNode;
  onHoverEnter: () => void;
  onHoverExit: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      animate={{
        scale: style.pulsing ? [1, 1.04, 1] : style.scale,
        opacity: style.opacity,
      }}
      transition={
        style.pulsing
          ? { duration: 0.7, repeat: 1 }
          : { duration: 0.4, ease: "easeOut" }
      }
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverExit}
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden"
      style={{
        background: style.surface,
        border:
          style.border === "transparent" || !style.border
            ? "2px solid rgba(255,255,255,0.1)"
            : `2px solid ${style.border}`,
        borderRadius: style.borderRadius,
        boxShadow: style.shadow === "none" ? "0 8px 24px rgba(0,0,0,0.35)" : style.shadow,
        padding: 18,
      }}
    >
      <div className="mb-1 flex items-start justify-between gap-3">
        <div>
          <h3
            style={{
              color: style.contentPrimary,
              fontFamily: style.fontFamily,
              fontSize: style.titleSize,
              fontWeight: style.titleWeight,
            }}
          >
            {title}
          </h3>
          <p className="mt-0.5 text-[10px]" style={{ color: style.contentSecondary }}>
            Form: {formType} · same Functionality & data
          </p>
        </div>
        <span
          className="rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide"
          style={{ background: style.elevated, color: style.contentSecondary }}
        >
          {badge}
        </span>
      </div>
      {children}
      {style.tooltipVisible && (
        <div
          className="pointer-events-none absolute bottom-3 right-3 max-w-[220px] rounded-md px-3 py-2 text-xs shadow-lg"
          style={{
            background: style.tooltip,
            color: style.contentPrimary,
            border: `1px solid ${style.border === "transparent" ? style.grid : style.border}`,
          }}
        >
          {style.tooltipContent}
        </div>
      )}
    </motion.div>
  );
}
