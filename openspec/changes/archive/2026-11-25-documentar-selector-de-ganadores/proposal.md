# Proposal

## Why

El selector de ganadores ya existe y funciona (Ticket #1), pero su comportamiento solo está descrito en el código y en el ticket original. `openspec/specs/` está vacío, así que no hay un contrato escrito contra el cual revisar o extender la aplicación. Los próximos tickets (podio, cuenta regresiva) modificarán este comportamiento, y necesitamos una línea base explícita para saber qué se promete hoy y qué no debe romperse.

## What Changes

- Se documenta, como especificación, el comportamiento **actual** de la aplicación: no se cambia código de producción ni comportamiento observable.
- Se describen tres capacidades que ya existen:
  - gestión de participantes (agregar, validar, quitar, limpiar);
  - sorteo de un único ganador y presentación del resultado;
  - color base azul de la interfaz.
- Se registran como requisitos las reglas observadas en el código (normalización de nombres, duplicados sin distinguir mayúsculas, descarte del ganador al cambiar la lista).
- Se actualiza `AGENTS.md` para indicar que todo cambio nuevo se especifica primero con OpenSpec (criterio del Ticket #1 de la tarea 2).
- Fuera de alcance: varios ganadores, cuenta regresiva, persistencia o backend.

## Capabilities

### New Capabilities

- `participant-management`: alta, validación, eliminación y limpieza de la lista de participantes.
- `winner-draw`: sorteo aleatorio de un único ganador, estado del botón de sorteo y presentación destacada del resultado.
- `base-color-theme`: color base azul de la interfaz, definido por el desarrollador y no configurable por el usuario final.

### Modified Capabilities

<!-- Ninguna: openspec/specs/ está vacío. -->

## Impact

- **Código de producción**: ninguno (`src/` no cambia).
- **Especificaciones**: se crean `openspec/specs/participant-management/`, `openspec/specs/winner-draw/` y `openspec/specs/base-color-theme/` al archivar el cambio.
- **Documentación**: `AGENTS.md` suma la regla de especificar con OpenSpec antes de implementar.
- **Pruebas**: las existentes ya cubren estos comportamientos; solo se verifica que cada escenario especificado tenga una prueba y se añade la que falte.
