'use client'
import { getData } from '@/components/helper/axiosHelper';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { PiPrinter } from 'react-icons/pi';
import Select from 'react-select';
import { EmergenciaTicket } from '../admision/EmergenciaTicket';
import { FaRegEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { MdOutlineTransferWithinAStation } from "react-icons/md";

export const ListadoEmergencia = () => {
  const router = useRouter();
  const [options, setOptions] = useState<any[]>([]);
  const [resultados, setResultados] = useState<any[]>([])
  const [numCuenta, setnumCuenta] = useState<any>();
  const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
  const fetchCombosEmergencia = async () => {
    try {
      const response = await getData(`${process.env.apijimmynew}/emergencia/ServiciosFiltrar`);
      const mappedOptions = response.map((est: any) => ({
        value: est.IdServicio,
        label: `${est.Nombre.trim()}`,
        IdEspecialidad: est.IdEspecialidad
      }));
      setOptions(mappedOptions);

    } catch (error) {
      console.error("Error al cargar los datos:", error);

    }
  }
  useEffect(() => {
    fetchCombosEmergencia()
  }, [])
  const BuscarFiltro = async (data: any) => {
    console.log(data)
    const response = await getData(`${process.env.apijimmynew}/emergencia/ApiObtenerAtencionesEmergenciaPorServicioYFecha/${data?.IdServicio?.value}/${data?.fecha}`);
    console.log(response)
    setResultados(response)
  }
  const handleEditClick = (IdCuentaAtencion: any) => {
    setnumCuenta(IdCuentaAtencion)
  }
  const handleAtencion = async (IdCuentaAtencion: any) => {
    router.push(`/sihce/emergencia/atencion/${IdCuentaAtencion}`);
  }
  const handleTransferencias=(IdCuentaAtencion: any)=>{
    router.push(`/sihce/emergencia/transferencias/${IdCuentaAtencion}`);
  }
  return (
    <>
      <form onSubmit={handleSubmit(BuscarFiltro)} className="p-6 bg-white shadow-lg rounded-lg flex items-center space-x-4 print:hidden">
        <div className="flex-1">
          <label htmlFor="IdServicio" className="block text-sm font-medium text-gray-800 mb-1">
            Servicios Emergencia
          </label>
          <Controller
            name="IdServicio"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                instanceId="unique-select-id"
                {...field}
                options={options}
                placeholder="Selecciona un servicio"
                className="w-full"
                required={true}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption);
                }}
              />
            )}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-800 mb-1">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            {...register('fecha')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="px-6 py-2 mt-5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Buscar
          </button>
        </div>
      </form>
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6 print:hidden">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Resultados</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Num. Cuenta</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Nombre Completo</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Nro. Documento</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Servicio</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Observación</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.length > 0 ? (
                resultados.map((item, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{item.IdCuentaAtencion}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{item.NombreCompleto}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{item.NroDocumento}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{item.Nombre}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{item.Observacion}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">
                      <button type="button" onClick={() => handleEditClick(item.IdCuentaAtencion)} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-300 text-gray-800 hover:bg-yellow-500 focus:outline-none focus:bg-yellow-700 disabled:opacity-50 disabled:pointer-events-none mr-2">
                        <PiPrinter />
                        Ticket
                      </button>
                      <button type="button" onClick={() => handleAtencion(item.IdCuentaAtencion)} className="w-28 m-1 ms-0 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent colorFondo text-white hover: focus:outline-none  disabled:opacity-50 disabled:pointer-events-none ">

                        <FaRegEdit />

                        Atender
                      </button>
                      <button type="button" onClick={() => handleTransferencias(item.IdCuentaAtencion)} className="w-40 m-1 ms-0 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-cyan-700 text-white hover:bg-cyan-600 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none ">

                        <MdOutlineTransferWithinAStation />

                        Transferencias
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center border border-gray-300 px-4 py-2 text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(numCuenta) &&
        <EmergenciaTicket numCuenta={numCuenta} />
      }
    </>
  )
}
