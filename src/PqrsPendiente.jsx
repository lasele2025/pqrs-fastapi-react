import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import './PqrsPendiente.css';

export default function PqrsPendiente() {
  const [datosPQRS, setDatosPQRS] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1
  });

  // Estados para el modal
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [mensajeRespuesta, setMensajeRespuesta] = useState('');
  const [pqrsSeleccionado, setPqrsSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [lazyState]);

  // Función para traer datos de usuario por id
  const obtenerUsuarioPorId = async (id) => {
    try {
      const res = await fetch(`https://pqrsfastapi-production.up.railway.app/usuarios/${id}`);
      if (!res.ok) throw new Error('Error al obtener usuario');
      const usuario = await res.json();
      return usuario;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('https://pqrsfastapi-production.up.railway.app/pqrs/');
      if (!respuesta.ok) throw new Error('Error al obtener los datos');
      const datos = await respuesta.json();

      // Obtener página actual
      const inicio = lazyState.first;
      const fin = inicio + lazyState.rows;
      const datosPaginados = datos.slice(inicio, fin);

      // Extraer ids únicos de usuario de la página actual
      const idsUsuarios = [...new Set(datosPaginados.map(pqrs => pqrs.usuario_id))];

      // Traer los usuarios para esos ids (paralelo con Promise.all)
      const usuarios = await Promise.all(idsUsuarios.map(id => obtenerUsuarioPorId(id)));

      // Crear un mapa de usuario_id a nombre para fácil acceso
      const mapaUsuarios = {};
      usuarios.forEach(u => {
        if (u) mapaUsuarios[u.id] = u.nombre; // ajusta si el campo se llama diferente
      });

      // Agregar nombreUsuario a cada PQRS
      const datosConNombre = datosPaginados.map(pqrs => ({
        ...pqrs,
        nombreUsuario: mapaUsuarios[pqrs.usuario_id] || 'No disponible'
      }));

      setDatosPQRS(datosConNombre);
      setTotalRecords(datos.length);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (pqrs) => {
    setPqrsSeleccionado(pqrs);
    setMensajeRespuesta('');
    setMostrarDialogo(true);
  };

  const enviarRespuesta = async () => {
    if (!mensajeRespuesta.trim()) return;

    try {
      const respuesta = await fetch('https://pqrsfastapi-production.up.railway.app/respuestas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pqrs_id: pqrsSeleccionado.id,
          admin_id: 'admin_1',
          mensaje: mensajeRespuesta
        })
      });

      if (!respuesta.ok) throw new Error('Error al enviar la respuesta');
      setMostrarDialogo(false);
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al enviar la respuesta.');
    }
  };

  const iconoDocumento = (rowData) => {
    return rowData.documento_url ? (
      <a href={rowData.documento_url} target="_blank" rel="noopener noreferrer">
        <i className="pi pi-file" style={{ fontSize: '1.2rem' }}></i>
      </a>
    ) : null;
  };

  const botonResponder = (rowData) => (
    <Button icon="pi pi-reply" label="Responder" className="p-button-sm" onClick={() => abrirModal(rowData)} />
  );

  const etiquetaEstado = (rowData) => (
    <Tag value={rowData.estado} severity={rowData.estado === 'cerrada' ? 'success' : 'warning'} />
  );

  return (
    <div className="card">
      <h2>Registros PQRS</h2>
      <DataTable
        value={datosPQRS}
        paginator
        lazy
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={(e) => setLazyState(e)}
        loading={cargando}
        tableStyle={{ minWidth: '75rem' }}
      >
        <Column field="nombreUsuario" header="Nombre" />
        <Column field="titulo" header="Título" />
        <Column field="tipo" header="Tipo" />
        <Column field="descripcion" header="Descripción" />
        <Column field="estado" header="Estado" body={etiquetaEstado} />
        <Column field="creado_en" header="Fecha" body={(rowData) => new Date(rowData.creado_en).toLocaleString()} />
        <Column header="Documento" body={iconoDocumento} />
        <Column header="Acciones" body={botonResponder} />
      </DataTable>

      <Dialog
        header="Responder PQRS"
        visible={mostrarDialogo}
        style={{ width: '40vw' }}
        modal
        onHide={() => setMostrarDialogo(false)}
        footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setMostrarDialogo(false)} className="p-button-text" />
            <Button label="Enviar" icon="pi pi-check" onClick={enviarRespuesta} autoFocus />
          </div>
        }
      >
        <p><strong>Para:</strong> {pqrsSeleccionado?.nombreUsuario}</p>
        <InputTextarea
          value={mensajeRespuesta}
          onChange={(e) => setMensajeRespuesta(e.target.value)}
          rows={5}
          cols={60}
          placeholder="Escribe tu respuesta aquí..."
        />
      </Dialog>
    </div>
  );
}