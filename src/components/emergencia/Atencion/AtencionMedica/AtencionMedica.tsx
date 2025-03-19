import { getData } from '@/components/helper/axiosHelper';
import { showConfirmDeleteAlert, showSuccessAlert, showSuccessError } from '@/components/utils/alertHelper';
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
  const [estadoAlta, setestadoAlta] = useState();

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
    const responseClasificacionDx = await getData(`${process.env.apijimmynew}/diagnosticos/clasificacionEmergenciaEgreso`);
    const filtradoClasificacion=responseClasificacionDx.filter((data:any)=>
      ['D', 'P','R'].includes(data?.codigo)
    )
    setOptionsClasificacionDx(filtradoClasificacion);
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
    const objeto = {
      idDestinoAtencion:parseInt(data?.destino, 10),
      idMedicoEgreso:data?.idmedico?.value,
      fechaEgreso:data?.fechaEgreso,
      horaEgreso:data?.horaEgreso,
      idCondicionAlta:parseInt(data?.idCondicionAlta),
      idTipoAlta:parseInt(data?.idTipoAlta),
      idEstadoAtencion:1,
      idPaciente:datosEmergencia?.idpaciente,
      pronostico: data?.Pronostico,
      recomendacionesyTratamiento: data?.RecomendacionesyTratamiento,
      enfermedadActual: data?.EnfermedadActual,
      idAtencion:datosEmergencia?.idatencion
    }
 
    if(datosEmergencia.diagnosticos?.filter((data:any)=>data.idClasificacionDx==3).length > 0){
      try {
        const dataresponse=await axios.put(`${process.env.apijimmynew}/emergencia/AltasEmergencia/${datosEmergencia?.idcuentaatencion}`,objeto);
        showSuccessAlert("Se dio de Alta Correctamente")
      } catch (error) {
        showSuccessError(`${error}`)
      }
     
    }else{
      showSuccessError(`Ingrese un diagnostico de salida`)
    }
   
 
  }

  const FormDx: SubmitHandler<any> = async (data: any) => {
   const subClasificacion = optionsClasificacionDx.find((item: any) => item.idSubclasificacionDx == data.idSubclasificacionDx);
   await setDiagnosticoByCuenta(
      data.IdDiagnostico.value,
      data.IdDiagnostico.label,
      data.IdDiagnostico.codigoCIE10,
      data.idSubclasificacionDx,
      subClasificacion.descripcion,
      '',
      3,
      data.idOrdenDx
    ); 
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; 
    }
    if (datosEmergencia.diagnosticos.length > 0 && !eliminandoDiagnostico) {
      getAddDx()
    }
  }, [datosEmergencia.diagnosticos])
  const getAddDx = async () => {
    const data = await axios.delete(`${process.env.apijimmynew}/diagnosticos/deleteByIdAtencionAndIdClasificacionDx/${datosEmergencia?.idatencion}/3`);
    const requests = datosEmergencia.diagnosticos.filter((data:any)=>data.idClasificacionDx==3).map((data: any) => {
      const DxSend = {
        labConfHIS: "",
        idAtencion: datosEmergencia?.idatencion,
        idDiagnostico: data?.IdDiagnostico,
        idSubclasificacionDx: data?.idSubclasificacionDx,
        idClasificacionDx: 3,
        idAtencionDiagnostico: datosEmergencia?.idatencion,
        idUsuarioAuditoria: session?.user?.id,
        idordenDx:data?.idordenDx,
      };
      console.log("data envio")
      console.log(DxSend)
      return axios.post(`${process.env.apijimmynew}/diagnosticos/agregarAtencionDiagnostico`, DxSend);
    });
    ToasterMsj("Exito", "success", "Actualización diagnostico.")/**/
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
  const handleButtonClick = () => {
    handleSubmit(Form)();
};
  return (
    <>
   
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
                name="idTipoAlta"
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
                name="idCondicionAlta"
                idKey="idCondicionAlta"
                labelKey="descripcion"
                rules={{ required: "Este campo es obligatorio" }}
              />
            </div>
            <div >
              <label className="block text-sm font-medium">Fecha y hora alta</label>
              <div className='flex gap-2'>
              <input type="date" 
              {...register('fechaEgreso')}
              className="w-full border rounded-md p-2 basis-2/3" />
                <input
    type="time"
    {...register('horaEgreso')}
    className="w-full border rounded-md p-2 basis-1/3"
  />

              </div>
             
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
                name="idSubclasificacionDx"
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
                name="idOrdenDx"
                idKey="idOrdenDx"
                labelKey="descripcion"
                rules={{ required: "Este campo es obligatorio" }}
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center">
              Agregar Dx
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className={datosEmergencia.diagnosticos?.filter((data:any)=>data.idClasificacionDx==3).length > 0 ? "tableT  w-3/4" : "hidden"}>
            <thead>
              <tr>
                <th scope="col" className="tableth">Clasificacion</th>
                <th scope="col" className="tableth ">Diagnostico</th>

                <th scope="col" className="tableth">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {datosEmergencia.diagnosticos.filter((data:any)=>data.idClasificacionDx==3)
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
       
        <div className="mt-6 flex space-x-4">
          {datosEmergencia?.idTipoAlta==null ?(
            <button className="bg-green-500 text-white px-4 py-2 rounded-md"   onClick={handleButtonClick} >Aceptar (F2)</button>
          ):(
            <>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Papeleta de Alta</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md"   onClick={handleButtonClick} >Revertir alta</button>
            </>
            
          )
         
        
        }
        
          

        </div>
      </div>

    </>
  )
}
