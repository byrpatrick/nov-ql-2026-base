export function pickWinner(
  participants: readonly string[],
  random: () => number = Math.random,
): string | null {
  if (participants.length === 0) return null;
  const lastIndex = participants.length - 1;
  const index = Math.min(Math.floor(random() * participants.length), lastIndex);
  return participants[index];
}
