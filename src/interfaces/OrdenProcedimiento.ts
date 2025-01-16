export interface OrdenProcedimiento {
    idOrden: number; // ID de la orden
    idProducto: number; // ID del producto asociado
    cantidad: string; // Cantidad en formato string
    precio: number; // Precio como número
    total: string; // Total en formato string (siempre puedes convertirlo a número si necesario)
    idUsuario: string; // ID del usuario en formato string
    idDiagnostico: number; // ID del diagnóstico asociado
    idFuenteFinanciamiento: number; // ID de la fuente de financiamiento
    idTipoFinanciamiento: number; // ID del tipo de financiamiento
    nombreproc: string; // Nombre del procedimiento
  }