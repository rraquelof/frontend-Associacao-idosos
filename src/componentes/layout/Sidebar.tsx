import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../../img/logo.png";
import { usuarioTemAcesso, type PaginaComPermissao } from "../../utilitarios/permissoes";

const itensNav: {
  label: string;
  route: string;
  match: (p: string) => boolean;
  pagina?: PaginaComPermissao;
}[] = [
  { label: "Menu principal", route: "/menu", match: (p: string) => p === "/menu" },
  { label: "Idosos", route: "/lista/idosos", match: (p: string) => p.includes("idoso"), pagina: "idosos" },
  { label: "Eventos", route: "/eventos", match: (p: string) => p.includes("evento"), pagina: "eventos" },
  { label: "Saúde", route: "/lista/registro/saude", match: (p: string) => p.includes("saude"), pagina: "saude" },
  { label: "Visitas", route: "/lista/visitas", match: (p: string) => p.includes("visita"), pagina: "visitas" },
  { label: "Perfil", route: "/perfil", match: (p: string) => p.includes("perfil") },
];

export default function Sidebar() {
  const navegacao = useNavigate();
  const location = useLocation();
  const itensVisiveis = itensNav.filter(
    (item) => !item.pagina || usuarioTemAcesso(item.pagina)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navegacao("/login");
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <img src={logo} alt="SIGAAI" className="w-8 h-8 object-contain" />
        <span className="font-bold text-gray-900 text-lg tracking-tight">
          Abrigo Luca Zorn
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3 mt-2">
        {itensVisiveis.map((item) => {
          const ativo = item.match(location.pathname);
          return (
            <button
              key={item.route}
              type="button"
              onClick={() => navegacao(item.route)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                ativo
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  ativo ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
