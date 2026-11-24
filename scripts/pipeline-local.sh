#!/usr/bin/env bash
# ============================================================
# Ejecución local del pipeline CI/CD de Jaslaw.
# Reproduce las etapas del workflow de GitHub Actions en un
# único comando, útil para validar antes de hacer push.
# Uso: bash scripts/pipeline-local.sh
# ============================================================
set -euo pipefail

BOLD=$'\e[1m'; GREEN=$'\e[32m'; RED=$'\e[31m'; CYAN=$'\e[36m'; OFF=$'\e[0m'
INICIO=$(date +%s)
TOTAL=0
FALLIDAS=0

etapa() {
  local nombre="$1"; shift
  TOTAL=$((TOTAL + 1))
  local t0=$(date +%s)
  printf "\n${CYAN}▶ ETAPA %s · %s${OFF}\n" "$TOTAL" "$nombre"
  if "$@"; then
    printf "${GREEN}✔ %s superada en %ss${OFF}\n" "$nombre" "$(( $(date +%s) - t0 ))"
  else
    printf "${RED}✘ %s FALLÓ${OFF}\n" "$nombre"
    FALLIDAS=$((FALLIDAS + 1))
    printf "${RED}Pipeline detenido en la etapa %s.${OFF}\n" "$TOTAL"
    exit 1
  fi
}

echo "============================================================"
echo " PIPELINE CI/CD · JASLAW · $(date '+%Y-%m-%d %H:%M:%S')"
echo " Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'sin repositorio git')"
echo " Node:   $(node -v) · npm: $(npm -v)"
echo "============================================================"

etapa "Dependencias (npm ci)"              npm ci --silent
etapa "Análisis estático (ESLint)"         npm run lint --silent
etapa "Pruebas unitarias + cobertura"      npm run test:coverage --silent
etapa "Auditoría de dependencias (prod)"   npm run audit:ci --silent
printf "${CYAN}· Auditoría informativa de dependencias de desarrollo (no bloqueante)${OFF}\n"
npm run audit:full 2>&1 | tail -3 || true
etapa "Compilación (Vite build)"           npm run build --silent
etapa "Presupuesto de rendimiento"         npm run check:bundle --silent

DURACION=$(( $(date +%s) - INICIO ))
echo
echo "============================================================"
printf "${GREEN}Pipeline completado: %s etapas en %ss${OFF}\n" "$TOTAL" "$DURACION"
echo "Artefacto generado: dist/  ($(du -sh dist | cut -f1))"
echo "============================================================"
