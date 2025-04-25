// utils/edad.ts

export function calcularEdad(fechaNacimientoStr: string): number {
    const hoy = new Date();
    const fechaNacimiento = new Date(fechaNacimientoStr);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
  
    return edad;
  }
  