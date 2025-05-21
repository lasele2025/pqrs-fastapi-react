import React, { useState, useEffect } from 'react';
import './RegistroPQRS.css';

const RegistroPQRS = () => {
  const [formulario, setFormulario] = useState({
    titulo: '',
    tipo: '',
    descripcion: '',
    usuario_id: ''  // ID del usuario
  });

  // Aquí colocas el useEffect
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.id) {
      setFormulario((prev) => ({
        ...prev,
        usuario_id: usuario.id,
      }));
    } else {
      alert('No has iniciado sesión. Por favor inicia sesión antes de registrar una PQRS.');
      // Redirige al login si no hay usuario
      window.location.href = '/Login';
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://pqrsfastapi-production.up.railway.app/pqrs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formulario),
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log(data);
        alert('PQRS registrada correctamente');
      } else {
        const errorText = await response.text();
        console.error('Error al registrar:', errorText);
        alert('Error al registrar la PQRS');
      }
    } catch (error) {
      console.error('Error al enviar la PQRS:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="registro-container">
      <div className="form-box">
        <h1>Registrar nueva PQRS</h1>
        <p>
          Para la creación de tu caso por favor detalla en este espacio tu requerimiento lo más completo posible.
        </p>

        <button className="estado-btn">Consulte el estado de su solicitud</button>

        <h3>Datos de PQRS</h3>

        <form onSubmit={handleSubmit}>
          <label>Título*</label>
          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            placeholder="Ingresa un título"
            required
          />

          <label>Tipo de PQRS*</label>
          <select name="tipo" value={formulario.tipo} onChange={handleChange} required>
            <option value="">Selecciona tu tipo de PQRS</option>
            <option value="peticion">Petición</option>
            <option value="queja">Queja</option>
            <option value="reclamo">Reclamo</option>
            <option value="sugerencia">Sugerencia</option>
          </select>

          <label>Descripción de la solicitud*</label>
          <textarea
            name="descripcion"
            rows="4"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Detalle en este espacio su requerimiento lo más completo posible"
            required
          ></textarea>

          <label className="archivo-label">
            <input type="file" disabled />
            Adjuntar algo si desea (deshabilitado en esta versión)
          </label>

          <div className="checkbox">
            <input type="checkbox" id="autorizo" required />
            <label htmlFor="autorizo">
              Autorizo a protección para almacenar esta información y contactarme para ofrecer la respuesta a mi solicitud.
            </label>
          </div>

          <button type="submit" className="submit-btn">Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default RegistroPQRS;
