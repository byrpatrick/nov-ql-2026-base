import WinnerPicker from "@/components/WinnerPicker";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Selector de ganadores</h1>
      <p className={styles.subtitle}>
        Agrega a los participantes y sortea un ganador.
      </p>
      <WinnerPicker />
    </main>
  );
}
