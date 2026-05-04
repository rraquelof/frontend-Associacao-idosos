import type { ReactNode } from "react";
import { botaoEstilos } from "./variants";

interface BotaoProps {
  texto?: string;
  tipo?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  variant?: keyof typeof botaoEstilos.variants;
  size?: keyof typeof botaoEstilos.sizes;
  children?: ReactNode;
  disabled?: boolean;
}

const Botao = ({
  tipo = "button",
  onClick,
  texto,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
}: BotaoProps) => {
  const estilo =
    `${botaoEstilos.base} ` +
    `${botaoEstilos.variants[variant]} ` +
    `${botaoEstilos.sizes[size]} ` +
    className;

  return (
    <button type={tipo} onClick={onClick} className={estilo} disabled={disabled}>
      {children ?? texto}
    </button>
  );
};

export default Botao;