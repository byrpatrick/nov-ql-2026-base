"use client";

import { useId } from "react";
import { ALLOWED_WINNER_COUNTS, type WinnerCount } from "@/lib/draw";
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
    winnerCount,
    winners,
    countdown,
    isCountingDown,
    errorMessage,
    drawErrorMessage,
    addParticipant,
    removeParticipant,
    setWinnerCount,
    draw,
    reset,
  } = useWinnerPicker(random);
  const winnerCountSelectId = useId();
  const hasParticipants = participants.length > 0;

  return (
    <>
      <ParticipantForm
        onAdd={addParticipant}
        errorMessage={errorMessage}
        isDisabled={isCountingDown}
      />
      <ParticipantList
        participants={participants}
        onRemove={removeParticipant}
        isDisabled={isCountingDown}
      />
      <div className={styles.controls}>
        <label htmlFor={winnerCountSelectId} className={styles.countLabel}>
          Cantidad de ganadores
        </label>
        <select
          id={winnerCountSelectId}
          className={styles.countSelect}
          value={winnerCount}
          disabled={isCountingDown}
          onChange={(event) =>
            setWinnerCount(Number(event.target.value) as WinnerCount)
          }
        >
          {ALLOWED_WINNER_COUNTS.map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.drawButton}
          onClick={draw}
          disabled={isCountingDown}
        >
          Sortear ganador
        </button>
        <button
          type="button"
          className={styles.resetButton}
          onClick={reset}
          disabled={!hasParticipants || isCountingDown}
        >
          Limpiar lista
        </button>
      </div>
      {drawErrorMessage && (
        <p role="alert" className={styles.drawError}>
          {drawErrorMessage}
        </p>
      )}
      {countdown !== null && (
        <section aria-label="Cuenta regresiva" className={styles.countdown}>
          <p className={styles.countdownNumber}>{countdown}</p>
        </section>
      )}
      <WinnerResult winners={winners} />
    </>
  );
}
