// EventsList.jsx
import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService.js';
import bus from '../../bus.js';
import styles from '../commons/styles/EventsList.module.css';

const EventsList = ({ activeList, setActiveList, integrated = false }) => {
  const [eventos, setEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const visible = integrated ? true : activeList === "events";

  useEffect(() => {
    bus.on('eventos.cargados', (evento) => {
      setEventos(evento.datos);
    });
    bus.on('evento.seleccionado', (evento) => {
      console.log('Evento recibido en UI:', evento.datos);
    });
    eventService.cargarEventos();
  }, []);

  const toggleList = () => {
    if (!integrated) {
      setActiveList(visible ? null : "events");
    }
  };

  const normalizeText = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");

  const filtered = eventos.filter(evento => {
    const normalizedSearch = normalizeText(searchTerm);
    return (
      normalizeText(evento.title).includes(normalizedSearch) ||
      normalizeText(evento.description).includes(normalizedSearch) ||
      normalizeText(evento.codigo).includes(normalizedSearch)
    );
  });

  const goToEvent = (evento) => {
    eventService.seleccionarEvento(evento);
    if (!integrated) {
      setActiveList(null);
    }
  };

  // Modo integrado para WelcomeScreen
  if (integrated) {
    return (
      <div className={styles.integratedContainer}>
        <div className={styles.integratedHeader}>
          <h3 className={styles.integratedTitle}>📅 Eventos Universitarios</h3>
          <input
            type="text"
            placeholder="🔍 Buscar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.integratedSearchInput}
          />
        </div>
        
        <div className={styles.integratedList}>
          {filtered.length > 0 ? (
            filtered.map((evento, idx) => (
              <div key={idx} className={styles.integratedEventItem}>
                <button 
                  onClick={() => goToEvent(evento)} 
                  className={styles.integratedEventButton}
                >
                  <div className={styles.integratedEventContent}>
                    <span className={styles.eventIcon}>📅</span>
                    <div className={styles.eventDetails}>
                      <span className={styles.eventTitle}>{evento.title}</span>
                      <span className={styles.eventDescription}>{evento.description}</span>
                    </div>
                  </div>
                  <span className={styles.eventCode}>{evento.codigo}</span>
                </button>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No se encontraron eventos</div>
          )}
        </div>
      </div>
    );
  }

  // Modo flotante original
  return (
    <>
      <button
        onClick={toggleList}
        className={`${styles.toggleButton} ${visible ? styles.toggleButtonVisible : styles.toggleButtonHidden}`}
        title={visible ? "Ocultar eventos" : "Mostrar eventos"}
      >
        {visible ? '✕' : 'Eventos'}
      </button>

      {visible && (
        <div className={styles.panel}>
          <div className={styles.panelHandle} />
          <h3 className={styles.panelTitle}>Eventos UTEQ</h3>
          <input
            type="text"
            placeholder="🔍 Buscar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <ul className={styles.eventList}>
            {filtered.length > 0 ? (
              filtered.map((evento, idx) => (
                <li key={idx} className={styles.eventItem}>
                  <button onClick={() => goToEvent(evento)} className={styles.eventButton}>
                    <div className={styles.eventContent}>
                      <span className={styles.eventIcon}>📅</span>
                      <div className={styles.eventDetails}>
                        <span className={styles.eventTitle}>{evento.title}</span>
                        <span className={styles.eventDescription}>{evento.description}</span>
                      </div>
                    </div>
                    <span className={styles.eventCode}>{evento.codigo}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.noResults}>No se encontraron eventos</li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default EventsList;