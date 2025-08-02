import React, { useState, useEffect } from 'react';
import Card from '../commons/Card';
import { db } from '../../firebase';
import { doc, deleteDoc, updateDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';

const Profesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    id: '', 
    nombre: '', 
    cubiculo: '', 
    coordenadas: [0, 0],
    materias: [] 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'profesores'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const profesorData = doc.data();
        const tieneCoordenadas = profesorData.coordenadas && profesorData.coordenadas["0"] && profesorData.coordenadas["1"];
        
        return {
          id: doc.id,
          nombre: profesorData.nombre || "Desconocido",
          cubiculo: profesorData.cubiculo || "No especificado",
          coordenadas: tieneCoordenadas
            ? [
                parseFloat(profesorData.coordenadas["0"]),
                parseFloat(profesorData.coordenadas["1"]),
              ]
            : [0, 0],
          materias: profesorData.materias || []
        };
      }).filter(prof => prof.coordenadas[0] !== 0 && prof.coordenadas[1] !== 0);
      
      setProfesores(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (profesor) => {
    setFormData({ 
      ...profesor, 
      materias: profesor.materias || [],
      coordenadas: profesor.coordenadas || [0, 0]
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ 
      id: '', 
      nombre: '', 
      cubiculo: '', 
      coordenadas: [0, 0],
      materias: [] 
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const { id, nombre, cubiculo, coordenadas, materias } = formData;
    try {
      const docRef = doc(db, 'profesores', id);
      if (isEditing) {
        await updateDoc(docRef, { 
          nombre, 
          cubiculo, 
          coordenadas: {
            "0": coordenadas[0],
            "1": coordenadas[1]
          },
          materias 
        });
      } else {
        await setDoc(docRef, { 
          nombre, 
          cubiculo, 
          coordenadas: {
            "0": coordenadas[0],
            "1": coordenadas[1]
          },
          materias 
        });
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar profesor:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'profesores', confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Error al eliminar profesor:", error);
    }
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingSpinnerStyle}></div>
        <p style={loadingTextStyle}>Cargando profesores...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header de acciones */}
      <div style={headerStyle}>
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>{profesores.length}</span>
            <span style={statLabelStyle}>Profesores registrados</span>
          </div>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>
              {profesores.filter(p => p.materias && p.materias.length > 0).length}
            </span>
            <span style={statLabelStyle}>Con materias asignadas</span>
          </div>
        </div>
        
        <button onClick={handleAdd} style={primaryButtonStyle}>
          <span style={buttonIconStyle}>+</span>
          Registrar Profesor
        </button>
      </div>

      {/* Grid de profesores */}
      {profesores.length === 0 ? (
        <div style={emptyStateContainerStyle}>
          <div style={emptyStateIconStyle}>👨‍🏫</div>
          <h3 style={emptyStateTitleStyle}>No hay profesores registrados</h3>
          <p style={emptyStateDescriptionStyle}>
            Comience agregando el primer profesor al sistema
          </p>
          <button onClick={handleAdd} style={primaryButtonStyle}>
            <span style={buttonIconStyle}>+</span>
            Registrar Primer Profesor
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {profesores.map((profesor) => (
            <Card key={profesor.id}>
              <div style={cardContentStyle}>
                <div style={cardHeaderStyle}>
                  <div style={professorIconStyle}>👨‍🏫</div>
                  <div style={cardTitleSectionStyle}>
                    <h3 style={cardTitleStyle}>{profesor.nombre?.trim() || 'Sin nombre'}</h3>
                    <p style={cardSubtitleStyle}>ID: {profesor.id}</p>
                  </div>
                </div>
                
                <div style={cardBodyStyle}>
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>📧 Correo:</span>
                    <span style={valueStyle}>{profesor.id}</span>
                  </div>
                  
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>👤 Nombre:</span>
                    <span style={valueStyle}>{profesor.nombre?.trim() || 'Sin nombre'}</span>
                  </div>
                  
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>🏢 Cubículo:</span>
                    <span style={valueStyle}>{profesor.cubiculo || 'No especificado'}</span>
                  </div>
                  
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>📍 Coordenadas:</span>
                    <span style={valueStyle}>
                      {profesor.coordenadas ? `${profesor.coordenadas[0]}, ${profesor.coordenadas[1]}` : 'No especificadas'}
                    </span>
                  </div>
                  
                  <div style={infoRowStyle}>
                    <span style={labelStyle}>📚 Materias:</span>
                    <div style={materiasContainerStyle}>
                      {profesor.materias?.length > 0 ? (
                        profesor.materias.map((materia, index) => (
                          <span key={index} style={materiaTagStyle}>
                            {materia}
                          </span>
                        ))
                      ) : (
                        <span style={noMateriasStyle}>No hay materias asignadas</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={cardFooterStyle}>
                  <button onClick={() => handleEdit(profesor)} style={secondaryButtonStyle}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => setConfirmDeleteId(profesor.id)} style={dangerButtonStyle}>
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
                {isEditing ? '✏️ Editar Profesor' : '➕ Registrar Nuevo Profesor'}
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
                    placeholder="Ej: profesor@ejemplo.com"
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
                <label style={fieldLabelStyle}>Cubículo</label>
                <input
                  placeholder="Ej: A101"
                  value={formData.cubiculo}
                  onChange={(e) => setFormData({ ...formData, cubiculo: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Coordenadas</label>
                <div style={coordenadasContainerStyle}>
                  <input
                    type="number"
                    placeholder="Latitud"
                    value={formData.coordenadas[0]}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      coordenadas: [parseFloat(e.target.value) || 0, formData.coordenadas[1]] 
                    })}
                    style={coordenadaInputStyle}
                  />
                  <input
                    type="number"
                    placeholder="Longitud"
                    value={formData.coordenadas[1]}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      coordenadas: [formData.coordenadas[0], parseFloat(e.target.value) || 0] 
                    })}
                    style={coordenadaInputStyle}
                  />
                </div>
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Materias</label>
                <div style={materiasFormContainerStyle}>
                  {formData.materias.map((materia, index) => (
                    <div key={index} style={materiaInputGroupStyle}>
                      <input
                        type="text"
                        value={materia}
                        onChange={(e) => {
                          const updated = [...formData.materias];
                          updated[index] = e.target.value;
                          setFormData({ ...formData, materias: updated });
                        }}
                        placeholder={`Materia ${index + 1}`}
                        style={materiaInputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.materias.filter((_, i) => i !== index);
                          setFormData({ ...formData, materias: updated });
                        }}
                        style={removeMateriaButtonStyle}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, materias: [...formData.materias, ''] })}
                    style={addMateriaButtonStyle}
                  >
                    <span style={buttonIconStyle}>+</span>
                    Añadir Materia
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
              ¿Está seguro de que desea eliminar este profesor? Esta acción no se puede deshacer.
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

// Estilos aplicados del componente Usuarios
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
  minHeight: '300px'
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e2e8f0'
};

const professorIconStyle = {
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

const materiasContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  paddingLeft: '1rem',
  marginTop: '0.5rem'
};

const materiaTagStyle = {
  backgroundColor: '#dbeafe',
  color: '#1e40af',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '500'
};

const noMateriasStyle = {
  color: '#9ca3af',
  fontSize: '0.875rem',
  fontStyle: 'italic',
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

const materiasFormContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const materiaInputGroupStyle = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center'
};

const materiaInputStyle = {
  flex: 1,
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  color: '#1f2937'
};

const removeMateriaButtonStyle = {
  backgroundColor: '#dc2626',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  minWidth: '2rem'
};

const addMateriaButtonStyle = {
  backgroundColor: '#059669',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  alignSelf: 'flex-start'
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
const coordenadasContainerStyle = { 
  display: 'flex',
  gap: '8px'
};
const coordenadaInputStyle = {
  flex: 1,
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

export default Profesores;