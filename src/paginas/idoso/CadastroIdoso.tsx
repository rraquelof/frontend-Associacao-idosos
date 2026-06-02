import FormularioIdoso from "../../componentes/formularioIdoso/FormularioIdoso";

export default function CadastroIdoso() {
  return (
    <FormularioIdoso
      endpoint="https://api-associacao-idosos.onrender.com/api/cadastrarIdoso"
      metodo="POST"
      textoBotao="Cadastrar"
    />
  );
}
