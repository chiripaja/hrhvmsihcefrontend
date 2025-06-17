import { MedicamentosCE } from '@/interfaces/MedicamentosCe';
import { OrdenProcedimiento } from '@/interfaces/OrdenProcedimiento';
import { RecetaCabecera } from '@/interfaces/RecetaCabezeraI';
import { create } from 'zustand';

export const useCEDatosStore = create<any>((set, get) => ({
  datosce: {
    CitaObservaciones: "",
    IdTipoSexo: "",
    idatencion: "",
    idpaciente: "",
    idcuentaatencion: "",
    idMedicoIngreso: "",
    idServicio: "",
    edad: "",
    NroHistoriaClinica: "",
    idFuenteFinanciamiento: "",
    idFormaPago: "",
    idDestinoAtencion: "",
    idCondicionMaterna: "",
    idPuntoCargaProcDentroConsultorio: "",
    CitaMotivo: "",
    CitaExamenClinico: "",
    AfiliacionDisa: "",
    AfiliacionNroFormato: "",
    AfiliacionTipoFormato: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    PrimerNombre: "",
    Onombre: "",
    FechaEgreso: "",
    CodigoEstablAdscripcion: "",
    FuaCodigoPrestacion: "",
    NroReferenciaOrigen: "",
    MedicoColegitura: "",
    MedicoDni: "",
    MedicoMaterno: "",
    MedicoNombres: "",
    MedicoPaterno: "",
    idColegioHIS: "",
    Afiliacioncodigosiasis: "",
    idSiasis: "",
    FechaNacimiento_formateada: "",
    IdDocIdentidad: "",
    nroDocumento: "",
    MedicoDocumentoTipo: "",
    codigoServicioFUA: "",
    FuaNumero:"",
    diagnosticos: [],
    recetaCabezera: [] as RecetaCabecera[],
    recetaCabezeraProcedimientos: [],
    medicamentos: [] as MedicamentosCE[],
    ordenesLaboratorio: [],
    ordenesImagenes: [],
    ordenesOtros: [],
    ordenesProcedimiento: [] as OrdenProcedimiento[],
  },
  resetDatosCE: () => {
    set(() => ({
      datosce: {
        CitaObservaciones: "",
        IdTipoSexo: "",
        idatencion: "",
        idpaciente: "",
        idcuentaatencion: "",
        idMedicoIngreso: "",
        idServicio: "",
        edad: "",
        NroHistoriaClinica: "",
        idFuenteFinanciamiento: "",
        idFormaPago: "",
        idDestinoAtencion: "",
        idCondicionMaterna: "",
        idPuntoCargaProcDentroConsultorio: "",
        CitaMotivo: "",
        CitaExamenClinico: "",
        AfiliacionDisa: "",
        AfiliacionNroFormato: "",
        AfiliacionTipoFormato: "",
        ApellidoPaterno: "",
        ApellidoMaterno: "",
        PrimerNombre: "",
        Onombre: "",
        FechaEgreso: "",
        CodigoEstablAdscripcion: "",
        FuaCodigoPrestacion: "",
        NroReferenciaOrigen: "",
        MedicoColegitura: "",
        MedicoDni: "",
        MedicoMaterno: "",
        MedicoNombres: "",
        MedicoPaterno: "",
        idColegioHIS: "",
        Afiliacioncodigosiasis: "",
        idSiasis: "",
        FechaNacimiento_formateada: "",
        IdDocIdentidad: "",
        nroDocumento: "",
        MedicoDocumentoTipo: "",
        codigoServicioFUA: "",
        FuaNumero:"",
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
      const ordenesProcedimiento = state.datosce.ordenesProcedimiento;

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
        datosce: {
          ...state.datosce,
          ordenesProcedimiento: updatedOrdenesProcedimiento,
        },
      };
    });

    // Acceso seguro al estado actualizado
    const updatedOrdenes = get()?.datosce?.ordenesProcedimiento ?? [];
    return updatedOrdenes;
  },




  setRecetaCabezeraProcedimientos: (newRecetaCabezeraProcedimientos: []) => set((state: any) => ({
    datosce: {
      ...state.datosce,
      recetaCabezeraProcedimientos: newRecetaCabezeraProcedimientos,
    }
  })),

  createordenesProcedimiento: (newordenesProcedimiento: any) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesProcedimiento: [...state.datosce.ordenesProcedimiento, { ...newordenesProcedimiento }]
      }
    })),

  deleteordenesProcedimiento: (idproducto: number) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesProcedimiento: state.datosce.ordenesProcedimiento.filter(
          (data: any) => data.idProducto !== idproducto
        ),
      },
    })),

  createordenesOtros: (newOrdenesOtros: any) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesOtros: [...state.datosce.ordenesOtros, { ...newOrdenesOtros }]
      }
    })),

  deleteordenesOtros: (idproducto: number) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesOtros: state.datosce.ordenesOtros.filter(
          (data: any) => data.idProducto !== idproducto
        ),
      },
    })),

  createordenesLaboratorio: (newOrdenesLaboratorio: any) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesLaboratorio: [...state.datosce.ordenesLaboratorio, { ...newOrdenesLaboratorio }]
      }
    })),


  deleteLaboratorio: (idproducto: number, puntocarga: any) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesLaboratorio: state.datosce.ordenesLaboratorio.filter(
          (data: any) => !(data.idproducto === idproducto && data.puntoCarga === puntocarga)
        ),
      },
    })),

  updateOrdenesLaboratorio: async (idrecetacabecera: any, puntocarga: any) => {
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesLaboratorio: state.datosce.ordenesLaboratorio.map((medicamento: any) =>
          medicamento.puntoCarga == puntocarga
            ? { ...medicamento, idrecetacabecera } //
            : medicamento
        ),
      },
    }));
    const updatedOrdenes = get().datosce.ordenesLaboratorio;
    return updatedOrdenes;
  },

  createOrdenesImagenes: (newOrdenesImagenes: any) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesImagenes: [...state.datosce.ordenesImagenes, { ...newOrdenesImagenes }]
      }
    })),


  deleteImagenes: (idproducto: number, puntocarga: any) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesImagenes: state.datosce.ordenesImagenes.filter(
          (data: any) => !(data.idproducto === idproducto && data.puntoCarga === puntocarga)
        ),
      },
    })),

  updateOrdenesImagenes: async (idrecetacabecera: any, puntocarga: any) => {
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesImagenes: state.datosce.ordenesImagenes.map((medicamento: any) =>
          medicamento.puntoCarga == puntocarga
            ? { ...medicamento, idrecetacabecera } //
            : medicamento
        ),
      },
    }));
    const updatedOrdenes = get().datosce.ordenesImagenes;
    return updatedOrdenes;
  },
  createMedicamento: (nuevoMedicamento: MedicamentosCE) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        medicamentos: [...state.datosce.medicamentos, { ...nuevoMedicamento }]
      }
    })),
  limpiarMedicamento: () =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        medicamentos: []
      }
    })),

  limpiarordenesProcedimiento: () =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        ordenesProcedimiento: []
      }
    })),


  deleteMedicamento: (idproducto: number) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        medicamentos: state.datosce.medicamentos.filter(
          (medicamento: MedicamentosCE) => medicamento.idproducto !== idproducto
        ),
      },
    })),





  updateMedicamentos: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        medicamentos: state.datosce.medicamentos.map((medicamento: MedicamentosCE) => ({
          ...medicamento,
          idrecetacabecera,
        })),
      },
    }));
    const updatedMedicamentos = get().datosce.medicamentos;
    return updatedMedicamentos;
  },

  setIdAtencionv2: (newIdCuenta: any, newIdCuentaIdatencion: any, newIdPaciente: any,
    newhc: any, CitaMotivo: any, CitaExamenClinico: any, IdTipoSexo: any, CitaObservaciones: any,
    AfiliacionDisa: any, AfiliacionNroFormato: any, AfiliacionTipoFormato: any,
    ApellidoPaterno: any, ApellidoMaterno: any, PrimerNombre: any, Onombre: any, FechaEgreso: any, CodigoEstablAdscripcion: any
    , FuaCodigoPrestacion: any, NroReferenciaOrigen: any,
    MedicoColegitura: any, MedicoDni: any, MedicoMaterno: any, MedicoNombres: any, MedicoPaterno: any, idColegioHIS: any, Afiliacioncodigosiasis: any
    , idSiasis: any, FechaNacimiento_formateada: any, IdDocIdentidad: any, nroDocumento: any, MedicoDocumentoTipo: any, codigoServicioFUA: any,
    FuaNumero:any
  ) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce, idatencion: newIdCuenta, idcuentaatencion: newIdCuentaIdatencion, idpaciente: newIdPaciente, NroHistoriaClinica: newhc, CitaMotivo, CitaExamenClinico, IdTipoSexo, CitaObservaciones,
        AfiliacionDisa, AfiliacionNroFormato, AfiliacionTipoFormato,
        ApellidoPaterno, ApellidoMaterno, PrimerNombre, Onombre, FechaEgreso, CodigoEstablAdscripcion
        , FuaCodigoPrestacion, NroReferenciaOrigen
        , MedicoColegitura, MedicoDni, MedicoMaterno, MedicoNombres, MedicoPaterno, idColegioHIS, Afiliacioncodigosiasis, idSiasis,
        FechaNacimiento_formateada, IdDocIdentidad, nroDocumento, MedicoDocumentoTipo, codigoServicioFUA,FuaNumero
      }
    })),

  setIdAtencion: (newIdCuenta: any) =>
    set((state: any) => ({
      datosce: { ...state.datosce, idatencion: newIdCuenta }
    })),

  setAtencionMedica: (CitaMotivo: any, CitaExamenClinico: any) =>
    set((state: any) => ({
      datosce: { ...state.datosce, CitaMotivo, CitaExamenClinico }
    })),
  setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago: (newIdmedico: any, newIdServicio: any, newidFuenteFinanciamiento: any, newidFormaPago: any, newidPuntoCargaProcDentroConsultorio: any, newEdad: any, idCondicionMaterna: any, idDestinoAtencion: any) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        idMedicoIngreso: newIdmedico,
        idServicio: newIdServicio,
        idFuenteFinanciamiento: newidFuenteFinanciamiento,
        idFormaPago: newidFormaPago,
        idPuntoCargaProcDentroConsultorio: newidPuntoCargaProcDentroConsultorio,
        edad: newEdad,
        idCondicionMaterna,
        idDestinoAtencion
      }
    })),
  setIdCuentaAtencion: (newIdCuentaAtencion: any) =>
    set((state: any) => ({
      datosce: { ...state.datosce, idcuentaatencion: newIdCuentaAtencion }
    })),
  setIdpaciente: (newpaciente: any) =>
    set((state: any) => ({
      datosce: { ...state.datosce, idpaciente: newpaciente }
    })),
  setRecetaCabezera: (newRecetaCabezera: RecetaCabecera[]) => set((state: any) => ({
    datosce: {
      ...state.datosce,
      recetaCabezera: newRecetaCabezera,
    }
  })),
  setDiagnosticoByCuenta: (IdDiagnostico: any, nomdx: any, codigoCIE10: any, idSubclasificacionDx: any, subClasificacion: any, labConfHIS: any = null) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        diagnosticos: [...state.datosce.diagnosticos, { IdDiagnostico, nomdx, codigoCIE10, idSubclasificacionDx, subClasificacion, labConfHIS }]
      }
    })),
  setEliminarDiagnosticoByCuenta: (IdDiagnostico: any) =>
    set((state: any) => ({
      datosce: {
        ...state.datosce,
        diagnosticos: state.datosce.diagnosticos.filter(
          (diagnostico: any) => diagnostico.IdDiagnostico !== IdDiagnostico
        )
      }
    }))


}));
