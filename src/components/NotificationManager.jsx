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

    const result = await pushNotificationService.requestPermissionAndSubscribe();
    if (result) {
      setPermission('granted');
      setIsSubscribed(true);

      setTimeout(() => {
        pushNotificationService.showLocalNotification('🔔 Notificaciones activadas', {
          body: 'Ahora recibirás alertas de nuevos eventos',
          data: { url: '/' }
        });
      }, 500);
    }

    setIsLoading(false);
    await checkNotificationSupport();
  };

  const handleDeactivateNotifications = async () => {
    if (isLoading || !isSubscribed) return;
    setIsLoading(true);

    await pushNotificationService.unsubscribe();

    setIsSubscribed(false);

    setTimeout(() => {
      pushNotificationService.showLocalNotification('🔕 Notificaciones desactivadas', {
        body: 'Ya no recibirás alertas',
        data: { url: '/' }
      });
    }, 500);

    setIsLoading(false);
    await checkNotificationSupport();
  };

  if (!isSupported) return null;

  if (permission === 'denied') {
    return (
      <div className="notification-simple denied">
        <span className="notification-icon">🚫</span>
        <span className="notification-text">Notificaciones bloqueadas</span>
      </div>
    );
  }

  return (
    <div className="notification-simple">
      {isSubscribed ? (
        <button
          onClick={handleDeactivateNotifications}
          disabled={isLoading}
          className="notification-toggle deactivate"
          title="Desactivar notificaciones"
        >
          <span className="toggle-icon">{isLoading ? '⏳' : '🔕'}</span>
          <span className="toggle-text">
            {isLoading ? 'Desactivando...' : 'Desactivar Notificaciones'}
          </span>
        </button>
      ) : (
        <button
          onClick={handleActivateNotifications}
          disabled={isLoading}
          className="notification-toggle activate"
          title="Activar notificaciones"
        >
          <span className="toggle-icon">{isLoading ? '⏳' : '🔔'}</span>
          <span className="toggle-text">
            {isLoading ? 'Activando...' : 'Activar Notificaciones'}
          </span>
        </button>
      )}
    </div>
  );
};

export default NotificationManager;