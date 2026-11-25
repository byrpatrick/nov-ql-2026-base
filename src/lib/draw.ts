/**
 * Normaliza un nombre: elimina espacios sobrantes.
 */
export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/**
 * Indica si un nombre ya existe en la lista (sin distinguir mayúsculas/minúsculas).
 */
export function hasParticipant(participants: string[], name: string): boolean {
  const target = normalizeName(name).toLowerCase();
  return participants.some((p) => p.toLowerCase() === target);
}

/**
 * Agrega un participante a la lista. Devuelve una nueva lista.
 * Ignora nombres vacíos o duplicados.
 */
export function addParticipant(participants: string[], name: string): string[] {
  const normalized = normalizeName(name);
  if (!normalized || hasParticipant(participants, normalized)) {
    return participants;
  }
  return [...participants, normalized];
}

/**
 * Elimina un participante por índice. Devuelve una nueva lista.
 */
export function removeParticipant(
  participants: string[],
  index: number,
): string[] {
  return participants.filter((_, i) => i !== index);
}

/**
 * Selecciona aleatoriamente a un único ganador.
 * Devuelve null si no hay participantes.
 * `random` es inyectable para facilitar las pruebas.
 */
export function pickWinner(
  participants: string[],
  random: () => number = Math.random,
): string | null {
  if (participants.length === 0) return null;
  const index = Math.min(
    Math.floor(random() * participants.length),
    participants.length - 1,
  );
  return participants[index];
}
