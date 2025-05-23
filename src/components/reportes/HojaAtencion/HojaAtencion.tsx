'use client'

import React, { useEffect, useState } from 'react'
import Image from "next/image";
import axios from 'axios';
import { obtenerFechaYHora } from '@/components/utils/obtenerFechaYHora';
import { getData } from '@/components/helper/axiosHelper';
import { RecetaCabecera } from '../../../interfaces/RecetaCabezeraI';
export const HojaAtencion = ({ idcuentaatencion }: any) => {

  const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
  const [datosAtencion, setdatosAtencion] = useState<any>([]);
  const [datosFarmacia, setdatosFarmacia] = useState<any>([]);
  const [datosRayosX, setdatosRayosX] = useState<any>([]);
  const [datosTomografia, setdatosTomografia] = useState<any>([]);
  const [datosEcografia, setdatosEcografia] = useState<any>([]);
  const [datosEcografiaObstetrica, setdatosEcografiaObstetrica] = useState<any>([]);
  const [datosAnatomiaPatologica, setdatosAnatomiaPatologica] = useState<any>([]);
  const [datosPatologicaClinica, setdatosPatologicaClinica] = useState<any>([]);
  const [datosBancoSangre, setdatosBancoSangre] = useState<any>([]);
  const [datosProcedimientosFuera, setdatosProcedimientosFuera] = useState<any>([]);
  const handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    getDatosHC(idcuentaatencion)
  }, [idcuentaatencion])
  const getDatosHC = async (idcuentaatencion: any) => {
    const response = await getData(`${process.env.apijimmynew}/atenciones/${idcuentaatencion}`);
    setdatosPxGeneral(response)
  }

  const getdatosAtencion = async (idatencion: any) => {
    const datosAtencion = await getData(`${process.env.apijimmynew}/atenciones/findByIdCuentaAtencion/${idcuentaatencion}`);
    setdatosAtencion(datosAtencion)
  }

  function obtenerHoraActual() {
    const fecha = new Date();
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const esAM = horas < 12;
    horas = horas % 12 || 12;
    const minutosFormateados = minutos.toString().padStart(2, "0");
    const periodo = esAM ? "a. m." : "p. m.";
    return `${horas}:${minutosFormateados} ${periodo}`;
  }
  useEffect(() => {
    if (datosPxGeneral) {
      //window.print();
    }

  }, [datosPxGeneral])

  const getMedicamentosbyIdRecetaCabeceraFarmacia = async (idrecetacabecera: number, idFormaPago: number) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdReceta/${idrecetacabecera}/${idFormaPago}/4`)
      setdatosFarmacia(data);
    } catch (error) {
      console.log(error)
    }
  }

  const fetchDetalleReceta = async (
    idrecetacabecera: number,
    idFormaPago: number,
    setter: (data: any) => void
  ) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdRecetaServicios/${idrecetacabecera}/${idFormaPago}`)
      setter(data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (datosAtencion?.recetaCabeceras && datosAtencion?.idFormaPago) {
      const idrecetaFarmacia = datosAtencion?.recetaCabeceras.filter((data: any) => data.idPuntoCarga == 5)
      getMedicamentosbyIdRecetaCabeceraFarmacia(idrecetaFarmacia[0]?.idreceta, datosAtencion?.idFormaPago)
    }
  }, [datosAtencion?.recetaCabeceras, datosAtencion?.idFormaPago])


  const otrosProc=async()=>{
    const data = await getData(`${process.env.apijimmynew}/api/solicitud-procedimientos/procedimientos/${idcuentaatencion}`)
    console.log("otros proc")
    setdatosProcedimientosFuera(data)
  }
  useEffect(() => {
   
    if(datosAtencion?.idAtencion){
        otrosProc();
    }
   
  }, [datosAtencion])
  


  useEffect(() => {
    if (datosAtencion?.recetaCabeceras && datosAtencion?.idFormaPago) {
      const examenes = [
        //imagenologica
        { idPuntoCarga: 20, setter: setdatosEcografia },
        { idPuntoCarga: 21, setter: setdatosRayosX },
        { idPuntoCarga: 22, setter: setdatosTomografia },
        { idPuntoCarga: 23, setter: setdatosEcografiaObstetrica },
        //laboratorio
        { idPuntoCarga: 3, setter: setdatosAnatomiaPatologica },
        { idPuntoCarga: 2, setter: setdatosPatologicaClinica },
        { idPuntoCarga: 11, setter: setdatosBancoSangre },
      ]
      examenes.forEach(({ idPuntoCarga, setter }) => {
        const receta = datosAtencion.recetaCabeceras.find((data: any) => data.idPuntoCarga === idPuntoCarga)
        if (receta) {
          fetchDetalleReceta(receta.idreceta, datosAtencion.idFormaPago, setter)
        }
      })
    }
  }, [datosAtencion?.recetaCabeceras, datosAtencion?.idFormaPago])

  useEffect(() => {
    if (datosPxGeneral?.idAtencion) {
      getdatosAtencion(datosPxGeneral?.idAtencion)
    }
  }, [datosPxGeneral?.idAtencion])


  const { formattedDate, hora, fechayhora } = obtenerFechaYHora();
  return (

    <div className=" bg-white min-h-screen flex justify-center">
      <div className=" w-full max-w-4xl p-6 ">
        {/* Encabezado */}
        <div className="text-center border-b pb-4  flex justify-between">
          <div>
            <Image
              src="/img/loghrhvm.png"
              alt="Logo del hospital"
              width={254}
              height={254}
              className="w-36 h-auto"
            />
          </div>
          <div className="text-xs">
            <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
            <p>JIRÓN HERMINIO VALDIZÁN NÚMERO 600 DISTRITO HUÁNUCO</p>
            <p>TELÉFONO: (062)</p>
          </div>

          <div className="flex flex-col mt-2 text-sm">
            <span>{formattedDate}</span>
            <span> {obtenerHoraActual()}</span>
            <span>Página 1 de 1</span>
          </div>
        </div>


        <h1 className="text-center text-lg font-bold mt-4">
          Detalle de Atención médica del Paciente
        </h1>


        <div className=" justify-between items-center mt-4  pb-4 text-sm w-full grid-cols-1">
          {/* Datos generales */}
          <table className='border w-full'>
            <tbody>
              <tr>
                <td>Médico:</td>
                <td>{datosPxGeneral?.MedicoPaterno} {datosPxGeneral?.MedicoMaterno} {datosPxGeneral?.MedicoNombres}
                  Colegiatura: {datosPxGeneral?.MedicoColegitura}  RNE: {datosPxGeneral?.Medicorne}</td>
                <td>Fecha Consulta:</td>
                <td>{datosPxGeneral?.FechaIngreso}</td>
              </tr>
              <tr>
                <td>Paciente:</td>
                <td>({datosPxGeneral?.nroDocumento}) {datosPxGeneral?.nombrespx} (Edad: {datosPxGeneral?.triajeEdad} Años) ({datosPxGeneral?.FuentesFinanciamiento})</td>
                <td>Hora Atención:</td>
                <td>{datosPxGeneral?.HoraEgreso}</td>
              </tr>
              <tr>
                <td>Consultorio:</td>
                <td>{datosPxGeneral?.servnom}</td>
                <td>N° Cuenta:</td>
                <td>{datosPxGeneral?.idCuentaAtencion}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>Fecha Proxima :</td>
                <td></td>
              </tr>
            </tbody>

          </table>

          {/* Triaje */}
          <table className='border w-full mt-1'>
            <tbody>
              <tr>
                <td>P.Arterial:</td>
                <td>{datosPxGeneral?.triajePresion} Sistólica/Diastólica </td>
                <td>Talla:</td>
                <td>{datosPxGeneral?.triajeTalla} cm</td>
              </tr>
              <tr>
                <td>Temperatura:</td>
                <td>{datosPxGeneral?.triajeTemperatura} °C</td>
                <td>Peso: </td>
                <td>{datosPxGeneral?.triajePeso}</td>
              </tr>
              <tr>
                <td>F.Cardiaca:</td>
                <td>{datosPxGeneral?.triajeFrecCardiaca} rpm.</td>
                <td>F.Respiratoria:</td>
                <td>{datosPxGeneral?.TriajeFrecRespiratoria} rpm.</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>IMC:</td>
                <td> {(() => {
                  const tallaCm = datosPxGeneral?.triajeTalla;
                  const peso = datosPxGeneral?.triajePeso;

                  if (tallaCm && peso) {
                    const tallaM = tallaCm / 100;
                    const imc = peso / (tallaM * tallaM);
                    return imc.toFixed(2); // Redondea a 2 decimales
                  } else {
                    return 'N/A';
                  }
                })()}</td>
              </tr>
            </tbody>

          </table>

        </div>

        {/* Antecedentes Personales */}

        <table className="border col-span-2 mt-1 text-sm w-full">
          <thead>
            <tr>
              <th className="border text-left" colSpan={2}>
                Antecedentes Personales
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="w-1/5 align-top">Quirúrgico :</td>
              <td className="align-top">{datosPxGeneral?.antecedQuirurgico}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top">Patológico :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedPatologico}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top">Alergias :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedAlergico}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top">Obstétricos :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedObstetrico}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top">Otros :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedentes}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top">Ant. Familiares :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedFamiliar}</td>
            </tr>
          </tbody>
        </table>


        {/* Motivo Consulta */}

        <table className='border col-span-2  mt-2 text-sm w-full'>

          <tbody>
            <tr className='border-b border-gray-100'>
              <td className='w-1/5 align-top'>
                Motivo de Consulta  :
              </td>
              <td className='align-top text-justify'>
                {datosPxGeneral?.CitaMotivo}
              </td>
            </tr>
            <tr className='border-b border-gray-100 '>
              <td className='align-top text-justify'>
                Exámen Clínico :
              </td>
              <td>
                {datosPxGeneral?.CitaExamenClinico}
              </td>
            </tr>
            <tr>
              <td className='align-top text-justify'>
                Diagnóstico CIE 10  :
              </td>
              <td>
                {
                  datosAtencion?.atencionesDiagnosticos && datosAtencion.atencionesDiagnosticos.length > 0 ? (
                    datosAtencion.atencionesDiagnosticos.map((data: any) => (
                      <div key={data?.idDiagnostico}>
                        -  ({data?.diagnostico?.codigoCIE10} - {data?.diagnostico?.descripcion}){' '}
                      </div>
                    ))
                  ) : (
                    <></>
                  )
                }
              </td>
            </tr>
            <tr>
              <td className='align-top'>
                Tratamiento :
              </td>
              <td className='align-top'>
                {
                  datosFarmacia.map((item: any) => (
                    <div key={item.idproducto}>
                      - {item?.nombre} ( {item?.cantidad})
                    </div>
                  ))
                }
              </td>
            </tr>
            <tr>
              <td className='align-top'>
                Ord.Médicas  :
              </td>
              <td>
                {datosRayosX.length > 0 && (
                  <div>
                    <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                    (Rayos X) (N° Receta: {datosRayosX[0]?.idrecetacabecera})
                    {
                      datosRayosX.map((item: any) => (
                        <div key={item.idproducto}>
                          - {item?.nombre} ( {item?.cantidad})
                        </div>
                      ))
                    }
                   
                  </div>
                )}


                {datosTomografia.length > 0 && (
                  <div>
                    <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                    (Tomografia) (N° Receta: {datosTomografia[0]?.idrecetacabecera})
                    {
                      datosTomografia.map((item: any) => (
                        <div key={item.idproducto}>
                          - {item?.nombre} ( {item?.cantidad})
                        </div>
                      ))
                    }
                  </div>
                )}

                {datosTomografia.length > 0 && (
                  <div>
                    <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                    (Ecografía General) (N° Receta: {datosEcografia[0]?.idrecetacabecera})
                    {
                      datosEcografia.map((item: any) => (
                        <div key={item.idproducto}>
                          - {item?.nombre} ( {item?.cantidad})
                        </div>
                      ))
                    }
                  </div>
                )}

                {datosEcografiaObstetrica.length > 0 && (
                  <div>
                    <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                    (Ecografía Obstétrica) (N° Receta: {datosEcografiaObstetrica[0]?.idrecetacabecera})
                    {
                      datosEcografiaObstetrica.map((item: any) => (
                        <div key={item.idproducto}>
                          - {item?.nombre} ( {item?.cantidad})
                        </div>
                      ))
                    }
                  </div>
                )}

                {datosAnatomiaPatologica.length > 0 && (
                  <div>
                    <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                    (Anatomia Patologica) (N° Receta: {datosAnatomiaPatologica[0]?.idrecetacabecera})
                    {
                      datosAnatomiaPatologica.map((item: any) => (
                        <div key={item.idproducto}>
                          - {item?.nombre} ( {item?.cantidad})
                        </div>
                      ))
                    }
                  </div>
                )}

                {datosPatologicaClinica.length > 0 && (
                  <div>
                    <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                    (Patologica Clinica) (N° Receta: {datosPatologicaClinica[0]?.idrecetacabecera})
                    {
                      datosPatologicaClinica.map((item: any) => (
                        <div key={item.idproducto}>
                          - {item?.nombre} ( {item?.cantidad})
                        </div>
                      ))
                    }
                  </div>
                )}

                {datosBancoSangre.length > 0 && (
                  <div>
                    <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                    (Banco de Sangre) (N° Receta: {datosBancoSangre[0]?.idrecetacabecera})
                    {
                      datosBancoSangre.map((item: any) => (
                        <div key={item.idproducto}>
                          - {item?.nombre} ( {item?.cantidad})
                        </div>
                      ))
                    }
                  </div>
                )}


              </td>
            </tr>


            <tr>
              <td>
                Procedimientos :
              </td>
              <td>
           
               {
                      datosProcedimientosFuera.map((item: any) => (
                        <div key={item.idSolicitudProc}>
                          - {item?.factCatalogoServicios?.nombre} ({item?.cantidad})
                        </div>
                      ))
                    }
              </td>
            </tr>

            <tr>
              <td>
                Otros Procedimientos :
              </td>
              <td>
                [4114 = PROTOENDOSCOPIA]
              </td>
            </tr>

            <tr>
              <td>
                Interconsultas :
              </td>
              <td>

              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  )
}
