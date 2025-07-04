import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

import Usuarios from './crud/usuarios';
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
      //case 'usuarios': return <Usuarios usuarios={usuarios} loading={loading} />;
      case 'usuarios': return <Usuarios />;
      case 'eventos': return <Eventos eventos={eventos} loading={loading} />;
      case 'edificios': return <Edificios edificios={edificios} loading={loading} />;
      case 'profesores': return <Profesores profesores={profesores} loading={loading} />;
      default: return <Usuarios usuarios={usuarios} loading={loading} />;
    }
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'linear-gradient(to bottom right, #087ef5, #1e3799)' }}>
      {/* Botones y Navegación */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0 1rem',
        position: 'relative',
        flexWrap: 'wrap' // Permite que los elementos se ajusten en pantallas pequeñas
      }}>
        {/* Botón de volver - se ajusta en móviles */}
        <button 
          onClick={onBack}
          style={{ 
            fontSize: 'clamp(12px, 3vw, 16px)', // Tamaño responsive
            padding: '0.5rem 1rem',
            whiteSpace: 'nowrap',
            zIndex: 1 // Asegura que esté por encima
          }}
        >
          ⬅ Volver
        </button>

        {/* Título centrado */}
        <h2 style={{ 
          color: 'white', 
          margin: '0.5rem 0', // Espacio vertical en móviles
          width: '100%', // Ocupa todo el ancho en móviles
          textAlign: 'center',
          fontSize: 'clamp(18px, 5vw, 24px)', // Tamaño responsive
          order: -1 // Lo coloca arriba en móviles (opcional)
        }}>
          Panel de Administración
        </h2>

        {/* Espacio para balancear (opcional) */}
        <div style={{ 
          width: 'calc(3rem + 5vw)', // Ancho responsive
          visibility: 'hidden' 
        }}>
          {/* Elemento invisible para balancear */}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <NavButton active={activeSection === 'usuarios'} onClick={() => setActiveSection('usuarios')}>Usuarios</NavButton>
        <NavButton active={activeSection === 'eventos'} onClick={() => setActiveSection('eventos')}>Eventos</NavButton>
        <NavButton active={activeSection === 'edificios'} onClick={() => setActiveSection('edificios')}>Edificios</NavButton>
        <NavButton active={activeSection === 'profesores'} onClick={() => setActiveSection('profesores')}>Profesores</NavButton>
      </div>

      <div>
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminDashboard;
