import { getData } from '@/components/helper/axiosHelper';
import { showConfirmDeleteAlert } from '@/components/utils/alertHelper';
import SelectGenerico from '@/components/utils/SelectGenerico';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import { debounce } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';

import { useEmergenciaDatosStore } from '@/store/ui/emergenciadatos';
export const AtencionMedica = ({ datosEmergencia, session }: any) => {
  const { handleSubmit, control, register } = useForm();
  const { handleSubmit: handleSubmit2, control: control2, register: register2 } = useForm();
  const [opcionesDestinoAtencion, setopcionesDestinoAtencion] = useState<any[]>([]);
  const [opcionesAltas, setOpcionesAltas] = useState<any[]>([]);
  const [opcionesCondicion, setOpcionesCondicion] = useState<any[]>([]);
  const [optionMedicosG, setoptionMedicosG] = useState<any[]>([]);
  const [optionsOrdenDx, setOptionsOrdenDx] = useState<any[]>([]);
  const [optionsClasificacionDx, setOptionsClasificacionDx] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [optionsDx, setOptionsDx] = useState<any[]>([]);
  const setEliminarDiagnosticoByCuenta = useEmergenciaDatosStore((state: any) => state.setEliminarDiagnosticoByCuenta);
  const isFirstRender = useRef(true);
  const [eliminandoDiagnostico, setEliminandoDiagnostico] = useState(Boolean);
  const setDiagnosticoByCuenta = useEmergenciaDatosStore((state: any) => state.setDiagnosticoByCuenta)
  const GetDataIni = async () => {
    const responseDestino = await getData(`${process.env.apijimmynew}/emergencia/TiposDestinoAtencionSeleccionarDestinosDeConsultorioEmergencia`);
    setopcionesDestinoAtencion(responseDestino);
    const responseAlta = await getData(`${process.env.apijimmynew}/emergencia/tiposAlta`);
    setOpcionesAltas(responseAlta);
    const responseCondicion = await getData(`${process.env.apijimmynew}/emergencia/TiposCondicionAlta`);
    setOpcionesCondicion(responseCondicion);
    const responseOrdenDx = await getData(`${process.env.apijimmynew}/diagnosticos/OrdenDiagnosticos`);
    setOptionsOrdenDx(responseOrdenDx);
    const responseClasificacionDx = await getData(`${process.env.apijimmynew}/diagnosticos/clasificacionEmergencia`);
    setOptionsClasificacionDx(responseClasificacionDx);
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
        setOptionsDx(mappedOptions);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setOptionsDx([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    GetDataIni()
  }, [])
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
  };
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
  const Form: SubmitHandler<any> = async (data: any) => {
    console.log(data)
    const objeto = {
      Pronostico: data?.Pronostico,
      RecomendacionesyTratamiento: data?.RecomendacionesyTratamiento,
      EnfermedadActual: data?.EnfermedadActual,
    }
  }

  const FormDx: SubmitHandler<any> = async (data: any) => {
    const subClasificacion = optionsClasificacionDx.find((item: any) => item.idSubclasificacionDx == data.idSubclasificacionDx);
    console.log(optionsClasificacionDx)
    console.log("------------------")
    console.log(data)
    console.log("*****************")
    console.log(subClasificacion)
    /*await setDiagnosticoByCuenta(
      data.IdDiagnostico.value,
      data.IdDiagnostico.label,
      data.IdDiagnostico.codigoCIE10,
      data.IdSubclasificacionDx,
      subClasificacion.descripcion,
      ''
    );*/
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Evita la ejecución en el primer render
    }
    if (datosEmergencia.diagnosticos.length > 0 && !eliminandoDiagnostico) {
      getAddDx()
    }
  }, [datosEmergencia.diagnosticos])
  const getAddDx = async () => {
    const data = await axios.delete(`${process.env.apijimmynew}/diagnosticos/deleteByIdAtencionAndIdClasificacionDx/${datosEmergencia?.idatencion}/2`);
    const requests = datosEmergencia.diagnosticos.map((data: any) => {
      const DxSend = {
        labConfHIS: "",
        idAtencion: datosEmergencia?.idatencion,
        idDiagnostico: data?.IdDiagnostico,
        idSubclasificacionDx: data?.idSubclasificacionDx,
        idClasificacionDx: 3,
        idAtencionDiagnostico: datosEmergencia?.idatencion,
        idUsuarioAuditoria: session?.user?.id,
      };
      return axios.post(`${process.env.apijimmynew}/diagnosticos/agregarAtencionDiagnostico`, DxSend);
    });
    ToasterMsj("Exito", "success", "Actualización diagnostico.")
  }
  const handleDelete = async (IdDiagnostico: number, idClasificacionDx: number) => {
    try {
      showConfirmDeleteAlert().then(async (result) => {
        if (result.isConfirmed) {
          setEliminandoDiagnostico(true);
          await axios.delete(`${process.env.apijimmynew}/diagnosticos/deleteByIdDiagnosticoAndIdClasificacionDx/${IdDiagnostico}/3`);
          await setEliminarDiagnosticoByCuenta(IdDiagnostico, idClasificacionDx);
          ToasterMsj('Exito', 'success', 'Se elimino correctamente.');
        }
        else {
          console.log("no elimino")
        }
      });
    } catch (error) {
      console.error("Error al eliminar diagnóstico:", error);
    } finally {
      setEliminandoDiagnostico(false);
    }

  };
  return (
    <>
      <pre>
        {JSON.stringify(datosEmergencia?.diagnosticos, null, 2)}
      </pre>
      <div className="p-6 bg-white shadow-md rounded-md w-full max-w-7xl mx-auto">
        <form className="p-4" onSubmit={handleSubmit(Form)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Destino</label>
              <SelectGenerico
                opciones={opcionesDestinoAtencion}
                control={control}
                name="destino"
                idKey="IdDestinoAtencion"
                labelKey="DescripcionLarga"
                rules={{ required: "Este campo es obligatorio" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Tipo alta</label>
              <SelectGenerico
                opciones={opcionesAltas}
                control={control}
                name="TiposAltas"
                idKey="idTipoAlta"
                labelKey="descripcion"
                rules={{ required: "Este campo es obligatorio" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Servicio egreso</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value="0005 EMER. DE TRAUMATOLOGÍA HRHV"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Condición alta</label>
              <SelectGenerico
                opciones={opcionesCondicion}
                control={control}
                name="TiposCondicion"
                idKey="idCondicionAlta"
                labelKey="descripcion"
                rules={{ required: "Este campo es obligatorio" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Fecha alta</label>
              <input type="date" className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Médico egreso</label>
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
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="mt-4">
              <label className="block text-sm font-medium">Pronóstico y Evolución</label>
              <textarea className="w-full border rounded-md p-2 h-24"
                {...register('Pronostico')}
              ></textarea>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Recomendaciones y Tratamiento</label>
              <textarea className="w-full border rounded-md p-2 h-24" {...register('RecomendacionesyTratamiento')}></textarea>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Resumen Enfermedad Actual</label>
              <textarea className="w-full border rounded-md p-2 h-24"  {...register('EnfermedadActual')}></textarea>
            </div>
          </div>
        </form>
        <form onSubmit={handleSubmit2(FormDx)}>
          <h2 className="text-lg font-semibold mt-6">Diagnósticos de Egreso</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Diagnóstico</label>
              <Controller
                name="IdDiagnostico"
                control={control2}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    instanceId="unique-select-id"
                    {...field}
                    className=" mb-2"
                    options={optionsDx}
                    required={true}
                    placeholder={isLoading ? 'Cargando...' : 'Seleccione un diagnostico'}
                    isLoading={isLoading}
                    onInputChange={(value) => {
                      if (value.length >= 3) {
                        fetchDx(value);
                      } else {
                        setOptionsDx([]);
                      }
                    }}
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Tipo diagnóstico</label>
              <SelectGenerico
                opciones={optionsClasificacionDx}
                control={control2}
                name="TipoDx"
                idKey="idSubclasificacionDx"
                labelKey="descripcion"
                rules={{ required: "Este campo es obligatorio" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Orden</label>
              <SelectGenerico
                opciones={optionsOrdenDx}
                control={control2}
                name="tipoOrden"
                idKey="idOrdenDx"
                labelKey="descripcion"
                rules={{ required: "Este campo es obligatorio" }}
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center">
              Agregar
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center">
              Quitar
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className={datosEmergencia.diagnosticos?.length > 0 ? "tableT  w-3/4" : "hidden"}>
            <thead>
              <tr>
                <th scope="col" className="tableth">Clasificacion</th>
                <th scope="col" className="tableth ">Diagnostico</th>

                <th scope="col" className="tableth">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {datosEmergencia.diagnosticos
                .sort((a: any, b: any) => {
                  // Ordenar por nomdx (lexicográficamente)
                  if (a?.nomdx < b?.nomdx) return -1;  // Orden ascendente
                  if (a?.nomdx > b?.nomdx) return 1;
                  return 0;  // Si son iguales, no cambiar el orden
                })
                .map((data: any) => (
                  <tr key={data?.codigoCIE10 + data?.labConfHIS}>
                    <td className="tabletd w-10">{data?.subClasificacion}</td>
                    <td>
                      {data?.nomdx}

                    </td>

                    <td className="tabletd">
                      <button type="button" className="aAzul" onClick={() => handleDelete(data.IdDiagnostico, data.idClasificacionDx)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Tipo diagnóstico</th>
              <th className="border p-2">CIE</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Orden</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="border p-2 text-center text-gray-500">
                No hay diagnósticos agregados
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Papeleta de Alta</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">Aceptar (F2)</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancelar</button>
        </div>
      </div>

    </>
  )
}
