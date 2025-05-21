import React from 'react';
import PqrsPendiente from './PqrsPendiente'; // corrige el path si es necesario
import UsuariosRegistrados from './UsuariosRegistrados';
function App() {
  return (
    <div>
      <h1>Lista de PQRS</h1>
      <PqrsPendiente />
      <h1>Lista de Usuarios Registrados</h1>
      <UsuariosRegistrados />
    </div>
  );
}

export default App;
