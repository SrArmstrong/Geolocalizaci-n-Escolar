import React, { useState, useEffect } from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';
import { db } from '../../firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    tipoEvento: '',
    lugar: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'eventos'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventos(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatFirebaseDate = (timestamp) => {
    if (!timestamp) return 'No especificada';
    if (timestamp instanceof Timestamp) return timestamp.toDate().toLocaleString();
    if (typeof timestamp === 'string') return timestamp;
    return 'Formato no válido';
  };

  const handleEdit = (evento) => {
    setFormData({
      id: evento.id,
      nombre: evento.nombre || '',
      tipoEvento: evento.tipoEvento || '',
      lugar: evento.lugar || '',
      fechaInicio: evento.fechaInicio?.toDate().toISOString().slice(0, 16) || '',
      fechaFin: evento.fechaFin?.toDate().toISOString().slice(0, 16) || '',
      descripcion: evento.descripcion || '',
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({
      id: '',
      nombre: '',
      tipoEvento: '',
      lugar: '',
      fechaInicio: '',
      fechaFin: '',
      descripcion: '',
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const {
      id,
      nombre,
      tipoEvento,
      lugar,
      fechaInicio,
      fechaFin,
      descripcion,
    } = formData;

    const docRef = doc(db, 'eventos', id);

    try {
      const data = {
        nombre,
        tipoEvento,
        lugar,
        fechaInicio: Timestamp.fromDate(new Date(fechaInicio)),
        fechaFin: Timestamp.fromDate(new Date(fechaFin)),
        descripcion,
      };

      if (isEditing) {
        await updateDoc(docRef, data);
      } else {
        await setDoc(docRef, data);
      }

      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar evento:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'eventos', confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  return (
    <SectionContainer loading={loading} title="Eventos">
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button onClick={handleAdd} style={addButtonStyle}>+ Añadir Evento</button>
      </div>
      <div style={gridStyle}>
        {eventos.map((evento) => (
          <Card key={evento.id}>
            <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{evento.nombre || evento.id}</span></p>
            <p><strong style={labelStyle}>Tipo de evento:</strong> <span style={textStyle}>{evento.tipoEvento || 'No especificado'}</span></p>
            <p><strong style={labelStyle}>Lugar:</strong> <span style={textStyle}>{evento.lugar || 'No especificado'}</span></p>
            <p><strong style={labelStyle}>Fecha de inicio:</strong> <span style={textStyle}>{formatFirebaseDate(evento.fechaInicio)}</span></p>
            <p><strong style={labelStyle}>Fecha de fin:</strong> <span style={textStyle}>{formatFirebaseDate(evento.fechaFin)}</span></p>
            <p><strong style={labelStyle}>Descripción:</strong></p>
            <p style={{ ...textStyle, marginTop: '0.5rem' }}>
              {evento.descripcion || 'No hay descripción disponible'}
            </p>
            <div style={buttonGroupStyle}>
              <button onClick={() => handleEdit(evento)} style={editButtonStyle}>Editar</button>
              <button onClick={() => setConfirmDeleteId(evento.id)} style={deleteButtonStyle}>Eliminar</button>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>{isEditing ? 'Editar Evento' : 'Añadir Evento'}</h2>
            {!isEditing && (
              <input
                placeholder="ID del Evento"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                style={inputStyle}
              />
            )}
            <input
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Tipo de Evento"
              value={formData.tipoEvento}
              onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Lugar"
              value={formData.lugar}
              onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
              style={inputStyle}
            />
            <label style={labelStyle}>Fecha de inicio:</label>
            <input
              type="datetime-local"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              style={inputStyle}
            />
            <label style={labelStyle}>Fecha de fin:</label>
            <input
              type="datetime-local"
              value={formData.fechaFin}
              onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              style={inputStyle}
            />
            <textarea
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              style={{ ...inputStyle, height: '100px' }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleSubmit} style={editButtonStyle}>Guardar</button>
              <button onClick={() => setShowForm(false)} style={deleteButtonStyle}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <p>¿Estás seguro de que deseas eliminar este evento?</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleDelete} style={deleteButtonStyle}>Eliminar</button>
              <button onClick={() => setConfirmDeleteId(null)} style={editButtonStyle}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
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
const addButtonStyle = { backgroundColor: '#2ecc71', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(30, 55, 153, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(3px)',
};

const modalContentStyle = {
  backgroundColor: '#fefefe',
  padding: '2rem',
  borderRadius: '10px',
  minWidth: '300px',
  maxWidth: '90%',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  border: '2px solid #1e3799',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  margin: '0.5rem 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  color: '#333',
};

export default Eventos;
