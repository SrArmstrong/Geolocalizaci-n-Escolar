import { useState, useEffect } from 'react';
import pushNotificationService from '../services/pushNotificationService';

const NotificationManager = () => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

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

  const handleEnableNotifications = async () => {
    const result = await pushNotificationService.requestPermissionAndSubscribe();
    
    if (result) {
      setPermission('granted');
      setIsSubscribed(true);
      
      // Mostrar notificación de prueba
      setTimeout(() => {
        pushNotificationService.showLocalNotification('🔔 Notificaciones Activadas', {
          body: 'Ahora recibirás alertas de nuevos eventos en la UTEQ',
          data: { url: '/' }
        });
      }, 1000);
    } else {
      setPermission('denied');
    }
  };

  const handleDisableNotifications = async () => {
    await pushNotificationService.unsubscribe();
    setIsSubscribed(false);
  };

  if (!isSupported) {
    return (
      <div className="notification-manager">
        <p className="notification-warning">
          ⚠️ Tu navegador no soporta notificaciones push
        </p>
      </div>
    );
  }

  return (
    <div className="notification-manager">
      <h4>🔔 Notificaciones de Eventos</h4>
      
      <div className="notification-status">
        <p>
          <strong>Estado:</strong> 
          {permission === 'granted' && isSubscribed && ' ✅ Activadas'}
          {permission === 'granted' && !isSubscribed && ' ⚠️ Permiso concedido pero no suscrito'}
          {permission === 'default' && ' ❓ Pendiente de permiso'}
          {permission === 'denied' && ' ❌ Bloqueadas'}
        </p>
      </div>

      {permission === 'default' && (
        <button 
          onClick={handleEnableNotifications}
          className="notification-button enable"
        >
          🔔 Activar Notificaciones
        </button>
      )}

      {permission === 'granted' && !isSubscribed && (
        <button 
          onClick={handleEnableNotifications}
          className="notification-button enable"
        >
          🔔 Suscribirse a Notificaciones
        </button>
      )}

      {isSubscribed && (
        <div>
          <p className="notification-success">
            ✅ Recibirás notificaciones de nuevos eventos
          </p>
          <button 
            onClick={handleDisableNotifications}
            className="notification-button disable"
          >
            🔕 Desactivar Notificaciones
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <p className="notification-error">
          ❌ Los permisos para notificaciones fueron denegados. 
          Para activarlas, ve a la configuración de tu navegador y permite notificaciones para este sitio.
        </p>
      )}
    </div>
  );
};

export default NotificationManager;