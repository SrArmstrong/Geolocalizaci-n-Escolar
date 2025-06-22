import { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import WelcomeScreen from "./components/WelcomeScreen";

function App() {
  const [showMap, setShowMap] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowMap(true);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100vw',
      overflow: 'auto',  // Changed from 'hidden' to 'auto'
      WebkitOverflowScrolling: 'touch'  // Added for smooth scrolling on iOS
    }}>
      {!showMap && (
        <WelcomeScreen 
          onStartClick={handleStartClick} 
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            minHeight: '100vh'  // Added to ensure full height content is scrollable
          }}
        />
      )}
      
      {showMap && (
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
            color: "#1e3799", // Changed from green to dark blue
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
            <MapComponent />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
