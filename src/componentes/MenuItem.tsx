import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  route: string;
  className?: string;
}

export default function MenuItem({
  icon,
  route,
  className = "",
}: MenuItemProps) {
  const navigate = useNavigate();
  function handleClick() {
    navigate(route);
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleClick}
        className={`
                    cursor-pointer
                    bg-[#F4EEE8]
                    rounded-xl
                    shadow-md
                    w-40
                    h-40
                    overflow-hidden
                    hover:scale-105
                    hover:shadow-lg
                    transition
                    ${className}
                `}
      >
        {icon}
      </button>
    </div>
  );
}
