import React, { useEffect, useState } from 'react';
import './UsuariosRegistrados.css';

const UsuariosRegistrados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const respuesta = await fetch('https://pqrsfastapi-production.up.railway.app/usuarios/');
        if (!respuesta.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        const datos = await respuesta.json();
        setUsuarios(datos);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los usuarios');
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuarios();
  }, []);

  if (cargando) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Usuarios Inscritos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Contraseña</th>
            <th>Tipo de usuario</th>
            <th>Creado en</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.password}</td>
              <td>{usuario.tipo_usuario}</td>
              <td>{new Date(usuario.creado_en).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosRegistrados;
