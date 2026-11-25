import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WinnerPicker from "./WinnerPicker";

async function addPeople(names: string[]) {
  const user = userEvent.setup();
  const input = screen.getByLabelText("Nombre del participante");
  for (const n of names) {
    await user.type(input, n);
    await user.click(screen.getByRole("button", { name: "Agregar" }));
  }
  return user;
}

describe("WinnerPicker", () => {
  afterEach(() => jest.restoreAllMocks());

  it("muestra la interfaz inicial con el sorteo deshabilitado", () => {
    render(<WinnerPicker />);
    expect(screen.getByLabelText("Nombre del participante")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sortear ganador" }),
    ).toBeDisabled();
    expect(screen.getByText("Aún no hay participantes.")).toBeInTheDocument();
  });

  it("permite agregar varios participantes", async () => {
    render(<WinnerPicker />);
    await addPeople(["Ana", "Pedro", "María"]);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Participantes (3)")).toBeInTheDocument();
  });

  it("rechaza nombres vacíos y duplicados", async () => {
    render(<WinnerPicker />);
    const user = await addPeople(["Ana"]);
    await user.click(screen.getByRole("button", { name: "Agregar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Escribe un nombre");
    await user.type(screen.getByLabelText("Nombre del participante"), "ana");
    await user.click(screen.getByRole("button", { name: "Agregar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("ya está en la lista");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("permite quitar un participante", async () => {
    render(<WinnerPicker />);
    const user = await addPeople(["Ana", "Pedro"]);
    await user.click(screen.getByRole("button", { name: "Quitar a Ana" }));
    expect(screen.queryByText("Ana")).not.toBeInTheDocument();
    expect(screen.getByText("Pedro")).toBeInTheDocument();
  });

  it("sortea y muestra un único ganador destacado", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    render(<WinnerPicker />);
    const user = await addPeople(["Ana", "Pedro", "María", "Luis", "Sofía"]);
    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));
    const winner = screen.getByTestId("winner");
    expect(winner).toHaveTextContent("¡Tenemos un ganador!");
    expect(winner).toHaveTextContent("María");
  });

  it("limpia la lista y el ganador", async () => {
    const user = userEvent.setup();
    render(<WinnerPicker />);
    await addPeople(["Ana"]);
    await user.click(screen.getByRole("button", { name: "Sortear ganador" }));
    expect(screen.getByTestId("winner")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpiar lista" }));
    expect(screen.queryByTestId("winner")).not.toBeInTheDocument();
    expect(screen.getByText("Aún no hay participantes.")).toBeInTheDocument();
  });
});
