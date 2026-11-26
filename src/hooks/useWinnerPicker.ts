import { useState } from "react";
import { pickWinner } from "@/lib/draw";
import {
  PARTICIPANT_ERROR,
  type ParticipantError,
  addParticipant,
  getParticipantError,
  normalizeName,
  removeParticipant,
} from "@/lib/participants";

const ERROR_MESSAGES: Record<ParticipantError, (name: string) => string> = {
  [PARTICIPANT_ERROR.EMPTY]: () => "Escribe un nombre para agregarlo.",
  [PARTICIPANT_ERROR.DUPLICATE]: (name) => `"${name}" ya está en la lista.`,
};

export interface WinnerPickerState {
  participants: readonly string[];
  winner: string | null;
  errorMessage: string | null;
  addParticipant: (name: string) => boolean;
  removeParticipant: (name: string) => void;
  draw: () => void;
  reset: () => void;
}

export function useWinnerPicker(
  random: () => number = Math.random,
): WinnerPickerState {
  const [participants, setParticipants] = useState<readonly string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleAdd(name: string): boolean {
    const error = getParticipantError(participants, name);
    if (error) {
      setErrorMessage(ERROR_MESSAGES[error](normalizeName(name)));
      return false;
    }
    setParticipants(addParticipant(participants, name));
    setErrorMessage(null);
    setWinner(null);
    return true;
  }

  function handleRemove(name: string) {
    setParticipants(removeParticipant(participants, name));
    setWinner(null);
  }

  function reset() {
    setParticipants([]);
    setWinner(null);
    setErrorMessage(null);
  }

  return {
    participants,
    winner,
    errorMessage,
    addParticipant: handleAdd,
    removeParticipant: handleRemove,
    draw: () => setWinner(pickWinner(participants, random)),
    reset,
  };
}
