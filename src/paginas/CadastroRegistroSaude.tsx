import FormularioRegistroSaude from "../componentes/formularioRegistroSaude/FormularioRegistroSaude";

export default function CadastroSaudeIdoso() {
  return (
    <FormularioRegistroSaude
      tituloFormulario="Registro de Saúde do Idoso"
      endpoint="https://api-associacao-idosos.onrender.com/api/cadastrarConsulta"
      metodo="POST"
      textoBotao="Cadastrar registro"
    />
  );
}