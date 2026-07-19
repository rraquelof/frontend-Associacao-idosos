export interface PontoGrafico {
  label: string;
  valor: number;
}

interface GraficoLinhaProps {
  titulo: string;
  dados: PontoGrafico[];
  unidade?: string;
  corLinha?: string;
  corArea?: string;
  corPonto?: string;
}

// Gráfico de linha simples em SVG puro (sem dependência externa), pensado
// para séries curtas como peso/glicemia ao longo das consultas de um idoso.
export default function GraficoLinha({
  titulo,
  dados,
  unidade = "",
  corLinha = "#2563eb",
  corArea = "#2563eb1a",
  corPonto = "#2563eb",
}: GraficoLinhaProps) {
  const largura = 600;
  const altura = 220;
  const margemEsquerda = 44;
  const margemDireita = 16;
  const margemTopo = 16;
  const margemBase = 32;

  const areaUtilLargura = largura - margemEsquerda - margemDireita;
  const areaUtilAltura = altura - margemTopo - margemBase;

  if (dados.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-bold text-gray-800 mb-4">{titulo}</p>
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
          Sem dados suficientes para exibir o gráfico.
        </div>
      </div>
    );
  }

  const valores = dados.map((d) => d.valor);
  const valorMin = Math.min(...valores);
  const valorMax = Math.max(...valores);
  // Evita divisão por zero quando só há um ponto ou todos os valores são iguais.
  const intervalo = valorMax - valorMin || 1;
  const folga = intervalo * 0.15;
  const min = valorMin - folga;
  const max = valorMax + folga;

  const x = (i: number) =>
    dados.length === 1
      ? margemEsquerda + areaUtilLargura / 2
      : margemEsquerda + (i / (dados.length - 1)) * areaUtilLargura;

  const y = (valor: number) =>
    margemTopo + areaUtilAltura - ((valor - min) / (max - min)) * areaUtilAltura;

  const pontos = dados.map((d, i) => ({ ...d, cx: x(i), cy: y(d.valor) }));

  const linhaPath = pontos
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`)
    .join(" ");

  const areaPath =
    pontos.length > 0
      ? `${linhaPath} L ${pontos[pontos.length - 1].cx.toFixed(1)} ${(margemTopo + areaUtilAltura).toFixed(1)} L ${pontos[0].cx.toFixed(1)} ${(margemTopo + areaUtilAltura).toFixed(1)} Z`
      : "";

  // Mostra no máximo ~6 rótulos no eixo X para não poluir em séries longas.
  const passoRotulo = Math.max(1, Math.ceil(dados.length / 6));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-bold text-gray-800">{titulo}</p>
        <p className="text-sm text-gray-400">
          Último: <span className="font-semibold text-gray-700">{valores[valores.length - 1]}{unidade}</span>
        </p>
      </div>

      <svg viewBox={`0 0 ${largura} ${altura}`} className="w-full h-auto">
        <line
          x1={margemEsquerda}
          y1={margemTopo}
          x2={margemEsquerda}
          y2={margemTopo + areaUtilAltura}
          stroke="#e5e7eb"
        />
        <line
          x1={margemEsquerda}
          y1={margemTopo + areaUtilAltura}
          x2={largura - margemDireita}
          y2={margemTopo + areaUtilAltura}
          stroke="#e5e7eb"
        />

        <text x={4} y={margemTopo + 4} fontSize="10" fill="#9ca3af">
          {max.toFixed(1)}
        </text>
        <text x={4} y={margemTopo + areaUtilAltura} fontSize="10" fill="#9ca3af">
          {min.toFixed(1)}
        </text>

        {areaPath && <path d={areaPath} fill={corArea} stroke="none" />}
        <path d={linhaPath} fill="none" stroke={corLinha} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {pontos.map((p, i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r={4} fill="white" stroke={corPonto} strokeWidth={2}>
              <title>{`${p.label}: ${p.valor}${unidade}`}</title>
            </circle>
            {i % passoRotulo === 0 && (
              <text
                x={p.cx}
                y={altura - 8}
                fontSize="9"
                fill="#9ca3af"
                textAnchor="middle"
              >
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
