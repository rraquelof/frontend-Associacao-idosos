import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
    icon: ReactNode;
    route: string;
    className?: string;
}

export default function MenuItem({
    icon,
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
        className={baseClasses + " " + className}
        >
        <div className="w-full h-full bg-white flex justify-center items-center rounded-xl overflow-hidden">{icon}</div>
        </button>
    );
}