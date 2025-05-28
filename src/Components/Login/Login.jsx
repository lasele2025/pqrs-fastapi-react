import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "../../supabaseClient";

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Intentar login con Supabase Auth
    const { data, error: errorSupabase } = await supabase.auth.signInWithPassword({
      email,
      password: contraseña
    });

    if (errorSupabase) {
      setError('Correo o contraseña incorrectos');
      return;
    }

    // Obtener los datos del perfil (usuario) desde tu tabla de backend si es necesario
    try {
      const respuesta = await fetch(`https://pqrsfastapi-production.up.railway.app/usuarios/`);
      const usuarios = await respuesta.json();

      const usuarioEncontrado = usuarios.find(u => u.email === email);

      if (usuarioEncontrado) {
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));

        if (usuarioEncontrado.tipo_usuario === 'admin') {
          navigate('/PanelAdmin');
        } else {
          navigate('/PanelUsuario');
        }
      } else {
        setError('Usuario no encontrado en el sistema');
      }
    } catch (err) {
      console.error('Error al buscar el usuario:', err);
      setError('Ocurrió un error al buscar el usuario');
    }
  };

  return (
    <div className="contenedorlogin">
      <div className="login-box">
        <div className="left-section">
          <img src="/LogoCole.png" alt="Atención al cliente" className="support-image" />
        </div>

        <div className="right-section">
          <h1 className="welcome">Bienvenido al sistema <strong>PQRS</strong></h1>
          <p className="register-text">
            ¿No tienes cuenta? <Link to="/CrearUsuario">Regístrate</Link>
          </p>

          <h2 className="login-title">Inicia sesión</h2>

          <form onSubmit={manejarLogin}>
            <label>Ingresa tu correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Ingresa tu contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />

            {error && <p className="error">{error}</p>}

            <button className="BotoRegistro" type="submit">Iniciar sesión</button>
            <Link to="/RestablecerContra" className="botonOlvideContraseña">
              ¿Olvidó la contraseña?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
