import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const customRoutes = {
  // Example: Route from DTAI to Rectoría
  'DTAI-Rectoría': {
    waypoints: [
      [20.6543228, -100.4046271], // DTAI
      [20.6542, -100.4050], // Intermediate point
      [20.6543096, -100.4054418], // Rectoría
    ],
    description: 'Ruta interior por andadores peatonales'
  },
  // Add more custom routes as needed
  // Route from Main Entrance to Auditorium with detailed waypoints
  'Entrada principal-Auditorio UTEQ': {
    waypoints: [
      [20.6533474, -100.4046172],  // Entrada principal
      [20.654240, -100.404367],    // Punto de reunión
      [20.654135, -100.405019],    // Vuelta después del edificio K
      [20.654135, -100.405019],    // Cruzando cafetería
      [20.655530, -100.405391],    // Camino a la izquierda
      [20.655562, -100.405754],    // Bifurcación derecha
      [20.6560881, -100.4060255]   // Auditorio UTEQ
    ],
    description: 'Ruta peatonal segura: Sigue los andadores principales, cruza con precaución en la cafetería.',
    instructions: [
      'Camina hasta el punto de reunión y gira a la izquierda',
      'Al terminar el edificio K, gira a la derecha',
      'Cruza por la cafetería y la carretera hacia el camino junto al edificio F',
      'Sigue el camino hacia la izquierda',
      'En la bifurcación, toma el camino de la derecha',
      'Has llegado al Auditorio UTEQ'
    ]
  },
};

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

    const map = L.map("map", {
      minZoom: 2,
      maxZoom: 20,
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true
    });
    mapRef.current = map;

    // Add these lines
    map.on('load', () => {
      const loadingElement = document.getElementById('map-loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
    });

    // Force a resize after map creation
    setTimeout(() => {
      map.invalidateSize(true);
    }, 100);

    // Add zoom control to bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Add scale control
    L.control.scale({
      imperial: false,
      position: 'bottomleft'
    }).addTo(map);

    // Remove the campus boundary restrictions
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: 'Google Maps',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20
    }).addTo(map);

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
          iconSize: [20, 32],     // Changed from [25, 41]
          iconAnchor: [5, 10],   // Adjusted from [12, 41]
          popupAnchor: [1, -15],  // Adjusted from [1, -34]
          shadowSize: [32, 32]    // Adjusted from [41, 41]
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
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
        map.closePopup();
        const existingContainers = document.querySelectorAll('.leaflet-routing-container');
        existingContainers.forEach(container => container.remove());
      }
    
      // Create route key based on location titles
      const routeKey = `Entrada principal-${destinationName}`;
      const customRoute = customRoutes[routeKey];
    
      if (customRoute) {
        // Use custom route with waypoints
        const path = L.polyline(customRoute.waypoints, {
          color: '#2980b9',
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(map);
    
        // Add markers for each waypoint with instructions
        customRoute.waypoints.forEach((waypoint, index) => {
          if (index > 0 && index < customRoute.waypoints.length - 1) {
            L.circleMarker(waypoint, {
              radius: 8,
              fillColor: '#3498db',
              color: '#fff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            }).addTo(map)
              .bindPopup(customRoute.instructions[index-1]);
          }
        });
    
        // Fit bounds to show the entire route
        map.fitBounds(path.getBounds(), { padding: [50, 50] });
    
        // Show route description
        L.popup()
          .setLatLng(customRoute.waypoints[0])
          .setContent(`
            <div style="max-width: 300px">
              <h4 style="margin: 0 0 8px 0">Ruta personalizada</h4>
              <p style="margin: 0 0 8px 0">${customRoute.description}</p>
              <small style="color: #666">Haz clic en los puntos azules para ver las instrucciones paso a paso</small>
            </div>
          `)
          .openOn(map);
      } else {
        // Default routing code remains unchanged
        const newRoutingControl = L.Routing.control({
          waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(destination[0], destination[1])
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: function() { return null; },
          lineOptions: {
            styles: [{
              color: '#000000',
              weight: 6,
              opacity: 0.8
            }]
          },
          show: true,
          collapsible: true,
          language: 'es',
          showAlternatives: false
        }).addTo(map);
    
        // Ensure only one routing container is visible
        newRoutingControl.on('routesfound', function() {
          const containers = document.querySelectorAll('.leaflet-routing-container');
          if (containers.length > 1) {
            containers.forEach((container, index) => {
              if (index < containers.length - 1) container.remove();
            });
          }
        });
    
        setRoutingControl(newRoutingControl);
      };
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
      console.error("Error de geolocalización:", error);
      
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
    // Modify the popup style for better mobile viewing
    const createCustomPopup = (loc) => {
      return `
        <div style="width: 280px; font-family: Arial, sans-serif;">
          <div style="position: relative;">
            <img src="${loc.image}" alt="${loc.title}" 
                 style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px 8px 0 0;" 
                 onerror="this.src='https://via.placeholder.com/300x180?text=Imagen+No+Disponible'">
            <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
              📍 ${loc.title}
            </div>
          </div>
          
          <div style="padding: 10px; background: white; border-radius: 0 0 8px 8px;">
            <h3 style="margin: 0 0 6px 0; color: #2c3e50; font-size: 14px; font-weight: bold;">
              ${loc.title}
            </h3>
            
            <p style="margin: 0 0 6px 0; color: #7f8c8d; font-size: 12px; line-height: 1.3;">
              ${loc.description}
            </p>
            
            <div style="border-top: 1px solid #ecf0f1; padding-top: 6px; margin-top: 6px;">
              <div style="margin-bottom: 4px;">
                <span style="color: #3498db; font-weight: bold; font-size: 11px;">ℹ️ Info:</span>
                <span style="color: #2c3e50; font-size: 11px;">${loc.details}</span>
              </div>
              
              <div>
                <span style="color: #e74c3c; font-weight: bold; font-size: 11px;">📞 Contacto:</span>
                <span style="color: #2c3e50; font-size: 11px;">${loc.contact}</span>
              </div>
            </div>
            
            <div style="margin-top: 8px; display: flex; justify-content: space-between; gap: 4px;">
              <button onclick="showRouteToLocation([${loc.latitude}, ${loc.longitude}], '${loc.title}')" 
                      style="flex: 1; background: #3498db; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                🗺️ Ruta
              </button>
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}', '_blank')" 
                      style="flex: 1; background: #9b59b6; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                🌐 Maps
              </button>
              <button onclick="navigator.share ? navigator.share({title: '${loc.title}', text: '${loc.description}', url: window.location.href}) : alert('Compartir no disponible')" 
                      style="flex: 1; background: #2ecc71; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                📤 Share
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

    // Add campus boundary polygon
    const campusBoundary = L.polygon([
      [20.653705, -100.407463],
      [20.659572, -100.406165],
      [20.659045, -100.402758],
      [20.653130, -100.403805]
    ], {
      color: '#3498db',
      weight: 2,
      fillOpacity: 0.1
    }).addTo(map);

    // Add outer area mask
    const outerBounds = [
      [[90, -180], [90, 180], [-90, 180], [-90, -180]], // Outer rectangle
      [[20.653705, -100.407463], // Campus boundary (in reverse)
       [20.653130, -100.403805],
       [20.659045, -100.402758],
       [20.659572, -100.406165]]
    ];

    L.polygon(outerBounds, {
      color: 'transparent',
      fillColor: '#000',
      fillOpacity: 0.2
    }).addTo(map);

    // Fit map to campus boundary
    map.fitBounds(campusBoundary.getBounds());

    // Update tile layer with restricted bounds
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: 'Google Maps',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      bounds: campusBoundary.getBounds()
    }).addTo(map);

    // Filter locations to only show those within the campus boundary
    const campusLocations = locations.filter(loc => {
      const point = L.latLng(loc.latitude, loc.longitude);
      return campusBoundary.getBounds().contains(point);
    });

    // Update locations loop to use filtered locations
    campusLocations.forEach(loc => {
      L.marker([loc.latitude, loc.longitude], {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [20, 32],     // Smaller marker size
          iconAnchor: [10, 32],   // Adjusted anchor point
          popupAnchor: [1, -28],  // Adjusted popup position
          shadowSize: [32, 32]    // Adjusted shadow size
        })
      })
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
            max-width: 90vw;
          }
          .custom-popup .leaflet-popup-content {
            margin: 0;
            line-height: 1.3;
            width: auto !important;
          }
          .custom-popup .leaflet-popup-tip {
            background: white;
          }
          .leaflet-routing-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 90vw;
            font-size: 12px;
            color: black !important;
          }
          .leaflet-routing-container h2 {
            background: #3498db;
            color: white;
            margin: 0;
            padding: 8px;
            border-radius: 8px 8px 0 0;
            font-size: 13px;
          }
          .leaflet-routing-alt {
            color: black !important;
          }
          .leaflet-routing-alt table {
            color: black !important;
          }
          .leaflet-routing-alt tr:hover {
            background-color: rgba(0, 0, 0, 0.05) !important;
            color: black !important;
          }
          .leaflet-routing-icon {
            filter: brightness(0) !important;
          }
          .leaflet-touch .leaflet-control-layers,
          .leaflet-touch .leaflet-bar {
            border: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .leaflet-control-zoom a {
            width: 30px !important;
            height: 30px !important;
            line-height: 30px !important;
            font-size: 16px;
          }
          @media (max-width: 768px) {
            .leaflet-control-zoom {
              margin-bottom: 70px !important;
            }
            .leaflet-control-scale {
              margin-bottom: 20px !important;
            }
          }
        `}
      </style>
      <div
        id="map"
        style={{
          height: "100vh",  // Changed from calc(100vh - 60px)
          width: "100%",
          position: "relative",
          zIndex: 1,
          touchAction: "none",
          backgroundColor: "#f0f0f0"  // Added fallback background
        }}
      />
      <div id="map-loading" 
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
          textAlign: "center"
        }}>
        <p>Cargando mapa...</p>
      </div>
    </>
  );
}

export default MapComponent;