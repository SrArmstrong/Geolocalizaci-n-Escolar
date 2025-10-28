// bus.js
const events = {};

const bus = {
  on(event, callback) {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);
  },

  emit(event, data) {
    if (events[event]) {
      events[event].forEach(callback => callback(data));
    }
  },

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
