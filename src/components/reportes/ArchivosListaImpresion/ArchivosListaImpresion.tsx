'use client'
import React from 'react'
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from "@mui/x-data-grid"
import { TicketImpresion } from '@/components/ModuloAdmision/TicketImpresion';
import { Tooltip } from '@/components/ui/Tooltip';
import { FiFile, FiPrinter } from 'react-icons/fi';
const Select = dynamic(() => import('react-select'), { ssr: false });
export const ArchivosListaImpresion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataTotal, setDataTotal] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [especialidad, setEspecialidad] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [dataListadoPX, setDataListadoPX] = useState<any[]>([]);
  const [cuentaTriar, setCuentaTriar] = useState<any[]>([]);
  const [nearest, setNearest] = useState<any>(null);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [filtroDni, setFiltroDni] = useState("");
const [filtroCuenta, setFiltroCuenta] = useState("");
  const rangoTurnos = [
    { value: 'manana', label: 'Mañana', horaInicio: '07:00', horaFin: '12:59' },
    { value: 'tarde', label: 'Tarde', horaInicio: '13:00', horaFin: '19:00' },
  ];
  const { control, register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<any>({
    defaultValues: {
      turno: rangoTurnos[0],      // Mañana por defecto
      horaInicio: '07:00',
      horaFin: '13:59',
    }
  });


  const [departamentoLabel, especialidadLabel, servicioLabel, desde, hasta] = watch(['idDepa', 'idEspe', 'idServicio', 'desde', 'hasta']);
  const openModal = ({ idcuenta }: any) => {
    setCuentaTriar(idcuenta)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    ListarDepartamentos();
  }, []);

  const ListarDepartamentos = async () => {
    try {
      let optionDepartamentos: any[] = [{ value: '0', label: 'TODOS' }];
      const { data } = await axios.get(`${process.env.apiurl}/Departamentos`);
      setDataTotal(data);
      optionDepartamentos =
        optionDepartamentos.concat(
          data.map((est: any) => ({
            value: est.idDepartamento,
            label: est.nombre,
          })));
      setDepartamentos(optionDepartamentos);
    } catch (error) {
      console.error('Error fetching specialties', error);
    }
  };


  const handleChangeDepartamento = async (selected: any | null) => {
    setValue('idEspe', null);
    setValue('idServicio', null);
    try {
      let optionsEspecialidad: any[] = [{ value: '0', label: 'TODOS' }];
      const dataEspecialidad = dataTotal.filter(data => data.idDepartamento == selected.value);
      if (dataEspecialidad[0].especialidades.length > 0) {
        optionsEspecialidad =
          optionsEspecialidad.concat(
            dataEspecialidad[0].especialidades.map((est: any) => ({
              value: est.idEspecialidad,
              label: est.nombre,
            })));
      } else {
        optionsEspecialidad = [{ value: '0', label: 'TODOS' }]
      }
      setEspecialidad(optionsEspecialidad);
    } catch (error) {
      console.error('Error fetching specialties', error);
    }

  };

  const handleChangeEspecialidad = async (selectedOption: any | null) => {
    setValue('idServicio', null);
    try {
      let opcionesConsultorio: any[] = [{ value: '0', label: 'TODOS' }];
      const { data } = await axios.get(`${process.env.apiurl}/Servicios/${selectedOption.value}`);
      if (data.length > 0) {
        opcionesConsultorio =
          opcionesConsultorio.concat(
            data.map((est: any) => ({
              value: est.idServicio,
              label: est.servicio,
            }))
          );
      } else {
        opcionesConsultorio = [{ value: '0', label: 'Todos' }]
      }
      setServicios(opcionesConsultorio)
    } catch (error) {
      console.log(error)
    }

  }

  const onSubmit: SubmitHandler<any> = async (formData) => {
    setDataListadoPX([]);
    setLoading(true);

    let idDepa = formData?.idDepa?.value | 0;
    let idEspe = formData?.idEspe?.value | 0;
    let idServicio = formData?.idServicio?.value | 0;

    const { data } = await axios.get(
      `${process.env.apiurl}/CitadosBloque/${formData?.desde}/${formData?.hasta}/${idDepa}/${idEspe}/${idServicio}`
    );

    let datafiltrada = data.filter((d: any) => d.idCuentaAtencion != 0);

    // Filtrar por rango horario ingresado
    if (formData?.horaInicio && formData?.horaFin) {
      datafiltrada = datafiltrada.filter((d: any) => {
        return d.horaInicio >= formData.horaInicio && d.horaInicio <= formData.horaFin;
      });
    }

    setLoading(false);
    setDataListadoPX(datafiltrada);


  };
  const rows = dataListadoPX.map((item) => ({
    id: item.idCita, // ID único requerido por DataGrid
    ...item
  }));

  useEffect(() => {
    if (shouldPrint && nearest) {
      print();
      setShouldPrint(false);
    }
  }, [nearest, shouldPrint]);
const impresionTicket = (idCuentaAtencion: any) => {
    if (!idCuentaAtencion) return;
    window.open(
      `/sihce/archivos/${idCuentaAtencion}`,
      "_blank"
    );
  };
  const dataFiltrada = React.useMemo(() => {
  if (!dataListadoPX.length) return [];

  return dataListadoPX.filter((px: any) => {
    const matchDni = filtroDni ? px.nroDocumento?.toString().includes(filtroDni) : true;
    const matchCuenta = filtroCuenta ? String(px.idCuentaAtencion).includes(filtroCuenta) : true;
    return matchDni && matchCuenta;
  });
}, [dataListadoPX, filtroDni, filtroCuenta]);
  return (

    <>
      <div className="block print:hidden">
        <h1 className="print-hidden text-xl font-semibold mb-4">Listado de Especialidades Archivos</h1>

        <form className="print-hidden space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Selects */}
          <div className="flex flex-col md:flex-row gap-4">
            <Controller
              name="idDepa"
              control={control}
              render={({ field }) => (
                <Select
                  className="flex-1"
                  options={departamentos}
                  placeholder="Departamento"
                  isSearchable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleChangeDepartamento(selectedOption);
                  }}
                  value={field.value}
                />
              )}
            />

            <Controller
              name="idEspe"
              control={control}
              render={({ field }) => (
                <Select
                  className="flex-1"
                  options={especialidad}
                  placeholder="Especialidad"
                  isSearchable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleChangeEspecialidad(selectedOption);
                  }}
                  value={field.value}
                />
              )}
            />

            <Controller
              name="idServicio"
              control={control}
              render={({ field }) => (
                <Select
                  className="flex-1"
                  options={servicios}
                  placeholder="Consultorio"
                  isSearchable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                  }}
                  value={field.value}
                />
              )}
            />




          </div>

          {/* Fechas y botón */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex flex-col flex-1 w-full">
              <input
                {...register('desde', { required: true })}
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full py-2 px-4 border h-10 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.desde && (
                <span className="text-red-500 font-semibold">Este campo es requerido (*)</span>
              )}
            </div>

            <div className="flex flex-col flex-1 w-full">
              <input
                {...register('hasta', { required: true })}
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full py-2 px-4 border h-10 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.hasta && (
                <span className="text-red-500 font-semibold">Este campo es requerido (*)</span>
              )}
            </div>


          </div>


          {/* Campos Hora Inicio y Hora Fin */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Select de Turno */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold text-gray-700 mb-1">Turno</label>
              <Controller
                name="turno"
                control={control}
                defaultValue={rangoTurnos[0]} // Selección inicial = Mañana
                render={({ field }) => (
                  <Select
                    className="w-full"
                    options={rangoTurnos}
                    placeholder="Seleccionar turno"
                    isSearchable={false}
                    onChange={(selectedOption: any) => {
                      field.onChange(selectedOption);
                      setValue('horaInicio', selectedOption?.horaInicio);
                      setValue('horaFin', selectedOption?.horaFin);
                    }}
                    value={field.value}
                  />
                )}
              />
            </div>

            {/* Hora Inicio */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold text-gray-700 mb-1">Hora Inicio</label>
              <input
                {...register('horaInicio', { required: true })}
                type="time"
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.horaInicio && (
                <span className="text-red-500 text-xs font-semibold">Requerido</span>
              )}
            </div>

            {/* Hora Fin */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold text-gray-700 mb-1">Hora Fin</label>
              <input
                {...register('horaFin', { required: true })}
                type="time"
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.horaFin && (
                <span className="text-red-500 text-xs font-semibold">Requerido</span>
              )}
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="h-10 px-6 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg 
               bg-blue-600 text-white shadow-md hover:bg-blue-700 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
               transition duration-200"
            >
              Buscar
            </button>
          </div>


        </form>
        {/* Acciones e info */}
        <div className="print-hidden flex flex-col justify-center mt-6 space-y-2">
          <button
            className="bg-blue-600 w-full md:w-auto flex items-center justify-center space-x-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => window.print()}
          >
            Imprimir Lista
          </button>
          {(desde || hasta) && (
            <label className="block bg-blue-50 border border-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-md shadow-md">
              {desde && `Fecha inicio: ${desde}`} {hasta && ` Fecha fin: ${hasta}`}
            </label>
          )}

                 {dataListadoPX.length > 0 && (
  <div className="flex flex-col md:flex-row gap-4 mb-4 mt-4 print-hidden">
    <input
      type="text"
      placeholder="Buscar por DNI"
      value={filtroDni}
      onChange={(e) => setFiltroDni(e.target.value)}
      className="w-full md:w-1/3 px-3 py-2 border rounded-md shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 print-hidden"
    />
    <input
      type="text"
      placeholder="Buscar por N° Cuenta"
      value={filtroCuenta}
      onChange={(e) => setFiltroCuenta(e.target.value)}
      className="w-full md:w-1/3 px-3 py-2 border rounded-md shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 print-hidden"
    />
  </div>
)}
        </div>
      </div>
      {(departamentoLabel?.label || especialidadLabel?.label || servicioLabel?.label) && (
        <label className="block uppercasefont-semibold py-2 px-4 rounded-md shadow-md">
          {departamentoLabel?.label} {especialidadLabel?.label ? ' - ' + especialidadLabel?.label : ''} {servicioLabel?.label ? ' - ' + servicioLabel?.label : ''}
        </label>
      )}
 
      <div className=''>

        <table className='border border-black border-collapse w-full text-xs mt-1'>
          <tbody>
            <tr>
              <td className='border border-black bg-gray-300'>Fecha/hora de Atención</td>
              <td className='border border-black bg-gray-300'>N° Historia</td>
              <td className='border border-black bg-gray-300'>IdCuenta</td>
              <td className='border border-black bg-gray-300'>Paciente</td>
              <td className='border border-black bg-gray-300'>Telefono</td>
              <td className='border border-black bg-gray-300'>Financiamiento</td>
              <td className='border border-black bg-gray-300 print:hidden'>Ticket</td>
            </tr>
            {dataFiltrada.map((data: any) => (
              <tr key={data?.idCita}>
                <td className='border border-black'>{data?.fechaSolicitud} - {data?.horaInicio}</td>
                <td className='border border-black'>{data?.nroDocumento}</td>
                <td className='border border-black'>{data?.idCuentaAtencion}</td>
                <td className='border border-black'>{data?.paciente}</td>
                <td className='border border-black'>{data?.telefono}</td>
                <td className='border border-black'>{data?.iafa}</td>
                <td className='border border-black print:hidden'>   <Tooltip text="">
                  <button
                    type="button"
                    onClick={() => impresionTicket(data?.idCuentaAtencion)}
                    className="ml-3 py-2 px-3 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-transparent bg-yellow-500 text-gray-700  hover:bg-yellow-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <FiPrinter size={18} className="text-white hover: cursor-pointer" />
                  </button>
                   
                                                                                                  <a
                                                                                                      href={`/reportes/historiaclinica/${data?.idCuentaAtencion}`}
                                                                                                      target="_blank"
                                                                                                      className="ml-3 py-2 px-3 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-transparent bg-blue-400 text-gray-700 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                                                                  >
                  
                                                                                                      <FiFile size={18} className="text-white" />
                                                                                                  </a>
                                                                                             
                </Tooltip></td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>


    </>
  )
}
