import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cadastro from './paginas/Cadastro';
import Login from './paginas/Login';
import CadastroIdoso from './paginas/CadastroIdoso';
import Menu from './paginas/Menu';
import AtualizarIdoso from './paginas/AtualizarIdoso';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/cadastro' element={<Cadastro />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/cadastro/idoso' element={<CadastroIdoso />}></Route>
        <Route path='/atualizar/idoso' element={<AtualizarIdoso />}></Route>
        <Route path='/menu' element={<Menu/>}></Route>
      </Routes>
    </Router>
  </StrictMode>,
)
