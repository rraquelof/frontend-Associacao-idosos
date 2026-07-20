import { createRoot } from "react-dom/client";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Cadastro from "./paginas/usuario/Cadastro";
import Login from "./paginas/usuario/Login";
import CadastroIdoso from "./paginas/idoso/CadastroIdoso";
import Menu from "./paginas/Menu";
import AtualizarIdoso from "./paginas/idoso/AtualizarIdoso";
import ListaIdosos from "./paginas/idoso/ListarIdosos";
import DetalharIdoso from "./paginas/idoso/DetalharIdoso";
import DeletarIdoso from "./paginas/idoso/DeletarIdoso";
import RelatorioSaudeIdoso from "./paginas/idoso/RelatorioSaudeIdoso";
import PrivacidadeRoute from "./PrivacidadeRoute";
import ListarRegistroSaudeIdoso from "./paginas/registroSaude/ListarRegistroSaude";
import CadastroSaudeIdoso from "./paginas/registroSaude/CadastroRegistroSaude";
import DetalharRegistroSaude from "./paginas/registroSaude/DetalharRegistroSaude";
import DeletarRegistroSaude from "./paginas/registroSaude/DeletarRegistroSaude";
import AtualizarRegistroSaude from "./paginas/registroSaude/AtualizarRegistroSaude";
import Eventos from "./paginas/evento/Eventos";
import FormularioEvento from "./componentes/formularioEvento/FormularioEvento";
import DetalharEvento from "./paginas/evento/DetalharEvento";
import ListarVisitas from "./paginas/visita/ListarVisitas";
import CadastroVisita from "./paginas/visita/CadastroVisita";
import AtualizarVisita from "./paginas/visita/AtualizarVisita";
import DeletarVisita from "./paginas/visita/DeletarVisita";
import DetalhesVisita from "./paginas/visita/DetalhesVisita";
import Perfil from "./paginas/usuario/Perfil";

function EdicaoEventoWrapper() {
  const { id } = useParams();
  return <FormularioEvento eventoId={id} />;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/cadastro" element={<Cadastro />}></Route>
      <Route path="/login" element={<Login />}></Route>

      <Route
        path="/menu"
        element={
          <PrivacidadeRoute>
            <Menu />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/lista/idosos"
        element={
          <PrivacidadeRoute pagina="idosos">
            <ListaIdosos />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/cadastro/idoso"
        element={
          <PrivacidadeRoute pagina="idosos">
            <CadastroIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/atualizar/idoso/:id"
        element={
          <PrivacidadeRoute pagina="idosos">
            <AtualizarIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/dados/idoso/:id"
        element={
          <PrivacidadeRoute pagina="idosos">
            <DetalharIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/deletar/idoso/:id"
        element={
          <PrivacidadeRoute pagina="idosos">
            <DeletarIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/eventos"
        element={
          <PrivacidadeRoute pagina="eventos">
            <Eventos />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/eventos/novo"
        element={
          <PrivacidadeRoute pagina="eventos">
            <FormularioEvento />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/eventos/editar/:id"
        element={
          <PrivacidadeRoute pagina="eventos">
            <EdicaoEventoWrapper />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/eventos/detalhes/:id"
        element={
          <PrivacidadeRoute pagina="eventos">
            <DetalharEvento />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/lista/registro/saude"
        element={
          <PrivacidadeRoute pagina="saude">
            <ListarRegistroSaudeIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/registro/saude"
        element={
          <PrivacidadeRoute pagina="saude">
            <CadastroSaudeIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/dados/saude/:id"
        element={
          <PrivacidadeRoute pagina="saude">
            <DetalharRegistroSaude />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/relatorio/idoso/:id"
        element={
          <PrivacidadeRoute pagina="saude">
            <RelatorioSaudeIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/atualizar/registro/saude/:id"
        element={
          <PrivacidadeRoute pagina="saude">
            <AtualizarRegistroSaude />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/deletar/registro/saude/:id"
        element={
          <PrivacidadeRoute pagina="saude">
            <DeletarRegistroSaude />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/lista/visitas"
        element={
          <PrivacidadeRoute pagina="visitas">
            <ListarVisitas />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/cadastro/visita"
        element={
          <PrivacidadeRoute pagina="visitas">
            <CadastroVisita />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/atualizar/visita/:id"
        element={
          <PrivacidadeRoute pagina="visitas">
            <AtualizarVisita />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/deletar/visita/:id"
        element={
          <PrivacidadeRoute pagina="visitas">
            <DeletarVisita />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/dados/visita/:id"
        element={
          <PrivacidadeRoute pagina="visitas">
            <DetalhesVisita />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <PrivacidadeRoute>
            <Perfil />
          </PrivacidadeRoute>
        }
      />
    </Routes>
  </Router>,
);

