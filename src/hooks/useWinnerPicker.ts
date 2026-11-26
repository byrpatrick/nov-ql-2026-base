import { useEffect, useState } from "react";
import { type WinnerCount, getDrawError, pickWinners } from "@/lib/draw";
import {
  PARTICIPANT_ERROR,
  type ParticipantError,
  addParticipant,
  getParticipantError,
  normalizeName,
  removeParticipant,
} from "@/lib/participants";

const DEFAULT_WINNER_COUNT: WinnerCount = 1;
const COUNTDOWN_START = 3;
const COUNTDOWN_STEP_MS = 1000;

const ERROR_MESSAGES: Record<ParticipantError, (name: string) => string> = {
  [PARTICIPANT_ERROR.EMPTY]: () => "Escribe un nombre para agregarlo.",
  [PARTICIPANT_ERROR.DUPLICATE]: (name) => `"${name}" ya está en la lista.`,
};

export interface WinnerPickerState {
  participants: readonly string[];
  winnerCount: WinnerCount;
  winners: readonly string[];
  winner: string | null;
  countdown: number | null;
  isCountingDown: boolean;
  errorMessage: string | null;
  drawErrorMessage: string | null;
  addParticipant: (name: string) => boolean;
  removeParticipant: (name: string) => void;
  setWinnerCount: (count: WinnerCount) => void;
  draw: () => void;
  reset: () => void;
}

export function useWinnerPicker(
  random: () => number = Math.random,
): WinnerPickerState {
  const [participants, setParticipants] = useState<readonly string[]>([]);
  const [winnerCount, setWinnerCountState] =
    useState<WinnerCount>(DEFAULT_WINNER_COUNT);
  const [winners, setWinners] = useState<readonly string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [drawErrorMessage, setDrawErrorMessage] = useState<string | null>(null);

  const isCountingDown = countdown !== null;

  useEffect(() => {
    if (countdown === null) return;
    const timerId = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
        return;
      }
      setCountdown(null);
      setWinners(pickWinners(participants, winnerCount, random));
    }, COUNTDOWN_STEP_MS);
    return () => clearTimeout(timerId);
  }, [countdown, participants, winnerCount, random]);

  function clearDrawOutcome() {
    setWinners([]);
    setDrawErrorMessage(null);
  }

  function handleAdd(name: string): boolean {
    if (isCountingDown) return false;
    const error = getParticipantError(participants, name);
    if (error) {
      setErrorMessage(ERROR_MESSAGES[error](normalizeName(name)));
      return false;
    }
    setParticipants(addParticipant(participants, name));
    setErrorMessage(null);
    clearDrawOutcome();
    return true;
  }

  function handleRemove(name: string) {
    if (isCountingDown) return;
    setParticipants(removeParticipant(participants, name));
    clearDrawOutcome();
  }

  function handleSetWinnerCount(count: WinnerCount) {
    if (isCountingDown) return;
    setWinnerCountState(count);
    clearDrawOutcome();
  }

  function handleDraw() {
    if (isCountingDown) return;
    const drawError = getDrawError(participants.length, winnerCount);
    if (drawError) {
      setWinners([]);
      setDrawErrorMessage(drawError);
      return;
    }
    clearDrawOutcome();
    setCountdown(COUNTDOWN_START);
  }

  function reset() {
    if (isCountingDown) return;
    setParticipants([]);
    setErrorMessage(null);
    clearDrawOutcome();
  }

  return {
    participants,
    winnerCount,
    winners,
    winner: winners[0] ?? null,
    countdown,
    isCountingDown,
    errorMessage,
    drawErrorMessage,
    addParticipant: handleAdd,
    removeParticipant: handleRemove,
    setWinnerCount: handleSetWinnerCount,
    draw: handleDraw,
    reset,
  };
}
