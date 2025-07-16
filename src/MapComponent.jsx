import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import locations from './locations';
import intersectionPoints from './intersectionPoints';
import pathPairs from './pathPairs';

function MapComponent({ onBack }) {
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const currentLocationRef = useRef(null);
  //const [destination, setDestination] = useState([LAT, LNG]);
  const buttonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1000,
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
  };


  const mapStyle = {
    height: "100vh",
    width: "100%",
    position: "relative",
    zIndex: 1,
    touchAction: "none",
    backgroundColor: "#f0f0f0"
  };

  const loadingStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 3,
    textAlign: "center"
  };

  const positionWatcher = useRef(null);
  let lastRoute = null;
  let currentUserMarker = null;
  let currentAccuracyCircle = null;

  const showCurrentPosition = (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    const userLocation = [latitude, longitude];

    // Evitar recalcular ruta si el movimiento es muy pequeño (< 10m)
    if (currentLocationRef.current) {
      const movedDistance = getDistance(currentLocationRef.current, userLocation);
      if (movedDistance < 10) return; // Ignorar pequeñas variaciones
    }

    setCurrentLocation(userLocation);
    currentLocationRef.current = userLocation;

    // Eliminar marcador y círculo previos si existen
    if (currentUserMarker) mapRef.current.removeLayer(currentUserMarker);
    if (currentAccuracyCircle) mapRef.current.removeLayer(currentAccuracyCircle);

    // Opcional: limpiar solo la ruta previa
    if (lastRoute) mapRef.current.removeLayer(lastRoute);

    // Recentrar mapa según preferencia
    const zoomLevel = Math.max(17, Math.min(20, Math.round(14 - Math.log(accuracy) / Math.LN2)));
    const shouldRecenter = true; // Puedes controlar esto desde un state
    if (shouldRecenter) {
      mapRef.current.setView(userLocation, zoomLevel);
    }

    // Mostrar círculo de precisión
    currentAccuracyCircle = L.circle(userLocation, {
      radius: accuracy,
      color: '#3388ff',
      fillColor: '#3388ff',
      fillOpacity: 0.2
    }).addTo(mapRef.current);

    // Mostrar marcador de ubicación actual
    currentUserMarker = L.marker(userLocation, {
      icon: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [20, 32],
        iconAnchor: [10, 32],
        popupAnchor: [1, -15],
        shadowSize: [32, 32]
      })
    }).addTo(mapRef.current)
      .bindPopup(`
        <b>Tu ubicación actual</b><br>
        Lat: ${latitude.toFixed(6)}<br>
        Lng: ${longitude.toFixed(6)}<br>
        Precisión: ${Math.round(accuracy)} metros
      `).openPopup();

    // Recalcular ruta hacia el destino
    lastRoute = createRoute(userLocation, destination);
  };

  const startTracking = () => {
    if (positionWatcher.current) {
      navigator.geolocation.clearWatch(positionWatcher.current);
    }

    positionWatcher.current = navigator.geolocation.watchPosition(
      showCurrentPosition,
      (err) => console.error("Error obteniendo posición:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );
  };

  const createRoute = useRef(null);

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

    startTracking();

    map.on('load', () => {
      const loadingElement = document.getElementById('map-loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
    });

    setTimeout(() => {
      map.invalidateSize(true);
    }, 100);

    //L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: 'Google Maps',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20
    }).addTo(map);

    const showRoute = (destination, destinationName) => {
      // Clear any existing routes first
      map.eachLayer(layer => {
        if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
          map.removeLayer(layer);
        }
      });
      
      const userLocation = currentLocationRef.current;
      if (!userLocation) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const newUserLocation = [latitude, longitude];
              currentLocationRef.current = newUserLocation;
              setCurrentLocation(newUserLocation);
              createRoute(newUserLocation, destination);
            }
          );
        }
        return;
      }
      createRoute(userLocation, destination);
    };


    function buildGraph() {
      const graph = {};
      
      // Initialize all intersection points in the graph
      intersectionPoints.forEach(ip => {
        const key = JSON.stringify(ip);
        if (!graph[key]) {
          graph[key] = [];
        }
      });
      
      // Add all path connections to the graph
      pathPairs.forEach(pair => {
        const [a, b] = pair;
        const keyA = JSON.stringify(a);
        const keyB = JSON.stringify(b);
        
        // Make sure both points exist in the graph
        if (!graph[keyA]) graph[keyA] = [];
        if (!graph[keyB]) graph[keyB] = [];
        
        const dist = getDistance(a, b);
        
        // Check if this connection already exists
        const existsAtoB = graph[keyA].some(n => n.node === keyB);
        const existsBtoA = graph[keyB].some(n => n.node === keyA);
        
        if (!existsAtoB) {
          graph[keyA].push({ node: keyB, weight: dist });
        }
        
        if (!existsBtoA) {
          graph[keyB].push({ node: keyA, weight: dist });
        }
      });
      
      // Add connections to nearby nodes to improve connectivity
      const maxDistance = 25; // Maximum distance in meters to consider nodes as connected (increased from 20)
      
      intersectionPoints.forEach(pointA => {
        const keyA = JSON.stringify(pointA);
        
        intersectionPoints.forEach(pointB => {
          if (pointA === pointB) return;
          
          const keyB = JSON.stringify(pointB);
          const dist = getDistance(pointA, pointB);
          
          // If points are very close but not connected, add a connection
          if (dist < maxDistance) {
            const existsAtoB = graph[keyA].some(n => n.node === keyB);
            
            if (!existsAtoB) {
              graph[keyA].push({ node: keyB, weight: dist });
              graph[keyB].push({ node: keyA, weight: dist });
            }
          }
        });
      });
      
      // Add connections for all pathPairs to ensure they're in the graph
      pathPairs.forEach(pair => {
        // Find the nearest intersection points for each point in the pair
        const [a, b] = pair;
        const nearestToA = findNearestIntersection(a);
        const nearestToB = findNearestIntersection(b);
        
        if (nearestToA && nearestToB) {
          const keyA = JSON.stringify(nearestToA);
          const keyB = JSON.stringify(nearestToB);
          
          if (keyA !== keyB) {
            const dist = getDistance(nearestToA, nearestToB);
            
            // Check if this connection already exists
            const existsAtoB = graph[keyA].some(n => n.node === keyB);
            
            if (!existsAtoB) {
              graph[keyA].push({ node: keyB, weight: dist });
              graph[keyB].push({ node: keyA, weight: dist });
            }
          }
        }
      });
      
      return graph;
    }

    // Improved findNearestIntersection function
    function findNearestIntersection(point) {
      let minDist = Infinity, nearest = null;
      intersectionPoints.forEach(ip => {
        const dist = getDistance(point, ip);
        if (dist < minDist) {
          minDist = dist;
          nearest = ip;
        }
      });
      return nearest;
    }

    const createRoute = (userLocation, destination) => {
      // Clear any existing routes and popups
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
      }
      map.closePopup();
      
      // Remove all existing polylines (paths) from the map
      map.eachLayer(layer => {
        if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
          map.removeLayer(layer);
        }
      });
      
      // Find the nearest intersection points to start and end
      let startNode = findNearestIntersection(userLocation);
      let endNode = findNearestIntersection(destination);
      
      // Build the graph of all paths
      const graph = buildGraph();
      
      // Try to find a path using Dijkstra's algorithm
      let pathNodes = dijkstra(graph, JSON.stringify(startNode), JSON.stringify(endNode));
      
      // If no path found, try with a more comprehensive approach
      if (pathNodes.length <= 1) {
        // Try all possible intermediate nodes to find a path
        const allPaths = [];
        
        // Get top 10 most connected nodes as potential intermediate points
        const connectedNodes = Object.keys(graph)
          .map(key => ({ key, connections: graph[key].length }))
          .sort((a, b) => b.connections - a.connections)
          .slice(0, 10)
          .map(item => JSON.parse(item.key));
        
        // Try to find paths through each connected node
        for (const midNode of connectedNodes) {
          const midNodeKey = JSON.stringify(midNode);
          const pathToMid = dijkstra(graph, JSON.stringify(startNode), midNodeKey);
          const pathFromMid = dijkstra(graph, midNodeKey, JSON.stringify(endNode));
          
          if (pathToMid.length > 1 && pathFromMid.length > 1) {
            // Remove the duplicate middle node
            pathFromMid.shift();
            const fullPath = [...pathToMid, ...pathFromMid];
            
            // Calculate the total distance of this path
            let totalDist = 0;
            for (let i = 0; i < fullPath.length - 1; i++) {
              totalDist += getDistance(fullPath[i], fullPath[i+1]);
            }
            
            allPaths.push({ path: fullPath, distance: totalDist });
          }
        }
        
        // If we found any paths, use the shortest one
        if (allPaths.length > 0) {
          allPaths.sort((a, b) => a.distance - b.distance);
          pathNodes = allPaths[0].path;
        }
          // Elimina los puntos que ya has pasado
          while (pathNodes.length && getDistance(userLocation, pathNodes[0]) < 10) {
              pathNodes.shift();
          }
      }

      // If still no path, try a more aggressive approach with multiple hops
      if (pathNodes.length <= 1) {
        // Try to find a path with multiple intermediate points
        const centralNodes = [
          [20.654214, -100.405725], // Near Rectoría
          [20.655093, -100.404981], // Central campus area
          [20.654126, -100.404952], // Near DTAI
          [20.655531, -100.405378], // Near Nanotecnología
          [20.654872, -100.406180], // Near Edificio Medios
          [20.653815, -100.404486], // Near entrance
          [20.656291, -100.405180]  // North campus
        ];
        
        // Convert to proper format
        const centralNodeKeys = centralNodes.map(node => JSON.stringify(node));
        
        // Try to find a path through two intermediate nodes
        for (const midNode1Key of centralNodeKeys) {
          for (const midNode2Key of centralNodeKeys) {
            if (midNode1Key === midNode2Key) continue;
            
            const path1 = dijkstra(graph, JSON.stringify(startNode), midNode1Key);
            const path2 = dijkstra(graph, midNode1Key, midNode2Key);
            const path3 = dijkstra(graph, midNode2Key, JSON.stringify(endNode));
            
            if (path1.length > 1 && path2.length > 1 && path3.length > 1) {
              // Remove duplicate nodes
              path2.shift();
              path3.shift();
              pathNodes = [...path1, ...path2, ...path3];
              break;
            }
          }
          if (pathNodes.length > 1) break;
        }
      }

      // If still no path, create a direct line with a warning
      if (pathNodes.length <= 1) {
        console.log("No path found, using direct line");
        // Draw a direct line between the nearest intersection points
        L.polyline([startNode, endNode], {
          color: '#FF5733', // Bright orange-red color for visibility
          weight: 6,
          opacity: 0.9,
          dashArray: '10, 10' // Dashed line to indicate it's not a real path
        }).addTo(map);
        
        // Add markers for start and end points
        L.marker(userLocation, {
          icon: new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [20, 32],
            iconAnchor: [10, 32],
            popupAnchor: [1, -28],
            shadowSize: [32, 32]
          })
        })/*.addTo(map).bindPopup("Tu ubicación")*/;
        
        L.marker(destination, {
          icon: new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [20, 32],
            iconAnchor: [10, 32],
            popupAnchor: [1, -28],
            shadowSize: [32, 32]
          })
        }).addTo(map).bindPopup(destinationName);

        map.fitBounds(L.latLngBounds([userLocation, startNode, endNode, destination]), { padding: [50, 50] });

        // Calculate direct distance
        const distance = getDistance(userLocation, destination);
        
        L.popup()
          .setLatLng([(startNode[0] + endNode[0])/2, (startNode[1] + endNode[1])/2])
          .setContent(`
            <div style="max-width: 300px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0;">Ruta aproximada hacia ${destinationName}</h4>
              <p style="margin: 0 0 8px 0; color: #e74c3c;"><strong>Nota:</strong> No se encontró una ruta peatonal exacta.</p>
              <p style="margin: 0 0 8px 0;">Distancia aproximada: ${(distance / 1000).toFixed(2)} km</p>
              <p style="margin: 0;">Se muestra una ruta directa aproximada. Sigue los caminos peatonales más cercanos.</p>
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${destination[0]},${destination[1]}&travelmode=walking', '_blank')" 
                      style="margin-top: 10px; background: #3498db; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; width: 100%;">
                🗺️ Ver alternativas en Google Maps
              </button>
            </div>
          `)
          .openOn(map);
          
        return;
      }

      console.log("Found path with nodes:", pathNodes.length);
      
      // Draw the optimal route with high visibility
      L.polyline(pathNodes, {
        color: '#FF5733', // Bright orange-red color for better visibility
        weight: 6,
        opacity: 1
      }).addTo(map);

      // Add markers for start and end points
      L.marker(userLocation, {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [20, 32],
          iconAnchor: [10, 32],
          popupAnchor: [1, -28],
          shadowSize: [32, 32]
        })
      })/*.addTo(map).bindPopup("Tu ubicación")*/;
      
      L.marker(destination, {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [20, 32],
          iconAnchor: [10, 32],
          popupAnchor: [1, -28],
          shadowSize: [32, 32]
        })
      }).addTo(map).bindPopup(destinationName);

      // Draw lines from user location to first node and from last node to destination
      L.polyline([userLocation, pathNodes[0]], {
        color: '#FF5733', // Match the route color
        weight: 6,
        opacity: 1,
        dashArray: '5, 10' // Dashed line for the connection segments
      }).addTo(map);
      
      L.polyline([pathNodes[pathNodes.length-1], destination], {
        color: '#FF5733', // Match the route color
        weight: 6,
        opacity: 1,
        dashArray: '5, 10' // Dashed line for the connection segments
      }).addTo(map);

      map.fitBounds(L.latLngBounds([userLocation, ...pathNodes, destination]), { padding: [50, 50] });

      // Calculate total distance
      let totalDistance = 0;
      for (let i = 0; i < pathNodes.length - 1; i++) {
        totalDistance += getDistance(pathNodes[i], pathNodes[i+1]);
      }
      // Add distance from user to first node and from last node to destination
      totalDistance += getDistance(userLocation, pathNodes[0]);
      totalDistance += getDistance(pathNodes[pathNodes.length-1], destination);

      L.popup()
        .setLatLng(pathNodes[Math.floor(pathNodes.length / 2)])
        .setContent(`
          <div style="max-width: 300px; font-family: Arial, sans-serif;">
            <h4 style="margin: 0 0 8px 0;">Ruta peatonal hacia ${destinationName}</h4>
            <p style="margin: 0 0 8px 0;">Distancia aproximada: ${(totalDistance / 1000).toFixed(2)} km</p>
            <p style="margin: 0;">Esta ruta sigue los caminos peatonales del campus.</p>
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${destination[0]},${destination[1]}&travelmode=walking', '_blank')" 
                    style="margin-top: 10px; background: #3498db; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; width: 100%;">
              🗺️ Ver alternativas en Google Maps
            </button>
          </div>
        `)
        .openOn(map);
    };

    window.clearRoute = () => {
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
        map.closePopup();
      }
    };

    const handleError = (error) => {
      console.error("Error de geolocalización:", error);

      const defaultLocation = [20.656338, -100.405114];
      map.setView(defaultLocation, 17);
      L.marker(defaultLocation)
        .addTo(map)
        .bindPopup("Campus UTQ")
        .openPopup();
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showCurrentPosition, handleError);
    } else {
      handleError({ message: "Geolocation not supported" });
    }

    const center = [20.656338, -100.405114];
    const zoom = 17;
    map.setView(center, zoom);

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: 'Google Maps',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20
    }).addTo(map);

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

    window.showRouteToLocation = (destination, destinationName) => {
      // If user location is available, use it as starting point
      if (currentLocationRef.current) {
        //startTracking();
        const userLocation = currentLocationRef.current;
        
        // Open Google Maps with directions
        const startStr = `${userLocation[0]},${userLocation[1]}`;
        const endStr = `${destination[0]},${destination[1]}`;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${startStr}&destination=${endStr}&travelmode=walking`;
        
        // Create a popup with options
        L.popup()
          .setLatLng(destination)
          .setContent(`
            <div style="max-width: 300px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0;">Ruta hacia ${destinationName}</h4>
              <p style="margin: 0 0 12px 0;">Selecciona cómo quieres ver la ruta:</p>
              <div style="display: flex; gap: 8px; flex-direction: column;">
                <button onclick="window.open('${url}', '_blank')" 
                        style="background: #3498db; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 13px; width: 100%;">
                  🗺️ Abrir en Google Maps
                </button>
                <button onclick="showPathOnMap([${userLocation}], [${destination}], '${destinationName}')" 
                        style="background: #2ecc71; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 13px; width: 100%;">
                  📍 Mostrar línea directa en el mapa
                </button>
                <button onclick="showRoute([${destination}], '${destinationName}')" 
                        style="background: #e67e22; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 13px; width: 100%;">
                  🚶 Mostrar ruta por caminos peatonales
                </button>
              </div>
            </div>
          `)
          .openOn(map);
      } else {
        // If user location is not available, request it
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const userLocation = [latitude, longitude];
              currentLocationRef.current = userLocation;
              setCurrentLocation(userLocation);
              
              // Recursively call this function now that we have the location
              window.showRouteToLocation(destination, destinationName);
            },
            (error) => {
              console.error("Error getting location:", error);
              alert("No se pudo obtener tu ubicación. Verifica los permisos de ubicación en tu navegador.");
            }
          );
        } else {
          alert("Tu navegador no soporta geolocalización.");
        }
      }
    };
    
    // Make showRoute available globally
    window.showRoute = showRoute;
    
    // Function to show a simple path on the map
    window.showPathOnMap = (start, end, destinationName) => {
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
        map.closePopup();
        const existingContainers = document.querySelectorAll('.leaflet-routing-container');
        existingContainers.forEach(container => container.remove());
      }
      
      // Draw a direct line between points
      const pathLine = L.polyline([start, end], {
        color: '#2980b9',
        weight: 6,
        opacity: 0.9
      }).addTo(map);
      
      // Add markers for start and end points
      L.marker(start, {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [20, 32],
          iconAnchor: [10, 32],
          popupAnchor: [1, -28],
          shadowSize: [32, 32]
        })
      }).addTo(map).bindPopup("Punto de inicio");
      
      L.marker(end, {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [20, 32],
          iconAnchor: [10, 32],
          popupAnchor: [1, -28],
          shadowSize: [32, 32]
        })
      }).addTo(map).bindPopup(destinationName);
      
      // Fit the map to show the entire route
      map.fitBounds(L.latLngBounds([start, end]), { padding: [50, 50] });
      
      // Calculate approximate distance
      const distance = getDistance(start, end);
      
      // Show route information in a popup
      L.popup()
        .setLatLng([(start[0] + end[0])/2, (start[1] + end[1])/2])
        .setContent(`
          <div style="max-width: 300px">
            <h4 style="margin: 0 0 8px 0;">Ruta directa hacia ${destinationName}</h4>
            <p style="margin: 0 0 8px 0;">Distancia aproximada: ${(distance / 1000).toFixed(2)} km</p>
            <p style="margin: 0;">Esta es una línea directa. Para rutas más precisas, usa Google Maps.</p>
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&origin=${start[0]},${start[1]}&destination=${end[0]},${end[1]}&travelmode=walking', '_blank')" 
                    style="margin-top: 10px; background: #3498db; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; width: 100%;">
              🗺️ Ver ruta detallada en Google Maps
            </button>
          </div>
        `)
        .openOn(map);
    };

    map.on('click', function(e) {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      const coordsString = `[${lat}, ${lng}]`;

      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div style="font-family: Arial, sans-serif;">
            <b>Coordenadas del punto:</b><br>
            Latitud: ${lat}<br>
            Longitud: ${lng}<br>
            <div style="margin-top: 8px;">
              <input type="text" value="${coordsString}" 
                     id="coordsInput" 
                     readonly 
                     style="width: 200px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
              <button onclick="this.innerHTML='✓ Copiado'; setTimeout(() => this.innerHTML='📋 Copiar', 1000); navigator.clipboard.writeText('${coordsString}')"
                      style="margin-left: 4px; padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                📋 Copiar
              </button>
            </div>
          </div>
        `)
        .openOn(map);
    });

    pathPairs.forEach(pair => {
      L.polyline(pair, {
        color: '#2980b9', // Cambiado de verde a azul
        weight: 3,
        opacity: 0.8
      }).addTo(map);
    });

    const uniquePoints = [...new Set(pathPairs.flat().map(JSON.stringify))].map(JSON.parse);
    uniquePoints.forEach((point, index) => {
      L.circleMarker(point, {
        radius: 4,
        fillColor: '#e74c3c',
        color: '#c0392b',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      }).addTo(map);
    });

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

    const outerBounds = [
      [[90, -180], [90, 180], [-90, 180], [-90, -180]],
      [[20.653705, -100.407463],
       [20.653130, -100.403805],
       [20.659045, -100.402758],
       [20.659572, -100.406165]]
    ];

    L.polygon(outerBounds, {
      color: 'transparent',
      fillColor: '#000',
      fillOpacity: 0.2
    }).addTo(map);

    map.fitBounds(campusBoundary.getBounds());

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: 'Google Maps',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      bounds: campusBoundary.getBounds()
    }).addTo(map);

    const campusLocations = locations.filter(loc => {
      const point = L.latLng(loc.latitude, loc.longitude);
      return campusBoundary.getBounds().contains(point);
    });

    campusLocations.forEach(loc => {
      L.marker([loc.latitude, loc.longitude], {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [20, 32],
          iconAnchor: [10, 32],
          popupAnchor: [1, -28],
          shadowSize: [32, 32]
        })
      })
        .addTo(map)
        .bindPopup(createCustomPopup(loc), {
          maxWidth: 340,
          className: 'custom-popup'
        });
    });

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(document.getElementById("map"));

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      resizeObserver.disconnect();
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

      <button onClick={onBack} style={buttonStyle}>⬅ Volver</button>

      <div id="map" style={mapStyle} />

      <div id="map-loading" style={loadingStyle}>
        <p>Cargando mapa...</p>
      </div>
    </>
    
  );
}

export default MapComponent;


// Utility: Calculate distance between two points (Haversine formula)
function getDistance(a, b) {
  const toRad = x => x * Math.PI / 180;
  const R = 6371e3;
  const lat1 = toRad(a[0]), lat2 = toRad(b[0]);
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const A = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1-A));
  return R * C;
}

/* Utility: Find nearest intersection point
function findNearestIntersection(point) {
  let minDist = Infinity, nearest = null;
  intersectionPoints.forEach(ip => {
    const dist = getDistance(point, ip);
    if (dist < minDist) {
      minDist = dist;
      nearest = ip;
    }
  });
  return nearest;
}
*/

function dijkstra(graph, start, end) {
  const queue = new Set(Object.keys(graph));
  const distances = {};
  const prev = {};
  
  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    prev[node] = null;
  });
  distances[start] = 0;

  while (queue.size > 0) {
    let minNode = null;
    queue.forEach(node => {
      if (minNode === null || distances[node] < distances[minNode]) {
        minNode = node;
      }
    });
    
    if (minNode === end) break;
    if (minNode === null) break; // No path found
    
    queue.delete(minNode);

    if (distances[minNode] === Infinity) break; // Unreachable node

    if (graph[minNode]) {
      graph[minNode].forEach(neighbor => {
        const alt = distances[minNode] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          prev[neighbor.node] = minNode;
        }
      });
    }
  }

  const path = [];
  let curr = end;
  
  // Check if end is reachable
  if (prev[curr] === null && curr !== start) {
    console.log("No path found between", start, "and", end);
    return [];
  }
  
  while (curr) {
    try {
      path.unshift(JSON.parse(curr));
      curr = prev[curr];
    } catch (e) {
      console.error("Error parsing node:", curr, e);
      break;
    }
  }
  
  return path;
}
