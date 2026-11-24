/**
 * Presupuesto de rendimiento: falla el pipeline si el bundle excede el límite.
 * Umbral: 600 KB de JavaScript y 120 KB de CSS sin comprimir.
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const LIMITS = { js: 600 * 1024, css: 120 * 1024 };
const dir = "dist/assets";

function total(ext) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .reduce((sum, f) => sum + statSync(join(dir, f)).size, 0);
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
let failed = false;

for (const [ext, limit] of Object.entries(LIMITS)) {
  const size = total(`.${ext}`);
  const ok = size <= limit;
  if (!ok) failed = true;
  console.log(
    `[perf] ${ext.toUpperCase()}: ${kb(size)} / límite ${kb(limit)} → ${ok ? "OK" : "EXCEDIDO"}`,
  );
}

if (failed) {
  console.error("[perf] Presupuesto de rendimiento incumplido.");
  process.exit(1);
}
console.log("[perf] Presupuesto de rendimiento cumplido.");
