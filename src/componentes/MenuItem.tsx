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
    label,
    route,
    className = ""
}: MenuItemProps) {
    const navigate = useNavigate();
    function handleClick(){
        navigate(route);
    } 

    const baseClasses = `
        cursor-pointer
        bg-[#F4EEE8]
        rounded-xl
        shadow-md
        w-40
        h-40
        flex
        flex-col
        justify-center
        items-center
        transition
        transform
        hover:scale-105
        hover:shadow-lg
    `;
    return (
        <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className={baseClasses + " " + className}
        >
        <div className="text-5xl mb-3">{icon}</div>
        <p className="font-semibold text-lg">{label}</p>
        </button>
    );
}