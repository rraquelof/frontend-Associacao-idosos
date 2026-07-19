import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../componentes/input/Input";
import Botao from "../../componentes/botao/Botao";
import Label from "../../componentes/label/Label";
import logo from "../../img/logo.png";

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
      const resposta = await fetch(
        "https://api-associacao-idosos.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

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
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
            Bem-vindo de volta
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Acesse sua conta para continuar
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <Label htmlFor="email" texto="E-mail" />
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="senha" texto="Senha" />
              <Input
                id="senha"
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Sua senha"
                required
                className="w-full"
              />
            </div>

            <p className="text-center text-base sm:text-xl text-gray-600 flex flex-wrap items-center justify-center gap-2">
              Não possui conta?
              <Botao
                tipo="button"
                onClick={() => navigate("/cadastro")}
                texto="Criar conta"
              />
            </p>

            <Botao tipo="submit" texto="Entrar" variant="gradient" />

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
