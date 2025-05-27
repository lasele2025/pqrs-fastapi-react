import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx'; 
import PanelUsuario from './PanelUsuario.jsx';
import PanelAdmin from './PanelAdmin.jsx';
import RegistroPQRS from './RegistroPQRS.jsx';
import CrearUsuario from './CrearUsuario.jsx';
import ConsultarPQRS from './ConsultarPQRS.jsx';
import PqrsPendiente from './PqrsPendiente.jsx';
import PqrsAtendidas from './PqrsAtendidas.jsx';
import UsuariosRegistrados from './UsuariosRegistrados.jsx';
import RestablecerContra from './RestablecerContra.jsx';
import PqrsUsuario from './PqrsUsuario.jsx';
import Contra from './Contra.jsx';




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/PanelUsuario" element={<PanelUsuario />} />
        <Route path="/PanelAdmin" element={<PanelAdmin />} />
        <Route path="/RegistroPQRS" element={<RegistroPQRS />} />
        <Route path="/CrearUsuario" element={<CrearUsuario />} />
        <Route path="/ConsultarPQRS" element={<ConsultarPQRS />} />
        <Route path="/PqrsPendiente" element={<PqrsPendiente />} />
        <Route path="/PqrsAtendidas" element={<PqrsAtendidas />} />
        <Route path="/UsuariosRegistrados" element={<UsuariosRegistrados />} />
        <Route path="/RestablecerContra" element={<RestablecerContra />} />
        <Route path="/PqrsUsuario" element={<PqrsUsuario />} />
        <Route path="/Contra" element={<Contra />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);