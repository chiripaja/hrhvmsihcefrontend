'use client'
import { getData } from '@/components/helper/axiosHelper'
import { debounce } from '@mui/material';
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { obtenerFechaYHora } from '@/components/utils/obtenerFechaYHora';
import Swal from 'sweetalert2';

export const Transferencias = ({ datosEmergencia, session }: any) => {

  const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
  const [optionMedicosG, setoptionMedicosG] = useState<any[]>([])
  const [optionMedicos, setoptionMedicos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [optionsS, setOptionsS] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const { formattedDate, hora, fechayhora } = obtenerFechaYHora();
  const [dataTransferencias, setDataTransferencias] = useState<any[]>([]);
  const getMedicosGeneral = async (nom: string) => {
    try {
      const response = await getData(`${process.env.apijimmynew}/apimedicobynomape/${nom}`);
      const mappedOptions = response.map((est: any) => ({
        value: est.IdMedico,
        label: est.nommed,
      }));
      setoptionMedicosG(mappedOptions);
    } catch (error) {
      console.error("Error al obtener médicos:", error);
    }
  };

  const handleSelectChange = (selectedOption: any) => {
    getMedicos(selectedOption?.idEspecialidad)
  };

  const getMedicos = async (idespecialidad: any) => {
    const response = await getData(`${process.env.apijimmynew}/emergencia/MedicosFiltrar/${idespecialidad}`);
    const mappedOptions = response.map((est: any) => ({
      value: est.IdMedico,
      label: `${est.Nombres + ' ' + est.ApellidoPaterno + ' ' + est.ApellidoMaterno}`,
    }));
    setoptionMedicos(mappedOptions)
  }

  useEffect(() => {
    fetchCombosEmergencia()
  }, [])

  const fetchCombosEmergencia = async () => {
    const response = await getData(`${process.env.apijimmynew}/emergencia/ServiciosFiltrar`);
    const mappedOptions = response.map((est: any) => ({
      value: est.idServicio,
      label: `${est.nombre.trim()}`,
      idEspecialidad: est.idEspecialidad,
      idproducto: est.idProducto
    }));
    setOptionsS(mappedOptions);
  }


  const fetchDx = useCallback(
    debounce(async (nomdx) => {
      try {
        setIsLoading(true);
        const response = await getData(`${process.env.apijimmynew}/diagnosticos/findByName/${nomdx}`);
        const mappedOptions = response.map((est: any) => ({
          value: est.idDiagnostico,
          label: `${est.codigoCIE10} - ${est.descripcion}`,
          codigoCIE10: est.codigoCIE10
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

  const FormTransferencias: SubmitHandler<any> = async (data: any) => {
    const nuevoArray = [...dataTransferencias];
    const nuevo = nuevoArray
      .slice()
      .sort((a, b) => a.IdEstanciaHospitalaria - b.IdEstanciaHospitalaria)
      .map((item, index, array) => ({
        idAtencion: datosEmergencia?.idatencion,
        idMedicoOrdena: item?.IdMedicoOrdena,
        idServicio: item?.IdServicio,
        horaDesocupacion:  item?.HoraDesocupacion !== null ? item?.HoraDesocupacion : hora,
        fechaDesocupacion: item?.FechaDesocupacion !== null ? item?.FechaDesocupacion : formattedDate,
        horaOcupacion:  item?.HoraOcupacion,
        fechaOcupacion: item?.FechaOcupacion,
        secuencia: item?.Secuencia,
        llegoAlServicio: 1,
        idProducto: item?.idProducto,
        idDiagnosticoTrasf: item?.IdDiagnostico,
        idUsuarioAuditoria: item?.IdUsuarioAuditoria
      }));
    const ultimo = nuevo[nuevo.length - 1];
    const objetoEnviar = {
      idAtencion: datosEmergencia?.idatencion,
      idMedicoOrdena: data?.IdMedicoIngreso.value,
      idServicio: data.IdServicio.value,
      horaDesocupacion: null,
      fechaDesocupacion: null,
      horaOcupacion: hora,
      fechaOcupacion: formattedDate,
      secuencia: ultimo.secuencia + 1,
      llegoAlServicio: 0,
      idProducto: data.IdServicio?.idproducto,
      idDiagnosticoTrasf: data.IdDiagnostico.value,
      idUsuarioAuditoria: parseInt(session?.user?.id, 10) || null
    };
    const nuevoConObjeto = [...nuevo, objetoEnviar];
  

    await axios.put(`${process.env.apijimmynew}/emergencia/AtencionesEstanciaHospitalaria/${datosEmergencia?.idatencion}/${data.IdServicio.value}`)
    registroTransferencias(nuevoConObjeto);
  }

  const getTransferencias = async (idatencion: any) => {
    const data = await getData(`${process.env.apijimmynew}/emergencia/AtencionesEstanciaHospitalariaSeleccionarPorIdCuentaAtencion/${idatencion}`);
    setDataTransferencias(data)
  }

  useEffect(() => {
    if (datosEmergencia) {
      getTransferencias(datosEmergencia?.idatencion)
    }
  }, [datosEmergencia])

  const eliminarPorId = (id: number) => {

    Swal.fire({
      title: "¿Seguro que quieres eliminarlo?",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No, Cancelar`
  }).then(async (result) => {
      if (result.isConfirmed) {
          try {
            const nuevoArray = [...dataTransferencias];
            const nuevo = nuevoArray.filter(item => item.IdEstanciaHospitalaria !== id)
            .slice()
            .sort((a, b) => a.IdEstanciaHospitalaria - b.IdEstanciaHospitalaria)
            .map((item, index, array) => ({
              idAtencion: datosEmergencia?.idatencion,
              idMedicoOrdena: item?.IdMedicoOrdena,
              idServicio: item?.IdServicio,
              horaDesocupacion: index === array.length - 1 ? null : item?.HoraDesocupacion ,
              fechaDesocupacion:  index === array.length - 1 ? null : item?.FechaDesocupacion , 
              horaOcupacion:   item?.HoraOcupacion,
              fechaOcupacion: item?.FechaOcupacion,
              secuencia: index + 1,
              llegoAlServicio: index === array.length - 1 ? 0 : 1,
              idProducto: item?.idProducto,
              idDiagnosticoTrasf: item?.IdDiagnostico,
              idUsuarioAuditoria: item?.IdUsuarioAuditoria
            }))
           
            registroTransferencias(nuevo)
              Swal.fire("Se eliminó!", "", "success");
          } catch (error) {
              Swal.fire("Hubo un error al eliminar la cuenta.", "", "error");
              console.error(error);
          }
      }
  });
  
  };

  const registroTransferencias = async (data: any) => {
    try {
      // Primero, ejecutar el DELETE
      await axios.delete(
        `${process.env.apijimmynew}/emergencia/AtencionesEstanciaHospitalariaEliminaXidAtencion/${datosEmergencia?.idatencion}`
      );
  
      // Luego, ejecutar el POST solo si el DELETE fue exitoso
      const response = await axios.post(
        `${process.env.apijimmynew}/emergencia/AtencionesEstanciaHospitalariaAgregar`,
        data
      );
      getTransferencias(datosEmergencia?.idatencion)
      if (response.status === 200 || response.status === 201) {
        return response.data; // Retorna la respuesta si es necesario
      } else {
        console.error("Error al guardar: Código de estado inesperado", response.status);
      }
    } catch (error: any) {
      console.error("Error en la solicitud:", error.response?.data || error.message);
    }
  };
  

  return (
    <>
      <div className="p-6 bg-gray-100">
        {/* Formulario */}
        <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={handleSubmit(FormTransferencias)}>
          {/* Primera fila */}
          <div className="grid grid-cols-1 gap-4">
            <label className="block text-sm font-medium text-gray-700">Médico Ordena:</label>
            <div>
              <Controller
                name="idmedico"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    instanceId="unique-select-id"
                    {...field}
                    options={optionMedicosG}
                    placeholder="Médicos"
                    className="w-full"
                    required
                    isClearable
                    isSearchable
                    onInputChange={(inputValue) => {
                      if (inputValue.length > 2) {
                        getMedicosGeneral(inputValue);
                      }
                    }}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                    }}
                  />
                )}
              />
              <label className="block text-sm font-medium text-gray-700">Servicio recibe:</label>
              <Controller
                name="IdServicio"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    instanceId="unique-select-id"
                    {...field}
                    options={optionsS}
                    placeholder="Servicios Emergencia"
                    className='w-full'
                    required={true}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      handleSelectChange(selectedOption);
                    }}
                  />
                )}
              />
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700">Médico recibe : </label>
              <Controller
                name="IdMedicoIngreso"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    instanceId="unique-select-id"
                    {...field}
                    className='w-full'
                    options={optionMedicos}
                    placeholder="Medico"
                    required={true}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Diagnostico: </label>
              <Controller
                name="IdDiagnostico"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    instanceId="unique-select-id"
                    {...field}
                    className="mt-2 mb-2"
                    options={options}
                    required={true}
                    placeholder={isLoading ? 'Cargando...' : 'Seleccione un diagnostico'}
                    isLoading={isLoading}
                    onInputChange={(value) => {
                      if (value.length >= 3) {
                        fetchDx(value);
                      } else {
                        setOptions([]);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>



          {/* Botones */}
          <div className="flex space-x-4">
          {datosEmergencia?.idTipoAlta==null &&(
            
            <button type='submit' className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">
              Agregar
            </button>
          )}
          </div>
        </form>



        {/* Tabla */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Fecha Transf</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Hora</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Servicio</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Médico Ordena</th>
                {datosEmergencia?.idTipoAlta==null &&(
                <th className="border border-gray-300 px-4 py-2 text-left">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {dataTransferencias &&
                dataTransferencias.map((data: any) =>
                  data?.Secuencia !== 1 ? ( // Usamos `!==` en lugar de `!=` por buenas prácticas
                    <tr key={data?.IdEstanciaHospitalaria}>
                      <td className="border border-gray-300 px-4 py-2">{data?.FechaOcupacion}</td>
                      <td className="border border-gray-300 px-4 py-2">{data?.HoraOcupacion}</td>
                      <td className="border border-gray-300 px-4 py-2">{data?.NombreServicio}</td>
                      <td className="border border-gray-300 px-4 py-2">{data?.NomMedico}</td>
                      {datosEmergencia?.idTipoAlta==null &&(
                      <td className="border border-gray-300 px-4 py-2">
                   
                        <button
                          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition"
                          onClick={() => eliminarPorId(data?.IdEstanciaHospitalaria)}
                        >
                          Eliminar
                        </button>
                      </td>)}
                    </tr>
                  ) : null
                )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
