import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

function AdminDashboard({ onBack }) {
  const [activeSection, setActiveSection] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar usuarios
        const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosData = usuariosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsuarios(usuariosData);

        // Cargar eventos (ejemplo)
        const eventosSnapshot = await getDocs(collection(db, "eventos"));
        const eventosData = eventosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEventos(eventosData);

        // Cargar edificios (ejemplo)
        const edificiosSnapshot = await getDocs(collection(db, "edificios"));
        const edificiosData = edificiosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEdificios(edificiosData);

        // Cargar profesores (ejemplo)
        const profesoresSnapshot = await getDocs(collection(db, "profesores"));
        const profesoresData = profesoresSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProfesores(profesoresData);

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
      case 'usuarios':
        return <UsuariosSection usuarios={usuarios} loading={loading} />;
      case 'eventos':
        return <EventosSection eventos={eventos} loading={loading} />;
      case 'edificios':
        return <EdificiosSection edificios={edificios} loading={loading} />;
      case 'profesores':
        return <ProfesoresSection profesores={profesores} loading={loading} />;
      default:
        return <UsuariosSection usuarios={usuarios} loading={loading} />;
    }
  };

  return (
    <div style={{ 
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(8, 126, 245) 0%, #1e3799 100%)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <button 
          onClick={onBack} 
          style={{
            ...buttonStyle,
            backgroundColor: 'white',
            color: '#1e3799',
            border: '1px solid white'
          }}
        >
          ⬅ Volver a Inicio
        </button>
        
        <h2 style={{ 
          color: 'white',
          fontSize: '2rem',
          fontWeight: '700',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Panel de Administración UTEQ
        </h2>
        
        <div style={{ width: '120px' }}></div>
      </div>

      {/* Menú de navegación */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <NavButton 
          active={activeSection === 'usuarios'} 
          onClick={() => setActiveSection('usuarios')}
        >
          Usuarios
        </NavButton>
        <NavButton 
          active={activeSection === 'eventos'} 
          onClick={() => setActiveSection('eventos')}
        >
          Eventos
        </NavButton>
        <NavButton 
          active={activeSection === 'edificios'} 
          onClick={() => setActiveSection('edificios')}
        >
          Edificios
        </NavButton>
        <NavButton 
          active={activeSection === 'profesores'} 
          onClick={() => setActiveSection('profesores')}
        >
          Profesores
        </NavButton>
      </div>

      {/* Contenido de la sección activa */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {renderSection()}
      </div>
    </div>
  );
}

// Componentes para cada sección
const UsuariosSection = ({ usuarios, loading }) => (
  <SectionContainer loading={loading} title="Usuarios Registrados">
    <div style={gridStyle}>
      {usuarios.map((usuario) => (
        <Card key={usuario.id}>
          <p><strong style={labelStyle}>Correo:</strong> <span style={textStyle}>{usuario.id}</span></p>
          <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{usuario.nombre?.trim() || 'Sin nombre'}</span></p>
          <p><strong style={labelStyle}>Edad:</strong> <span style={textStyle}>{usuario.edad ?? 'No especificada'}</span></p>
          <div style={buttonGroupStyle}>
            <button style={editButtonStyle}>Editar</button>
            <button style={deleteButtonStyle}>Eliminar</button>
          </div>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

const EventosSection = ({ eventos, loading }) => (
  <SectionContainer loading={loading} title="Eventos">
    <div style={gridStyle}>
      {eventos.map((evento) => (
        <Card key={evento.id}>
          <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{evento.nombre || 'Sin nombre'}</span></p>
          <p><strong style={labelStyle}>Fecha:</strong> <span style={textStyle}>{evento.fecha || 'No especificada'}</span></p>
          <p><strong style={labelStyle}>Lugar:</strong> <span style={textStyle}>{evento.lugar || 'No especificado'}</span></p>
          <div style={buttonGroupStyle}>
            <button style={editButtonStyle}>Editar</button>
            <button style={deleteButtonStyle}>Eliminar</button>
          </div>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

const EdificiosSection = ({ edificios, loading }) => (
  <SectionContainer loading={loading} title="Edificios">
    <div style={gridStyle}>
      {edificios.map((edificio) => (
        <Card key={edificio.id}>
          <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{edificio.nombre || 'Sin nombre'}</span></p>
          <p><strong style={labelStyle}>Ubicación:</strong> <span style={textStyle}>{edificio.ubicacion || 'No especificada'}</span></p>
          <p><strong style={labelStyle}>Capacidad:</strong> <span style={textStyle}>{edificio.capacidad || 'No especificada'}</span></p>
          <div style={buttonGroupStyle}>
            <button style={editButtonStyle}>Editar</button>
            <button style={deleteButtonStyle}>Eliminar</button>
          </div>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

const ProfesoresSection = ({ profesores, loading }) => (
  <SectionContainer loading={loading} title="Profesores">
    <div style={gridStyle}>
      {profesores.map((profesor) => (
        <Card key={profesor.id}>
          <p><strong style={labelStyle}>Nombre:</strong> <span style={textStyle}>{profesor.nombre || 'Sin nombre'}</span></p>
          <p><strong style={labelStyle}>Especialidad:</strong> <span style={textStyle}>{profesor.especialidad || 'No especificada'}</span></p>
          <p><strong style={labelStyle}>Departamento:</strong> <span style={textStyle}>{profesor.departamento || 'No especificado'}</span></p>
          <div style={buttonGroupStyle}>
            <button style={editButtonStyle}>Editar</button>
            <button style={deleteButtonStyle}>Eliminar</button>
          </div>
        </Card>
      ))}
    </div>
  </SectionContainer>
);

// Componente contenedor genérico para secciones
const SectionContainer = ({ children, loading, title }) => (
  <>
    <h3 style={{ 
      marginBottom: '1.5rem',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: '600',
      textAlign: 'center',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
    }}>
      {title}
    </h3>
    
    {loading ? (
      <div style={loadingStyle}>
        <p style={loadingTextStyle}>Cargando datos...</p>
      </div>
    ) : (
      <>
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <button style={addButtonStyle}>+ Añadir Nuevo</button>
        </div>
        {children}
      </>
    )}
  </>
);

// Componente de botón de navegación
const NavButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...buttonStyle,
      backgroundColor: active ? 'white' : 'rgba(255,255,255,0.1)',
      color: active ? '#1e3799' : 'white',
      border: '1px solid white',
      transform: active ? 'translateY(-2px)' : 'none',
      boxShadow: active ? '0 6px 8px rgba(0,0,0,0.2)' : 'none'
    }}
  >
    {children}
  </button>
);

// Componente de tarjeta
const Card = ({ children }) => (
  <div style={{
    ...cardStyle,
    backgroundColor: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(5px)'
  }}>
    {children}
  </div>
);

// Estilos reutilizables
const buttonStyle = {
  backgroundColor: '#4a6bff',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  }
};

const cardStyle = {
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
  }
};

const gridStyle = {
  display: 'grid',
  gap: '1.5rem',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  padding: '1rem'
};

const labelStyle = {
  color: '#1e3799',
  fontWeight: '600'
};

const textStyle = {
  color: '#333'
};

const buttonGroupStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem',
  gap: '0.5rem'
};

const editButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#f39c12',
  padding: '0.5rem 1rem',
  ':hover': {
    backgroundColor: '#e67e22'
  }
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#e74c3c',
  padding: '0.5rem 1rem',
  ':hover': {
    backgroundColor: '#c0392b'
  }
};

const addButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#2ecc71',
  ':hover': {
    backgroundColor: '#27ae60'
  }
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px'
};

const loadingTextStyle = {
  color: 'white',
  fontSize: '1.2rem'
};

export default AdminDashboard;