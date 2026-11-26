import { act, renderHook } from "@testing-library/react";
import { useWinnerPicker } from "./useWinnerPicker";

const MIDDLE_RANDOM = () => 0.5;

function renderPicker(random?: () => number) {
  return renderHook(() => useWinnerPicker(random));
}

describe("useWinnerPicker", () => {
  it("inicia sin participantes, ganador ni error", () => {
    const { result } = renderPicker();

    expect(result.current.participants).toEqual([]);
    expect(result.current.winner).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });

  it("agrega un participante y devuelve true", () => {
    const { result } = renderPicker();
    let wasAdded = false;

    act(() => {
      wasAdded = result.current.addParticipant("Ana");
    });

    expect(wasAdded).toBe(true);
    expect(result.current.participants).toEqual(["Ana"]);
  });

  it("rechaza un nombre vacío con mensaje de error", () => {
    const { result } = renderPicker();
    let wasAdded = true;

    act(() => {
      wasAdded = result.current.addParticipant("   ");
    });

    expect(wasAdded).toBe(false);
    expect(result.current.errorMessage).toMatch(/escribe un nombre/i);
  });

  it("rechaza un nombre duplicado con mensaje de error", () => {
    const { result } = renderPicker();
    act(() => {
      result.current.addParticipant("Ana");
    });

    act(() => {
      result.current.addParticipant("ana");
    });

    expect(result.current.errorMessage).toMatch(/ya está en la lista/i);
    expect(result.current.participants).toEqual(["Ana"]);
  });

  it("limpia el error al agregar un participante válido", () => {
    const { result } = renderPicker();
    act(() => {
      result.current.addParticipant("");
    });

    act(() => {
      result.current.addParticipant("Ana");
    });

    expect(result.current.errorMessage).toBeNull();
  });

  it("sortea con el generador aleatorio inyectado", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    ["Ana", "Pedro", "María", "Luis", "Sofía"].forEach((name) => {
      act(() => {
        result.current.addParticipant(name);
      });
    });

    act(() => {
      result.current.draw();
    });

    expect(result.current.winner).toBe("María");
  });

  it("no hay ganador si se sortea sin participantes", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);

    act(() => {
      result.current.draw();
    });

    expect(result.current.winner).toBeNull();
  });

  it("quita un participante y descarta el ganador anterior", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    ["Ana", "Pedro"].forEach((name) => {
      act(() => {
        result.current.addParticipant(name);
      });
    });
    act(() => {
      result.current.draw();
    });

    act(() => {
      result.current.removeParticipant("Ana");
    });

    expect(result.current.participants).toEqual(["Pedro"]);
    expect(result.current.winner).toBeNull();
  });

  it("reinicia participantes, ganador y error", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    act(() => {
      result.current.addParticipant("Ana");
    });
    act(() => {
      result.current.draw();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.participants).toEqual([]);
    expect(result.current.winner).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });
});
