import { useNavigate } from "react-router-dom";
import MapComponent from "../MapComponent";

function MapPanel() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <MapComponent onBack={goToHome} />
  );
}

export default MapPanel;