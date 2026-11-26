# Spec Delta

## Purpose

Garantiza que cada cambio pase automáticamente por pruebas, verificación de tipos y linter en integración continua, y que cada versión válida en la rama principal se publique automáticamente en GitHub Pages.

## ADDED Requirements

### Requirement: Verificación automática en integración continua
El sistema SHALL ejecutar automáticamente el linter, la verificación de tipos y la suite de pruebas automáticas en un workflow de GitHub Actions en cada `push` y en cada `pull_request` dirigido a la rama `main`. Si cualquiera de las verificaciones falla, el workflow MUST terminar con estado de fallo.

#### Scenario: Verificación exitosa en un pull request
- **WHEN** se abre o actualiza un `pull_request` hacia `main` y tanto el linter como las pruebas pasan
- **THEN** el workflow de integración continua finaliza con éxito y sin ejecutar ningún despliegue

#### Scenario: Fallo en pruebas o linter
- **WHEN** se realiza un `push` o `pull_request` donde falla una prueba automática o el linter reporta errores
- **THEN** el workflow de integración continua finaliza con error y bloquea cualquier paso posterior

### Requirement: Cobertura mínima de pruebas automáticas en CI
La suite de pruebas ejecutada en CI MUST verificar de forma determinista la adición de participantes, la selección aleatoria de ganadores dentro de la lista, la imposibilidad de sortear con participantes insuficientes, la cuenta regresiva y la aplicación de la paleta del color base azul.

#### Scenario: Ejecución determinista de la suite completa
- **WHEN** se ejecuta el comando de pruebas en el entorno local o en CI
- **THEN** todas las pruebas se ejecutan sin depender del azar ni esperar segundos reales de reloj

### Requirement: Despliegue automático a GitHub Pages
El sistema SHALL construir la aplicación estática y desplegarla automáticamente en GitHub Pages en cada `push` a la rama `main`, únicamente después de que el linter y las pruebas automáticas hayan finalizado con éxito. Los eventos `pull_request` MUST NOT activar el despliegue.

#### Scenario: Publicación tras push válido en main
- **WHEN** se integra un cambio en la rama `main` y las verificaciones de linter y pruebas pasan
- **THEN** el workflow genera la exportación estática de la aplicación y la publica en GitHub Pages

#### Scenario: Bloqueo de despliegue si fallan las pruebas
- **WHEN** se realiza un `push` a `main` y alguna prueba o el linter falla
- **THEN** el trabajo de despliegue no se ejecuta y la versión publicada anteriormente permanece intacta

### Requirement: Funcionamiento completo en la URL publicada
La aplicación publicada en GitHub Pages SHALL funcionar en el subdirectorio del repositorio con todas sus capacidades de frontend (participantes, color base, podio y cuenta regresiva) y el enlace público MUST estar documentado en `README.md`.

#### Scenario: Acceso a la aplicación publicada
- **WHEN** un usuario abre la URL de GitHub Pages documentada en `README.md`
- **THEN** la interfaz carga con sus estilos en color base azul y permite agregar participantes, elegir cantidad de ganadores y sortear con cuenta regresiva
