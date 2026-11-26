import { render, screen, within } from "@testing-library/react";
import WinnerResult from "./WinnerResult";

describe("WinnerResult", () => {
  it("no renderiza nada cuando la lista de ganadores está vacía", () => {
    const { container } = render(<WinnerResult winners={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("anuncia a un único ganador con «¡Tenemos un ganador!»", () => {
    render(<WinnerResult winners={["María"]} />);

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("¡Tenemos un ganador!");
    expect(result).toHaveTextContent("María");
  });

  it("muestra un podio de 2 ganadores con 2.º a la izquierda y 1.er al centro", () => {
    render(<WinnerResult winners={["María", "Luis"]} />);

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("¡Tenemos un podio!");

    const steps = within(result).getAllByRole("listitem");
    expect(steps).toHaveLength(2);
    expect(steps[0]).toHaveTextContent("🥈");
    expect(steps[0]).toHaveTextContent("Luis");
    expect(steps[0]).toHaveTextContent("2.º lugar");
    expect(steps[1]).toHaveTextContent("🥇");
    expect(steps[1]).toHaveTextContent("María");
    expect(steps[1]).toHaveTextContent("1.er lugar");
  });

  it("muestra un podio de 3 ganadores con 2.º a la izquierda, 1.er al centro y 3.er a la derecha", () => {
    render(<WinnerResult winners={["María", "Luis", "Ana"]} />);

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("¡Tenemos un podio!");

    const steps = within(result).getAllByRole("listitem");
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveTextContent("🥈");
    expect(steps[0]).toHaveTextContent("Luis");
    expect(steps[1]).toHaveTextContent("🥇");
    expect(steps[1]).toHaveTextContent("María");
    expect(steps[2]).toHaveTextContent("🥉");
    expect(steps[2]).toHaveTextContent("Ana");
  });
});
