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

  const handleToggleNotifications = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isSubscribed) {
        // Desactivar notificaciones
        await pushNotificationService.unsubscribe();
        setIsSubscribed(false);
      } else {
        // Activar notificaciones
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
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setIsLoading(false);
      await checkNotificationSupport();
    }
  };

  if (!isSupported) {
    return null; // Ocultar completamente si no es soportado
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

  return (
    <div className="notification-simple">
      <button
        onClick={handleToggleNotifications}
        disabled={isLoading}
        className={`notification-toggle ${isSubscribed ? 'active' : 'inactive'}`}
        title={isSubscribed ? 'Desactivar notificaciones' : 'Activar notificaciones'}
      >
        <span className="toggle-icon">
          {isSubscribed ? '🔔' : '🔕'}
        </span>
        <span className="toggle-text">
          {isLoading ? 'Cargando...' : (isSubscribed ? 'Notificaciones activadas' : 'Activar Notificaciones')}
        </span>
      </button>
    </div>
  );
};

export default NotificationManager;