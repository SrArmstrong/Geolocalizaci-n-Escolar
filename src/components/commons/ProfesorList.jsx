import React, { useState, useEffect } from "react";
import { obtenerProfesores } from "../../getProfesores";

const ProfesorList = ({ goToProfesor, activeList, setActiveList }) => {
  const visible = activeList === "profesor"; 

  const toggleList = () => {
    setActiveList(visible ? null : "profesor");
  };

  const [busqueda, setBusqueda] = useState("");
  const [todosLosProfesores, setTodosLosProfesores] = useState([]);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const cargarProfesores = async () => {
      const todos = await obtenerProfesores();
      setTodosLosProfesores(todos);
      setResultados(todos); // Mostrar todos por defecto
    };

    cargarProfesores();
  }, []);

  useEffect(() => {
    const filtro = todosLosProfesores.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setResultados(filtro);
  }, [busqueda, todosLosProfesores]);

  const handleProfesorClick = (prof) => {
    goToProfesor(prof);
    setActiveList(null);
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar */}
      <button
        onClick={toggleList}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: visible ? '65vh' : '80px', // 👈 Se sube cuando la lista está abierta
          zIndex: 9999,
          backgroundColor: '#059669',
          color: 'white',
          border: 'none',
          borderRadius: visible ? '12px' : '24px',
          width: visible ? '60px' : 'auto',
          height: '48px',
          minWidth: '48px',
          padding: visible ? '0' : '12px 16px',
          fontSize: visible ? '20px' : '14px',
          fontWeight: visible ? 'normal' : '500',
          boxShadow: '0 6px 20px rgba(5, 150, 105, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap',
        }}
        title={visible ? "Ocultar lista" : "Mostrar profesores"}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#047857';
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#059669';
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
      >
        {visible ? '✕' : 'Profesores'}
      </button>


      {/* Panel de lista de profesores */}
      {visible && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '60vh',
          overflowY: 'auto',
          zIndex: 9998,
          backgroundColor: '#f0fdf4',
          padding: '1.5em',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s ease-out',
        }}>
          <style>
            {`
              @keyframes slideUp {
                from {
                  transform: translateY(100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            `}
          </style>
          
          <div style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#bbf7d0',
            borderRadius: '2px',
            margin: '0 auto 1em auto',
          }} />
          
          <h3 style={{
            margin: '0 0 1em 0',
            fontSize: '1.2em',
            fontWeight: '600',
            color: '#059669',
            textAlign: 'center',
          }}>
            Lista de Profesores
          </h3>
          
          <input
            type="text"
            placeholder="🔍 Buscar profesor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              backgroundColor: 'white',
              color: '#059669',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 4px 16px rgba(5, 150, 105, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)';
            }}
          />
          
          <ul style={{ 
            listStyleType: 'none', 
            padding: 0, 
            margin: 0,
            maxHeight: 'calc(60vh - 140px)',
            overflowY: 'auto',
          }}>
            {resultados.length > 0 ? (
              resultados.map((prof, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => handleProfesorClick(prof)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      backgroundColor: 'white',
                      color: '#059669',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#dcfce7';
                      e.target.style.boxShadow = '0 4px 16px rgba(5, 150, 105, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)';
                      e.target.style.transform = 'translateY(-1px)';
                      const icon = e.target.querySelector('.profesor-icon');
                      const content = e.target.querySelector('.profesor-content');
                      if (icon) icon.style.transform = 'scale(1.3)';
                      if (content) content.style.color = '#059669';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)';
                      e.target.style.transform = 'translateY(0)';
                      const icon = e.target.querySelector('.profesor-icon');
                      const content = e.target.querySelector('.profesor-content');
                      if (icon) icon.style.transform = 'scale(1)';
                      if (content) content.style.color = '#059669';
                    }}
                  >
                    <span 
                      className="profesor-icon"
                      style={{ 
                        fontSize: '18px',
                        transition: 'transform 0.2s ease',
                        display: 'inline-block',
                      }}
                    >
                      👨‍🏫
                    </span>
                    <div
                      className="profesor-content"
                      style={{
                        transition: 'color 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>
                        {prof.nombre}
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        opacity: '0.7',
                        fontWeight: '400'
                      }}>
                        {prof.cubiculo}
                      </span>
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li style={{
                textAlign: 'center',
                padding: '2em',
                color: '#64748b',
                fontSize: '16px',
              }}>
                No se encontraron profesores
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}

export default ProfesorList;