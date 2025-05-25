import React, { useState } from 'react';
import './RestablecerContra.css';

export default function RestablecerContrasena() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://tu-api.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje('Se ha enviado un enlace de restablecimiento al correo.');
      } else {
        setMensaje(data.error || 'Ocurrió un error.');
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="Fondo">
    <div className="formulario-restablecer">
  <h1 className="titulo">Restablecer contraseña</h1>
  <p className="subtitulo">Ingresa tu correo electrónico para restablecer la contraseña.</p>

  <form onSubmit={handleSubmit}>
    <label htmlFor="email" className="etiqueta">Correo electrónico</label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="entrada"
      placeholder="Ingresa tu correo"
      required
    />

    <button type="submit" className="boton">
      <svg xmlns="http://www.w3.org/2000/svg" className="fotollave" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
      <span>Enviar enlace</span>
    </button>

    {mensaje && <p className="mensaje">{mensaje}</p>}

    <p className="registro">
      ¿No tienes cuenta? <a href="/CrearUsuario">Regístrate</a>
    </p>
    <p className="inicio">
      ¿Ya tienes cuenta? <a href="/Login">Inicia sesion</a>
    </p>
  </form>
</div>
</div>

  );
}
