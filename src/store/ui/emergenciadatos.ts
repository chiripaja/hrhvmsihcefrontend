import { MedicamentosCE } from '@/interfaces/MedicamentosCe';
import { OrdenProcedimiento } from '@/interfaces/OrdenProcedimiento';
import { RecetaCabecera } from '@/interfaces/RecetaCabezeraI';
import { create } from 'zustand';

export const useEmergenciaDatosStore = create<any>((set, get) => ({
  datosemergencia: {
    CitaObservaciones:"",
    IdTipoSexo:"",
    idatencion: "",
    idpaciente: "",
    idcuentaatencion: "",
    idMedicoIngreso: "",
    idServicio: "",
    edad:"",
    NroHistoriaClinica:"",
    idFuenteFinanciamiento: "",
    idFormaPago: "",
    idDestinoAtencion:"",
    idCondicionMaterna:"",
    idPuntoCargaProcDentroConsultorio: "",
    diagnosticos: [],
    recetaCabezera: [] as RecetaCabecera[],
    recetaCabezeraProcedimientos: [],
    medicamentos: [] as MedicamentosCE[],
    ordenesLaboratorio: [],
    ordenesImagenes: [],
    ordenesOtros: [],
    ordenesProcedimiento: [] as OrdenProcedimiento[],
  },
  resetdatosemergencia: () => {
    set(() => ({
      datosemergencia: {
        CitaObservaciones:"",
        IdTipoSexo:"",
        idatencion: "",
        idpaciente: "",
        idcuentaatencion: "",
        idMedicoIngreso: "",
        idServicio: "",
        edad:"",
        NroHistoriaClinica:"",
        idFuenteFinanciamiento: "",
        idFormaPago: "",
        idDestinoAtencion:"",
        idCondicionMaterna:"",
        idPuntoCargaProcDentroConsultorio: "",
        CitaMotivo:"",
        CitaExamenClinico:"",
        diagnosticos: [],
        recetaCabezera: [] as RecetaCabecera[],
        recetaCabezeraProcedimientos: [],
        medicamentos: [] as MedicamentosCE[],
        ordenesLaboratorio: [],
        ordenesImagenes: [],
        ordenesOtros: [],
        ordenesProcedimiento: [] as OrdenProcedimiento[],
      },
      
    }));
  
  },

  updateProcedimientosIdOrden: (idOrden: number) => {
    set((state: any) => {
      const ordenesProcedimiento = state.datosemergencia.ordenesProcedimiento;
  
      // Validar si ordenesProcedimiento es un array
      if (!Array.isArray(ordenesProcedimiento)) {
        console.error("ordenesProcedimiento no es un array");
        return state;
      }
  
      // Actualizar idOrden en cada procedimiento
      const updatedOrdenesProcedimiento = ordenesProcedimiento.map(
        (orden: OrdenProcedimiento) => ({
          ...orden,
          idOrden,
        })
      );
  
      return {
        datosemergencia: {
          ...state.datosemergencia,
          ordenesProcedimiento: updatedOrdenesProcedimiento,
        },
      };
    });
  
    // Acceso seguro al estado actualizado
    const updatedOrdenes = get()?.datosemergencia?.ordenesProcedimiento ?? [];
    return updatedOrdenes;
  },




  setRecetaCabezeraProcedimientos: (newRecetaCabezeraProcedimientos:[]) => set((state: any) => ({
    datosemergencia: {
      ...state.datosemergencia,
      recetaCabezeraProcedimientos: newRecetaCabezeraProcedimientos,
    }
  })),

  createordenesProcedimiento: (newordenesProcedimiento: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesProcedimiento: [...state.datosemergencia.ordenesProcedimiento, { ...newordenesProcedimiento }]
      }
    })),

  deleteordenesProcedimiento: (idproducto: number) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesProcedimiento: state.datosemergencia.ordenesProcedimiento.filter(
          (data: any) => data.idProducto !== idproducto
        ),
      },
    })),

  createordenesOtros: (newOrdenesOtros: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesOtros: [...state.datosemergencia.ordenesOtros, { ...newOrdenesOtros }]
      }
    })),

  deleteordenesOtros: (idproducto: number) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesOtros: state.datosemergencia.ordenesOtros.filter(
          (data: any) => data.idProducto !== idproducto
        ),
      },
    })),

  createordenesLaboratorio: (newOrdenesLaboratorio: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesLaboratorio: [...state.datosemergencia.ordenesLaboratorio, { ...newOrdenesLaboratorio }]
      }
    })),


  deleteLaboratorio: (idproducto: number, puntocarga: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesLaboratorio: state.datosemergencia.ordenesLaboratorio.filter(
          (data: any) => !(data.idproducto === idproducto && data.puntoCarga === puntocarga)
        ),
      },
    })),

  updateOrdenesLaboratorio: async (idrecetacabecera: any, puntocarga: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesLaboratorio: state.datosemergencia.ordenesLaboratorio.map((medicamento: any) =>
          medicamento.puntoCarga == puntocarga
            ? { ...medicamento, idrecetacabecera } //
            : medicamento
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesLaboratorio;
    return updatedOrdenes;
  },

  createOrdenesImagenes: (newOrdenesImagenes: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesImagenes: [...state.datosemergencia.ordenesImagenes, { ...newOrdenesImagenes }]
      }
    })),


  deleteImagenes: (idproducto: number, puntocarga: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesImagenes: state.datosemergencia.ordenesImagenes.filter(
          (data: any) => !(data.idproducto === idproducto && data.puntoCarga === puntocarga)
        ),
      },
    })),

  updateOrdenesImagenes: async (idrecetacabecera: any, puntocarga: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesImagenes: state.datosemergencia.ordenesImagenes.map((medicamento: any) =>
          medicamento.puntoCarga == puntocarga
            ? { ...medicamento, idrecetacabecera } //
            : medicamento
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesImagenes;
    return updatedOrdenes;
  },
  createMedicamento: (nuevoMedicamento: MedicamentosCE) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        medicamentos: [...state.datosemergencia.medicamentos, { ...nuevoMedicamento }]
      }
    })),
  limpiarMedicamento:() =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        medicamentos: []
      }
    })),

    limpiarordenesProcedimiento:() =>
      set((state: any) => ({
        datosemergencia: {
          ...state.datosemergencia,
          ordenesProcedimiento: []
        }
      })),  


  deleteMedicamento: (idproducto: number) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        medicamentos: state.datosemergencia.medicamentos.filter(
          (medicamento: MedicamentosCE) => medicamento.idproducto !== idproducto
        ),
      },
    })),





  updateMedicamentos: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        medicamentos: state.datosemergencia.medicamentos.map((medicamento: MedicamentosCE) => ({
          ...medicamento,
          idrecetacabecera,
        })),
      },
    }));
    const updatedMedicamentos = get().datosemergencia.medicamentos;
    return updatedMedicamentos;
  },

  setIdAtencionv2: (newIdCuenta: any,newIdCuentaIdatencion:any,newIdPaciente:any,newhc:any,CitaMotivo:any,CitaExamenClinico:any,IdTipoSexo:any,CitaObservaciones:any) =>
    set((state: any) => ({
      datosemergencia: { ...state.datosemergencia, idatencion: newIdCuenta,idcuentaatencion:newIdCuentaIdatencion,idpaciente:newIdPaciente,NroHistoriaClinica:newhc,CitaMotivo,CitaExamenClinico,IdTipoSexo,CitaObservaciones }
    })),

  setIdAtencion: (newIdCuenta: any) =>
    set((state: any) => ({
      datosemergencia: { ...state.datosemergencia, idatencion: newIdCuenta }
    })),

    setAtencionMedica: (CitaMotivo: any,CitaExamenClinico: any) =>
      set((state: any) => ({
        datosemergencia: { ...state.datosemergencia,CitaMotivo,CitaExamenClinico }
      })),  
  setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago: (newIdmedico: any, newIdServicio: any, newidFuenteFinanciamiento: any, newidFormaPago: any, newidPuntoCargaProcDentroConsultorio: any,newEdad:any,idCondicionMaterna:any,idDestinoAtencion:any,idProducto:any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        idMedicoIngreso: newIdmedico,
        idServicio: newIdServicio,
        idFuenteFinanciamiento: newidFuenteFinanciamiento,
        idFormaPago: newidFormaPago,
        idPuntoCargaProcDentroConsultorio: newidPuntoCargaProcDentroConsultorio,
        edad:newEdad,
        idCondicionMaterna,
        idDestinoAtencion,
        idProducto
      }
    })),
  setIdCuentaAtencion: (newIdCuentaAtencion: any) =>
    set((state: any) => ({
      datosemergencia: { ...state.datosemergencia, idcuentaatencion: newIdCuentaAtencion }
    })),
  setIdpaciente: (newpaciente: any) =>
    set((state: any) => ({
      datosemergencia: { ...state.datosemergencia, idpaciente: newpaciente }
    })),
  setRecetaCabezera: (newRecetaCabezera: RecetaCabecera[]) => set((state: any) => ({
    datosemergencia: {
      ...state.datosemergencia,
      recetaCabezera: newRecetaCabezera,
    }
  })),
  setDiagnosticoByCuenta: (IdDiagnostico: any, nomdx: any,codigoCIE10:any, idSubclasificacionDx: any, subClasificacion: any, labConfHIS: any = null,idClasificacionDx:any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        diagnosticos: [...state.datosemergencia.diagnosticos, { IdDiagnostico, nomdx,codigoCIE10, idSubclasificacionDx, subClasificacion, labConfHIS,idClasificacionDx }]
      }
    })),
  setEliminarDiagnosticoByCuenta: (IdDiagnostico: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        diagnosticos: state.datosemergencia.diagnosticos.filter(
          (diagnostico: any) => diagnostico.IdDiagnostico !== IdDiagnostico
        )
      }
    }))


}));
