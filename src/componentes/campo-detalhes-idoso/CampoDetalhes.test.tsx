import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import CampoDetalhes from "./CampoDetalhes";

describe("Testando CampoDetalhes", () => {
  test("Renderiza corretamente label e valor string", () => {
    const { getByText, asFragment } = render(
      <CampoDetalhes label="Nome" valor="Maria da Silva" />
    );

    expect(getByText("Nome:")).toBeInTheDocument();
    expect(getByText("Maria da Silva")).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  test("Formata corretamente quando o valor é uma data", () => {
    const data = new Date(1950, 4, 20);

    const { getByText, asFragment } = render(
      <CampoDetalhes label="Data de nascimento" valor={data} />
    );

    expect(getByText("Data de nascimento:")).toBeInTheDocument();
    expect(getByText("20/05/1950")).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  test("Não renderiza nada quando o valor é undefined", () => {
    const { container } = render(
      <CampoDetalhes label="Nome:" />
    );

    expect(container.firstChild).toBeNull();
  });

  test("Não renderiza nada quando o valor for uma string vazia", () => {
    const { container } = render(
      <CampoDetalhes label="Observações" valor={''} />
    );

    expect(container.firstChild).toBeNull();
  });

  test("Renderiza label dentro de um elemento strong", () => {
    const { container } = render(
      <CampoDetalhes label="CPF" valor="123.123.123-00" />
    );

    const strong = container.querySelector("strong");

    expect(strong).not.toBeNull();
    expect(strong).toHaveTextContent("CPF");
  });

});
