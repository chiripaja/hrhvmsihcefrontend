'use client'
import { getData } from '@/components/helper/axiosHelper';
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { ModalGeneric } from '@/components/ui/ModalGeneric/ModalGeneric';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';
import { debounce } from '@mui/material';
import { ImSpinner2 } from "react-icons/im";

export const Referencia = ({ session }: { session: any }) => {
  const { register, handleSubmit } = useForm();

  const { register: register2, handleSubmit: handleSubmit2, control: control2, watch: watch2, setValue: setValue2, formState: { errors: errors2 }, reset: reset2 } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataAtencion, setdataAtencion] = useState<any>();
  const [verDataProcesada, setverDataProcesada] = useState<any>();
  const [dataPaciente, setdataPaciente] = useState<any>();
  const [optionMedicosG, setoptionMedicosG] = useState<any[]>([]);
  const [listadoCondicionPaciente, setlistadoCondicionPaciente] = useState<any[]>([]);
  const [listadoCondicionPacientev2, setlistadoCondicionPacientev2] = useState<any[]>([]);
  const [listadoTipoTransporte, setlistadoTipoTransporte] = useState<any[]>([]);
  const [listadoEspecialidades, setlistadoEspecialidades] = useState<any[]>([]);
  const [listadoMotivo, setlistadoMotivo] = useState<any[]>([])
  const [listadoUpsOrigen, setlistadoUpsOrigen] = useState<any[]>([]);
  const [datosUsuarioRefcon, setdatosUsuarioRefcon] = useState<any>();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
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
  function obtenerSexo(idTipoSexo?: number): string {
    if (idTipoSexo === 2) {
      return "F"; // Femenino
    }
    if (idTipoSexo === 1) {
      return "M"; // Masculino
    }
    return "M"; // vacío o puedes poner "N/A"
  }

  const onSubmit = async (dataForm: any) => {
    const datapaciente = await getData(`${process.env.apijimmynew}/paciente/apipacientebynumcuenta/${dataForm?.idcuentaatencion}`);
    setdataPaciente(datapaciente)

    const dataAtenc = await getData(`${process.env.apijimmynew}/atenciones/cuenta/${dataForm?.idcuentaatencion}`);
    setdataAtencion(dataAtenc)



  };

  useEffect(() => {
    if (dataAtencion?.idAtencion) {
      setValue2("resumeanamnesis", dataAtencion?.atencionesCE?.citaExamenClinico || "")
      setValue2("resumeexfisico", dataAtencion?.atencionesCE?.citaMotivo || "")
      openModal();
    }


  }, [dataAtencion])


  const onSubmit2 = async (dataForm: any) => {
    try {
      Swal.fire({
        title: 'Enviando referencia...',
        html: 'Por favor espera un momento',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
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
      const SexoHIS = sexoDescripcion ? sexoDescripcion.charAt(0) : "M";
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
      console.log(dataAtencion)
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
        1: "12",
        3: "2",
        4: "4",
        5: "12",
        6: "3",
        7: "8",
        8: "1",
        9: "9",
        10: "10",
        11: "5",
        12: "6",
        13: "7",
        14: "10",
      };
      let idfinanciadorhldo = dataAtencion?.idFuenteFinanciamiento;

      if (typeof idfinanciadorhldo === "number" && equivalencias[idfinanciadorhldo]) {
        idfinanciadorhldo = equivalencias[idfinanciadorhldo];
      }

      if (!dataAtencion?.atencionesCE?.triajePresion) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Presion arterial incompleta',
        });
        return;
      } else {
        const idcolegiohismedico = await axios.get(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/refcon-interoperabilidad/v1.0/listadoColegio?idProfesion=${dataAtencion?.medico?.idcolegiohis}`);
        let idcolegioProf = idcolegiohismedico?.data?.data?.codigo_colegio
        const [sistolica, diastolica] = dataAtencion?.atencionesCE?.triajePresion.split("/");

        const dataenvioref = {
          cita: {
            fecha_vencimiento_sis: "",
            frecuencia_cardiaca: dataAtencion?.atencionesCE?.triajeFrecCardiaca ? String(dataAtencion?.atencionesCE?.triajeFrecCardiaca) : "",
            //   frecuencia_respiratoria: dataAtencion?.atencionesCE?.triajeFrecRespiratoria ? String(dataAtencion?.atencionesCE?.triajeFrecRespiratoria) : "90",
            frecuencia_respiratoria: "90",
            id_financiador: idfinanciadorhldo ? String(idfinanciadorhldo) : "",
            num_afil: String(dataPaciente?.AfiliacionTipoFormato + "-" + dataPaciente?.AfiliacionNroFormato),
            peso: dataAtencion?.atencionesCE?.triajePeso !== undefined && dataAtencion?.atencionesCE?.triajePeso !== null ? Number(dataAtencion.atencionesCE.triajePeso).toFixed(2) : "",
            presion_arterial_diastolica: diastolica ? diastolica : "",
            presion_arterial_sistolica: sistolica ? sistolica : "",
            resumeanamnesis: dataForm?.resumeanamnesis,
            resumeexfisico: dataForm?.resumeexfisico,
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
            codEspecialidad: dataForm?.idespecialidades?.value,
            condicion: dataForm?.condicion?.value,
            desc_Cartera_servicio: "",
            fechaReferencia: fechaHoy(),
            fgRegistro: "2",
            horaReferencia: horaActual(),
            idCarteraServicio: "",
            idEnvio: "R",
            idTipoAtencion: "R",
            idTipoTransporte: dataForm?.idTipoTransporte.value,
            idestabDestino: dataForm?.idestabDestino?.value,
            idestabOrigen: "754",
            idupsOrigen: dataAtencion?.servicio?.codigoserviciosusalud,
            idupsdestino: dataForm?.idupsDestino?.value,
            motivo_referencia: {
              idmotivoref: dataForm?.motivo?.value,
              obsmotivoref: dataForm?.motivo?.label
            },
            notasobs: ""
          },
          diagnostico: diagnosticos,
          paciente: {
            apelmatpac: dataPaciente?.ApellidoMaterno,
            apelpatpac: dataPaciente?.ApellidoPaterno,
            celularpac: dataPaciente?.Telefono ? dataPaciente?.Telefono : "",
            correopac: dataPaciente?.Email ? dataPaciente?.Email : "",
            direccion: dataPaciente?.DireccionDomicilio ? dataPaciente?.DireccionDomicilio : "Jr. Dos de Mayo N° 928",
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
            apelmata: "Valdivieso",
            apelpata: "Ibazeta",
            fechanac: "19800101",
            idcolegio: "01",
            idprofesion: "01",
            idsexo: "F",
            idtipodoc: "1",
            nombper: "Anni Giovanna",
            numdoc: "23165404"
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
            apelmatrefiere: datosUsuarioRefcon?.ApellidoMaterno,
            apelpatrefiere: datosUsuarioRefcon?.ApellidoPaterno,
            fechanacrefiere: formatearFecha(datosUsuarioRefcon?.FechaNacimiento),
            idcolegioref: idcolegioProf,
            idprofesionref: datosUsuarioRefcon?.TipoEmpleadoHIS ? datosUsuarioRefcon?.TipoEmpleadoHIS : "29",
            idsexorefiere: obtenerSexo(datosUsuarioRefcon?.sexo),
            idtipodocref: datosUsuarioRefcon?.idTipoDocumento,
            nombperrefiere: datosUsuarioRefcon?.Nombres,
            numdocref: datosUsuarioRefcon?.Nombres,
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

        console.log(dataenvioref)

        const response = await fetch("/api/refcon/saveRefencia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataenvioref),
        });

        const result = await response.json();
        Swal.close();

        if (result.result?.codigo == "0000") {
          const objResultadoByidCuentaAtencion = {
            idCuentaAtencion: dataAtencion?.idCuentaAtencion,
            idReferencia: result?.result?.datos?.idReferencia,
            nroReferencia: result?.result?.datos?.nro_referencia,
          }
          const responseReferenc: any = await axios.post(`${process.env.apijimmynew}/refcon/reference/create`, objResultadoByidCuentaAtencion)
          if (responseReferenc) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Referencia registrada correctamente',
            });
            closeModal();
            reset2();
          }

        } else {
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
          });
        }
        /*
   */




      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al enviar la referencia',
      });
    }

  }


  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [condicionRes, transporteRes, EspecialidadesRes, upsRes, condicionPx, listReason] = await Promise.all([
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/referencia-interoperabilidad/v1.0/listadoCondicionPaciente`),
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/refcon-interoperabilidad/v1.0/listadoTipoTransporte`),
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/refcon-interoperabilidad/v1.0/listadoEspecialidades`),
          axios.get("/api/rflistaups/0754"),
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/contrarreferencia-interoperabilidad/v1.0/listadoCondicionPaciente`),
          getData(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/refcon-interoperabilidad/v1.0/listadoMotivo`),
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
          const upsOptions = EspecialidadesRes.data?.map((item: any) => ({
            value: item.codigo_especialidad,
            label: item.especialidad,
          })) || [];
          setlistadoEspecialidades(upsOptions);
          const tipocondicion2 = condicionPx.data.map((item: any) => ({
            value: item.codigo_condicion,
            label: item.condicion,
          })) || [];
          setlistadoCondicionPacientev2(tipocondicion2);
          const listadoMotivo = listReason.data.map((item: any) => ({
            value: item.codigo_motivo,
            label: item.motivo,
          })) || [];
          setlistadoMotivo(listadoMotivo)
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

  const getDatosUsuario = async (idempleado: any) => {
    const data = await getData(`${process.env.apijimmynew}/empleados/apiusuariosessionbyid/${idempleado}`)
    setdatosUsuarioRefcon(data)
  }
  useEffect(() => {
    if (session?.user?.id) {
      getDatosUsuario(session?.user?.id)
    }
  }, [session])

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
            rules={{ required: "require condicion" }}
            render={({ field }) => (
              <div>
                <label className="block mb-1 font-semibold">Condicion :</label>
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
            rules={{ required: "require transporte" }}
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
            rules={{ required: "require establecimiento destino" }}
            render={({ field }) => (
              <>
                <label className="block mb-1 font-semibold">Establecimiento Destino :</label>
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
              </>
            )}
          />




          <Controller
            name="idupsDestino"
            control={control2}
            defaultValue={null}
            rules={{ required: "require UPS deriva" }}
            render={({ field }) => (
              <div>
                <label className="block mb-1 font-semibold">UPS que deriva : </label>
                <Select
                  instanceId="especialidad-select"
                  options={listadoUpsOrigen}
                  placeholder="Seleccione una ups"
                  className="mt-2 mb-2"
                  isClearable
                  value={field.value}
                  onChange={(selected) => field.onChange(selected)}
                />
              </div>
            )}
          />

          <Controller
            name="idespecialidades"
            control={control2}
            defaultValue=""
            rules={{ required: "La especialidad es obligatoria" }}
            render={({ field }) => (
              <>
                <label className="block mb-1 font-semibold">Especialidades : </label>
                <Select
                  instanceId="unique-select-id"
                  {...field}
                  options={listadoEspecialidades}
                  placeholder="especialidades"
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
              </>

            )}
          />
          <Controller
            name="motivo"
            control={control2}
            defaultValue={null}
            rules={{ required: "require condicion" }}
            render={({ field }) => (
              <div>
                <label className="block mb-1 font-semibold">Motivo :</label>
                <Select
                  {...field}
                  instanceId="motivo-select"
                  options={listadoMotivo}
                  placeholder="Seleccione una motivo"
                  className="mt-2 mb-2"
                  isClearable
                  value={field.value} // 👉 ahora field.value es un objeto { value, label }
                  onChange={(selected) => field.onChange(selected)} // 👉 guardamos objeto completo
                />
              </div>
            )}
          />

          <label className="block mb-1 font-semibold">resumeanamnesis :</label>
          <textarea
            id="resumeanamnesis"
            {...register2("resumeanamnesis", { required: true })}
            className="w-full border rounded-md p-2"
            rows={4}
            placeholder="Escribe tu resumen anamnesis..."
          />
          <label className="block mb-1 font-semibold">resumeexfisico :</label>
          <textarea
            id="resumeexfisico"
            {...register2("resumeexfisico", {
              required: "Este campo es obligatorio",
              minLength: { value: 30, message: "Debe tener al menos 30 caracteres" }
            })}
            className="w-full border rounded-md p-2"
            rows={4}
            placeholder="Escribe tu resumen físico..."
          />
          {errors2.resumeexfisico && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors2.resumeexfisico.message)}
            </p>
          )}

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
