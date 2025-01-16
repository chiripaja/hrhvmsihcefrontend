export interface Role {
    idUsuarioRol: number;
    idEmpleadoRol: number;
    idRol: number;
    nombre: string;
  }
  
  export interface User {
    name: string;
    email: string;
    image?: string; // Puede ser undefined
    id: string;
    roles: Role[];
  }