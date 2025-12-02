class PushNotificationService {
  constructor() {
    this.swRegistration = null;
    this.subscription = null;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Inicializar el servicio
  async initialize() {
    if (!this.isSupported) {
      console.warn('⚠️ Notificaciones push no soportadas en este navegador');
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');

      this.subscription = await this.swRegistration.pushManager.getSubscription();

      return true;

    } catch (error) {
      console.error('Error en notificaciones:', error);
      return false;
    }
  }

  // Solicitar permiso y suscribirse
  async requestPermissionAndSubscribe() {
    if (!this.isSupported) return false;

    try {
      // Solicitar permiso
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('⚠️ Permiso de notificaciones denegado');
        return false;
      }

      // Suscribirse a notificaciones push
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey())
      });

      this.subscription = subscription;
      
      return true;

    } catch (error) {
      console.error('❌ Error suscribiéndose a notificaciones:', error);
      return false;
    }
  }

  // Convertir clave VAPID
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Clave pública VAPID (debes generar tus propias claves)
  getVapidPublicKey() {
    return 'BPP4-q8NRHBw2jTH6X018ZSOinSmLHv5g2X6B16HoLBt9MCLrDhEPYSn8PkwVLv6vgT3IXsg1U_MCwGPX6fJvss';
  }

  getPermissionState() {
    return Notification.permission;
  }

  async isSubscribed() {
    if (!this.swRegistration) return false;
    
    const subscription = await this.swRegistration.pushManager.getSubscription();
    return subscription !== null;
  }

  // Cancelar suscripción
  async unsubscribe() {
    if (!this.subscription) return;

    try {
      // 1. Cancelar suscripción en el navegador
      await this.subscription.unsubscribe();
      
      // 2. Notificar al backend que se canceló la suscripción
      await this.notifyUnsubscribeToServer(this.subscription);
      
      // 3. Limpiar estado local
      this.subscription = null;
      
      console.log('Suscripción cancelada');
      
    } catch (error) {
      console.error('❌ Error cancelando suscripción:', error);
    }
  }

  async notifyUnsubscribeToServer(subscription) {
    try {
      const response = await fetch('https://mapaback.onrender.com/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription
        })
      });
      
      if (!response.ok) {
        throw new Error('Error notificando al servidor');
      }
      
      console.log('🔕 Servidor notificado de la desuscripción');
    } catch (error) {
      console.warn('⚠️ No se pudo notificar al servidor, pero la suscripción local se canceló');
    }
  }

  // Mostrar notificación local
  async showLocalNotification(title, options = {}) {
    if (!this.swRegistration) return;

    await this.swRegistration.showNotification(title, {
      body: options.body || 'Nuevo evento disponible',
      icon: options.icon || '/logo_uteq192.png',
      badge: '/logo_uteq192.png',
      data: options.data || { url: '/' },
      ...options
    });
  }

  // Notificar eventos
  async notifyEvent(eventData, type = 'new') {
    const title = type === 'new' ? '🎉 Nuevo Evento UTEQ' : '✏️ Evento Actualizado';
    const body = `${eventData.title || 'Evento'} - ${eventData.description || 'Disponible'}`;
    
    await this.showLocalNotification(title, {
      body: body,
      data: {
        eventId: eventData.codigo || eventData.id,
        url: '/'
      },
      tag: `event-${eventData.codigo || eventData.id}`,
      requireInteraction: true
    });
  }
}

export default new PushNotificationService();