# Spec Delta

## ADDED Requirements

### Requirement: Elegir cantidad de ganadores
El sistema SHALL permitir al usuario elegir la cantidad de ganadores entre **1, 2 o 3**, con **1** como valor por defecto.

#### Scenario: Valor por defecto al iniciar
- **WHEN** el usuario abre la aplicación
- **THEN** la cantidad de ganadores seleccionada por defecto es 1

#### Scenario: Cambiar la cantidad de ganadores
- **WHEN** el usuario selecciona 2 o 3 ganadores
- **THEN** la cantidad seleccionada queda activa para el siguiente sorteo

### Requirement: Validar participantes suficientes para el sorteo
La cantidad de ganadores `N` MUST ser estrictamente menor que el número de participantes (al menos `N + 1` participantes). Si al presionar «Sortear ganador» hay menos de `N + 1` participantes, el sistema MUST NOT iniciar la cuenta regresiva ni elegir ganadores, y SHALL mostrar el mensaje `Se necesitan al menos {N + 1} participantes para sortear {N} ganador(es).`.

#### Scenario: Participantes insuficientes para 1 ganador
- **GIVEN** que la cantidad de ganadores es 1 y hay menos de 2 participantes
- **WHEN** el usuario presiona «Sortear ganador»
- **THEN** no se muestra la cuenta regresiva y se muestra «Se necesitan al menos 2 participantes para sortear 1 ganador(es).»

#### Scenario: Participantes insuficientes para 3 ganadores
- **GIVEN** que hay 3 participantes y la cantidad de ganadores seleccionada es 3
- **WHEN** el usuario presiona «Sortear ganador»
- **THEN** no se muestra la cuenta regresiva y se muestra «Se necesitan al menos 4 participantes para sortear 3 ganador(es).»

### Requirement: Mostrar podio para múltiples ganadores
Cuando el sorteo elige a 2 o 3 ganadores y finaliza la cuenta regresiva, el sistema SHALL mostrar el encabezado «¡Tenemos un podio!» y presentar a los ganadores en forma de podio usando el color base: 🥇 1.er lugar en el centro y más alto, 🥈 2.º lugar a la izquierda y, cuando hay 3 ganadores, 🥉 3.er lugar a la derecha.

#### Scenario: Podio de 3 ganadores
- **GIVEN** 5 participantes y cantidad de ganadores igual a 3
- **WHEN** el usuario presiona «Sortear ganador» y finaliza la cuenta regresiva
- **THEN** se muestra «¡Tenemos un podio!» con el 1.er lugar en el centro y más alto, el 2.º lugar a la izquierda y el 3.er lugar a la derecha

#### Scenario: Podio de 2 ganadores
- **GIVEN** 3 participantes y cantidad de ganadores igual a 2
- **WHEN** el usuario presiona «Sortear ganador» y finaliza la cuenta regresiva
- **THEN** se muestra «¡Tenemos un podio!» con el 1.er lugar en el centro y más alto y el 2.º lugar a la izquierda, sin 3.er lugar

### Requirement: Cuenta regresiva antes de mostrar ganadores
Al iniciar un sorteo válido, el sistema SHALL mostrar una cuenta regresiva grande y visible de **3 a 1**, con **un segundo** entre cada número, usando el color base de la aplicación. Los ganadores MUST mostrarse únicamente al terminar el segundo del número 1.

#### Scenario: Secuencia 3, 2, 1 antes del resultado
- **GIVEN** una lista con participantes suficientes para la cantidad de ganadores seleccionada
- **WHEN** el usuario presiona «Sortear ganador»
- **THEN** se muestra inmediatamente el número 3, tras 1 segundo el 2, tras otro segundo el 1 y tras 1 segundo más se muestra el resultado

### Requirement: Bloqueo durante la cuenta regresiva
Mientras la cuenta regresiva esté en curso, el sistema MUST ocultar cualquier resultado anterior, MUST deshabilitar el botón «Sortear ganador» y MUST impedir modificar la lista de participantes o la cantidad de ganadores.

#### Scenario: Controles deshabilitados y resultado previo oculto durante la cuenta
- **GIVEN** un sorteo previo visible en pantalla
- **WHEN** el usuario presiona «Sortear ganador» y la cuenta regresiva está en 3, 2 o 1
- **THEN** el resultado anterior deja de mostrarse y los controles de sortear, cantidad de ganadores y participantes permanecen deshabilitados hasta que termine la cuenta

## MODIFIED Requirements

### Requirement: Iniciar el sorteo
El sistema SHALL ofrecer el botón «Sortear ganador» para iniciar el sorteo. El botón MUST estar deshabilitado mientras la cuenta regresiva esté en curso; cuando se presiona sin participantes suficientes, SHALL informar el motivo sin iniciar la cuenta regresiva.

#### Scenario: Sin participantes
- **WHEN** la lista está vacía y el usuario presiona «Sortear ganador»
- **THEN** no se inicia la cuenta regresiva y se muestra «Se necesitan al menos 2 participantes para sortear 1 ganador(es).»

#### Scenario: Con participantes
- **WHEN** la lista tiene al menos `N + 1` participantes y no hay cuenta regresiva activa
- **THEN** el botón «Sortear ganador» está habilitado e inicia la cuenta regresiva al presionarlo

### Requirement: Seleccionar un único ganador al azar
Al sortear con `N` ganadores configurados (1, 2 o 3) y al menos `N + 1` participantes, el sistema SHALL elegir exactamente `N` participantes todos distintos de la lista. Todos los participantes MUST tener la misma probabilidad de ganar cualquier lugar y todo ganador MUST pertenecer siempre a la lista.

#### Scenario: Sorteo con varios participantes
- **GIVEN** los participantes Ana, Pedro, María, Luis y Sofía y una cantidad `N` de ganadores (1, 2 o 3)
- **WHEN** el usuario presiona «Sortear ganador» y concluye la cuenta regresiva
- **THEN** se muestran exactamente `N` ganadores distintos entre sí y todos pertenecen a los cinco participantes

#### Scenario: Un solo participante
- **GIVEN** que la lista contiene únicamente a «Ana»
- **WHEN** el usuario presiona «Sortear ganador»
- **THEN** no se realiza el sorteo y se muestra «Se necesitan al menos 2 participantes para sortear 1 ganador(es).»

#### Scenario: Resultado distinto entre sorteos
- **WHEN** el usuario repite el sorteo con la misma lista
- **THEN** los ganadores seleccionados pueden ser diferentes en cada ejecución

### Requirement: Mostrar el ganador de forma destacada
Cuando la cantidad de ganadores es 1 y termina la cuenta regresiva, el sistema SHALL mostrar el resultado en un bloque destacado con el texto «¡Tenemos un ganador!» seguido del nombre del ganador, y MUST anunciarlo a las tecnologías de apoyo como una región de estado.

#### Scenario: Resultado visible
- **WHEN** se realiza un sorteo de 1 ganador, termina la cuenta regresiva y sale «María»
- **THEN** se muestra el bloque con «¡Tenemos un ganador!» y debajo «María»

#### Scenario: Antes de sortear
- **WHEN** todavía no se ha sorteado o la cuenta regresiva aún no ha terminado
- **THEN** no se muestra ningún bloque de resultado

### Requirement: Resultado vigente
El sistema MUST dejar de mostrar el resultado anterior cuando cambia la lista de participantes (al agregar uno válido, al quitar uno o al limpiar la lista) o cuando cambia la cantidad de ganadores seleccionada. Un intento de agregar rechazado (vacío o duplicado) SHALL NOT descartar el resultado vigente, porque la lista no cambió.

#### Scenario: Agregar un participante
- **GIVEN** que se muestra un resultado de sorteo
- **WHEN** el usuario agrega un participante válido
- **THEN** el resultado deja de mostrarse

#### Scenario: Quitar un participante
- **GIVEN** que se muestra un resultado de sorteo
- **WHEN** el usuario quita a un participante
- **THEN** el resultado deja de mostrarse

#### Scenario: Limpiar la lista
- **GIVEN** que se muestra un resultado de sorteo
- **WHEN** el usuario presiona «Limpiar lista»
- **THEN** el resultado deja de mostrarse y la lista queda vacía

#### Scenario: Intento rechazado
- **GIVEN** que se muestra un resultado de sorteo
- **WHEN** el usuario intenta agregar un nombre duplicado
- **THEN** el resultado sigue mostrándose

#### Scenario: Cambiar cantidad de ganadores
- **GIVEN** que se muestra un resultado de sorteo
- **WHEN** el usuario cambia la cantidad de ganadores seleccionada
- **THEN** el resultado anterior deja de mostrarse

### Requirement: Un único ganador y sin historial
El sistema SHALL conservar únicamente el resultado del sorteo vigente (de 1, 2 o 3 ganadores según la selección actual) y MUST NOT guardar un historial de sorteos anteriores ni enviarlos a un servidor.

#### Scenario: Sorteo repetido
- **WHEN** el usuario completa dos sorteos seguidos
- **THEN** solo se muestra el resultado del último sorteo completado
