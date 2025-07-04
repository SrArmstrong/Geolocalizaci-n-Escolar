import React, { useState, useEffect } from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';
import { db } from '../../firebase';
import { doc, deleteDoc, updateDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';

const Profesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: '', nombre: '', cubiculo: '', planta: '', turno: '', materias: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'profesores'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProfesores(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (profesor) => {
    setFormData({ ...profesor, materias: profesor.materias?.join(', ') || '' });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ id: '', nombre: '', cubiculo: '', planta: '', turno: '', materias: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const { id, nombre, cubiculo, planta, turno, materias } = formData;
    const materiasArray = materias.split(',').map(m => m.trim());
    const docRef = doc(db, 'profesores', id);
    try {
      if (isEditing) {
        await updateDoc(docRef, { nombre, cubiculo, planta, turno, materias: materiasArray });
      } else {
        await setDoc(docRef, { nombre, cubiculo, planta, turno, materias: materiasArray });
      }
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar profesor:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'profesores', confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Error al eliminar profesor:", err);
    }
  };

  return (
    <SectionContainer loading={loading} title="Profesores">
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button onClick={handleAdd} style={editButtonStyle}>+ Añadir Profesor</button>
      </div>
      <div style={gridStyle}>
        {profesores.map((profesor) => (
          <Card key={profesor.id}>
            <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{profesor.nombre || profesor.id}</span></p>
            <p><strong style={labelStyle}>Cubículo:</strong> <span style={textStyle}>{profesor.cubiculo || 'No especificado'}</span></p>
            <p><strong style={labelStyle}>Planta:</strong> <span style={textStyle}>{profesor.planta || 'No especificada'}</span></p>
            <p><strong style={labelStyle}>Turno:</strong> <span style={textStyle}>{profesor.turno || 'No especificado'}</span></p>
            <p><strong style={labelStyle}>Materias:</strong><span style={textStyle}>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {profesor.materias?.length > 0 ? profesor.materias.map((materia, index) => (
                  <li key={index}>{materia}</li>
                )) : <li>No hay materias asignadas</li>}
              </ul></span>
            </p>
            <div style={buttonGroupStyle}>
              <button onClick={() => handleEdit(profesor)} style={editButtonStyle}>Editar</button>
              <button onClick={() => setConfirmDeleteId(profesor.id)} style={deleteButtonStyle}>Eliminar</button>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={gridStyle}>{isEditing ? 'Editar Profesor' : 'Añadir Profesor'}</h2>
            {!isEditing && (
              <input placeholder="Correo (ID)" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} style={inputStyle} />
            )}
            <input placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} style={inputStyle} />
            <input placeholder="Cubículo" value={formData.cubiculo} onChange={(e) => setFormData({ ...formData, cubiculo: e.target.value })} style={inputStyle} />
            <input placeholder="Planta" value={formData.planta} onChange={(e) => setFormData({ ...formData, planta: e.target.value })} style={inputStyle} />
            <input placeholder="Turno" value={formData.turno} onChange={(e) => setFormData({ ...formData, turno: e.target.value })} style={inputStyle} />
            <input placeholder="Materias (separadas por coma)" value={formData.materias} onChange={(e) => setFormData({ ...formData, materias: e.target.value })} style={inputStyle} />
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
            <p>¿Estás seguro de que deseas eliminar este profesor?</p>
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

const gridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' };
const labelStyle = { color: '#1e3799', fontWeight: '600' };
const textStyle = { color: '#333' };
const buttonGroupStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '1rem' };
const editButtonStyle = { backgroundColor: '#f39c12', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };
const deleteButtonStyle = { backgroundColor: '#e74c3c', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' };

const modalStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(30, 55, 153, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  backdropFilter: 'blur(3px)',
};

const modalContentStyle = {
  backgroundColor: '#fefefe', padding: '2rem', borderRadius: '10px', minWidth: '300px', maxWidth: '90%',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', border: '2px solid #1e3799', color: '#333'
};

const inputStyle = {
  width: '100%', padding: '0.5rem', margin: '0.5rem 0', borderRadius: '5px', border: '1px solid #ccc',
  backgroundColor: '#fff', color: '#333'
};

export default Profesores;
