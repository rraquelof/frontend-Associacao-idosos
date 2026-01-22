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

    test("Renderia botao com tipo padrão 'button'", ()=>{
        const { getByText } = render(
            <Botao texto="Botão padrão" />
        );

        const botao = getByText("Botão padrão");
        expect(botao).toHaveAttribute("type", "button");
    });

    test("Renderiza botao com tipo 'submit'", ()=>{
        const { getByText } = render(
            <Botao texto="Botão Submit" tipo="submit"/>
        );

        const botao = getByText("Botão Submit");
        expect(botao).toHaveAttribute("type", "submit");
    });

    test("Renderiza children no lugar de texto", ()=>{
        const { getByText, queryByText } = render(
            <Botao texto="texto antigo">
                <span>Conteúdo children</span>
            </Botao>
        );

        expect(getByText("Conteúdo children")).toBeInTheDocument();
        expect(queryByText("texto antigo")).not.toBeInTheDocument();
    });

});
