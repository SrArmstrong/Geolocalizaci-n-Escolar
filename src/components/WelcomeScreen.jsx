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
      gradient: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)" // Azul medio a azul celeste
    },
    instalaciones: {
      title: "Instalaciones",
      icon: "🏢",
      content: [
        { name: "Edificio DTAI", desc: "Tecnología y Automatización", icon: "🔧" },
        { name: "División Industrial", desc: "Laboratorios Especializados", icon: "🧪" },
        { name: "Centro de Idiomas", desc: "Aprendizaje Internacional", icon: "🌐" },
        { name: "Biblioteca Central", desc: "Recursos Académicos", icon: "📚" },
        { name: "Auditorio Principal", desc: "Eventos y Conferencias", icon: "🎭" },
        { name: "Áreas Deportivas", desc: "Desarrollo Integral", icon: "🏃" }
      ],
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" // Azul violáceo suave
    },
    eventos: {
      title: "Eventos y Actividades",
      icon: "🎉",
      content: [
        {
          name: "Graduaciones y Ceremonias",
          location: "Auditorio Principal",
          coords: [20.6560881, -100.4060255],
          description: "Ceremonias de graduación y eventos institucionales",
          icon: "🎓",
          color: "#3b82f6"
        },
        {
          name: "Conferencias Tecnológicas",
          location: "Edificio DTAI",
          coords: [20.6543228, -100.4046271],
          description: "Conferencias y seminarios de tecnología",
          icon: "💡",
          color: "#38bdf8"
        },
        {
          name: "Ferias de Proyectos",
          location: "División Industrial",
          coords: [20.6544725, -100.4041274],
          description: "Exposición de proyectos estudiantiles",
          icon: "🚀",
          color: "#60a5fa"
        },
        {
          name: "Eventos Culturales",
          location: "Centro de Idiomas",
          coords: [20.6549875, -100.4062969],
          description: "Actividades culturales y presentaciones",
          icon: "🎨",
          color: "#06b6d4" // azul-verde turquesa suave
        }
      ],
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)" // Azul turquesa a azul clásico
    }
  };


  const handleEventClick = (coords, locationName) => {
    onStartClick();
    setTimeout(() => {
      window.showRouteToLocation && window.showRouteToLocation(coords, locationName);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(30, 58, 138, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
      `,
      opacity: isLoaded ? 1 : 0,
      transform: `translateY(${isLoaded ? 0 : '30px'})`,
      transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
      padding: '2rem 1rem',
      overflowY: 'auto'
    }}>
      
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        animation: 'fadeInDown 1s ease-out'
      }}>
        <img 
          src={logoUTEQ}
          alt="UTEQ Logo" 
          style={{
            width: '360px',
            height: 'auto',
            margin: '0 auto 2rem',
            filter: 'drop-shadow(0 8px 16px rgba(30, 58, 138, 0.3))',
            animation: 'float 3s ease-in-out infinite',
            borderRadius: '15px'
          }}
        />
        
        <h1 style={{ 
          color: '#1e3a8a',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: '800',
          margin: '0 0 0.5rem',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Croquis UTEQ
        </h1>
        
        <p style={{
          color: '#64748b',
          fontSize: '1.2rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Explora nuestra universidad de manera interactiva
        </p>

        <button 
          onClick={onStartClick}
          style={{
            marginTop: '1.5rem',
            padding: '1rem 2.5rem',
            fontSize: '1.8rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 10px 30px rgba(30, 58, 138, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.05)';
            e.target.style.boxShadow = '0 15px 40px rgba(30, 58, 138, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(30, 58, 138, 0.3)';
          }}
        >
          🗺️ Explorar Mapa
        </button>

      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '3rem',
        padding: '0.5rem',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto 3rem'
      }}>
        {Object.keys(sections).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: activeSection === section ? '#1e3a8a' : 'transparent',
              color: activeSection === section ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '0.95rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transform: activeSection === section ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: activeSection === section ? '0 8px 20px rgba(30, 58, 138, 0.3)' : 'none'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{sections[section].icon}</span>
            {sections[section].title}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        <div style={{
          background: sections[activeSection].gradient || 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          borderRadius: '25px',
          padding: '2rem',
          marginBottom: '3rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite'
          }} />
          
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '3rem' }}>{sections[activeSection].icon}</span>
            {sections[activeSection].title}
          </h2>
          
          {activeSection === 'main' && (
            <p style={{ fontSize: '1.3rem', lineHeight: '1.7', opacity: 0.95 }}>
              {sections[activeSection].content}
            </p>
          )}

          {activeSection === 'carreras' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem' 
            }}>
              {sections.carreras.content.map((carrera, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{carrera.icon}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{carrera.name}</span>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'instalaciones' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem' 
            }}>
              {sections.instalaciones.content.map((instalacion, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px) scale(1.02)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>{instalacion.icon}</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>{instalacion.name}</h3>
                  </div>
                  <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>{instalacion.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'eventos' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem' 
            }}>
              {sections.eventos.content.map((event, index) => (
                <div
                  key={index}
                  onClick={() => handleEventClick(event.coords, event.location)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.03)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '40px',
                    height: '40px',
                    backgroundColor: event.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    {event.icon}
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '0.8rem', paddingRight: '3rem' }}>
                    {event.name}
                  </h3>
                  <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📍</span> {event.location}
                  </p>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: '1.5' }}>
                    {event.description}
                  </p>
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    👆 Click para ubicar en el mapa
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>

          <button 
            onClick={onAdminClick}
            style={{
              padding: '1.2rem 3rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 30px rgba(14, 116, 110, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 40px rgba(14, 116, 110, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(14, 116, 110, 0.3)';
            }}
          >
            ⚙️ Administrar
          </button>

        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(-5px) rotate(-1deg); }
          }
          
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { 
              opacity: 0.1;
              transform: scale(1);
            }
            50% { 
              opacity: 0.2;
              transform: scale(1.1);
            }
          }
          
          * {
            box-sizing: border-box;
          }
        `}
      </style>
    </div>
  );
}

export default WelcomeScreen;