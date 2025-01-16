// axiosHelper.js
import axios from 'axios';

/**
 * Realiza una solicitud GET a la API y maneja errores.
 * @param {string} url - La URL de la API.
 * @returns {Promise<any>} - Los datos de la respuesta o un error.
 */
export const getData = async (url:string) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    handleAxiosError(error);
    throw error; // Lanzar el error después de manejarlo si es necesario
  }
};

/**
 * Maneja errores de axios.
 * @param {any} error - El error que se produjo.
 */
const handleAxiosError = (error:any) => {
  if (error.response) {
    // La solicitud se realizó y el servidor respondió con un código de estado que no está en el rango de 2xx
    if (error.response.status === 400) {
      console.error("Error 400: Solicitud incorrecta. Verifica los datos enviados.");
      // Puedes mostrar un mensaje al usuario aquí si es necesario
    } else {
      // Manejar otros errores de estado
      console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
    }
  } else if (error.request) {
    // La solicitud se realizó pero no se recibió respuesta
    console.error("No se recibió respuesta del servidor.");
  } else {
    // Algo ocurrió al configurar la solicitud
    console.error("Error en la configuración de la solicitud:", error.message);
  }
};
