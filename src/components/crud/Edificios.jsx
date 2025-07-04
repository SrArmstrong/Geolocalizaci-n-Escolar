import React from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';

const Edificios = ({ edificios, loading }) => (
  <SectionContainer loading={loading} title="Edificios">
    <div style={gridStyle}>
      {edificios.map((edificio) => (
        <Card key={edificio.id}>
          <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{edificio.nombre || edificio.id}</span></p>
          <p><strong style={labelStyle}>Ubicación:</strong> <span style={textStyle}>{edificio.ubicacion || 'No especificada'}</span></p>
          <p><strong style={labelStyle}>Cubículos:</strong> 
            <span style={textStyle}>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {edificio.cubiculos?.length > 0 ? (
                  edificio.cubiculos.map((cubiculo, index) => (
                    <li key={index}>{cubiculo}</li>
                  ))
                ) : (
                  <li>No hay cubículos asignados</li>
                )}
              </ul>
            </span>
          </p>
          <div style={buttonGroupStyle}>
            <button style={editButtonStyle}>Editar</button>
            <button style={deleteButtonStyle}>Eliminar</button>
          </div>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

// Estilos
const gridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' };
const labelStyle = { color: '#1e3799', fontWeight: '600' };
const textStyle = { color: '#333' };
const buttonGroupStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '1rem' };
const editButtonStyle = { backgroundColor: '#f39c12', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };
const deleteButtonStyle = { backgroundColor: '#e74c3c', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };

export default Edificios;
