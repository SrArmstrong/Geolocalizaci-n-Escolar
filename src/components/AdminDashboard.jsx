import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

import Usuarios from './crud/Usuarios';
import Eventos from './crud/Eventos';
import Edificios from './crud/Edificios';
import Profesores from './crud/Profesores';
import NavButton from './commons/NavButton';

function AdminDashboard({ onBack }) {
  const [activeSection, setActiveSection] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usuariosSnap, eventosSnap, edificiosSnap, profesoresSnap] = await Promise.all([
          getDocs(collection(db, "usuarios")),
          getDocs(collection(db, "eventos")),
          getDocs(collection(db, "edificios")),
          getDocs(collection(db, "profesores"))
        ]);
        setUsuarios(usuariosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setEventos(eventosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setEdificios(edificiosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setProfesores(profesoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'usuarios': return <Usuarios />;
      case 'eventos': return <Eventos eventos={eventos} loading={loading} />;
      case 'edificios': return <Edificios edificios={edificios} loading={loading} />;
      case 'profesores': return <Profesores profesores={profesores} loading={loading} />;
      default: return <Usuarios usuarios={usuarios} loading={loading} />;
    }
  };

  // Configuración de secciones con metadatos
  const sections = [
    { 
      key: 'usuarios', 
      title: 'Usuarios', 
      icon: '👥', 
      description: 'Gestión de cuentas y perfiles de usuario',
      color: '#1e40af'
    },
    { 
      key: 'eventos', 
      title: 'Eventos', 
      icon: '📅', 
      description: 'Administración de eventos institucionales',
      color: '#7c3aed'
    },
    { 
      key: 'edificios', 
      title: 'Edificios', 
      icon: '🏢', 
      description: 'Gestión de infraestructura y espacios',
      color: '#059669'
    },
    { 
      key: 'profesores', 
      title: 'Profesores', 
      icon: '👨‍🏫', 
      description: 'Directorio y gestión docente',
      color: '#dc2626'
    }
  ];

  const currentSection = sections.find(s => s.key === activeSection);

  return (
    <div style={containerStyle}>
      {/* Header Principal */}
      <div style={headerStyle}>
        <div style={headerTopStyle}>
          <button onClick={onBack} style={backButtonStyle}>
            <span style={backIconStyle}>←</span>
            Volver al Sistema
          </button>
          
          <div style={institutionBadgeStyle}>
            <span style={institutionIconStyle}>🎓</span>
            
          </div>
        </div>
        
        <div style={titleSectionStyle}>
          <h1 style={mainTitleStyle}>Panel de Administración</h1>
          <p style={subtitleStyle}>
            Sistema integral de gestión de edificios, eventos y usuarios del campus
          </p>
        </div>
      </div>

      {/* Navegación con Cards */}
      <div style={navigationContainerStyle}>
        <div style={navigationHeaderStyle}>
          <h2 style={navigationTitleStyle}>Módulos del Sistema</h2>
          <div style={currentSectionIndicatorStyle}>
            <span style={currentSectionIconStyle}>{currentSection?.icon}</span>
            <span style={currentSectionTextStyle}>{currentSection?.title}</span>
          </div>
        </div>
        
        <div style={navigationGridStyle}>
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              style={{
                ...navCardStyle,
                ...(activeSection === section.key ? activeNavCardStyle : {}),
                borderLeftColor: section.color
              }}
            >
              <div style={navCardHeaderStyle}>
                <span style={navCardIconStyle}>{section.icon}</span>
                <h3 style={navCardTitleStyle}>{section.title}</h3>
              </div>
              <p style={navCardDescriptionStyle}>{section.description}</p>
              <div style={navCardFooterStyle}>
                {activeSection === section.key && (
                  <span style={activeIndicatorStyle}>● Activo</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sección de Contenido */}
      <div style={contentContainerStyle}>
        <div style={contentHeaderStyle}>
          <div style={contentTitleSectionStyle}>
            <span style={contentIconStyle}>{currentSection?.icon}</span>
            <div>
              <h2 style={contentTitleStyle}>{currentSection?.title}</h2>
              <p style={contentDescriptionStyle}>{currentSection?.description}</p>
            </div>
          </div>
          
          {loading && (
            <div style={loadingIndicatorStyle}>
              <div style={loadingSpinnerStyle}></div>
              <span style={loadingTextStyle}>Cargando datos...</span>
            </div>
          )}
        </div>
        
        <div style={contentBodyStyle}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

// Estilos mejorados para institución académica
const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const headerStyle = {
  backgroundColor: '#1e3a8a',
  background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
  color: 'white',
  padding: '2rem 2rem 3rem',
  boxShadow: '0 10px 25px rgba(30, 58, 138, 0.2)',
  position: 'relative',
  overflow: 'hidden'
};

const headerTopStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  gap: '1rem'
};

const backButtonStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease'
};

const backIconStyle = {
  fontSize: '1.25rem'
};

const institutionBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'rgba(255, 255, 255, 0.1)',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)'
};

const institutionIconStyle = {
  fontSize: '1.5rem'
};

const titleSectionStyle = {
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto'
};

const mainTitleStyle = {
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  fontWeight: '700',
  margin: '0 0 1rem 0',
  fontFamily: 'Georgia, serif',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
};

const subtitleStyle = {
  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
  fontWeight: '400',
  margin: 0,
  opacity: 0.9,
  lineHeight: 1.5
};

const navigationContainerStyle = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto'
};

const navigationHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  gap: '1rem'
};

const navigationTitleStyle = {
  color: '#1e3a8a',
  fontSize: '1.5rem',
  fontWeight: '600',
  margin: 0,
  fontFamily: 'Georgia, serif'
};

const currentSectionIndicatorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: '#dbeafe',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  border: '1px solid #bfdbfe'
};

const currentSectionIconStyle = {
  fontSize: '1.25rem'
};

const currentSectionTextStyle = {
  color: '#1e40af',
  fontSize: '0.875rem',
  fontWeight: '600'
};

const navigationGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem'
};

const navCardStyle = {
  background: 'white',
  border: '1px solid #e2e8f0',
  borderLeft: '4px solid #e2e8f0',
  borderRadius: '12px',
  padding: '1.5rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'left',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden'
};

const activeNavCardStyle = {
  background: '#f8fafc',
  borderColor: '#1e40af',
  boxShadow: '0 8px 25px rgba(30, 58, 138, 0.15)',
  transform: 'translateY(-2px)'
};

const navCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '0.75rem'
};

const navCardIconStyle = {
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  background: '#f1f5f9',
  borderRadius: '8px'
};

const navCardTitleStyle = {
  color: '#1e3a8a',
  fontSize: '1.25rem',
  fontWeight: '600',
  margin: 0,
  fontFamily: 'Georgia, serif'
};

const navCardDescriptionStyle = {
  color: '#64748b',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  margin: '0 0 1rem 0'
};

const navCardFooterStyle = {
  minHeight: '1.5rem',
  display: 'flex',
  alignItems: 'center'
};

const activeIndicatorStyle = {
  color: '#059669',
  fontSize: '0.75rem',
  fontWeight: '600'
};

const contentContainerStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 2rem 2rem'
};

const contentHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  gap: '1rem'
};

const contentTitleSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const contentIconStyle = {
  fontSize: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '4rem',
  height: '4rem',
  background: '#dbeafe',
  borderRadius: '12px',
  border: '2px solid #bfdbfe'
};

const contentTitleStyle = {
  color: '#1e3a8a',
  fontSize: '2rem',
  fontWeight: '700',
  margin: '0 0 0.5rem 0',
  fontFamily: 'Georgia, serif'
};

const contentDescriptionStyle = {
  color: '#64748b',
  fontSize: '1rem',
  margin: 0,
  lineHeight: 1.5
};

const loadingIndicatorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  background: '#f8fafc',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0'
};

const loadingSpinnerStyle = {
  width: '1.5rem',
  height: '1.5rem',
  border: '2px solid #e2e8f0',
  borderTop: '2px solid #1e40af',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const loadingTextStyle = {
  color: '#64748b',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const contentBodyStyle = {
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e2e8f0',
  overflow: 'hidden'
};

// Agregar keyframes para la animación del spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;