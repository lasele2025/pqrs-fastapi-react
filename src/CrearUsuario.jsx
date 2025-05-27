import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "./supabaseClient.js"; 
import './CrearUsuario.css';

const CrearUsuario = () => {
  const [tipoPersona, setTipoPersona] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const esCorreoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const esNombreValido = (nombre) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!esNombreValido(nombre)) {
      setError('El nombre solo debe contener letras y espacios');
      return;
    }

    if (!esCorreoValido(email)) {
      setError('El correo electrónico no es válido');
      return;
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }


// Registro en Supabase con verificación
console.log('Registrando con:', { email, password, nombre, tipo_usuario: tipoPersona });

const { data, error: errorSupabase } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      nombre,
      tipo_usuario: tipoPersona
    }
  }
});



    if (errorSupabase) {
      setError(errorSupabase.message);
      return;
    }

    setMensaje('Te hemos enviado un correo para confirmar tu cuenta.');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-section">
          <img src="/LogoCole.png" alt="Registro" className="support-image" />
        </div>

        <div className="right-section">
          <h2 className="login-title">Registro</h2>

          <form onSubmit={manejarRegistro}>
            <label>Tipo de persona</label>
            <select value={tipoPersona} onChange={(e) => setTipoPersona(e.target.value)} required>
              <option value="">Selecciona una opción</option>
              <option value="Profesor o empleado">Profesor o empleado</option>
              <option value="Padre de familia">Padre de familia</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Otro">Otro</option>
            </select>

            <label>Nombre completo</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type={mostrarPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirmar contraseña</label>
            <input
              type={mostrarPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />

            <div style={{ marginBottom: '10px' }}>
              <input
                type="checkbox"
                id="mostrarPassword"
                checked={mostrarPassword}
                onChange={() => setMostrarPassword(!mostrarPassword)}
              />
              <label htmlFor="mostrarPassword" style={{ color: 'white', marginLeft: '8px' }}>
                Mostrar contraseñas
              </label>
            </div>

            {error && <p className="error">{error}</p>}
            {mensaje && <p className="mensaje-exito">{mensaje}</p>}

            <button type="submit">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuario;

