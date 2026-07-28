# PBMP Form & Style Studio

Interactive Next.js implementation of the PBMP Form / Style / Interaction model.

## Core principle

Same **Content/Data** and **Functionality** can be packaged through different:

- **Form Types** — Line Chart, Bar Chart, Text, …
- **Render Modes** — 2D or 3D
- **Style Templates** — Executive Light, Executive Dark, …
- **Interaction Templates** — Events → Conditions → Actions → Animation
- **Artifact Adapters** — Dashboard, Email, Report, Presentation

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- Apache ECharts (2D charts)
- Three.js + React Three Fiber + Drei (3D)
- Motion (DOM/text animation)
- Zustand (runtime state)
- Zod (schema validation)
- JsonLogic (declarative conditions)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Workspaces

| Workspace | Purpose |
|-----------|---------|
| Library | Template inventory, filters, create wizard |
| Studio | Live 2D/3D/Split preview, tokens, Form mapping, interactions |
| Test Lab | Scenario runner + Event Trace |
| Workflow | Draft → Review → Approve → Publish |
| Published | Immutable approved versions |
| Applications | Apply templates to artifacts (linked / pinned / forked) |
| Impact | Dependency and compatibility analysis |
| Settings | Registries + attribute matrix reference |

## Runtime flow

```
Browser / ECharts / R3F Event
  → PBMP Event Adapter
  → Variable Resolver
  → JsonLogic Condition Evaluator
  → Branch Selector
  → Action Orchestrator (whitelist)
  → Style Resolver
  → Form Adapter (Line / Bar / Text / 3D)
  → Animation
  → Rendered Component
```

## Sample data

Monthly sales (₹ lakh): Jan 10 · Feb 14 · Mar 12 · Apr 18

Hover rules use `achievementPercent` vs `targetMinimum` (95) and `warningMinimum` (70) to apply success / warning / danger emphasis with expand or pulse animation.
