// eventService.js
import bus from '../bus';
import { eventsData } from '../services/eventsData.js';

class EventService {
  cargarEventos() {
    const evento = {
      id: this.generarId(),
      tipo: 'eventos.cargados',
      datos: eventsData,
      timestamp: new Date()
    };
    
    console.log('📅 EVENTOS CARGADOS');
    bus.emit(evento.tipo, evento);
    return evento;
  }

  seleccionarEvento(evento) {
    const eventoMsg = {
      id: this.generarId(),
      tipo: 'evento.seleccionado',
      datos: evento,
      timestamp: new Date()
    };
    
    console.log('📍 EVENTO SELECCIONADO:', evento.title);
    bus.emit(eventoMsg.tipo, eventoMsg);
    return eventoMsg;
  }

  generarId() {
    return `evt_${Date.now()}`;
  }
}

export default new EventService();