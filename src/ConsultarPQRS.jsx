// src/ConsultaPQRS.jsx
import React from 'react';
import './ConsultarPQRS.css';
import imagenSoporte from './assets/FotoLogin.png';

const ConsultaPQRS = () => {
  return (
    <div className="consulta-container">
      <div className="consulta-form">
        <button className="back-btn">←</button>
        <h1>Consulte el estado de sus solicitud</h1>
        <p>
          Ingresa el tipo y número de documento de la persona que radicó el caso de PQRS
        </p>

        <form>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de persona*</label>
              <select required>
                <option value="">Selecciona el tipo de persona</option>
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="padre de familia">Padre/Madre</option>
              </select>
            </div>

            <div className="form-group">
              <label>Correo electrónico*</label>
              <input type="email" placeholder="Ingresa tu correo electrónico" required />
            </div>
          </div>

          <div className="form-group">
            <label>Nro de radicado</label>
            <input type="text" placeholder="Ingresa tu número de radicado" />
          </div>

          <button type="submit" className="consultar-btn">Consultar</button>
        </form>
      </div>

      <div className="consulta-image">
        <img src="/FotoPanelRegistro.png" alt="Atención al cliente" />
      </div>
    </div>
  );
};

export default ConsultaPQRS;
