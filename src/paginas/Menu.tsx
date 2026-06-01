import MenuItem from "../componentes/menu-item/MenuItem";
import idososIcon from "../img/idosos.png";
import eventosIcon from "../img/eventos.png"; 
import saudeIcon from "../img/saude.png";

export default function Menu() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-black mb-10 transition-all duration-200">
        Menu Principal
      </h1>

      <div className="flex flex-col sm:flex-row gap-6">
        <MenuItem
          icon={<img src={idososIcon} alt="Ícone de Idosos" className="w-full h-full object-contain" />}
          label="Cadastro de Idosos"
          route="/lista/idosos"
        />

        <MenuItem
          icon={<img src={eventosIcon} alt="Ícone de Eventos" className="w-full h-full object-contain" />}
          label="Gerenciamento de Eventos"
          route="/eventos" 
        />
      
        <MenuItem
          icon={<img src={saudeIcon} alt="Ícone de Saúde" className="w-full h-full object-contain" />}
          label="Gerenciamento de Saúde"
          route="/lista/registro/saude" 
        />
        
      </div>
    </div>
  );
}