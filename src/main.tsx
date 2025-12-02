import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cadastro from './paginas/Cadastro';
import Login from './paginas/Login';
import CadastroIdoso from './paginas/CadastroIdoso';
import Menu from './paginas/Menu';
import AtualizarIdoso from './paginas/AtualizarIdoso';
import ListaIdosos from './paginas/ListarIdosos';
import DetalharIdoso from './paginas/DetalharIdoso';
import DeletarIdoso from './paginas/DeletarIdoso';

createRoot(document.getElementById('root')!).render(
    <Router>
      <Routes>
        <Route path='/cadastro' element={<Cadastro />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/cadastro/idoso' element={<CadastroIdoso />}></Route>
        <Route path='/atualizar/idoso/:id' element={<AtualizarIdoso />}></Route>
        <Route path='/lista/idosos' element={<ListaIdosos />}></Route>
        <Route path="/deletar/idoso/:id" element={<DeletarIdoso />}></Route>
        <Route path='/dados/idoso/:id' element={<DetalharIdoso />}></Route>
        <Route path='/menu' element={<Menu/>}></Route>
      </Routes>
    </Router>
)
