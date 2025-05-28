import React from 'react';
import PqrsPendiente from './Components/pqrsPendiente/PqrsPendiente'; // corrige el path si es necesario
import UsuariosRegistrados from './Components/UsuariosRegistrados/UsuariosRegistrados';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // o cualquier otro tema
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

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
