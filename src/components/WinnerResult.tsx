import styles from "./WinnerResult.module.css";

interface WinnerResultProps {
  winner: string;
}

export default function WinnerResult({ winner }: WinnerResultProps) {
  return (
    <section role="status" className={styles.winner}>
      <p className={styles.label}>¡Tenemos un ganador!</p>
      <p className={styles.name}>{winner}</p>
    </section>
  );
}
