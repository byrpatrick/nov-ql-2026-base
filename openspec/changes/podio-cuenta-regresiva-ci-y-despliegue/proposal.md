# Proposal

## Why

El selector de ganadores actual solo elige a un único ganador de forma inmediata y carece de verificaciones automáticas en CI y de publicación automática. Para los eventos de la comunidad necesitamos proteger cada cambio con pruebas y CI (Ticket #2), permitir sortear hasta 3 ganadores en formato de podio (Ticket #3), añadir suspenso con una cuenta regresiva de 3 a 1 antes de revelar el resultado (Ticket #4) y publicar automáticamente en GitHub Pages cada versión válida que llegue a `main` (Ticket #5).

## What Changes

- **Pruebas automáticas y CI (Ticket #2):**
  - Asegurar pruebas automáticas deterministas para todas las especificaciones vigentes (incluyendo la verificación de la paleta del color base azul).
  - Añadir un workflow de GitHub Actions que ejecute el linter, la verificación de tipos y las pruebas en cada `push` y en cada `pull_request` hacia `main`.
- **Podio de varios ganadores (Ticket #3):**
  - Permitir seleccionar la cantidad de ganadores: **1, 2 o 3** (por defecto **1**).
  - **BREAKING**: Exigir que la cantidad de ganadores `N` sea estrictamente menor que el número de participantes (mínimo `N + 1` participantes; un sorteo donde todos ganan no es un sorteo). Si no hay suficientes participantes, no se sortea y se muestra: `Se necesitan al menos {N + 1} participantes para sortear {N} ganador(es).`
  - Seleccionar `N` ganadores distintos con igual probabilidad para cualquier puesto.
  - Con 1 ganador, mantener la vista «¡Tenemos un ganador!»; con 2 o 3 ganadores, mostrar «¡Tenemos un podio!» con 🥇 1.er lugar al centro y más alto, 🥈 2.º lugar a la izquierda y 🥉 3.er lugar a la derecha (cuando `N = 3`), usando el color base azul.
  - Ocultar el resultado anterior cuando cambie la lista de participantes o la cantidad de ganadores.
- **Cuenta regresiva antes del resultado (Ticket #4):**
  - Al iniciar un sorteo válido, mostrar una cuenta regresiva grande y visible (**3 → 2 → 1**, con 1 segundo entre cada número) en el color base antes de revelar el ganador o el podio.
  - Durante la cuenta regresiva, ocultar cualquier resultado previo y deshabilitar el botón «Sortear ganador», la modificación de participantes y el selector de cantidad de ganadores.
  - Si el sorteo es inválido (participantes insuficientes), mostrar directamente el mensaje de error sin iniciar la cuenta regresiva.
- **Despliegue automático en GitHub Pages (Ticket #5):**
  - Configurar la exportación estática de Next.js (`output: "export"`) compatible con la ruta base del repositorio en GitHub Pages.
  - Desplegar automáticamente a GitHub Pages en cada `push` a `main` únicamente después de que pasen el linter y las pruebas; los `pull_request` solo ejecutan las verificaciones sin desplegar.
  - Documentar en `README.md` los comandos locales y el enlace a la aplicación publicada.

## Capabilities

### New Capabilities
- `ci-and-deployment`: Ejecución automática de linter y pruebas en GitHub Actions para cada `push` y `pull_request` a `main`, y despliegue automático a GitHub Pages en `push` a `main` condicionado al éxito de las verificaciones.

### Modified Capabilities
- `winner-draw`: Selección de 1, 2 o 3 ganadores distintos con igual probabilidad, validación de al menos `N + 1` participantes con mensaje de motivo, visualización de podio, cuenta regresiva de 3 a 1 segundo por paso con bloqueo de acciones y vigencia del resultado al cambiar participantes o cantidad de ganadores.
- `participant-management`: Bloqueo de las acciones de agregar, quitar y limpiar participantes mientras la cuenta regresiva del sorteo está en curso.
- `base-color-theme`: Aplicación de la paleta del color base azul al podio de ganadores y a la visualización destacada de la cuenta regresiva.

## Impact

- **Lógica de negocio (`src/lib/`):** `draw.ts` se amplía para seleccionar `N` ganadores distintos equiprobables (barajado parcial de Fisher-Yates con `random` inyectable) y validar la cantidad mínima de participantes (`N + 1`).
- **Estado y hooks (`src/hooks/useWinnerPicker.ts`):** Manejo de `winnerCount` (1 | 2 | 3), lista `winners`, error de sorteo por participantes insuficientes y temporizador de cuenta regresiva (`countdown`: `3 | 2 | 1 | null`).
- **Componentes (`src/components/`):** Selector de cantidad de ganadores, vista de cuenta regresiva, vista de podio en `WinnerResult` y bloqueo de controles durante la cuenta regresiva.
- **Configuración y CI/CD:** `next.config.mjs` con exportación estática, `.github/workflows/ci-deploy.yml` para verificación y despliegue en GitHub Pages, y actualización de `README.md`.
