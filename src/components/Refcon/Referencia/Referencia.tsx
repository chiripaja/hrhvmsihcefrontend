'use client'
import { getData } from '@/components/helper/axiosHelper';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
export const Referencia = () => {
  const { register, handleSubmit } = useForm();


  const [dataAtencion, setdataAtencion] = useState();
  const [verDataProcesada, setverDataProcesada] = useState<any>();



  const onSubmit = async (dataForm: any) => {
  
 const datapaciente = await getData(`${process.env.apijimmynew}/paciente/apipacientebynumcuenta/${dataForm?.idcuentaatencion}`);
 console.log(`${process.env.apijimmynew}/paciente/apipacientebynumcuenta/${dataForm?.idcuentaatencion}`)
   console.log("========================================")
setdataAtencion(datapaciente)
console.log("========================================")
    const dataAtenc = await getData(`${process.env.apijimmynew}/atenciones/cuenta/${dataForm?.idcuentaatencion}`);
    console.log(`${process.env.apijimmynew}/atenciones/cuenta/${dataForm?.idcuentaatencion}`);


//setdataAtencion(dataAtenc)
    const diagnosticos: any[] = [];
    dataAtenc.atencionesDiagnosticos.forEach((item: any, index: number) => {
      diagnosticos.push({
        diagnostico: item.diagnostico?.codigoCIEsinPto.trim(),
        nro_diagnostico: index + 1,
        tipo_diagnostico: item.subclasificacionDiagnosticos?.codigo
      });
    });
const fechaNacimiento = dataAtenc?.medico?.empleado?.fechanacimiento;
let fechaFormateada = "";
if (fechaNacimiento) {
  const fecha = new Date(fechaNacimiento);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");

  fechaFormateada = `${year}${month}${day}`;
}
const sexoDescripcion = dataAtenc?.medico?.empleado?.tiposSexo?.descripcion ?? "";
const SexoHIS = sexoDescripcion.charAt(0);
console.log(fechaFormateada)
    const dataenvio = {
      cita: {
        fecha_vencimiento_sis: "",
        id_financiador: 1,
        num_afil: ""
      },
      datosContrareferencia: {
        calificacionReferencia: {
          calificacion: "J",
          calificacionComentario: "Demo calificacion"
        },
        codEspecialidad: "1-0008",
        condicion: "ME",
        desc_cartera_servicio: "",
        fechacontrareferencia: "20220902",
        fgRegistro: "4",
        horaContrareferencia: "16:00:00",
        idCarteraServicio: null,
        idEnvio: "C",
        idTipoAtencion: "C",
        idTipoTransporte: "T",
        idestabDestino: "6000",
        idestabOrigen: "7633",
        idreferencia: "1364666",
        idupsOrigen: "220100",
        idupsdestino: "220000",
        recomendacion: "demo recomendación"
      },
      diagnostico: diagnosticos,
      paciente: {
        apelmatpac: datapaciente?.ApellidoMaterno,
        apelpatpac: datapaciente?.ApellidoPaterno,
        direccion: datapaciente?.DireccionDomicilio ? datapaciente?.DireccionDomicilio : "",
        fechnacpac: "19671217",
        idsexo: "F",
        idtipodoc: "1",
        nombpac: "GLADYS MILENA",
        nrohis: "78963215",
        numdoc: "08124616",
        ubigeoactual: "140122",
        ubigeoreniec: "140122"
      },
      personal_registra: {
        apellidoMaterno: dataAtenc?.medico?.empleado?.apellidomaterno,
        apellidoPaterno: dataAtenc?.medico?.empleado?.apellidoPaterno,
        fechaNacimiento: fechaFormateada,
        idcolegio:dataAtenc?.medico?.idcolegiohis,
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
      tratamiento: [
        {
          cantidad: null,
          codigo_medicamento: "",
          frecuencia: "",
          nro_diagnostico: null,
          nro_tratamiento: null,
          periodo: null,
          unidad_tiempo: null
        }
      ]
    };
    setverDataProcesada(dataenvio)
    console.log()
  };

  return (
    <>
      <pre>
        {JSON.stringify(dataAtencion, null, 2)}
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
