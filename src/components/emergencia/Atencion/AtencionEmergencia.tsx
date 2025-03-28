'use client'
import { useEffect, useState } from "react";
import { CabeceraEmergencia } from "./CabeceraEmergencia"
import { TriajeBusqueda } from "@/components/Triaje/TriajeBusqueda";
import { Anamnesis } from "./Anamnesis/Anamnesis";
import { CEConsultaGeneral } from "@/components/ConsultaExterna";

import { useEmergenciaDatosStore } from "@/store/ui/emergenciadatos";
import axios from "axios";
import { getData } from "@/components/helper/axiosHelper";
import { Transferencias } from "./Transferencias/Transferencias";
import { DiagnosticoIngreso } from "./Diagnostico/DiagnosticoIngreso";
import { Ordenes } from "./Ordenes/Ordenes";
import { MedicamentosCE } from "@/interfaces/MedicamentosCe";
import { RecetaCabecera } from "@/interfaces/RecetaCabezeraI";
import { AtencionMedica } from "./AtencionMedica/AtencionMedica";
import { TriajeDif } from "@/components/TriajeDiferenciado/TriajeDif";
export const AtencionEmergencia = ({ session, idcuentaatencion }: any) => {

  const [activeTab, setActiveTab] = useState(1);
  const emergenciaCuentaDatos = useEmergenciaDatosStore((state: any) => state.datosemergencia)
  const setIdAtencionv2 = useEmergenciaDatosStore((state: any) => state.setIdAtencionv2);
  const setDiagnosticoByCuenta = useEmergenciaDatosStore((state: any) => state.setDiagnosticoByCuenta);
  const setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago = useEmergenciaDatosStore((state: any) => state.setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago);
  const [datosAtencion, setDatosAtencion] = useState<any>();
  const resetdatosemergencia = useEmergenciaDatosStore((state: any) => state.resetdatosemergencia);
  const createMedicamento = useEmergenciaDatosStore((state: any) => state.createMedicamento);
  const [procesado, setProcesado] = useState(false);
  const setRecetaCabezera = useEmergenciaDatosStore((state: any) => state.setRecetaCabezera);
  const setRecetaCabezeraProcedimientos = useEmergenciaDatosStore((state: any) => state.setRecetaCabezeraProcedimientos);
  const [recetaUpdateValidador, setrecetaUpdateValidador] = useState<any>()
  const createordenesOtros = useEmergenciaDatosStore((state: any) => state.createordenesOtros);
  const createOrdenesPatologiaClinica = useEmergenciaDatosStore((state: any) => state.createOrdenesPatologiaClinica);
  const createordenesAnatomiaPatologica = useEmergenciaDatosStore((state: any) => state.createordenesAnatomiaPatologica);
  const createordenesBancoSangre = useEmergenciaDatosStore((state: any) => state.createordenesBancoSangre);
  const createordenesRayosX = useEmergenciaDatosStore((state: any) => state.createordenesRayosX);
  const createordenesTomografia = useEmergenciaDatosStore((state: any) => state.createordenesTomografia);
  const createordenesEcografiaGeneral = useEmergenciaDatosStore((state: any) => state.createordenesEcografiaGeneral);
  const createordenesEcografiaObstetrica = useEmergenciaDatosStore((state: any) => state.createordenesEcografiaObstetrica);
  const createordenesProcedimiento = useEmergenciaDatosStore((state: any) => state.createordenesProcedimiento);

  const createatencionesEmergencia = useEmergenciaDatosStore((state: any) => state.createatencionesEmergencia);

  const limpiarordenesProcedimiento = useEmergenciaDatosStore((state: any) => state.limpiarordenesProcedimiento)
  const createAtencionesDatosAdicionalesAlta = useEmergenciaDatosStore((state: any) => state.createAtencionesDatosAdicionalesAlta)
  const getDatos = async () => {
    try {
      const { data } = await axios.get(`${process.env.apijimmynew}/atenciones/${idcuentaatencion}`);
      setIdAtencionv2(
        data?.idAtencion,
        data?.idCuentaAtencion,
        data?.idPaciente,
        data?.NroHistoriaClinica,
        data?.CitaMotivo,
        data?.CitaExamenClinico,
        data?.IdTipoSexo,
        data?.CitaObservaciones
      )

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.error("Recurso no encontrado (404)");

      } else {
        console.error("Ocurrió un error inesperado", error);
      }
    }
  }
  const getDatosConsulta = async () => {
    try {
      const datosAtencion = await getData(`${process.env.apijimmynew}/atenciones/findByIdCuentaAtencion/${idcuentaatencion}`);

      setDatosAtencion(datosAtencion)
      createatencionesEmergencia(datosAtencion?.atencionesEmergencia)

      createAtencionesDatosAdicionalesAlta(datosAtencion?.atencionesDatosAdicionalesAlta)
      setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago(
        datosAtencion?.idMedicoIngreso, datosAtencion?.servicio?.idServicio,
        datosAtencion?.idFuenteFinanciamiento, datosAtencion?.idFormaPago,
        datosAtencion?.servicio?.factPuntosCarga?.idPuntoCarga, datosAtencion?.edad,
        datosAtencion?.idCondicionMaterna, datosAtencion?.idDestinoAtencion,
        datosAtencion?.servicio?.idProducto, datosAtencion?.idServicioEgreso,
        datosAtencion?.idTipoAlta, datosAtencion?.idCondicionAlta,
        datosAtencion?.idMedicoEgreso, datosAtencion?.fechaEgreso, datosAtencion?.horaEgreso
      )
      if (Array.isArray(datosAtencion.atencionesDiagnosticos)) {
        datosAtencion.atencionesDiagnosticos.map((data: any) => {
          setDiagnosticoByCuenta(
            data.diagnostico.idDiagnostico,
            data.diagnostico.codigoCIE10 + ' - ' + data.diagnostico.descripcion,
            data.diagnostico.codigoCIE10,
            data.idSubclasificacionDx,
            data.subclasificacionDiagnosticos?.descripcion,
            data.labConfHIS,
            data.idClasificacionDx,
            data.idordenDx
          );
        });
      } else {
        console.error("datosAtencion.atencionesDiagnosticos no es un array");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const getOtros = async (idcuenta: any) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/ApiObtenerProcedimientosPorCuenta/${idcuenta}`)
      data.map((datos: any) => {
        createordenesOtros(datos);
      })

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    const ejecutarFunciones = async () => {
      await resetdatosemergencia();
      if (idcuentaatencion) {
        await getDatos();
        await getDatosRecetaCabecera();
        await getOtros(idcuentaatencion);
        await getDatosConsulta();
      }
    }
    ejecutarFunciones();
  }, [])

  //cabecera
  const getDatosRecetaCabecera = async () => {
    try {
      const DatosRecetaCabecera: RecetaCabecera[] = await getData(`${process.env.apijimmynew}/recetas/findRecetaCabezeraByIdCuentaAtencion/${idcuentaatencion}`)
      const DatosRecetaCabeceraProcedimientos: [] = await getData(`${process.env.apijimmynew}/recetas/FactOrdenServicioSeleccionarPorIdCuenta/${idcuentaatencion}`)
      if (DatosRecetaCabeceraProcedimientos.length > 0) {
        const FiltadorDatosRecetaCabeceraProcedimientos = DatosRecetaCabeceraProcedimientos.filter((data: any) => data.IdPuntoCarga == 1);
        FiltadorDatosRecetaCabeceraProcedimientos.length > 0 && setRecetaCabezeraProcedimientos(FiltadorDatosRecetaCabeceraProcedimientos)
      }

      setrecetaUpdateValidador(DatosRecetaCabecera)
      DatosRecetaCabecera.length > 0 && setRecetaCabezera(DatosRecetaCabecera);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }



  //farmacia
  const getMedicamentosbyIdRecetaCabeceraFarmacia = async (idrecetacabecera: number, idFormaPago: number) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdReceta/${idrecetacabecera}/${idFormaPago}/8`)
      data.forEach((info: MedicamentosCE) => {
        createMedicamento(info);
      });
    } catch (error) {
      console.log(error)
    }
  }

  const getPatologiaClinicaOrdenes = async (idrecetacabecera: number, idFormaPago: number) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdRecetaServicios/${idrecetacabecera}/${idFormaPago}`)

      data.map((info: MedicamentosCE) => {
        createOrdenesPatologiaClinica(info)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getAnatomiaPatologicaOrdenes = async (idrecetacabecera: number, idFormaPago: number) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdRecetaServicios/${idrecetacabecera}/${idFormaPago}`)

      data.map((info: MedicamentosCE) => {
        createordenesAnatomiaPatologica(info)
      })
    } catch (error) {
      console.log(error)
    }
  }



  const getBancoSangreOrdenes = async (idrecetacabecera: number, idFormaPago: number) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdRecetaServicios/${idrecetacabecera}/${idFormaPago}`)

      data.map((info: MedicamentosCE) => {
        createordenesBancoSangre(info)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getDatosImagenes = async (idrecetacabecera: number, idFormaPago: number, idpuntoCarga: number) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdRecetaServicios/${idrecetacabecera}/${idFormaPago}`)
      switch (idpuntoCarga) {
        case 21:
          data.map((info: MedicamentosCE) => {
            createordenesRayosX(info)
          })
          break;
        case 22:
          data.map((info: MedicamentosCE) => {
            createordenesTomografia(info)
          })
          break;
        case 20:
          data.map((info: MedicamentosCE) => {
            createordenesEcografiaGeneral(info)
          })
          break;
        case 23:
          data.map((info: MedicamentosCE) => {
            createordenesEcografiaObstetrica(info)
          })
          break;
        default:
          console.log("No encontro punto de carga.");
      }




    } catch (error) {
      console.log(error)
    }
  }
  const getOrdenesProcedimientosByIdOrden = async (idorden: number) => {
    try {
      limpiarordenesProcedimiento()
      const data = await getData(`${process.env.apijimmynew}/recetas/ApiObtenerDetallesFacturacionProcedimientos/${idorden}`)
      data.map((info: any) => {
        createordenesProcedimiento(info)
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (emergenciaCuentaDatos?.recetaCabezeraProcedimientos[0]?.IdOrden) {
      getOrdenesProcedimientosByIdOrden(emergenciaCuentaDatos?.recetaCabezeraProcedimientos[0]?.IdOrden)
    }
  }, [emergenciaCuentaDatos?.recetaCabezeraProcedimientos])
  useEffect(() => {
    const ejecutarFunciones = async () => {

      if (emergenciaCuentaDatos?.recetaCabezera.length > 0) {
        const recetaCabezera = emergenciaCuentaDatos?.recetaCabezera || [];
        const RecetaCabezeraFarmacia = recetaCabezera.filter(
          (data: RecetaCabecera) => data.IdPuntoCarga === 5
        );

        const RecetaCabezeraPatologiaClinica = recetaCabezera.filter(
          (data: RecetaCabecera) => data.IdPuntoCarga === 2
        );


        RecetaCabezeraFarmacia.map((data: any) => {
          if (emergenciaCuentaDatos?.idFormaPago) {
            getMedicamentosbyIdRecetaCabeceraFarmacia(
              data?.idReceta,
              emergenciaCuentaDatos.idFormaPago
            );
          }
        })

        RecetaCabezeraPatologiaClinica.map((data: any) => {
          if (emergenciaCuentaDatos?.idFormaPago) {
            getPatologiaClinicaOrdenes(
              data?.idReceta,
              emergenciaCuentaDatos.idFormaPago
            );
          }
        })
        recetaCabezera.filter((data: RecetaCabecera) => data.IdPuntoCarga === 3).map((data: any) => {
          if (emergenciaCuentaDatos?.idFormaPago) {
            getAnatomiaPatologicaOrdenes(
              data?.idReceta,
              emergenciaCuentaDatos.idFormaPago
            );
          }
        })

        recetaCabezera.filter((data: RecetaCabecera) => data.IdPuntoCarga === 11).map((data: any) => {
          if (emergenciaCuentaDatos?.idFormaPago) {
            getBancoSangreOrdenes(
              data?.idReceta,
              emergenciaCuentaDatos.idFormaPago
            );
          }
        })

        recetaCabezera.filter((data: RecetaCabecera) => data.IdPuntoCarga === 21).map((data: any) => {
          if (emergenciaCuentaDatos?.idFormaPago) {
            getDatosImagenes(
              data?.idReceta,
              emergenciaCuentaDatos.idFormaPago,
              21
            );
          }
        })

        recetaCabezera.filter((data: RecetaCabecera) => data.IdPuntoCarga === 20).map((data: any) => {
          if (emergenciaCuentaDatos?.idFormaPago) {
            getDatosImagenes(
              data?.idReceta,
              emergenciaCuentaDatos.idFormaPago,
              20
            );
          }
        })

        recetaCabezera.filter((data: RecetaCabecera) => data.IdPuntoCarga === 22).map((data: any) => {
          if (emergenciaCuentaDatos?.idFormaPago) {
            getDatosImagenes(
              data?.idReceta,
              emergenciaCuentaDatos.idFormaPago,
              22
            );
          }
        })

        recetaCabezera.filter((data: RecetaCabecera) => data.IdPuntoCarga === 23).map((data: any) => {
          if (emergenciaCuentaDatos?.idFormaPago) {
            getDatosImagenes(
              data?.idReceta,
              emergenciaCuentaDatos.idFormaPago,
              23
            );
          }
        })


      }



    };
    ejecutarFunciones();
  }, [emergenciaCuentaDatos?.idFormaPago]);
  if (!emergenciaCuentaDatos?.idFormaPago) return <div className="flex justify-center items-center h-screen">
    <div className="rounded-full h-20 w-20 bg-blue-600 animate-ping"></div>
  </div>;
  return (
    <>


      <CabeceraEmergencia idcuentaatencion={idcuentaatencion} />
      <div className="p-4">
        {/* Contenedor de los Tabs */}
        <div className="flex border-b">
          {/* Tab 1 */}
          <button
            className={`py-2 px-4 text-sm font-semibold ${activeTab === 1 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              } focus:outline-none`}
            onClick={() => setActiveTab(1)}
          >
            Triaje
          </button>


          {/* Tab 3 */}
          <button
            className={`py-2 px-4 text-sm font-semibold ${activeTab === 3 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              } focus:outline-none`}
            onClick={() => setActiveTab(3)}
          >
            Diagnostico Ingreso
          </button>

          {/* Tab 4 */}
          <button
            className={`py-2 px-4 text-sm font-semibold ${activeTab === 4 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              } focus:outline-none`}
            onClick={() => setActiveTab(4)}
          >
            Ordenes Medicas
          </button>

          {/* Tab 5 */}
          <button
            className={`py-2 px-4 text-sm font-semibold ${activeTab === 5 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              } focus:outline-none`}
            onClick={() => setActiveTab(5)}
          >
            Anamnesis
          </button>

          <button
            className={`py-2 px-4 text-sm font-semibold ${activeTab === 6 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              } focus:outline-none`}
            onClick={() => setActiveTab(6)}
          >
            Transferencias
          </button>


          <button
            className={`py-2 px-4 text-sm font-semibold ${activeTab === 7 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              } focus:outline-none`}
            onClick={() => setActiveTab(7)}
          >
            Atención Medica
          </button>
        </div>

        {/* Contenedor del contenido de los tabs */}
        <div className="mt-4">
          {/* Contenido de Tab 1 */}
          {activeTab === 1 && (
            <div className="p-4 bg-white border rounded-md shadow-md">
              <TriajeDif idcuentaatencion={275247} />
            </div>
          )}


          {/* Contenido de Tab 3 */}
          {activeTab === 3 && (
            <div className="p-4 bg-white border rounded-md shadow-md">
              <DiagnosticoIngreso datosEmergencia={emergenciaCuentaDatos} session={session} />
            </div>
          )}

          {/* Contenido de Tab 4 */}
          {activeTab === 4 && (
            <div className="p-4 bg-white border rounded-md shadow-md">
              <Ordenes datosEmergencia={emergenciaCuentaDatos} session={session} />
            </div>
          )}

          {/* Contenido de Tab 5 */}
          {activeTab === 5 && (
            <div className="p-4 bg-white border rounded-md shadow-md">
              <Anamnesis datosEmergencia={emergenciaCuentaDatos} session={session} />
            </div>
          )}

          {/* Contenido de Tab 6 */}
          {activeTab === 6 && (
            <div className="p-4 bg-white border rounded-md shadow-md">
              {emergenciaCuentaDatos &&
                <Transferencias datosEmergencia={emergenciaCuentaDatos} session={session} />
              }
            </div>
          )}

          {/* Contenido de Tab 7 */}
          {activeTab === 7 && (
            <div className="p-4 bg-white border rounded-md shadow-md">
              {emergenciaCuentaDatos &&
                <AtencionMedica datosEmergencia={emergenciaCuentaDatos} session={session} />
              }
            </div>
          )}
        </div>
      </div>
    </>
  )
}
