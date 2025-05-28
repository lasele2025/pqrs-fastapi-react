import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../supabaseClient.js"; 
import { Link } from 'react-router-dom';
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
  
    console.log('Registrando con:', { email, password, nombre, tipo_usuario: tipoPersona });
  
    // 1. Registrar en Supabase Auth
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
      console.error("Error en Supabase Auth:", errorSupabase.message);
      setError(errorSupabase.message);
      return;
    }
  
    // 2. Registrar en el backend (si se requiere)
// 2. Registrar en el backend (FastAPI)
try {
  const response = await fetch("https://pqrsfastapi-production.up.railway.app/usuarios/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      nombre,
      password,  // <---- 🔥 este campo faltaba
      tipo_usuario: tipoPersona
    })
  });

  if (!response.ok) {
    const texto = await response.text();
    console.warn("Respuesta del backend no OK pero con cuerpo:", texto);
    // Si ya registró correctamente, no mostramos error al usuario
    // throw new Error("No se pudo registrar en el backend");
  }
  {mensaje && <p className="mensaje-exito">{mensaje}</p>}

  setMensaje('Registro exitoso. Revisa tu correo electrónico y confirma tu cuenta para poder iniciar sesión.');
  
} catch (err) {
  console.error("Error en el registro del backend:", err.message);
  setError("Error al registrar en el sistema");
}

  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-section">
          <img src="/LogoCole.png" alt="Registro" className="support-image" />
        </div>

        <div className="right-section">
          <h2 className="login-title">Registro</h2>
<p className="texto-redireccion">
  ¿Ya tienes una cuenta? <Link to="/Login">Inicia aquí</Link>
</p>


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

            <div style={{ marginBottom: '0px' }}>
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

