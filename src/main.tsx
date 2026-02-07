import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cadastro from './paginas/Cadastro';
import Login from './paginas/Login';
import CadastroIdoso from './paginas/CadastroIdoso';
import Menu from './paginas/Menu';
import AtualizarIdoso from './paginas/AtualizarIdoso';
import ListaIdosos from './paginas/ListarIdosos';
import DetalharIdoso from './paginas/DetalharIdoso';
import DeletarIdoso from './paginas/DeletarIdoso';
import PrivacidadeRoute from './PrivacidadeRoute';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

createRoot(document.getElementById('root')!).render(
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path= "/cadastro" element={<Cadastro />}></Route>
        <Route path= "/login" element={<Login />}></Route>
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
      </Routes>
    </Router> 
)
