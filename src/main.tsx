import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cadastro from './Cadastro';
import Login from './Login';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/cadastro' element={<Cadastro />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </Router>
  </StrictMode>,
)
