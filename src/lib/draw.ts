export const ALLOWED_WINNER_COUNTS = [1, 2, 3] as const;

export type WinnerCount = (typeof ALLOWED_WINNER_COUNTS)[number];

export function getDrawError(
  participantCount: number,
  winnerCount: number,
): string | null {
  const minimumParticipants = winnerCount + 1;
  if (participantCount < minimumParticipants) {
    return `Se necesitan al menos ${minimumParticipants} participantes para sortear ${winnerCount} ganador(es).`;
  }
  return null;
}

function pickRandomIndex(length: number, random: () => number): number {
  const lastIndex = length - 1;
  return Math.min(Math.floor(random() * length), lastIndex);
}

function drawDistinct(
  pool: readonly string[],
  count: number,
  random: () => number,
): readonly string[] {
  if (count <= 0 || pool.length === 0) return [];
  const index = pickRandomIndex(pool.length, random);
  const remaining = pool.filter((_, itemIndex) => itemIndex !== index);
  return [pool[index], ...drawDistinct(remaining, count - 1, random)];
}

export function pickWinners(
  participants: readonly string[],
  count: number,
  random: () => number = Math.random,
): readonly string[] {
  if (count < 1 || getDrawError(participants.length, count) !== null) {
    return [];
  }
  return drawDistinct(participants, count, random);
}

export function pickWinner(
  participants: readonly string[],
  random: () => number = Math.random,
): string | null {
  return pickWinners(participants, 1, random)[0] ?? null;
}
