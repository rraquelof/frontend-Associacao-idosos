import { cloneElement, useState, type ReactElement } from "react";

interface ErroCampoObrigatorioProps {
  valor: string | Date | undefined;
  obrigatorio?: boolean;
  envioVazio?: boolean; 
  children: React.ReactNode;
}

export default function ErroCampoObrigatorio({
  valor,
  obrigatorio = false,
  envioVazio = false,
  children,
}: ErroCampoObrigatorioProps) {
  const [tocado, setTocado] = useState(false);
  const invalido = obrigatorio && (!valor) && (tocado || envioVazio);

  const childWithBlur = cloneElement(children as ReactElement, {
    onBlur: () => setTocado(true),
    className: `${
      (children as ReactElement).props.className || ""
    } ${invalido ? "border-red-500 focus:ring-red-400" : ""}`,
  });

  return (
    <div className="flex flex-col">
      {childWithBlur}
      {invalido && (
        <span className="text-red-500 text-sm mt-1">Campo obrigatório</span>
      )}
    </div>
  );
}
