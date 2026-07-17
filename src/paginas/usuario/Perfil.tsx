import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import Botao from "../../componentes/botao/Botao";
import Input from "../../componentes/input/Input";
import Label from "../../componentes/label/Label";
import Select from "../../componentes/select/Select";
import Option from "../../componentes/option/Option";
import CampoDetalhes from "../../componentes/campo-detalhes-idoso/CampoDetalhes";
import Mensagem from "../../componentes/mensagem/Mensagem";
import type Usuario from "../../modelo/Usuario";
import { obterIdUsuarioLogado } from "../../utilitarios/authUsuario";

// Endpoints confirmados direto no código da API (userRoutes.ts / userController.ts):
// GET  /api/usuario/:id  -> getUserById
// PUT  /api/usuario/:id  -> updateUser
const BASE_URL = "https://api-associacao-idosos.onrender.com/api";

export default function Perfil() {
  const navegacao = useNavigate();
  const token = localStorage.getItem("token");
  const idUsuario = obterIdUsuarioLogado();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [formDados, setFormDados] = useState<Partial<Usuario>>({});
  const [editando, setEditando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "informacao">(
    "informacao"
  );

  useEffect(() => {
    async function buscarUsuario() {
      if (!idUsuario) {
        setErro(
          "Não foi possível identificar o usuário logado a partir do token."
        );
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(`${BASE_URL}/usuario/${idUsuario}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!resposta.ok) {
          throw new Error("Erro ao buscar os dados do usuário");
        }

        const dados = await resposta.json();
        const usuarioCarregado = { ...dados, id: dados.id ?? dados._id };
        setUsuario(usuarioCarregado);
        setFormDados(usuarioCarregado);
      } catch (err) {
        setErro((err as Error).message);
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuario();
  }, [idUsuario, token]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormDados({
      ...formDados,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idUsuario) return;

    setMensagem("Salvando...");
    setTipoMensagem("informacao");

    try {
      const resposta = await fetch(`${BASE_URL}/usuario/${idUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formDados),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setUsuario({ ...(formDados as Usuario) });
        setMensagem("✅ Perfil atualizado com sucesso!");
        setTipoMensagem("sucesso");
        setEditando(false);
      } else {
        setMensagem(`⚠️ ${dados.message || "Erro ao atualizar perfil."}`);
        setTipoMensagem("erro");
      }
    } catch {
      setMensagem("❌ Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navegacao("/login");
  };

  const handleExcluir = async () => {
    if (!idUsuario) return;

    setMensagem("Excluindo perfil...");
    setTipoMensagem("informacao");

    try {
      const resposta = await fetch(`${BASE_URL}/usuario/${idUsuario}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.removeItem("token");
        setMensagem("✅ Perfil excluído com sucesso.");
        setTipoMensagem("sucesso");
        setTimeout(() => navegacao("/login"), 1500);
      } else {
        setMensagem(`⚠️ ${dados.message || "Erro ao excluir perfil."}`);
        setTipoMensagem("erro");
        setConfirmandoExclusao(false);
      }
    } catch {
      setMensagem("❌ Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
      setConfirmandoExclusao(false);
    }
  };

  if (carregando) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  if (erro) {
    return <p className="text-center mt-10 text-red-500">Erro: {erro}</p>;
  }

  if (!usuario) {
    return <p className="text-center mt-10">Usuário não encontrado.</p>;
  }

  return (
    <div className="w-screen min-h-screen bg-gray-200 box-border flex flex-col items-center">
      <div className="text-black p-6 w-full flex items-center relative">
        <Botao
          className="absolute left-0 top-3"
          onClick={() => navegacao("/menu")}
        >
          <ChevronLeftIcon />
        </Botao>
        <h1 className="text-3xl font-bold text-center w-full">Meu Perfil</h1>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4">
        {confirmandoExclusao ? (
          <div className="text-center py-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Confirmar exclusão
            </h2>
            <p className="text-black mb-6">
              Tem certeza que deseja excluir seu perfil? Essa ação não pode
              ser desfeita.
            </p>
            <div className="flex gap-4 justify-center">
              <Botao texto="Excluir" variant="delete" onClick={handleExcluir} />
              <Botao
                texto="Cancelar"
                onClick={() => setConfirmandoExclusao(false)}
              />
            </div>
          </div>
        ) : !editando ? (
          <>
            <div className="flex flex-wrap gap-4">
              <CampoDetalhes label="Nome" valor={usuario.nome} />
              <CampoDetalhes label="E-mail" valor={usuario.email} />
              <CampoDetalhes label="CPF" valor={usuario.cpf} />
              <CampoDetalhes label="Tipo de usuário" valor={usuario.tipo} />
              <CampoDetalhes label="Sexo" valor={usuario.sexo} />
              <CampoDetalhes label="Endereço" valor={usuario.endereco} />
              <CampoDetalhes label="Telefone" valor={usuario.telefone} />
            </div>

            <div className="flex gap-4 mt-6 justify-center flex-wrap">
              <Botao
                texto="Editar perfil"
                variant="update"
                onClick={() => setEditando(true)}
              />
              <Botao texto="Sair" variant="delete" onClick={handleLogout} />
              <Botao
                texto="Excluir perfil"
                variant="delete"
                onClick={() => setConfirmandoExclusao(true)}
              />
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="nome" texto="Nome" />
              <Input
                id="nome"
                name="nome"
                value={formDados.nome ?? ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" texto="E-mail" />
              <Input
                id="email"
                type="email"
                name="email"
                value={formDados.email ?? ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone" texto="Telefone" />
              <Input
                id="telefone"
                type="tel"
                name="telefone"
                value={formDados.telefone ?? ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="endereco" texto="Endereço" />
              <Input
                id="endereco"
                name="endereco"
                value={formDados.endereco ?? ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="sexo" texto="Sexo" />
              <Select
                id="sexo"
                name="sexo"
                value={formDados.sexo ?? ""}
                onChange={handleChange}
              >
                <Option value="" texto="Selecione" />
                <Option value="feminino" texto="Feminino" />
                <Option value="masculino" texto="Masculino" />
              </Select>
            </div>

            <div className="flex gap-4 mt-4 justify-center">
              <Botao tipo="submit" texto="Salvar" variant="gradient" />
              <Botao
                tipo="button"
                texto="Cancelar"
                onClick={() => {
                  setFormDados(usuario);
                  setEditando(false);
                }}
              />
            </div>
          </form>
        )}

        {mensagem && (
          <Mensagem
            texto={mensagem}
            tipo={tipoMensagem}
            onClose={() => setMensagem("")}
          />
        )}
      </div>
    </div>
  );
}
