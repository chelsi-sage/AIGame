
# AIGame

A game-jam project built with TypeScript, PixiJS 8 and Vite. Entirely
client-side, targeting modern desktop browsers.

## Getting started

Requires Node 20 or newer. The repository pins its pnpm version, so enable
Corepack once:

```bash
corepack enable pnpm
```

If that fails with a permissions error, it needs an elevated shell — or you can
skip it and prefix every command below with `corepack ` instead.

```bash
pnpm install
pnpm run dev
```

Then open the URL Vite prints, usually <http://localhost:5173/>.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm run dev` | Vite development server with hot reload |
| `pnpm run content:check` | Validate `public/data/game-content.json` |
| `pnpm run typecheck` | TypeScript check, emits nothing |
| `pnpm run build` | Production build into `dist/` |
| `pnpm run check` | Content check, then type check, then production build |

Run `pnpm run check` before opening a pull request. It stops at the first
failure and exits non-zero, so a green run means all three passed.

## Project layout

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
scripts/        build-time Node tooling, never shipped to the browser
```

## Runtime content

Runtime content lives in **`public/data/game-content.json`**.

A coder updates that file when the team agrees new content or balancing
changes. It is committed to the repository and edited by hand — nothing
generates it, and there is no import or conversion step.

Guidelines:

- Keep the structure game-specific and simple. Add the fields the game actually
  uses; avoid speculative shapes.
- Do not add a content-management framework, a schema-validation library, or a
  spreadsheet-to-JSON pipeline.
- Update the matching types in `src/types/game-content.ts` in the same change.
- Run `pnpm run content:check` after editing.

The runtime loader falls back safely when content is missing or malformed:
`src/utils/load-game-content.ts` checks the HTTP response, parses the JSON and
confirms the minimum structure. On any failure it logs one actionable error and
returns `{ items: [] }`, so bad content can never stop the game from starting.

### For non-programming contributors

You do not need to edit repository files, install anything, or use Git. Share
content ideas, wording, balancing changes and gameplay feedback in person or
through the team's shared working tools. A coder will enter agreed content into
the repository.

## Contributing

Everyone may create branches, commit and open pull requests. **Only Chelsi
merges pull requests into `main`.** Keep pull requests small and focused so they
are quick to review.
