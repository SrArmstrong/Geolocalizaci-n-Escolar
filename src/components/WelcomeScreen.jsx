import { useState, useEffect } from 'react';
import EventsList from '../components/commons/eventsList.jsx';
import logoUTEQ from '../assets/logo_uteq.png';
import bus from '../bus.js';
import eventService from '../services/eventService.js';
import './WelcomeScreen.css';
import { Link } from "react-router-dom";

//Notificaciones
import NotificationManager from '../components/NotificationManager';

function WelcomeScreen({ onStartClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [activeList, setActiveList] = useState(null);
  const [eventosData, setEventosData] = useState([]);
  const [showEventsList, setShowEventsList] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleEventosCargados = (evento) => {
      setEventosData(evento.datos.map(e => ({
        name: e.title,
        location: e.description,
        coords: [e.latitude, e.longitude],
        icon: '📍',
        color: '#a78bfa',
        codigo: e.codigo
      })));
    };

    const handleEventoActualizado = (evento) => {
      setEventosData(prev =>
        prev.map(e => e.codigo === evento.codigo ? {
          ...e,
          name: evento.title,
          location: evento.description,
          coords: [evento.latitude, evento.longitude]
        } : e)
      );
    };

    const handleEventoEliminado = (codigo) => {
      setEventosData(prev => prev.filter(e => e.codigo !== codigo));
    };

    bus.on('eventos.cargados', handleEventosCargados);
    bus.on('evento.actualizado', handleEventoActualizado);
    bus.on('evento.eliminado', handleEventoEliminado);

    eventService.cargarEventos();

    return () => {
      bus.off('eventos.cargados', handleEventosCargados);
      bus.off('evento.actualizado', handleEventoActualizado);
      bus.off('evento.eliminado', handleEventoEliminado);
    };
  }, []);


  const sections = {
    main: {
      title: "Bienvenido a la UTEQ",
      icon: "🏛️",
      content: "Una institución comprometida con la excelencia académica y el desarrollo tecnológico.",
      gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
    },
    carreras: {
      title: "Nuestras Carreras",
      icon: "🎓",
      content: [
        { name: "Ingeniería en Sistemas", icon: "💻" },
        { name: "Ingeniería Mecatrónica", icon: "🤖" },
        { name: "Ingeniería Industrial", icon: "⚙️" },
        { name: "Ingeniería Ambiental", icon: "🌱" },
        { name: "Tecnologías de la Información", icon: "📱" },
        { name: "Ingeniería en Procesos Industriales", icon: "🏭" },
        { name: "División de Idiomas", icon: "🌍" }
      ],
      gradient: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)"
    },
    eventos: {
      title: "Eventos Universitarios",
      icon: "📅",
      content: "Explora los próximos eventos y actividades en la UTEQ",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
    }
  };

  const handleEventClick = (coords, locationName) => {
    onStartClick();
    setTimeout(() => {
      window.showRouteToLocation && window.showRouteToLocation(coords, locationName);
    }, 500);
  };

  return (
    <div className={`welcome-container ${isLoaded ? 'loaded' : ''}`}>

      {/* Header Section */}
      <div className="header-section">
        <img 
          src={logoUTEQ}
          alt="UTEQ Logo" 
          className="logo-image"
        />
        
        <h1 className="main-title">
          Mapa UTEQ
        </h1>
        
        <p className="subtitle">
          Explora nuestra universidad de manera interactiva
        </p>

        <button 
          onClick={onStartClick}
          className="explore-button"
        >
          🗺️ Explorar Mapa
        </button>
        
        {/* Notificaciones - Integrado minimalista */}
        <NotificationManager />
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        {Object.keys(sections).map(section => (
          <button
            key={section}
            onClick={() => {
              setActiveSection(section);
              if (section === 'eventos') {
                setShowEventsList(false);
              }
            }}
            className={`nav-button ${activeSection === section ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.2rem' }}>{sections[section].icon}</span>
            {sections[section].title}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div 
          className="section-card"
          style={{ background: sections[activeSection].gradient }}
        >
          <div className="section-pulse" />
          
          <h2 className="section-title">
            <span className="section-icon">{sections[activeSection].icon}</span>
            {sections[activeSection].title}
          </h2>
          
          {activeSection === 'main' && (
            <p style={{ fontSize: '1.3rem', lineHeight: '1.7', opacity: 0.95 }}>
              {sections[activeSection].content}
            </p>
          )}

          {activeSection === 'carreras' && (
            <div className="careers-grid">
              {sections.carreras.content.map((carrera, index) => (
                <div
                  key={index}
                  className="career-item"
                >
                  <span style={{ fontSize: '2rem' }}>{carrera.icon}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{carrera.name}</span>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'eventos' && (
            <div>
              {/* Botones para cambiar entre vistas */}
              <div className="view-buttons">
                <button
                  onClick={() => setShowEventsList(false)}
                  className={`view-button ${!showEventsList ? 'active' : ''}`}
                >
                  🗂️ Vista de Tarjetas
                </button>
                <button
                  onClick={() => setShowEventsList(true)}
                  className={`view-button ${showEventsList ? 'active' : ''}`}
                >
                  📋 Lista Completa
                </button>
              </div>

              {/* Vista de Tarjetas */}
              {!showEventsList && (
                <div className="events-grid">
                  {eventosData.map((event, index) => (
                    <div
                      key={index}
                      onClick={() => handleEventClick(event.coords, event.location)}
                      className="event-card"
                    >
                      <div 
                        className="event-icon"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.icon}
                      </div>
                      
                      <h3 className="event-title">
                        {event.name}
                      </h3>
                      <p className="event-location">
                        <span>📍</span> {event.location}
                      </p>
                      <p className="event-code">
                        Código: {event.codigo}
                      </p>
                      <div className="event-action">
                        👆 Click para ubicar en el mapa
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vista de Lista Completa */}
              {showEventsList && (
                <div className="events-list-container">
                  <EventsList 
                    integrated={true}
                    activeList={activeList}
                    setActiveList={setActiveList}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <footer className="footer">
        
        <span style={{ margin: "0 8px" }}>|</span>
        <Link to="/privacidad" className="footer-link">
          Aviso de Privacidad
        </Link>
        <span style={{ margin: "0 8px" }}>|</span>
        
      </footer>

    </div>
  );
}

export default WelcomeScreen;
