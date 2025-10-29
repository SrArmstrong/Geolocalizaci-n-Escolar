import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import EventsList from '../components/commons/eventsList.jsx';
import logoUTEQ from '../assets/logo_uteq.png';
import bus from '../bus.js';
import eventService from '../services/eventService.js';
import './WelcomeScreen.css';

function WelcomeScreen({ onStartClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [mapClicks, setMapClicks] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [activeList, setActiveList] = useState(null);
  const [eventosData, setEventosData] = useState([]);
  const [showEventsList, setShowEventsList] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const statsRef = doc(db, "stats", "mapClicks");
    const unsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        setMapClicks(doc.data().count);
      }
    });

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

    bus.on('eventos.cargados', handleEventosCargados);
    eventService.cargarEventos();

    return () => {
      unsubscribe();
      bus.off('eventos.cargados', handleEventosCargados);
    };
  }, []);

  const handleMapClick = async () => {
    try {
      const statsRef = doc(db, "stats", "mapClicks");
      const docSnap = await getDoc(statsRef);
      
      if (docSnap.exists()) {
        await setDoc(statsRef, {
          count: increment(1)
        }, { merge: true });
      } else {
        await setDoc(statsRef, {
          count: 1
        });
      }
    } catch (error) {
      console.error("Error al actualizar el contador:", error);
    }
    
    onStartClick();
  };

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
    }, 1000);
  };

  return (
    <div className={`welcome-container ${isLoaded ? 'loaded' : ''}`}>

      {/* Botón para mostrar/ocultar estadísticas */}
      <button 
        onClick={() => setShowStats(!showStats)}
        className="stats-button"
      >
        📊 {showStats ? 'Ocultar Stats' : 'Mostrar Stats'}
      </button>

      {/* Ventana de estadísticas */}
      {showStats && (
        <div className="stats-panel">
          <h3 className="stats-title">
            📊 Estadísticas
          </h3>
          
          <div className="stats-content">
            <div className="stats-counter">
              <span style={{ fontWeight: '500' }}>Visitas al mapa:</span>
              <span className="stats-count">{mapClicks}</span>
            </div>
            
            <div className="stats-note">
              Actualizado en tiempo real
            </div>
          </div>
        </div>
      )}

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
          onClick={handleMapClick}
          className="explore-button"
        >
          🗺️ Explorar Mapa
        </button>
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
    </div>
  );
}

export default WelcomeScreen;