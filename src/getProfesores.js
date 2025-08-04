// src/getProfesores.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const obtenerProfesores = async () => {
  const profesoresRef = collection(db, "profesores");
  const snapshot = await getDocs(profesoresRef);

  console.log("Cantidad total de documentos:", snapshot.size);

  const profesoresConCoordenadas = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      const tieneCoordenadas = data.coordenadas && data.coordenadas["0"] && data.coordenadas["1"];

      if (!tieneCoordenadas) return null; // ❌ Ignora si no tiene coordenadas

      const coordenadas = [
        parseFloat(data.coordenadas["0"]),
        parseFloat(data.coordenadas["1"]),
      ];

      console.log(`✅ Profesor válido (${doc.id}):`, {
        nombre: data.nombre,
        cubiculo: data.cubiculo,
        coordenadas,
      });

      return {
        id: doc.id,
        nombre: data.nombre || "Desconocido",
        cubiculo: data.cubiculo || "No especificado",
        coordenadas,
      };
    })
    .filter(Boolean); // 🧹 Elimina los nulls

  return profesoresConCoordenadas;
};


