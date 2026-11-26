"use client";

import { useWinnerPicker } from "@/hooks/useWinnerPicker";
import ParticipantForm from "./ParticipantForm";
import ParticipantList from "./ParticipantList";
import WinnerResult from "./WinnerResult";
import styles from "./WinnerPicker.module.css";

interface WinnerPickerProps {
  random?: () => number;
}

export default function WinnerPicker({ random }: WinnerPickerProps) {
  const {
    participants,
    winner,
    errorMessage,
    addParticipant,
    removeParticipant,
    draw,
    reset,
  } = useWinnerPicker(random);
  const hasParticipants = participants.length > 0;

  return (
    <>
      <ParticipantForm onAdd={addParticipant} errorMessage={errorMessage} />
      <ParticipantList
        participants={participants}
        onRemove={removeParticipant}
      />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.drawButton}
          onClick={draw}
          disabled={!hasParticipants}
        >
          Sortear ganador
        </button>
        <button
          type="button"
          className={styles.resetButton}
          onClick={reset}
          disabled={!hasParticipants}
        >
          Limpiar lista
        </button>
      </div>
      {winner && <WinnerResult winner={winner} />}
    </>
  );
}
