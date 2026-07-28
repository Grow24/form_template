"use client";

import {
  ReactFlow,
  Background,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import { useStudioStore } from "@/lib/store/studio-store";

const nodeBase = {
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 700,
  padding: "12px 14px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
};

const baseNodes: Node[] = [
  {
    id: "event",
    position: { x: 20, y: 80 },
    data: { label: "On Hover" },
    style: {
      ...nodeBase,
      background: "#0f766e",
      color: "#ecfeff",
      border: "2px solid #2dd4bf",
      width: 110,
    },
  },
  {
    id: "vars",
    position: { x: 150, y: 80 },
    data: { label: "Read Value\n& Target" },
    style: {
      ...nodeBase,
      background: "#1e293b",
      color: "#e2e8f0",
      border: "2px solid #475569",
      width: 120,
      whiteSpace: "pre-line",
    },
  },
  {
    id: "decision",
    position: { x: 300, y: 70 },
    data: { label: "Value ≥ Target?" },
    style: {
      ...nodeBase,
      background: "#312e81",
      color: "#e0e7ff",
      border: "2px solid #818cf8",
      width: 130,
    },
  },
  {
    id: "success",
    position: { x: 470, y: 10 },
    data: { label: "Success\nExpand 400ms" },
    style: {
      ...nodeBase,
      background: "#14532d",
      color: "#bbf7d0",
      border: "2px solid #22c55e",
      width: 120,
      whiteSpace: "pre-line",
    },
  },
  {
    id: "warning",
    position: { x: 470, y: 80 },
    data: { label: "Warning\nExpand 400ms" },
    style: {
      ...nodeBase,
      background: "#713f12",
      color: "#fef08a",
      border: "2px solid #facc15",
      width: 120,
      whiteSpace: "pre-line",
    },
  },
  {
    id: "danger",
    position: { x: 470, y: 150 },
    data: { label: "Danger\nPulse ×2" },
    style: {
      ...nodeBase,
      background: "#7f1d1d",
      color: "#fecaca",
      border: "2px solid #f87171",
      width: 120,
      whiteSpace: "pre-line",
    },
  },
];

const baseEdges: Edge[] = [
  {
    id: "e1",
    source: "event",
    target: "vars",
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
    style: { stroke: "#94a3b8", strokeWidth: 2.5 },
  },
  {
    id: "e2",
    source: "vars",
    target: "decision",
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
    style: { stroke: "#94a3b8", strokeWidth: 2.5 },
  },
  {
    id: "e3",
    source: "decision",
    target: "success",
    label: "IF",
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
    style: { stroke: "#22c55e", strokeWidth: 2.5 },
    labelStyle: { fill: "#86efac", fontSize: 11, fontWeight: 700 },
  },
  {
    id: "e4",
    source: "decision",
    target: "warning",
    label: "ELSE IF",
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
    style: { stroke: "#facc15", strokeWidth: 2.5 },
    labelStyle: { fill: "#fde68a", fontSize: 11, fontWeight: 700 },
  },
  {
    id: "e5",
    source: "decision",
    target: "danger",
    label: "ELSE",
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
    style: { stroke: "#f87171", strokeWidth: 2.5 },
    labelStyle: { fill: "#fecaca", fontSize: 11, fontWeight: 700 },
  },
];

export function InteractionFlow() {
  const variables = useStudioStore((s) => s.variables);
  const matched = useMemo(() => {
    if (variables.achievementPercent >= variables.targetMinimum) return "success";
    if (variables.achievementPercent >= variables.warningMinimum) return "warning";
    return "danger";
  }, [variables]);

  const nodes = useMemo(
    () =>
      baseNodes.map((n) =>
        n.id === matched
          ? {
              ...n,
              style: {
                ...n.style,
                boxShadow: "0 0 0 3px rgba(45,212,191,0.9), 0 4px 16px rgba(0,0,0,0.5)",
              },
            }
          : n,
      ),
    [matched],
  );

  return (
    <div className="h-[240px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={baseEdges}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll={false}
      >
        <Background color="#334155" gap={20} size={1.5} />
      </ReactFlow>
    </div>
  );
}
