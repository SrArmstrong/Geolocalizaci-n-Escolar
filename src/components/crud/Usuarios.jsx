import React, { useState, useEffect } from 'react';
import SectionContainer from '../commons/SectionContainer';
import Card from '../commons/Card';
import { db } from '../../firebase';
import { doc, deleteDoc, updateDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', edad: '', id: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
            const usuariosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsuarios(usuariosData);
            setLoading(false);
        });

        return () => unsubscribe(); // cleanup al desmontar
    }, []);

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ nombre: '', edad: '', id: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const { id, nombre, edad } = formData;
    try {
      const userRef = doc(db, 'usuarios', id);
      if (isEditing) {
        await updateDoc(userRef, { nombre, edad });
      } else {
        await setDoc(userRef, { nombre, edad });
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'usuarios', confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <SectionContainer loading={loading} title="Usuarios">
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button onClick={handleAdd} style={addButtonStyle}>+ Añadir Usuario</button>
      </div>
      <div style={gridStyle}>
        {usuarios.map((usuario) => (
          <Card key={usuario.id}>
            <p><strong style={labelStyle}>Correo:</strong> <span style={textStyle}>{usuario.id}</span></p>
            <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{usuario.nombre?.trim() || 'Sin nombre'}</span></p>
            <p><strong style={labelStyle}>Edad:</strong> <span style={textStyle}>{usuario.edad ?? 'No especificada'}</span></p>
            <div style={buttonGroupStyle}>
              <button onClick={() => handleEdit(usuario)} style={editButtonStyle}>Editar</button>
              <button onClick={() => setConfirmDeleteId(usuario.id)} style={deleteButtonStyle}>Eliminar</button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal para formulario */}
      {showForm && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={gridStyle}>{isEditing ? 'Editar Usuario' : 'Añadir Usuario'}</h2>
            {!isEditing && (
              <input 
                placeholder="Correo (ID)"
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
              placeholder="Edad"
              type="number"
              value={formData.edad}
              onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleSubmit} style={editButtonStyle}>Guardar</button>
              <button onClick={() => setShowForm(false)} style={deleteButtonStyle}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {confirmDeleteId && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <p>¿Estás seguro de que deseas eliminar este usuario?</p>
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


export default Usuarios;
