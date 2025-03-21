import { MedicamentosCE } from '@/interfaces/MedicamentosCe';
import { OrdenProcedimiento } from '@/interfaces/OrdenProcedimiento';
import { RecetaCabecera } from '@/interfaces/RecetaCabezeraI';
import { create } from 'zustand';

export const useEmergenciaDatosStore = create<any>((set, get) => ({
  datosemergencia: {
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
    idTipoAlta: "",
    idCondicionAlta: "",
    idMedicoEgreso: "",
    fechaEgreso: "",
    horaEgreso: "",
    diagnosticos: [],
    recetaCabezera: [] as RecetaCabecera[],
    recetaCabezeraProcedimientos: [],
    medicamentos: [] as MedicamentosCE[],
    ordenesPatologiaClinica: [] as any[],
    ordenesAnatomiaPatologica: [] as any[],
    ordenesBancoSangre: [] as any[],
    ordenesRayosX: [] as any[],
    ordenesTomografia: [] as any[],
    ordenesEcografiaGeneral: [] as any[],
    ordenesEcografiaObstetrica: [] as any[],
    atencionesEmergencia: {},
    ordenesLaboratorio: [],
    ordenesImagenes: [],
    ordenesOtros: [],
    ordenesProcedimiento: [] as OrdenProcedimiento[],
    atencionesDatosAdicionalesAlta: []
  },
  resetdatosemergencia: () => {
    set(() => ({
      datosemergencia: {
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
        idTipoAlta: "",
        idCondicionAlta: "",
        idMedicoEgreso: "",
        fechaEgreso: "",
        horaEgreso: "",
        diagnosticos: [],
        recetaCabezera: [] as RecetaCabecera[],
        recetaCabezeraProcedimientos: [],
        medicamentos: [] as MedicamentosCE[],
        ordenesPatologiaClinica: [] as any[],
        ordenesAnatomiaPatologica: [] as any[],
        ordenesBancoSangre: [] as any[],
        ordenesRayosX: [] as any[],
        ordenesTomografia: [] as any[],
        ordenesEcografiaGeneral: [] as any[],
        ordenesEcografiaObstetrica: [] as any[],
        atencionesEmergencia: {},
        ordenesLaboratorio: [],
        ordenesImagenes: [],
        ordenesOtros: [],
        ordenesProcedimiento: [] as OrdenProcedimiento[],
        atencionesDatosAdicionalesAlta: []
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




  setRecetaCabezeraProcedimientos: (newRecetaCabezeraProcedimientos: []) => set((state: any) => ({
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

  updateMedicamentos: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        medicamentos: state.datosemergencia.medicamentos.map((medicamento: MedicamentosCE) =>
          medicamento.idrecetacabecera === ""
            ? { ...medicamento, idrecetacabecera }
            : medicamento
        ),
      },
    }));
    const updatedMedicamentos = get().datosemergencia.medicamentos;
    return updatedMedicamentos;
  },


  limpiarMedicamento: () =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        medicamentos: []
      }
    })),

  limpiarordenesProcedimiento: () =>
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

  deleteRecetaCabecera: (idreceta: number) => set((state: any) => ({
    datosemergencia: {
      ...state.datosemergencia,
      recetaCabezera: state.datosemergencia.recetaCabezera.filter(
        (data: any) => data.idReceta !== idreceta
      ),
    },
  })),







  setIdAtencionv2: (newIdCuenta: any, newIdCuentaIdatencion: any, newIdPaciente: any, newhc: any, CitaMotivo: any, CitaExamenClinico: any, IdTipoSexo: any, CitaObservaciones: any) =>
    set((state: any) => ({
      datosemergencia: { ...state.datosemergencia, idatencion: newIdCuenta, idcuentaatencion: newIdCuentaIdatencion, idpaciente: newIdPaciente, NroHistoriaClinica: newhc, CitaMotivo, CitaExamenClinico, IdTipoSexo, CitaObservaciones }
    })),

  setIdAtencion: (newIdCuenta: any) =>
    set((state: any) => ({
      datosemergencia: { ...state.datosemergencia, idatencion: newIdCuenta }
    })),

  setAtencionMedica: (CitaMotivo: any, CitaExamenClinico: any) =>
    set((state: any) => ({
      datosemergencia: { ...state.datosemergencia, CitaMotivo, CitaExamenClinico }
    })),
  setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago: (newIdmedico: any, newIdServicio: any,
    newidFuenteFinanciamiento: any, newidFormaPago: any, newidPuntoCargaProcDentroConsultorio: any,
    newEdad: any, idCondicionMaterna: any, idDestinoAtencion: any, idProducto: any,
    idServicioEgreso: any, idTipoAlta: any, idCondicionAlta: any, idMedicoEgreso: any, fechaEgreso: any,
    horaEgreso: any
  ) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        idMedicoIngreso: newIdmedico,
        idServicio: newIdServicio,
        idFuenteFinanciamiento: newidFuenteFinanciamiento,
        idFormaPago: newidFormaPago,
        idPuntoCargaProcDentroConsultorio: newidPuntoCargaProcDentroConsultorio,
        edad: newEdad,
        idCondicionMaterna,
        idDestinoAtencion,
        idProducto,
        idServicioEgreso,
        idTipoAlta,
        idCondicionAlta,
        idMedicoEgreso,
        fechaEgreso,
        horaEgreso
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
  setDiagnosticoByCuenta: (IdDiagnostico: any, nomdx: any, codigoCIE10: any, idSubclasificacionDx: any, subClasificacion: any, labConfHIS: any = null, idClasificacionDx: any, idordenDx: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        diagnosticos: [...state.datosemergencia.diagnosticos, { IdDiagnostico, nomdx, codigoCIE10, idSubclasificacionDx, subClasificacion, labConfHIS, idClasificacionDx, idordenDx }]
      }
    })),
  setEliminarDiagnosticoByCuenta: (IdDiagnostico: any, idClasificacionDx: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        diagnosticos: state.datosemergencia.diagnosticos.filter(
          (diagnostico: any) =>
            diagnostico.IdDiagnostico !== IdDiagnostico ||
            diagnostico.idClasificacionDx !== idClasificacionDx
        )
      }
    })),




  createOrdenesPatologiaClinica: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesPatologiaClinica: [...state.datosemergencia.ordenesPatologiaClinica, { ...data }]
      }
    })),

  updateOrdenesPatologiaClinica: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesPatologiaClinica: state.datosemergencia.ordenesPatologiaClinica.map((data: any) =>
          data.idrecetacabecera === ""
            ? { ...data, idrecetacabecera }
            : data
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesPatologiaClinica;
    return updatedOrdenes;
  },

  deleteOrdenesPatologiaClinica: (idproducto: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesPatologiaClinica: state.datosemergencia.ordenesPatologiaClinica.filter(
          (data: any) => data.idproducto !== idproducto
        ),
      },
    })),


  createordenesAnatomiaPatologica: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesAnatomiaPatologica: [...state.datosemergencia.ordenesAnatomiaPatologica, { ...data }]
      }
    })),

  updateordenesAnatomiaPatologica: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesAnatomiaPatologica: state.datosemergencia.ordenesAnatomiaPatologica.map((data: any) =>
          data.idrecetacabecera === ""
            ? { ...data, idrecetacabecera }
            : data
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesAnatomiaPatologica;
    return updatedOrdenes;
  },


  deleteOrdenesAnatomiaPatologica: (idproducto: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesAnatomiaPatologica: state.datosemergencia.ordenesAnatomiaPatologica.filter(
          (data: any) => data.idproducto !== idproducto
        ),
      },
    })),

  createordenesBancoSangre: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesBancoSangre: [...state.datosemergencia.ordenesBancoSangre, { ...data }]
      }
    })),

  updateordenesBancoSangre: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesBancoSangre: state.datosemergencia.ordenesBancoSangre.map((data: any) =>
          data.idrecetacabecera === ""
            ? { ...data, idrecetacabecera }
            : data
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesBancoSangre;
    return updatedOrdenes;
  },


  deleteOrdenesBancoSangre: (idproducto: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesBancoSangre: state.datosemergencia.ordenesBancoSangre.filter(
          (data: any) => data.idproducto !== idproducto
        ),
      },
    })),

  createordenesRayosX: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesRayosX: [...state.datosemergencia.ordenesRayosX, { ...data }]
      }
    })),

  updateordenesRayosX: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesRayosX: state.datosemergencia.ordenesRayosX.map((data: any) =>
          data.idrecetacabecera === ""
            ? { ...data, idrecetacabecera }
            : data
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesRayosX;
    return updatedOrdenes;
  },


  deleteOrdenesRayosX: (idproducto: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesRayosX: state.datosemergencia.ordenesRayosX.filter(
          (data: any) => data.idproducto !== idproducto
        ),
      },
    })),



  createordenesTomografia: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesTomografia: [...state.datosemergencia.ordenesTomografia, { ...data }]
      }
    })),

  updateordenesTomografia: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesTomografia: state.datosemergencia.ordenesTomografia.map((data: any) =>
          data.idrecetacabecera === ""
            ? { ...data, idrecetacabecera }
            : data
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesTomografia;
    return updatedOrdenes;
  },


  deleteOrdenesTomografia: (idproducto: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesTomografia: state.datosemergencia.ordenesTomografia.filter(
          (data: any) => data.idproducto !== idproducto
        ),
      },
    })),



  createordenesEcografiaGeneral: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesEcografiaGeneral: [...state.datosemergencia.ordenesEcografiaGeneral, { ...data }]
      }
    })),

  updateordenesEcografiaGeneral: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesEcografiaGeneral: state.datosemergencia.ordenesEcografiaGeneral.map((data: any) =>
          data.idrecetacabecera === ""
            ? { ...data, idrecetacabecera }
            : data
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesEcografiaGeneral;
    return updatedOrdenes;
  },


  deleteOrdenesEcografiaGeneral: (idproducto: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesEcografiaGeneral: state.datosemergencia.ordenesEcografiaGeneral.filter(
          (data: any) => data.idproducto !== idproducto
        ),
      },
    })),



  createordenesEcografiaObstetrica: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesEcografiaObstetrica: [...state.datosemergencia.ordenesEcografiaObstetrica, { ...data }]
      }
    })),

  updateordenesEcografiaObstetrica: async (idrecetacabecera: any) => {
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesEcografiaObstetrica: state.datosemergencia.ordenesEcografiaObstetrica.map((data: any) =>
          data.idrecetacabecera === ""
            ? { ...data, idrecetacabecera }
            : data
        ),
      },
    }));
    const updatedOrdenes = get().datosemergencia.ordenesEcografiaObstetrica;
    return updatedOrdenes;
  },


  deleteordenesEcografiaObstetrica: (idproducto: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        ordenesEcografiaObstetrica: state.datosemergencia.ordenesEcografiaObstetrica.filter(
          (data: any) => data.idproducto !== idproducto
        ),
      },
    })),



  createatencionesEmergencia: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        atencionesEmergencia: { ...data }
      }
    })),
  createAtencionesDatosAdicionalesAlta: (data: any) =>
    set((state: any) => ({
      datosemergencia: {
        ...state.datosemergencia,
        atencionesDatosAdicionalesAlta: { ...data }
      }
    })),


    setDatosAltaMedica: (
      idDestinoAtencion: any,idTipoAlta:any,idCondicionAlta:any,fechaEgreso:any,
      horaEgreso:any,idMedicoEgreso:any,Pronostico:any,RecomendacionesyTratamiento:any,
      enfermedadActual:any
    ) =>
      set((state: any) => ({
        datosemergencia: { 
          ...state.datosemergencia, 
          idDestinoAtencion,
          idTipoAlta,
          idCondicionAlta,
          fechaEgreso,
          horaEgreso,
          idMedicoEgreso,
          atencionesDatosAdicionalesAlta : {
            pronostico:Pronostico,
            recomendacionesyTratamiento:RecomendacionesyTratamiento,
            enfermedadActual:enfermedadActual
          }
         }
      })),

}));
