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

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Confirmar Exclusão
        </h1>
        <p className="text-black mb-6">
          Tem certeza que deseja excluir este idoso?
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={confirmarDelete}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Excluir
          </button>

          <button
            onClick={() => navigate("/lista/idosos")}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}