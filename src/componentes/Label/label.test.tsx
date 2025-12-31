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
});