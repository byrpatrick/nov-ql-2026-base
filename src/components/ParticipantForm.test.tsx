import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParticipantForm from "./ParticipantForm";

describe("ParticipantForm", () => {
  it("envía el nombre escrito y limpia el campo si se agregó", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn().mockReturnValue(true);
    render(<ParticipantForm onAdd={onAdd} errorMessage={null} />);
    const input = screen.getByLabelText("Nombre del participante");

    await user.type(input, "Ana");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(onAdd).toHaveBeenCalledWith("Ana");
    expect(input).toHaveValue("");
  });

  it("conserva el texto si el participante fue rechazado", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn().mockReturnValue(false);
    render(<ParticipantForm onAdd={onAdd} errorMessage={null} />);
    const input = screen.getByLabelText("Nombre del participante");

    await user.type(input, "Ana");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(input).toHaveValue("Ana");
  });

  it("envía el formulario con la tecla Enter", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn().mockReturnValue(true);
    render(<ParticipantForm onAdd={onAdd} errorMessage={null} />);

    await user.type(
      screen.getByLabelText("Nombre del participante"),
      "Luis{Enter}",
    );

    expect(onAdd).toHaveBeenCalledWith("Luis");
  });

  it("muestra el mensaje de error asociado al campo", () => {
    render(
      <ParticipantForm onAdd={jest.fn()} errorMessage="Nombre inválido" />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Nombre inválido");
    expect(screen.getByLabelText("Nombre del participante")).toBeInvalid();
  });

  it("no muestra alerta sin error", () => {
    render(<ParticipantForm onAdd={jest.fn()} errorMessage={null} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("deshabilita el campo y el botón cuando isDisabled es true", () => {
    render(
      <ParticipantForm onAdd={jest.fn()} errorMessage={null} isDisabled />,
    );

    expect(screen.getByLabelText("Nombre del participante")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();
  });
});
