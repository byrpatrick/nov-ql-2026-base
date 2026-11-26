# Spec Delta

## Purpose

Establece que la interfaz usa el azul como color base, definido por el desarrollador y no modificable por el usuario final.

## ADDED Requirements

### Requirement: Color base azul
La interfaz SHALL usar el azul como color base: títulos, botones principales, fondos de tarjetas y el bloque del ganador MUST derivar de una misma paleta azul definida de forma centralizada.

#### Scenario: Primera carga
- **WHEN** el usuario abre la aplicación
- **THEN** los elementos principales de la interfaz se muestran en tonos azules

#### Scenario: Resultado destacado
- **WHEN** se muestra el ganador
- **THEN** el bloque del resultado usa tonos de la paleta azul

### Requirement: El usuario final no elige el color
El sistema MUST NOT ofrecer ningún control para cambiar el color base; el color lo decide el desarrollador al construir la aplicación.

#### Scenario: Sin selector de color
- **WHEN** el usuario recorre la interfaz
- **THEN** no existe ningún control para elegir o cambiar el color

### Requirement: Foco visible con el color base
Los botones SHALL mostrar un indicador de foco visible, en el color base, cuando se navegan con el teclado.

#### Scenario: Navegación con teclado
- **WHEN** el usuario enfoca un botón con la tecla Tab
- **THEN** el botón muestra un contorno visible en el color base
