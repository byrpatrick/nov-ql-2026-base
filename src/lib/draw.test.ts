import {
  addParticipant,
  hasParticipant,
  normalizeName,
  pickWinner,
  removeParticipant,
} from "./draw";

describe("normalizeName", () => {
  it("recorta y colapsa espacios", () => {
    expect(normalizeName("  Ana   María ")).toBe("Ana María");
  });
});

describe("addParticipant", () => {
  it("agrega un participante nuevo", () => {
    expect(addParticipant(["Ana"], "Pedro")).toEqual(["Ana", "Pedro"]);
  });

  it("ignora nombres vacíos", () => {
    expect(addParticipant(["Ana"], "   ")).toEqual(["Ana"]);
  });

  it("ignora duplicados sin distinguir mayúsculas", () => {
    expect(addParticipant(["Ana"], " ana ")).toEqual(["Ana"]);
  });

  it("no muta la lista original", () => {
    const original = ["Ana"];
    addParticipant(original, "Luis");
    expect(original).toEqual(["Ana"]);
  });
});

describe("hasParticipant", () => {
  it("detecta existentes ignorando mayúsculas", () => {
    expect(hasParticipant(["Sofía"], "SOFÍA")).toBe(true);
    expect(hasParticipant(["Sofía"], "Luis")).toBe(false);
  });
});

describe("removeParticipant", () => {
  it("elimina por índice", () => {
    expect(removeParticipant(["Ana", "Pedro", "Luis"], 1)).toEqual([
      "Ana",
      "Luis",
    ]);
  });
});

describe("pickWinner", () => {
  const people = ["Ana", "Pedro", "María", "Luis", "Sofía"];

  it("devuelve null sin participantes", () => {
    expect(pickWinner([])).toBeNull();
  });

  it("devuelve al único participante", () => {
    expect(pickWinner(["Ana"])).toBe("Ana");
  });

  it("usa el valor aleatorio para elegir el índice", () => {
    expect(pickWinner(people, () => 0)).toBe("Ana");
    expect(pickWinner(people, () => 0.5)).toBe("María");
    expect(pickWinner(people, () => 0.999999)).toBe("Sofía");
  });

  it("nunca se sale de rango aunque random devuelva 1", () => {
    expect(pickWinner(people, () => 1)).toBe("Sofía");
  });

  it("siempre devuelve un participante de la lista con Math.random", () => {
    for (let i = 0; i < 200; i++) {
      expect(people).toContain(pickWinner(people));
    }
  });
});
