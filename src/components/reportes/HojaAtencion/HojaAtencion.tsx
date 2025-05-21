'use client'

import React, { useEffect, useState } from 'react'
import Image from "next/image";
import axios from 'axios';
import { obtenerFechaYHora } from '@/components/utils/obtenerFechaYHora';
import { getData } from '@/components/helper/axiosHelper';
export const HojaAtencion = ({ idcuentaatencion }: any) => {

  const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
  const handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    getDatosHC(idcuentaatencion)
  }, [idcuentaatencion])
  const getDatosHC = async (idcuentaatencion: any) => {

    const response = await getData(`${process.env.apijimmynew}/atenciones/${idcuentaatencion}`);
    setdatosPxGeneral(response)
        const { data } = await axios.get(`${process.env.apijimmynew}/atenciones/${idcuentaatencion}`);
     console.log(data)
  }

  function obtenerHoraActual() {
    const fecha = new Date();
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const esAM = horas < 12;

    // Convertir formato 24 horas a 12 horas
    horas = horas % 12 || 12;

    // Formatear minutos con dos dígitos
    const minutosFormateados = minutos.toString().padStart(2, "0");

    // Crear el formato final
    const periodo = esAM ? "a. m." : "p. m.";
    return `${horas}:${minutosFormateados} ${periodo}`;
  }
  useEffect(() => {
    if (datosPxGeneral) {
      //window.print();
    }

  }, [datosPxGeneral])

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
              <td>
                Diagnóstico CIE 10  :
              </td>
              <td>
                (R10.0-P -Abdomen agudo)
              </td>
            </tr>
            <tr>
              <td>
                Tratamiento :
              </td>
              <td>
                (Farmacia:) (N° Receta: 72236)
                ----------------------------------------------------------------------------------------
                0020 00056//ACETAZOLAMIDA 250 mg TABLETA
              </td>
            </tr>
            <tr>
              <td>
                Ord.Médicas  :
              </td>
              <td>
                ¨
                ----------------------------------------------------------------------------------------
                (Rayos X) (N° Receta: 72237)
                ----------------------------------------------------------------------------------------
                0001 55840//ADENOMECTOMIA PROSTATICA
                ¨
                ----------------------------------------------------------------------------------------
                (Ecografía Obstétrica) (N° Receta: 72238)
                ----------------------------------------------------------------------------------------
                0001 36000//CANALIZACION DE VIA PERIFERICA
                ¨
                ----------------------------------------------------------------------------------------
                (Ecografía General) (N° Receta: 72239)
                ----------------------------------------------------------------------------------------
                0001 D3425//APICECTOMIA DIENTE MOLAR
                ¨
                ----------------------------------------------------------------------------------------
                (Tomografía) (N° Receta: 72240)
                ----------------------------------------------------------------------------------------
                0001 73200.6//TEM HOMBRO SIN CONTRASTE
                ¨
                ----------------------------------------------------------------------------------------
                (Anatomía Patológica) (N° Receta: 72241)
                ----------------------------------------------------------------------------------------
                0001 40490//BIOPSIA DE LABIO
                ¨
                --------------------------------------------------------------------------------------
              </td>
            </tr>
            <tr>
              <td>
                Procedimientos :
              </td>
              <td>
                [27080 = COCCIGECTOMIA PRIMARIA]
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
