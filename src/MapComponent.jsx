import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent() {
  const mapRef = useRef(null); // Referencia para el mapa

  useEffect(() => {
  if (mapRef.current) {
    mapRef.current.remove();
    mapRef.current = null;
  }

  const map = L.map("map");
  mapRef.current = map;

  const center = [20.656338, -100.405114];
  const zoom = 17;

  map.setView(center, zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  L.marker(center)
    .addTo(map)
    .bindPopup("Campus UTQ")
    .openPopup();

  // 👇 Nuevo: Observador de cambios en el tamaño del contenedor
  const resizeObserver = new ResizeObserver(() => {
    map.invalidateSize();
  });
  resizeObserver.observe(document.getElementById("map"));

  // 👇 Redundante pero útil para la carga inicial
  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  return () => {
    resizeObserver.disconnect(); // 👈 Limpiar el observador
    map.remove();
    mapRef.current = null;
  };
}, []);

  return (
  <div
    id="map"
    style={{
      height: "calc(100vh - 80px)", // 100vh menos lo que mide el header
      width: "100%",
    }}
  />
);

}

export default MapComponent;
