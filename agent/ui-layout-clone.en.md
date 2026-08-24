---
name: ui-layout-clone
version: 7.2.0
description: |
  A UI reverse-engineering and implementation workflow for extracting layout,
  design systems, responsive behavior, interactions, animations, and optional
  data or rendering capabilities from source projects, live websites, or images.
user-invocable: true
---

# UI Layout Clone

Extract the observable structure and behavior of a reference interface, then
adapt it to the target project's existing technology, dependencies, and business
constraints.

## Scope and Workflow Model

This skill uses a **core workflow plus optional modules**. Simple visual cloning
should not trigger advanced analysis unnecessarily.

### Core Workflow

1. Classify the reference input.
2. Analyze the reference layout, visual hierarchy, design system, and responsive behavior.
3. Analyze the target project's technology, runtime, reusable assets, and constraints.
4. Write the analysis to `.layout-clone/reference.md` and `.layout-clone/target.md`.
5. Create `.layout-clone/implementation-plan.md` before changing project files.
6. Generate the page structure, components, styles, and basic interactions.
7. Run the target project and validate fixed-viewport screenshots.
8. Correct visible differences and record remaining limitations.

### Optional Modules

Enable these only when requested or detected in the reference or target project:

- CSS and scroll-driven animation
- API and data-model extraction
- Multi-page site maps and navigation
- Canvas 2D and audio visualization
- Three.js, WebGL, and shaders
- Drag-and-drop, touch, and gestures
- Electron desktop capabilities
- Multi-agent implementation

If a specialized tool is unavailable, continue with the core workflow using the
defined fallback strategy and document the limitation.

## Reference Input Classification

| Input | Type | Workflow |
|---|---|---|
| Local directory | Source project | Local static analysis |
| `.html`, `.tsx`, `.vue`, `.svelte`, or similar file | Source file | Local static analysis |
| `http://` or `https://` URL | Live website | Dynamic extraction |
| `localhost` or `127.0.0.1` URL | Local development server | Dynamic extraction |
| PNG, JPG, JPEG, WEBP, GIF, SVG, screenshot, or design image | Image/design reference | Image extraction |
| Unclear input | Unknown | Ask only when necessary |

## Image and Design Reference Cloning

Image input provides visual information only. It cannot reliably provide the
original DOM, event logic, API schema, font files, or source assets. Use the
following process:

1. Read image dimensions, orientation, and available resolution.
2. Identify page regions, layout skeleton, visual hierarchy, and visible components.
3. Estimate colors, typography levels, spacing, radius, shadows, alignment, and container widths.
4. Infer responsive behavior only when supported by evidence; otherwise mark it as an inference.
5. Separate direct observations, reasonable inferences, and unknown information.
6. Write the result to `.layout-clone/reference.md`.
7. Use the target analysis to create an implementation plan.
8. Validate the generated page with fixed-viewport screenshots.

Use this structure for image analysis:

```yaml
image_reference:
  source: "image path or upload identifier"
  dimensions: "1440x900"
  layout_skeleton: []
  component_inventory: []
  visual_hierarchy: []
  design_system:
    colors: []
    typography: []
    spacing: []
    radius: []
    shadows: []
  observation: []
  inference: []
  unknown: []
  limitations: []
```

Do not fabricate invisible behavior or claim exact visual fidelity when the
image is cropped, low-resolution, unreadable, or missing responsive references.

## Dynamic Website Extraction

For live websites, use browser automation when available:

### Authenticated Sessions and Security

When analysis requires authentication, use the following order:

1. Reuse the user's already-authenticated browser session.
2. Let the user complete a one-time assisted login in the browser.
3. Use an explicitly provided test-environment authentication flow.

Never request, store, or copy passwords, cookies, access tokens, refresh tokens,
or authorization headers. Record only the session status:

```yaml
authenticated_session:
  status: "available | required | unavailable"
  source: "existing-browser-session | user-assisted-login | test-auth-flow"
  limitations: []
```

If authentication is unavailable, continue with public pages and mark protected
pages and APIs as unverified.

1. Open the reference URL and wait for the page to become stable.
2. Capture desktop and mobile reference screenshots at `1440x900` and `375x812`.
3. Analyze the visual skeleton and component inventory.
4. Extract semantic DOM structure instead of copying `document.documentElement.outerHTML`.
5. Extract computed styles from representative elements.
6. Inspect hover, focus, click, scroll, loading, empty, and error states when accessible.
7. Extract internal navigation links when multi-page cloning is requested.
8. Capture JSON XHR/Fetch responses only when API analysis is requested and permitted.
9. Write the findings to `.layout-clone/reference.md`.

The scripts in `extractors/` are the canonical execution implementations.
Inline JavaScript in this document is algorithm reference and fallback guidance
only. Do not reimplement an inline extractor when the corresponding file is
available. Every extractor result must contain `extractor`, `status`, `data`,
and `limitations`.

### Static and Dynamic Interaction Analysis

`extractors/interactive-states.js` performs static analysis of interactive
elements, focusability, ARIA state, transitions, and likely event entry points.
It does not trigger actions. Browser automation may separately validate `hover`,
`focus`, `scroll`, menu opening, and tab switching using a safe action allowlist.

By default, never automate form submission, payment, deletion, messaging,
account changes, or other irreversible actions. Ordinary link clicks require a
clear target and a recoverable state.

For network capture, the host listener must write permitted JSON samples to
`window.__uiLayoutCloneResponses`. The network extractor only redacts and infers
schemas; it never obtains authentication credentials.

Use one canonical field for navigation:

```yaml
site_map:
  pages: []
  navigation:
    primary: []
    footer: []
  route_convention:
    method: "file-based | config-based | framework-router"
```

## Local Source Analysis

Inspect the project structure, package manifests, source files, styles, assets,
routes, state, and animation code. Prefer AST or framework-aware analysis when
available; use text search as supporting evidence rather than as the only source
of truth.

Extract, when present:

- Framework, language, build tool, and package manager
- Layout regions and responsive breakpoints
- Colors, typography, spacing, radius, shadows, and tokens
- Component patterns, props, variants, and reusable primitives
- Event handlers, forms, focus management, and scroll behavior
- State management and async loading/error patterns
- CSS, GSAP, Framer Motion, React Spring, Lottie, or other animation systems
- Canvas, WebGL, drag-and-drop, gestures, audio, and Electron capabilities

## Phase 2: Target Project Analysis

Classify the target as `existing-project`, `empty-project`, `static-html`,
`partial-project`, or `unknown`.

Analyze:

- Framework and language
- Build tool and package manager
- Router
- CSS solution
- Component and icon libraries
- Animation and state-management libraries
- Data-fetching and testing tools
- Existing design tokens and theme system
- Runtime entry point, startup command, routes, and errors
- Reusable components, hooks, utilities, assets, fonts, and layouts
- Existing interactions, API boundaries, and protected business logic

For runnable projects, start the project and verify the actual rendered state
when possible. Record loading, empty, error, and primary interaction states.

Do not repeatedly ask questions whose answers are already clear from the user’s
request. Ask only when the scope is ambiguous or the change could damage existing
business logic.

Record modification boundaries explicitly:

```yaml
replaceable_areas:
  - path: "src/pages/Home.tsx"
    scope: "whole-page"
    allowed_changes:
      - layout
      - styles
      - local-interactions

protected_areas:
  - path: "src/services/api.ts"
    reason: "Preserve the existing data contract"
```

Default protected areas include authentication, API contracts, route contracts,
global state, business data structures, and user-owned pages.

Write `.layout-clone/target.md` with these sections:

```markdown
# Target Analysis: [Project]

## Project Type
## Tech Stack
## Runtime Status
## Existing Design System
## Reusable Assets
## Existing Interactions & State
## Replaceable Areas
## Protected Areas
## Constraints
```

## v7.2.0 Execution Enhancements

### Extractor Contract

Prefer stable extractors over writing ad hoc scripts for every task:

| Extractor | Purpose | Output |
|---|---|---|
| `extractSemanticDOM` | Extract semantic DOM and component hierarchy | `semantic_tree` |
| `extractDesignTokens` | Extract computed styles and visual variables | `tokens.json` |
| `extractInteractiveStates` | Record hover, focus, click, and scroll states | `interactions` |
| `interceptNetworkRequests` | Capture permitted JSON responses and infer schemas | `data_models` |
| `extractSiteMap` | Extract internal pages and navigation | `site_map` |
| `extractRuntimeAssets` | Collect images, fonts, animations, models, and audio | `assets` |

Every extractor must define its input, output, evidence, and failure state. It
must avoid unnecessary sensitive data such as cookies, tokens, or personal data.
Samples must not be presented as complete API schemas. Partial or failed
extraction must return limitations instead of fabricated results.

Use this result shape:

```yaml
extractor_result:
  name: "extractSemanticDOM"
  status: "success | partial | failed | unavailable"
  data: {}
  evidence: []
  limitations: []
```

Complex extractor scripts should live in the skill's `extractors/` or
`references/` directory and be called by the workflow.

### Advanced Shared Context

Create `.layout-clone/shared-context.json` only in Advanced mode. It is optional
in Standard mode and unnecessary in Simple mode.

```json
{
  "version": "7.2.0",
  "mode": "advanced",
  "strategy": "full-clone",
  "targetProject": {
    "framework": "react",
    "language": "typescript",
    "cssSolution": "existing-project-solution",
    "stateManagement": "existing-solution",
    "animationLibrary": "existing-solution"
  },
  "reference": {
    "analysisPath": ".layout-clone/reference.md",
    "tokensPath": ".layout-clone/tokens.json"
  },
  "planPath": ".layout-clone/implementation-plan.md",
  "components": {},
  "protectedAreas": [],
  "constraints": {
    "noNewDependencies": true,
    "preserveBusinessLogic": true,
    "assignedFilesOnly": true
  }
}
```

Delegated agents may modify only assigned files and must report files changed,
interface requirements, dependencies, incomplete work, and possible conflicts.
The main agent owns integration, conflict resolution, build checks, and final
validation.

### Diff and Patch Safety

Prefer local changes when modifying an existing project:

1. List files and scopes in `implementation-plan.md` first.
2. Prefer new components or local style modules.
3. Use targeted patches for large business files; do not overwrite them wholesale without a reason.
4. Identify API, authentication, routing, global-state, and business-data boundaries before editing.
5. Review the diff after editing and confirm that protected areas were not crossed.
6. Report changed files, unresolved conflicts, and remaining risks.

If a protected file must be changed, stop and request confirmation. Without
confirmation, provide a patch proposal or an isolated alternative implementation.

## Phase 3: Implementation and Collaboration

Read `reference.md`, `target.md`, and `tokens.json` when present before writing
code.

### Generation Modes

| Mode | Use case | Execution |
|---|---|---|
| Simple | Single-page, static, image, or design-reference clone | One agent completes analysis, generation, and validation |
| Standard | Multiple components, responsive behavior, and basic interactions | Main agent owns implementation; use a specialist only when needed |
| Advanced | Multi-page, complex state, API, Canvas, 3D, or Electron work | Main agent owns architecture and integration; delegate independent modules |

Choose the lowest mode that can complete the task. Multi-agent delegation is
optional, not mandatory.

### Implementation Plan

Create `.layout-clone/implementation-plan.md` before modifying target files:

```yaml
implementation_plan:
  mode: "simple | standard | advanced"
  strategy: "full-clone | structure-upgrade | inspiration | interaction-first | image-visual-clone"
  target_area: "page or region"
  components: []
  files_to_create: []
  files_to_modify: []
  protected_files: []
  allowed_dependencies: []
  inferred_behavior: []
  unknowns: []
  validation_points:
    - "desktop screenshot"
    - "mobile screenshot"
```

### Generation Rules

1. Map reference findings to the target project's existing patterns.
2. Reuse existing components, hooks, utilities, assets, and tokens first.
3. Generate design variables and the page skeleton before detailed components.
4. Generate responsive styles and basic interactions before optional advanced modules.
5. Preserve APIs, authentication, routing, global state, and business logic by default.
6. Do not introduce dependencies unless explicitly approved.
7. Modify only files listed in the implementation plan.
8. Record inferred behavior separately from directly observed behavior.

### Delegation Rules

Only use delegation in Advanced mode or when independent modules justify it.
Each delegated agent must receive the implementation plan and shared context,
modify only assigned files, and report:

- Files created or modified
- Existing dependencies used
- Interface requirements for other modules
- Incomplete work and possible conflicts

The main agent owns final integration, conflict resolution, build checks, and
visual acceptance.

## Design Tokens

`tokens.json` is a structured summary of observed styles, not proof of the
reference project's original token source. Every exported token should contain
`$type` and `$value`. Do not force uncertain values into a token category.

After generation, check that:

- The JSON parses successfully.
- Every token has `$type` and `$value`.
- Colors, dimensions, fonts, typography, and shadows use consistent types.
- Uncertain or inferred values are documented.
- Third-party compatibility is described as “compatible to the extent verified,”
  not guaranteed without an actual import test.

## Phase 4: Validation

Validation must be executed, not merely checked off.

| Level | Mode | Required checks |
|---|---|---|
| Basic | Simple | Build, page loading, responsive layout, screenshots |
| Standard | Standard | Basic plus interactions, accessibility, performance, integration |
| Full | Advanced | Standard plus API, multi-page, animation, Canvas, 3D, or Electron checks |

### Runtime Checks

- Dependencies and build command work.
- The target page loads without new blocking errors.
- No unauthorized files or dependencies were changed.
- Routes, imports, and assets resolve correctly.
- Required loading, empty, and error states remain functional.

### Visual Checks

Capture at least:

- Desktop: `1440x900`
- Mobile: `375x812`

Compare the output with the reference image, reference screenshots, or the
structured reference analysis. Check layout skeleton, container width, spacing,
typography, colors, component dimensions, overflow, and responsive reflow.

After correcting visible issues, capture screenshots again. Write the result to
`.layout-clone/validation.md`:

```yaml
validation:
  viewports:
    - name: "desktop"
      size: "1440x900"
      screenshot: "path/to/desktop.png"
      status: "pass | needs-fix"
    - name: "mobile"
      size: "375x812"
      screenshot: "path/to/mobile.png"
      status: "pass | needs-fix"
  differences: []
  limitations: []
```

### Quality Checklist

- [ ] Semantic HTML and keyboard-accessible controls
- [ ] Images have meaningful alt text or are marked decorative
- [ ] Forms have associated labels and usable error states
- [ ] Responsive layout does not overflow or become unreadable
- [ ] Animations prefer transform and opacity where appropriate
- [ ] No unnecessary gradients, decoration, or repeated visual patterns
- [ ] Existing business logic and data contracts remain intact
- [ ] Imports, types, routes, and generated links are valid
- [ ] Remaining differences and unknowns are documented

Use these result states:

- `pass`: runnable, core layout and interactions verified
- `needs-fix`: visible, functional, or build issues remain
- `blocked`: external limitations prevent verification; document the reason

## Tool Fallbacks

| Missing capability | Fallback |
|---|---|
| Vision model | Screenshot dimensions, DOM, computed styles, and available visual inspection |
| Browser automation | Static source, assets, local build, and route analysis |
| Network interception | Request wrappers, public scripts, and visible data only |
| Multi-agent delegation | Main-agent sequential implementation |
| Screenshot comparison | Fixed-viewport screenshots plus DOM and computed-style comparison |

Tool limitations must be recorded in the relevant analysis or validation file.
Never claim exact fidelity or completed verification when the required evidence
was unavailable.

## Error Handling

- Missing reference path: report the exact missing path.
- Missing source code: use image or runtime analysis only and mark limitations.
- Incompatible stack: adapt to the target stack and explain the difference.
- Missing assets: preserve the layout with an explicit placeholder or request the asset.
- Complex behavior that cannot be observed: implement only observable behavior and mark the rest unknown.
- Protected business logic: do not modify without explicit authorization.
