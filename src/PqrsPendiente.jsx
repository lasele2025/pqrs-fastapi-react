import React, { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import './PqrsPendiente.css';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Chip, Snackbar, Alert
} from '@mui/material';

export default function PqrsPendiente() {
  const [datosPQRS, setDatosPQRS] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [mensajeRespuesta, setMensajeRespuesta] = useState('');
  const [pqrsSeleccionado, setPqrsSeleccionado] = useState(null);
  const [snackbarAbierto, setSnackbarAbierto] = useState(false);

  const usuarioLogeado = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    cargarDatos();
  }, [page, rowsPerPage]);

  const calcularAntiguedad = (fecha) => {
    const ahora = new Date();
    const creado = new Date(fecha);
    const diffHoras = Math.floor((ahora - creado) / (1000 * 60 * 60));

    if (diffHoras >= 48) return 'rojo';
    if (diffHoras >= 24) return 'naranja';
    return 'gris';
  };

  const cargarDatos = async () => {
    try {
      const res = await fetch('https://pqrsfastapi-production.up.railway.app/pqrs/');
      if (!res.ok) throw new Error('Error al obtener PQRS pendientes');
      const datos = await res.json();

      const pendientes = datos.filter(p => p.estado !== 'Cerrada');

      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      const datosPaginados = pendientes.slice(start, end);

      const usuarios = await Promise.all(
        datosPaginados.map(p => fetch(`https://pqrsfastapi-production.up.railway.app/usuarios/${p.usuario_id}`)
          .then(r => r.json())
          .catch(() => ({ nombre: 'Desconocido' })))
      );

      const datosConNombre = datosPaginados.map((p, index) => ({
        ...p,
        nombreUsuario: usuarios[index].nombre || 'Desconocido',
        colorTiempo: calcularAntiguedad(p.creado_en)
      }));

      setDatosPQRS(datosConNombre);
      setTotalRecords(pendientes.length);
    } catch (error) {
      console.error(error);
    }
  };

  const abrirDialogo = (pqrs) => {
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
          admin_id: usuarioLogeado?.id,
          mensaje: mensajeRespuesta
        })
      });

      if (!respuesta.ok) {
        const textoError = await respuesta.text();
        throw new Error(`Error al enviar la respuesta: ${respuesta.status} - ${textoError}`);
      }

      const actualizarEstado = await fetch(`https://pqrsfastapi-production.up.railway.app/pqrs/${pqrsSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pqrsSeleccionado,
          estado: 'Cerrada'
        })
      });

      if (!actualizarEstado.ok) {
        const textoError = await actualizarEstado.text();
        throw new Error(`Error al actualizar estado: ${actualizarEstado.status} - ${textoError}`);
      }

      setMostrarDialogo(false);
      setMensajeRespuesta('');
      setPqrsSeleccionado(null);

      // Mostrar notificación de éxito
      setSnackbarAbierto(true);

      // Esperar antes de recargar datos
      setTimeout(() => {
        cargarDatos();
      }, 300);

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="fondo-pagina">
      <div style={{ minHeight: '100vh', paddingTop: '20px', paddingBottom: '40px' }}>
        <Paper sx={{ width: '98vw', maxWidth: '98vw', margin: '40px auto', padding: '40px 20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <TableContainer>
            <Table stickyHeader sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datosPQRS.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.nombreUsuario}</TableCell>
                    <TableCell>{row.titulo}</TableCell>
                    <TableCell>{row.tipo}</TableCell>
                    <TableCell>{row.descripcion}</TableCell>
                    <TableCell>
                      <Chip
                        icon={row.estado === 'Cerrada' ? <CheckCircleIcon /> : row.colorTiempo === 'rojo' ? <AccessTimeIcon /> : <HourglassEmptyIcon />}
                        label={row.estado}
                        color={
                          row.estado === 'Cerrada'
                            ? 'success'
                            : row.colorTiempo === 'rojo'
                              ? 'error'
                              : row.colorTiempo === 'naranja'
                                ? 'warning'
                                : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{new Date(row.creado_en).toLocaleString()}</TableCell>
                    <TableCell>
                      {row.documento_url && (
                        <a href={row.documento_url} target="_blank" rel="noopener noreferrer">📄</a>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.estado && row.estado.toLowerCase() !== 'cerrada' && (
                        <Button variant="contained" size="small" onClick={() => abrirDialogo(row)}>
                          Responder
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalRecords}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />

          <Dialog open={mostrarDialogo} onClose={() => setMostrarDialogo(false)} fullWidth maxWidth="sm">
            <DialogTitle>Responder PQRS</DialogTitle>
            <DialogContent>
              <p><strong>Para:</strong> {pqrsSeleccionado?.nombreUsuario}</p>
              <TextField
                label="Mensaje"
                multiline
                rows={5}
                fullWidth
                variant="outlined"
                value={mensajeRespuesta}
                onChange={(e) => setMensajeRespuesta(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMostrarDialogo(false)}>Cancelar</Button>
              <Button variant="contained" onClick={enviarRespuesta}>Enviar</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </div>

      {/* Snackbar de éxito */}
      <Snackbar
        open={snackbarAbierto}
        autoHideDuration={4000}
        onClose={() => setSnackbarAbierto(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarAbierto(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Respuesta enviada con éxito.
        </Alert>
      </Snackbar>
    </div>
  );
}
