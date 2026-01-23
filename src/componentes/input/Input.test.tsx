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

  test("Aplica corretamente a className customizada", ()=>{
    const { getByPlaceholderText } = render(
      <Input placeholder="Email" className="bg-gray-100 border-red-500"/>
    );

    const input = getByPlaceholderText("Email");
    expect(input.className).toContain("bg-gray-100");
    expect(input.className).toContain("border-red-500");
  })

  test("Fica desabilitado quando disabled é true",()=>{
    const { getByPlaceholderText } = render(
      <Input placeholder="CPF" disabled/>
    );
    const input = getByPlaceholderText("CPF") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test("Renderiza corretamente um valor padrão para input", ()=>{
    const {getByDisplayValue } = render(
      <Input value={"Maria"} readOnly/>
    );
    expect(getByDisplayValue("Maria")).toBeInTheDocument();
  });
});
