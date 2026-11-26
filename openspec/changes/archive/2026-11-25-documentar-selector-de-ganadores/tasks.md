# Tasks

## 1. Verificar y completar pruebas de participant-management

- [x] 1.1 Mapear cada escenario de `specs/participant-management/spec.md` a una prueba existente y listar los que no tengan; verificar que el mapa cubra los 9 requisitos.
- [x] 1.2 Agregar la prueba de componente «el botón Limpiar lista está deshabilitado con la lista vacía» en `src/components/WinnerPicker.test.tsx`; verificar que pasa con `npm test`.
- [x] 1.3 Si alguna prueba nueva de esta sección falla, tratarlo como bug: corregir primero con una prueba que lo reproduzca; verificar que la suite queda en verde.

## 2. Verificar y completar pruebas de winner-draw

- [x] 2.1 Mapear cada escenario de `specs/winner-draw/spec.md` a una prueba existente; verificar que los 5 requisitos tienen cobertura.
- [x] 2.2 Agregar pruebas para: botón «Sortear ganador» habilitado con participantes, ausencia del bloque de resultado antes de sortear, ganador descartado al agregar un participante válido y ganador conservado tras un intento rechazado; verificar que pasan con `npm test`.
- [x] 2.3 Si una prueba revela un comportamiento distinto al especificado, decidir con el equipo si se corrige el código o la spec y dejarlo anotado; verificar que spec y código quedan alineados.

## 3. Verificar base-color-theme

- [x] 3.1 Revisar `src/app/globals.css` y los CSS Modules: comprobar que todos los colores salen de variables CSS de la paleta azul y que no hay colores literales fuera de `globals.css`.
- [ ] 3.2 Comprobar con `npm run dev` que la interfaz se ve en azul, que el bloque del ganador usa la paleta y que el foco por teclado es visible; verificar que no existe ningún control para cambiar el color.

## 4. Documentar el flujo en AGENTS.md

- [x] 4.1 Agregar a `AGENTS.md` la regla «todo cambio nuevo se especifica primero con OpenSpec (`/openspec-propose`), luego se implementa y se archiva»; verificar que la regla aparece en el archivo y está en español.

## 5. Verificación integral

- [x] 5.1 Ejecutar `npm test -- --coverage`, `npm run lint`, `npm run typecheck` y `npm run build`; verificar que todos pasan y la cobertura se mantiene en al menos 80 %.
- [x] 5.2 Ejecutar `npx openspec validate documentar-selector-de-ganadores --strict`; verificar que el cambio valida sin errores ni advertencias.

## Workflow follow-up

- Archivar el cambio con `/openspec-archive-change` para crear `openspec/specs/participant-management/`, `openspec/specs/winner-draw/` y `openspec/specs/base-color-theme/`.
- Verificar con `npx openspec list --specs` que las tres capacidades quedaron registradas.
