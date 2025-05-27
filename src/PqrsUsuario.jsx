import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Chip, Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import './PqrsUsuario.css';

export default function PqrsUsuario() {
  const [pqrsUsuario, setPqrsUsuario] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    cargarDatos();
  }, [page, rowsPerPage]);

  const cargarDatos = async () => {
    try {
      const res = await fetch(`https://pqrsfastapi-production.up.railway.app/pqrs/${usuario.id}`);
      const data = await res.json();
      setPqrsUsuario(data);
    } catch (error) {
      console.error('Error cargando PQRS del usuario:', error);
    }
  };

  const calcularColor = (fecha) => {
    const ahora = new Date();
    const creado = new Date(fecha);
    const horas = (ahora - creado) / 36e5;
    if (horas >= 48) return 'rojo';
    if (horas >= 24) return 'naranja';
    return 'gris';
  };

  return (
    <Box
  sx={{
    padding: 3,
    backgroundImage: 'url("/FotoPanelAdmin.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh'
  }}
>
  {/* tu contenido */}


      <Paper sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pqrsUsuario.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pqrs) => (
                <TableRow key={pqrs.id} hover>
                  <TableCell>{pqrs.titulo}</TableCell>
                  <TableCell>{pqrs.tipo}</TableCell>
                  <TableCell>{pqrs.descripcion}</TableCell>
                  <TableCell>
                    {pqrs.estado === 'cerrado' ? (
                      <Chip icon={<CheckCircleIcon />} label="Cerrado" color="success" />
                    ) : calcularColor(pqrs.creado_en) === 'rojo' ? (
                      <Chip icon={<AccessTimeIcon />} label="Pendiente" color="error" />
                    ) : calcularColor(pqrs.creado_en) === 'naranja' ? (
                      <Chip icon={<AccessTimeIcon />} label="Pendiente" color="warning" />
                    ) : (
                      <Chip icon={<HourglassEmptyIcon />} label="Pendiente" color="default" />
                    )}
                  </TableCell>
                  <TableCell>{new Date(pqrs.creado_en).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pqrsUsuario.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
}
