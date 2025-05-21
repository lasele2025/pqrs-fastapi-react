import React, { useState } from 'react';
import './CrearUsuario.css';
import imagenAsistente from '../public/FotoPanelRegistro.png';
import dotenv from 'dotenv';

const CrearUsuario = () => {
  const [formulario, setFormulario] = useState({
    //tipoPersona: '',
    tipo_usuario:'',
    //tipoDocumento: '',
    //numeroDocumento: '',
    nombre: '',
    //apellido: '',
    email: '',
    password: '',
    //aceptaTerminos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(import.meta.env.VITE_API_USUARIOS, {
      method: 'POST',
      body: JSON.stringify(formulario),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      alert('Usuario creado correctamente');
    } else {
      alert('Error al crear el usuario');
    }
  };

  return (
    <div className="crear-usuario-container">
      <div className="form-section">
        <h2>Crear usuario</h2>
        <p>Para la creación de la cuenta por favor detalla en este espacio la información lo más completa posible.</p>

        <form onSubmit={handleSubmit}>
          {/*<label>Tipo de persona</label>
          <select name="tipoPersona" value={formulario.tipoPersona} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Estudiante">Estudiante</option>
            <option value="Padre de familia">Padre de familia</option>
            <option value="Profesor">Profesor</option>
            <option value="Otro">Otro</option>
          </select>*/}

          <div className="document-row">
            {/*<div>
              <label>Tipo de documento</label>
              <select name="tipoDocumento" value={formulario.tipoDocumento} onChange={handleChange}>
                <option value="">Seleccione</option>
                <option value="Cédula de identidad">Cédula de identidad</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              </select>
            </div>*/}
            <div>
              <label>Tipo de usuario</label>
              <select name="tipo_usuario" value={formulario.tipo_usuario} onChange={handleChange}>
                <option value="">Seleccione</option>
                <option value="anonimo">anonimod</option>
                <option value="admin">admin</option>
                <option value="registrado">registrado</option>
              </select>
            </div>


            {/*<div>
              <label>Número de documento</label>
              <input type="text" name="numeroDocumento" value={formulario.numeroDocumento} onChange={handleChange} />
            </div>*/}
          </div>

          <div className="name-row">
            <div>
              <label>Nombre</label>
              <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} />
            </div>

            {/*<div>
              <label>Apellido</label>
              <input type="text" name="apellido" value={formulario.apellido} onChange={handleChange} />
            </div>*/}
          </div>

          <label>Correo electrónico</label>
          <input type="email" name="email" value={formulario.email} onChange={handleChange} />

          <label>Contraseña</label>
          <input type="password" name="password" value={formulario.password} onChange={handleChange} />

          {/*<div className="checkbox-row">
            <input type="checkbox" name="aceptaTerminos" checked={formulario.aceptaTerminos} onChange={handleChange} />
            <label>Acepto la protección para almacenar esta información.</label>
          </div>*/}

          <button type="submit">Registrarse</button>
        </form>
      </div>

      <div className="image-section">
        <img src={imagenAsistente} alt="Asistente" />
      </div>
    </div>
  );
};

export default CrearUsuario;
