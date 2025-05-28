import React, { useState } from 'react';
import { supabase } from "../../supabaseClient";

import './RestablecerContra.css';

export default function RestablecerContrasena() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://pqrs-fastapi-react.vercel.app/Contra', // <- Esta debe ser la ruta correcta
      });
      setMensaje('Se ha enviado un enlace de restablecimiento al correo.');
    } catch (error) {
      setMensaje('Error al enviar el enlace de restablecimiento.');
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
      ¿Ya tienes cuenta? <a href="https://pqrs-fastapi-react.vercel.app/">Inicia sesion</a>
    </p>
  </form>
</div>
</div>

  );
}
