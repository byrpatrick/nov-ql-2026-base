import styles from "./ParticipantList.module.css";

interface ParticipantListProps {
  participants: readonly string[];
  onRemove: (name: string) => void;
  isDisabled?: boolean;
}

export default function ParticipantList({
  participants,
  onRemove,
  isDisabled = false,
}: ParticipantListProps) {
  return (
    <section aria-label="Participantes" className={styles.card}>
      <h2 className={styles.title}>Participantes ({participants.length})</h2>
      {participants.length === 0 ? (
        <p className={styles.empty}>Aún no hay participantes.</p>
      ) : (
        <ul className={styles.list}>
          {participants.map((participant) => (
            <li key={participant} className={styles.item}>
              <span>{participant}</span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => onRemove(participant)}
                disabled={isDisabled}
                aria-label={`Quitar a ${participant}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
