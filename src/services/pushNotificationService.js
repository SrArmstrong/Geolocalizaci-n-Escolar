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
      // Registrar service worker
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('🟢 Service Worker registrado:', this.swRegistration);

      // Verificar si ya estamos suscritos
      this.subscription = await this.swRegistration.pushManager.getSubscription();
      
      if (this.subscription) {
        console.log('✅ Ya suscrito a notificaciones push');
        return true;
      }

      return true;
    } catch (error) {
      console.error('❌ Error inicializando notificaciones:', error);
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
      console.log('✅ Suscrito a notificaciones push:', subscription);
      
      // Guardar suscripción en el servidor (opcional)
      await this.sendSubscriptionToServer(subscription);
      
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
    // Clave pública VAPID de ejemplo - GENERA TUS PROPIAS CLAVES
    return 'BPP4-q8NRHBw2jTH6X018ZSOinSmLHv5g2X6B16HoLBt9MCLrDhEPYSn8PkwVLv6vgT3IXsg1U_MCwGPX6fJvss'; // Reemplaza con tu clave pública real
  }

  // Verificar estado de permisos
  getPermissionState() {
    return Notification.permission;
  }

  // Verificar si está suscrito
  async isSubscribed() {
    if (!this.swRegistration) return false;
    
    const subscription = await this.swRegistration.pushManager.getSubscription();
    return subscription !== null;
  }

  // Cancelar suscripción
  async unsubscribe() {
    if (!this.subscription) return;

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;
      console.log('✅ Suscripción cancelada');
    } catch (error) {
      console.error('❌ Error cancelando suscripción:', error);
    }
  }

  // Mostrar notificación local (para testing)
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
}

export default new PushNotificationService();