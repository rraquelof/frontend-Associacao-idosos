import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../../img/logo.png";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navegacao = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navegacao("/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-slate-50 via-blue-50/40 to-emerald-50/40">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex md:hidden items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SIGAAI" className="w-7 h-7 object-contain" />
            <span className="font-bold text-gray-900 tracking-tight">
              Abrigo Luca Zorn
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
