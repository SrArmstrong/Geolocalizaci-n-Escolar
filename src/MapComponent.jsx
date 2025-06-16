import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

function MapComponent() {
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const currentLocationRef = useRef(null); // Agregar ref para ubicación actual

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map("map");
    mapRef.current = map;

    // Función para obtener y mostrar la ubicación actual
    const showCurrentPosition = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const userLocation = [latitude, longitude];
      setCurrentLocation(userLocation);
      currentLocationRef.current = userLocation; // Guardar en ref también
      
      // Centrar mapa en ubicación actual con zoom adecuado
      const zoomLevel = Math.max(17, Math.min(20, Math.round(14 - Math.log(accuracy)/Math.LN2)));
      map.setView(userLocation, zoomLevel);
      
      // Crear círculo de precisión
      L.circle(userLocation, {
        radius: accuracy,
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.2
      }).addTo(map);
      
      // Agregar marcador con información detallada y color diferente
      L.marker(userLocation, {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .addTo(map)
        .bindPopup(`
          <b>Tu ubicación exacta</b><br>
          Latitud: ${latitude.toFixed(6)}<br>
          Longitud: ${longitude.toFixed(6)}<br>
          Precisión: ${Math.round(accuracy)} metros
        `)
        .openPopup();
    };

    // Función para mostrar ruta en el mapa (corregida)
    const showRoute = (destination, destinationName) => {
      // Usar ref en lugar del estado para obtener la ubicación actual
      const userLocation = currentLocationRef.current;
      
      if (!userLocation) {
        // Intentar obtener la ubicación nuevamente si no está disponible
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const newUserLocation = [latitude, longitude];
              currentLocationRef.current = newUserLocation;
              setCurrentLocation(newUserLocation);
              
              // Ahora crear la ruta con la nueva ubicación
              createRoute(newUserLocation, destination, destinationName);
            },
            () => {
              alert('No se pudo obtener tu ubicación actual. Por favor, permite el acceso a la ubicación.');
            }
          );
        } else {
          alert('Tu navegador no soporta geolocalización.');
        }
        return;
      }

      createRoute(userLocation, destination, destinationName);
    };

    // Función separada para crear la ruta
    const createRoute = (userLocation, destination, destinationName) => {
      // Limpiar ruta anterior si existe
      if (routingControl) {
        map.removeControl(routingControl);
      }

      // Crear nueva ruta
      const newRoutingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destination[0], destination[1])
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: function() { return null; }, // No crear marcadores adicionales
        lineOptions: {
          styles: [{
            color: '#000000',
            weight: 6,
            opacity: 0.8
          }]
        },
        show: true,
        collapsible: true,
        language: 'es'
      }).on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        const distance = (summary.totalDistance / 1000).toFixed(2);
        const time = Math.round(summary.totalTime / 60);
        
        // Mostrar información de la ruta
        L.popup()
          .setLatLng(destination)
          .setContent(`
            <div style="text-align: center; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 10px 0; color: #2c3e50;">🗺️ Ruta a ${destinationName}</h4>
              <p style="margin: 5px 0; color: #7f8c8d;">📏 Distancia: <strong>${distance} km</strong></p>
              <p style="margin: 5px 0; color: #7f8c8d;">⏱️ Tiempo estimado: <strong>${time} min</strong></p>
              <button onclick="clearRoute()" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 8px;">
                🗑️ Limpiar ruta
              </button>
            </div>
          `)
          .openOn(map);
      }).addTo(map);

      setRoutingControl(newRoutingControl);
    };

    // Función global para limpiar ruta
    window.clearRoute = () => {
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
        map.closePopup();
      }
    };

    // Manejar errores de geolocalización
    const handleError = (error) => {
      console.error("Error getting location:", error);
      // Ubicación por defecto si no se puede obtener la actual
      const defaultLocation = [20.656338, -100.405114];
      map.setView(defaultLocation, 17);
      L.marker(defaultLocation)
        .addTo(map)
        .bindPopup("Campus UTQ")
        .openPopup();
    };

    // Obtener ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showCurrentPosition, handleError);
    } else {
      handleError({ message: "Geolocation not supported" });
    }

    const center = [20.656338, -100.405114];
    const zoom = 17;

    map.setView(center, zoom);

    // Reemplazar OpenStreetMap con Google Maps
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: 'Google Maps',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20
    }).addTo(map);

    // Agregar marcadores de ubicaciones con información extendida
    const locations = [
      { 
        latitude: 20.6533474, 
        longitude: -100.4046172, 
        title: 'Entrada principal', 
        description: 'Acceso 1',
        image: 'https://via.placeholder.com/300x200?text=Entrada+Principal',
        details: 'Horario de acceso: 6:00 AM - 10:00 PM',
        contact: 'Vigilancia: ext. 1001'
      },
      { 
        latitude: 20.6543228, 
        longitude: -100.4046271, 
        title: 'Edificio DTAI', 
        description: 'División de Tecnologías de Automatización e Información',
        image: 'https://via.placeholder.com/300x200?text=Edificio+DTAI',
        details: 'Carreras: Ing. en Sistemas, Mecatrónica, TIC',
        contact: 'Tel: (442) 274-9000 ext. 2001'
      },
      { 
        latitude: 20.6541214, 
        longitude: -100.4041198, 
        title: 'Módulo Sanitario 1', 
        description: 'Servicios sanitarios',
        image: 'https://via.placeholder.com/300x200?text=Modulo+Sanitario',
        details: 'Disponible 24/7',
        contact: 'Mantenimiento: ext. 1050'
      },
      { 
        latitude: 20.6543096, 
        longitude: -100.4054418, 
        title: 'Rectoría', 
        description: 'Tramites institucionales',
        image: 'https://via.placeholder.com/300x200?text=Rectoria',
        details: 'Horario: Lunes a Viernes 8:00 AM - 4:00 PM',
        contact: 'Tel: (442) 274-9000 ext. 1000'
      },
      { 
        latitude: 20.6540485, 
        longitude: -100.4060981, 
        title: 'Vinculación escolar', 
        description: 'Inscripciones, becas, etc.',
        image: 'https://via.placeholder.com/300x200?text=Vinculacion+Escolar',
        details: 'Servicios: Inscripciones, Becas, Titulación',
        contact: 'Tel: (442) 274-9000 ext. 1200'
      },
      { 
        latitude: 20.6549875, 
        longitude: -100.4062969, 
        title: 'Edificio De Medios', 
        description: 'División Idiomas',
        image: 'https://via.placeholder.com/300x200?text=Edificio+Medios',
        details: 'Idiomas: Inglés, Francés, Alemán',
        contact: 'Tel: (442) 274-9000 ext. 3001'
      },
      { 
        latitude: 20.6544725, 
        longitude: -100.4041274, 
        title: 'División Industrial', 
        description: 'Edificio F',
        image: 'https://via.placeholder.com/300x200?text=Division+Industrial',
        details: 'Carreras: Ing. Industrial, Procesos Industriales',
        contact: 'Tel: (442) 274-9000 ext. 4001'
      },
      { 
        latitude: 20.6549875, 
        longitude: -100.4062969, 
        title: 'División de tecnología ambiental', 
        description: 'Edificio G',
        image: 'https://via.placeholder.com/300x200?text=Tecnologia+Ambiental',
        details: 'Carreras: Ing. Ambiental, Energías Renovables',
        contact: 'Tel: (442) 274-9000 ext. 5001'
      },
      { 
        latitude: 20.6557433, 
        longitude: -100.4048658, 
        title: 'Edificio de Nanotecnología', 
        description: 'Edificio H',
        image: 'https://via.placeholder.com/300x200?text=Nanotecnologia',
        details: 'Laboratorios especializados en nanotecnología',
        contact: 'Tel: (442) 274-9000 ext. 6001'
      },
      { 
        latitude: 20.6560881, 
        longitude: -100.4060255, 
        title: 'Auditorio UTEQ',
        description: 'Eventos y conferencias',
        image: 'https://via.placeholder.com/300x200?text=Auditorio+UTEQ',
        details: 'Capacidad: 500 personas. Eventos académicos y culturales',
        contact: 'Reservaciones: ext. 7001'
      }
    ];

    // Función para crear popup personalizado con routing mejorado
    const createCustomPopup = (loc) => {
      return `
        <div style="width: 320px; font-family: Arial, sans-serif;">
          <div style="position: relative;">
            <img src="${loc.image}" alt="${loc.title}" 
                 style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px 8px 0 0;" 
                 onerror="this.src='https://via.placeholder.com/300x180?text=Imagen+No+Disponible'">
            <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
              📍 ${loc.title}
            </div>
          </div>
          
          <div style="padding: 12px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px; font-weight: bold;">
              ${loc.title}
            </h3>
            
            <p style="margin: 0 0 8px 0; color: #7f8c8d; font-size: 14px; line-height: 1.4;">
              ${loc.description}
            </p>
            
            <div style="border-top: 1px solid #ecf0f1; padding-top: 8px; margin-top: 8px;">
              <div style="margin-bottom: 6px;">
                <span style="color: #3498db; font-weight: bold; font-size: 13px;">ℹ️ Información:</span>
                <br>
                <span style="color: #2c3e50; font-size: 13px;">${loc.details}</span>
              </div>
              
              <div>
                <span style="color: #e74c3c; font-weight: bold; font-size: 13px;">📞 Contacto:</span>
                <br>
                <span style="color: #2c3e50; font-size: 13px;">${loc.contact}</span>
              </div>
            </div>
            
            <div style="margin-top: 12px; text-align: center;">
              <button onclick="showRouteToLocation([${loc.latitude}, ${loc.longitude}], '${loc.title}')" 
                      style="background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 8px;">
                🗺️ Cómo llegar
              </button>
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}', '_blank')" 
                      style="background: #9b59b6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 8px;">
                🌐 Google Maps
              </button>
              <button onclick="navigator.share ? navigator.share({title: '${loc.title}', text: '${loc.description}', url: window.location.href}) : alert('Compartir no disponible')" 
                      style="background: #2ecc71; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                📤 Compartir
              </button>
            </div>
          </div>
        </div>
      `;
    };

    // Función global para mostrar ruta
    window.showRouteToLocation = (destination, destinationName) => {
      showRoute(destination, destinationName);
    };

    locations.forEach(loc => {
      L.marker([loc.latitude, loc.longitude])
        .addTo(map)
        .bindPopup(createCustomPopup(loc), {
          maxWidth: 340,
          className: 'custom-popup'
        });
    });

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
      if (routingControl) {
        map.removeControl(routingControl);
      }
      map.remove();
      mapRef.current = null;
    };
}, []);

  return (
    <>
      <style>
        {`
          .custom-popup .leaflet-popup-content-wrapper {
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          }
          .custom-popup .leaflet-popup-content {
            margin: 0;
            line-height: 1.4;
          }
          .custom-popup .leaflet-popup-tip {
            background: white;
          }
          .leaflet-routing-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .leaflet-routing-container h2 {
            background: #3498db;
            color: white;
            margin: 0;
            padding: 10px;
            border-radius: 8px 8px 0 0;
            font-size: 14px;
          }
        `}
      </style>
      <div
        id="map"
        style={{
          height: "calc(100vh - 80px)",
          width: "100%",
        }}
      />
    </>
  );
}

export default MapComponent;