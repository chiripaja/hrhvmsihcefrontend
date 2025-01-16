export interface RecetaCabecera {
    fechaVigencia: string; 
    idEstado: number; 
    DocumentoDespacho: string | null; 
    IdPuntoCarga: number; 
    idCuentaAtencion: number;
    idComprobantePago: string | null;
    idMedicoReceta: number; 
    idServicioReceta: number; 
    idReceta: number; 
    FechaReceta: string;
  }