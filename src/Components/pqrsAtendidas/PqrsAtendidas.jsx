import React, { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Chip, Tooltip, Box
} from '@mui/material';
import './PqrsAtendidas.css';

export default function ConsultaCerradasPQRS() {
  const [cerradasTotales, setCerradasTotales] = useState([]); // todas las PQRS cerradas
  const [datosPQRS, setDatosPQRS] = useState([]); // paginadas con nombre
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Cargar todas las PQRS cerradas solo una vez
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch('https://pqrsfastapi-production.up.railway.app/pqrs/');
        if (!res.ok) throw new Error('Error al obtener PQRS');
        const datos = await res.json();
        const cerrados = datos.filter(p => (p.estado || '').toLowerCase() === 'cerrado');
        setCerradasTotales(cerrados);
      } catch (error) {
        console.error(error);
      }
    };

    cargarDatos();
  }, []);

  // Recalcular los datos paginados cada vez que cambia la página o cantidad
  useEffect(() => {
    const cargarPagina = async () => {
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      const datosPaginados = cerradasTotales.slice(start, end);

      const usuarios = await Promise.all(
        datosPaginados.map(p =>
          fetch(`https://pqrsfastapi-production.up.railway.app/usuarios/${p.usuario_id}`)
            .then(r => r.json())
            .catch(() => ({ nombre: 'Desconocido' }))
        )
      );

      const datosConNombre = datosPaginados.map((p, index) => ({
        ...p,
        nombreUsuario: usuarios[index].nombre || 'Desconocido'
      }));

      setDatosPQRS(datosConNombre);
    };

    cargarPagina();
  }, [page, rowsPerPage, cerradasTotales]);

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Paper sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="center">Usuario</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosPQRS.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.titulo}</TableCell>
                  <TableCell>{row.tipo}</TableCell>
                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={row.nombreUsuario} arrow>
                      <PersonOutlineIcon />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip icon={<CheckCircleIcon />} label="Cerrado" color="success" />
                  </TableCell>
                  <TableCell>{new Date(row.creado_en).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={cerradasTotales.length}
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
