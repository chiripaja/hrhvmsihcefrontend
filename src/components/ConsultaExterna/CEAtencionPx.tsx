'use client'
import { useEffect, useState } from 'react'
import { CEAntecedentesGeneral, CEConsultaGeneral, CEOrdenesGeneral, CEDestinoAtencionGeneral } from '../ConsultaExterna'
import axios from 'axios'
import { CECabezeraTriaje } from './CECabezaTriaje/CECabezeraTriaje'
import { useCEDatosStore } from '@/store'
import { useStore } from 'zustand'
import { Loading } from '../utils/Loading'
import { getData } from '../helper/axiosHelper'
import { RecetaCabecera } from '@/interfaces/RecetaCabezeraI'
import { MedicamentosCE } from '@/interfaces/MedicamentosCe'

declare global {
  interface Window {
    HS?: any; 
  }
}

export const CEAtencionPx = ({ idcuentaatencion, idpaciente, session }: any) => {
  const [dataPx, setDataPx] = useState<any>();
  const [activeTab, setActiveTab] = useState('1');
  const cuentaDatos = useCEDatosStore((state: any) => state.datosce);
  const setIdAtencionv2=useCEDatosStore((state:any)=>state.setIdAtencionv2);
  const setDiagnosticoByCuenta = useCEDatosStore((state: any) => state.setDiagnosticoByCuenta);
  const setRecetaCabezera = useCEDatosStore((state: any) => state.setRecetaCabezera);
  const setRecetaCabezeraProcedimientos = useCEDatosStore((state: any) => state.setRecetaCabezeraProcedimientos);
  const createMedicamento = useCEDatosStore((state: any) => state.createMedicamento);
  const limpiarMedicamento=useCEDatosStore((state:any)=>state.limpiarMedicamento);
  const createordenesLaboratorio = useCEDatosStore((state: any) => state.createordenesLaboratorio);
  const createOrdenesImagenes = useCEDatosStore((state: any) => state.createOrdenesImagenes);
  const createordenesOtros = useCEDatosStore((state: any) => state.createordenesOtros);
  const createordenesProcedimiento = useCEDatosStore((state: any) => state.createordenesProcedimiento);
  const setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago = useCEDatosStore((state: any) => state.setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago);
  const [procesados, setProcesados] = useState<Set<number>>(new Set());
  const [procesado, setProcesado] = useState(false);
  const resetDatosCE=useCEDatosStore((state:any)=>state.resetDatosCE);
  const limpiarordenesProcedimiento=useCEDatosStore((state:any)=>state.limpiarordenesProcedimiento)
  const [datosAtencion, setDatosAtencion] = useState<any>();
  const [recetaUpdateValidador, setrecetaUpdateValidador] = useState<any>()
  useEffect(() => {
    const ejecutarFunciones = async () => {
      await resetDatosCE();
      if (idcuentaatencion) {
        await getDatos();
        await getDatosRecetaCabecera();
        await getOtros(idcuentaatencion);
        await getDatosConsulta();
      }
    };
    ejecutarFunciones();
  }, []);


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
      setDataPx(data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.error("Recurso no encontrado (404)");
        setDataPx(null);
      } else {
        console.error("Ocurrió un error inesperado", error);
      }
    }
  }

  const getDatosConsulta = async () => {
    try {
      const datosAtencion = await getData(`${process.env.apijimmynew}/atenciones/findByIdCuentaAtencion/${idcuentaatencion}`);
     
      setDatosAtencion(datosAtencion)
      setIdMedicoIngresoServicioIngresoFuenteFinanciamientoFormaPago(datosAtencion?.idMedicoIngreso, datosAtencion?.servicio?.idServicio, datosAtencion?.idFuenteFinanciamiento, datosAtencion?.idFormaPago, datosAtencion?.servicio?.factPuntosCarga?.idPuntoCarga,datosAtencion?.edad,datosAtencion?.idCondicionMaterna,datosAtencion?.idDestinoAtencion)
      if (Array.isArray(datosAtencion.atencionesDiagnosticos)) {
        datosAtencion.atencionesDiagnosticos.map((data: any) => {
          setDiagnosticoByCuenta(
            data.diagnostico.idDiagnostico,
            data.diagnostico.codigoCIE10+' - '+data.diagnostico.descripcion,
            data.diagnostico.codigoCIE10,
            data.idSubclasificacionDx,
            data.subclasificacionDiagnosticos.descripcion,
            data.labConfHIS
          );
        });
      } else {
        console.error("datosAtencion.atencionesDiagnosticos no es un array");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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

  const getMedicamentosbyIdRecetaCabeceraFarmacia = async (idrecetacabecera: number, idFormaPago: number) => {
    try {
      //await limpiarMedicamento(); 
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdReceta/${idrecetacabecera}/${idFormaPago}/4`)
      data.forEach((info: MedicamentosCE) => {
        createMedicamento(info); 
      });
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

  const getLaboratoriobyIdRecetaCabecera = async (idrecetacabecera: number, idFormaPago: number, idpuntocarga: any) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdRecetaServicios/${idrecetacabecera}/${idFormaPago}`)
      
      data.map((info: MedicamentosCE) => {
        createordenesLaboratorio(info)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getImagenesbyIdRecetaCabecera = async (idrecetacabecera: number, idFormaPago: number) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdRecetaServicios/${idrecetacabecera}/${idFormaPago}`)
      
      data.map((info: any) => {
       
        createOrdenesImagenes(info)
      })
    } catch (error) {
      console.log(error)
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
      if (procesado) return;
      const recetaCabezera = cuentaDatos?.recetaCabezera || [];
      const RecetaCabezeraFarmacia = recetaCabezera.filter(
        (data: RecetaCabecera) => data.IdPuntoCarga === 5
      );
      if (RecetaCabezeraFarmacia?.[0]?.idReceta && cuentaDatos?.idFormaPago) {           
        await getMedicamentosbyIdRecetaCabeceraFarmacia(
          RecetaCabezeraFarmacia[0].idReceta,
          cuentaDatos.idFormaPago
        );
        setProcesado(true);
      }
    };
    ejecutarFunciones(); 
  }, [recetaUpdateValidador,cuentaDatos?.idFormaPago]);

  useEffect(() => {
    const idsPermitidos = [3, 2, 11];
    const idsImagenes = [20, 21, 22, 23];
    const recetaCabezera = cuentaDatos?.recetaCabezera || [];
    const procesar = (data: RecetaCabecera, callback: Function) => {
      if (!procesados.has(data.idReceta)) {
        callback();
        setProcesados((prev) => new Set(prev).add(data.idReceta));
      }
    };
    recetaCabezera.forEach((data: RecetaCabecera) => {
      if (idsPermitidos.includes(data.IdPuntoCarga) && data.idReceta && cuentaDatos?.idFormaPago) {
        procesar(data, () =>
          getLaboratoriobyIdRecetaCabecera(data.idReceta, cuentaDatos.idFormaPago, data.IdPuntoCarga)
        );
      }
      if (idsImagenes.includes(data.IdPuntoCarga) && data.idReceta && cuentaDatos?.idFormaPago) {
        procesar(data, () =>
          getImagenesbyIdRecetaCabecera(data.idReceta, cuentaDatos.idFormaPago)
        );
      }
    });
  }, [recetaUpdateValidador, cuentaDatos?.idFormaPago]);
  useEffect(() => {
  if (cuentaDatos?.recetaCabezeraProcedimientos[0]?.IdOrden) {
      getOrdenesProcedimientosByIdOrden(cuentaDatos?.recetaCabezeraProcedimientos[0]?.IdOrden)
    }
  }, [cuentaDatos?.recetaCabezeraProcedimientos])
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  if (dataPx === undefined) {
    return <Loading />
  }
  return (
    <div className="flex flex-wrap bg-white p-3 rounded w-full shadow-2xl">

    
      <CECabezeraTriaje dataPx={dataPx} />
      <div className="border-e border-gray-200 dark:border-neutral-700">
        <nav className="flex flex-col space-y-2">
          <button
            type="button"
            className={`py-1 pe-4 inline-flex items-center gap-x-2 border-e-2 border-transparent text-sm whitespace-nowrap ${activeTab === '1'
                ? 'hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-600'
                : 'text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500'
              } focus:outline-none focus:text-blue-600`}
            onClick={() => handleTabChange('1')}
            id="vertical-tab-with-border-item-1"
            aria-selected={activeTab === '1'}
            aria-controls="vertical-tab-with-border-1"
            role="tab"
          >
            Antecedentes
          </button>

          <button
            type="button"
            className={`py-1 pe-4 inline-flex items-center gap-x-2 border-e-2 border-transparent text-sm whitespace-nowrap ${activeTab === '2'
                ? 'hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-600'
                : 'text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500'
              } focus:outline-none focus:text-blue-600`}
            onClick={() => handleTabChange('2')}
            id="vertical-tab-with-border-item-2"
            aria-selected={activeTab === '2'}
            aria-controls="vertical-tab-with-border-2"
            role="tab"
          >
            Consulta Medica
          </button>
{(cuentaDatos?.CitaMotivo && cuentaDatos?.CitaExamenClinico) && (
<>
<button
            type="button"
            className={`py-1 pe-4 inline-flex items-center gap-x-2 border-e-2 border-transparent text-sm whitespace-nowrap ${activeTab === '3'
                ? 'hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-600'
                : 'text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500'
              } focus:outline-none focus:text-blue-600`}
            onClick={() => handleTabChange('3')}
            id="vertical-tab-with-border-item-3"
            aria-selected={activeTab === '3'}
            aria-controls="vertical-tab-with-border-3"
            role="tab"
          >
            Ordenes Medicas
          </button>

          <button
            type="button"
            className={`py-1 pe-4 inline-flex items-center gap-x-2 border-e-2 border-transparent text-sm whitespace-nowrap ${activeTab === '4'
                ? 'hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-600'
                : 'text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500'
              } focus:outline-none focus:text-blue-600`}
            onClick={() => handleTabChange('4')}
            id="vertical-tab-with-border-item-4"
            aria-selected={activeTab === '4'}
            aria-controls="vertical-tab-with-border-4"
            role="tab"
          >
            Destino de Atencion
          </button>
</>
)}
        </nav>
      </div>
      <div className="ms-3 flex-grow">
        <div
          id="vertical-tab-with-border-1"
          role="tabpanel"
          aria-labelledby="vertical-tab-with-border-item-1"
          className={activeTab === '1' ? '' : 'hidden'}
        >
          <CEAntecedentesGeneral handleTabChange={handleTabChange} />
        </div>
        <div
          id="vertical-tab-with-border-2"
          className={activeTab === '2' ? '' : 'hidden'}
          role="tabpanel"
          aria-labelledby="vertical-tab-with-border-item-2"
        >
          <CEConsultaGeneral handleTabChange={handleTabChange} session={session} datosAtencion={datosAtencion}/>
        </div>
        <div
          id="vertical-tab-with-border-3"
          className={activeTab === '3' ? '' : 'hidden'}
          role="tabpanel"
          aria-labelledby="vertical-tab-with-border-item-3"
        >
          <CEOrdenesGeneral session={session} handleTabChange={handleTabChange}/>
        </div>
        <div
          id="vertical-tab-with-border-4"
          className={activeTab === '4' ? '' : 'hidden'}
          role="tabpanel"
          aria-labelledby="vertical-tab-with-border-item-4"
        >
          <CEDestinoAtencionGeneral session={session}/>
        </div>
      </div>
    </div>

  )
}
