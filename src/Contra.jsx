import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordCambio() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError('No se encontró sesión válida. Usa el enlace del correo nuevamente.');
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setMensaje('');
    } else {
      setMensaje('¡Contraseña actualizada! Redirigiendo...');
      setError('');

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate('/Login');
      }, 2000);
    }
  };

  return (
    <div className="Fondo">
      <div className="formulario-restablecer">
        <h1 className="titulo">Nueva contraseña</h1>
        <p className="subtitulo">Ingresa y confirma tu nueva contraseña.</p>

        <form onSubmit={handleSubmit}>
          <label className="etiqueta">Nueva contraseña</label>
          <input
            type={mostrarPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="entrada"
            placeholder="Escribe tu nueva contraseña"
            required
          />

          <label className="etiqueta">Confirmar contraseña</label>
          <input
            type={mostrarPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="entrada"
            placeholder="Confirma tu nueva contraseña"
            required
          />

          <div className="ver-password">
            <input
              type="checkbox"
              id="ver"
              checked={mostrarPassword}
              onChange={() => setMostrarPassword(!mostrarPassword)}
            />
            <label htmlFor="ver">Mostrar contraseñas</label>
          </div>

          <button type="submit" className="boton">Cambiar contraseña</button>
        </form>

        {mensaje && <p className="mensaje" style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p className="mensaje" style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}
