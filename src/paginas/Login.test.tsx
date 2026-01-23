import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import Login from "./Login";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({
      message: "Login realizado com sucesso!",
      token: "fake-token",
    }),
  } as Response);
});

afterEach(() => {
  vi.restoreAllMocks();
  mockNavigate.mockClear();
});


describe("Teste de sistema - Login", () => {
  test("Usuário realiza login com sucesso", async () => {
    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText("Digite seu e-mail"),
      { target: { value: "teste@email.com" } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Digite sua senha"),
      { target: { value: "123456" } }
    );

    fireEvent.click(screen.getByText("Entrar"));

    expect(screen.getByText("Verificando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/login realizado com sucesso/i)
      ).toBeInTheDocument();
    });
  });

  test("Mostra mensagem de erro quando login falha", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: "Credenciais inválidas",
      }),
    } as Response);

    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText("Digite seu e-mail"),
      { target: { value: "erro@email.com" } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Digite sua senha"),
      { target: { value: "senha123" } }
    );

    fireEvent.click(screen.getByText("Entrar"));

    await waitFor(() => {
      expect(
        screen.getByText(/credenciais inválidas/i)
      ).toBeInTheDocument();
    });
  });

  test("Redireciona para /menu após login bem-sucedido", async () => {
    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText("Digite seu e-mail"),
      { target: { value: "teste@email.com" } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Digite sua senha"),
      { target: { value: "123456" } }
    );

    fireEvent.click(screen.getByText("Entrar"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/menu");
    });
  });
});