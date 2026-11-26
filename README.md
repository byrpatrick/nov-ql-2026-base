# Selector de ganadores — Coding Dojo

Proyecto base para el Coding Dojo de desarrollo asistido por IA.

Viene casi vacío a propósito: la aplicación la generas tú, con ayuda de la IA.

## Requisitos

- Node.js **22.20.0** o superior
- Un asistente de código: OpenCode, Claude Code, Codex o GitHub Copilot
- GitHub CLI (`gh`) y una cuenta de GitHub

## Instrucciones

Los tickets de cada reto están en [`instrucciones/`](instrucciones/):

| Reto | Carpeta | Tema |
| --- | --- | --- |
| #1 | [`tarea-1/`](instrucciones/tarea-1/) | Vibe coding: generar el selector de ganadores |
| #2 | [`tarea-2/`](instrucciones/tarea-2/) | Guard rails y Spec Driven Development |
| #3 | [`tarea-3-optional/`](instrucciones/tarea-3-optional/) | Backend e historial _(opcional)_ |

## Primeros pasos

```sh
npm install
npx openspec --version
```

## Aplicación publicada (GitHub Pages)

La aplicación se despliega automáticamente en GitHub Pages con cada `push` a `main` que pase el linter y las pruebas:

- **URL en producción:** https://byrpatrick.github.io/nov-ql-2026-base/

## Ejecutar la aplicación, pruebas y linter localmente

Next.js (App Router) + TypeScript, pruebas con Jest + Testing Library. Color base de la interfaz: **azul**.

```sh
npm install
npm run dev                  # servidor de desarrollo en http://localhost:3000
npm test                     # ejecutar todas las pruebas automáticas con Jest
npm test -- --coverage       # ejecutar pruebas y verificar cobertura (>= 80 %)
npm run lint                 # ejecutar ESLint (sin errores ni warnings)
npm run typecheck            # verificación de tipos con TypeScript
npm run format               # formatear código con Prettier
npm run build                # generar exportación estática en out/
```

## ¿Qué incluye?

| Archivo / carpeta | Para qué sirve |
| --- | --- |
| `AGENTS.md` | Las reglas del proyecto para la IA. **Está vacío: lo llenas tú.** |
| `CLAUDE.md` | Hace que Claude Code lea `AGENTS.md`. |
| `openspec/` | Especificaciones del proyecto con [OpenSpec](https://github.com/Fission-AI/OpenSpec). |
| `.agents/skills/`, `.claude/skills/` | Comandos de OpenSpec para OpenCode, Claude Code, Codex y GitHub Copilot. |
| `instrucciones/` | Los tickets de cada reto. |

## Flujo con OpenSpec

Desde tu agente de IA:

1. `/openspec-propose <cambio>` — crea la propuesta, las specs y las tareas
   (en Codex: `$openspec-propose`)
2. Revisa la propuesta
3. `/openspec-apply-change` — implementa el cambio
4. `/openspec-archive-change` — actualiza `openspec/specs/`

Las especificaciones se escriben en español (ver `openspec/config.yaml`).
