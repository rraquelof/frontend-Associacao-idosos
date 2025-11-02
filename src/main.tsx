import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cadastro from './Cadastro';
import Login from './Login';
import CadastroIdoso from './CadastroIdoso';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/cadastro' element={<Cadastro />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/cadastro/idoso' element={<CadastroIdoso />}></Route>
      </Routes>
    </Router>
  </StrictMode>,
)
