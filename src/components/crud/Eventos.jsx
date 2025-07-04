import React from 'react';
import SectionContainer from '../commons/SectionContainer';
import { Timestamp } from 'firebase/firestore';
import Card from '../commons/Card';

const Eventos = ({ eventos, loading }) => {
  // Función para formatear fechas de Firebase
  const formatFirebaseDate = (timestamp) => {
    if (!timestamp) return 'No especificada';
    
    // Si es un objeto Timestamp de Firebase
    if (timestamp instanceof Timestamp) {
      return new Date(timestamp.toDate()).toLocaleString();
    }
    
    // Si ya es una cadena de texto
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    return 'Formato no válido';
  };

  return (
    <SectionContainer loading={loading} title="Eventos">
      <div style={gridStyle}>
        {eventos.map((evento) => (
          <Card key={evento.id}>
            <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{evento.nombre || evento.id}</span></p>
            <p><strong style={labelStyle}>Tipo de evento:</strong> <span style={textStyle}>{evento.tipoEvento || 'No especificado'}</span></p>
            <p><strong style={labelStyle}>Lugar:</strong> <span style={textStyle}>{evento.lugar || 'No especificado'}</span></p>
            <p><strong style={labelStyle}>Fecha de inicio:</strong> <span style={textStyle}>
              {formatFirebaseDate(evento.fechaInicio)}
            </span></p>
            <p><strong style={labelStyle}>Fecha de fin:</strong> <span style={textStyle}>
              {formatFirebaseDate(evento.fechaFin)}
            </span></p>
            <p><strong style={labelStyle}>Descripción:</strong></p>
            <p style={{...textStyle, marginTop: '0.5rem'}}>
              {evento.descripcion || 'No hay descripción disponible'}
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
};

// Estilos 
const gridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' };
const labelStyle = { color: '#1e3799', fontWeight: '600' };
const textStyle = { color: '#333' };
const buttonGroupStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '1rem' };
const editButtonStyle = { backgroundColor: '#f39c12', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };
const deleteButtonStyle = { backgroundColor: '#e74c3c', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };

export default Eventos;