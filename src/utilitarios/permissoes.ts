import { obterTipoUsuarioLogado } from "./authUsuario";

// Páginas do sistema que têm acesso restrito por tipo de usuário.
// "Menu principal" e "Perfil" não entram aqui: todo usuário logado sempre acessa.
export type PaginaComPermissao = "idosos" | "eventos" | "saude" | "visitas";

// Combinado com a Lily: coordenador tem acesso total; os demais tipos têm
// acesso apenas às páginas relevantes para a função deles.
const ACESSO_POR_TIPO: Record<string, PaginaComPermissao[]> = {
  coordenador: ["idosos", "eventos", "saude", "visitas"],
  enfermeiro: ["idosos", "saude"],
  voluntario: ["eventos", "idosos", "visitas"],
  familiar: ["idosos", "eventos", "saude", "visitas"],
};

export function usuarioTemAcesso(pagina: PaginaComPermissao): boolean {
  const tipo = obterTipoUsuarioLogado();
  if (!tipo) return false;

  const permissoes = ACESSO_POR_TIPO[tipo.toLowerCase()];
  // Tipo desconhecido/não mapeado: libera acesso para não travar usuários
  // cadastrados antes dessa regra existir.
  if (!permissoes) return true;

  return permissoes.includes(pagina);
}
