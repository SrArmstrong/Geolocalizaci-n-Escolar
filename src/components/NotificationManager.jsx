import { useState, useEffect } from 'react';
import pushNotificationService from '../services/pushNotificationService';

const NotificationManager = () => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  const checkNotificationSupport = async () => {
    if (!pushNotificationService.isSupported) {
      setIsSupported(false);
      return;
    }

    setPermission(pushNotificationService.getPermissionState());
    const subscribed = await pushNotificationService.isSubscribed();
    setIsSubscribed(subscribed);
  };

  const handleActivateNotifications = async () => {
    if (isLoading || isSubscribed) return;
    
    setIsLoading(true);
    
    try {
      // Solo permitir activar notificaciones
      const result = await pushNotificationService.requestPermissionAndSubscribe();
      if (result) {
        setPermission('granted');
        setIsSubscribed(true);
        
        // Mostrar notificación de confirmación
        setTimeout(() => {
          pushNotificationService.showLocalNotification('🔔 Notificaciones Activadas', {
            body: 'Ahora recibirás alertas de nuevos eventos',
            data: { url: '/' }
          });
        }, 500);
      } else {
        setPermission('denied');
      }
    } catch (error) {
      console.error('Error activando notificaciones:', error);
    } finally {
      setIsLoading(false);
      await checkNotificationSupport();
    }
  };

  if (!isSupported) {
    return null;
  }

  // Si los permisos están denegados, mostrar un mensaje minimalista
  if (permission === 'denied') {
    return (
      <div className="notification-simple denied">
        <span className="notification-icon">🔕</span>
        <span className="notification-text">Notificaciones bloqueadas</span>
      </div>
    );
  }

  // Si ya está suscrito, mostrar información en lugar de botón
  if (isSubscribed) {
    return (
      <div className="notification-simple active">
        <span className="notification-icon">🔔</span>
        <div className="notification-info">
          <span className="notification-status">Notificaciones activas</span>
          <small className="notification-hint">
            Para desactivar: configuración del navegador → Permisos → Notificaciones
          </small>
        </div>
      </div>
    );
  }

  // Botón para activar (solo aparece cuando no está suscrito)
  return (
    <div className="notification-simple">
      <button
        onClick={handleActivateNotifications}
        disabled={isLoading}
        className="notification-toggle activate"
        title="Activar notificaciones"
      >
        <span className="toggle-icon">
          {isLoading ? '⏳' : '🔕'}
        </span>
        <span className="toggle-text">
          {isLoading ? 'Activando...' : 'Activar Notificaciones'}
        </span>
      </button>
    </div>
  );
};

export default NotificationManager;