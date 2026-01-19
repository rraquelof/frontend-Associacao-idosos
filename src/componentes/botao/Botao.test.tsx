import { describe, test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Botao from "./Botao";

describe("Testando Botao", () => {
    test("Renderiza corretamente o texto", () => {
        const { getByText, asFragment } = render(
            <Botao texto="Clique aqui" />
        );

        expect(getByText("Clique aqui")).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    test("Dispara onClick quando o botão é clicado", () => {
        const handleClick = vi.fn();

        const { getByText } = render(
            <Botao texto="Salvar" onClick={handleClick} />
        );

        const botao = getByText("Salvar");
        fireEvent.click(botao);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
