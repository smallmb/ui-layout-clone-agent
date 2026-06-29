# 🧬 UI Layout Clone Agent (v7.0.0)

![Version](https://img.shields.io/badge/version-7.0.0-blue.svg)
![Type](https://img.shields.io/badge/type-AI_Agent_Skill-orange.svg)
![Architecture](https://img.shields.io/badge/architecture-Multi--Agent_Swarm-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

An enterprise-grade, full-stack product reverse engineering engine powered by LLMs.

Unlike traditional code generators, this Agent Skill operates on a **Dual-Track Architecture**, seamlessly handling both local AST/Grep static analysis and dynamic Headless Browser sniffing (Playwright + Vision Model + Network Interception) for production URLs.

## ✨ Core Capabilities in v7.0.0

- **🌐 Dynamic Site Extraction**: Extracts semantic DOM, micro-interactions, and animations directly from compiled production URLs using Headless Browsers.
- **📡 Data-Driven Sniffing (Network Interception)**: Intercepts XHR/Fetch requests during the extraction phase to infer API schemas and generate Mock Data structures.
- **🎨 W3C Design Tokens Export**: Reverse-engineers computed styles and exports a standard `tokens.json` directly compatible with Figma Token Studio.
- **🤖 Multi-Agent Swarm Architecture**: Uses a `DelegateTask` system to prevent context overflow. The Main Agent handles layout and routing, while SubAgents simultaneously build 3D scenes, complex CSS charts, and interaction logic.
- **🗺️ Multi-Page Site Mapping**: Automatically extracts site structures and navigation rules to generate interconnected multi-page applications.

## 📂 Repository Structure

- `/agent/ui-layout-clone.md` - The core Agent Skill instruction file. Import this into Cursor, Cline, or mimocode.
- `/examples/linear-clone` - A breathtaking 6-page, 1:1 replica of the Linear.app website. **Generated entirely by this Agent with ZERO external dependencies or images.**

## 🚀 The Linear Clone Showcase

The `/examples/linear-clone` directory demonstrates the absolute power of this Agent:
1. **Pure CSS Mock UIs**: Recreated complex Kanban boards, Gantt charts, and Code Diff panels purely using nested HTML/CSS.
2. **Unified Design System**: A perfectly synchronized CSS variable system extracted directly from the target site.
3. **Vanilla JS Interactions**: Silky smooth intersection observers, tabs, and toggles without pulling in heavy libraries.

## 🛠 How to Use

Load the `ui-layout-clone.md` into your AI IDE / Agent framework and trigger it with a prompt like:
> "Start ui-layout-clone v7.0.0. Sniff https://linear.app, use Strategy C, and intercept its network to infer the API schema for the features page."

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Input Sniffer                      │
│         (Local Path → Phase 1)                       │
│         (URL → Dynamic Extraction Phase)             │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐  ┌──────────────────────────────┐
│  Phase 1:        │  │  Dynamic Extraction Phase     │
│  Static Analysis │  │  Step A: Visual Skeleton      │
│  (AST/Grep)      │  │  Step A.5: Site Map           │
│                  │  │  Step B: Semantic DOM          │
│  16 Sub-sections │  │  Step C: Computed Style        │
│                  │  │  Step C.2: W3C Tokens          │
│                  │  │  Step D: Interaction State     │
│                  │  │  Step E: Network Interception  │
└──────────┬───────┘  └──────────────┬───────────────┘
           │                         │
           ▼                         ▼
┌─────────────────────────────────────────────────────┐
│              reference.md + tokens.json              │
│              (Unified Extraction Output)             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│           Phase 3: Multi-Agent Swarm                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │Main Agent│  │CSS_Agent │  │ThreeJS   │          │
│  │(Layout)  │──│(Styles)  │  │_Agent    │          │
│  │          │  │          │  │(3D Scene)│          │
│  │          │──│DataViz   │  │Logic     │          │
│  │          │  │_Agent    │  │_Agent    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                       │                              │
│              Merge & Review                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Phase 4: Quality Gates                  │
│  ✓ Responsive  ✓ Semantics  ✓ Accessibility         │
│  ✓ Performance ✓ Tokens     ✓ Link Integrity         │
│  ✓ Anti-Slop   ✓ Interactions ✓ Sub-component       │
└─────────────────────────────────────────────────────┘
```

## 📋 Extraction Steps

| Step | Name | Tool | Output |
|------|------|------|--------|
| A | Visual Skeleton | Playwright + VisionModel | Layout structure, component inventory |
| A.5 | Site Map Extraction | Playwright + ExecuteScript | Page list, navigation hierarchy, routes |
| B | Semantic DOM | ExecuteScript | Lightweight DOM tree (JSON) |
| C | Computed Style | ExecuteScript | Design Tokens (YAML) |
| C.2 | W3C Tokens Export | ExecuteScript | tokens.json (Figma compatible) |
| D | Interaction State | Playwright + ExecuteScript | hover/click/focus transition params |
| E | Network Interception | Playwright NetworkIntercept | API data models, Mock structures |

## 📜 License

MIT
