import { act, renderHook } from "@testing-library/react";
import { useWinnerPicker } from "./useWinnerPicker";

const MIDDLE_RANDOM = () => 0.5;

function renderPicker(random?: () => number) {
  return renderHook(() => useWinnerPicker(random));
}

function advanceCountdownSeconds(seconds: number) {
  for (let step = 0; step < seconds; step++) {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  }
}

describe("useWinnerPicker", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("inicia sin participantes, ganadores, cuenta regresiva ni errores y con 1 ganador por defecto", () => {
    const { result } = renderPicker();

    expect(result.current.participants).toEqual([]);
    expect(result.current.winnerCount).toBe(1);
    expect(result.current.winners).toEqual([]);
    expect(result.current.winner).toBeNull();
    expect(result.current.countdown).toBeNull();
    expect(result.current.isCountingDown).toBe(false);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.drawErrorMessage).toBeNull();
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

  it("rechaza nombres vacíos y duplicados con mensaje de error", () => {
    const { result } = renderPicker();
    let wasAdded = true;

    act(() => {
      wasAdded = result.current.addParticipant("   ");
    });
    expect(wasAdded).toBe(false);
    expect(result.current.errorMessage).toMatch(/escribe un nombre/i);

    act(() => {
      result.current.addParticipant("Ana");
    });
    expect(result.current.errorMessage).toBeNull();

    act(() => {
      result.current.addParticipant("ana");
    });
    expect(result.current.errorMessage).toMatch(/ya está en la lista/i);
    expect(result.current.participants).toEqual(["Ana"]);
  });

  it("en un sorteo inválido no inicia cuenta regresiva y muestra el mensaje de participantes insuficientes", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    act(() => {
      result.current.addParticipant("Ana");
    });

    act(() => {
      result.current.draw();
    });

    expect(result.current.countdown).toBeNull();
    expect(result.current.isCountingDown).toBe(false);
    expect(result.current.winners).toEqual([]);
    expect(result.current.drawErrorMessage).toBe(
      "Se necesitan al menos 2 participantes para sortear 1 ganador(es).",
    );
  });

  it("ejecuta la cuenta regresiva 3 -> 2 -> 1 con 1 segundo entre cada número antes de revelar al ganador", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    ["Ana", "Pedro", "María", "Luis", "Sofía"].forEach((name) => {
      act(() => {
        result.current.addParticipant(name);
      });
    });

    act(() => {
      result.current.draw();
    });
    expect(result.current.countdown).toBe(3);
    expect(result.current.isCountingDown).toBe(true);
    expect(result.current.winners).toEqual([]);

    advanceCountdownSeconds(1);
    expect(result.current.countdown).toBe(2);
    expect(result.current.winners).toEqual([]);

    advanceCountdownSeconds(1);
    expect(result.current.countdown).toBe(1);
    expect(result.current.winners).toEqual([]);

    advanceCountdownSeconds(1);
    expect(result.current.countdown).toBeNull();
    expect(result.current.isCountingDown).toBe(false);
    expect(result.current.winners).toEqual(["María"]);
    expect(result.current.winner).toBe("María");
  });

  it("sortea múltiples ganadores para el podio cuando se configura winnerCount en 3", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    ["Ana", "Pedro", "María", "Luis", "Sofía"].forEach((name) => {
      act(() => {
        result.current.addParticipant(name);
      });
    });
    act(() => {
      result.current.setWinnerCount(3);
    });

    act(() => {
      result.current.draw();
    });
    advanceCountdownSeconds(3);

    expect(result.current.winners).toEqual(["María", "Luis", "Pedro"]);
  });

  it("durante la cuenta regresiva oculta el resultado anterior y bloquea modificaciones y nuevos sorteos", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    ["Ana", "Pedro", "María"].forEach((name) => {
      act(() => {
        result.current.addParticipant(name);
      });
    });
    act(() => {
      result.current.draw();
    });
    advanceCountdownSeconds(3);
    expect(result.current.winners).toEqual(["Pedro"]);

    act(() => {
      result.current.draw();
    });
    expect(result.current.countdown).toBe(3);
    expect(result.current.winners).toEqual([]);

    let wasAdded = true;
    act(() => {
      wasAdded = result.current.addParticipant("Luis");
      result.current.removeParticipant("Ana");
      result.current.setWinnerCount(2);
      result.current.draw();
      result.current.reset();
    });

    expect(wasAdded).toBe(false);
    expect(result.current.participants).toEqual(["Ana", "Pedro", "María"]);
    expect(result.current.winnerCount).toBe(1);
    expect(result.current.countdown).toBe(3);
  });

  it("descarta el resultado vigente al cambiar la lista de participantes o la cantidad de ganadores", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    ["Ana", "Pedro", "María"].forEach((name) => {
      act(() => {
        result.current.addParticipant(name);
      });
    });
    act(() => {
      result.current.draw();
    });
    advanceCountdownSeconds(3);
    expect(result.current.winners).toEqual(["Pedro"]);

    act(() => {
      result.current.setWinnerCount(2);
    });
    expect(result.current.winners).toEqual([]);

    act(() => {
      result.current.draw();
    });
    advanceCountdownSeconds(3);
    expect(result.current.winners).toHaveLength(2);

    act(() => {
      result.current.removeParticipant("Ana");
    });
    expect(result.current.winners).toEqual([]);
  });

  it("reinicia participantes, ganadores, cantidad de ganadores y errores", () => {
    const { result } = renderPicker(MIDDLE_RANDOM);
    ["Ana", "Pedro", "María"].forEach((name) => {
      act(() => {
        result.current.addParticipant(name);
      });
    });
    act(() => {
      result.current.setWinnerCount(2);
      result.current.draw();
    });
    advanceCountdownSeconds(3);

    act(() => {
      result.current.reset();
    });

    expect(result.current.participants).toEqual([]);
    expect(result.current.winners).toEqual([]);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.drawErrorMessage).toBeNull();
  });
});
