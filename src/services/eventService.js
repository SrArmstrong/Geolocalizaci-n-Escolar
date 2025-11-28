// eventService.js
/*
import bus from '../bus';
import { eventsData } from '../services/eventsData.js';

class EventService {

  // Carga los eventos y emite 'eventos.cargados' con los datos del eventsData.js
  cargarEventos() {
    const evento = {
      id: this.generarId(),
      tipo: 'eventos.cargados',
      datos: eventsData,
      timestamp: new Date()
    };
    //console.log('📅 EVENTOS CARGADOS');

    // Es enviado al Bus para que otros componentes lo puedan recibir
    bus.emit(evento.tipo, evento);
    return evento;
  }

  // Incluye información del eveneto seleccionado
  seleccionarEvento(evento) {
    const eventoMsg = {
      id: this.generarId(),
      tipo: 'evento.seleccionado',
      datos: evento,
      timestamp: new Date()
    };
    
    //console.log('📍 EVENTO SELECCIONADO:', evento.title);

    // Es enviado al Bus para que otros componentes lo puedan recibir (información como la latitude y longitude)
    bus.emit(eventoMsg.tipo, eventoMsg);
    return eventoMsg;
  }

  generarId() {
    return `evt_${Date.now()}`;
  }
}

export default new EventService();
*/

// eventService.js V2
/*
import bus from '../bus';

class EventService {

  async cargarEventos() {
    try {
      const token = localStorage.getItem('token'); // Ajusta si lo guardas en otro lugar

      const response = await fetch('https://mapaback.onrender.com/events/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al obtener eventos desde la API');
      }

      const eventosAPI = await response.json();

      const evento = {
        id: this.generarId(),
        tipo: 'eventos.cargados',
        datos: eventosAPI,
        timestamp: new Date()
      };

      bus.emit(evento.tipo, evento);
      return evento;

    } catch (error) {
      console.error('Error cargando eventos:', error);
      return null;
    }
  }

  seleccionarEvento(evento) {
    const eventoMsg = {
      id: this.generarId(),
      tipo: 'evento.seleccionado',
      datos: evento,
      timestamp: new Date()
    };

    bus.emit(eventoMsg.tipo, eventoMsg);
    return eventoMsg;
  }

  generarId() {
    return `evt_${Date.now()}`;
  }
}

export default new EventService();
*/

//eventService.js V3 con WebSockets
/*
import bus from '../bus';
import socket from '../socket';

class EventService {

  constructor() {
    this.inicializarSocket();
  }

  inicializarSocket() {
    //console.log("🟣 Escuchando WebSockets...");

    socket.on("event.created", () => {
      //console.log("🔵 Evento creado");
      this.cargarEventos(); // refresca lista completa
    });

    socket.on("event.updated", () => {
      //console.log("🟡 Evento actualizado");
      this.cargarEventos();
    });

    socket.on("event.deleted", () => {
      //console.log("🔴 Evento eliminado");
      this.cargarEventos();
    });
  }


  async cargarEventos() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://mapaback.onrender.com/events/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al obtener eventos");

      const eventos = await response.json();

      const evento = {
        id: this.generarId(),
        tipo: "eventos.cargados",
        datos: eventos,
        timestamp: new Date()
      };

      bus.emit(evento.tipo, evento);
      return evento;

    } catch (e) {
      console.error("Error cargando eventos:", e);
      return null;
    }
  }

  seleccionarEvento(evento) {
    const eventoMsg = {
      id: this.generarId(),
      tipo: 'evento.seleccionado',
      datos: evento,
      timestamp: new Date()
    };

    bus.emit(eventoMsg.tipo, eventoMsg);
    return eventoMsg;
  }

  generarId() {
    return `evt_${Date.now()}`;
  }
}

export default new EventService();
*/

// eventService.js V4 con Notificaciones Push
import bus from '../bus';
import socket from '../socket';
import pushNotificationService from './pushNotificationService';

class EventService {
  constructor() {
    this.inicializarSocket();
    this.inicializarNotificaciones();
  }

  async inicializarNotificaciones() {
    // Inicializar servicio de notificaciones
    await pushNotificationService.initialize();
    
    // Solicitar permiso cuando se cargue la app
    setTimeout(async () => {
      const permission = pushNotificationService.getPermissionState();
      if (permission === 'default') {
        // Puedes mostrar un botón para que el usuario active notificaciones
        console.log('ℹ️ Permiso de notificaciones disponible');
      }
    }, 3000);
  }

  inicializarSocket() {
    console.log("🟣 Escuchando WebSockets...");

    socket.on("event.created", (eventData) => {
      console.log("🔵 Evento creado:", eventData);
      this.mostrarNotificacionEvento(eventData, 'nuevo');
      this.cargarEventos();
    });

    socket.on("event.updated", (eventData) => {
      console.log("🟡 Evento actualizado:", eventData);
      this.mostrarNotificacionEvento(eventData, 'actualizado');
      this.cargarEventos();
    });

    socket.on("event.deleted", (eventData) => {
      console.log("🔴 Evento eliminado:", eventData);
      this.cargarEventos();
    });
  }

  // Mostrar notificación cuando hay nuevo evento
  async mostrarNotificacionEvento(eventData, tipo) {
    // ⛔ NO ENVIAR NADA si el usuario NO está suscrito
    const isSubscribed = await pushNotificationService.isSubscribed();
    if (!isSubscribed) {
      console.log("🔕 Notificaciones desactivadas, no se mostrará nada.");
      return;
    }

    const titulo = tipo === 'nuevo' ? '🎉 Nuevo Evento UTEQ' : '✏️ Evento Actualizado';
    const cuerpo = `${eventData.title || 'Evento'} - ${eventData.description || 'Disponible'}`;

    if (pushNotificationService.getPermissionState() === 'granted') {
      await pushNotificationService.showLocalNotification(titulo, {
        body: cuerpo,
        data: {
          url: '/',
          eventId: eventData.codigo || eventData.id,
          timestamp: new Date().toISOString()
        },
        tag: `event-${eventData.codigo || eventData.id}`,
        renotify: true,
        requireInteraction: true
      });
    }
  }

  async cargarEventos() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mapaback.onrender.com/events/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al obtener eventos");
      const eventos = await response.json();

      const evento = {
        id: this.generarId(),
        tipo: "eventos.cargados",
        datos: eventos,
        timestamp: new Date()
      };

      bus.emit(evento.tipo, evento);
      return evento;

    } catch (e) {
      console.error("Error cargando eventos:", e);
      return null;
    }
  }

  seleccionarEvento(evento) {
    const eventoMsg = {
      id: this.generarId(),
      tipo: 'evento.seleccionado',
      datos: evento,
      timestamp: new Date()
    };

    bus.emit(eventoMsg.tipo, eventoMsg);
    return eventoMsg;
  }

  generarId() {
    return `evt_${Date.now()}`;
  }
}

export default new EventService();