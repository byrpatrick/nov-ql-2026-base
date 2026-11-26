# winner-draw Specification

## Purpose

Define el sorteo de un único ganador entre los participantes y cómo se presenta el resultado de forma clara y destacada.

## Requirements

### Requirement: Iniciar el sorteo
El sistema SHALL ofrecer el botón «Sortear ganador» para iniciar el sorteo. El botón MUST estar deshabilitado mientras no haya participantes.

#### Scenario: Sin participantes
- **WHEN** la lista está vacía
- **THEN** el botón «Sortear ganador» está deshabilitado

#### Scenario: Con participantes
- **WHEN** la lista tiene al menos un participante
- **THEN** el botón «Sortear ganador» está habilitado

### Requirement: Seleccionar un único ganador al azar
Al sortear, el sistema SHALL elegir exactamente un participante de la lista. Todos los participantes MUST tener la misma probabilidad de ganar y el ganador MUST pertenecer siempre a la lista.

#### Scenario: Sorteo con varios participantes
- **GIVEN** los participantes Ana, Pedro, María, Luis y Sofía
- **WHEN** el usuario presiona «Sortear ganador»
- **THEN** se muestra exactamente un ganador, que es uno de los cinco

#### Scenario: Un solo participante
- **GIVEN** que la lista contiene únicamente a «Ana»
- **WHEN** el usuario presiona «Sortear ganador»
- **THEN** el ganador es «Ana»

#### Scenario: Resultado distinto entre sorteos
- **WHEN** el usuario repite el sorteo con la misma lista
- **THEN** el ganador puede ser diferente en cada ejecución

### Requirement: Mostrar el ganador de forma destacada
El sistema SHALL mostrar el resultado en un bloque destacado con el texto «¡Tenemos un ganador!» seguido del nombre del ganador, y MUST anunciarlo a las tecnologías de apoyo como una región de estado.

#### Scenario: Resultado visible
- **WHEN** se realiza un sorteo y sale «María»
- **THEN** se muestra el bloque con «¡Tenemos un ganador!» y debajo «María»

#### Scenario: Antes de sortear
- **WHEN** todavía no se ha sorteado
- **THEN** no se muestra ningún bloque de resultado

### Requirement: Resultado vigente
El sistema MUST dejar de mostrar el ganador cuando cambia la lista de participantes: al agregar uno válido, al quitar uno o al limpiar la lista. Un intento de agregar rechazado (vacío o duplicado) SHALL NOT descartar el ganador, porque la lista no cambió.

#### Scenario: Agregar un participante
- **GIVEN** que se muestra un ganador
- **WHEN** el usuario agrega un participante válido
- **THEN** el ganador deja de mostrarse

#### Scenario: Quitar un participante
- **GIVEN** que se muestra un ganador
- **WHEN** el usuario quita a un participante
- **THEN** el ganador deja de mostrarse

#### Scenario: Limpiar la lista
- **GIVEN** que se muestra un ganador
- **WHEN** el usuario presiona «Limpiar lista»
- **THEN** el ganador deja de mostrarse y la lista queda vacía

#### Scenario: Intento rechazado
- **GIVEN** que se muestra un ganador
- **WHEN** el usuario intenta agregar un nombre duplicado
- **THEN** el ganador sigue mostrándose

### Requirement: Un único ganador y sin historial
El sistema SHALL seleccionar un solo ganador por sorteo y MUST NOT guardar resultados anteriores ni enviarlos a un servidor.

#### Scenario: Sorteo repetido
- **WHEN** el usuario sortea dos veces seguidas
- **THEN** solo se muestra el resultado del último sorteo
