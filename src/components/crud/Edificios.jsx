import React from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';

const Edificios = ({ edificios, loading }) => (
  <SectionContainer loading={loading} title="Edificios">
    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {edificios.map((edificio) => (
        <Card key={edificio.id}>
          <p><strong>Nombre:</strong> {edificio.nombre}</p>
          <p><strong>Ubicación:</strong> {edificio.ubicacion}</p>
          <p><strong>Capacidad:</strong> {edificio.capacidad}</p>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

export default Edificios; // ✅ IMPORTANTE
