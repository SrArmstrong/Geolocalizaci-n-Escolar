import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent() {
  const mapRef = useRef(null); // Referencia para el mapa

  useEffect(() => {
    if (mapRef.current) return; // Evita inicializar dos veces

    const map = L.map("map").setView([19.4326, -99.1332], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([19.4326, -99.1332])
      .addTo(map)
      .bindPopup("Centro de CDMX")
      .openPopup();

    return () => {
      map.remove(); // Limpieza si el componente se desmonta
      mapRef.current = null;
    };
  }, []);

  return <div id="map" style={{ height: "90vh", width: "100%" }} />;
}

export default MapComponent;
