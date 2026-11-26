import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WinnerPicker from "./WinnerPicker";

const MIDDLE_RANDOM = () => 0.5;

async function addParticipants(
  user: ReturnType<typeof userEvent.setup>,
  names: string[],
) {
  const input = screen.getByLabelText("Nombre del participante");
  for (const name of names) {
    await user.type(input, name);
    await user.click(screen.getByRole("button", { name: "Agregar" }));
  }
}

describe("WinnerPicker", () => {
  it("inicia con el sorteo deshabilitado", () => {
    render(<WinnerPicker />);

    expect(
      screen.getByRole("button", { name: "Sortear ganador" }),
    ).toBeDisabled();
    expect(screen.getByText("Aún no hay participantes.")).toBeInTheDocument();
  });

  it("permite agregar varios participantes", async () => {
    const user = userEvent.setup();
    render(<WinnerPicker />);

    await addParticipants(user, ["Ana", "Pedro", "María"]);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Participantes (3)")).toBeInTheDocument();
  });

  it("rechaza nombres vacíos y duplicados", async () => {
    const user = userEvent.setup();
    render(<WinnerPicker />);
    await addParticipants(user, ["Ana"]);

    await user.click(screen.getByRole("button", { name: "Agregar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Escribe un nombre");

    await addParticipants(user, ["ana"]);
    expect(screen.getByRole("alert")).toHaveTextContent("ya está en la lista");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("permite quitar un participante", async () => {
    const user = userEvent.setup();
    render(<WinnerPicker />);
    await addParticipants(user, ["Ana", "Pedro"]);

    await user.click(screen.getByRole("button", { name: "Quitar a Ana" }));

    expect(screen.queryByText("Ana")).not.toBeInTheDocument();
    expect(screen.getByText("Pedro")).toBeInTheDocument();
  });

  it("sortea y muestra un único ganador destacado", async () => {
    const user = userEvent.setup();
    render(<WinnerPicker random={MIDDLE_RANDOM} />);
    await addParticipants(user, ["Ana", "Pedro", "María", "Luis", "Sofía"]);

    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("¡Tenemos un ganador!");
    expect(result).toHaveTextContent("María");
  });

  it("limpia la lista y el ganador", async () => {
    const user = userEvent.setup();
    render(<WinnerPicker random={MIDDLE_RANDOM} />);
    await addParticipants(user, ["Ana"]);
    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));

    await user.click(screen.getByRole("button", { name: "Limpiar lista" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Aún no hay participantes.")).toBeInTheDocument();
  });
});
