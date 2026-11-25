"use client";

import { FormEvent, useState } from "react";
import {
  addParticipant,
  hasParticipant,
  normalizeName,
  pickWinner,
  removeParticipant,
} from "@/lib/draw";
import styles from "./WinnerPicker.module.css";

export default function WinnerPicker() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeName(name);
    if (!normalized) {
      setError("Escribe un nombre para agregarlo.");
      return;
    }
    if (hasParticipant(participants, normalized)) {
      setError(`"${normalized}" ya está en la lista.`);
      return;
    }
    setParticipants(addParticipant(participants, normalized));
    setName("");
    setError(null);
    setWinner(null);
  }

  function handleRemove(index: number) {
    setParticipants(removeParticipant(participants, index));
    setWinner(null);
  }

  function handleDraw() {
    setWinner(pickWinner(participants));
  }

  function handleReset() {
    setParticipants([]);
    setWinner(null);
    setError(null);
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Selector de ganadores</h1>
      <p className={styles.subtitle}>
        Agrega a los participantes y sortea un ganador.
      </p>

      <form onSubmit={handleAdd} className={styles.form}>
        <label htmlFor="participant-name" className={styles.srOnly}>
          Nombre del participante
        </label>
        <input
          id="participant-name"
          className={styles.input}
          type="text"
          placeholder="Nombre del participante"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className={styles.secondaryButton}>
          Agregar
        </button>
      </form>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <section aria-label="Participantes" className={styles.card}>
        <h2 className={styles.cardTitle}>
          Participantes ({participants.length})
        </h2>
        {participants.length === 0 ? (
          <p className={styles.empty}>Aún no hay participantes.</p>
        ) : (
          <ul className={styles.list}>
            {participants.map((p, i) => (
              <li key={`${p}-${i}`} className={styles.listItem}>
                <span>{p}</span>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(i)}
                  aria-label={`Quitar a ${p}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleDraw}
          disabled={participants.length === 0}
        >
          Sortear ganador
        </button>
        <button
          type="button"
          className={styles.linkButton}
          onClick={handleReset}
          disabled={participants.length === 0}
        >
          Limpiar lista
        </button>
      </div>

      {winner && (
        <section
          aria-live="polite"
          data-testid="winner"
          className={styles.winner}
        >
          <p className={styles.winnerLabel}>¡Tenemos un ganador!</p>
          <p className={styles.winnerName}>{winner}</p>
        </section>
      )}
    </main>
  );
}
