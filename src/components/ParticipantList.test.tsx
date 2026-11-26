import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParticipantList from "./ParticipantList";

describe("ParticipantList", () => {
  it("muestra un mensaje cuando no hay participantes", () => {
    render(<ParticipantList participants={[]} onRemove={jest.fn()} />);

    expect(screen.getByText("Aún no hay participantes.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("lista a los participantes con su cantidad", () => {
    render(
      <ParticipantList participants={["Ana", "Pedro"]} onRemove={jest.fn()} />,
    );

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(screen.getByText("Participantes (2)")).toBeInTheDocument();
  });

  it("avisa qué participante se quiere quitar", async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    render(
      <ParticipantList participants={["Ana", "Pedro"]} onRemove={onRemove} />,
    );

    await user.click(screen.getByRole("button", { name: "Quitar a Pedro" }));

    expect(onRemove).toHaveBeenCalledWith("Pedro");
  });

  it("deshabilita los botones de quitar cuando isDisabled es true", () => {
    render(
      <ParticipantList
        participants={["Ana", "Pedro"]}
        onRemove={jest.fn()}
        isDisabled
      />,
    );

    expect(screen.getByRole("button", { name: "Quitar a Ana" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Quitar a Pedro" }),
    ).toBeDisabled();
  });
});
