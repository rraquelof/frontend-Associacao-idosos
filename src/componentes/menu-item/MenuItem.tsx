import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type CorAcento = "blue" | "green" | "orange" | "pink";

const estilosAcento: Record<CorAcento, { fundo: string; borda: string }> = {
  blue: { fundo: "bg-blue-50", borda: "hover:border-blue-300" },
  green: { fundo: "bg-emerald-50", borda: "hover:border-emerald-300" },
  orange: { fundo: "bg-amber-50", borda: "hover:border-amber-300" },
  pink: { fundo: "bg-rose-50", borda: "hover:border-rose-300" },
};

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  route: string;
  descricao?: string;
  cor?: CorAcento;
  className?: string;
}

export default function MenuItem({
  icon,
  label,
  route,
  descricao,
  cor = "blue",
  className = "",
}: MenuItemProps) {
  const navigate = useNavigate();
  const acento = estilosAcento[cor];

  function handleClick() {
    navigate(route);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
                  group
                  cursor-pointer
                  text-left
                  bg-white
                  border border-gray-100
                  rounded-2xl
                  shadow-sm
                  w-full
                  flex flex-col items-start
                  gap-3
                  p-5 sm:p-6
                  hover:-translate-y-1
                  hover:shadow-lg
                  ${acento.borda}
                  transition-all
                  duration-300
                  ${className}
              `}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${acento.fundo} group-hover:scale-105 transition-transform duration-300`}
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
          {label}
        </span>
        {descricao && (
          <span className="text-gray-400 text-sm">{descricao}</span>
        )}
      </div>
    </button>
  );
}
