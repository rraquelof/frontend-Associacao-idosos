import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
    icon: ReactNode;
    label: string;
    route: string;
}

export default function MenuItem({
    icon,
    label,
    route
}: MenuItemProps) {
    const navigate = useNavigate();
    const handleClick = () => navigate(route);

    return (
        <button>
            
        </button>
        
        
    )
}