# Tasks

## 1. Lógica pura de sorteo múltiple y validación (Ticket #3)

- [x] 1.1 Escribir pruebas unitarias en `src/lib/draw.test.ts` (Red) para `ALLOWED_WINNER_COUNTS`, `getDrawError(participantCount, winnerCount)` y `pickWinners(participants, count, random)` (1, 2 y 3 ganadores distintos, equiprobabilidad e insuficiencia de participantes `< N + 1`), y verificar que fallan inicialmente con `npx jest src/lib/draw.test.ts`.
- [x] 1.2 Implementar `ALLOWED_WINNER_COUNTS`, `WinnerCount`, `getDrawError` y `pickWinners` (barajado parcial de Fisher-Yates inmutable) en `src/lib/draw.ts` (Green) y verificar que `npx jest src/lib/draw.test.ts` pasa al 100 %.

## 2. Hook `useWinnerPicker` con podio y cuenta regresiva (Tickets #3 y #4)

- [x] 2.1 Actualizar y ampliar `src/hooks/useWinnerPicker.test.ts` con `jest.useFakeTimers()` (Red) para probar `winnerCount` (1, 2, 3), error `drawErrorMessage` sin cuenta regresiva cuando `participants.length < winnerCount + 1`, cuenta regresiva `3 → 2 → 1 → winners` de 1 segundo por paso, bloqueo de acciones durante la cuenta regresiva y limpieza del resultado al cambiar participantes o `winnerCount`; verificar que falla inicialmente.
- [x] 2.2 Implementar en `src/hooks/useWinnerPicker.ts` el estado `winnerCount`, `winners`, `drawErrorMessage`, `countdown` (`3 | 2 | 1 | null`) y el efecto de temporizador de 1 segundo por paso (Green), verificando que `npx jest src/hooks/useWinnerPicker.test.ts` pasa sin advertencias.

## 3. Componentes de podio, cuenta regresiva y bloqueo de controles (Tickets #2, #3 y #4)

- [x] 3.1 Actualizar pruebas y componentes de participantes (`ParticipantForm.test.tsx`, `ParticipantForm.tsx`, `ParticipantList.test.tsx`, `ParticipantList.tsx`) para aceptar `disabled?: boolean` durante la cuenta regresiva, y verificar que pasan con `npx jest src/components/ParticipantForm.test.tsx src/components/ParticipantList.test.tsx`.
- [x] 3.2 Actualizar `src/components/WinnerResult.test.tsx` y `src/components/WinnerResult.tsx` (+ `WinnerResult.module.css`) para mostrar «¡Tenemos un ganador!» con 1 ganador y «¡Tenemos un podio!» con 2 o 3 ganadores (🥇 1.er lugar al centro y más alto, 🥈 2.º a la izquierda, 🥉 3.er a la derecha) en la paleta azul, verificando con `npx jest src/components/WinnerResult.test.tsx`.
- [x] 3.3 Crear componente `WinnerCountdown` y selector de cantidad de ganadores (o integrarlos en `WinnerPicker`), actualizando `src/components/WinnerPicker.test.tsx` y `src/components/WinnerPicker.tsx` (+ CSS Modules) para cubrir selección de 1/2/3 ganadores, cuenta regresiva 3-2-1, bloqueo de controles durante la cuenta y mensaje de error sin cuenta en sorteo inválido; verificar con `npx jest src/components/WinnerPicker.test.tsx`.
- [x] 3.4 Agregar una prueba automática en `src/app/theme.test.ts` que verifique que `src/app/globals.css` define las variables de la paleta azul base y que ningún CSS Module usa colores literales fuera de `globals.css`; verificar con `npx jest src/app/theme.test.ts`.

## 4. Exportación estática, GitHub Actions CI y despliegue en GitHub Pages (Tickets #2 y #5)

- [x] 4.1 Configurar `next.config.mjs` con `output: "export"` y `basePath` dinámico (`process.env.NEXT_PUBLIC_BASE_PATH || ""`), y verificar que `npm run build` genera el directorio estático `out/`.
- [x] 4.2 Crear el workflow `.github/workflows/ci-deploy.yml` que ejecute linter, verificación de tipos y pruebas en cada `push` y `pull_request` hacia `main`, y despliegue `out/` a GitHub Pages únicamente en `push` a `main` si el job de verificación pasa; verificar la sintaxis del archivo YAML y sus condiciones `on`, `needs` e `if`.
- [x] 4.3 Actualizar `README.md` con la documentación de los comandos de pruebas, linter, cobertura y el enlace a la aplicación publicada en GitHub Pages (`https://byrpatrick.github.io/nov-ql-2026-base/`); verificar que el documento incluye todas las secciones requeridas.

## 5. Verificación integral

- [x] 5.1 Ejecutar `npm run format`, `npm run lint`, `npm run typecheck`, `npm test -- --ci --coverage` y `npm run build`; verificar que todos los comandos terminan con código 0 y cobertura `>= 80 %` en `src/`.
- [x] 5.2 Ejecutar `npx openspec validate podio-cuenta-regresiva-ci-y-despliegue --strict`; verificar que el cambio es válido sin errores ni advertencias.

## Workflow follow-up

- Archivar el cambio con `/openspec-archive-change` una vez completadas y verificadas las tareas.
- Verificar en GitHub Actions que el workflow pasa en el PR y despliega en GitHub Pages al fusionar en `main`.
