import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../componentes/Input";
import Botao from "../componentes/Botao/Botao";
import Select from "../componentes/Select";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const resposta = await fetch("https://api-associacao-idosos.onrender.com/api/cadastrarUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });
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
    <div className="w-screen min-h-screen flex bg-gray-200 box-border">
      {/* Lado esquerdo */}
      <div className="w-1/2 bg-gray-200 flex flex-col justify-center items-center text-black p-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-5xl font-bold">Apoio para Associações de Idosos</h1>
          <p className="text-lg max-w-md">
            Juntos construímos um envelhecimento mais digno e ativo.
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="w-1/2 flex justify-center items-center p-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Entre na sua conta</h2>

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
              required>
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
              required>
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
            
            <p className="text-center text-xl text-gray-600">
              Já possui conta?
              <Botao
                tipo="button"
                onClick={() => navigate("/login")} 
                texto="Fazer login"
              />
            </p>

            <Botao 
              tipo="submit"
              texto="Cadastrar"
              variant="gradient"
            />

            {mensagem && (
              <p className="text-center text-sm mt-2 text-gray-700">{mensagem}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
