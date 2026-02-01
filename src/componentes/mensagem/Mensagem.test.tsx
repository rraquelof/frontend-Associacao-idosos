import { describe, test, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Mensagem from "./Mensagem";

describe("Testando Mensagem", () => {
  test("Renderiza corretamente com texto e classe de sucesso", () => {
    const { getByText, asFragment } = render(
      <Mensagem texto="Operação realizada!" tipo="sucesso" />
    );

    const msg = getByText("Operação realizada!");

    expect(msg).toBeInTheDocument();
    expect(msg.className).toContain("bg-green-500");

    expect(asFragment()).toMatchSnapshot();
  });

  test("Chama onClose após 3 segundos", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    const { getByText } = render(
      <Mensagem texto="Teste timeout" tipo="informacao" onClose={onClose} />
    );

    expect(getByText("Teste timeout")).toBeInTheDocument();

    vi.advanceTimersByTime(3000);

    expect(onClose).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  test("Renderiza corretamente com classe de erro", () => {
    const { getByText } = render(
      <Mensagem texto="Ocorreu um erro" tipo="erro" />
    );

    const msg = getByText("Ocorreu um erro");

    expect(msg).toBeInTheDocument();
    expect(msg.className).toContain("bg-red-500");
  });
  test("Usa classe de informação por padrão quando tipo não é informado", () => {
    const { getByText } = render(
      <Mensagem texto="Mensagem padrão" />
    );

    const msg = getByText("Mensagem padrão");

    expect(msg).toBeInTheDocument();
    expect(msg.className).toContain("bg-blue-500");
  });

  test("Não lança erro quando onClose não é fornecido", () => {
    vi.useFakeTimers();

    expect(() => {
      render(<Mensagem texto="Sem onClose" tipo="sucesso" />);
      vi.advanceTimersByTime(3000);
    }).not.toThrow();

    vi.useRealTimers();
  });
});
