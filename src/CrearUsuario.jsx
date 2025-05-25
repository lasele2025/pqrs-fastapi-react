import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrearUsuario.css';

const CrearUsuario = () => {
  const [tipoPersona, setTipoPersona] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const esCorreoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const esNombreValido = (nombre) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(nombre);
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();

    // Validaciones
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

    const nuevoUsuario = {
      nombre,
      email,
      password,
      tipo_usuario: tipoPersona
    };

    try {
      const response = await fetch('https://pqrsfastapi-production.up.railway.app/usuarios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      if (response.ok) {
        navigate('/Login');
      } else {
        setError('Error al registrar. Intenta de nuevo.');
      }
    } catch {
      setError('Error de conexión');
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
              type={mostrarPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirmar contraseña</label>
            <input
              type={mostrarPassword ? "text" : "password"}
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

            <button type="submit">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuario;
