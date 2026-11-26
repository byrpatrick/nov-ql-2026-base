import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("muestra el título y el selector de ganadores", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Selector de ganadores" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Nombre del participante"),
    ).toBeInTheDocument();
  });
});
