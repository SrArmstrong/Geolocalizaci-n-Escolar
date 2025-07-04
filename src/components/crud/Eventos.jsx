import React from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';

const Eventos = ({ eventos, loading }) => (
  <SectionContainer loading={loading} title="Eventos">
    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {eventos.map((evento) => (
        <Card key={evento.id}>
          <p><strong>Nombre:</strong> {evento.nombre}</p>
          <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
          <p><strong>Capacidad:</strong> {evento.capacidad}</p>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

export default Eventos; // ✅ IMPORTANTE
