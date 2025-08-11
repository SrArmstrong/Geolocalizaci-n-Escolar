import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapComponent from './MapComponent';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function App() {
  return (
    <Router>
      <div style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/admin" element={<AdminPanel />} /> */}
          <Route path="/map" element={<MapComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;