# Spec Delta

## MODIFIED Requirements

### Requirement: Color base azul
La interfaz SHALL usar el azul como color base: títulos, botones principales, fondos de tarjetas, el indicador de cuenta regresiva y el bloque del resultado (tanto de ganador único como de podio) MUST derivar de una misma paleta azul definida de forma centralizada.

#### Scenario: Primera carga
- **WHEN** el usuario abre la aplicación
- **THEN** los elementos principales de la interfaz se muestran en tonos azules

#### Scenario: Resultado destacado
- **WHEN** se muestra el ganador o el podio de ganadores
- **THEN** el bloque del resultado y los escalones del podio usan tonos de la paleta azul

#### Scenario: Cuenta regresiva con color base
- **WHEN** la cuenta regresiva 3, 2, 1 está activa
- **THEN** el indicador grande de la cuenta regresiva se presenta con tonos de la paleta azul
