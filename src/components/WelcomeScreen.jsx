import { useState, useEffect } from 'react';
import logoUTEQ from '../assets/logo_uteq.png'; // Adjust the import path as necessary

function WelcomeScreen({ onStartClick, onAdminClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('main');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sections = {
    main: {
      title: "Bienvenido a la UTEQ",
      content: "Una institución comprometida con la excelencia académica y el desarrollo tecnológico."
    },
    carreras: {
      title: "Nuestras Carreras",
      content: `
        • Ingeniería en Sistemas
        • Ingeniería Mecatrónica
        • Ingeniería Industrial
        • Ingeniería Ambiental
        • Tecnologías de la Información
        • Ingeniería en Procesos Industriales
        • División de Idiomas
      `
    },
    instalaciones: {
      title: "Instalaciones",
      content: `
        • Edificio DTAI - Tecnología y Automatización
        • División Industrial - Laboratorios Especializados
        • Centro de Idiomas - Aprendizaje Internacional
        • Biblioteca Central - Recursos Académicos
        • Auditorio Principal - Eventos y Conferencias
        • Áreas Deportivas - Desarrollo Integral
      `
    },
    eventos: {
      title: "Eventos y Actividades",
      content: [
        {
          name: "Graduaciones y Ceremonias",
          location: "Auditorio Principal",
          coords: [20.6560881, -100.4060255],
          description: "Ceremonias de graduación y eventos institucionales"
        },
        {
          name: "Conferencias Tecnológicas",
          location: "Edificio DTAI",
          coords: [20.6543228, -100.4046271],
          description: "Conferencias y seminarios de tecnología"
        },
        {
          name: "Ferias de Proyectos",
          location: "División Industrial",
          coords: [20.6544725, -100.4041274],
          description: "Exposición de proyectos estudiantiles"
        },
        {
          name: "Eventos Culturales",
          location: "Centro de Idiomas",
          coords: [20.6549875, -100.4062969],
          description: "Actividades culturales y presentaciones"
        }
      ]
    }
  };

  // Add function to handle event location navigation
  const handleEventClick = (coords, locationName) => {
    onStartClick();
    // Add small delay to ensure map is loaded
    setTimeout(() => {
      window.showRouteToLocation(coords, locationName);
    }, 1000);
  };

  // Modify the content rendering for events section
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(135deg,rgb(8, 126, 245) 0%, #1e3799 100%)', // Changed from green to blue gradient
      opacity: isLoaded ? 1 : 0,
      transform: `translateY(${isLoaded ? 0 : '20px'})`,
      transition: 'all 0.8s ease-out',
      padding: '2rem 1rem',
      overflowY: 'auto'
    }}>
      <img 
        src={logoUTEQ}
        alt="UTEQ Logo" 
        style={{
          width: '150px',
          height: 'auto',
          marginBottom: '2rem',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          animation: 'float 3s ease-in-out infinite'
        }}
      />
      
      <h1 style={{ 
        color: 'white',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        marginBottom: '2rem'
      }}>
        Croquis UTEQ
      </h1>

      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        {Object.keys(sections).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeSection === section ? 'white' : 'rgba(255,255,255,0.1)',
              color: activeSection === section ? '#1e3799' : 'white', // Changed from green to dark blue
              border: '1px solid white',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {sections[section].title}
          </button>
        ))}
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        borderRadius: '15px',
        maxWidth: '800px',
        width: '100%',
        marginBottom: '2rem',
        color: 'white',
        whiteSpace: 'pre-line',
        lineHeight: '1.6'
      }}>
        <h2 style={{ marginBottom: '1rem', color: 'white' }}>
          {sections[activeSection].title}
        </h2>
        {activeSection === 'eventos' ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {sections.eventos.content.map((event, index) => (
              <div
                key={index}
                onClick={() => handleEventClick(event.coords, event.location)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <h3 style={{ marginBottom: '0.5rem' }}>{event.name}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>📍 {event.location}</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{event.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '1.1rem' }}>
            {sections[activeSection].content}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          onClick={onStartClick}
          style={{
            padding: '1rem 2.5rem',
            fontSize: '1.2rem',
            backgroundColor: 'white',
            color: '#1e3799',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
          }}
        >
          Explorar Mapa
        </button>

        <button 
          onClick={onAdminClick}
          style={{
            padding: '1rem 2.5rem',
            fontSize: '1.2rem',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
          }}
        >
          Administrar Información
        </button>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
}

export default WelcomeScreen;