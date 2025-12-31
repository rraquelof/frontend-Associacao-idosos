import { describe, test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Input from "./Input";

describe("Testando Input", () => {
  test("Renderiza corretamente com placeholder", () => {
    const { getByPlaceholderText, asFragment } = render(
      <Input placeholder="Digite algo..." />
    );

    expect(getByPlaceholderText("Digite algo...")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  test("Dispara onChange quando o usuário digita", () => {
    const handleChange = vi.fn();

    const { getByPlaceholderText } = render(
      <Input placeholder="Nome" onChange={handleChange} />
    );

    const input = getByPlaceholderText("Nome") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Maria" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("Maria");
  });
});
