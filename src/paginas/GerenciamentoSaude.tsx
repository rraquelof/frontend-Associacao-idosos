import { useNavigate } from "react-router-dom";
import Botao from "../componentes/botao/Botao";
import { ChevronLeftIcon } from "lucide-react";

export default function GerenciamentoSaude() {
  const navegacao = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-gray-200 flex flex-col items-center justify-center p-8 relative">
      <Botao
        className="absolute left-6 top-6 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
        onClick={() => navegacao("/menu")} 
      >
        <ChevronLeftIcon />
      </Botao>

      <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-lg">
        
        <div className="text-black mb-6">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            <path d="M12 8v6"/>
            <path d="M9 11h6"/>
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gerenciamento de Saúde</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Esta funcionalidade está <strong>em desenvolvimento</strong>. <br/>
          Em breve, você poderá gerenciar medicamentos, prontuários, consultas e o histórico médico de cada idoso por aqui!
        </p>
        
        <Botao 
          texto="Voltar ao Início" 
          onClick={() => navegacao("/menu")}
          className="mt-8 bg-blue-600 text-white hover:bg-blue-700 px-8 py-3"
        />
      </div>
    </div>
  );
}