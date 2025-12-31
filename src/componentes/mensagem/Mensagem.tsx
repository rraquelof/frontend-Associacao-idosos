import { useEffect } from "react";

interface MensagemProps {
    texto: string;
    tipo?: "sucesso" | "erro" | "informacao"
    onClose?: () => void
}

export default function Mensagem({ texto, tipo, onClose }: MensagemProps) {
    useEffect(() => {
        const tempo =  setTimeout(() => {
            onClose?.();
        }, 3000);

        return () => clearTimeout(tempo);
    }, [onClose]);

    const corFundo = tipo === "sucesso"
      ? "bg-green-500 text-white"
      : tipo === "erro"
      ? "bg-red-500 text-white"
      : "bg-blue-500 text-white";
      
    return (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg ${corFundo} transition-opacity duration-500`}>
            {texto}
        </div>
    );
}