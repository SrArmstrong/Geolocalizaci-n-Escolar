import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import { db } from './firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import MapComponent from './components/map/MapComponent';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function VisitTracker() {
  const location = useLocation();

  useEffect(() => {
    // Contar visita cuando la ruta es /map
    if (location.pathname === '/map') {
      const countMapVisit = async () => {
        try {
          const statsRef = doc(db, "stats", "mapVisits");
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
          console.log('Visita al mapa registrada');
        } catch (error) {
          console.error("Error al actualizar el contador de visitas:", error);
        }
      };

      countMapVisit();
    }
  }, [location.pathname]);

  return null; // Este componente no renderiza nada
}

function App() {
  return (
    <Router>
      {/* Componente para trackear visitas */}
      <VisitTracker />
      
      <div style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/map" element={<MapComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;