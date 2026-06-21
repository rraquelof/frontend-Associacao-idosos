import { describe, test, expect, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import Campos from "./Campos";

describe("Testando componente Campos", () => {
    test("Renderiza os campos iniciais", () => {
        const { getByLabelText } = render(
            <Campos campos={["nome", "cpf"]} />
        );

        expect(getByLabelText("Nome")).toBeInTheDocument();
        expect(getByLabelText("Cpf")).toBeInTheDocument();
    });

    test("Inicia com apenas um grupo de campos", () => {
        const { getAllByLabelText } = render(
            <Campos campos={["nome"]} />
        );

        expect(getAllByLabelText("Nome")).toHaveLength(1);
    });

    test("Adiciona um novo grupo de campos ao clicar no botão", () => {
        const { getByText, getAllByLabelText } = render(
            <Campos campos={["Nome"]} />
        );

        fireEvent.click(getByText("Adicionar mais um"));

        expect(getAllByLabelText("Nome")).toHaveLength(2);
    });

    test("Atualiza o valor do input ao digitar", () => {
        const { getByLabelText } = render(
            <Campos campos={["nome"]} />
        );

        const input = getByLabelText("Nome") as HTMLInputElement;

        fireEvent.change(input, {target: {value: "Maria"}});

        expect(input.value).toBe("Maria");
    });

    test("Chama onChange quando valores forem alterados", () => {
        const onChange = vi.fn();

        const { getByLabelText } = render(
            <Campos campos={["nome"]} onChange={onChange}/>
        );

        fireEvent.change(getByLabelText("Nome"), {
            target: { value: "Ana" },
        });

        expect(onChange).toHaveBeenCalledWith([
            { nome: "Ana" }
        ]);
    });
    
});