import { useState } from "react";
import MapComponent from "./MapComponent";
import WelcomeScreen from "./components/WelcomeScreen";
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [screen, setScreen] = useState('welcome'); // 'welcome', 'map', 'admin'
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cambio de pantalla con transición
  const changeScreenWithTransition = (target) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen(target);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100vw',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      
      {screen === 'welcome' && (
        <WelcomeScreen
          onStartClick={() => changeScreenWithTransition('map')}
          onAdminClick={() => changeScreenWithTransition('admin')}
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            minHeight: '100vh'
          }}
        />
      )}

      {screen === 'map' && (
        <div style={{ 
          height: "100vh", 
          width: "100vw", 
          margin: 0, 
          padding: 0, 
          display: "flex", 
          flexDirection: "column",
          opacity: isTransitioning ? 0 : 1,
          transform: `translateY(${isTransitioning ? '20px' : '0'})`,
          transition: 'all 0.5s ease-out'
        }}>
          <h1 style={{ 
            textAlign: "center", 
            margin: "0.5rem 0",
            color: "#1e3799",
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            fontSize: '1.5rem',
            fontWeight: '500'
          }}>
            Mapa de la UTEQ
          </h1>
          <div style={{ 
            flex: 1,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            margin: '0 1rem 1rem 1rem',
            overflow: 'hidden'
          }}>
            <MapComponent onBack={() => changeScreenWithTransition('welcome')} />
          </div>
        </div>
      )}

      {screen === 'admin' && (
        <AdminDashboard onBack={() => changeScreenWithTransition('welcome')} />
      )}
    </div>
  );
}

export default App;
