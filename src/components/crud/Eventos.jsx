import React, { useState, useEffect } from 'react';
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
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    if (typeof timestamp === 'string') return timestamp;
    return 'Formato no válido';
  };

  const getEventStatus = (fechaInicio, fechaFin) => {
    const now = new Date();
    const inicio = fechaInicio instanceof Timestamp ? fechaInicio.toDate() : new Date(fechaInicio);
    const fin = fechaFin instanceof Timestamp ? fechaFin.toDate() : new Date(fechaFin);
    
    if (now < inicio) return { status: 'Próximo', color: '#10b981' };
    if (now >= inicio && now <= fin) return { status: 'En curso', color: '#f59e0b' };
    return { status: 'Finalizado', color: '#6b7280' };
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

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingSpinnerStyle}></div>
        <p style={loadingTextStyle}>Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header de acciones */}
      <div style={headerStyle}>
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>{eventos.length}</span>
            <span style={statLabelStyle}>Eventos registrados</span>
          </div>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>
              {eventos.filter(e => getEventStatus(e.fechaInicio, e.fechaFin).status === 'En curso').length}
            </span>
            <span style={statLabelStyle}>Eventos activos</span>
          </div>
        </div>
        
        <button onClick={handleAdd} style={primaryButtonStyle}>
          <span style={buttonIconStyle}>+</span>
          Registrar Evento
        </button>
      </div>

      {/* Grid de eventos */}
      {eventos.length === 0 ? (
        <div style={emptyStateContainerStyle}>
          <div style={emptyStateIconStyle}>📅</div>
          <h3 style={emptyStateTitleStyle}>No hay eventos registrados</h3>
          <p style={emptyStateDescriptionStyle}>
            Comience agregando el primer evento del campus universitario
          </p>
          <button onClick={handleAdd} style={primaryButtonStyle}>
            <span style={buttonIconStyle}>+</span>
            Registrar Primer Evento
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {eventos.map((evento) => {
            const eventStatus = getEventStatus(evento.fechaInicio, evento.fechaFin);
            return (
              <Card key={evento.id}>
                <div style={cardContentStyle}>
                  <div style={cardHeaderStyle}>
                    <div style={eventIconStyle}>📅</div>
                    <div style={cardTitleSectionStyle}>
                      <h3 style={cardTitleStyle}>{evento.nombre || evento.id}</h3>
                      <p style={cardSubtitleStyle}>ID: {evento.id}</p>
                    </div>
                    <div style={{...statusBadgeStyle, backgroundColor: eventStatus.color}}>
                      {eventStatus.status}
                    </div>
                  </div>
                  
                  <div style={cardBodyStyle}>
                    <div style={infoRowStyle}>
                      <span style={labelStyle}>🎯 Tipo:</span>
                      <span style={valueStyle}>{evento.tipoEvento || 'No especificado'}</span>
                    </div>
                    
                    <div style={infoRowStyle}>
                      <span style={labelStyle}>📍 Lugar:</span>
                      <span style={valueStyle}>{evento.lugar || 'No especificado'}</span>
                    </div>
                    
                    <div style={infoRowStyle}>
                      <span style={labelStyle}>🗓️ Inicio:</span>
                      <span style={valueStyle}>{formatFirebaseDate(evento.fechaInicio)}</span>
                    </div>
                    
                    <div style={infoRowStyle}>
                      <span style={labelStyle}>🏁 Fin:</span>
                      <span style={valueStyle}>{formatFirebaseDate(evento.fechaFin)}</span>
                    </div>
                    
                    <div style={infoRowStyle}>
                      <span style={labelStyle}>📝 Descripción:</span>
                      <div style={descriptionStyle}>
                        {evento.descripcion || 'No hay descripción disponible'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={cardFooterStyle}>
                    <button onClick={() => handleEdit(evento)} style={secondaryButtonStyle}>
                      ✏️ Editar
                    </button>
                    <button onClick={() => setConfirmDeleteId(evento.id)} style={dangerButtonStyle}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>
                {isEditing ? '✏️ Editar Evento' : '➕ Registrar Nuevo Evento'}
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
                  <label style={fieldLabelStyle}>ID del Evento *</label>
                  <input
                    placeholder="Ej: EVT001, CONF2024, GRADUACION"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Nombre del Evento *</label>
                <input
                  placeholder="Ej: Conferencia Anual de Tecnología"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Tipo de Evento</label>
                <input
                  placeholder="Ej: Conferencia, Seminario, Graduación"
                  value={formData.tipoEvento}
                  onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Lugar</label>
                <input
                  placeholder="Ej: Auditorio Principal, Sala de Conferencias"
                  value={formData.lugar}
                  onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Fecha de Inicio *</label>
                <input
                  type="datetime-local"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Fecha de Fin *</label>
                <input
                  type="datetime-local"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={fieldLabelStyle}>Descripción</label>
                <textarea
                  placeholder="Descripción detallada del evento..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  style={{...inputStyle, height: '100px', resize: 'vertical'}}
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
              ¿Está seguro de que desea eliminar este evento? Esta acción no se puede deshacer.
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

// Estilos actualizados basados en el componente Edificios
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))'
};

const cardContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '320px'
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e2e8f0'
};

const eventIconStyle = {
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

const statusBadgeStyle = {
  color: 'white',
  padding: '0.25rem 0.5rem',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textAlign: 'center',
  minWidth: '70px'
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

const descriptionStyle = {
  color: '#1f2937',
  fontSize: '0.875rem',
  paddingLeft: '1rem',
  lineHeight: 1.4,
  maxHeight: '4rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
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

export default Eventos;