import React, { useState, useEffect } from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';
import { db } from '../../firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const Edificios = () => {
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: '', nombre: '', ubicacion: '', cubiculos: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'edificios'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEdificios(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (edificio) => {
    setFormData({ ...edificio, cubiculos: edificio.cubiculos || [] });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ id: '', nombre: '', ubicacion: '', cubiculos: [] });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const { id, nombre, ubicacion, cubiculos } = formData;
    const docRef = doc(db, 'edificios', id);
    try {
      if (isEditing) {
        await updateDoc(docRef, { nombre, ubicacion, cubiculos });
      } else {
        await setDoc(docRef, { nombre, ubicacion, cubiculos });
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar edificio:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'edificios', confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error al eliminar edificio:', error);
    }
  };
/*
  const handleCubiculosChange = (e) => {
    const list = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
    setFormData({ ...formData, cubiculos: list });
  };
*/
  return (
    <SectionContainer loading={loading} title="Edificios">
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button onClick={handleAdd} style={addButtonStyle}>+ Añadir Edificio</button>
      </div>
      <div style={gridStyle}>
        {edificios.map((edificio) => (
          <Card key={edificio.id}>
            <div style={cardContentStyle}>
              <div>
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
              </div>
              <div style={buttonGroupStyle}>
                <button onClick={() => handleEdit(edificio)} style={editButtonStyle}>Editar</button>
                <button onClick={() => setConfirmDeleteId(edificio.id)} style={deleteButtonStyle}>Eliminar</button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>{isEditing ? 'Editar Edificio' : 'Añadir Edificio'}</h2>
            {!isEditing && (
              <input
                placeholder="ID del Edificio"
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
              placeholder="Ubicación"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              style={inputStyle}
            />
            <div>
            <label style={{ fontWeight: 'bold' }}>Cubículos:</label>
            {formData.cubiculos.map((cubiculo, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={cubiculo}
                  onChange={(e) => {
                    const updated = [...formData.cubiculos];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, cubiculos: updated });
                  }}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder={`Cubículo ${index + 1}`}
                />
                <button
                  onClick={() => {
                    const updated = formData.cubiculos.filter((_, i) => i !== index);
                    setFormData({ ...formData, cubiculos: updated });
                  }}
                  style={{ ...deleteButtonStyle }}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, cubiculos: [...formData.cubiculos, ''] })}
              style={{ ...addButtonStyle, marginTop: '0.5rem' }}
            >
              + Añadir Cubículo
            </button>
          </div>

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
            <p>¿Estás seguro de que deseas eliminar este edificio?</p>
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
// Add these new styles
const cardContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  minHeight: '200px' // Adjust this value as needed
};

const buttonGroupStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  marginTop: 'auto',
  gap: '0.5rem',
  paddingTop: '1rem',
  borderTop: '1px solid #eee'
};
const editButtonStyle = { 
  backgroundColor: '#f39c12', 
  color: 'white', 
  padding: '0.5rem 1rem', 
  borderRadius: '5px',
  flex: '1' // Make buttons take equal width
};

const deleteButtonStyle = { 
  backgroundColor: '#e74c3c', 
  color: 'white', 
  padding: '0.5rem 1rem', 
  borderRadius: '5px',
  flex: '1' // Make buttons take equal width
};
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

export default Edificios;
