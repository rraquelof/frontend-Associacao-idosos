import MenuItem from "../componentes/MenuItem";
import idososIcon from "../img/idosos.png";

export default function Menu(){
    return(
        <div className="min-h-screen bg-white flex flex-col items-center p-8"> 

            <h1 className=" text-black font-medium text-3xl mb-10 transition-all duration-200"> 
                Menu Principal
            </h1>
            <div className="grid grid-cols-2 gap-8">
                <MenuItem
                icon={<img src={idososIcon} className="w-full h-full object-cover rounded-xl" />}
                route="/cadastro/idoso"
                />
            </div>
        </div>
    )
}