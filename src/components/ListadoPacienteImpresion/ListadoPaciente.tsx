'use client'
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';



type InputBusquedad = {
  idDepa: any,
  idEspe: any,
  desde: string,
  hasta: string,
  idServicio: any,
}

const Select = dynamic(() => import('react-select'), { ssr: false });

export const ListadoPacienteImpresion = () => {

  const [dataTotal, setDataTotal] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [especialidad, setEspecialidad] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [dataListadoPX, setDataListadoPX] = useState<any[]>([]);
  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<InputBusquedad>();

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

  const onSubmit: SubmitHandler<InputBusquedad> = async (formData) => {

    setDataListadoPX([])
    setLoading(true)
    let idDepa = formData?.idDepa?.value | 0;
    let idEspe = formData?.idEspe?.value | 0;
    let idServicio = formData?.idServicio?.value | 0;
    const { data } = await axios.get(`${process.env.apiurl}/CitadosBloque/${formData?.desde}/${formData?.hasta}/${idDepa}/${idEspe}/${idServicio}`)
    setLoading(false)
    setDataListadoPX(data)
  };

  const [departamentoLabel, especialidadLabel, servicioLabel, desde, hasta] = watch(['idDepa', 'idEspe', 'idServicio', 'desde', 'hasta']);

  return (
    <div className="h-full bg-slate-400 md:bg-white p-3">
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          /* Ocultar elementos específicos del menú */
          .menu, .menu * {
            display: none !important;
          }

          /* Ajustar la tabla a una página A4 */
          @page {
            size: A4;
            margin: 20mm;
          }

          table {
            width: 100%;
            font-size: 12px;
            border-collapse: collapse;
          }

          th, td {
            padding: 8px;
            border: 1px solid black;
            word-wrap: break-word;
          }
        }
      `}</style>

      <div className="block print:hidden">
        <h1 className="print-hidden">Listado de Especialidades</h1>
        <form className='print-hidden' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex gap-4 justify-around'>
            <Controller
              name="idDepa"
              control={control}
              render={({ field }) => (
                <Select
                  className='flex-1'
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
                  options={especialidad}
                  placeholder="Especialidad"
                  isSearchable
                  className='flex-1'
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
                  options={servicios}
                  placeholder="Consultorio"
                  isSearchable
                  className='flex-1'
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                  }}
                  value={field.value}
                />
              )}
            />

          </div>

          <div className='flex gap-4 justify-around mt-4'>
            <div className='flex flex-col flex-1'>
              <input
                {...register('desde', { required: true })}
                type="date"
                className=" py-2 px-4 border h-10 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.desde &&
                <span className='text-red-500 font-semibold'>Este campo es requerido (*)</span>
              }

            </div>

            <div className='flex flex-col flex-1'>
              <input
                {...register('hasta', { required: true })}
                type="date"
                className=" py-2 px-4 border h-10 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.hasta &&
                <span className='text-red-500 font-semibold'>Este campo es requerido (*)</span>
              }
            </div>
            <button type="submit" className="flex-1 h-10 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Buscar
            </button>
          </div>




        </form>
        <div className="print-hidden flex flex-col justify-center">

          <button
            className="bg-blue-600 flex items-center justify-center space-x-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-3"
            onClick={() => window.print()}
          >
            Imprimir Lista
          </button>
          {(departamentoLabel?.label || especialidadLabel?.label || servicioLabel?.label) ? (
            <label className='block uppercase mt-2 bg-blue-50 border border-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-md shadow-md"'>
              {departamentoLabel?.label} {especialidadLabel?.label ? "-" + especialidadLabel?.label : ""} {servicioLabel?.label ? "-" + servicioLabel?.label : ""}
            </label>
          ) : null}

          {(desde || hasta) ? (
            <label className='block bg-blue-50 mt-2 border border-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-md shadow-md'>
              {desde ? "Fecha inicio :" + desde : ""} {hasta ? "Fecha fin :" + hasta : ""}
            </label>
          ) : null}
        </div>
      </div>

      <div className='print:block mt-2'>



        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border overflow-hidden dark:border-neutral-700">
              <div className="printable-area flex flex-col mt-3">
                {loading ? (
                  <div className="flex justify-center items-center h-screen">
                    <div className="rounded-full h-20 w-20 bg-blue-600 animate-ping"></div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                      <tr>
                        <th colSpan={6} className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase dark:text-neutral-500">

                        </th>
                      </tr>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase dark:text-neutral-500">CTA.</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase dark:text-neutral-500">DNI/HC</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase dark:text-neutral-500">APELLIDOS Y NOMBRES</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase dark:text-neutral-500">IAFA</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase dark:text-neutral-500">HORA</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase dark:text-neutral-500">TELÉFONO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {dataListadoPX.length > 0 ? (
                        dataListadoPX.map((data: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{data.idCuentaAtencion}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{data.nroDocumento}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{data.paciente}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{data.iafa}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{data.horaInicio}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{data.telefono}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center p-4 text-gray-500">No hay datos disponibles</td>
                        </tr>
                      )}
                    </tbody>
                  </table>)}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ListadoPacienteImpresion;
