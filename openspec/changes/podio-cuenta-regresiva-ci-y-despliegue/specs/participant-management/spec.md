# Spec Delta

## ADDED Requirements

### Requirement: Bloquear cambios de participantes durante la cuenta regresiva
Mientras la cuenta regresiva de un sorteo esté activa, el sistema MUST deshabilitar el campo de texto de participantes, el botón «Agregar», los botones «Quitar a {nombre}» y el botón «Limpiar lista», impidiendo cualquier modificación de la lista.

#### Scenario: Intento de modificar participantes durante la cuenta regresiva
- **GIVEN** que un sorteo válido está en plena cuenta regresiva
- **WHEN** se observa la sección de participantes y el formulario de alta
- **THEN** el campo de nombre y los botones «Agregar», «Quitar a {nombre}» y «Limpiar lista» están deshabilitados y la lista permanece intacta
