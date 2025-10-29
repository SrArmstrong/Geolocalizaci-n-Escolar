// eventService.js
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