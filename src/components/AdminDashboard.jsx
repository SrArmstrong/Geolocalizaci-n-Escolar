import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Eventos from './crud/Eventos';
import './AdminDashboard.css';

function AdminDashboard({ onBack }) {
  const navigate = useNavigate();
  const [loading] = useState(false);

  // 🔐 Verificar token al montar
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // no hay token → redirigir
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // en segundos
      if (decoded.exp < now) {
        localStorage.removeItem("authToken"); // limpiar token expirado
        navigate("/"); // token expirado → redirigir
      }
    } catch (err) {
      console.error("Error al decodificar token:", err);
      navigate("/"); // token inválido → redirigir
    }
  }, [navigate]);

  return (
    <div className="admin-container">
      {/* Header Principal */}
      <div className="admin-header">
        <div className="admin-header-top">
          <button onClick={onBack} className="admin-back-button">
            <span className="admin-back-icon">←</span>
            Volver al Sistema
          </button>
          
          <div className="admin-institution-badge">
            <span className="admin-institution-icon">🎓</span>
          </div>
        </div>
        
        <div className="admin-title-section">
          <h1 className="admin-main-title">Panel de Eventos</h1>          
        </div>
      </div>

      {/* Sección de Contenido - Solo Eventos */}
      <div className="admin-content-container">
        <div className="admin-content-header">
          <div className="admin-content-title-section">
            <span className="admin-content-icon">📅</span>
            <div>
              <h2 className="admin-content-title">Eventos</h2>
              <p className="admin-content-description">Administración de eventos institucionales</p>
            </div>
          </div>
          
          {loading && (
            <div className="admin-loading-indicator">
              <div className="admin-loading-spinner"></div>
              <span className="admin-loading-text">Cargando datos...</span>
            </div>
          )}
        </div>
        
        <div className="admin-content-body">
          <Eventos loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;