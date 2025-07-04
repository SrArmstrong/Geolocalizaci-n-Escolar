import React from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';

const Usuarios = ({ usuarios, loading }) => (
  <SectionContainer loading={loading} title="Usuarios Registrados">
    <div style={gridStyle}>
      {usuarios.map((usuario) => (
        <Card key={usuario.id}>
          <p><strong style={labelStyle}>Correo:</strong> <span style={textStyle}>{usuario.id}</span></p>
          <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{usuario.nombre?.trim() || 'Sin nombre'}</span></p>
          <p><strong style={labelStyle}>Edad:</strong> <span style={textStyle}>{usuario.edad ?? 'No especificada'}</span></p>
          <div style={buttonGroupStyle}>
            <button style={editButtonStyle}>Editar</button>
            <button style={deleteButtonStyle}>Eliminar</button>
          </div>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

// Agrega tus estilos aquí o importa un archivo de estilos compartidos
const gridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' };
const labelStyle = { color: '#1e3799', fontWeight: '600' };
const textStyle = { color: '#333' };
const buttonGroupStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '1rem' };
const editButtonStyle = { backgroundColor: '#f39c12', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };
const deleteButtonStyle = { backgroundColor: '#e74c3c', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };

export default Usuarios;
