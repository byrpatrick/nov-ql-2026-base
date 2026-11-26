import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WinnerPicker from "./WinnerPicker";

const MIDDLE_RANDOM = () => 0.5;

function setupUser() {
  return userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
}

async function addParticipants(
  user: ReturnType<typeof setupUser>,
  names: string[],
) {
  const input = screen.getByLabelText("Nombre del participante");
  for (const name of names) {
    await user.type(input, name);
    await user.click(screen.getByRole("button", { name: "Agregar" }));
  }
}

function advanceCountdownSeconds(seconds: number) {
  for (let step = 0; step < seconds; step++) {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  }
}

describe("WinnerPicker", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("inicia con 1 ganador seleccionado por defecto y Limpiar lista deshabilitado", () => {
    render(<WinnerPicker />);

    expect(screen.getByLabelText("Cantidad de ganadores")).toHaveValue("1");
    expect(
      screen.getByRole("button", { name: "Limpiar lista" }),
    ).toBeDisabled();
    expect(screen.getByText("Aún no hay participantes.")).toBeInTheDocument();
  });

  it("permite agregar varios participantes y quitar uno", async () => {
    const user = setupUser();
    render(<WinnerPicker />);

    await addParticipants(user, ["Ana", "Pedro", "María"]);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Participantes (3)")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Quitar a Ana" }));
    expect(screen.queryByText("Ana")).not.toBeInTheDocument();
    expect(screen.getByText("Pedro")).toBeInTheDocument();
  });

  it("rechaza nombres vacíos y duplicados", async () => {
    const user = setupUser();
    render(<WinnerPicker />);
    await addParticipants(user, ["Ana"]);

    await user.click(screen.getByRole("button", { name: "Agregar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Escribe un nombre");

    await addParticipants(user, ["ana"]);
    expect(screen.getByRole("alert")).toHaveTextContent("ya está en la lista");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("si no hay suficientes participantes, no muestra cuenta regresiva y muestra el motivo", async () => {
    const user = setupUser();
    render(<WinnerPicker />);
    await addParticipants(user, ["Ana", "Pedro"]);
    await user.selectOptions(
      screen.getByLabelText("Cantidad de ganadores"),
      "2",
    );

    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));

    expect(screen.queryByLabelText("Cuenta regresiva")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Se necesitan al menos 3 participantes para sortear 2 ganador(es).",
    );
  });

  it("muestra la cuenta regresiva 3, 2, 1 y luego revela a un único ganador", async () => {
    const user = setupUser();
    render(<WinnerPicker random={MIDDLE_RANDOM} />);
    await addParticipants(user, ["Ana", "Pedro", "María", "Luis", "Sofía"]);

    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));

    expect(screen.getByLabelText("Cuenta regresiva")).toHaveTextContent("3");
    expect(
      screen.getByRole("button", { name: "Sortear ganador" }),
    ).toBeDisabled();
    expect(screen.getByLabelText("Cantidad de ganadores")).toBeDisabled();
    expect(screen.getByLabelText("Nombre del participante")).toBeDisabled();

    advanceCountdownSeconds(1);
    expect(screen.getByLabelText("Cuenta regresiva")).toHaveTextContent("2");

    advanceCountdownSeconds(1);
    expect(screen.getByLabelText("Cuenta regresiva")).toHaveTextContent("1");

    advanceCountdownSeconds(1);
    expect(screen.queryByLabelText("Cuenta regresiva")).not.toBeInTheDocument();

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("¡Tenemos un ganador!");
    expect(result).toHaveTextContent("María");
  });

  it("muestra un podio cuando se eligen 3 ganadores y finaliza la cuenta regresiva", async () => {
    const user = setupUser();
    render(<WinnerPicker random={MIDDLE_RANDOM} />);
    await addParticipants(user, ["Ana", "Pedro", "María", "Luis", "Sofía"]);
    await user.selectOptions(
      screen.getByLabelText("Cantidad de ganadores"),
      "3",
    );

    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));
    advanceCountdownSeconds(3);

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("¡Tenemos un podio!");
    const steps = within(result).getAllByRole("listitem");
    expect(steps).toHaveLength(3);
  });

  it("oculta el resultado anterior al cambiar la lista, la cantidad de ganadores o iniciar otro sorteo", async () => {
    const user = setupUser();
    render(<WinnerPicker random={MIDDLE_RANDOM} />);
    await addParticipants(user, ["Ana", "Pedro", "María"]);
    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));
    advanceCountdownSeconds(3);
    expect(screen.getByRole("status")).toHaveTextContent("Pedro");

    await addParticipants(user, ["ana"]);
    expect(screen.getByRole("status")).toHaveTextContent("Pedro");

    await user.selectOptions(
      screen.getByLabelText("Cantidad de ganadores"),
      "2",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));
    advanceCountdownSeconds(3);
    expect(screen.getByRole("status")).toHaveTextContent("¡Tenemos un podio!");

    await user.click(screen.getByRole("button", { name: "Limpiar lista" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Aún no hay participantes.")).toBeInTheDocument();
  });
});
