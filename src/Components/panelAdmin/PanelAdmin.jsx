import React from 'react';
import { Link } from 'react-router-dom';
import './PanelAdmin.css';

export default function Dashboard() {
  const username = "";

  return (
    <div className="panel-admin">
      <div className="dashboard">
        <header className="dashboard-header">
          <h2>Bienvenido, {username}</h2>
        </header>
        <div className="dashboard-grid">
          <Link to="/PqrsPendiente" className="dashboard-card">
            <img src="/pendiente.png" alt="Solicitudes pendientes de PQRS" />
            <p>Solicitudes pendientes de PQRS</p>
          </Link>
          <Link to="/PqrsAtendidas" className="dashboard-card">
            <img src="/cerrada.png" alt="Solicitudes atendidas de PQRS" />
            <p>Solicitudes atendidas de PQRS</p>
          </Link>
          <Link to="/UsuariosRegistrados" className="dashboard-card">
            <img src="/usuario.png" alt="Usuarios" />
            <p>Usuarios Registrados</p>
          </Link>

          <Link to="/Login" className="dashboard-card">
            <img src="/cerrar-sesion.png" alt="Cerrar sesión" />
            <p>Cerrar sesión</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
