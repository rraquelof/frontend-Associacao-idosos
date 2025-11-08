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
                    relative
                    overflow-hidden
                    hover:scale-105
                    hover:shadow-lg
                    transition
                    ${className}
                `}
            >
                <div className="absolute inset-0 bg-white flex justify-center items-center">
                    {icon}
                </div>

            </button>
            <p className="mt-2 font-semibold text-lg text-black">
                {label}
            </p>
        </div>
    );
}
