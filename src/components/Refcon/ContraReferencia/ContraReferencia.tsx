'use client'
import { getData } from '@/components/helper/axiosHelper';
import { ModalGeneric } from '@/components/ui/ModalGeneric/ModalGeneric';
import { ModalGenerico } from '@/components/ui/ModalGenerico';
import { debounce } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import Swal from 'sweetalert2';
const ContraReferencia = ({ session }: { session: any }) => {
    const { register, handleSubmit } = useForm();
    const [datosPxRefCon, setdatosPxRefCon] = useState<any>();
    const [dataPaciente, setdataPaciente] = useState<any>();
    const [listadoTransporte, setlistadoTransporte] = useState<any>();
    const [dataAtencion, setdataAtencion] = useState<any>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idEstabOrigen, setIdEstabOrigen] = useState('');
    const [datosUsuarioRefcon, setdatosUsuarioRefcon] = useState<any>();
    const [verDataProcesada, setverDataProcesada] = useState<any>();
    const [listadoCondicionPaciente, setlistadoCondicionPaciente] = useState<any[]>([]);
    const [listadoCondicionPacientev2, setlistadoCondicionPacientev2] = useState<any[]>([]);
    const [listadoTipoTransporte, setlistadoTipoTransporte] = useState<any[]>([]);
    const [listadoEspecialidades, setlistadoEspecialidades] = useState<any[]>([]);
    const [listadoUpsOrigen, setlistadoUpsOrigen] = useState<any[]>([]);
    const { register: register2, handleSubmit: handleSubmit2, control: control2, watch: watch2 } = useForm();
    const [options, setOptions] = useState([]);


  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [sortColumn, setSortColumn] = useState("FechaIngreso");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

    const getDatosUsuario = async (idempleado: any) => {
        const data = await getData(`${process.env.apijimmynew}/empleados/apiusuariosessionbyid/${idempleado}`)
        setdatosUsuarioRefcon(data)
    }
    useEffect(() => {
        if (session?.user?.id) {
            getDatosUsuario(session?.user?.id)
        }
    }, [session])
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

                    setlistadoUpsOrigen(upsOptions);
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

    const buscadorByIdCuentaAtencion = async (idcuentaatencion: any) => {
        const datapaciente = await getData(`${process.env.apijimmynew}/paciente/apipacientebynumcuenta/${idcuentaatencion}`);
        setdataPaciente(datapaciente)
        const dataAtenc = await getData(`${process.env.apijimmynew}/atenciones/cuenta/${idcuentaatencion}`);
        setdataAtencion(dataAtenc)
        openModal();
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


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSubmit2 = async (dataForm: any) => {
 
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
        const idcolegiohismedico = await axios.get(`${process.env.apiServiciosRefcon}/mcs-referencia-interoperabilidad/refcon-interoperabilidad/v1.0/listadoColegio?idProfesion=${dataAtencion?.medico?.idcolegiohis}`);
        let idcolegioProf = idcolegiohismedico?.data?.data?.codigo_colegio
        console.log(datosUsuarioRefcon)

        const dataenvio = {
            cita: {
                fecha_vencimiento_sis: "",
                id_financiador: "2",
                num_afil: ""
            },
            datosContrareferencia: {
                calificacionReferencia: {
                    calificacion: dataForm?.condicion?.value,
                    calificacionComentario: dataForm?.condicion?.label
                },
                codEspecialidad: dataForm?.refcon?.codigoEspecialidad,
                condicion: dataForm?.condicion2?.value,
                desc_cartera_servicio: "",
                fechacontrareferencia: fechaHoy(),
                fgRegistro: "4",
                horaContrareferencia: horaActual(),
                idCarteraServicio: null,
                idEnvio: "C",
                idTipoAtencion: "C",
                idTipoTransporte: dataForm?.idTipoTransporte?.value, // ya esta en el select
                idestabDestino: dataForm?.refcon?.codigoestablecimientoOrigen,
                idestabOrigen: "754",
                idreferencia: dataForm?.refcon?.idReferencia,
                idupsOrigen: dataForm?.refcon?.upsDestino,
                idupsdestino: dataForm?.refcon?.upsOrigen,
                recomendacion: dataForm?.recomendacion
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
                nrohis: dataPaciente?.NroHistoriaClinica,
                numdoc: dataPaciente?.NroDocumento,
                telefonopac: dataPaciente?.Telefono ? dataPaciente?.Telefono : "",
                ubigeoactual: dataPaciente?.IdDocIdentidad == 1 ? String(dataPaciente?.IdDistritoNacimiento) : "",
                ubigeoreniec: dataPaciente?.IdDocIdentidad == 1 ? String(dataPaciente?.IdDistritoNacimiento) : "",
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
                tipoDocumento: String(dataAtencion?.medico?.empleado?.idtipodocumento),
            },
            responsableContrareferencia: {
                apelmatrefiere: datosUsuarioRefcon?.ApellidoMaterno,
                apelpatrefiere: datosUsuarioRefcon?.ApellidoPaterno,
                fechanacrefiere: formatearFecha(datosUsuarioRefcon?.FechaNacimiento),
                idcolegioref: idcolegioProf,
                idprofesionref: datosUsuarioRefcon?.TipoEmpleadoHIS ? datosUsuarioRefcon?.TipoEmpleadoHIS : "29",
                idsexorefiere: obtenerSexo(datosUsuarioRefcon?.sexo),
                idtipodocref: datosUsuarioRefcon?.idTipoDocumento,
                nombperrefiere: datosUsuarioRefcon?.Nombres,
                numdocref: datosUsuarioRefcon?.DNI?.trim(),
            },
            tratamiento: tratamientos
        };

        const response = await fetch("/api/refcon/saveContrareferencia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataenvio),
        });

        const datosRespuestaMinsaContrareferencia = {
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

    const especialidadOptions = useMemo(() => {
        return listadoEspecialidades.map((item: any) => ({
            value: item.codigo_especialidad,
            label: item.especialidad,
        }));
    }, [listadoEspecialidades]);

    const searchValue = watch2("idestabDestino");

    useEffect(() => {
        const fetchOptions = async () => {
            if (searchValue && searchValue.length >= 3) {
                try {
                    const res = await fetch(
                        `${process.env.apijimmynew}/establecimiento/buscar/${searchValue}`
                    );
                    const data = await res.json();

                    const newOptions = data.map((item: any) => ({
                        value: item.codigo,
                        label: `${item.codigo} - ${item.nombre}`,
                    }));

                    setOptions(newOptions);
                } catch (error) {
                    console.error("Error al buscar establecimientos:", error);
                    setOptions([]);
                }
            } else {
                setOptions([]);
            }
        };

        fetchOptions();
    }, [searchValue]);

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

    const getDatosRefconPx = async (dni: any) => {
        const res = await fetch("/api/consultaReferencia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                establecimientoDestino: "754",
                limite: "10",
                // numerodocumento: dni,
                numerodocumento: "42713040",
                pagina: "1",
                tipodocumento: "1",
            }),
        });
        const data = await res.json();
        const referenciadatas2 = data?.datos?.datos.map((item: any) => ({
            value: item.data?.idReferencia,
            label: `${item.data?.establecimientoOrigen} - ${item.data?.estado} (${item.data?.descUpsDestino} ${item.data?.fechaEnvio})`, // 👈 lo que se ve en el select
            ...item.data,
        })) || [];
        setdatosPxRefCon(referenciadatas2);
    };

    useEffect(() => {
        if (dataPaciente?.NroDocumento) {
            getDatosRefconPx(dataPaciente?.NroDocumento)
        }
    }, [dataPaciente])

  const fetchData = async () => {
    const res = await axios.get("http://192.168.13.7:9797/atenciones/apiAltasMedicasRefcon", {
      params: { page, size, sortColumn, sortDirection },
    });
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [page, size, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortColumn(column);
      setSortDirection("ASC");
    }
  };


    return (
        <div>

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
                    Buscar
                </button>
            </form>
            <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>
                <h3 className="text-lg font-semibold text-gray-900">Contrareferencia ss</h3>
                <form onSubmit={handleSubmit2(onSubmit2)} className="space-y-4 p-4 border rounded-lg shadow">

                    <div>
                        <Controller
                            name="refcon"
                            control={control2}
                            defaultValue={null}
                            render={({ field }: { field: any }) => (
                                <div>
                                    <label className="block mb-1 font-semibold">Datos referencia :</label>
                                    <Select
                                        {...field}
                                        instanceId="referencia-select"
                                        options={datosPxRefCon}
                                        placeholder="Seleccione una referencia"
                                        className="mt-2 mb-2"
                                        isClearable
                                        value={field.idReferencia} // 👉 ahora field.value es un objeto { value, label }
                                        onChange={(selected) => field.onChange(selected)} // 👉 guardamos objeto completo
                                    />
                                </div>
                            )}
                        />
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
                    </div>
                    <Controller
                        name="condicion2"
                        control={control2}
                        defaultValue={null}
                        render={({ field }) => (
                            <div>
                                <label className="block mb-1 font-semibold">Condicion :</label>
                                <Select
                                    {...field}
                                    instanceId="condicion-select"
                                    options={listadoCondicionPacientev2}
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

 <div className="p-4">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort("TipoServicio")}>
              Tipo Servicio {sortColumn === "TipoServicio" && (sortDirection === "ASC" ? "↑" : "↓")}
            </th>
             <th className="p-2 border cursor-pointer" onClick={() => handleSort("DestinoAtencion")}>
              Destino {sortColumn === "DestinoAtencion" && (sortDirection === "ASC" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort("ApellidoPaterno")}>
              Apellido Paterno {sortColumn === "ApellidoPaterno" && (sortDirection === "ASC" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort("ApellidoMaterno")}>
              Apellido Materno {sortColumn === "ApellidoMaterno" && (sortDirection === "ASC" ? "↑" : "↓")}
            </th>
           
            <th className="p-2 border cursor-pointer" onClick={() => handleSort("IdCuentaAtencion")}>
              IdCuentaAtencion {sortColumn === "IdCuentaAtencion" && (sortDirection === "ASC" ? "↑" : "↓")}
            </th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort("FechaIngreso")}>
              Fecha Ingreso {sortColumn === "FechaIngreso" && (sortDirection === "ASC" ? "↑" : "↓")}
            </th>
            <th>
                Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border">{item.TipoServicio}</td>
              <td className="p-2 border">{item.DestinoAtencion}</td>
              <td className="p-2 border">{item.ApellidoPaterno}</td>
              <td className="p-2 border">{item.ApellidoMaterno}</td>
              <td className="p-2 border">{item.IdCuentaAtencion}</td>
              <td className="p-2 border">{item.FechaIngreso?.slice(0, 10)}</td>
              <td className="p-2 border text-center">
               <button
  onClick={() => buscadorByIdCuentaAtencion(item.IdCuentaAtencion)}
  className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 
             text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg 
             transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
>
  ContraReferir
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
    )
}

export default ContraReferencia
