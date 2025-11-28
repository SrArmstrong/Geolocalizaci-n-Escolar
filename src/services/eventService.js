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

// eventService.js
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
