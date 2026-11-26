# AGENTS.md — Reglas del proyecto

Selector de ganadores: aplicación **solo frontend** con **Next.js (App Router) + TypeScript**, pruebas con **Jest + Testing Library**.

Estas reglas son obligatorias para cualquier asistente de IA que modifique este repositorio. Responde y documenta en **español** (código e identificadores en inglés, salvo textos de UI).

## Stack y comandos

| Comando | Para qué |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (http://localhost:3000) |
| `npm test` | Pruebas con Jest |
| `npm run typecheck` | Verificación de tipos (`tsc --noEmit`) |
| `npm run build` | Build de producción |

Antes de dar una tarea por terminada deben pasar: **pruebas, typecheck, linter y build**.

## 1. TDD (Test-Driven Development)

- Ciclo obligatorio **Red → Green → Refactor**: escribe primero una prueba que falle, luego el código mínimo para pasarla y después refactoriza.
- Toda funcionalidad nueva y todo bug corregido lleva una prueba (en un bug, primero la prueba que lo reproduce).
- Las pruebas se ubican junto al código: `foo.ts` → `foo.test.ts`, `Foo.tsx` → `Foo.test.tsx`.
- Prueba **comportamiento observable**, no detalles de implementación. En componentes usa Testing Library con consultas por rol/etiqueta (`getByRole`, `getByLabelText`) y `userEvent`.
- Las pruebas deben ser deterministas: inyecta o simula la aleatoriedad (`random` inyectable, `jest.spyOn(Math, "random")`), tiempo y cualquier efecto externo.
- Estructura Arrange–Act–Assert; un concepto por prueba; nombres descriptivos en español.

## 2. Cobertura de pruebas

- Cobertura mínima de **80 %** (líneas, funciones, ramas y sentencias) sobre el código en `src/`.
- Configura el umbral en Jest (`coverageThreshold`) y ejecútalo con `npm test -- --coverage`; si baja del 80 %, la tarea no está terminada.
- No inflar la cobertura con pruebas sin aserciones. La cobertura es un piso, no el objetivo.

## 3. Programación funcional

- Prefiere **funciones puras**: misma entrada → misma salida, sin efectos secundarios.
- **Inmutabilidad**: no mutes argumentos ni estado; devuelve copias (`map`, `filter`, spread). Usa `const` y `readonly` cuando aplique.
- Compón funciones pequeñas en lugar de usar bucles imperativos con estado mutable.
- Aísla los efectos (aleatoriedad, I/O, DOM) en los bordes y pásalos como dependencias (ej. `pickWinner(participants, random = Math.random)`).
- La lógica de negocio vive en `src/lib/` como funciones puras, sin depender de React.

## 4. Principios SOLID

- **S** — Responsabilidad única: cada módulo, función o componente tiene una sola razón para cambiar (lógica en `lib/`, presentación en `components/`).
- **O** — Abierto/cerrado: extiende comportamiento por composición o parámetros, no editando código estable.
- **L** — Sustitución de Liskov: los tipos/implementaciones intercambiables deben respetar el contrato original.
- **I** — Segregación de interfaces: props y tipos pequeños y específicos; no pases objetos enormes si solo usas un campo.
- **D** — Inversión de dependencias: depende de abstracciones (funciones/tipos inyectados), no de implementaciones concretas.

## 5. Clean Code

- **Nombres** claros y que revelen intención; sin abreviaturas crípticas. Booleanos como `isX` / `hasX`.
- **Funciones pequeñas**, de una sola tarea y con pocos parámetros (≤ 3; si hay más, usa un objeto).
- **DRY** y **KISS**: elimina duplicación, no sobre-ingenies. Aplica YAGNI: no agregues funcionalidad que nadie pidió.
- Sin números/cadenas mágicas: usa constantes con nombre.
- Evita comentarios que expliquen *qué* hace el código; refactoriza para que sea evidente. Comenta solo el *porqué*.
- Retornos tempranos (guard clauses) en lugar de anidación profunda.
- Sin código muerto, `console.log` ni `TODO` sin ticket asociado.
- Manejo de errores explícito; nunca silencies excepciones.

## 6. Componentes

- La UI se construye con **componentes pequeños, reutilizables y componibles**; un componente por archivo, nombrado en `PascalCase`.
- Divide componentes que crezcan o mezclen responsabilidades (formulario, lista, resultado, etc.) en subcomponentes.
- Componentes de presentación **sin lógica de negocio**: reciben datos y callbacks por props; la lógica va en `src/lib/` o en hooks personalizados (`useX`).
- Props tipadas con `interface`/`type` explícitos; sin `any`.
- Estilos con CSS Modules junto al componente (`Foo.module.css`); los colores salen de variables CSS (`globals.css`).
- Accesibilidad: HTML semántico, `label` en los inputs, `aria-*` donde corresponda, foco visible.

## 7. Linters y formato

- Usa **ESLint** con `eslint-config-next` (reglas `core-web-vitals` y TypeScript) y **Prettier** para el formato.
- Scripts esperados: `npm run lint` y `npm run format`. El código debe pasar el linter **sin errores ni warnings**.
- No desactives reglas con `eslint-disable` sin una justificación escrita en el mismo lugar.
- TypeScript en modo `strict`; prohibido `any` implícito/explícito y `@ts-ignore`.

## 8. Buenas prácticas de Next.js

- Usa **App Router** (`src/app/`). Los **Server Components son el valor por defecto**; agrega `"use client"` solo en componentes que necesiten estado, efectos o eventos, y mantenlo lo más abajo posible en el árbol.
- Define `metadata` en `layout.tsx`/`page.tsx` para título y descripción; `lang="es"` en `<html>`.
- Usa los componentes y utilidades de Next cuando aplique (`next/image`, `next/link`, `next/font`) en lugar de equivalentes nativos.
- Esta app es solo frontend: no crees API routes, Server Actions ni acceso a base de datos sin un ticket que lo pida.
- Alias de importación `@/` para `src/`; sin rutas relativas largas (`../../..`).
- No expongas secretos; solo variables `NEXT_PUBLIC_*` para valores públicos.
- Cuida rendimiento: evita re-renders innecesarios y dependencias pesadas.

## 9. Buenas prácticas de React

- Solo **componentes funcionales y hooks**; nada de clases.
- Respeta las reglas de los hooks y las dependencias de `useEffect`/`useMemo`/`useCallback`. Evita `useEffect` cuando el valor se pueda **derivar** durante el render.
- **Estado mínimo**: no guardes en estado lo que se puede calcular; eleva el estado solo hasta el ancestro común más cercano.
- **Inmutabilidad** al actualizar estado (nuevas referencias, nunca mutar).
- `key` estable y única en listas; evita usar el índice si los elementos pueden reordenarse o eliminarse.
- Componentes controlados para formularios.
- Memoiza (`memo`, `useMemo`, `useCallback`) solo con un problema de rendimiento medido.

## 10. Git y entrega

- Una rama por ticket (`feat/ticket-N-descripcion`) y PR con descripción: resumen, criterios de aceptación, cómo probar y verificación.
- Commits pequeños y descriptivos (Conventional Commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`).
- No subas `node_modules/`, `.next/`, `coverage/` ni secretos.
- Si falta una decisión de diseño que cambie el resultado (por ejemplo el color base de la interfaz), **pregunta al desarrollador antes de generar** en lugar de asumir.

## 11. Estructura del proyecto

```
src/
  app/          # Rutas, layout y estilos globales (App Router)
  components/   # Componentes React (+ .module.css y .test.tsx)
  lib/          # Lógica pura de negocio (+ .test.ts)
```
