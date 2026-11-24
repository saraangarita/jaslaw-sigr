# Jaslaw + pipeline CI/CD · paquete completo

Proyecto listo para subir a `github.com/saraangarita/jaslaw-sigr`, con el pipeline ya integrado.

## Qué contiene

| Elemento | Estado |
| --- | --- |
| `src/App.jsx` | **Tu archivo, idéntico** (mismo hash MD5 que el de tu repo) |
| `src/styles.css` | **Tu archivo, idéntico** (1 727 líneas, descargado de tu repo) |
| `src/permissions.js` | Tu matriz + `export pagesByRole` + `nextRole` |
| `src/logic/*.js` | Lógica de negocio pura y testeable (nuevo) |
| `src/__tests__/*.test.js` | 36 pruebas (nuevo) |
| `.github/workflows/ci-cd.yml` | Pipeline CI/CD en GitHub Actions (nuevo) |
| `Dockerfile`, `nginx.conf`, `docker-compose.yml` | Empaquetado con Nginx y `/healthz` |
| `Jenkinsfile`, `code-quality/`, `dependabot.yml` | Equivalente Jenkins, SonarQube y dependencias |
| `eslint.config.js`, `vitest.config.js`, `scripts/` | Calidad, cobertura y presupuesto de rendimiento |
| `docs/evidencias/` | 9 registros de ejecución del pipeline |
| `package.json` / `package-lock.json` | Scripts nuevos; `vite` movido a devDependencies |

**No incluye** `node_modules/`, `dist/` ni `.git/`: tu historial de commits se conserva.

## Cómo aplicarlo sobre tu repositorio (3 pasos)

1. Descomprime el zip **dentro de `D:\jaslaw`** y acepta **reemplazar** los archivos existentes.
2. En PowerShell:

```powershell
cd D:\jaslaw
npm ci
npm run lint; npm run test; npm run build
git status
```

3. Si todo está verde:

```powershell
git add .
git commit -m "ci: integrar pipeline CI/CD con pruebas, lint, Docker y despliegue"
git push origin main
```

## Después del push

1. **Settings → Actions → General → Workflow permissions → “Read and write permissions” → Save**
2. Abre <https://github.com/saraangarita/jaslaw-sigr/actions>
3. Deben correr 6 jobs en 2-4 minutos.

## Importante sobre las evidencias

`docs/evidencias/*.log` son la salida real de este pipeline ejecutado en local. Para que lleven
**tu** fecha y **tu** commit, bórralos y vuelve a generarlos (con Git Bash):

```bash
bash scripts/pipeline-local.sh > docs/evidencias/08-pipeline-completo.log 2>&1
```

La evidencia más fuerte, de todas formas, serán las capturas de **tus** jobs en GitHub Actions.

## Antes de entregar: compréndelo

En la sustentación te van a preguntar por las etapas. Lo mínimo que debes poder explicar:

- **Lint**: detecta errores sin ejecutar la app (ESLint).
- **Test**: 36 pruebas sobre la lógica de pedidos, reservas, carta y permisos (Vitest).
- **Seguridad**: `npm audit` sobre dependencias de producción y Trivy sobre el artefacto.
- **Build**: Vite genera `dist/` y un script verifica que no exceda 600 KB de JS.
- **Docker**: imagen multi-etapa con Nginx, usuario sin privilegios y `/healthz`.
- **Deploy**: publica en staging solo desde `main` y verifica salud con un smoke test.
- **Gate**: si cualquier etapa falla, no hay despliegue. Eso es integración continua.
