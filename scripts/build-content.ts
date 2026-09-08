/**
 * Converts every CSV in content/ into JSON in public/data/.
 *
 * content/game-content.csv  ->  public/data/game-content.json
 *
 * Run with: pnpm content
 *
 * Deliberately does no validation yet — that is a later step. It only parses
 * and writes, so the shape of the JSON is whatever the spreadsheet says.
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT_DIR = join(ROOT, "content");
const OUTPUT_DIR = join(ROOT, "public", "data");

/**
 * Parses CSV text into rows of strings.
 *
 * Handles quoted fields, escaped quotes ("") and newlines inside quotes,
 * because Excel produces all three as soon as anyone types a comma.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  // Strip a UTF-8 BOM, which Excel likes to add.
  const input = text.replace(/^﻿/, "");

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);

    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  // Flush the final field/row when the file has no trailing newline.
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/** Turns rows into objects keyed by the header row. */
function toRecords(rows: string[][]): Record<string, string>[] {
  const [header, ...body] = rows;
  if (!header) return [];

  const keys = header.map((key) => key.trim());
  return body.map((cells) => {
    const record: Record<string, string> = {};
    keys.forEach((key, index) => {
      record[key] = (cells[index] ?? "").trim();
    });
    return record;
  });
}

async function main(): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(CONTENT_DIR)).filter(
    (file) => extname(file).toLowerCase() === ".csv",
  );

  if (files.length === 0) {
    console.warn("No CSV files found in content/");
    return;
  }

  for (const file of files) {
    const csv = await readFile(join(CONTENT_DIR, file), "utf8");
    const records = toRecords(parseCsv(csv));
    const outputName = `${basename(file, extname(file))}.json`;

    await writeFile(
      join(OUTPUT_DIR, outputName),
      `${JSON.stringify(records, null, 2)}\n`,
      "utf8",
    );

    console.log(`${file} -> public/data/${outputName} (${records.length} rows)`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
