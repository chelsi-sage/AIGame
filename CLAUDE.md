# AIGame — working agreements

A two-hour game jam, 3–5 coders, limited Claude credits. Keep changes small,
focused and easy to review.

**North star: if forced to choose between a playable game and better
architecture, choose the playable game.**

## Priorities, in order

1. Complete playable gameplay loop
2. Correct core mechanic
3. Easy content integration
4. Clear and responsive player feedback
5. Visual polish
6. Audio — only if explicitly re-scoped after the game is playable
7. Stretch functionality

There is no audio requirement for the MVP.

## Stack

TypeScript · PixiJS 8 · Vite · pnpm · plain CSS outside the canvas.
Entirely client-side, modern desktop browsers, deployed to GitHub Pages.

**Do not introduce:** a backend, a database, a runtime network service, React,
Vue, an ECS framework, a state-management framework, or any other major
architectural dependency. If a UI framework becomes genuinely necessary, use
Svelte — and not before.

Prefer zero new dependencies. Justify any addition against the priorities above.

## Commands

```
pnpm run dev            # Vite dev server
pnpm run content:check  # validate public/data/game-content.json
pnpm run typecheck      # tsc --noEmit
pnpm run build          # production build
pnpm run check          # content check, then typecheck, then build
```

Run `pnpm run check` before opening a pull request.

Note: if `pnpm` is not on PATH, prefix commands with `corepack ` — the Corepack
shim install needs an elevated shell.

## Runtime content

Runtime content lives in `public/data/game-content.json`.

- A coder updates that file when the team agrees new content or balancing
  changes. It is source-controlled, hand-edited, and never generated.
- Keep the structure game-specific and simple. Add the fields the game actually
  uses, nothing speculative.
- **Do not add a content-management framework**, a schema-validation library, a
  CSV pipeline, or a generic content abstraction.
- The runtime loader must fall back safely when content is missing or malformed:
  see `src/utils/load-game-content.ts`, which logs one actionable error and
  returns `{ items: [] }` so the game always starts.
- Types live in `src/types/game-content.ts`. Update them alongside the JSON.

Non-programming contributors provide content and feedback in person or through
the team's shared working tools. They do not need to edit repository files.

## Layout

```
src/main.ts     application entry point
src/game/       core game state and rules
src/scenes/     top-level screens
src/systems/    per-frame behaviour acting on game state
src/ui/         anything the player reads or clicks
src/types/      shared types, including content shapes
src/utils/      small stateless helpers
public/data/    runtime content JSON
public/assets/  static images and audio
scripts/        build-time Node tooling, never shipped
```

## Branching

Everyone branches, commits and opens pull requests. **Only Chelsi merges into
`main`.** Keep pull requests small enough to review in a couple of minutes.
