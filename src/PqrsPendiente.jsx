import React, { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Chip, Snackbar, Alert, Tooltip, Box
} from '@mui/material';
import './PqrsPendiente.css';

export default function PqrsPendiente() {
  const [datosPQRS, setDatosPQRS] = useState([]);
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
      if (!res.ok) throw new Error('Error al obtener PQRS');
      const datos = await res.json();

      const pendientes = datos.filter(p => p.estado !== 'Cerrada');
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      const datosPaginados = pendientes.slice(start, end);

      const usuarios = await Promise.all(
        datosPaginados.map(p =>
          fetch(`https://pqrsfastapi-production.up.railway.app/usuarios/${p.usuario_id}`)
            .then(r => r.json())
            .catch(() => ({ nombre: 'Desconocido' }))
        )
      );

      const datosConNombre = datosPaginados.map((p, index) => ({
        ...p,
        nombreUsuario: usuarios[index].nombre || 'Desconocido',
        colorTiempo: calcularAntiguedad(p.creado_en)
      }));

      setDatosPQRS(datosConNombre);
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
      await fetch('https://pqrsfastapi-production.up.railway.app/respuestas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pqrs_id: pqrsSeleccionado.id,
          admin_id: usuarioLogeado?.id,
          mensaje: mensajeRespuesta
        })
      });

      await fetch(`https://pqrsfastapi-production.up.railway.app/pqrs/${pqrsSeleccionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: pqrsSeleccionado.titulo,
          tipo: pqrsSeleccionado.tipo,
          descripcion: pqrsSeleccionado.descripcion,
          usuario_id: pqrsSeleccionado.usuario_id,
          estado: 'cerrado'
        })
      });

      setMostrarDialogo(false);
      setSnackbarAbierto(true);
      cargarDatos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Paper sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 3, borderRadius: 2, boxShadow: 3 }}>
      <TableContainer sx={{ maxHeight: 500 }}>

          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell sx={{ minWidth: 120, whiteSpace: 'normal' }}>Tipo</TableCell>

                <TableCell>Descripción</TableCell>

                <TableCell align="center" sx={{ minWidth: 120, whiteSpace: 'normal' }}>Usuario</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosPQRS.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.titulo}</TableCell>
                  <TableCell sx={{ minWidth: 120, whiteSpace: 'normal' }}>{row.tipo}</TableCell>

                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={row.nombreUsuario} arrow>
                      <PersonOutlineIcon />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
  {row.estado === 'cerrado' ? (
    <Chip icon={<CheckCircleIcon />} label="Cerrado" color="success" />
  ) : row.colorTiempo === 'rojo' ? (
    <Chip icon={<AccessTimeIcon />} label="Pendiente" color="error" />
  ) : row.colorTiempo === 'naranja' ? (
    <Chip icon={<AccessTimeIcon />} label="Pendiente" color="warning" />
  ) : (
    <Chip icon={<HourglassEmptyIcon />} label="Pendiente" color="default" />
  )}
</TableCell>

                  <TableCell>{new Date(row.creado_en).toLocaleString()}</TableCell>
                  <TableCell>
  {row.estado !== 'cerrado' && (
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
          count={datosPQRS.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog open={mostrarDialogo} onClose={() => setMostrarDialogo(false)} fullWidth maxWidth="sm">
        <DialogTitle>Responder PQRS</DialogTitle>
        <DialogContent>
          <p><strong>Para:</strong> {pqrsSeleccionado?.nombreUsuario}</p>
          <TextField
            label="Mensaje"
            multiline
            rows={5}
            fullWidth
            value={mensajeRespuesta}
            onChange={(e) => setMensajeRespuesta(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMostrarDialogo(false)}>Cancelar</Button>
          <Button variant="contained" onClick={enviarRespuesta}>Enviar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarAbierto} autoHideDuration={4000} onClose={() => setSnackbarAbierto(false)}>
        <Alert onClose={() => setSnackbarAbierto(false)} severity="success" sx={{ width: '100%' }}>
          PQRS resuelta correctamente.
        </Alert>
      </Snackbar>
    </Box>
  );
}