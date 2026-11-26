import { pickWinner } from "./draw";

describe("pickWinner", () => {
  const participants = ["Ana", "Pedro", "María", "Luis", "Sofía"];

  it("devuelve null sin participantes", () => {
    expect(pickWinner([])).toBeNull();
  });

  it("devuelve al único participante", () => {
    expect(pickWinner(["Ana"])).toBe("Ana");
  });

  it.each([
    [0, "Ana"],
    [0.5, "María"],
    [0.999999, "Sofía"],
  ])("con random=%s elige a %s", (randomValue, expectedWinner) => {
    expect(pickWinner(participants, () => randomValue)).toBe(expectedWinner);
  });

  it("nunca se sale de rango aunque random devuelva 1", () => {
    expect(pickWinner(participants, () => 1)).toBe("Sofía");
  });

  it("siempre devuelve un participante de la lista con Math.random", () => {
    const winners = Array.from({ length: 200 }, () => pickWinner(participants));

    expect(winners.every((winner) => participants.includes(winner ?? ""))).toBe(
      true,
    );
  });
});
