// bus.js
const events = {};

const bus = {

  // Recibe eventos
  emit(event, data) {
    if (events[event]) {
      events[event].forEach(callback => callback(data));
    }
  },

  // Registra las peticiones de eventos
  on(event, callback) {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);
  },

  // Desvincula las peticiones de eventos
  off(event, callback) {
    if (events[event]) {
      if (callback) {
        events[event] = events[event].filter(cb => cb !== callback);
      } else {
        delete events[event];
      }
    }
  }
};

export default bus;
