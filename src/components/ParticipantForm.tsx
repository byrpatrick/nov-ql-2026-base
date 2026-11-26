"use client";

import { type FormEvent, useId, useState } from "react";
import styles from "./ParticipantForm.module.css";

interface ParticipantFormProps {
  onAdd: (name: string) => boolean;
  errorMessage: string | null;
}

export default function ParticipantForm({
  onAdd,
  errorMessage,
}: ParticipantFormProps) {
  const [name, setName] = useState("");
  const inputId = useId();
  const errorId = `${inputId}-error`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onAdd(name)) setName("");
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor={inputId} className={styles.srOnly}>
          Nombre del participante
        </label>
        <input
          id={inputId}
          className={styles.input}
          type="text"
          placeholder="Nombre del participante"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errorMessage !== null}
          aria-describedby={errorMessage ? errorId : undefined}
        />
        <button type="submit" className={styles.addButton}>
          Agregar
        </button>
      </form>
      {errorMessage && (
        <p id={errorId} role="alert" className={styles.error}>
          {errorMessage}
        </p>
      )}
    </>
  );
}
