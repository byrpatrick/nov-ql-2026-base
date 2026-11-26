import { render, screen } from "@testing-library/react";
import WinnerResult from "./WinnerResult";

describe("WinnerResult", () => {
  it("anuncia al ganador de forma destacada", () => {
    render(<WinnerResult winner="María" />);

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("¡Tenemos un ganador!");
    expect(result).toHaveTextContent("María");
  });
});
