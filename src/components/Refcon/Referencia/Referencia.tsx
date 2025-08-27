'use client'
import { getData } from '@/components/helper/axiosHelper';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
export const Referencia = () => {
  const { register, handleSubmit } = useForm();

  const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
  const [datosAtencion, setdatosAtencion] = useState<any>([]);
  const [flagDatosPx, setflagDatosPx] = useState<boolean>(false);

  const [dataAtencion, setdataAtencion] = useState();

  const getDatosHC = async (idcuentaatencion: any) => {
    const response = await getData(`${process.env.apijimmynew}/atenciones/${idcuentaatencion}`);
    setdatosPxGeneral(response)
    setflagDatosPx(true)
  }

  const getdatosAtencion = async (idcuentaatencion: any) => {
    const datosAtencion = await getData(`${process.env.apijimmynew}/fua/ApiSisFuaAtencionByIdCuentaAtencion/${idcuentaatencion}`);
    setdatosAtencion(datosAtencion)
  }

  const onSubmit = async (data: any) => {


    const dataver=await getData(`${process.env.apijimmynew}/atenciones/cuenta/${data?.idcuentaatencion}`);
        setdataAtencion(dataver)
        const diagnosticos: any[] = [];
  dataver.atencionesDiagnosticos.forEach((item: any, index: number) => {
  diagnosticos.push({
    diagnostico: item.diagnostico?.codigoCIEsinPto.trim(),
    nro_diagnostico: index + 1,
    tipo_diagnostico: item.subclasificacionDiagnosticos?.codigo
  });
});
console.log(diagnosticos)
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
      diagnostico: [
        {
          diagnostico: "A010",
          nro_diagnostico: 1,
          tipo_diagnostico: "P"
        }
      ],
      paciente: {
        apelmatpac: "GARCIA",
        apelpatpac: "GOMEZ",
        direccion: "URB PALOMARES BLOCK D DPTO 12",
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
        apellidoMaterno: "GOMEZ",
        apellidoPaterno: "ARANDA",
        fechaNacimiento: "19001120",
        idcolegio: "10",
        idprofesion: "11",
        nombres: "JAIME",
        nroDocumento: "00045680",
        sexo: "M",
        tipoDocumento: "1"
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

    console.log()
  };

  return (
    <>  
    <pre>
      {JSON.stringify(dataAtencion, null, 2)}
    </pre>
      
      <h1>probar con esta cuenta 444444</h1>
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
