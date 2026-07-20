import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { usuarioTemAcesso, type PaginaComPermissao } from "./utilitarios/permissoes";

interface Props {
  children: ReactNode;
  pagina?: PaginaComPermissao;
}

export default function PrivacidadeRoute({ children, pagina }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (pagina && !usuarioTemAcesso(pagina)) {
    return <Navigate to="/menu" replace />;
  }

  return children;
}
