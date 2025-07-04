import React from 'react';

const SectionContainer = ({ children, loading, title }) => (
  <>
    <h3 style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>{title}</h3>
    {loading ? <p style={{ color: 'white', textAlign: 'center' }}>Cargando datos...</p> : (
      <>
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <button style={{ backgroundColor: '#2ecc71', padding: '0.5rem 1rem', borderRadius: '5px', color: 'white' }}>+ Añadir Nuevo</button>
        </div>
        {children}
      </>
    )}
  </>
);

export default SectionContainer;
