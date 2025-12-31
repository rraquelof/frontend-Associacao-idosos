import MenuItem from "../componentes/menuItem/MenuItem";
import idososIcon from "../img/idosos.png";

export default function Menu() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-black mb-10 transition-all duration-200">
        Menu Principal
      </h1>

      <MenuItem
        icon={<img src={idososIcon} className="w-full h-full object-contain" />}
        label="Cadastro de Idosos"
        route="/lista/idosos"
      />
    </div>
  );
}
