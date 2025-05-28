import React from 'react';
import { Link } from 'react-router-dom';
import './PanelUsuario.css';

export default function Dashboard() {
  const username = "Usuario";

  return (
    <div className="panelusuario">
      <header className="dashboard-header">
        <h2>Bienvenido, {username}</h2>
      </header>
      <div className="dashboard-grid">
        <Link to="/RegistroPQRS" className="dashboard-card">
          <img src="/crear.png" alt="Crear PQRS" />
          <p>Crear PQRS</p>
        </Link>
        <Link to="/PqrsUsuario" className="dashboard-card">
          <img src="/consultante.png" alt="Consulta de Estado PQRS" />
          <p>Consulta de estado</p>
        </Link>

        <Link to="/Login" className="dashboard-card">
          <img src="/cerrar-sesion.png" alt="Cerrar sesión" />
          <p>Cerrar sesión</p>
        </Link>
      </div>
    </div>
  );
}
