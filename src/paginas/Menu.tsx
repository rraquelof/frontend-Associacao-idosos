import MenuItem from "../componentes/menu-item/MenuItem";
import idososIcon from "../img/idosos.png";
import eventosIcon from "../img/eventos.png";
import saudeIcon from "../img/saude.png";
import visitaIcon from "../img/visita.png";
import { UserRound } from "lucide-react";

export default function Menu() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-black mb-10 transition-all duration-200">
        Menu Principal
      </h1>

      <div className="flex flex-col sm:flex-row gap-6">
        <MenuItem
          icon={
            <img
              src={idososIcon}
              alt="Ícone de Idosos"
              className="w-full h-full object-contain"
            />
          }
          label="Cadastro de Idosos"
          route="/lista/idosos"
        />

        <MenuItem
          icon={
            <img
              src={eventosIcon}
              alt="Ícone de Eventos"
              className="w-full h-full object-contain"
            />
          }
          label="Gerenciamento de Eventos"
          route="/eventos"
        />

        <MenuItem
          icon={
            <img
              src={saudeIcon}
              alt="Ícone de Saúde"
              className="w-full h-full object-contain"
            />
          }
          label="Gerenciamento de Saúde"
          route="/lista/registro/saude"
        />
        <MenuItem
          icon={
            <img
              src={visitaIcon}
              alt="Ícone de Visita"
              className="w-full h-full object-contain"
            />
          }
          label="Gerenciamento de Visitas"
          route="/lista/visitas"
        />

        <MenuItem
          icon={
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="font-bold text-black">Perfil</span>
              <UserRound className="w-14 h-14 text-black" />
            </div>
          }
          label="Meu Perfil"
          route="/perfil"
        />
      </div>
    </div>
  );
}
