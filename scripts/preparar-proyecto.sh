#!/usr/bin/env bash
# ============================================================
# Prepara un proyecto Jaslaw para ejecutar el pipeline CI/CD.
# Idempotente: se puede correr varias veces sin romper nada.
# Uso: bash scripts/preparar-proyecto.sh
# ============================================================
set -uo pipefail
G='\e[32m'; Y='\e[33m'; R='\e[31m'; C='\e[36m'; O='\e[0m'

echo -e "${C}== 1. Verificando entorno ==${O}"
command -v node >/dev/null || { echo -e "${R}Node.js no está instalado.${O}"; exit 1; }
echo "Node: $(node -v) · npm: $(npm -v)"
MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
[ "$MAJOR" -ge 18 ] || { echo -e "${R}Se requiere Node 18 o superior.${O}"; exit 1; }
echo -e "${G}OK${O}"

echo -e "\n${C}== 2. Instalando herramientas de calidad ==${O}"
npm install -D vitest@^2.1.8 @vitest/coverage-v8@^2.1.8 eslint@^9 @eslint/js@^9 \
  globals@^15 eslint-plugin-react@^7.37.2 || exit 1
echo -e "${G}OK${O}"

echo -e "\n${C}== 3. Asegurando scripts de package.json ==${O}"
node - <<'NODE'
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
const requeridos = {
  lint: "eslint .",
  test: "vitest run",
  "test:coverage": "vitest run --coverage",
  "check:bundle": "node scripts/check-bundle.mjs",
  "audit:ci": "npm audit --omit=dev --audit-level=high",
  "audit:full": "npm audit || true",
};
let cambios = 0;
for (const [k, v] of Object.entries(requeridos)) {
  if (p.scripts[k] !== v) { p.scripts[k] = v; cambios++; console.log(`  + ${k}`); }
}
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
console.log(cambios ? `  ${cambios} scripts añadidos` : "  scripts ya estaban definidos");
NODE

echo -e "\n${C}== 4. Verificando archivos del pipeline ==${O}"
faltan=0
for f in .github/workflows/ci-cd.yml eslint.config.js vitest.config.js \
         scripts/check-bundle.mjs Dockerfile nginx.conf .dockerignore; do
  if [ -f "$f" ]; then echo -e "  ${G}✔${O} $f"; else echo -e "  ${Y}✘ falta${O} $f"; faltan=$((faltan+1)); fi
done
[ "$faltan" -eq 0 ] || echo -e "${Y}Aviso: faltan $faltan archivos. Cópialos desde el proyecto de referencia.${O}"

echo -e "\n${C}== 5. Verificando lockfile (necesario para npm ci) ==${O}"
if [ -f package-lock.json ]; then echo -e "  ${G}✔${O} package-lock.json presente"; else
  echo -e "  ${Y}✘ falta; ejecuta npm install y commitea el lockfile${O}"; fi

echo -e "\n${C}== 6. Validación final ==${O}"
npm run lint && npm run test && npm run build
estado=$?
if [ $estado -eq 0 ]; then
  echo -e "\n${G}Proyecto listo. Siguiente paso: bash scripts/pipeline-local.sh${O}"
else
  echo -e "\n${R}Hay fallos. Revisa la salida anterior antes de continuar.${O}"
fi
exit $estado
