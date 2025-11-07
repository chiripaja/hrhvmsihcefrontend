'use client'
import React, { useEffect, useState } from 'react'
import { obtenerFechaYHora } from "@/components/utils/obtenerFechaYHora";
import axios from "axios";
import Image from "next/image";
import './HistoriaClinicaEmer.css'

export default function HistoriaClinicaEmer({ idcuentaatencion }: any) {
  const [datosPx, setdatosPx] = useState<any>();

  const getDatosHC = async (idcuentaatencion: any) => {
    const { data } = await axios.get(`${process.env.apijimmynew}/atenciones/apiImprimirHc/${idcuentaatencion}`);
    console.log(data)
    setdatosPx(data);
  };

  useEffect(() => {
    getDatosHC(idcuentaatencion);
  }, [idcuentaatencion]);

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

  const { formattedDate } = obtenerFechaYHora();

  return (
    <>
      <div className="flex justify-center bg-gray-100 print:bg-white">
        {/* Hoja A4 exacta */}
        <div
          className="bg-white w-[210mm] h-[297mm] p-6 shadow-lg print:shadow-none print:m-0 print:p-6 overflow-hidden scale-container"
        >
          <div className="text-xs leading-tight w-full max-w-full mx-auto">

            {/* Encabezado */}
            <div className="border-b pb-2 mb-2 flex justify-between items-center">
              <div>
                <Image
                  src="/img/loghrhvm.png"
                  alt="Logo del hospital"
                  width={120}
                  height={120}
                  className="w-28 h-auto"
                />
              </div>
              <div className="text-center text-[10px] flex-1">
                <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
                <p>JIRÓN HERMINIO VALDIZÁN N°600 - HUÁNUCO</p>
                <p>TELÉFONO: (062)</p>
              </div>
              <div className="text-[10px] text-right">
                <span>{formattedDate}</span><br />
                <span>{obtenerHoraActual()}</span><br />
                <span>Página 1 de 2</span>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-center text-lg font-bold mb-2">
              HISTORIA CLÍNICA DE EMERGENCIA
            </h1>

            {/* Información General */}
            <table className="w-full text-[11px] mb-1">
              <tbody>
                <tr>
                  <td className="font-bold">N° Historia:</td>
                  <td>{datosPx?.NroHistoriaClinica}</td>
                  <td className="font-bold">N° Cuenta:</td>
                  <td>{datosPx?.IdCuentaAtencion} SIS</td>
                </tr>
                <tr>
                  <td className="font-bold w-32">Apellidos y Nombres:</td>
                  <td>{datosPx?.nombrespx}</td>
                  <td className="font-bold">DNI:</td>
                  <td>{datosPx?.NroDocumento}</td>
                </tr>
                <tr>
                  <td className="font-bold">Fecha ingreso:</td>
                  <td>{datosPx?.FechaIngreso}</td>
                  <td className="font-bold">Edad:</td>
                  <td>{datosPx?.Edad} </td>
                </tr>
                <tr>
                  <td className="font-bold">Hora ingreso:</td>
                  <td>{datosPx?.HoraIngreso}</td>
                  <td className="font-bold">Fecha Nacimiento:</td>
                  <td>{datosPx?.FechaNacimiento}</td>
                </tr>

                <tr>
                  <td className="font-bold">Consultorio médico:</td>
                  <td>{datosPx?.servicio}</td>
                  <td className="font-bold">Sexo:</td>
                  <td>{datosPx?.sexo}</td>
                </tr>
                <tr>
                  <td className="font-bold">Médico:</td>
                  <td className="uppercase">{datosPx?.Medico}</td>
                  <td className="font-bold">Ocupación:</td>
                  <td>{datosPx?.tipoocupacion}</td>
                </tr>
                <tr>
                  <td className="font-bold">Teléfono:</td>
                  <td>{datosPx?.Telefono}</td>
                  <td className="font-bold">Dirección:</td>
                  <td>{datosPx?.direccion}</td>
                </tr>


                <tr>
                  <td className="font-bold">Estado civil:</td>
                  <td>{datosPx?.estadocivil}</td>
                  <td className="font-bold w-32">Grado de Instrucción:</td>
                  <td>{datosPx?.gradoInstruccion}</td>
                </tr>


                <tr>
                  <td className="font-bold">Lugar Nacimiento:</td>
                  <td className="capitalize">

                    {datosPx?.distritoNacimiento ? datosPx?.distritoNacimiento : ''}
                    {datosPx?.provinciaNacimiento ? ` / ` + datosPx?.provinciaNacimiento : ''}
                    {datosPx?.departamentoNacimiento ? ` / ` + datosPx?.departamentoNacimiento : ''}
                  </td>
                  <td className="font-bold">Lugar Procedencia:</td>
                  <td>
                    {datosPx?.DistritoProcedencia ? datosPx?.DistritoProcedencia : ''}
                    {datosPx?.provinciaProcedencia ? ` / ` + datosPx?.provinciaProcedencia : ''}
                    {datosPx?.departamentoProcedencia ? ` / ` + datosPx?.departamentoProcedencia : ''}
                  </td>
                </tr>


                <tr>
                  <td className="font-bold">Lugar Domicilio:</td>
                  <td>
                    {datosPx?.distrito ? datosPx?.distrito : ''}
                    {datosPx?.provincia ? ` / ` + datosPx?.provincia : ''}
                    {datosPx?.departamento ? ` / ` + datosPx?.departamento : ''}
                  </td>
                  <td className="font-bold">Religión:</td>
                  <td> - </td>
                </tr>

                <tr>
                  <td className="font-bold"> Acompañante:</td>
                  <td colSpan={3}> {datosPx?.NombreAcompaniante ? datosPx?.NombreAcompaniante : ''}</td>
                </tr>
              </tbody>
            </table>

            {/* Signos vitales */}
            <table className="w-full border border-black text-[11px] mb-1">
              <tbody>
                <tr>
                  <td className="border border-black font-bold p-1">PA:</td>
                  <td className="border border-black font-bold p-1">FR:</td>
                  <td className="border border-black font-bold p-1">FC:</td>
                  <td className="border border-black font-bold p-1">SAT.O2:</td>
                  <td className="border border-black font-bold p-1">T°:</td>
                  <td className="border border-black font-bold p-1">Peso:</td>
                  <td className="border border-black font-bold p-1">Talla:</td>
                </tr>
                <tr>
                  <td colSpan={7} className="border border-black h-6"></td>
                </tr>
              </tbody>
            </table>

            {/* Anamnesis */}
            <table className="w-full text-[11px] leading-tight">
              <tbody>
                <tr>
                  <td className="font-bold">ANAMNESIS</td>
                </tr>
                <tr>
                  <td className="font-bold pt-1">TE: </td>
                  <td className="font-bold">MOTIVO DE CONSULTA:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-24">RELATO:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-24">ANTECEDENTES:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-24">EXAMEN FÍSICO:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-2.5">GENERAL:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-2.5">RESPIRATORIO:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-2.5">CARDIOVASCULAR:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-2.5">ABDOMEN:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-2.5">NEUROLÓGICO:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-2.5">GENITOURINARIO:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-2.5">LOCOMOTOR:</td>
                </tr>
                <tr>
                  <td colSpan={2} className="font-bold pt-2.5">OTROS:</td>
                </tr>
              </tbody>
            </table>

            <table className="w-full text-[11px] leading-tight border border-black mt-2">
              <tbody>
                <tr>
                  <td className="font-bold border border-black text-center">PROBLEMAS DIAGNOSTICOS:</td>
                  <td className="font-bold border border-black w-24 text-center">Codigo CIE-10</td>
                </tr>
                <tr>
                  <td className="font-bold border border-black">DX1</td>
                  <td className="font-bold border border-black"></td>
                </tr>
                <tr>
                  <td className="font-bold border border-black">DX2</td>
                  <td className="font-bold border border-black"></td>
                </tr>
                <tr>
                  <td className="font-bold border border-black">DX3</td>
                  <td className="font-bold border border-black"></td>
                </tr>
                <tr>
                  <td className="font-bold border border-black">DX4</td>
                  <td className="font-bold border border-black"></td>
                </tr>


              </tbody>
            </table>
          </div>
        </div>


      </div>
      <div className="page-break"></div>
      {/* segunda hoja*/}
      <div className="flex justify-center bg-gray-100 print:bg-white ">
        {/* Hoja A4 exacta */}
        <div
          className="bg-white w-[210mm] h-[297mm] p-6 shadow-lg print:shadow-none print:m-0 print:p-6 overflow-hidden scale-container"
        >
          <div className="text-xs leading-tight w-full max-w-full mx-auto">
            <div className="border-b pb-2 mb-2 flex justify-between items-center">
              <div>
                <Image
                  src="/img/loghrhvm.png"
                  alt="Logo del hospital"
                  width={120}
                  height={120}
                  className="w-28 h-auto"
                />
              </div>
              <div className="text-center text-[10px] flex-1">
                <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
                <p>JIRÓN HERMINIO VALDIZÁN N°600 - HUÁNUCO</p>
                <p>TELÉFONO: (062)</p>
              </div>
              <div className="text-[10px] text-right">
                <span>{formattedDate}</span><br />
                <span>{obtenerHoraActual()}</span><br />
                <span>Página 2 de 2</span>
              </div>
            </div>

            <table className="w-full text-[11px] leading-tight mt-10">
              <tbody>
                <tr>
                  <td className="font-bold  ">PLAN DE TRABAJO:</td>
                </tr>
                <tr>
                  <td className='pt-20'>

                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">TRATAMIENTO:</td>
                </tr>
                <tr>
                  <td className='pt-20'>

                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">EVOLUCIÓN:</td>
                </tr>
                <tr>
                  <td className='pt-20'>

                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">CONDICION DE EGRESO:</td>
                </tr>
                <tr>
                  <td className='pt-20'>

                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">TIEMPO DE PERMANENCIA:</td>
                </tr>
                <tr>
                  <td className='font-bold pt-10'>
                    FECHA ALTA:
                  </td>
                  <td className='font-bold'>
                    HORA ALTA:
                  </td>
                </tr>
                <tr>
                  <td className='pt-40 text-center' colSpan={2}>
                    Firma y sello del Médico Responsable Atención/Emergencia
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </>
  );
}
