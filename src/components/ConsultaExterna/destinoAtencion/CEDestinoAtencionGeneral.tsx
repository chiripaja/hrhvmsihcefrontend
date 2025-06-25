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
  const { formattedDate, hora, fechayhora, formattedDate2 } = obtenerFechaYHora();
  const [referenciaView, setreferenciaView] = useState(false);
  const [sisfua, setsisfua] = useState<any>();

  const [sisFuaCabecera, setsisFuaCabecera] = useState<any>();
  const [sisFuaDx, setsisFuaDx] = useState<any[]>([]);

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


      Swal.fire({
        icon: "question",
        title: "¿Finalizar la consulta medica?",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`
      }).then(async (result) => {

        if (result.isConfirmed) {
          await axios.post(`${process.env.apijimmynew}/atenciones/atencionesActualizar`, objetoEnvio)
          Swal.fire(
            {
              icon: "success",
              title: "Atencion Guardada correctamente!",
              timerProgressBar: true,
              timer: 2000,
            });
          console.log("antes de generar a la fua")
          generarFua();
          //  router.push("/sihce/consultaexterna")
        } else if (result.isDenied) {
          Swal.fire("Cambios no fueron guardados", "", "info");
        }  /* 
*/
      });


    } catch (error) {
      console.log(error)
    } finally {

    }
  }


  const FormInterconsulta = async (data: any) => {
    try {

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

  const getSisfua = async () => {
    const data = await getData(`${process.env.apijimmynew}/fua/sisfua`);
    setsisfua(data)
  }


  const getListadoInterconsulta = async (idatencion: any) => {
    const data = await getData(`${process.env.apijimmynew}/atenciones/interconsulta/${idatencion}`)
    setListadoInterconsulta(data)
  }

  useEffect(() => {
    getListadoDestinoAtencion()
    getSisfua()
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
  const generarFua = async () => {
    const validadSis = await getData(`${process.env.apijimmynew}/fua/validadExisteFuaByIdCuenta/${cuentaDatos?.idcuentaatencion}`)
    let dataFuaCabecera;
    if (cuentaDatos?.idSiasis) {
      const ultimoNum = await getData(`${process.env.apijimmynew}/fua/SisFuaAtencionConsultarUltimoNumero/${sisfua[0]?.fuaNumeroInicial}/${sisfua[0]?.fuaNumeroFinal}`)
      const nuevoFuaNumero = parseInt(ultimoNum?.FuaNumero || '0', 10) + 1;
      let dataCondicionMaterna;
      if (cuentaDatos.idCondicionMaterna == null || cuentaDatos.idCondicionMaterna == '3') {
        dataCondicionMaterna = 0;
      } else {
        dataCondicionMaterna = cuentaDatos.idCondicionMaterna
      }
      let dataDestinoAtencion;
      const destino = Number(destinoAtencionW);
      switch (destino) {
        case 10:
          dataDestinoAtencion = 1;
          break;
        case 60:
          dataDestinoAtencion = 2;
          break;
        case 83:
          dataDestinoAtencion = 3;
          break;
        case 84:
          dataDestinoAtencion = 4;
          break;
        case 89:
          dataDestinoAtencion = 5;
          break;
        case 13:
          dataDestinoAtencion = 6;
          break;
        case 25:
          dataDestinoAtencion = 7;
          break;
        case 11:
          dataDestinoAtencion = 8;
          break;
        default:
          dataDestinoAtencion = 0;
          break;
      }
      dataFuaCabecera = {
        idCuentaAtencion: cuentaDatos?.idcuentaatencion,
        fuaDisa: sisfua[0]?.fuaDisa,
        fuaLote: sisfua[0]?.fuaLote,
        fuaNumero: cuentaDatos?.FuaNumero ? cuentaDatos?.FuaNumero : nuevoFuaNumero,
        establecimientoCodigoRenaes: '00754',
        reconsideracion: 'N',
        reconsideracionCodigoDisa: null,
        reconsideracionLote: null,
        reconsideracionNroFormato: null,
        fuaComponente: '4',
        situacion: '2',
        afiliacionDisa: cuentaDatos?.AfiliacionDisa,
        afiliacionTipoFormato: cuentaDatos?.AfiliacionTipoFormato,
        afiliacionNroFormato: cuentaDatos?.AfiliacionNroFormato,
        codigoTipoFormato: null,
        origenAseguradoInstitucion: '0',
        origenAseguradoCodigo: null,
        edad: null,
        grupoEtareo: '0',
        genero: cuentaDatos?.IdTipoSexo == '2' ? '0' : '1',
        fuaAtencion: '2', //2 es referencia 3 es emergencia,
        fuaCondicionMaterna: dataCondicionMaterna,
        fuaNrohistoria: cuentaDatos?.NroHistoriaClinica,
        fuaConceptoPr: '1',
        fuaConceptoPrAutoriz: null,
        fuaConceptoPrMonto: '0.00',
        fuaAtencionFecha: formattedDate2,
        fuaAtencionHora: hora,//CodigoEstablAdscripcion
        fuaReferidoOrigenCodigoRenaes: cuentaDatos?.CodigoEstablAdscripcion,
        fuaReferidoOrigenNreferencia: cuentaDatos?.NroReferenciaOrigen,
        fuaCodigoPrestacion: cuentaDatos?.FuaCodigoPrestacion,
        fuaPersonalQatiende: '1',
        fuaAtencionLugar: '1',
        fuaDestino: dataDestinoAtencion,
        fuaHospitalizadoFingreso: null,
        fuaHospitalizadoFalta: '__/__/____',
        fuaReferidoDestinoCodigoRenaes: null,
        fuaReferidoDestinoNreferencia: null,
        fuaMedicoDNI: cuentaDatos?.MedicoDni?.trim(),
        fuaMedico: cuentaDatos?.MedicoPaterno + ' ' + cuentaDatos?.MedicoMaterno + ' ' + cuentaDatos?.MedicoNombres,
        fuaMedicoTipo: String(parseInt(cuentaDatos?.idColegioHIS ?? '0')),
        afiliacionNroIntegrante: null,
        codigo: cuentaDatos?.Afiliacioncodigosiasis,
        idSiasis: cuentaDatos?.idSiasis,
        fuaObservaciones: cuentaDatos?.CitaObservaciones,
        cabDniUsuarioRegistra: cuentaDatos?.MedicoDni?.trim(),
        ultimaFechaAddMod: formattedDate2,
        cabEstado: '0',
        fuaFechaParto: null,
        establecimientoDistrito: '100101',
        anio: formattedDate2.split('/')[2],
        mes: formattedDate2.split('/')[1],
        costoTotal: '0.00',
        apaterno: cuentaDatos?.ApellidoPaterno,
        amaterno: cuentaDatos?.ApellidoMaterno,
        pnombre: cuentaDatos?.PrimerNombre,
        onombre: cuentaDatos?.Onombre,
        fnacimiento: cuentaDatos?.FechaNacimiento_formateada,
        autogenerado: null,
        documentoTipo: cuentaDatos?.IdDocIdentidad,
        documentoNumero: cuentaDatos?.nroDocumento,
        establecimientoCategoria: '05',
        costoServicio: '0.00',
        costoMedicamento: '0.00',
        costoProcedimiento: '0.00',
        costoInsumo: '0.00',
        medicoDocumentoTipo: cuentaDatos?.MedicoDocumentoTipo,
        ate_grupoRiesgo: null,
        cabCodigoPuntoDigitacion: '1071',
        cabCodigoUDR: '17',
        cabNroEnvioAlSIS: null,
        cabOrigenDelRegistro: '1000',
        cabVersionAplicativo: 'v.3',
        cabIdentificacionPaquete: '0',
        identificacionArfsis: null,
        cabFechaFuaPrimeraVez: formattedDate2,
        periodoOrigen: null,
        fuacolegioCodigo: null,
        fuacolegioNivel: null,
        fuacolegioGrado: null,
        fuacolegioSeccion: null,
        fuacolegioTurno: null,
        fuaetnia: '58',
        fuafechaFallecimiento: null,
        fuaUPS: cuentaDatos?.codigoServicioFUA,
        fuaCodAutorizacion: null,
        fuaFechaCorteAdm: null,
        fuaVersionFormato: 'B',
        fuaTipoAnexo2015: '1',
        fuaCodOferFlexible: null,
        idUsuarioAuditoria: session?.user?.id
      }
    }
    if (validadSis?.FuaNumero) {
      const data = await axios.put(`${process.env.apijimmynew}/fua/modificarfua`, dataFuaCabecera);
    } else {
      const data = await axios.post(`${process.env.apijimmynew}/fua/agregarfua`, dataFuaCabecera);
    }
    const fuaverdadero = await getData(`${process.env.apijimmynew}/fua/SisFuaAtencionSeleccionarPorId/${cuentaDatos?.idcuentaatencion}`)

    setsisFuaCabecera(fuaverdadero)
  }


  useEffect(() => {
    if (sisFuaCabecera) {
      getSisFuaDiaAgregar()
    }
  }, [sisFuaCabecera])

  const getSisFuaDiaAgregar = async () => {
    if (!cuentaDatos?.diagnosticos) return;
    await axios.delete(`${process.env.apijimmynew}/fua/SisFuaAtencionDIAEliminarIdCuentaAtencion/${cuentaDatos?.idcuentaatencion}`)
    const nuevosDiagnosticos: any[] = [];
    for (const [index, data] of cuentaDatos.diagnosticos.entries()) {
      const codigoSinPunto = data?.codigoCIE10?.replace(/\./g, '');
      let dxTipoDPRvar;
      switch (Number(data?.idSubclasificacionDx)) {
        case 103:
          dxTipoDPRvar = 'R';
          break;
        case 102:
          dxTipoDPRvar = 'D';
          break;
        case 101:
          dxTipoDPRvar = 'P';
          break;
        default:
          console.log('Opción no válida');
          break;
      }
      const objDiag = {
        idCuentaAtencion: cuentaDatos?.idcuentaatencion,
        dxNumero: index + 1,
        dxTipoIE: 'I',
        dxCodigo: codigoSinPunto,
        dxTipoDPR: dxTipoDPRvar,
        cabDniUsuarioRegistra: cuentaDatos?.MedicoDni?.trim(),
        cabFechaFuaPrimeraVez: sisFuaCabecera?.CabFechaFuaPrimeraVez,
        fuaLote: sisFuaCabecera?.FuaLote,
        fuaNumero: sisFuaCabecera?.FuaNumero,
        IdDiagnostico: data?.IdDiagnostico
      };
      nuevosDiagnosticos.push(objDiag);
      await axios.post(`${process.env.apijimmynew}/fua/SisFuaAtencionDIAAgregar`, objDiag);
    }
    const response=await axios.get(`${process.env.apijimmynew}/fua/SisFuaAtencionDIAbyIdCuentaAtencion/${cuentaDatos?.idcuentaatencion}`);
    setsisFuaDx(response.data);
  };



  useEffect(() => {
    if (sisFuaDx.length > 0) {
      getMedicamentos();
    }
  }, [sisFuaDx])

  const getMedicamentos = async () => {
    if (cuentaDatos?.medicamentos.length > 0) {
      await axios.delete(`${process.env.apijimmynew}/fua/SisFuaAtencionMEDEliminarIdCuentaAtencion/${cuentaDatos?.idcuentaatencion}`)
      const SisFuaAtencionMEDObj = cuentaDatos.medicamentos.filter((data: any) => data?.TipoProducto == 0)
      for (const [index, data] of SisFuaAtencionMEDObj.entries()) {
        const dxnumeroSacado = sisFuaDx.filter((dat: any) => dat?.IdDiagnostico == data?.iddiagnostico)
        const obj = {
          idTablaDx:dxnumeroSacado[0]?.id,
          idCuentaAtencion: cuentaDatos?.idcuentaatencion,
          cantidadEntregada: 0,
          cantidadPrescrita: data?.cantidad,
          cabDniUsuarioRegistra: cuentaDatos?.MedicoDni?.trim(),
          cabFechaFuaPrimeraVez: sisFuaCabecera?.CabFechaFuaPrimeraVez,
          fuaDisa: "754",
          fuaLote: sisFuaCabecera?.FuaLote,
          fuaNumero: sisFuaCabecera?.FuaNumero,
          codigo: data?.Codigo,
          dxNumero: dxnumeroSacado[0]?.DxNumero,
          precioUnitario: String(data?.precio ?? '')
        }
       
       const response = await axios.post(`${process.env.apijimmynew}/fua/SisFuaAtencionMEDAgregar`, obj);
        console.log(response)/**/
      }

    }
  }



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
      <pre>
        {JSON.stringify(sisFuaDx, null, 2)}
      </pre>
      <hr />
      <pre>
        {JSON.stringify(cuentaDatos?.medicamentos, null, 2)}
      </pre>
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
                    <textarea rows={4} className='inputSelect ' {...field} placeholder="Ingrese Observación" />
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
              <FiSave className="mr-2" />
              Guardar y finalizar
            </>
          )}
        </button>
      </div>
    </div>

  )
}
