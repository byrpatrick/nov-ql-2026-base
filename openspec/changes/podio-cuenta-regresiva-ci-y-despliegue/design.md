# Design

## Context

El selector de ganadores actual (`src/lib/draw.ts`, `src/hooks/useWinnerPicker.ts` y `src/components/`) selecciona de inmediato a un único ganador cuando hay al menos 1 participante. Los Tickets #2, #3, #4 y #5 introducen cuatro evoluciones coordinadas:
1. **Guard rails en CI (Ticket #2):** linter y pruebas deterministas en GitHub Actions en cada `push` y `pull_request` a `main`.
2. **Podio de 1, 2 o 3 ganadores (Ticket #3):** regla `participantes >= N + 1` (un sorteo donde todos ganan no es un sorteo), ganadores distintos con igual probabilidad y vista de podio (🥇 centro más alto, 🥈 izquierda, 🥉 derecha).
3. **Cuenta regresiva 3 → 2 → 1 (Ticket #4):** 1 segundo entre cada número antes de revelar el ganador o podio, bloqueando controles durante la cuenta y omitiéndola si el sorteo es inválido.
4. **Despliegue en GitHub Pages (Ticket #5):** exportación estática de Next.js desplegada automáticamente al hacer `push` a `main` solo si CI pasa.

Consulta `proposal.md` para la motivación y alcance.

## Goals / Non-Goals

**Goals:**
- Mantener la lógica de sorteo 100 % pura, inmutable y determinista en `src/lib/draw.ts`.
- Representar el ciclo del sorteo (`idle` → `countdown (3..1)` → `result` o `error`) en `useWinnerPicker` sin estados redundantes y compatible con `jest.useFakeTimers()`.
- Permitir la exportación estática de Next.js (`output: "export"`) con soporte de `basePath` para GitHub Pages sin romper el desarrollo local ni las pruebas.

**Non-Goals:**
- Persistencia en servidor, base de datos o almacenamiento local (eso corresponde a la Tarea 3 opcional).
- Configurar más de 3 ganadores o duraciones de cuenta regresiva personalizables.

## Decisions

### 1. Selección aleatoria equiprobable de `N` ganadores distintos (`pickWinners`)
- **Decisión:** Implementar `pickWinners(participants, count, random = Math.random): readonly string[]` en `src/lib/draw.ts` mediante una copia del arreglo y un barajado parcial de Fisher-Yates de `count` pasos: en cada paso `i` (`0 <= i < count`), se elige un índice aleatorio uniforme entre `i` y `participants.length - 1` usando `random()`, y se intercambian las posiciones `i` e `index`. Si `participants.length <= count` o `count < 1`, devuelve `[]`.
- **Por qué:** Garantiza matemáticamente que ningún participante gane dos veces y que todos tengan exactamente la misma probabilidad (`1 / M`) de ocupar cualquier puesto del podio, manteniendo la pureza funcional e inyección de `random`.
- **Alternativas descartadas:** Elegir con `Math.random` en un bucle `while` rechazando repetidos (no es acotado en tiempo y complica las pruebas deterministas con secuencias fijas).

### 2. Validación de sorteo y mensaje de participantes insuficientes
- **Decisión:** Definir `ALLOWED_WINNER_COUNTS = [1, 2, 3] as const` y la función pura `getDrawError(participantCount, winnerCount): string | null` en `src/lib/draw.ts`. Cuando `participantCount < winnerCount + 1`, devuelve exactamente:
  `Se necesitan al menos ${winnerCount + 1} participantes para sortear ${winnerCount} ganador(es).`
  El botón «Sortear ganador» permanece habilitado mientras no haya una cuenta regresiva activa; al pulsarlo con participantes insuficientes (incluido 0 o `<= N`), **no** inicia la cuenta regresiva y muestra directamente el mensaje de error (cumpliendo Ticket #3 R1 y Ticket #4 R3).
- **Por qué:** Ticket #4 R3 exige explícitamente que, al intentar un sorteo inválido por participantes insuficientes, no se muestre la cuenta regresiva sino directamente el mensaje de error. Si el botón estuviera deshabilitado cuando faltan participantes, el usuario no podría disparar la acción ni ver el motivo al intentar sortear.
- **Alternativas descartadas:** Deshabilitar el botón «Sortear ganador» cuando `participants.length <= winnerCount` (impediría probar el flujo de Ticket #4 R3 al presionar «Sortear ganador»).

### 3. Máquina de estados de la cuenta regresiva en `useWinnerPicker`
- **Decisión:** En `useWinnerPicker`, añadir:
  - `winnerCount: WinnerCount` (por defecto `1`) y `setWinnerCount(count)`.
  - `winners: readonly string[]` (vacío cuando no hay resultado vigente).
  - `drawErrorMessage: string | null` (para el error de participantes insuficientes).
  - `countdown: number | null` (`3`, `2`, `1` durante la cuenta regresiva; `null` en reposo).
  Al invocar `draw()`:
  1. Si `countdown !== null`, no hace nada.
  2. Evalúa `getDrawError(participants.length, winnerCount)`. Si hay error, limpia `winners`, fija `drawErrorMessage` y retorna sin iniciar temporizador.
  3. Si es válido, limpia `winners` y `drawErrorMessage`, y fija `countdown = 3`.
  Un `useEffect` observa `countdown`:
  - Cuando `countdown` es `3` o `2`, programa un `setTimeout` de `1000` ms que decrementa a `countdown - 1`.
  - Cuando `countdown` es `1`, programa un `setTimeout` de `1000` ms que pone `countdown = null` y calcula `setWinners(pickWinners(participants, winnerCount, random))`.
  - Limpia el `timeout` en el cleanup del efecto.
  Mientras `countdown !== null` (`isCountingDown = true`), las acciones `addParticipant`, `removeParticipant`, `reset`, `setWinnerCount` y `draw` son ignoradas y los controles de UI reciben `disabled={isCountingDown}`.
  Al cambiar la lista de participantes o `winnerCount` (fuera de la cuenta regresiva), se limpian `winners` y `drawErrorMessage` (Ticket #3 R3).
- **Por qué:** Un único estado `countdown: number | null` evita estados booleanos duplicados, limpia automáticamente el `setTimeout` al desmontar y permite avanzar segundo a segundo en Jest con `jest.advanceTimersByTime(1000)`.

### 4. Exportación estática y GitHub Pages
- **Decisión:** Configurar `next.config.mjs` con `output: "export"` y `basePath: process.env.NEXT_PUBLIC_BASE_PATH || ""`. En el workflow `.github/workflows/ci-deploy.yml`:
  - Job `verify`: se ejecuta en todo `push` y en todo `pull_request` a `main`; corre `npm ci`, `npm run lint`, `npm run typecheck` y `npm test -- --ci --coverage`.
  - Job `deploy`: tiene `needs: verify` y `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`; construye con `NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}` y despliega el directorio `out/` a GitHub Pages mediante `actions/upload-pages-artifact` y `actions/deploy-pages`.
- **Por qué:** Garantiza que ningún despliegue ocurra si falla el linter o una prueba, que los `pull_request` nunca desplieguen y que los recursos estáticos carguen correctamente bajo `https://byrpatrick.github.io/nov-ql-2026-base/`.

## Risks / Trade-offs

- **[Cambio de regla en sorteo con 1 participante]** → El Ticket #1 permitía sortear con 1 solo participante, pero el Ticket #3 R1 establece que la cantidad de ganadores debe ser menor que el número de participantes (`Se necesitan al menos 2 participantes para sortear 1 ganador(es).`). Se actualiza la especificación `winner-draw` (`MODIFIED`) y las pruebas existentes para reflejar esta nueva regla de negocio.
- **[Temporizadores en pruebas de componentes]** → Las pruebas que ejecutan un sorteo válido deben avanzar los 3 segundos de la cuenta regresiva con `jest.useFakeTimers()` y `act(() => jest.advanceTimersByTime(3000))` para no esperar tiempo real ni producir advertencias de `act`.
