export const PARTICIPANT_ERROR = {
  EMPTY: "empty",
  DUPLICATE: "duplicate",
} as const;

export type ParticipantError =
  (typeof PARTICIPANT_ERROR)[keyof typeof PARTICIPANT_ERROR];

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function hasParticipant(
  participants: readonly string[],
  name: string,
): boolean {
  const target = normalizeName(name).toLowerCase();
  return participants.some(
    (participant) => participant.toLowerCase() === target,
  );
}

export function getParticipantError(
  participants: readonly string[],
  name: string,
): ParticipantError | null {
  if (!normalizeName(name)) return PARTICIPANT_ERROR.EMPTY;
  if (hasParticipant(participants, name)) return PARTICIPANT_ERROR.DUPLICATE;
  return null;
}

export function addParticipant(
  participants: readonly string[],
  name: string,
): readonly string[] {
  if (getParticipantError(participants, name)) return participants;
  return [...participants, normalizeName(name)];
}

export function removeParticipant(
  participants: readonly string[],
  name: string,
): readonly string[] {
  return participants.filter((participant) => participant !== name);
}
