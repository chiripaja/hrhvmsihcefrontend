'use client'
import { getData } from '@/components/helper/axiosHelper';
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { ModalGeneric } from '@/components/ui/ModalGeneric/ModalGeneric';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';
import { debounce } from '@mui/material';
export const Referencia = () => {
  const { register, handleSubmit } = useForm();

  const { register: register2, handleSubmit: handleSubmit2, control: control2, watch: watch2 } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataAtencion, setdataAtencion] = useState<any>();
  const [verDataProcesada, setverDataProcesada] = useState<any>();
  const [dataPaciente, setdataPaciente] = useState<any>();

  const [listadoCondicionPaciente, setlistadoCondicionPaciente] = useState<any[]>([]);
  const [listadoCondicionPacientev2, setlistadoCondicionPacientev2] = useState<any[]>([]);
  const [listadoTipoTransporte, setlistadoTipoTransporte] = useState<any[]>([]);
  const [listadoEspecialidades, setlistadoEspecialidades] = useState<any[]>([]);
  const [listadoUpsOrigen, setlistadoUpsOrigen] = useState<any[]>([]);
  const [options, setOptions] = useState([]);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  function formatearFecha(fechaNacimiento?: string | Date): string {
    if (!fechaNacimiento) return "";

    const fecha = new Date(fechaNacimiento);
    if (isNaN(fecha.getTime())) return ""; // valida si no es una fecha válida

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    return `${year}${month}${day}`;
  }

  function fechaHoy(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }
  function horaActual(): string {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");
    return `${horas}:${minutos}:${segundos}`;
  }

  const onSubmit = async (dataForm: any) => {
    const datapaciente = await getData(`${process.env.apijimmynew}/paciente/apipacientebynumcuenta/${dataForm?.idcuentaatencion}`);
    setdataPaciente(datapaciente)
    const dataAtenc = await getData(`${process.env.apijimmynew}/atenciones/cuenta/${dataForm?.idcuentaatencion}`);
    setdataAtencion(dataAtenc)

    openModal();

  };

  const onSubmit2 = async (dataForm: any) => {
    console.log(dataForm)
    const tratamientos: any[] = [];
    const diagnosticos: any[] = [];
    dataAtencion.atencionesDiagnosticos.forEach((item: any, index: number) => {
      diagnosticos.push({
        diagnostico: item.diagnostico?.codigoCIEsinPto.trim(),
        nro_diagnostico: String(index + 1),
        tipo_diagnostico: item.subclasificacionDiagnosticos?.codigo
      });
    });
    const fechaNacimiento = dataAtencion?.medico?.empleado?.fechanacimiento;
    let fechaNacMedico = formatearFecha(fechaNacimiento);
    let fechaNacPaciente = formatearFecha(dataPaciente?.FechaNacimiento);

    const sexoDescripcion = dataAtencion?.medico?.empleado?.tiposSexo?.descripcion ?? "";
    const SexoHIS = sexoDescripcion.charAt(0);
    const sexoPaciente = dataPaciente?.IdTipoSexo == 2 ? "F" : "M";
    dataAtencion?.recetaCabeceras
      ?.filter((cabecera: any) => cabecera.idPuntoCarga == 5)
      .forEach((cabecera: any) => {
        cabecera.recetaDetalles
          ?.filter(
            (detalle: any) =>
              detalle.factCatalogoBienesInsumos?.tipoProducto === "0" // solo medicamentos
          )
          .forEach((detalle: any, index: number) => {
            tratamientos.push({
              cantidad: detalle.cantidadPedida ?? "",
              codigo_medicamento: detalle.factCatalogoBienesInsumos?.codigo ?? "",
              frecuencia: detalle.observaciones ?? "",
              nro_diagnostico: String(index + 1),
              nro_tratamiento: "",
              periodo: "",
              unidad_tiempo: "",
            });
          });
      });

    // 👇 Si no se agregó nada, meter un objeto vacío
    if (tratamientos.length === 0) {
      tratamientos.push({
        cantidad: null,
        codigo_medicamento: "",
        frecuencia: "",
        nro_diagnostico: null,
        nro_tratamiento: null,
        periodo: null,
        unidad_tiempo: null,
      });
    }
    const equivalencias: Record<number, string> = {
      1: "13",
      2: "2",
      11: "12",
      19: "4",
      21: "7",
    };
    let idfinanciadorhldo = dataPaciente?.idFuenteFinanciamiento;

    // Si es número y existe en el mapa, lo convertimos
    if (typeof idfinanciadorhldo === "number" && equivalencias[idfinanciadorhldo]) {
      idfinanciadorhldo = equivalencias[idfinanciadorhldo];
    }
    const [sistolica, diastolica] = dataAtencion?.atencionesCE?.triajePresion.split("/");
    const dataenvioref = {
      cita: {
        fecha_vencimiento_sis: "",
        frecuencia_cardiaca: dataAtencion?.atencionesCE?.triajeFrecCardiaca ? String(dataAtencion?.atencionesCE?.triajeFrecCardiaca) : "",
        frecuencia_respiratoria: dataAtencion?.atencionesCE?.triajeFrecRespiratoria ? String(dataAtencion?.atencionesCE?.triajeFrecRespiratoria) : "",
        id_financiador: idfinanciadorhldo ? String(idfinanciadorhldo) : "",
        num_afil: String(dataPaciente?.AfiliacionTipoFormato + "-" + dataPaciente?.AfiliacionNroFormato),
        peso: dataAtencion?.atencionesCE?.triajePeso ? String(dataAtencion?.atencionesCE?.triajePeso) : "",
        presion_arterial_diastolica: diastolica ? diastolica : "",
        presion_arterial_sistolica: sistolica ? sistolica : "",
        resumeanamnesis: "",
        resumeexfisico: "",
        talla: dataAtencion?.atencionesCE?.triajeTalla,
        temperatura: dataAtencion?.atencionesCE?.triajeTemperatura
      },
      cpt: {
        cpt_1: "",
        cpt_2: "",
        cpt_3: "",
        cpt_4: "",
        cpt_5: "",
        cpt_6: "",
        cpt_7: "",
        cpt_8: "",
        cpt_9: "",
        cpt_10: "",
        cpt_11: "",
        cpt_12: "",
        cpt_13: "",
        cpt_14: "",
        cpt_15: "",
        cpt_16: "",
        cpt_17: "",
        cpt_18: ""
      },
      datos_referencia: {
        codEspecialidad: "",
        condicion: "",
        desc_Cartera_servicio: "",
        fechaReferencia: "",
        fgRegistro: "",
        horaReferencia: "",
        idCarteraServicio: "",
        idEnvio: "R",
        idTipoAtencion: "R",
        idTipoTransporte: dataForm?.idTipoTransporte.value,
        idestabDestino: dataForm?.idestabDestino?.value,
        idestabOrigen: "754",
        idupsOrigen: dataForm?.idupsOrigen?.value,
        idupsdestino: dataForm?.idupsOrigen?.value,
        motivo_referencia: {
          idmotivoref: "",
          obsmotivoref: ""
        },
        notasobs: ""
      },
      diagnostico: diagnosticos,
      paciente: {
        apelmatpac: dataPaciente?.ApellidoMaterno,
        apelpatpac: dataPaciente?.ApellidoPaterno,
        celularpac: dataPaciente?.Telefono ? dataPaciente?.Telefono : "",
        correopac: dataPaciente?.Email ? dataPaciente?.Email : "",
        direccion: dataPaciente?.DireccionDomicilio ? dataPaciente?.DireccionDomicilio : "",
        fechnacpac: fechaNacPaciente,
        idsexo: sexoPaciente,
        idtipodoc: String(dataPaciente?.IdDocIdentidad),
        nombpac: dataPaciente?.PrimerNombre + (dataPaciente?.SegundoNombre ? ` ${dataPaciente?.SegundoNombre}` : ""),
        nrohis: dataPaciente?.NroHistoriaClinica.trim(),
        numdoc: dataAtencion?.medico?.empleado?.dni.trim(),
        telefonopac: dataPaciente?.Telefono ? dataPaciente?.Telefono : "",
        ubigeoactual: dataPaciente?.IdDocIdentidad == 1 ? String(dataPaciente?.IdDistritoNacimiento) : "",
        ubigeoreniec: dataPaciente?.IdDocIdentidad == 1 ? String(dataPaciente?.IdDistritoNacimiento) : ""
      },
      persona_acompana: {
        apelmatacomp: "",
        apelpatacomp: "",
        fechanacacomp: "",
        idcolegioacomp: "",
        idprofesionacomp: "",
        idsexoacomp: "",
        idtipodocacmop: "",
        nombperacomp: "",
        numdocacomp: ""
      },
      persona_establecimiento: {
        apelmata: "",
        apelpata: "",
        fechanac: "",
        idcolegio: "",
        idprofesion: "",
        idsexo: "",
        idtipodoc: "",
        nombper: "",
        numdoc: ""
      },
      personal_registra: {
        apellidoMaterno: dataAtencion?.medico?.empleado?.apellidomaterno,
        apellidoPaterno: dataAtencion?.medico?.empleado?.apellidoPaterno,
        fechaNacimiento: fechaNacMedico,
        idcolegio: dataAtencion?.medico?.idcolegiohis,
        idprofesion: dataAtencion?.medico?.empleado?.tiposEmpleado?.tipoEmpleadoHIS,
        nombres: dataAtencion?.medico?.empleado?.nombres,
        nroDocumento: dataAtencion?.medico?.empleado?.dni.trim(),
        sexo: SexoHIS,
        tipoDocumento: String(dataAtencion?.medico?.empleado?.idtipodocumento)
      },
      responsable_referencia: {
        apelmatrefiere: "GRANDA",
        apelpatrefiere: "JIMENEZ",
        fechanacrefiere: "19661105",
        idcolegioref: "123456",
        idprofesionref: "",
        idsexorefiere: "",
        idtipodocref: "",
        nombperrefiere: "",
        numdocref: ""
      },
      tratamiento: tratamientos,
      tutor: {
        apellido_materno: "",
        apellido_paterno: "",
        celular: "",
        correo: "",
        estado_civil: "",
        fecha_nacimiento: "",
        nombres: "",
        numero_documento: "",
        sexo: "",
        tipo_documento: ""
      }
    };

    /*
      
  const response = await fetch("/api/refcon/saveContrareferencia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataenvio),
  });
  const datosRespuestaMinsaContrareferencia={
    "ok": true,
    "message": "Petición enviada al servicio externo",
    "result": {
      "codigo": "0000",
      "mensaje": null,
      "datos": {
        "idreferencia": 1366010,
        "nroreferencia": "754-00001"
      }
    }
  }
  const result = await response.json();
  console.log("Respuesta del backend:", result);
      /*
  Swal.fire({
    title: "<strong>Datos</u></strong>",
    icon: "info",
    html: `
      <pre style="text-align:left; white-space:pre-wrap;">
  ${JSON.stringify(result, null, 2)}
      </pre>
    `,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
  
  });*/
  }
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [condicionRes, transporteRes, EspecialidadesRes, upsRes, condicionPx] = await Promise.all([
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/referencia-interoperabilidad/v1.0/listadoCondicionPaciente`),
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/refcon-interoperabilidad/v1.0/listadoTipoTransporte`),
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/refcon-interoperabilidad/v1.0/listadoEspecialidades`),
          axios.get("/api/rflistaups/0754"),
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/contrarreferencia-interoperabilidad/v1.0/listadoCondicionPaciente`),
        ]);

        if (isMounted) {
          const tipocondicion = condicionRes.data.map((item: any) => ({
            value: item.codigo_condicion,
            label: item.condicion,
          })) || [];
          setlistadoCondicionPaciente(tipocondicion);
          const tipoTransporte = transporteRes.data.map((item: any) => ({
            value: item.codigo_tipo_transporte,
            label: item.tipo_transporte,
          })) || [];
          setlistadoTipoTransporte(tipoTransporte);

          setlistadoEspecialidades(EspecialidadesRes.data);
          const upsOptions = upsRes.data?.datos?.map((item: any) => ({
            value: item.codUps,
            label: item.descripcion,
          })) || [];


          const tipocondicion2 = condicionPx.data.map((item: any) => ({
            value: item.codigo_condicion,
            label: item.condicion,
          })) || [];
          setlistadoCondicionPacientev2(tipocondicion2);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);


  const fetchUPS = useCallback(
    debounce(async (nommed: any) => {
      try {
        const response = await getData(`${process.env.apijimmynew}/establecimiento/buscar/${nommed}`);
        console.log(response)
        const mappedOptions = response.map((est: any) => ({
          value: est.codigo,
          label: `${est.codigo?.trim()} - ${est.nombre.trim()}`,

        }));
        setOptions(mappedOptions);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setOptions([]);
      } finally {

      }
    }, 500),
    []
  );


  const getUpsEstablecimientoOrigen = async (codEstab: any) => {

    const upsEstablecimiento = await axios.get(`/api/rflistaups/${codEstab?.value}`);

    const dataups = upsEstablecimiento?.data?.datos.map((res: any) => ({
      value: res.codUps?.trim(),
      label: res.descripcion?.trim(),
    }))
    setlistadoUpsOrigen(dataups)
  }
  const idestabDestinoWatch = watch2("idestabDestino");
  useEffect(() => {
    if (idestabDestinoWatch) {
      setlistadoUpsOrigen([]);
      getUpsEstablecimientoOrigen(idestabDestinoWatch)

    }

  }, [idestabDestinoWatch])



  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-white shadow-md rounded-lg w-full max-w-xl mx-auto">
        <input
          type="text"
          placeholder="ID Cuenta Atención"
          {...register('idcuentaatencion')}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Buscar ref
        </button>
      </form>
      <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>
        <h3 className="text-lg font-semibold text-gray-900">Referencia</h3>
        <form onSubmit={handleSubmit2(onSubmit2)} className="space-y-4 p-4 border rounded-lg shadow">
          <Controller
            name="condicion"
            control={control2}
            defaultValue={null}
            render={({ field }) => (
              <div>
                <label className="block mb-1 font-semibold">Situacion :</label>
                <Select
                  {...field}
                  instanceId="condicion-select"
                  options={listadoCondicionPaciente}
                  placeholder="Seleccione una condicion"
                  className="mt-2 mb-2"
                  isClearable
                  value={field.value} // 👉 ahora field.value es un objeto { value, label }
                  onChange={(selected) => field.onChange(selected)} // 👉 guardamos objeto completo
                />
              </div>
            )}
          />
          <Controller
            name="idTipoTransporte"
            control={control2}
            defaultValue={null}
            render={({ field }) => (
              <div>
                <label className="block mb-1 font-semibold">Transporte :</label>
                <Select
                  {...field}
                  instanceId="especialidad-select"
                  options={listadoTipoTransporte}
                  placeholder="Seleccione un transporte"
                  className="mt-2 mb-2"
                  isClearable
                  value={field.value} // 👉 ahora field.value es un objeto { value, label }
                  onChange={(selected) => field.onChange(selected)} // 👉 guardamos objeto completo
                />
              </div>
            )}
          />


          <Controller
            name="idestabDestino"
            control={control2}
            defaultValue=""
            render={({ field }) => (
              <Select
                instanceId="unique-select-id"
                {...field}
                className="mt-2 mb-2"
                options={options}
                placeholder="Establecimiento Destino"
                required={true}
                onInputChange={(value: any) => {
                  if (value.length >= 3) {
                    fetchUPS(value);
                  } else {
                    setOptions([]);
                  }
                }}
              />
            )}
          />

          <Controller
            name="idupsOrigen"
            control={control2}
            defaultValue=""
            render={({ field }) => (
              <div>
                <label className="block mb-1 font-semibold">UPS que deriva : </label>
                <Select
                  {...field}
                  instanceId="especialidad-select"
                  options={listadoUpsOrigen}
                  placeholder="Seleccione una especialidad"
                  className="mt-2 mb-2"
                  isClearable
                  value={listadoUpsOrigen.find((opt: any) => opt.value === field.value) || null}
                  onChange={(selected) => field.onChange(selected?.value || "")}
                />
              </div>
            )}
          />
          <textarea
            id="recomendacion"
            {...register2("recomendacion")}
            className="w-full border rounded-md p-2"
            rows={4}
            placeholder="Escribe tus recomendacion aquí..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </form>
        <div className="mt-6 flex justify-end">
          <button
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </ModalGeneric>
    </>
  )
}
