import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../componentes/input/Input";
import Botao from "../../componentes/botao/Botao";
import Select from "../../componentes/select/Select";
import logo from "../../img/logo.png";

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    tipo: "",
    sexo: "",
    endereco: "",
    telefone: "",
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatCPF = (cpf: string) => {
    const numeros = cpf.replace(/\D/g, "");
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("Dados que serão enviados para a API:", formData);
    e.preventDefault();
    setMensagem("Enviando...");
    const dadosParaEnviar = {
      ...formData,
      cpf: formatCPF(formData.cpf),
    };

    try {
      const resposta = await fetch(
        "https://api-associacao-idosos.onrender.com/api/cadastrarUsuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosParaEnviar),
        }
      );
      console.log("Resposta da API:", resposta);

      const dados = await resposta.json();
      console.log("Corpo da resposta da API:", dados);

      if (resposta.ok) {
        setMensagem("✅ Usuário cadastrado com sucesso!");
        setFormData({
          nome: "",
          email: "",
          cpf: "",
          senha: "",
          tipo: "",
          sexo: "",
          endereco: "",
          telefone: "",
        });
      } else {
        setMensagem(`⚠️ ${dados.message || "Erro ao cadastrar usuário."}`);
      }
    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-slate-50 via-blue-50/40 to-emerald-50/40 box-border">
      {/* Lado esquerdo */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-slate-50 via-blue-50/40 to-emerald-50/40 flex flex-col justify-center items-center text-black p-6 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="SIGAAI" className="w-56 sm:w-72 h-auto" />
          <p className="text-gray-500 text-sm sm:text-base flex items-center gap-3 -mt-2">
            <span className="w-6 h-px bg-blue-600" />
            Sistema de gerenciamento de abrigo de idosos
            <span className="w-6 h-px bg-emerald-600" />
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4 sm:p-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-800">
            Entre na sua conta
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <Input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              required
            />

            <Input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="CPF (somente números)"
              required
            />

            <Input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha"
              required
            />

            <Select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Tipo de usuário</option>
              <option value="coordenador">Coordenador</option>
              <option value="voluntario">Voluntário</option>
              <option value="familiar">Familiar</option>
              <option value="enfermeiro">Enfermeiro</option>
            </Select>

            <Select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              required
            >
              <option value="">Sexo</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </Select>

            <Input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Endereço"
              required
            />

            <Input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Telefone"
              required
            />

            <p className="text-center text-base sm:text-xl text-gray-600 flex flex-wrap items-center justify-center gap-2">
              Já possui conta?
              <Botao
                tipo="button"
                onClick={() => navigate("/login")}
                texto="Fazer login"
              />
            </p>

            <Botao tipo="submit" texto="Cadastrar" variant="gradient" />

            {mensagem && (
              <p className="text-center text-sm mt-2 text-gray-700">
                {mensagem}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
