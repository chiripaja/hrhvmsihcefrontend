'use client'
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ModalGenerico } from '../ui/ModalGenerico';
import { ModalGeneric } from '../ui/ModalGeneric/ModalGeneric';
import { TriajeDif } from '../TriajeDiferenciado/TriajeDif';
import { ThemeProvider } from "@emotion/react"
import { Box, createTheme } from "@mui/material"
import { esES } from '@mui/x-data-grid/locales';
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from "@mui/x-data-grid"

const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    esES,
);
type InputBusquedad = {
  idDepa: any,
  idEspe: any,
  desde: string,
  hasta: string,
  idServicio: any,
}

const Select = dynamic(() => import('react-select'), { ssr: false });

export const ListadoPacienteImpresion = ({session}:any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataTotal, setDataTotal] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [especialidad, setEspecialidad] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [dataListadoPX, setDataListadoPX] = useState<any[]>([]);
  const [cuentaTriar, setCuentaTriar] = useState<any[]>([]);
  const { control, register, handleSubmit, watch, setValue,getValues, formState: { errors } } = useForm<InputBusquedad>();
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

  const onSubmit: SubmitHandler<InputBusquedad> = async (formData) => {

    setDataListadoPX([])
    setLoading(true)
    let idDepa = formData?.idDepa?.value | 0;
    let idEspe = formData?.idEspe?.value | 0;
    let idServicio = formData?.idServicio?.value | 0;
    const { data } = await axios.get(`${process.env.apiurl}/CitadosBloque/${formData?.desde}/${formData?.hasta}/${idDepa}/${idEspe}/${idServicio}`)
    console.log(data)
    const datafiltrada = data.filter((data: any) => data.idCuentaAtencion != 0)
    setLoading(false)
    setDataListadoPX(datafiltrada)

    
  };
  const rows = dataListadoPX.map((item) => ({
  id: item.idCita, // ID único requerido por DataGrid
  ...item
}));

 const columns: GridColDef[] = [
  { field: 'nombre', headerName: 'Servicios', flex: 1 },
  { field: 'idCuentaAtencion', headerName: 'Cta.', flex: 1 },
  { field: 'nroDocumento', headerName: 'DNI/HC', flex: 1 },
  { field: 'paciente', headerName: 'Apellidos y Nombres', flex: 1 },
  { field: 'iafa', headerName: 'IAFA', flex: 1 },
  { field: 'horaInicio', headerName: 'Hora', flex: 1 },
  { field: 'telefono', headerName: 'Teléfono', flex: 1 },

  {
    field: 'triaje',
    headerName: 'Triar',
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const peso = params.row.triajePeso;
      const idCuenta = params.row.idCuentaAtencion;
      const isTriado = peso != null && peso !== '';
      return (
        <button
          onClick={() => openModal({ idcuenta: idCuenta })}
          className={`w-24 h-12 font-semibold rounded-lg shadow-md text-white transition duration-300 ${
            isTriado
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isTriado ? 'Modificar' : 'Triar'}
        </button>
      );
    },
  },
];
    
  const [departamentoLabel, especialidadLabel, servicioLabel, desde, hasta] = watch(['idDepa', 'idEspe', 'idServicio', 'desde', 'hasta']);
const volverAEjecutarBusqueda = () => {
   const valoresActuales = getValues(); // obtienes los valores actuales del formulario
  handleSubmit(onSubmit)(valoresActuales as any);
};
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
  <h1 className="print-hidden text-xl font-semibold mb-4">Listado de Especialidades</h1>

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

      <button
        type="submit"
        className="w-full md:w-auto h-10 px-6 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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

    {(departamentoLabel?.label || especialidadLabel?.label || servicioLabel?.label) && (
      <label className="block uppercase bg-blue-50 border border-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-md shadow-md">
        {departamentoLabel?.label} {especialidadLabel?.label ? ' - ' + especialidadLabel?.label : ''} {servicioLabel?.label ? ' - ' + servicioLabel?.label : ''}
      </label>
    )}

    {(desde || hasta) && (
      <label className="block bg-blue-50 border border-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-md shadow-md">
        {desde && `Fecha inicio: ${desde}`} {hasta && ` Fecha fin: ${hasta}`}
      </label>
    )}
  </div>
</div>


      <div className='print:block mt-2'>




        <ThemeProvider theme={theme}>
                                <Box sx={{ height: 700, width: 1 }}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        slots={{ toolbar: GridToolbar }}
                                        slotProps={{
                                            toolbar: {
                                                showQuickFilter: true,
                                            },
                                        }}
                                    />
                                </Box>
                            </ThemeProvider>

      </div>
      <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>
        <label className="text-lg font-semibold text-gray-900">Triaje</label>
        <div className="text-sm text-gray-600">
          <TriajeDif idcuentaatencion={cuentaTriar} usuario={session} closeModal={closeModal}   volverABuscar={volverAEjecutarBusqueda}/>
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
};

export default ListadoPacienteImpresion;
