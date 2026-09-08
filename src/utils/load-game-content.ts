import type { GameContent } from "../types/game-content";

/**
 * Loads public/data/game-content.json from the deployed application.
 *
 * Never throws. Any failure — missing file, bad HTTP status, malformed JSON,
 * wrong top-level shape — logs one error and yields empty content, so the game
 * always starts.
 */

// BASE_URL keeps this correct once the app is deployed under a subpath.
// It is "/" during development, so this resolves to /data/game-content.json.
const CONTENT_URL = `${import.meta.env.BASE_URL}data/game-content.json`;

const EMPTY_CONTENT: GameContent = { items: [] };

/**
 * Minimum structural check: a non-null object with an items array.
 *
 * `unknown` here is the parse boundary, not a way to dodge typing — it forces
 * this narrowing before the data is treated as GameContent.
 */
function hasItemsArray(value: unknown): value is GameContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "items" in value &&
    Array.isArray(value.items)
  );
}

export async function loadGameContent(): Promise<GameContent> {
  try {
    const response = await fetch(CONTENT_URL);

    if (!response.ok) {
      console.error(
        `[content] ${CONTENT_URL} returned HTTP ${response.status}. ` +
          `Check the file exists in public/data/. Using empty content.`,
      );
      return EMPTY_CONTENT;
    }

    const parsed: unknown = await response.json();

    if (!hasItemsArray(parsed)) {
      console.error(
        `[content] ${CONTENT_URL} must be an object with an "items" array. ` +
          `Fix the file in public/data/. Using empty content.`,
      );
      return EMPTY_CONTENT;
    }

    return parsed;
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(
      `[content] Could not load or parse ${CONTENT_URL}: ${detail}. ` +
        `Using empty content.`,
    );
    return EMPTY_CONTENT;
  }
}
