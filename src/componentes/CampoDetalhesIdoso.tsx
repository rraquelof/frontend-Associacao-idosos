export default function CampoDetalhesIdoso({
  label,
  valor,
}: {
  label: string;
  valor?: string;
}) {
  if (!valor) return null; // não renderiza nada se estiver vazio

  return (
    <p className="text-gray-800">
      <strong>{label}:</strong> {valor}
    </p>
  );
}
