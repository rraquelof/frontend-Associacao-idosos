interface BotaoProps {
  tipo?: "button" | "submit";
  onClick?: () => void;
  texto: string;
  className?: string;
}

const Botao = ({ tipo = "button", onClick, texto, className }: BotaoProps) => {
  return (
    <button
      type={tipo}
      onClick={onClick}
        className={`px-6 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {texto}
    </button>
  );
};

export default Botao;
