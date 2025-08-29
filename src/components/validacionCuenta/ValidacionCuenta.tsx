'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GridColDef } from '@mui/x-data-grid';
import { TableDataGridUI } from '../ui/TableDataGridUI';
import { PiPrinter } from 'react-icons/pi';
import { FaRegEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCEDatosStore } from '@/store';
import { obtenerFechaYHora } from '../utils/obtenerFechaYHora';
import LinearWithValueLabel from '../ui/LinearProgressWithLabel';
import Swal from 'sweetalert2';
import { ModalGeneric } from '../ui/ModalGeneric/ModalGeneric';
import { TriajeDif } from '../TriajeDiferenciado/TriajeDif';
import { BsClipboardPulse } from 'react-icons/bs';

export default function ValidacionCuenta({ session }: any) {
  const router = useRouter();
  const { formattedDate } = obtenerFechaYHora();
  const resetDatosCE = useCEDatosStore((state: any) => state.resetDatosCE);

  const [dataTablaRowsPacientes, setDataTablaRowsPacientes] = useState<any[]>([])
  const [nullCount, setNullCount] = useState(0);
  const [nonNullCount, setNonNullCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cuentaTriar, setCuentaTriar] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = ({ idcuenta }: any) => {
    setCuentaTriar(idcuenta)
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleAtencion = (row: any) => {
    router.push(`/sihce/consultaexterna/${row?.idcuenta}`);
  }

  const handleHCClick = (row: any) => {
    const url = `/reportes/hojaatencion/${row?.idcuenta}`;
    window.open(url, '_blank');
  }

  const handleFUAClick = (row: any) => {
    const url = `/reportes/fua/${row?.idcuenta}`;
    window.open(url, '_blank');
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
              ? { ...p, idSiasis: data.idPaciente }
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

  const getDataCE = async () => {
    setIsLoading(true)
    const { data } = await axios.get(
      `${process.env.apijimmynew}/programacionmedica/ApiObtenerAtencionesPorFecha/${formattedDate}`
    );
 console.log(data)
    // unir todos los pacientes sin agrupar
  const pacientes = data
  .filter((d: any) => !d.idSiasis) // 👈 solo los que no tengan idSiasis
  .map((d: any) => ({
    id: d.idAtencion,
    FyHFinal: d.FyHFinal,
    idcuenta: d.idCuentaAtencion,
    edad: d.edad,
    financiamiento: d.fuentefinanciamento,
    hora: `${d.horaInicioC} - ${d.horaFinC}`,
    nompx: `${d.NombreCompleto} (${d.nroDocumento})`,
    Triaje: d.Triaje,
    TriajePeso: d.TriajePeso,
    FuaNumero: d.FuaNumero,
    CitaExamenClinico: d.CitaExamenClinico,
    idSiasis: d?.idSiasis,
    nombre:d?.nombre
  }));
 
    setDataTablaRowsPacientes(pacientes);

    const nullCount = pacientes.filter((item: any) => item.FyHFinal === null).length;
    const nonNullCount = pacientes.filter((item: any) => item.FyHFinal !== null).length;
    setNullCount(nullCount);
    setNonNullCount(nonNullCount);

    setIsLoading(false)
  }

  useEffect(() => {
    getDataCE()
    resetDatosCE()
  }, [])

  const validacionTriaje = (Triaje: any, TriajePeso: any) => {
    if (!Triaje) return true;
    return TriajePeso !== "" && TriajePeso !== null;
  }

  const columns: GridColDef[] = [
    { field: 'idcuenta', headerName: 'Numero de Cuenta', flex: 1 },
    { field: 'nompx', headerName: 'Nombre Paciente', flex: 1 },
    { field: 'edad', headerName: 'Edad', flex: 1 },
    { field: 'financiamiento', headerName: 'Financiamiento', flex: 1 },
    { field: 'idSiasis', headerName: 'idSiasis', flex: 1 },
    { field: 'nombre', headerName: 'nombre', flex: 1 },
    {
      field: 'FyHFinal',
      headerName: 'ver',
      width: 200,
      renderCell: (params) => (
        (params.row?.idSiasis == null && params.row?.financiamiento === 'SIS')
          ? (
            <button
              onClick={() => handleValidacionSis(params.row)}
              className='text-center w-28 m-1 py-2 px-3 inline-flex items-center text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white'
            >
              Validar SIS
            </button>
          )
          : <div className='flex flex-wrap gap-4'>validado</div>
      )
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 440,
      renderCell: (params) => (
        <>
          {(params.row?.idSiasis == null && params.row?.financiamiento == 'SIS')
            ? (
              <button
                onClick={() => handleValidacionSis(params.row)}
                className='text-center w-28 m-1 py-2 px-3 inline-flex items-center text-sm font-medium rounded-lg bg-blue-600 text-white'
              >
                Validar SIS
              </button>
            )
            : (
              <div className='flex flex-wrap gap-4'>
                {validacionTriaje(params.row?.Triaje, params.row?.TriajePeso)
                  ? (
                    params.row?.FyHFinal == null
                      ? <button type="button" onClick={() => handleAtencion(params.row)} className="w-28 m-1 py-2 px-3 inline-flex items-center text-sm font-medium rounded-lg bg-blue-500 text-white">
                          <FaRegEdit /> Atender
                        </button>
                      : <button type="button" onClick={() => handleAtencion(params.row)} className="w-28 m-1 py-2 px-3 inline-flex items-center text-sm font-medium rounded-lg bg-blue-400 text-white">
                          <FaRegEdit /> Modificar
                        </button>
                  )
                  : (
                    <button
                      onClick={() => openModal(params.row)}
                      className='w-28 m-1 py-2 px-3 inline-flex items-center text-sm font-medium rounded-lg bg-indigo-400 hover:bg-indigo-500 text-white'
                    >
                      <BsClipboardPulse className="w-5 h-5" /> Triar
                    </button>
                  )}
                {params.row?.CitaExamenClinico &&
                  <button type="button" onClick={() => handleHCClick(params.row)} className="btnyellow hidden">
                    <PiPrinter /> Historia
                  </button>}
                {(params.row?.FuaNumero && params.row?.financiamiento == 'SIS') &&
                  <button type="button" onClick={() => handleFUAClick(params.row)} className="btngreen hidden">
                    <PiPrinter /> FUA
                  </button>}
              </div>
            )}
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
      {/* Estado de atención */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-red-500">
          <h3 className="text-xl font-semibold text-red-600 mb-2">No Atendidos</h3>
          <p className="text-gray-700 text-2xl font-bold">{nullCount} pacientes</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold letraFondo mb-2">
        {session?.user?.name ? `Dr. ${session?.user?.name}` : "Validador SIS"}
          </h1>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-green-600 mb-2">Atendidos</h3>
          <p className="text-gray-700 text-2xl font-bold">{nonNullCount} pacientes</p>
        </div>
      </div>

      <LinearWithValueLabel nullCount={nullCount} nonNullCount={nonNullCount} />

      {/* Tabla de pacientes */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <TableDataGridUI rows={dataTablaRowsPacientes} columns={columns} />
      </div>

      {/* Modal de Triaje */}
      <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>
        <label className="text-lg font-semibold text-gray-900">Triaje</label>
        <TriajeDif idcuentaatencion={cuentaTriar} usuario={session} closeModal={closeModal} volverABuscar={getDataCE} />
        <div className="mt-6 flex justify-end">
          <button
            className="py-2 px-4 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      </ModalGeneric>
    </div>
  )
}
