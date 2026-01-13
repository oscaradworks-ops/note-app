import React from 'react';

const Navbar = ({ nombreUsuario, terminoBusqueda, setTerminoBusqueda }) => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      borderRadius: '0 0 20px 20px'
    }}>
      {/* 1. Lado Izquierdo: Saludo */}
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6c5ce7' }}>
        ¡HI, {nombreUsuario}! 👋
      </div>

      {/* 2. Centro: El Buscador Mágico 🔍 */}
      <div style={{ flex: 1, margin: '0 20px', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Search..." 
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 15px',
            borderRadius: '25px',
            border: '2px solid #eee',
            outline: 'none',
            fontSize: '1rem',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
          onBlur={(e) => e.target.style.borderColor = '#eee'}
        />
      </div>

      {/* 3. Lado Derecho: Botón de Salir */}
      <button 
        onClick={() => {
          localStorage.removeItem('token'); // Borra el acceso
          window.location.href = '/'; // Regresa al login
        }}
        style={{
          padding: '8px 15px',
          margin: '5px 5px 5px 25px',
          backgroundColor: '#ff7675',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        LogOut 🚪
      </button>
    </nav>
  );
};

export default Navbar;