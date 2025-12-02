/*
  Archivo: erick_academic_info.js
  Descripción: Información académica de Erick Josafat Estrada Gutierrez y una pequeña "dibujo" de lentes en ASCII.
  Generado automáticamente según solicitud del usuario.
*/

const academicInfo = {
  nombre: "Erick Josafat Estrada Gutierrez",
  programa: "IDGS11",
  edad: 21,
  altura_cm: 170,
  descripcion: "Muy guapo"
};

/**
 * Devuelve un dibujo de lentes en caracteres (ASCII art).
 * También imprime el dibujo por consola si se desea.
 * @param {boolean} printToConsole - Si es true, hace console.log del dibujo.
 * @returns {string} - El dibujo en formato string.
 */
function dibujarLentes(printToConsole = true) {
  const lentes = `
     _____       _____
    /     \     /     \
   |  O O  |---|  O O  |
    \  -  /     \  -  /
     '---'       '---'
        \___________/
           |     |
           |     |
  `;

  if (printToConsole) console.log(lentes);
  return lentes;
}

// Exporta la información y la función para que puedan importarse desde otros módulos.
export default academicInfo;
export { dibujarLentes };

// Uso rápido (si ejecutas este archivo directamente con Node >=14 con soporte ESM):
// import academicInfo, { dibujarLentes } from './erick_academic_info.js';
// console.log(academicInfo);
// dibujarLentes();
