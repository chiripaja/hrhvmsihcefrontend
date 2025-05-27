'use client'
import { useRouter } from 'next/navigation';
import { getData } from '@/components/helper/axiosHelper';
import { useCEDatosStore } from '@/store';
import { debounce } from '@mui/material';
import { Tooltip } from "@/components/ui/Tooltip";
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { CgAdd } from 'react-icons/cg';
import { GoTrash } from 'react-icons/go';
import Select from 'react-select';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import { GrFormNextLink } from 'react-icons/gr';
import { Loading } from '@/components/utils/Loading';
import { obtenerFechaYHora } from '@/components/utils/obtenerFechaYHora';
import { ReferenciaDestino } from './ReferenciaDestino';
import { watch } from 'fs';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { FaPrint } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';
const opcionCondicionMaterna = [
  { id: 1, valor: "Gestante" },
  { id: 2, valor: "Puerpera" },
  { id: 3, valor: "Ninguna" }
]
export const CEDestinoAtencionGeneral = ({ session, cuentaDatos }: any) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listadoInterconsulta, setListadoInterconsulta] = useState<any[]>([])
  const [options, setOptions] = useState<any[]>([]);
  const [destinoAtencion, setDestinoAtencion] = useState<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>();
  const { control: control2, register: register2, handleSubmit: handleSubmit2, setValue: setValue2, reset: reset2, watch: watch2 } = useForm<any>();
  const { formattedDate, hora, fechayhora } = obtenerFechaYHora();
  const [referenciaView, setreferenciaView] = useState(false);
  const FormDestino = async (data: any) => {

    try {
      const objetoEnvio = {
        idAtencion: cuentaDatos?.idatencion,
        idDestinoAtencion: data?.destinoAtencion,
        fechaEgreso: fechayhora,
        horaEgreso: hora,
        fyHInicioI: fechayhora,
        fyHFinal: fechayhora,
        idCondicionMaterna: data?.condicionMaterna == "" ? null : data?.condicionMaterna,
        citaObservaciones: data?.observaciones
      }
      console.log(objetoEnvio)

      Swal.fire({
        icon: "question",
        title: "¿Finalizar la consulta medica?",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`
      }).then(async (result) => {
        /* 
        if (result.isConfirmed) {
          await axios.post(`${process.env.apijimmynew}/atenciones/atencionesActualizar`, objetoEnvio)
          Swal.fire(
            {
              icon: "success",
              title: "Atencion Guardada correctamente!",
              timerProgressBar: true,
              timer: 2000,
            });
          //  router.push("/sihce/consultaexterna")
        } else if (result.isDenied) {
          Swal.fire("Cambios no fueron guardados", "", "info");
        }
*/
      });


    } catch (error) {
      console.log(error)
    }
  }


  const FormInterconsulta = async (data: any) => {
    try {
      console.log(data)
      const objetoEnvio = {
        idAtencion: cuentaDatos?.idatencion,
        idEspecialidad: data?.especialidad.value,
        idDiagnostico: data?.diagnostico,
        motivo: data?.motivo,
        idUsuario: session?.user?.id
      }
      await axios.post(`${process.env.apijimmynew}/atenciones/interconsulta`, objetoEnvio)
      getListadoInterconsulta(cuentaDatos?.idatencion)
      ToasterMsj("Procesado", "success", "Interconsulta agregado correctamente.");
      reset()
    } catch (error) {
      console.log(error)
    }


  }

  const getListadoDestinoAtencion = async () => {
    const data = await getData(`${process.env.apijimmynew}/atenciones/ListadoDestinoAtencion`)
    setDestinoAtencion(data);
  }


  const getListadoInterconsulta = async (idatencion: any) => {
    const data = await getData(`${process.env.apijimmynew}/atenciones/interconsulta/${idatencion}`)
    setListadoInterconsulta(data)
  }

  useEffect(() => {
    getListadoDestinoAtencion()
  }, [])


  useEffect(() => {
    cuentaDatos?.idatencion && getListadoInterconsulta(cuentaDatos?.idatencion);
  }, [cuentaDatos?.idatencion])



  const fetchEspecialidadInterconsulta = useCallback(
    debounce(async (nommed) => {
      try {
        setIsLoading(true);
        const response = await getData(`${process.env.apijimmynew}/especialidades/findEspecialidadByNombreLike/${nommed}`);
        const mappedOptions = response.map((est: any) => ({
          value: est.idEspecialidad,
          label: `${est.nombre.trim()}`
        }));
        setOptions(mappedOptions);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleDeleteInterconsulta = async (idsolicitudespecialidad: any) => {
    const response = await axios.delete(`${process.env.apijimmynew}/atenciones/interconsulta/${idsolicitudespecialidad}`);
    getListadoInterconsulta(cuentaDatos?.idatencion)
    ToasterMsj("Procesado", "info", "Se elimino correctamente.");
  }

  const handleButtonClick = () => {
    handleSubmit2(FormDestino)();

  };
  const destinoAtencionW = watch2('destinoAtencion');
  useEffect(() => {
    destinoAtencionW != 84 && setreferenciaView(false)
    destinoAtencionW == 84 && setreferenciaView(true)
  }, [destinoAtencionW])


  useEffect(() => {
    if (cuentaDatos?.idDestinoAtencion) {
      setValue2("destinoAtencion", cuentaDatos?.idDestinoAtencion);
    }
  }, [cuentaDatos?.idDestinoAtencion])

  useEffect(() => {
    if (cuentaDatos?.idCondicionMaterna) {
      setValue2("condicionMaterna", String(cuentaDatos.idCondicionMaterna));
    }
  }, [cuentaDatos?.idCondicionMaterna])

  useEffect(() => {
    if (cuentaDatos?.CitaObservaciones) {
      setValue2("observaciones", String(cuentaDatos?.CitaObservaciones));
    }
  }, [cuentaDatos?.CitaObservaciones])




  return (
    <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4">

      <div className='flex justify-evenly'>

        <div className='w-2/3'>
          <fieldset className='border p-3  rounded-lg'>
            <legend className='font-bold'>Modulo Interconsultas</legend>

            <form onSubmit={handleSubmit(FormInterconsulta)}>

              {cuentaDatos?.diagnosticos?.length > 0 && (
                <Controller
                  name="diagnostico"
                  control={control}
                  defaultValue={cuentaDatos.diagnosticos[0]?.IdDiagnostico}
                  render={({ field }) => (
                    <select {...field} className="w-full border p-2 rounded shadow-sm">
                      {cuentaDatos.diagnosticos
                        .filter((value: any, index: any, self: any) =>
                          index === self.findIndex((t: any) => t.IdDiagnostico === value.IdDiagnostico)
                        )
                        .map((data: any) => (
                          <option key={data?.IdDiagnostico} value={data?.IdDiagnostico}>
                            {data?.nomdx}
                          </option>
                        ))}
                    </select>
                  )}
                />
              )}
              <Controller
                name="especialidad"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    instanceId="unique-select-id"
                    {...field}
                    className="mt-2 mb-2"
                    options={options}
                    placeholder="Especialidad"
                    required={true}
                    isLoading={isLoading}
                    onInputChange={(value) => {
                      if (value.length >= 3) {
                        fetchEspecialidadInterconsulta(value);
                      } else {
                        setOptions([]);
                      }
                    }}
                  />
                )}
              />

              <textarea {...register('motivo')} className='w-full border shadow mt-2 p-1' placeholder='Motivo' ></textarea>
              <button type="submit" className="w-36 py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent colorFondo text-white hover:focus:outline-none focus: disabled:opacity-50 disabled:pointer-events-none">
                Agregar
                <CgAdd />
              </button>
            </form>
            <details>
              <summary className='mt-3 cursor-pointer'>Lista interconsultas</summary>
              <table className={listadoInterconsulta?.length > 0 ? "tableT" : "hidden"} >
                <thead>
                  <tr>
                    <th scope="col" className="tableth">Departamento</th>
                    <th scope="col" className="tableth">Servicio</th>
                    <th scope="col" className="tableth">Motivo</th>
                    <th scope="col" className="tableth">Accion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {listadoInterconsulta && listadoInterconsulta.length > 0 && listadoInterconsulta.map((data: any, index: any) => (
                    <tr key={data?.idsolicitudespecialidad}>
                      <td className="tabletd w-24">{data.Descripcion}</td>
                      <td className="tabletd w-1/3">{data.Diagnostico} </td>
                      <td className="tabletd w-32">{data.motivo} </td>
                      <td className="tabletd">
                        <Tooltip text="Eliminar">
                          <GoTrash size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteInterconsulta(data?.idsolicitudespecialidad)} />
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>

          </fieldset>

        </div>
        <div >
          <form onSubmit={handleSubmit2(FormDestino)}>

            <fieldset className="border p-3 rounded-lg">
              <legend className="font-bold">Módulo Destino Atención</legend>

              {destinoAtencion?.length > 0 && (
                <Controller
                  name="destinoAtencion"
                  control={control2}
                  rules={{ required: "Este campo es obligatorio" }}  // Reglas de validación
                  defaultValue={cuentaDatos?.idDestinoAtencion || ""}
                  render={({ field, fieldState }) => (
                    <div>
                      <select
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full border mt-2 p-2 rounded shadow-sm"
                      >
                        <option value="">Seleccione una opción</option>
                        {destinoAtencion.map((data: any) => (
                          <option key={data?.IdDestinoAtencion} value={data?.IdDestinoAtencion}>
                            {data?.DescripcionLarga}
                          </option>
                        ))}
                      </select>
                      {/* Mostrar mensaje de error */}
                      {fieldState?.error && <p className="text-red-500">{fieldState?.error?.message}</p>}
                    </div>
                  )}
                />

              )}
            </fieldset>

            <fieldset className='border p-3 mt-8'>
              <legend className="font-bold">Observaciones</legend>

              {destinoAtencion?.length > 0 && (
                <Controller
                  name="observaciones"
                  control={control2}
                  render={({ field }) => (
                    <textarea rows={4} className='inputSelect ' {...field} placeholder="Examen" />
                  )}
                />
              )}
            </fieldset>
            {cuentaDatos?.IdTipoSexo == 2 && (
              <>
                <fieldset className='border p-3 mt-8'>
                  <legend>Salud Materna</legend>
                  <Controller
                    name="condicionMaterna"
                    control={control2}
                    defaultValue=""
                    rules={{ required: "Por favor, selecciona una opción" }}
                    render={({ field, fieldState }) => (
                      <div className="space-y-4">
                        {opcionCondicionMaterna.map((opcion) => (
                          <label
                            key={opcion.id}
                            className="flex items-center space-x-4 cursor-pointer"
                          >
                            <input
                              type="radio"
                              {...field}
                              value={String(opcion.id)} // Convertimos el id a string
                              checked={String(field.value) === String(opcion.id)} // Convertimos ambos a string para comparación
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                            />
                            <span className="text-gray-600 font-medium">{opcion.valor}</span>
                          </label>
                        ))}
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </fieldset>
              </>
            )}
          </form>
        </div>
      </div>
      <div className='mt-6 col-span-2 w-11/12 m-14'>
        {
          referenciaView && (
            <ReferenciaDestino />
          )
        }
      </div>
      <div className="flex justify-end mt-6 col-span-2 gap-2">
      
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={handleButtonClick}
          className={`flex items-center px-4 py-2 rounded focus:outline-none ${isSubmitting ? 'bg-gray-400' : 'colorFondo'} text-white`}
        >
          {isSubmitting ? (
            <Loading />
          ) : (
            <>
            <FiSave  className="mr-2" />
              Guardar y finalizar
            </>
          )}
        </button>
      </div>
    </div>

  )
}
