// Extrai o id do usuário logado a partir do token JWT salvo no localStorage.
// Confirmado com o código real da API (userController.ts -> login): o backend
// gera o token com jwt.sign({ id: user._id, tipo: user.tipo }, ...), então o
// payload sempre tem o campo "id".
export function obterIdUsuarioLogado(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    );
    const payload = JSON.parse(payloadJson);

    return payload.id ?? null;
  } catch {
    return null;
  }
}

// Extrai o tipo do usuário logado (coordenador, enfermeiro, voluntario, familiar)
// a partir do mesmo token JWT, usado para liberar/restringir acesso a páginas.
export function obterTipoUsuarioLogado(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    );
    const payload = JSON.parse(payloadJson);

    return payload.tipo ?? null;
  } catch {
    return null;
  }
}
