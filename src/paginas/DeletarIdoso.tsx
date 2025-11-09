import { useNavigate, useParams } from "react-router-dom";

async function deletarIdoso(id: number) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(
    `https://api-associacao-idosos.onrender.com/api/idoso/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao deletar idoso");
  }
}

export default function DeletarIdoso() {
  const { id } = useParams();
  const navigate = useNavigate();

  async function confirmarDelete() {
    if (!id) return;

    try {
      await deletarIdoso(Number(id));
      navigate("/lista/idosos");
    } catch {
      alert("Erro ao excluir idoso.");
    }
  }


}