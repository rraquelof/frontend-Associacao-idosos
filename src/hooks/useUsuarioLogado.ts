import { useEffect, useState } from "react";
import type Usuario from "../modelo/Usuario";
import { obterIdUsuarioLogado } from "../utilitarios/authUsuario";

const API_URL = "https://api-associacao-idosos.onrender.com/api";

// Busca os dados completos (incluindo idosoVinculado, no caso de familiares)
// do usuário logado. Usado nas páginas que precisam restringir o que é
// mostrado com base no tipo de usuário.
export function useUsuarioLogado() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const idUsuario = obterIdUsuarioLogado();
    if (!idUsuario) {
      setCarregando(false);
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/usuario/${idUsuario}`, {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((dados) => setUsuario(dados))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  return { usuario, carregando };
}
