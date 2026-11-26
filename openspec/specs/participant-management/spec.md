# participant-management Specification

## Purpose

Define cómo el usuario arma la lista de participantes del sorteo: agregar nombres, validarlos, quitarlos y limpiar la lista durante la sesión.

## Requirements

### Requirement: Agregar participantes
El sistema SHALL permitir ingresar el nombre de un participante en un campo de texto etiquetado «Nombre del participante» y agregarlo a la lista con el botón «Agregar» o con la tecla Enter. La lista MUST conservar el orden de inserción y permitir varios participantes.

#### Scenario: Agregar con el botón
- **WHEN** el usuario escribe «Ana» y presiona «Agregar»
- **THEN** «Ana» aparece en la lista y el campo de texto queda vacío

#### Scenario: Agregar con Enter
- **WHEN** el usuario escribe «Luis» y presiona Enter
- **THEN** «Luis» aparece en la lista

#### Scenario: Agregar varios participantes
- **WHEN** el usuario agrega «Ana», «Pedro» y «María» en ese orden
- **THEN** la lista muestra los tres nombres en ese orden y el título indica «Participantes (3)»

### Requirement: Normalizar el nombre
El sistema SHALL recortar los espacios al inicio y al final del nombre y reducir los espacios repetidos internos a uno solo antes de agregarlo.

#### Scenario: Espacios sobrantes
- **WHEN** el usuario agrega «  Ana   María  »
- **THEN** la lista muestra «Ana María»

### Requirement: Rechazar nombres vacíos
El sistema MUST rechazar un nombre vacío o compuesto solo por espacios, sin modificar la lista, y SHALL mostrar el mensaje «Escribe un nombre para agregarlo.» como alerta asociada al campo.

#### Scenario: Nombre vacío
- **WHEN** el usuario presiona «Agregar» sin escribir nada
- **THEN** la lista no cambia y se muestra la alerta «Escribe un nombre para agregarlo.»

### Requirement: Rechazar nombres duplicados
El sistema MUST rechazar un nombre que ya está en la lista, comparándolo sin distinguir mayúsculas de minúsculas y después de normalizarlo. SHALL mostrar el mensaje `"{nombre}" ya está en la lista.` y conservar el texto escrito en el campo.

#### Scenario: Duplicado con otra capitalización
- **WHEN** la lista contiene «Ana» y el usuario intenta agregar «ana»
- **THEN** la lista sigue con un solo «Ana», se muestra la alerta `"ana" ya está en la lista.` y el campo conserva «ana»

### Requirement: Limpiar el error al corregir
El sistema SHALL ocultar el mensaje de error cuando se agrega un participante válido.

#### Scenario: Error que desaparece
- **GIVEN** que se mostró un error por nombre vacío
- **WHEN** el usuario agrega un nombre válido
- **THEN** la alerta deja de mostrarse

### Requirement: Quitar un participante
El sistema SHALL ofrecer, junto a cada participante, un botón accesible «Quitar a {nombre}» que lo elimina de la lista.

#### Scenario: Quitar uno
- **GIVEN** que la lista contiene «Ana» y «Pedro»
- **WHEN** el usuario presiona «Quitar a Ana»
- **THEN** la lista contiene solo a «Pedro»

### Requirement: Limpiar la lista
El sistema SHALL ofrecer el botón «Limpiar lista», que elimina a todos los participantes y el mensaje de error. El botón MUST estar deshabilitado cuando no hay participantes.

#### Scenario: Limpiar con participantes
- **GIVEN** que la lista contiene participantes
- **WHEN** el usuario presiona «Limpiar lista»
- **THEN** la lista queda vacía

#### Scenario: Limpiar sin participantes
- **WHEN** la lista está vacía
- **THEN** el botón «Limpiar lista» está deshabilitado

### Requirement: Estado de lista vacía
El sistema SHALL mostrar el texto «Aún no hay participantes.» y el título «Participantes (0)» mientras la lista esté vacía.

#### Scenario: Primera visita
- **WHEN** el usuario abre la aplicación
- **THEN** se muestra «Aún no hay participantes.» y no se muestra ninguna lista

### Requirement: Participantes solo durante la sesión
El sistema MUST mantener los participantes únicamente en memoria durante la sesión; no SHALL guardarlos entre visitas ni enviarlos a ningún servidor.

#### Scenario: Recargar la página
- **GIVEN** que la lista contiene participantes
- **WHEN** el usuario recarga la página
- **THEN** la lista aparece vacía
