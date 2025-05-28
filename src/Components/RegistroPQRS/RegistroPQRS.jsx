import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";

import './RegistroPQRS.css';

const RegistroPQRS = () => {
  const [formulario, setFormulario] = useState({
    titulo: '',
    tipo: '',
    descripcion: '',
    usuario_id: '',
    archivo_url: null,
  });

  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.id) {
      setFormulario((prev) => ({
        ...prev,
        usuario_id: usuario.id,
      }));
    } else {
      alert('No has iniciado sesión. Por favor inicia sesión antes de registrar una PQRS.');
      window.location.href = '/Login';
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tiposPermitidos = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'audio/mpeg',
        'video/mp4',
      ];
      if (!tiposPermitidos.includes(file.type)) {
        alert('Tipo de archivo no permitido');
        return;
      }
      if (file.size > 40 * 1024 * 1024) {
        alert('El archivo supera el límite de 40MB');
        return;
      }
      setArchivo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let archivoUrl = null;

    try {
      // Verifica sesión activa
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        alert('Sesín expirada o no iniciada. Por favor inicia sesión nuevamente.');
        return;
      }

      const user = sessionData.session.user;
      console.log('Usuario autenticado:', user);
      console.log('Access token:', sessionData.session.access_token);

      // Subir archivo si existe
      if (archivo) {
        const nombreLimpio = archivo.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const nombreArchivo = `${Date.now()}-${nombreLimpio}`;
        


        const { data, error } = await supabase
          .storage
          .from('documentos-pqrs')
          .upload(nombreArchivo, archivo, {
            cacheControl: '3600',
            upsert: true,
          });

        if (error) {
          console.error('Error al subir archivo a Supabase:', error.message, error);
          throw error;
        }

        const { data: publicUrlData } = supabase
          .storage
          .from('documentos-pqrs')
          .getPublicUrl(nombreArchivo);

        archivoUrl = publicUrlData.publicUrl;
      }

      // Enviar datos al backend
      const datosFinales = {
        ...formulario,
        archivo_url: archivoUrl,
      };

      const formData = new FormData();
      formData.append('titulo', formulario.titulo);
      formData.append('tipo', formulario.tipo);
      formData.append('descripcion', formulario.descripcion);
      formData.append('usuario_id', formulario.usuario_id);
      if (archivo) {
        formData.append('archivo', archivo);
      }
      
      const response = await fetch('https://pqrsfastapi-production.up.railway.app/pqrs/', {
        method: 'POST',
        body: formData  // 🚫 no pongas headers, el navegador lo maneja
      });
      

      if (response.ok) {
        alert('PQRS registrada correctamente');
        setFormulario({
          titulo: '',
          tipo: '',
          descripcion: '',
          usuario_id: formulario.usuario_id,
          archivo_url: null,
        });
        setArchivo(null);
      } else {
        const errorText = await response.text();
        console.error('Error al registrar:', errorText);
        alert('Error al registrar la PQRS');
      }
    } catch (error) {
      console.error('Error al enviar la PQRS:', error);
      alert('Error al conectar con el servidor o subir archivo');
    }
  };

  return (
    <div className="registro-container">
      <div className="form-box">
        <h1>Registrar nueva PQRS</h1>
        <p>Para la creación de tu caso por favor detalla en este espacio tu requerimiento lo más completo posible.</p>



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
            <input type="file" onChange={handleArchivo} />
            Adjuntar archivo (PDF, Word, JPG, PNG, MP3, MP4) — Máx. 40MB
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
