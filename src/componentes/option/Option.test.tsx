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

  test("Renderiza como selecionado quando selected é true", () => {
    const { getByText } = render(
      <select>
        <Option texto="Selecionada" selected />
      </select>
    );

    const option = getByText("Selecionada") as HTMLOptionElement;

    expect(option.selected).toBe(true);
  });

  test("Renderiza corretamente mesmo sem value", () => {
    const { getByText } = render(
      <select>
        <Option texto="Sem valor" />
      </select>
    );

    const option = getByText("Sem valor");

    expect(option).toBeInTheDocument();
    expect(option).not.toHaveAttribute("value");
  });

  test("Aplica className passada via props", () => {
    const { getByText } = render(
      <select>
        <Option texto="Com classe" className="minha-classe" />
      </select>
    );

    const option = getByText("Com classe");

    expect(option.className).toContain("minha-classe");
  });
});
