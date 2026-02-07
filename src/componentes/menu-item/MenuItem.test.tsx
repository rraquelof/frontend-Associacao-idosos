import { render, fireEvent } from "@testing-library/react";
import { test, expect } from "vitest";
import MenuItem from "./MenuItem";
import { describe, vi } from "vitest";
import { beforeEach } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("Testando MenuItem", () => {

  test("Renderiza corretamente com ícone", () => {
    const IconMock = <span data-testid="icon-test">Ícone</span>;

    const { getByTestId, asFragment } = render(
        <MenuItem 
            icon={IconMock} 
            label="Home"
            route="/home" />
        );

    expect(getByTestId("icon-test")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  test("Chama navigate com a rota correta ao clicar", () => {
    const { getByRole } = render(
        <MenuItem 
            icon={<span />} 
            label="Home"
            route="/dashboard" />
    );

    const botao = getByRole("button");
    fireEvent.click(botao);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("Renderiza o botão com type='button'", () => {
    const { getByRole } = render(
      <MenuItem icon={<span />} label="Home" route="/home" />
    );

    const botao = getByRole("button");

    expect(botao).toHaveAttribute("type", "button");
  });

  test("Aplica a className personalizada passada por props", () => {
    const { getByRole } = render(
      <MenuItem
        icon={<span />}
        label="Home"
        route="/home"
        className="classe-customizada"
      />
    );

    const botao = getByRole("button");

    expect(botao.className).toContain("classe-customizada");
  });

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("Não chama navigate automaticamente ao renderizar", () => {
    mockNavigate.mockClear(); // ← linha decisiva

    render(
      <MenuItem icon={<span />} label="Home" route="/home" />
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

