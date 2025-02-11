'use client'
import { getData } from '@/components/helper/axiosHelper'
import { debounce } from '@mui/material';
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { CiLogout } from 'react-icons/ci';


export const Transferencias = ({ datosEmergencia,session }: any) => {

  const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
  const [optionMedicosG, setoptionMedicosG] = useState<any[]>([])
  const [optionMedicos, setoptionMedicos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [optionsS, setOptionsS] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [dataTransferencias, setDataTransferencias] = useState<any[]>([]);
  const getMedicosGeneral = async (nom: string) => {
    try {
      const response = await getData(`${process.env.apijimmynew}/apimedicobynomape/${nom}`);
      console.log(response)
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
    console.log(response)
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
      idproducto: est.idproducto
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
    const objetoEnviar = {
      idiagnostico: data.IdDiagnostico.value,
      IdMedicoSolicitante: data.IdMedicoIngreso.value,
      IdServicio: data.IdServicio.value,
      idmedicoDestino: data.idmedico.value,
      idproducto: data.idproducto
    }
    console.log(data)
  }

  const getTransferencias = async (idatencion: any) => {
    const data = await getData(`${process.env.apijimmynew}/emergencia/AtencionesEstanciaHospitalariaSeleccionarPorIdCuentaAtencion/${idatencion}`);
    console.log(`${process.env.apijimmynew}/emergencia/AtencionesEstanciaHospitalariaSeleccionarPorIdCuentaAtencion/${idatencion}`)
    setDataTransferencias(data)
  }
  useEffect(() => {
    if (datosEmergencia) {
      getTransferencias(datosEmergencia?.idatencion)
    }
  }, [datosEmergencia])
  const eliminarPorId = (id: number) => {

    setDataTransferencias(prevData => {
      const newData = prevData.filter(item => item.IdEstanciaHospitalaria !== id);

      const updatedData = newData
        .sort((a, b) => a.IdEstanciaHospitalaria - b.IdEstanciaHospitalaria)
        .map((item, index) => ({
          ...item,
          Secuencia: index + 2,
        }));

        const nuevo = newData
        .sort((a, b) => a.IdEstanciaHospitalaria - b.IdEstanciaHospitalaria)
        .map((item, index, array) => ({
          IdAtencion:datosEmergencia?.idatencion,
          IdMedicoOrdena:item?.IdMedicoOrdena,
          IdServicio:item?.IdServicio,
          HoraOcupacion:item?.HoraOcupacion,
          Secuencia:index+1,
          LlegoAlServicio: index === array.length - 1 ? 0 : 1,
          idProducto:item?.idProducto,
          IdDiagnosticoTrasf:item?.IdDiagnostico,
          IdUsuarioAuditoria:item?.IdUsuarioAuditoria
        }));

        registroTransferencias(nuevo)
      
      return newData;
    });
  };

  const registroTransferencias=(data:any)=>{
    console.log("************")
    console.log(data)
  }
 
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
                      console.log(selectedOption);
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
            <button type='submit' className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">
              Agregar
            </button>

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
                <th className="border border-gray-300 px-4 py-2 text-left">Acciones</th>
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
          <td className="border border-gray-300 px-4 py-2">
            <button
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition"
              onClick={() => eliminarPorId(data?.IdEstanciaHospitalaria)}
            >
              Eliminar
            </button>
          </td>
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
