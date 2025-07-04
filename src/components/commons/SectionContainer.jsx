import React from 'react';

const SectionContainer = ({ children, loading, title }) => (
  <>
    <h3 style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>{title}</h3>
    {loading ? <p style={{ color: 'white', textAlign: 'center' }}>Cargando datos...</p> : (
      <>
        {children}
      </>
    )}
  </>
);

export default SectionContainer;
