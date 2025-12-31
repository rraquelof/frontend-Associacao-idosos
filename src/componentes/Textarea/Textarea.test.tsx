import { describe, test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Textarea from "./Textarea";

describe("Testando Textarea", () => {
  test("Renderiza corretamente com placeholder", () => {
    const { getByPlaceholderText, asFragment } = render(
      <Textarea placeholder="Digite algo..." rows={4} />
    );

    const textarea = getByPlaceholderText("Digite algo...");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("rows", "4");
    expect(asFragment()).toMatchSnapshot();
  });

  test("Dispara onChange quando o usuário digita", () => {
    const handleChange = vi.fn();

    const { getByPlaceholderText } = render(
      <Textarea placeholder="Digite aqui" onChange={handleChange} />
    );

    const textarea = getByPlaceholderText(
      "Digite aqui"
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "Olá mundo" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(textarea.value).toBe("Olá mundo");
  });
});
