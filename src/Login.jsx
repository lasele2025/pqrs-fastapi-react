import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
  
    try {
      const respuesta = await fetch('https://pqrsfastapi-production.up.railway.app/usuarios/');
      const usuarios = await respuesta.json();
  
      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.password === contraseña
      );
  
      if (usuarioEncontrado) {
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
  
        if (usuarioEncontrado.tipo_usuario === 'admin') {
          navigate('/PanelAdmin');
        } else {
          navigate('/PanelUsuario');
        }
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error al intentar iniciar sesión:', err);
      setError('Ocurrió un error en el servidor');
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-section">
          <h1 className="institution-name">Instituto Tecnologico de La sele</h1>
          <img src="/LogoColegio.png" alt="Atención al cliente" className="support-image" />
        </div>

        <div className="right-section">
          <h1 className="welcome">Bienvenido a <strong>PQRS</strong></h1>
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

            <button type="submit">Iniciar sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
