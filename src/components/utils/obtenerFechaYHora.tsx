// Exportación nombrada
export function obtenerFechaYHora() {
    const fechafinal = new Date();
    const fechayhora=fechafinal.toISOString()
    // Obtener la hora
    const hours = fechafinal.getHours();
    const minutes = fechafinal.getMinutes();
    const seconds = fechafinal.getSeconds();
  
    // Formatear la hora en formato HH:MM:SS
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const hora = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    // Obtener la fecha
    const year = fechafinal.getFullYear();
    const month = (fechafinal.getMonth() + 1).toString().padStart(2, '0'); // El mes se ajusta porque getMonth() retorna 0-11
    const day = fechafinal.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const formattedDate2 = `${day}/${month}/${year}`;
  
    // Retornar un objeto con la fecha y hora formateadas
    return {
      formattedDate2:formattedDate2,
      formattedDate: formattedDate,
      time: time,
      hora:hora,
      fechayhora:fechayhora
    };
  }
  