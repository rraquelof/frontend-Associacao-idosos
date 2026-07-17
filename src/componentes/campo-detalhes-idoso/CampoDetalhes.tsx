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
    <p className="text-gray-800">
      <strong>{label}:</strong> {valorFormatado}
    </p>
  );
}
