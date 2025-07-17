import React, { useState, useEffect } from 'react';
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

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingSpinnerStyle}></div>
        <p style={loadingTextStyle}>Cargando edificios...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header de acciones */}
      <div style={headerStyle}>
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>{edificios.length}</span>
            <span style={statLabelStyle}>Edificios registrados</span>
          </div>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>
              {edificios.reduce((total, edificio) => total + (edificio.cubiculos?.length || 0), 0)}
            </span>
            <span style={statLabelStyle}>Cubículos totales</span>
          </div>
        </div>
        
        <button onClick={handleAdd} style={primaryButtonStyle}>
          <span style={buttonIconStyle}>+</span>
          Registrar Edificio
        </button>
      </div>

      {/* Grid de edificios */}
      {edificios.length === 0 ? (
        <div style={emptyStateContainerStyle}>
          <div style={emptyStateIconStyle}>🏢</div>
          <h3 style={emptyStateTitleStyle}>No hay edificios registrados</h3>
          <p style={emptyStateDescriptionStyle}>
            Comience agregando el primer edificio del campus universitario
          </p>
          <button onClick={handleAdd} style={primaryButtonStyle}>
            <span style={buttonIconStyle}>+</span>
            Registrar Primer Edificio
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {edificios.map((edificio) => (
            <Card key={edificio.id}>
              <div style={cardContentStyle}>
                <div style={cardHeaderStyle}>
                  <div style={buildingIconStyle}>🏢</div>
                  <div style={cardTitleSectionStyle}>
                    <h3 style={cardTitleStyle}>{edificio.nombre || edificio.id}</h3>
                    <p style={cardSubtitleStyle}>ID: {edificio.id}</p>
                  </div>
                </div>
                
                <div style={cardBodyStyle}>
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>📍 Ubicación:</span>
                    <span style={valueStyle}>{edificio.ubicacion || 'No especificada'}</span>
                  </div>
                  
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>🏛️ Cubículos:</span>
                    <div style={cubiculosContainerStyle}>
                      {edificio.cubiculos?.length > 0 ? (
                        <>
                          <div style={cubiculosListStyle}>
                            {edificio.cubiculos.slice(0, 3).map((cubiculo, index) => (
                              <span key={index} style={cubiculoTagStyle}>
                                {cubiculo}
                              </span>
                            ))}
                            {edificio.cubiculos.length > 3 && (
                              <span style={moreTagStyle}>
                                +{edificio.cubiculos.length - 3} más
                              </span>
                            )}
                          </div>
                          <div style={cubiculosCountStyle}>
                            Total: {edificio.cubiculos.length} cubículos
                          </div>
                        </>
                      ) : (
                        <span style={emptyStateStyle}>Sin cubículos asignados</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={cardFooterStyle}>
                  <button onClick={() => handleEdit(edificio)} style={secondaryButtonStyle}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => setConfirmDeleteId(edificio.id)} style={dangerButtonStyle}>
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
                {isEditing ? '✏️ Editar Edificio' : '➕ Registrar Nuevo Edificio'}
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
                  <label style={fieldLabelStyle}>ID del Edificio *</label>
                  <input
                    placeholder="Ej: EDI001, ADMIN, BIBLIOTECA"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Nombre del Edificio *</label>
                <input
                  placeholder="Ej: Edificio de Administración"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Ubicación</label>
                <input
                  placeholder="Ej: Campus Central, Zona Norte"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Cubículos</label>
                <div style={cubiculosFormStyle}>
                  {formData.cubiculos.map((cubiculo, index) => (
                    <div key={index} style={cubiculoInputRowStyle}>
                      <input
                        type="text"
                        value={cubiculo}
                        onChange={(e) => {
                          const updated = [...formData.cubiculos];
                          updated[index] = e.target.value;
                          setFormData({ ...formData, cubiculos: updated });
                        }}
                        style={{ ...inputStyle, marginBottom: '0' }}
                        placeholder={`Cubículo ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const updated = formData.cubiculos.filter((_, i) => i !== index);
                          setFormData({ ...formData, cubiculos: updated });
                        }}
                        style={removeButtonStyle}
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cubiculos: [...formData.cubiculos, ''] })}
                    style={addCubiculoButtonStyle}
                  >
                    + Añadir Cubículo
                  </button>
                </div>
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
              ¿Está seguro de que desea eliminar este edificio? Esta acción no se puede deshacer.
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

// Estilos actualizados para coincidir con AdminDashboard
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
};

const cardContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '280px'
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e2e8f0'
};

const buildingIconStyle = {
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

const cubiculosContainerStyle = {
  paddingLeft: '1rem'
};

const cubiculosListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '0.5rem'
};

const cubiculoTagStyle = {
  backgroundColor: '#dbeafe',
  color: '#1e40af',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '500',
  border: '1px solid #bfdbfe'
};

const moreTagStyle = {
  backgroundColor: '#f1f5f9',
  color: '#64748b',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '500',
  border: '1px solid #cbd5e1'
};

const emptyStateStyle = {
  color: '#94a3b8',
  fontSize: '0.875rem',
  fontStyle: 'italic'
};

const cubiculosCountStyle = {
  color: '#64748b',
  fontSize: '0.75rem',
  fontWeight: '500'
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
  marginBottom: '0.5rem',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease'
};

const cubiculosFormStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1rem',
  backgroundColor: '#f9fafb'
};

const cubiculoInputRowStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '0.5rem'
};

const removeButtonStyle = {
  backgroundColor: '#dc2626',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.75rem',
  minWidth: '2rem',
  transition: 'all 0.2s ease'
};

const addCubiculoButtonStyle = {
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease'
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

export default Edificios;