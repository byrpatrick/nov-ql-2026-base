import styles from "./WinnerResult.module.css";

interface WinnerResultProps {
  winners: readonly string[];
}

interface PodiumEntry {
  place: 1 | 2 | 3;
  medal: string;
  label: string;
  name: string;
  stepClassName: string;
}

function buildPodiumEntries(winners: readonly string[]): PodiumEntry[] {
  const entries: PodiumEntry[] = [
    {
      place: 2,
      medal: "🥈",
      label: "2.º lugar",
      name: winners[1],
      stepClassName: styles.secondStep,
    },
    {
      place: 1,
      medal: "🥇",
      label: "1.er lugar",
      name: winners[0],
      stepClassName: styles.firstStep,
    },
  ];
  if (winners[2]) {
    entries.push({
      place: 3,
      medal: "🥉",
      label: "3.er lugar",
      name: winners[2],
      stepClassName: styles.thirdStep,
    });
  }
  return entries;
}

export default function WinnerResult({ winners }: WinnerResultProps) {
  if (winners.length === 0) return null;

  if (winners.length === 1) {
    return (
      <section role="status" className={styles.winner}>
        <p className={styles.label}>¡Tenemos un ganador!</p>
        <p className={styles.name}>{winners[0]}</p>
      </section>
    );
  }

  const podiumEntries = buildPodiumEntries(winners);

  return (
    <section role="status" className={styles.winner}>
      <p className={styles.label}>¡Tenemos un podio!</p>
      <ol className={styles.podium}>
        {podiumEntries.map((entry) => (
          <li key={entry.place} className={styles.podiumColumn}>
            <span className={styles.podiumWinner}>
              {entry.medal} {entry.name}
            </span>
            <div className={`${styles.podiumStep} ${entry.stepClassName}`}>
              <span className={styles.podiumPlace}>{entry.label}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
