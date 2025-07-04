import React from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';

const Profesores = ({ profesores, loading }) => (
  <SectionContainer loading={loading} title="Profesores">
    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {profesores.map((profesor) => (
        <Card key={profesor.id}>
          <p><strong>Nombre:</strong> {profesor.id}</p>
          <p><strong>Ubicación:</strong> {profesor.cubiculo}</p>
          <p><strong>Capacidad:</strong> {profesor.materias}</p>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

export default Profesores; // ✅ IMPORTANTE
