export default function CampoDetalhesIdoso({
  label,
  valor,
}: {
  label: string;
  valor?: string | Date;
}) {
  if (!valor) return null; // não renderiza se estiver vazio

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
