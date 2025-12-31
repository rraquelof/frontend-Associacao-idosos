import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import Option from "./Option";

describe("Testando Option", () => {
  test("Renderiza corretamente com texto", () => {
    const { getByText, asFragment } = render(
      <select>
        <Option texto="Opção A" value="a" />
      </select>
    );

    const option = getByText("Opção A");

    expect(option).toBeInTheDocument();
    expect(option.tagName).toBe("OPTION");
    expect(option).toHaveAttribute("value", "a");

    expect(asFragment()).toMatchSnapshot();
  });

    test("Aceita atributos adicionais como disabled", () => {
    const { getByText } = render(
      <select>
        <Option texto="Desabilitada" disabled />
      </select>
    );

    const option = getByText("Desabilitada");

    expect(option).toBeInTheDocument();
    expect(option).toBeDisabled();
  });
});
