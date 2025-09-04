'use client'
import { getData } from '@/components/helper/axiosHelper';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
export const Referencia = () => {
  const { register, handleSubmit } = useForm();


  const [dataAtencion, setdataAtencion] = useState<any>();
  const [verDataProcesada, setverDataProcesada] = useState<any>();

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
    const tratamiento: any[] = [];
    console.log(datapaciente)

    setdataAtencion(dataAtencion)

    const dataAtenc = await getData(`${process.env.apijimmynew}/atenciones/cuenta/${dataForm?.idcuentaatencion}`);
    const tratamientos: any[] = [];
    dataAtenc?.recetaCabeceras
      ?.filter((cabecera: any) => cabecera.idPuntoCarga == 5) // solo Farmacia
      .forEach((cabecera: any) => {
        cabecera.recetaDetalles
          ?.filter((detalle: any) => detalle.factCatalogoBienesInsumos?.tipoProducto === "0") // solo medicamentos
          .forEach((detalle: any, index: number) => {
            tratamientos.push({
              cantidad: detalle.cantidadPedida ?? null,
              codigo_medicamento: detalle.factCatalogoBienesInsumos?.codigo ?? "",
              frecuencia: detalle.observaciones ?? "",
              nro_diagnostico: index + 1,
              nro_tratamiento: null,
              periodo: null,
              unidad_tiempo: null
            });
          });
      });
    
    setdataAtencion(tratamientos)
    const diagnosticos: any[] = [];
    dataAtenc.atencionesDiagnosticos.forEach((item: any, index: number) => {
      diagnosticos.push({
        diagnostico: item.diagnostico?.codigoCIEsinPto.trim(),
        nro_diagnostico: index + 1,
        tipo_diagnostico: item.subclasificacionDiagnosticos?.codigo
      });
    });
    const fechaNacimiento = dataAtenc?.medico?.empleado?.fechanacimiento;
    let fechaNacMedico = formatearFecha(fechaNacimiento);
    let fechaNacPaciente = formatearFecha(datapaciente?.FechaNacimiento);

    const sexoDescripcion = dataAtenc?.medico?.empleado?.tiposSexo?.descripcion ?? "";
    const SexoHIS = sexoDescripcion.charAt(0);

    const dataenvio = {
      cita: {
        fecha_vencimiento_sis: "",
        id_financiador: 2,
        num_afil: ""
      },
      datosContrareferencia: {
        calificacionReferencia: {
          calificacion: "E",
          calificacionComentario: "ESTABLE"
        },
        codEspecialidad: "1-0008",
        condicion: "ME",
        desc_cartera_servicio: "",
        fechacontrareferencia: fechaHoy(),
        fgRegistro: "4",
        horaContrareferencia: horaActual(),
        idCarteraServicio: null,
        idEnvio: "C",
        idTipoAtencion: "C",
        idTipoTransporte: "T",
        idestabDestino: "6000",
        idestabOrigen: "7633",
        idreferencia: "1364666",
        idupsOrigen: "220100",
        idupsdestino: "220000",
        recomendacion: " recomendación"
      },
      diagnostico: diagnosticos,
      paciente: {
        apelmatpac: datapaciente?.ApellidoMaterno,
        apelpatpac: datapaciente?.ApellidoPaterno,
        direccion: datapaciente?.DireccionDomicilio ? datapaciente?.DireccionDomicilio : "",
        fechnacpac: fechaNacPaciente,
        idsexo: datapaciente?.ApellidoPaterno.charAt(0),
        idtipodoc: datapaciente?.IdDocIdentidad,
        nombpac: datapaciente?.PrimerNombre + (datapaciente?.SegundoNombre ? ` ${datapaciente?.SegundoNombre}` : ""),
        nrohis: datapaciente?.NroDocumento,
        numdoc: datapaciente?.NroDocumento,
        ubigeoactual: "140122",
        ubigeoreniec: "140122"
      },
      personal_registra: {
        apellidoMaterno: dataAtenc?.medico?.empleado?.apellidomaterno,
        apellidoPaterno: dataAtenc?.medico?.empleado?.apellidoPaterno,
        fechaNacimiento: fechaNacMedico,
        idcolegio: dataAtenc?.medico?.idcolegiohis,
        idprofesion: dataAtenc?.medico?.empleado?.tiposEmpleado?.tipoEmpleadoHIS,
        nombres: dataAtenc?.medico?.empleado?.nombres,
        nroDocumento: dataAtenc?.medico?.empleado?.dni.trim(),
        sexo: SexoHIS,
        tipoDocumento: dataAtenc?.medico?.empleado?.idtipodocumento,
      },
      responsableContrareferencia: {
        apelmatrefiere: "GRANDA",
        apelpatrefiere: "JIMENEZ",
        fechanacrefiere: "19661105",
        idcolegioref: "123456",
        idprofesionref: "1",
        idsexorefiere: "M",
        idtipodocref: "1",
        nombperrefiere: "NESTOR ABEL",
        numdocref: "10258720"
      },
      tratamiento: tratamientos
    };
    setverDataProcesada(dataenvio)
    console.log(dataenvio)
  };

  return (
    <>
      <pre>
        {JSON.stringify(verDataProcesada, null, 2)}
      </pre>

      <h1>probar con esta cuenta 481252</h1>
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

    </>
  )
}
