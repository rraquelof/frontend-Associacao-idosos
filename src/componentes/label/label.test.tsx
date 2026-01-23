import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import Label from "./Label";

describe("Testando Label", () => {

    test("Renderiza corretamente com o texto passado", () => {
        const { getByText, asFragment } = render(
            <Label htmlFor="nome" texto="Nome Completo" />
        );
    expect(getByText("Nome Completo")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
    });

    test("Atributo htmlFor é aplicado corretamente", () => {
        const { getByText } = render(
            <Label htmlFor="email" texto="E-mail" />
        );
        const label = getByText("E-mail");
        expect(label).toHaveAttribute("for", "email");
    });

    test("Renderiza corretamente um className personalizado", () => {
        const { getByText } = render(
            <Label
                htmlFor="senha"
                texto="Senha"
                className="text-red-500 uppercase"
            />
        );

        const label = getByText("Senha");

        expect(label.className).toContain("text-red-500 uppercase");
    });

    test("Mantém as classes padrão do Label", () => {
        const { getByText } = render(
            <Label htmlFor="cpf" texto="CPF" />
        );

        const label = getByText("CPF");

        expect(label.className).toContain("text-black");
        expect(label.className).toContain("font-medium");
        expect(label.className).toContain("text-lg");
    });

    test("Renderiza corretamente sem className", () => {
        const { getByText } = render(
            <Label htmlFor="telefone" texto="Telefone" />
        );

        const label = getByText("Telefone");

        expect(label).toBeInTheDocument();
        expect(label.className).not.toContain("undefined");
    });
});