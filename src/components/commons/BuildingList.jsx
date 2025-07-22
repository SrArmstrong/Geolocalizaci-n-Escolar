import React, { useState } from 'react';
import locations from '../../locations';

const BuildingList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);

  const filtered = locations.filter(loc =>
    loc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToBuilding = (location) => {
    if (window && typeof window.showRouteToLocation === 'function') {
      window.showRouteToLocation(
        [location.latitude, location.longitude],
        location.title
      );
      setVisible(false); 
    } else {
      alert("La función de navegación no está disponible");
    }
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar */}
      <button
        onClick={() => setVisible(!visible)}
        style={{
          position: 'fixed',
          top: 'unset',
          right: 20,
          bottom: 20,
          zIndex: 9999,
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          fontSize: '24px',
          boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        }}
        title={visible ? "Ocultar lista" : "Mostrar lista"}
      >
        {visible ? '✖' : '📋'}
      </button>

      {/* Panel de lista de edificios */}
      {visible && (
  <div style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '60vh',
    overflowY: 'auto',
    zIndex: 9998,
    backgroundColor: 'white',
    padding: '1em',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
  }}>
    <input
      type="text"
      placeholder="Buscar edificio..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        width: '100%',
        padding: '0.5em',
        marginBottom: '0.5em',
        borderRadius: '8px',
        border: '1px solid #ccc'
      }}
    />
    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
      {filtered.map((loc, idx) => (
        <li key={idx}>
          <button
            onClick={() => goToBuilding(loc)}
            style={{
              width: '100%',
              padding: '0.75em',
              marginBottom: '0.5em',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            📍 {loc.title}
          </button>
        </li>
      ))}
    </ul>
  </div>
)}
    </>
  );
};

export default BuildingList;
