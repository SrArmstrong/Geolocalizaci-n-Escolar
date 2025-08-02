// src/getProfesores.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const obtenerProfesores = async () => {
  const profesoresRef = collection(db, "profesores");
  const snapshot = await getDocs(profesoresRef);

  return snapshot.docs
    .map((doc) => {
      const data = doc.data();

      // Verifica que coordenadas existan y sean válidas
      const tieneCoordenadas = data.coordenadas && data.coordenadas["0"] && data.coordenadas["1"];

      return {
        id: doc.id,
        nombre: data.nombre || "Desconocido",
        cubiculo: data.cubiculo || "No especificado",
        coordenadas: tieneCoordenadas
          ? [
              parseFloat(data.coordenadas["0"]),
              parseFloat(data.coordenadas["1"]),
            ]
          : [0, 0], // Valor por defecto o podrías omitir este profesor
      };
    })
    // Opcional: filtra los que no tienen coordenadas válidas
    .filter(prof => prof.coordenadas[0] !== 0 && prof.coordenadas[1] !== 0);
    
};

