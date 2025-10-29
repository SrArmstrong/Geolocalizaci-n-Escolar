import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/map/MapComponent";
import WelcomeScreen from "../components/WelcomeScreen";

function Home() {
  const [screen, setScreen] = useState('welcome'); // 'welcome' o 'map'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const changeScreenWithTransition = (target) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen(target);
      setIsTransitioning(false);
    }, 500);
  };

  // Función para ir al panel de administración
  const goToAdmin = () => {
    navigate('/admin');
  };
  
  // Función para ir al panel de administración
  const goToMap = () => {
    navigate('/map');
  };

  return (
    <>
      {screen === 'welcome' && (
        <WelcomeScreen
          onStartClick={goToMap}
          onAdminClick={goToAdmin}
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
    </>
  );
}

export default Home;