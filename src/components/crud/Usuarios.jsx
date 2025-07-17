import React, { useState, useEffect } from 'react';
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

    return () => unsubscribe();
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

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingSpinnerStyle}></div>
        <p style={loadingTextStyle}>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header de acciones */}
      <div style={headerStyle}>
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>{usuarios.length}</span>
            <span style={statLabelStyle}>Usuarios registrados</span>
          </div>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>
              {usuarios.filter(u => u.nombre && u.nombre.trim()).length}
            </span>
            <span style={statLabelStyle}>Usuarios activos</span>
          </div>
        </div>
        
        <button onClick={handleAdd} style={primaryButtonStyle}>
          <span style={buttonIconStyle}>+</span>
          Registrar Usuario
        </button>
      </div>

      {/* Grid de usuarios */}
      {usuarios.length === 0 ? (
        <div style={emptyStateContainerStyle}>
          <div style={emptyStateIconStyle}>👥</div>
          <h3 style={emptyStateTitleStyle}>No hay usuarios registrados</h3>
          <p style={emptyStateDescriptionStyle}>
            Comience agregando el primer usuario al sistema
          </p>
          <button onClick={handleAdd} style={primaryButtonStyle}>
            <span style={buttonIconStyle}>+</span>
            Registrar Primer Usuario
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {usuarios.map((usuario) => (
            <Card key={usuario.id}>
              <div style={cardContentStyle}>
                <div style={cardHeaderStyle}>
                  <div style={userIconStyle}>👤</div>
                  <div style={cardTitleSectionStyle}>
                    <h3 style={cardTitleStyle}>{usuario.nombre?.trim() || 'Sin nombre'}</h3>
                    <p style={cardSubtitleStyle}>ID: {usuario.id}</p>
                  </div>
                </div>
                
                <div style={cardBodyStyle}>
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>📧 Correo:</span>
                    <span style={valueStyle}>{usuario.id}</span>
                  </div>
                  
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>👤 Nombre:</span>
                    <span style={valueStyle}>{usuario.nombre?.trim() || 'Sin nombre'}</span>
                  </div>
                  
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>🎂 Edad:</span>
                    <span style={valueStyle}>{usuario.edad ?? 'No especificada'}</span>
                  </div>
                </div>
                
                <div style={cardFooterStyle}>
                  <button onClick={() => handleEdit(usuario)} style={secondaryButtonStyle}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => setConfirmDeleteId(usuario.id)} style={dangerButtonStyle}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>
                {isEditing ? '✏️ Editar Usuario' : '➕ Registrar Nuevo Usuario'}
              </h2>
              <button 
                onClick={() => setShowForm(false)} 
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>
            
            <div style={formContainerStyle}>
              {!isEditing && (
                <div style={fieldGroupStyle}>
                  <label style={fieldLabelStyle}>Correo (ID) *</label>
                  <input
                    placeholder="Ej: usuario@ejemplo.com"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Nombre *</label>
                <input
                  placeholder="Ej: Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Edad</label>
                <input
                  type="number"
                  placeholder="Ej: 25"
                  value={formData.edad}
                  onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={() => setShowForm(false)} style={cancelButtonStyle}>
                Cancelar
              </button>
              <button onClick={handleSubmit} style={primaryButtonStyle}>
                {isEditing ? '💾 Actualizar' : '💾 Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmDeleteId && (
        <div style={modalOverlayStyle}>
          <div style={confirmModalStyle}>
            <div style={confirmIconStyle}>⚠️</div>
            <h3 style={confirmTitleStyle}>Confirmar Eliminación</h3>
            <p style={confirmMessageStyle}>
              ¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div style={confirmButtonsStyle}>
              <button onClick={() => setConfirmDeleteId(null)} style={cancelButtonStyle}>
                Cancelar
              </button>
              <button onClick={handleDelete} style={dangerButtonStyle}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos aplicados del componente Eventos
const containerStyle = {
  padding: '1.5rem'
};

const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  gap: '1rem'
};

const loadingSpinnerStyle = {
  width: '2rem',
  height: '2rem',
  border: '3px solid #e2e8f0',
  borderTop: '3px solid #1e40af',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const loadingTextStyle = {
  color: '#64748b',
  fontSize: '1rem',
  fontWeight: '500'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  gap: '1rem'
};

const statsContainerStyle = {
  display: 'flex',
  gap: '2rem',
  flexWrap: 'wrap'
};

const statItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem'
};

const statNumberStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1e40af',
  fontFamily: 'Georgia, serif'
};

const statLabelStyle = {
  fontSize: '0.75rem',
  color: '#64748b',
  fontWeight: '500',
  textAlign: 'center'
};

const emptyStateContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center'
};

const emptyStateIconStyle = {
  fontSize: '4rem',
  marginBottom: '1rem',
  opacity: 0.5
};

const emptyStateTitleStyle = {
  color: '#1e3a8a',
  fontSize: '1.5rem',
  fontWeight: '600',
  margin: '0 0 0.5rem 0',
  fontFamily: 'Georgia, serif'
};

const emptyStateDescriptionStyle = {
  color: '#64748b',
  fontSize: '1rem',
  marginBottom: '2rem',
  maxWidth: '400px',
  lineHeight: 1.5
};

const gridStyle = {
  display: 'grid',
  gap: '1.5rem',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
};

const cardContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '200px'
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e2e8f0'
};

const userIconStyle = {
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  backgroundColor: '#dbeafe',
  borderRadius: '8px',
  flexShrink: 0
};

const cardTitleSectionStyle = {
  flex: 1,
  minWidth: 0
};

const cardTitleStyle = {
  color: '#1e3a8a',
  fontSize: '1.25rem',
  fontWeight: '600',
  margin: '0 0 0.25rem 0',
  fontFamily: 'Georgia, serif',
  wordBreak: 'break-word'
};

const cardSubtitleStyle = {
  color: '#64748b',
  fontSize: '0.875rem',
  margin: 0,
  fontWeight: '500'
};

const cardBodyStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const infoRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const labelStyle = {
  color: '#374151',
  fontSize: '0.875rem',
  fontWeight: '600'
};

const valueStyle = {
  color: '#1f2937',
  fontSize: '0.875rem',
  paddingLeft: '1rem'
};

const cardFooterStyle = {
  display: 'flex',
  gap: '0.75rem',
  marginTop: 'auto',
  paddingTop: '1rem',
  borderTop: '1px solid #e2e8f0'
};

const primaryButtonStyle = {
  backgroundColor: '#1e40af',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  boxShadow: '0 2px 4px rgba(30, 64, 175, 0.2)',
  transition: 'all 0.2s ease'
};

const secondaryButtonStyle = {
  backgroundColor: '#f8fafc',
  color: '#475569',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease'
};

const dangerButtonStyle = {
  backgroundColor: '#dc2626',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease'
};

const cancelButtonStyle = {
  backgroundColor: '#f8fafc',
  color: '#475569',
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const buttonIconStyle = {
  fontSize: '1rem',
  fontWeight: 'bold'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(4px)'
};

const modalContentStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  minWidth: '500px',
  maxWidth: '90%',
  maxHeight: '90vh',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid #e2e8f0',
  overflow: 'hidden'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem 2rem',
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc'
};

const modalTitleStyle = {
  color: '#1e3a8a',
  fontSize: '1.5rem',
  fontWeight: '600',
  margin: 0,
  fontFamily: 'Georgia, serif'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#64748b',
  padding: '0.25rem',
  borderRadius: '4px',
  transition: 'all 0.2s ease'
};

const formContainerStyle = {
  padding: '2rem',
  maxHeight: '60vh',
  overflowY: 'auto'
};

const fieldGroupStyle = {
  marginBottom: '1.5rem'
};

const fieldLabelStyle = {
  display: 'block',
  color: '#374151',
  fontSize: '0.875rem',
  fontWeight: '600',
  marginBottom: '0.5rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  color: '#1f2937',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease'
};

const modalFooterStyle = {
  display: 'flex',
  gap: '1rem',
  padding: '1.5rem 2rem',
  borderTop: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  justifyContent: 'flex-end'
};

const confirmModalStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '2rem',
  minWidth: '400px',
  maxWidth: '90%',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid #e2e8f0',
  textAlign: 'center'
};

const confirmIconStyle = {
  fontSize: '3rem',
  marginBottom: '1rem'
};

const confirmTitleStyle = {
  color: '#1e3a8a',
  fontSize: '1.25rem',
  fontWeight: '600',
  margin: '0 0 1rem 0',
  fontFamily: 'Georgia, serif'
};

const confirmMessageStyle = {
  color: '#64748b',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  marginBottom: '2rem'
};

const confirmButtonsStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center'
};

export default Usuarios;