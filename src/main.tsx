import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom"; 
import Cadastro from './paginas/Cadastro';
import Login from './paginas/Login';
import CadastroIdoso from './paginas/CadastroIdoso';
import Menu from './paginas/Menu';
import AtualizarIdoso from './paginas/AtualizarIdoso';
import ListaIdosos from './paginas/ListarIdosos';
import DetalharIdoso from './paginas/DetalharIdoso';
import DeletarIdoso from './paginas/DeletarIdoso';
import PrivacidadeRoute from './PrivacidadeRoute';
import ListarRegistroSaudeIdoso from './paginas/ListarRegistroSaude';
import CadastroSaudeIdoso from './paginas/CadastroRegistroSaude';
import DetalharRegistroSaude from './paginas/DetalharRegistroSaude';
import DeletarRegistroSaude from './paginas/DeletarRegistroSaude';
import Eventos from './paginas/Eventos';
import FormularioEvento from './componentes/FormularioEvento/FormularioEvento';
import DetalharEvento from './paginas/DetalharEvento';

function EdicaoEventoWrapper() {
  const { id } = useParams();
  return <FormularioEvento eventoId={id} />;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

createRoot(document.getElementById('root')!).render(
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/cadastro" element={<Cadastro />}></Route>
      <Route path="/login" element={<Login />}></Route>

      <Route path="/menu"
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
          </PrivacidadeRoute>} />

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
            <DetalharRegistroSaude />
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

    </Routes>

  </Router>
);