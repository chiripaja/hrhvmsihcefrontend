'use client'
import React, { useEffect, useState } from 'react'
import stylesCE from './stylesCE.module.css'
import axios from 'axios'
import SelectUI from '../ui/SelectUI';
import { useForm } from 'react-hook-form';
import { GridColDef } from '@mui/x-data-grid';
import { TableDataGridUI } from '../ui/TableDataGridUI';
import { PiPrinter } from 'react-icons/pi';
import { FaRegEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/ui/useUserStore';
import { useCEDatosStore } from '@/store';
import { obtenerFechaYHora } from '../utils/obtenerFechaYHora';
import LinearWithValueLabel from '../ui/LinearProgressWithLabel';
import { CircularProgress, Button } from '@mui/material';
import { FiActivity } from 'react-icons/fi';
import { useMyStore } from '@/store/ui/useProgramacionStore';
import Swal from 'sweetalert2';
import { ModalGeneric } from '../ui/ModalGeneric/ModalGeneric';
import { TriajeDif } from '../TriajeDiferenciado/TriajeDif';
import { BsClipboardPulse } from 'react-icons/bs';




interface formBusqueda {
  idprogramacion: number;
}



export const CEListado = ({ session }: any) => {
  const router = useRouter();
  const { idprogramacionzus, setIdProgramacionzus } = useMyStore()

  const { formattedDate, hora, fechayhora } = obtenerFechaYHora();
  const resetDatosCE = useCEDatosStore((state: any) => state.resetDatosCE);
  const {
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formBusqueda>();
  const idprogramacion = watch('idprogramacion')
  const [dataTotal, setDataTotal] = useState<any[]>([])
  const [dataServiciosProgramados, setdataServiciosProgramados] = useState<any[]>([])
  const [dataTablaRowsPacientes, setDataTablaRowsPacientes] = useState<any[]>([])
  const [nombreEspecialidad, setNombreEspecialidad] = useState<any[]>([])
  const [MostraNomEsp, setMostraNomEsp] = useState<any[]>([])
  const [nullCount, setNullCount] = useState(0);
  const [nonNullCount, setNonNullCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cuentaTriar, setCuentaTriar] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = ({ idcuenta }: any) => {
    console.log("abrir modal")
    console.log(idcuenta)
    setCuentaTriar(idcuenta)
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

 

  const handleAtencion = async (row: any) => {
    router.push(`/sihce/consultaexterna/${row?.idcuenta}`);
  }

  function handleHCClick(row: any): void {
    const url = `/reportes/hojaatencion/${row?.idcuenta}`;
    window.open(url, '_blank');
  }

  function handleFUAClick(row: any): void {
    const url = `/reportes/fua/${row?.idcuenta}`;
    window.open(url, '_blank');
  }

  const groupByIdProgramacion = (arr: any) => {
    return arr.reduce((acc: any, obj: any) => {
      const key = obj.idProgramacion;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  };

  const getDataCE = async () => {
    setIsLoading(true)
    //const { data } = await axios.get(`${process.env.apijimmynew}/programacionmedica/findbyidmedicofecha/${session?.user?.id}/${formattedDate}`)
    console.log(`${process.env.apijimmynew}/programacionmedica/findbyidmedicofecha/${session?.user?.id}/${formattedDate}`)
     const { data } = await axios.get(`${process.env.apijimmynew}/programacionmedica/findbyidmedicofecha/3095/2025-06-23`)
    //  const { data } = await axios.get(`${process.env.apijimmynew}/programacionmedica/findbyidmedicofecha/4902/2024-07-16`)
    // const { data } = await axios.get(`${process.env.apijimmynew}/programacionmedica/findbyidmedicofecha/4147/2024-10-03`)


    const groupedData = groupByIdProgramacion(data);
    setDataTotal(groupedData);
    const names = Object.keys(groupedData).map(key => {
      const firstObject = groupedData[key][0];
      return {
        idProgramacion: key,
        nombre: firstObject.nombre,
        phorainicio: firstObject.horaInicio,
        phoraFin: firstObject.horaFin,
        Especialidad: firstObject.NomEspecialidad
      };
    })
    setNombreEspecialidad(names)
    if (names.length > 0) {
      const serviciosdata: any[] = names.map((datos: any) => ({
        id: datos?.idProgramacion,
        descripcion: datos?.nombre + ' (' + datos?.phorainicio + '-' + datos?.phoraFin + ')'
      }));
      setdataServiciosProgramados(serviciosdata)
    }
    setIsLoading(false)
  }
  const handleValidacionSis = async (row: any) => {
    try {
      const { data } = await axios.get(`${process.env.apivalidacionsis}/api/sis/${row?.idcuenta}`);
      if (data?.idPaciente) {
        Swal.fire({
          icon: "success",
          title: "Validado correctamente!",
          timerProgressBar: true,
          timer: 2000,
        });

        setDataTablaRowsPacientes((prev) =>
          prev.map((p) =>
            p.idcuenta === row.idcuenta
              ? { ...p, idSiasis: data.idPaciente } // Marcamos como validado
              : p
          )
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en la Validación",
        text: "No se pudo validar el SIS. Intenta nuevamente.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const getConsultorio = async (id: number) => {

    if (id > 0) {
      const dataC = await dataTotal[id];
      const dataTablaRows: any[] = [];
      const nullCount = dataC.filter((item: any) => item.FyHFinal === null).length;
      const nonNullCount = dataC.filter((item: any) => item.FyHFinal !== null).length;
      setNullCount(nullCount);
      setNonNullCount(nonNullCount);
      dataC.map((data: any) => {
        dataTablaRows.push({
          id: data.idAtencion,
          FyHFinal: data.FyHFinal,
          idcuenta: data.idCuentaAtencion,
          edad: data.edad,
          financiamiento: data.fuentefinanciamento,
          hora: `${data.horaInicioC} - ${data.horaFinC}`,
          nompx: `${data.NombreCompleto} (${data.nroDocumento}) `,
          Triaje: data.Triaje,
          TriajePeso: data.TriajePeso,
          FuaNumero: data.FuaNumero,
          CitaExamenClinico: data.CitaExamenClinico,
          idSiasis: data?.idSiasis
        })
      });
      setDataTablaRowsPacientes(dataTablaRows);
    }

  }

  useEffect(() => {
    getDataCE()
    resetDatosCE()
  }, [])

  useEffect(() => {
    let c = 0;
    let idProgramacion = 0;
    Object.keys(dataTotal).forEach((key: any) => {
      c++;
      const firstItem = dataTotal[key][0];
      idProgramacion = (c === 1) ? firstItem.idProgramacion : null;
      if (idProgramacion !== null) {
        getConsultorio(idProgramacion)
        getEspecilidad(idProgramacion)
      }
    });
  }, [dataTotal])

  const getEspecilidad = (id: any) => {
    const data = nombreEspecialidad.filter((data: any) => data.idProgramacion == id)

    setMostraNomEsp(data)
  }

  // 1. Si Zustand está vacío y llega data, usar primer valor
  useEffect(() => {
    if (
      dataServiciosProgramados.length > 0 &&
      !idprogramacionzus
    ) {
      const primerId = dataServiciosProgramados[0].id;
      setIdProgramacionzus(primerId);
      setValue('idprogramacion', primerId);
    }
  }, [dataServiciosProgramados, idprogramacionzus]);

  // 2. Si Zustand ya tiene valor (por persistencia), actualizar el select
  useEffect(() => {
    if (idprogramacionzus) {
      setValue('idprogramacion', idprogramacionzus);
    }
  }, [idprogramacionzus]);

const volverAEjecutarBusqueda = () => {

    getDataCE();
  
};

  // 3. Cuando el usuario cambia el select, actualizar Zustand
  useEffect(() => {
    if (idprogramacion && idprogramacion !== idprogramacionzus) {
      setIdProgramacionzus(idprogramacion);
    }
  }, [idprogramacion]);
  useEffect(() => {
    if (idprogramacionzus && dataTotal && dataTotal[idprogramacionzus]) {
      getEspecilidad(idprogramacionzus);
      getConsultorio(idprogramacionzus);
    }
  }, [idprogramacionzus, dataTotal]);

  const validacionTriaje = (Triaje: any, TriajePeso: any) => {
    if (!Triaje) {
      return true
    } else {

      if (TriajePeso !== "" && TriajePeso !== null) {
        return true
      } else {
        return false
      }
    }
  }


  const columns: GridColDef[] = [
    {
      field: 'idcuenta', headerName: 'Numero de Cuenta', flex: 1,
    },
    { field: 'nompx', headerName: 'Nombre Paciente', flex: 1 },
    { field: 'edad', headerName: 'Edad', flex: 1 },
    { field: 'financiamiento', headerName: 'Financiamiento', flex: 1 },
    { field: 'hora', headerName: 'Hora', flex: 1 },
    {
      field: 'id',
      headerName: 'Acciones',
      width: 440,
      renderCell: (params) => (

        <>
          {(params.row?.idSiasis == null && params.row?.financiamiento == 'SIS') ? <>
            <button onClick={() => handleValidacionSis(params.row)} className='text-center w-28 m-1 ms-0 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover: focus:outline-none  disabled:opacity-50 disabled:pointer-events-none'>
              Validar SIS
            </button>
          </> : <div className='flex flex-wrap gap-4'>
            {
              validacionTriaje(params.row?.Triaje, params.row?.TriajePeso) ?
                <>
                  {params.row?.FyHFinal == null ?
                    <button type="button" onClick={() => handleAtencion(params.row)} className="w-28 m-1 ms-0 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent colorFondo text-white hover: focus:outline-none  disabled:opacity-50 disabled:pointer-events-none">
                      <FaRegEdit />
                      Atender
                    </button>
                    :
                    <button type="button" onClick={() => handleAtencion(params.row)} className="w-28 m-1 ms-0 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-500 hover:bg-blue-600 text-white hover: focus:outline-none  disabled:opacity-50 disabled:pointer-events-none">
                      <FaRegEdit />
                      Modificar
                    </button>}
                </> :
                <>
                 
                  <button
                    onClick={() => openModal(params.row)}
                    className={`w-28 m-1 ms-0 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-indigo-400 hover:bg-indigo-500 text-white`}
                  >
                    <BsClipboardPulse  className="w-5 h-5" />
                    Triar
                  </button>
                </>
            }
            {params.row?.CitaExamenClinico != null &&
              <>
                <button type="button" onClick={() => handleHCClick(params.row)} className="btnyellow hidden">
                  <PiPrinter />
                  Historia
                </button>
              </>
            }
            {(params.row?.FuaNumero != null && params.row?.financiamiento == 'SIS') &&
              <button type="button" onClick={() => handleFUAClick(params.row)} className="btngreen hidden">
                <PiPrinter />
                FUA
              </button>
            }
          </div>}
        </>
      ),
    },
  ];

  const handlePrint = () => {

    const url = `/reportes/impresionHis/${idprogramacion}`;
    window.open(url, '_blank');/**/
  }

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg">

      {/* Sección de estado de atención en una fila */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-6">
        {/* Pacientes no atendidos */}
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-red-500 w-full flex flex-col justify-between">
          <h3 className="text-xl font-semibold text-red-600 mb-2">No Atendidos</h3>
          <p className="text-gray-700 text-2xl font-bold">{nullCount} pacientes</p>
        </div>

        {/* Nombre del Doctor */}
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500 w-full flex flex-col justify-between">
          <h1 className="text-3xl font-bold letraFondo mb-2">{session?.user?.name ? `Dr. ${session?.user?.name}` : "Nombre del Doctor"}</h1>
          {MostraNomEsp[0]?.Especialidad && (
            <p className="text-gray-500 text-lg">{MostraNomEsp[0]?.Especialidad}</p>
          )}
        </div>

        {/* Pacientes atendidos */}
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-500 w-full flex flex-col justify-between">
          <h3 className="text-xl font-semibold text-green-600 mb-2">Atendidos</h3>
          <p className="text-gray-700 text-2xl font-bold">{nonNullCount} pacientes</p>
        </div>
      </div>
      {/* Barra de progreso */}
      <LinearWithValueLabel nullCount={nullCount} nonNullCount={nonNullCount} />
      {/* Formulario de selección */}
      <form className="bg-white p-6 rounded-lg shadow-lg mb-8 flex gap-4">
        <div className="w-4/5">
          <select
            {...register("idprogramacion")}
            value={watch("idprogramacion") || ""}
            disabled={false} // o usa una variable si necesitas controlarlo
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

          >
            {dataServiciosProgramados.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.id}-{opcion.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/5 flex justify-end">
          <button
            onClick={handlePrint}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-2 py-1 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 9V2h12v7M6 18h12v4H6v-4zM6 14h12v2H6v-2z"
              />
            </svg>
            Imprimir HIS
          </button>
        </div>
      </form>
      {/* Tabla de pacientes */}
      <div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
    <TableDataGridUI rows={[...dataTablaRowsPacientes]} columns={columns} />
        </div>

      </div>


      <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>
        <label className="text-lg font-semibold text-gray-900">Triaje</label>
        <div className="text-sm text-gray-600">
          <TriajeDif idcuentaatencion={cuentaTriar} usuario={session} closeModal={closeModal} volverABuscar={volverAEjecutarBusqueda} />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      </ModalGeneric>

    </div>

  );
}


