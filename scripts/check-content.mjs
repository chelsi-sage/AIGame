/**
 * Minimum structural check for runtime content.
 *
 * Verifies only that public/data/game-content.json exists, is valid JSON, and
 * is an object with an `items` array. Nothing game-specific — that belongs
 * with the game, once we know what it is.
 *
 * Node built-ins only. Reads the file; never writes anything.
 *
 * Run with: pnpm run content:check
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const RELATIVE_PATH = "public/data/game-content.json";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const FILE = join(ROOT, "public", "data", "game-content.json");

/** Prints an actionable error naming the file, then exits non-zero. */
function fail(problem, fix) {
  console.error(`✗ ${RELATIVE_PATH}: ${problem}`);
  console.error(`  Fix: ${fix}`);
  process.exit(1);
}

let raw;
try {
  raw = await readFile(FILE, "utf8");
} catch (error) {
  if (error.code === "ENOENT") {
    fail("file not found", `create it containing {"items": []}`);
  }
  fail(`could not be read (${error.code ?? error.message})`, "check file permissions");
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch (error) {
  fail(`invalid JSON — ${error.message}`, "correct the JSON syntax");
}

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  const actual = parsed === null ? "null" : Array.isArray(parsed) ? "an array" : typeof parsed;
  fail(`top-level value is ${actual}, expected an object`, `wrap the content as {"items": [...]}`);
}

if (!("items" in parsed)) {
  fail(`missing required "items" property`, `add "items": [] to the top-level object`);
}

if (!Array.isArray(parsed.items)) {
  fail(`"items" is ${typeof parsed.items}, expected an array`, `change "items" to an array`);
}

console.log(`✓ ${RELATIVE_PATH} — valid (${parsed.items.length} item(s))`);
