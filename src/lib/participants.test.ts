import {
  PARTICIPANT_ERROR,
  addParticipant,
  getParticipantError,
  hasParticipant,
  normalizeName,
  removeParticipant,
} from "./participants";

describe("normalizeName", () => {
  it("recorta y colapsa espacios", () => {
    expect(normalizeName("  Ana   María ")).toBe("Ana María");
  });
});

describe("hasParticipant", () => {
  it("detecta existentes ignorando mayúsculas y espacios", () => {
    expect(hasParticipant(["Sofía"], " SOFÍA ")).toBe(true);
  });

  it("devuelve false si el nombre no está en la lista", () => {
    expect(hasParticipant(["Sofía"], "Luis")).toBe(false);
  });
});

describe("getParticipantError", () => {
  it("devuelve null para un nombre válido", () => {
    expect(getParticipantError(["Ana"], "Pedro")).toBeNull();
  });

  it("detecta nombres vacíos", () => {
    expect(getParticipantError(["Ana"], "   ")).toBe(PARTICIPANT_ERROR.EMPTY);
  });

  it("detecta nombres duplicados", () => {
    expect(getParticipantError(["Ana"], " ana ")).toBe(
      PARTICIPANT_ERROR.DUPLICATE,
    );
  });
});

describe("addParticipant", () => {
  it("agrega un participante nuevo con el nombre normalizado", () => {
    expect(addParticipant(["Ana"], "  Pedro ")).toEqual(["Ana", "Pedro"]);
  });

  it("ignora nombres vacíos", () => {
    expect(addParticipant(["Ana"], "   ")).toEqual(["Ana"]);
  });

  it("ignora duplicados sin distinguir mayúsculas", () => {
    expect(addParticipant(["Ana"], "ANA")).toEqual(["Ana"]);
  });

  it("no muta la lista original", () => {
    const original = Object.freeze(["Ana"]);

    const result = addParticipant(original, "Luis");

    expect(original).toEqual(["Ana"]);
    expect(result).not.toBe(original);
  });
});

describe("removeParticipant", () => {
  it("elimina por nombre", () => {
    expect(removeParticipant(["Ana", "Pedro", "Luis"], "Pedro")).toEqual([
      "Ana",
      "Luis",
    ]);
  });

  it("no muta la lista original", () => {
    const original = Object.freeze(["Ana", "Pedro"]);

    removeParticipant(original, "Ana");

    expect(original).toEqual(["Ana", "Pedro"]);
  });
});
