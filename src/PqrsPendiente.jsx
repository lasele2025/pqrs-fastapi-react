import React, { useEffect, useState } from 'react';
import './PqrsPendiente.css';

const PqrsPendiente = () => {
  const [datosPQRS, setDatosPQRS] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerPQRS = async () => {
      try {
        const respuesta = await fetch('https://pqrsfastapi-production.up.railway.app/pqrs/');
        if (!respuesta.ok) {
          throw new Error('Error al obtener los datos');
        }
        const datos = await respuesta.json();
        console.log('📦 Datos obtenidos:', datos);
        setDatosPQRS(datos);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos');
      } finally {
        setCargando(false);
      }
    };

    obtenerPQRS();
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Tipo</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Creado en</th>
        </tr>
      </thead>
      <tbody>
        {datosPQRS.map(pqrs => (
          <tr key={pqrs.id}>
            <td>{pqrs.titulo}</td>
            <td>{pqrs.tipo}</td>
            <td>{pqrs.descripcion}</td>
            <td>{pqrs.estado}</td>
            <td>{new Date(pqrs.creado_en).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PqrsPendiente;