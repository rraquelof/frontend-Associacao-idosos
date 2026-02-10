import { describe, test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Select from "./Select";

describe("Testando Select", () => {
    test("Renderiza corretamente as opções", () => {
        const { getByText, asFragment } = render(
            <Select>
                <option value="">Selecione</option>
                <option value="opcao1">Opcao1</option>
                <option value="opcao2">Opcao2</option>
            </Select>
        );

        expect(getByText("Opcao1")).toBeInTheDocument();
        expect(getByText("Opcao2")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Dispara onChange quando o valor é selecionado", () => {
        const handleChange = vi.fn();
        const { getByLabelText } = render(
            <>
                <label htmlFor="sexo">Sexo</label>
                <Select id="sexo" name="sexo" onChange={handleChange}>
                    <option value="">Selecione</option>
                    <option value="feminino">Feminino</option>
                </Select>
            </>
        );

        const select = getByLabelText("Sexo");
        fireEvent.change(select, { target: { value: "feminino" } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test("Aplica className customizada", () => {
        const { getByRole, asFragment } = render(
            <Select className="bg-blue-200">
                <option value="">Selecione</option>
                <option value="opcao1">Opcao1</option>
            </Select>
        );

        const select = getByRole("combobox");

        expect(select.className).toContain("bg-blue-200");
        expect(select.className).toContain("border");

        expect(asFragment()).toMatchSnapshot();
    });

    test("Respeita a propriedade disabled", () => {
        const { getByRole } = render(
            <Select disabled>
                <option value="">Selecione</option>
                <option value="opcao1">Opcao1</option>
            </Select>
        );

        const select = getByRole("combobox");

        expect(select).toBeDisabled();
    });

    test("Inicia com valor selecionado corretamente", () => {
        const { getByDisplayValue } = render(
            <Select value="opcao2" onChange={() => { }}>
                <option value="">Selecione</option>
                <option value="opcao1">Opcao1</option>
                <option value="opcao2">Opcao2</option>
            </Select>
        );

        const select = getByDisplayValue("Opcao2");

        expect(select).toBeInTheDocument();
    });

})