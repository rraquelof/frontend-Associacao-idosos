import FormularioVisita from "../../componentes/formularioVisita/FormularioVisita";

export default function CadastroVisita() {
  return (
    <FormularioVisita
      endpoint="https://api-associacao-idosos.onrender.com/api/visita"
      metodo="POST"
      textoBotao="Registrar Visita"
      tituloFormulario="Nova Visita"
    />
  );
}
