export default function CampoDetalhes({
  label,
  valor,
}: {
  label: string;
  valor?: string | Date | number;
}) {
  if (!valor) return null; 

  const valorFormatado =
    valor instanceof Date
      ? valor.toLocaleDateString("pt-BR")
      : valor;

  return (
    <div className="flex-1 min-w-[180px] bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-gray-800 font-medium break-words">
        {valorFormatado}
      </span>
    </div>
  );
}
