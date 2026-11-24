# Jaslaw · Cocina cartagenera de autor

Prototipo académico del **sistema de gestión de pedidos y reservas** del restaurante Jaslaw
(Cartagena de Indias): autenticación simulada por roles, menú digital, pedidos, reservas,
caja y reportes.

## Módulos del sistema

| Módulo | Descripción |
| --- | --- |
| Autenticación por roles | Perfiles de demostración: Administrador, Mesero, Cliente (`src/permissions.js`) |
| Menú digital | Carta con categorías, precios, disponibilidad y administración de productos |
| Pedidos | Comanda, cantidades, totales y flujo de estados (Recibido → Entregado) |
| Reservas | Registro, validación de fecha/hora/personas y cambios de estado |
| Caja y reportes | Corte demostrativo, exportación CSV e indicadores |

## Ejecución local

```bash
npm ci          # instalar dependencias de forma reproducible
npm run dev     # servidor de desarrollo en http://localhost:5173
npm run build   # compilar a dist/
npm run preview # servir el artefacto compilado
```

## Calidad y CI/CD

```bash
npm run lint           # análisis estático (ESLint)
npm run test           # 36 pruebas unitarias (Vitest)
npm run test:coverage  # pruebas + cobertura con umbral mínimo de 80 %
npm run audit:ci        # auditoría de dependencias de producción
npm run check:bundle   # presupuesto de rendimiento del bundle
bash scripts/pipeline-local.sh   # reproduce el pipeline completo en local
```

El pipeline se ejecuta en **GitHub Actions** (`.github/workflows/ci-cd.yml`) y su equivalente
en **Jenkins** (`Jenkinsfile`). Etapas: lint → pruebas → seguridad → build → imagen Docker →
despliegue a staging → aprobación a producción.

## Estructura

```
src/
  App.jsx            # interfaz completa del sistema (roles, módulos y modales)
  main.jsx           # punto de entrada
  styles.css         # identidad visual (marfil, carbón, petróleo, latón)
  permissions.js     # control de acceso por rol
  logic/             # lógica de dominio pura y testeable
  __tests__/         # pruebas unitarias
```

> **Nota académica.** Los datos son de demostración y se guardan en `localStorage`.
> No hay backend, pagos reales ni facturación electrónica.
