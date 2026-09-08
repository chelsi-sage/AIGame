import { Application, Graphics } from "pixi.js";
import { loadGameContent } from "./utils/load-game-content";

/**
 * Minimal PixiJS 8 scaffold.
 *
 * Deliberately contains no game mechanic: it only proves that the renderer,
 * the ticker and the resize handling all work. Replace the placeholder shape
 * once the competition theme is known.
 */

const PLACEHOLDER_SIZE = 160;

function setStatus(message: string, state: "ok" | "error" = "ok"): void {
  const status = document.querySelector<HTMLElement>("#status");
  if (!status) return;
  status.textContent = message;
  status.dataset["state"] = state;
}

async function start(): Promise<void> {
  const stage = document.querySelector<HTMLDivElement>("#stage");
  if (!stage) throw new Error("Missing #stage element in index.html");

  const app = new Application();
  await app.init({
    background: "#10131c",
    antialias: true,
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  stage.appendChild(app.canvas);

  // One visible placeholder shape, drawn around its own centre so that
  // positioning and rotation stay trivial.
  const placeholder = new Graphics()
    .roundRect(
      -PLACEHOLDER_SIZE / 2,
      -PLACEHOLDER_SIZE / 2,
      PLACEHOLDER_SIZE,
      PLACEHOLDER_SIZE,
      20,
    )
    .fill(0x4f7cff)
    .stroke({ width: 4, color: 0x9db6ff, alignment: 1 });
  app.stage.addChild(placeholder);

  const centre = (): void => {
    placeholder.position.set(app.screen.width / 2, app.screen.height / 2);
  };
  centre();
  app.renderer.on("resize", centre);

  // Slow spin: a liveness indicator for the ticker, not a mechanic.
  app.ticker.add((ticker) => {
    placeholder.rotation += 0.005 * ticker.deltaTime;
  });

  // Content is loaded but not yet used: it always resolves, empty on failure.
  const content = await loadGameContent();

  setStatus(
    `Game scaffold running — PixiJS 8 renderer active. ` +
      `Content loaded: ${content.items.length} item(s).`,
  );
}

start().catch((error: unknown) => {
  console.error(error);
  const detail = error instanceof Error ? error.message : String(error);
  setStatus(`Scaffold failed to start: ${detail}`, "error");
});
