import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

function AdminDashboard({ onBack }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios desde Firestore
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          usuariosData.push({
            id: doc.id,
            nombre: data?.nombre?.trim() || 'Sin nombre',
            edad: data?.edad ?? 'No especificada'
          });
        });

        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div style={{ 
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
    }}>
      <button 
        onClick={onBack} 
        style={{
          marginBottom: '2rem',
          backgroundColor: '#4a6bff',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          boxShadow: '0 4px 6px rgba(74, 107, 255, 0.2)',
          transition: 'all 0.3s ease',
          ':hover': {
            backgroundColor: '#3a5bef',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 8px rgba(74, 107, 255, 0.3)'
          }
        }}
      >
        ⬅ Volver a Inicio
      </button>

      <h2 style={{ 
        marginBottom: '2rem',
        color: '#2d3748',
        fontSize: '2rem',
        fontWeight: '700',
        textAlign: 'center'
      }}>
        Usuarios Registrados
      </h2>
      
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}>
          <p style={{
            color: '#4a5568',
            fontSize: '1.2rem'
          }}>Cargando usuarios...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          padding: '1rem'
        }}>
          {usuarios.map((usuario) => (
            <div 
              key={usuario.id}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                }
              }}
            >
              <p style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                <strong style={{ color: '#4a6bff' }}>Correo:</strong> <span style={{ color: '#4a5568' }}>{usuario.id}</span>
              </p>
              <p style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                <strong style={{ color: '#4a6bff' }}>Nombre:</strong> <span style={{ color: '#4a5568' }}>{usuario.nombre}</span>
              </p>
              <p style={{ fontSize: '1.1rem' }}>
                <strong style={{ color: '#4a6bff' }}>Edad:</strong> <span style={{ color: '#4a5568' }}>{usuario.edad}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;