'use client'
import { getData } from "@/components/helper/axiosHelper";

import { obtenerFechaYHora } from '@/components/utils/obtenerFechaYHora';
import Image from "next/image";
import { useEffect, useState } from "react";
export const RecetasOrdenesImagenes = ({ idcuentaatencion }: any) => {
  const { formattedDate, hora, fechayhora } = obtenerFechaYHora();
  const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
  const [datosAtencion, setdatosAtencion] = useState<any>([]);
  useEffect(() => {
    if (idcuentaatencion) {
      getDatosHC(idcuentaatencion)
      getdatosAtencion(idcuentaatencion)
    }
  }, [idcuentaatencion])
  const getDatosHC = async (idcuenta: any) => {
    const response = await getData(`${process.env.apijimmynew}/atenciones/${idcuenta}`);
    setdatosPxGeneral(response)
  }
  const getdatosAtencion = async (idcuenta: any) => {
    const datosAtencion = await getData(`${process.env.apijimmynew}/atenciones/findByIdCuentaAtencion/${idcuenta}`);
    setdatosAtencion(datosAtencion)
  }

  const getRayosX=async(idrecetacabecera:any,idFormaPago:any)=>{
    const data = await getData(`${process.env.apijimmynew}/recetas/apiRecetaDetallePorIdReceta/${idrecetacabecera}/${idFormaPago}/4`)
    setdatosAtencion(data)
  }

  return (
    <div className="min-h-screen flex justify-center ">
      <pre className="">
        {JSON.stringify(datosAtencion?.recetaCabeceras, null, 2)}
      </pre>
      <div className=" w-full max-w-md p-6 ">
        {/* Encabezado */}
        <div className="text-center border-b pb-2  flex justify-between">

          <div className="text-xs">
            <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
            <p>JIRÓN HERMILIO VALDIZAN NÚMERO 950 DISTRITO HUANUCO</p>
            <p>TELÉFONO: (062)</p>
          </div>

        </div>
        <div className="text-center">
          ORDEN MEDICA
        </div>
        <div className="text-xs">
          Servicio:  PONER
        </div>
        <div className="text-xs">
          Fecha/Hora Atencion: {datosPxGeneral?.FechaIngreso} {datosPxGeneral?.HoraEgreso}
        </div>
        <div className="text-xs flex justify-between">
          <span>
            N° Ord. Med:PONER
          </span>
          <span>
            N° Cta:{datosPxGeneral?.idCuentaAtencion}
          </span>
        </div>
        <div className="text-xs">
          Consultorio:  {datosPxGeneral?.servnom}
        </div>
        <div className="text-xs">
          Prof. de la Salud : {datosPxGeneral?.MedicoPaterno} {datosPxGeneral?.MedicoMaterno} {datosPxGeneral?.MedicoNombres}
        </div>
        <div className="text-xs">
          Paciente: {datosPxGeneral?.nombreCompleto}
        </div>
        <div className="text-xs">
          Tipo Plan: PONER
        </div>
        <div className="text-xs">
          {
            datosAtencion?.atencionesDiagnosticos && datosAtencion.atencionesDiagnosticos.length > 0 ? (
              datosAtencion.atencionesDiagnosticos.map((data: any, index: number) => (
                <span key={data?.idDiagnostico}>
                  ({data?.diagnostico?.codigoCIE10} - {data?.diagnostico?.descripcion})
                  {index < datosAtencion.atencionesDiagnosticos.length - 1 && ', '}
                </span>
              ))
            ) : (
              <></>
            )
          }
        </div>
        <div className=" justify-between items-center mt-1 pb-1 text-sm w-full grid-cols-1">
          {/* Datos generales */}
          <table className='border w-full text-xs'>
            <thead>
              <th>
                Concepto
              </th>
              <th>
                Cant.
              </th>
            </thead>
            <tbody>
              <tr>
                <td className='align-top font-semibold'>Concepto:</td>
                <td>{datosPxGeneral?.MedicoPaterno} {datosPxGeneral?.MedicoMaterno} {datosPxGeneral?.MedicoNombres}
                  Colegiatura: {datosPxGeneral?.MedicoColegitura}  RNE: {datosPxGeneral?.Medicorne}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
