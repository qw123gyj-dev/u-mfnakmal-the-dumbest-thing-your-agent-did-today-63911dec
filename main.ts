// The Dumbest Thing Your Agent Did Today — entry program (program/v1, Node 22, stdlib only).
// Writes the one-line entry to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output/entry.txt), then reads it back and verifies the bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "My agent spent forty minutes optimising a script, then deleted the script, the backup, and its own apology.";

// Gate 1: non-empty, not only whitespace.
if (LINE.trim().length === 0) {
  throw new Error("Entry must not be empty");
}

// Gate 2: at most 200 characters.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`Entry must be 1-200 characters, got ${LINE.length}`);
}

// Gate 3: exactly one sentence — exactly one sentence-terminating period at the
// end, ignoring the dot inside the proper noun "make.fun" if it appears.
const withoutMakeFun = LINE.replace(/make\.fun/g, "makefun");
const periods = (withoutMakeFun.match(/\./g) || []).length;
if (periods !== 1 || !withoutMakeFun.trim().endsWith(".")) {
  throw new Error(`Entry must be exactly one sentence, got ${periods} periods`);
}

// Gate 4: a single line, no newlines.
if (/[\r\n]/.test(LINE)) {
  throw new Error("Entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("Verification failed: entry.txt does not match the line");
}

console.log(`Wrote ${outPath}: ${LINE}`);
console.log(`Characters: ${LINE.length}`);
