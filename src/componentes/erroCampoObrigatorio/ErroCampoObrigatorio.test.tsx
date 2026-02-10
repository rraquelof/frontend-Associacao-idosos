import { describe, test, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ErroCampoObrigatorio from "./ErroCampoObrigatorio";

describe("Testando ErroCampoObrigatorio", () => {
  test("Mostra erro quando obrigatório e após blur", () => {
    const { getByPlaceholderText, queryByText, asFragment } = render(
      <ErroCampoObrigatorio valor={""} obrigatorio>
        <input placeholder="Digite algo..." />
      </ErroCampoObrigatorio>
    );

    const input = getByPlaceholderText("Digite algo...");

    expect(queryByText("Campo obrigatório")).toBeNull();

    fireEvent.blur(input);

    expect(queryByText("Campo obrigatório")).toBeInTheDocument();
    expect(input.className).toContain("border-red-500");

    expect(asFragment()).toMatchSnapshot();
  });

  test("Não mostra erro quando o valor está preenchido", () => {
    const { getByPlaceholderText, queryByText, asFragment } = render(
      <ErroCampoObrigatorio valor="ok" obrigatorio>
        <input placeholder="Digite algo..." />
      </ErroCampoObrigatorio>
    );

    const input = getByPlaceholderText("Digite algo...");

    expect(queryByText("Campo obrigatório")).toBeNull();
    expect(input.className).not.toContain("border-red-500");

    expect(asFragment()).toMatchSnapshot();
  });

  test("Mostra erro imediatamente quando envioVazio = true", () => {
    const { getByPlaceholderText, queryByText, asFragment } = render(
      <ErroCampoObrigatorio valor={""} obrigatorio envioVazio>
        <input placeholder="Digite algo..." />
      </ErroCampoObrigatorio>
    );

    const input = getByPlaceholderText("Digite algo...");

    expect(queryByText("Campo obrigatório")).toBeInTheDocument();
    expect(input.className).toContain("border-red-500");

    expect(asFragment()).toMatchSnapshot();
  });

  test("Não mostra erro quando não é obrigatório", () => {
    const { getByPlaceholderText, queryByText, asFragment } = render(
      <ErroCampoObrigatorio valor={""}>
        <input placeholder="Digite algo..." />
      </ErroCampoObrigatorio>
    );

    const input = getByPlaceholderText("Digite algo...");

    fireEvent.blur(input);

    expect(queryByText("Campo obrigatório")).toBeNull();
    expect(input.className).not.toContain("border-red-500");

    expect(asFragment()).toMatchSnapshot();
  });

  test("Não mostra erro quando valor é Date", () => {
    const { getByPlaceholderText, queryByText, asFragment } = render(
      <ErroCampoObrigatorio valor={new Date()} obrigatorio>
        <input placeholder="Digite algo..." />
      </ErroCampoObrigatorio>
    );

    const input = getByPlaceholderText("Digite algo...");

    fireEvent.blur(input);

    expect(queryByText("Campo obrigatório")).toBeNull();
    expect(input.className).not.toContain("border-red-500");

    expect(asFragment()).toMatchSnapshot();
  });

});