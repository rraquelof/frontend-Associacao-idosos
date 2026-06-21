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
          <PrivacidadeRoute>
            <ListaIdosos />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/cadastro/idoso"
        element={
          <PrivacidadeRoute>
            <CadastroIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/atualizar/idoso/:id"
        element={
          <PrivacidadeRoute>
            <AtualizarIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/dados/idoso/:id"
        element={
          <PrivacidadeRoute>
            <DetalharIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/deletar/idoso/:id"
        element={
          <PrivacidadeRoute>
            <DeletarIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/eventos"
        element={
          <PrivacidadeRoute>
            <Eventos />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/eventos/novo"
        element={
          <PrivacidadeRoute>
            <FormularioEvento />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/eventos/editar/:id"
        element={
          <PrivacidadeRoute>
            <EdicaoEventoWrapper />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/eventos/detalhes/:id"
        element={
          <PrivacidadeRoute>
            <DetalharEvento />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/lista/registro/saude"
        element={
          <PrivacidadeRoute>
            <ListarRegistroSaudeIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/registro/saude"
        element={
          <PrivacidadeRoute>
            <CadastroSaudeIdoso />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/dados/saude/:id"
        element={
          <PrivacidadeRoute>
            <DetalharRegistroSaude />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/atualizar/registro/saude/:id"
        element={
          <PrivacidadeRoute>
            <AtualizarRegistroSaude />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/deletar/registro/saude/:id"
        element={
          <PrivacidadeRoute>
            <DeletarRegistroSaude />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/lista/visitas"
        element={
          <PrivacidadeRoute>
            <ListarVisitas />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/cadastro/visita"
        element={
          <PrivacidadeRoute>
            <CadastroVisita />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/atualizar/visita/:id"
        element={
          <PrivacidadeRoute>
            <AtualizarVisita />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/deletar/visita/:id"
        element={
          <PrivacidadeRoute>
            <DeletarVisita />
          </PrivacidadeRoute>
        }
      />

      <Route
        path="/dados/visita/:id"
        element={
          <PrivacidadeRoute>
            <DetalhesVisita />
          </PrivacidadeRoute>
        }
      />
    </Routes>
  </Router>,
);

