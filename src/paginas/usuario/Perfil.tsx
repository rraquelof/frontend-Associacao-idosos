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
import Layout from "../../componentes/layout/Layout";
import perfilIcon from "../../img/perfil.png";

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
  const [idososDisponiveis, setIdososDisponiveis] = useState<{ _id: string; nome: string }[]>([]);

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

  // Familiares vinculam a conta a um idoso específico, para que o acesso
  // deles fique restrito a esse idoso. A lista só precisa ser buscada
  // quando o usuário logado é do tipo "familiar".
  useEffect(() => {
    if (usuario?.tipo !== "familiar") return;

    fetch(`${BASE_URL}/idosos`, {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((dados) => setIdososDisponiveis(Array.isArray(dados) ? dados : []))
      .catch(() => {});
  }, [usuario?.tipo, token]);

  const nomeIdosoVinculado = idososDisponiveis.find(
    (i) => i._id === usuario?.idosoVinculado
  )?.nome;

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
    return <Layout><p className="text-center py-24">Carregando...</p></Layout>;
  }

  if (erro) {
    return <Layout><p className="text-center py-24 text-red-500">Erro: {erro}</p></Layout>;
  }

  if (!usuario) {
    return <Layout><p className="text-center py-24">Usuário não encontrado.</p></Layout>;
  }

  return (
    <Layout>
    <div className="w-full box-border flex flex-col items-center">
      <div className="text-black p-4 sm:p-6 w-full max-w-2xl flex items-center gap-4">
        <Botao onClick={() => navegacao("/menu")} className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100">
          <ChevronLeftIcon />
        </Botao>
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
          <img src={perfilIcon} alt="" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Meu Perfil</h1>
          <p className="text-gray-500 text-sm mt-0.5">Dados da conta e configurações</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col gap-4 mx-2 sm:mx-0">
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
              {usuario.tipo === "familiar" && (
                <CampoDetalhes
                  label="Idoso vinculado"
                  valor={nomeIdosoVinculado || "Nenhum idoso vinculado"}
                />
              )}
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <Label htmlFor="nome" texto="Nome" />
              <Input
                id="nome"
                name="nome"
                value={formDados.nome ?? ""}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="email" texto="E-mail" />
              <Input
                id="email"
                type="email"
                name="email"
                value={formDados.email ?? ""}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="telefone" texto="Telefone" />
              <Input
                id="telefone"
                type="tel"
                name="telefone"
                value={formDados.telefone ?? ""}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="endereco" texto="Endereço" />
              <Input
                id="endereco"
                name="endereco"
                value={formDados.endereco ?? ""}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="sexo" texto="Sexo" />
              <Select
                id="sexo"
                name="sexo"
                value={formDados.sexo ?? ""}
                onChange={handleChange}
                className="w-full"
              >
                <Option value="" texto="Selecione" />
                <Option value="feminino" texto="Feminino" />
                <Option value="masculino" texto="Masculino" />
              </Select>
            </div>

            {formDados.tipo === "familiar" && (
              <div className="flex flex-col">
                <Label htmlFor="idosoVinculado" texto="Idoso vinculado" />
                <Select
                  id="idosoVinculado"
                  name="idosoVinculado"
                  value={formDados.idosoVinculado ?? ""}
                  className="w-full"
                  onChange={handleChange}
                >
                  <Option value="" texto="Selecione o idoso" />
                  {idososDisponiveis.map((idoso) => (
                    <Option key={idoso._id} value={idoso._id} texto={idoso.nome} />
                  ))}
                </Select>
              </div>
            )}

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
    </Layout>
  );
}
