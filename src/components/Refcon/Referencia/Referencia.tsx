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
        frecuencia_cardiaca: "",
        frecuencia_respiratoria: "",
        id_financiador: "",
        num_afil: "",
        peso: "",
        presion_arterial_diastolica: "",
        presion_arterial_sistolica: "",
        resumeanamnesis: "",
        resumeexfisico: "",
        talla: "",
        temperatura: ""
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
        idEnvio: "",
        idTipoAtencion: "",
        idTipoTransporte: "",
        idestabDestino: "",
        idestabOrigen: "",
        idupsOrigen: "",
        idupsdestino: "",
        motivo_referencia: {
          idmotivoref: "",
          obsmotivoref: ""
        },
        notasobs: ""
      },
      diagnostico: [
        {
          diagnostico: "",
          nro_diagnostico: "",
          tipo_diagnostico: ""
        }
      ],
      paciente: {
        apelmatpac: "",
        apelpatpac: "",
        celularpac: "",
        correopac: "",
        direccion: "",
        fechnacpac: "",
        idsexo: "",
        idtipodoc: "",
        nombpac: "",
        nrohis: "",
        numdoc: "",
        telefonopac: "",
        ubigeoactual: "",
        ubigeoreniec: ""
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
        apellidoMaterno: "",
        apellidoPaterno: "",
        fechaNacimiento: "",
        idcolegio: "",
        idprofesion: "",
        nombres: "",
        nroDocumento: "",
        sexo: "",
        tipoDocumento: ""
      },
      responsable_referencia: {
        apelmatrefiere: "",
        apelpatrefiere: "",
        fechanacrefiere: "",
        idcolegioref: "",
        idprofesionref: "",
        idsexorefiere: "",
        idtipodocref: "",
        nombperrefiere: "",
        numdocref: ""
      },
      tratamiento: [
        {
          cantidad: 0,
          codigo_medicamento: "",
          frecuencia: "",
          nro_diagnostico: 0,
          nro_tratamiento: 0,
          periodo: 0,
          unidad_tiempo: 0
        }
      ],
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
