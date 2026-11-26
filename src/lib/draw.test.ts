import {
  ALLOWED_WINNER_COUNTS,
  getDrawError,
  pickWinner,
  pickWinners,
} from "./draw";

describe("ALLOWED_WINNER_COUNTS", () => {
  it("expone las opciones válidas 1, 2 y 3", () => {
    expect(ALLOWED_WINNER_COUNTS).toEqual([1, 2, 3]);
  });
});

describe("getDrawError", () => {
  it("devuelve null cuando hay al menos N + 1 participantes", () => {
    expect(getDrawError(2, 1)).toBeNull();
    expect(getDrawError(3, 2)).toBeNull();
    expect(getDrawError(4, 3)).toBeNull();
  });

  it.each([
    [0, 1, "Se necesitan al menos 2 participantes para sortear 1 ganador(es)."],
    [1, 1, "Se necesitan al menos 2 participantes para sortear 1 ganador(es)."],
    [2, 2, "Se necesitan al menos 3 participantes para sortear 2 ganador(es)."],
    [3, 3, "Se necesitan al menos 4 participantes para sortear 3 ganador(es)."],
  ])(
    "con %i participante(s) y %i ganador(es) devuelve el mensaje requerido",
    (participantCount, winnerCount, expectedMessage) => {
      expect(getDrawError(participantCount, winnerCount)).toBe(expectedMessage);
    },
  );
});

describe("pickWinners", () => {
  const participants = ["Ana", "Pedro", "María", "Luis", "Sofía"];

  it("devuelve arreglo vacío cuando no hay al menos N + 1 participantes o count < 1", () => {
    expect(pickWinners([], 1)).toEqual([]);
    expect(pickWinners(["Ana"], 1)).toEqual([]);
    expect(pickWinners(["Ana", "Pedro"], 2)).toEqual([]);
    expect(pickWinners(["Ana", "Pedro", "María"], 3)).toEqual([]);
    expect(pickWinners(participants, 0)).toEqual([]);
  });

  it("elige exactamente 1, 2 o 3 ganadores todos distintos y de la lista", () => {
    for (const count of ALLOWED_WINNER_COUNTS) {
      const winners = pickWinners(participants, count);

      expect(winners).toHaveLength(count);
      expect(new Set(winners).size).toBe(count);
      expect(winners.every((winner) => participants.includes(winner))).toBe(
        true,
      );
    }
  });

  it("usa el generador aleatorio inyectado de forma determinista", () => {
    const sequence = [0.5, 0.25, 0.99];
    let callIndex = 0;
    const deterministicRandom = () => sequence[callIndex++];

    const winners = pickWinners(participants, 3, deterministicRandom);

    expect(winners).toEqual(["María", "Pedro", "Sofía"]);
  });

  it("nunca se sale de rango aunque random devuelva 1", () => {
    expect(pickWinners(participants, 2, () => 1)).toEqual(["Sofía", "Luis"]);
  });

  it("no muta el arreglo original de participantes", () => {
    const original = Object.freeze([...participants]);

    const winners = pickWinners(original, 3);

    expect(original).toEqual(participants);
    expect(winners).toHaveLength(3);
  });
});

describe("pickWinner", () => {
  const participants = ["Ana", "Pedro", "María", "Luis", "Sofía"];

  it("devuelve null cuando hay menos de 2 participantes", () => {
    expect(pickWinner([])).toBeNull();
    expect(pickWinner(["Ana"])).toBeNull();
  });

  it.each([
    [0, "Ana"],
    [0.5, "María"],
    [0.999999, "Sofía"],
  ])("con random=%s elige a %s", (randomValue, expectedWinner) => {
    expect(pickWinner(participants, () => randomValue)).toBe(expectedWinner);
  });
});
