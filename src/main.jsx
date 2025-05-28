import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login.jsx'; 
import PanelUsuario from './Components/panelUsuario/PanelUsuario.jsx';
import PanelAdmin from './Components/panelAdmin/PanelAdmin.jsx';
import RegistroPQRS from './Components/RegistroPQRS/RegistroPQRS.jsx';
import CrearUsuario from './Components/crearUsuario/CrearUsuario.jsx';
import ConsultarPQRS from './Components/ConsultarPQRS/ConsultarPQRS.jsx';
import PqrsPendiente from './Components/pqrsPendiente/PqrsPendiente.jsx';
import PqrsAtendidas from './Components/pqrsAtendidas/PqrsAtendidas.jsx';
import UsuariosRegistrados from './Components/UsuariosRegistrados/UsuariosRegistrados.jsx';
import RestablecerContra from './Components/RestablecerContra/RestablecerContra.jsx';
import PqrsUsuario from './Components/pqrsUsuario/PqrsUsuario.jsx';
import Contra from './Components/RestablecerContra/Contra.jsx';




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