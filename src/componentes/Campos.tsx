import { useState } from "react";
import Input from "./Input";
import Label from "./Label";
import Botao from "./Botao";

interface CamposDinamicosProps {
  campos: string[]; 
  onChange?: (valores: Record<string, string>[]) => void;
}

export default function Campos({
  campos,
  onChange,
}: CamposDinamicosProps) {
  const [itens, setItens] = useState<Record<string, string>[]>([
    Object.fromEntries(campos.map((c) => [c, ""])),
  ]);

  const adicionarItem = () => {
    const novo = Object.fromEntries(campos.map((c) => [c, ""]));
    const novos = [...itens, novo];
    setItens(novos);
    onChange?.(novos);
  };

  const handleChange = (index: number, campo: string, valor: string) => {
    const novos = [...itens];
    novos[index][campo] = valor;
    setItens(novos);
    onChange?.(novos);
  };

  return (
    <div className="flex flex-col gap-4">
  
      {itens.map((item, index) => (
        <div
          key={index}
          className="flex gap-3"
        >
          {campos.map((campo) => (
            <div key={campo} className="flex flex-col">
              <Label texto={campo.charAt(0).toUpperCase() + campo.slice(1)} />
              <Input
                type="text"
                value={item[campo]}
                onChange={(e) => handleChange(index, campo, e.target.value)}
                className="w-1/1"
              />
            </div>
          ))}
        </div>
      ))}

      <Botao
        tipo="button"
        texto="Adicionar mais um"
        onClick={adicionarItem}
        className="bg-blue-500 text-white hover:bg-blue-600 w-fit"
      />
    </div>
  );
}
