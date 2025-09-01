import React, { useState } from 'react';
import locations from '../../locations';

const BuildingList = ({ activeList, setActiveList }) => {
  const visible = activeList === "building"; 

  const toggleList = () => {
    setActiveList(visible ? null : "building");
  };
  const [searchTerm, setSearchTerm] = useState('');

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD") // Separa caracteres y acentos
      .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos (acentos)
      .replace(/\s+/g, ""); // Elimina todos los espacios
  };

  const filtered = locations.filter(loc => {
    const normalizedSearch = normalizeText(searchTerm);
    
    return (
      normalizeText(loc.title).includes(normalizedSearch) ||
      normalizeText(loc.description).includes(normalizedSearch) ||
      normalizeText(loc.codigo).includes(normalizedSearch)
    );
  });

  const goToBuilding = (location) => {
    if (window && typeof window.showRouteToLocation === 'function') {
      window.showRouteToLocation(
        [location.latitude, location.longitude],
        location.title,
        location.codigo
      );
      setActiveList(null);
    } else {
      alert("La función de navegación no está disponible");
    }
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar */}
        <button
          onClick={toggleList}
          style={{
            position: 'fixed',
            right: '20px',
            bottom: visible ? '65vh' : '20px', // 👈 Cuando visible, se sube
            zIndex: 9999,
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: visible ? '12px' : '24px',
            width: visible ? '60px' : 'auto',
            height: '48px',
            minWidth: '48px',
            padding: visible ? '0' : '12px 16px',
            fontSize: visible ? '20px' : '14px',
            fontWeight: visible ? 'normal' : '500',
            boxShadow: '0 6px 20px rgba(30, 58, 138, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}
          title={visible ? "Ocultar lista" : "Mostrar lista"}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1e40af';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 8px 25px rgba(30, 58, 138, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#1e3a8a';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 6px 20px rgba(30, 58, 138, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          {visible ? '✕' : 'Edificios'}
        </button>


      {/* Panel de lista de edificios */}
      {visible && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '60vh',
          overflowY: 'auto',
          zIndex: 9998,
          backgroundColor: '#f8fafc',
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
            backgroundColor: '#e2e8f0',
            borderRadius: '2px',
            margin: '0 auto 1em auto',
          }} />
          
          <h3 style={{
            margin: '0 0 1em 0',
            fontSize: '1.2em',
            fontWeight: '600',
            color: '#1e3a8a',
            textAlign: 'center',
          }}>
            Lista de Edificios
          </h3>
          
          <input
            type="text"
            placeholder="🔍 Buscar edificio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              color: '#1e3a8a',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 4px 16px rgba(30, 58, 138, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)';
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
            {filtered.length > 0 ? (
              filtered.map((loc, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => goToBuilding(loc)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      backgroundColor: 'white',
                      color: '#1e3a8a',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between', // 👈 Esto alinea título y código
                      gap: '12px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#dbeafe';
                      e.target.style.boxShadow = '0 4px 16px rgba(30, 58, 138, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)';
                      e.target.style.transform = 'translateY(-1px)';
                      const icon = e.target.querySelector('.building-icon');
                      const text = e.target.querySelector('.building-text');
                      if (icon) icon.style.transform = 'scale(1.3)';
                      if (text) text.style.color = '#1e3a8a';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)';
                      e.target.style.transform = 'translateY(0)';
                      const icon = e.target.querySelector('.building-icon');
                      const text = e.target.querySelector('.building-text');
                      if (icon) icon.style.transform = 'scale(1)';
                      if (text) text.style.color = '#1e3a8a';
                    }}
                  >
                    {/* IZQUIERDA: ícono + título */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span 
                        className="building-icon"
                        style={{ 
                          fontSize: '18px',
                          transition: 'transform 0.2s ease',
                          display: 'inline-block',
                        }}
                      >
                        📍
                      </span>
                      <span
                        className="building-text"
                        style={{
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {loc.title}
                      </span>
                    </div>

                    {/* DERECHA: código */}
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                      {loc.codigo}
                    </span>
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
                No se encontraron edificios
              </li>
            )}
          </ul>

        </div>
      )}
    </>
  );
};

export default BuildingList;