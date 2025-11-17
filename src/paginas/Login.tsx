import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../componentes/Input";
import Botao from "../componentes/Botao";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensagem("Verificando...");

    try {
      const resposta = await fetch("https://api-associacao-idosos.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem(`✅  ${dados.message || "Login realizado com sucesso!"}`);
        localStorage.setItem("token", dados.token);
        
        setTimeout(() => navigate("/menu"), 1000);
      } else {
        setMensagem(`⚠️ ${dados.message || "Credenciais inválidas."}`);
      }
    } catch {
      setMensagem("❌ Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="w-screen min-h-screen flex bg-gray-200 box-border">
      {/* Lado esquerdo */}
      <div className="w-1/2 bg-gray-200 flex flex-col justify-center items-center text-black p-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-5xl font-bold">Apoio para Associações de Idosos</h1>
          <p className="text-lg max-w-md">
            Conecte-se e continue fazendo a diferença na vida dos idosos.
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="w-1/2 flex justify-center items-center p-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Bem-vindo de volta</h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
           
            <Input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              required
            />

            <Input 
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />

            <p className="text-center text-xl text-gray-600">
            Não possui conta?
            <Botao 
              tipo="button"
              onClick={() => navigate("/cadastro")}
              texto="Criar conta"
            />
            </p>

            <Botao 
              tipo="submit"
              texto="Entrar"
              className="bg-gradient-to-r from-purple-400 via-blue-300 to-purple-400 rounded-full shadow-md hover:shadow-lg transition-all text-lg font-semibold px-6 py-2"
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

