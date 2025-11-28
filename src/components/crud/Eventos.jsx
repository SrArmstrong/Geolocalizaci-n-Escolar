import React, { useState, useEffect } from 'react';
import Card from '../commons/Card';
import { QRCodeCanvas } from "qrcode.react";
import './Eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    lugar: ''
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Obtener token de autenticación
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Configurar headers para las requests
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // 🔄 OBTENER EVENTOS DESDE EL BACKEND
  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://mapaback.onrender.com/events/', {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de autenticación inválido');
        }
        throw new Error('Error al cargar eventos');
      }

      const data = await response.json();
      
      // Transformar datos del backend al formato esperado por el frontend
      const eventosTransformados = data.map(evento => ({
        id: evento.codigo,
        codigo: evento.codigo,
        nombre: evento.title,
        title: evento.title,
        descripcion: evento.description,
        description: evento.description,
        latitude: evento.latitude,
        longitude: evento.longitude,
        lugar: evento.lugar || `Lat: ${evento.latitude}, Lng: ${evento.longitude}`,
        tipoEvento: 'Evento',
        fechaInicio: evento.createdAt ? new Date(evento.createdAt) : new Date(),
        fechaFin: evento.fechaFin ? new Date(evento.fechaFin) : new Date(Date.now() + 2 * 60 * 60 * 1000),
        createdBy: evento.createdBy,
        createdAt: evento.createdAt
      }));
      
      setEventos(eventosTransformados);
    } catch (err) {
      console.error('Error fetching eventos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // 🔄 FUNCIÓN MODIFICADA: REGISTRAR USUARIO Y OBTENER QR
  const handleRegister = async () => {
    try {
      setRegisterError('');
      setRegisterSuccess('');

      // Validaciones
      if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
        setRegisterError('Todos los campos son requeridos');
        return;
      }

      if (registerData.password !== registerData.confirmPassword) {
        setRegisterError('Las contraseñas no coinciden');
        return;
      }

      if (registerData.password.length < 6) {
        setRegisterError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        setRegisterError('Por favor ingrese un email válido');
        return;
      }

      // Llamar a la API de registro - CORREGIDO para coincidir con tu backend
      const response = await fetch('https://mapaback.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        // Usar el mensaje de error del backend
        throw new Error(result.message || result.error || 'Error al registrar usuario');
      }

      // ÉXITO: Mostrar QR con los datos del backend
      setQrData({
        totpSecret: result.totpSecret, // Esta es la URL para el QR
        email: registerData.email,
        rawSecret: result.totpSecret // Guardamos el secreto completo por si acaso
      });

      setRegisterSuccess('Usuario registrado exitosamente');
      
      // Limpiar formulario
      setRegisterData({
        email: '',
        password: '',
        confirmPassword: ''
      });

      setRegisterError('');
      
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      setRegisterError(err.message);
      setQrData(null);
    }
  };

  // 🔄 FUNCIÓN MEJORADA: CERRAR MODAL DE QR
  const handleCloseQr = () => {
    setQrData(null);
    setShowRegisterForm(false);
    setRegisterSuccess('');
    setRegisterError('');
  };

  // 🔄 NUEVA FUNCIÓN: CERRAR FORMULARIO DE REGISTRO
  const handleCloseRegisterForm = () => {
    setShowRegisterForm(false);
    setRegisterData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setRegisterError('');
    setRegisterSuccess('');
  };

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    if (date instanceof Date) {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    if (typeof date === 'string') {
      try {
        return new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return date;
      }
    }
    return 'Formato no válido';
  };

  const getEventStatus = (fechaInicio, fechaFin) => {
    const now = new Date();
    const inicio = fechaInicio instanceof Date ? fechaInicio : new Date(fechaInicio);
    const fin = fechaFin instanceof Date ? fechaFin : new Date(fechaFin);
    
    if (now < inicio) return { status: 'Próximo', color: '#10b981' };
    if (now >= inicio && now <= fin) return { status: 'En curso', color: '#f59e0b' };
    return { status: 'Finalizado', color: '#6b7280' };
  };

  const handleEdit = (evento) => {
    setFormData({
      codigo: evento.codigo,
      title: evento.title || '',
      description: evento.description || '',
      latitude: evento.latitude || '',
      longitude: evento.longitude || '',
      lugar: evento.lugar || ''
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({
      codigo: '',
      title: '',
      description: '',
      latitude: '',
      longitude: '',
      lugar: ''
    });
    setIsEditing(false);
    setShowForm(true);
  };

  // 🔄 GUARDAR EVENTO (CREATE/UPDATE)
  const handleSubmit = async () => {
    try {
      setError('');
      
      // Validaciones básicas
      if (!formData.codigo && !isEditing) {
        setError('El código del evento es requerido');
        return;
      }
      if (!formData.title) {
        setError('El título del evento es requerido');
        return;
      }

      // Preparar datos para el backend
      const eventData = {
        codigo: formData.codigo,
        title: formData.title,
        description: formData.description,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0
      };

      let response;
      
      if (isEditing) {
        // Actualizar evento existente
        response = await fetch(`https://mapaback.onrender.com/events/${formData.codigo}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(eventData)
        });
      } else {
        // Crear nuevo evento
        response = await fetch('https://mapaback.onrender.com/events/', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(eventData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar evento');
      }

      // Recargar la lista de eventos
      await fetchEventos();
      setShowForm(false);
      setError('');
    } catch (err) {
      console.error('Error al guardar evento:', err);
      setError(err.message);
    }
  };

  // 🔄 ELIMINAR EVENTO
  const handleDelete = async () => {
    try {
      setError('');
      
      const response = await fetch(`https://mapaback.onrender.com/events/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar evento');
      }

      // Actualizar estado local
      setEventos(prev => prev.filter(evento => evento.codigo !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Error al eliminar evento:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="eventos-loading-container">
        <div className="eventos-loading-spinner"></div>
        <p className="eventos-loading-text">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="eventos-container">
      {/* Mostrar errores */}
      {error && (
        <div className="eventos-error-message">
          ⚠️ {error}
          <button onClick={() => setError('')} className="eventos-error-close">×</button>
        </div>
      )}
      
      {/* Header de acciones */}
      <div className="eventos-header">
        <div className="eventos-stats-container">
          <div className="eventos-stat-item">
            <span className="eventos-stat-number">{eventos.length}</span>
            <span className="eventos-stat-label">Eventos registrados</span>
          </div>
          <div className="eventos-stat-item">
            <span className="eventos-stat-number">
              {eventos.filter(e => getEventStatus(e.fechaInicio, e.fechaFin).status === 'En curso').length}
            </span>
            <span className="eventos-stat-label">Eventos activos</span>
          </div>
        </div>
        
        <div className="eventos-actions">
          <button onClick={() => setShowRegisterForm(true)} className="eventos-secondary-button">
            👤 Registrar Usuario
          </button>
          <button onClick={fetchEventos} className="eventos-secondary-button">
            🔄 Actualizar
          </button>
          <button onClick={handleAdd} className="eventos-primary-button">
            <span className="eventos-button-icon">+</span>
            Registrar Evento
          </button>
        </div>
      </div>

      {/* Grid de eventos */}
      {eventos.length === 0 ? (
        <div className="eventos-empty-state-container">
          <div className="eventos-empty-state-icon">📅</div>
          <h3 className="eventos-empty-state-title">No hay eventos registrados</h3>
          <p className="eventos-empty-state-description">
            Comience agregando el primer evento del campus universitario
          </p>
          <button onClick={handleAdd} className="eventos-primary-button">
            <span className="eventos-button-icon">+</span>
            Registrar Primer Evento
          </button>
        </div>
      ) : (
        <div className="eventos-grid">
          {eventos.map((evento) => {
            const eventStatus = getEventStatus(evento.fechaInicio, evento.fechaFin);
            return (
              <Card key={evento.codigo}>
                <div className="eventos-card-content">
                  <div className="eventos-card-header">
                    <div className="eventos-event-icon">📅</div>
                    <div className="eventos-card-title-section">
                      <h3 className="eventos-card-title">{evento.title || evento.nombre}</h3>
                      <p className="eventos-card-subtitle">Código: {evento.codigo}</p>
                    </div>
                    <div 
                      className="eventos-status-badge" 
                      style={{backgroundColor: eventStatus.color}}
                    >
                      {eventStatus.status}
                    </div>
                  </div>
                  
                  <div className="eventos-card-body">
                    <div className="eventos-info-row">
                      <span className="eventos-label">🎯 Tipo:</span>
                      <span className="eventos-value">{evento.tipoEvento || 'Evento'}</span>
                    </div>
                    
                    <div className="eventos-info-row">
                      <span className="eventos-label">📍 Ubicación:</span>
                      <span className="eventos-value">
                        {evento.lugar || `Lat: ${evento.latitude}, Lng: ${evento.longitude}`}
                      </span>
                    </div>
                    
                    <div className="eventos-info-row">
                      <span className="eventos-label">🗓️ Creado:</span>
                      <span className="eventos-value">{formatDate(evento.createdAt)}</span>
                    </div>
                    
                    <div className="eventos-info-row">
                      <span className="eventos-label">👤 Creado por:</span>
                      <span className="eventos-value">{evento.createdBy || 'Sistema'}</span>
                    </div>
                    
                    <div className="eventos-info-row">
                      <span className="eventos-label">📝 Descripción:</span>
                      <div className="eventos-description">
                        {evento.description || evento.descripcion || 'No hay descripción disponible'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="eventos-card-footer">
                    <button onClick={() => handleEdit(evento)} className="eventos-secondary-button">
                      ✏️ Editar
                    </button>
                    <button onClick={() => setConfirmDeleteId(evento.codigo)} className="eventos-danger-button">
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de formulario de registro de usuario */}
      {showRegisterForm && !qrData && (
        <div className="eventos-modal-overlay">
          <div className="eventos-modal-content">
            <div className="eventos-modal-header">
              <h2 className="eventos-modal-title">👤 Registrar Nuevo Usuario</h2>
              <button 
                onClick={handleCloseRegisterForm} 
                className="eventos-close-button"
              >
                ✕
              </button>
            </div>
            
            <div className="eventos-form-container">
              {registerError && (
                <div className="eventos-error-message">
                  ⚠️ {registerError}
                </div>
              )}
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">Email *</label>
                <input
                  type="email"
                  placeholder="Ej: usuario@universidad.edu"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="eventos-input"
                />
              </div>
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">Contraseña *</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="eventos-input"
                />
              </div>
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">Confirmar Contraseña *</label>
                <input
                  type="password"
                  placeholder="Repita la contraseña"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="eventos-input"
                />
              </div>
            </div>

            <div className="eventos-modal-footer">
              <button onClick={handleCloseRegisterForm} className="eventos-cancel-button">
                Cancelar
              </button>
              <button onClick={handleRegister} className="eventos-primary-button">
                👤 Registrar Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de QR */}
      {qrData && (
        <div className="eventos-modal-overlay">
          <div className="eventos-modal-content">
            <div className="eventos-modal-header">
              <h2 className="eventos-modal-title">Configurar Autenticación 2FA</h2>
              <button 
                onClick={handleCloseQr} 
                className="eventos-close-button"
              >
                ✕
              </button>
            </div>
            
            <div className="eventos-form-container" style={{textAlign: 'center'}}>
              {registerSuccess && (
                <div className="eventos-success-message">
                  ✅ {registerSuccess}
                </div>
              )}
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">
                  <strong>Usuario:</strong> {qrData.email}
                </label>
                <p className="eventos-qr-instructions">
                  Escanee el siguiente código QR con la aplicación de autenticación (Google Authenticator, Authy, etc.)
                </p>
                
                {/* Componente QR corregido */}
                <div className="eventos-qr-container">
                  <QRCodeCanvas
                    value={qrData.totpSecret}
                    size={200}
                    level="M"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                
                <div className="eventos-security-notice">
                  <strong>Importante:</strong> Este código QR debe ser guardado de forma segura. 
                  Será necesario para autenticar al usuario en el sistema.
                </div>
              </div>
            </div>

            <div className="eventos-modal-footer">
              <button onClick={handleCloseQr} className="eventos-primary-button">
                Completado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario de evento */}
      {showForm && (
        <div className="eventos-modal-overlay">
          <div className="eventos-modal-content">
            <div className="eventos-modal-header">
              <h2 className="eventos-modal-title">
                {isEditing ? '✏️ Editar Evento' : '➕ Registrar Nuevo Evento'}
              </h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="eventos-close-button"
              >
                ✕
              </button>
            </div>
            
            <div className="eventos-form-container">
              {!isEditing && (
                <div className="eventos-field-group">
                  <label className="eventos-field-label">Código del Evento *</label>
                  <input
                    placeholder="Ej: EVT001, CONF2024, GRADUACION"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="eventos-input"
                  />
                </div>
              )}
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">Título del Evento *</label>
                <input
                  placeholder="Ej: Conferencia Anual de Tecnología"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="eventos-input"
                />
              </div>
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">Latitud</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej: 40.7128"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="eventos-input"
                />
              </div>
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">Longitud</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej: -74.0060"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="eventos-input"
                />
              </div>
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">Lugar (Descripción)</label>
                <input
                  placeholder="Ej: Auditorio Principal, Sala de Conferencias"
                  value={formData.lugar}
                  onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                  className="eventos-input"
                />
              </div>
              
              <div className="eventos-field-group">
                <label className="eventos-field-label">Descripción</label>
                <textarea
                  placeholder="Descripción detallada del evento..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="eventos-input"
                  style={{height: '100px', resize: 'vertical'}}
                />
              </div>
            </div>

            <div className="eventos-modal-footer">
              <button onClick={() => setShowForm(false)} className="eventos-cancel-button">
                Cancelar
              </button>
              <button onClick={handleSubmit} className="eventos-primary-button">
                {isEditing ? '💾 Actualizar' : '💾 Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmDeleteId && (
        <div className="eventos-modal-overlay">
          <div className="eventos-confirm-modal">
            <div className="eventos-confirm-icon">⚠️</div>
            <h3 className="eventos-confirm-title">Confirmar Eliminación</h3>
            <p className="eventos-confirm-message">
              ¿Está seguro de que desea eliminar este evento? Esta acción no se puede deshacer.
            </p>
            <div className="eventos-confirm-buttons">
              <button onClick={() => setConfirmDeleteId(null)} className="eventos-cancel-button">
                Cancelar
              </button>
              <button onClick={handleDelete} className="eventos-danger-button">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eventos;