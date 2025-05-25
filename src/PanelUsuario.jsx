import React from 'react';
import { Link } from 'react-router-dom';
import './PanelUsuario.css';

export default function Dashboard() {
  const username = "Royer";

  return (
    <div className="panelusuario">
      <header className="dashboard-header">
        <h2>Bienvenido, {username}</h2>
      </header>
      <div className="dashboard-grid">
        <Link to="/RegistroPQRS" className="dashboard-card">
          <img src="/public/crear.png" alt="Crear PQRS" />
          <p>Crear PQRS</p>
        </Link>
        <Link to="/PqrsUsuario" className="dashboard-card">
          <img src="/public/consultante.png" alt="Consulta de Estado PQRS" />
          <p>Consulta de estado</p>
        </Link>
        <Link to="/ayuda" className="dashboard-card">
          <img src="/public/ayuda.png" alt="Ayuda" />
          <p>Ayuda</p>
        </Link>
        <Link to="/Login" className="dashboard-card">
          <img src="/public/cerrar-sesion.png" alt="Cerrar sesión" />
          <p>Cerrar sesión</p>
        </Link>
      </div>
    </div>
  );
}
