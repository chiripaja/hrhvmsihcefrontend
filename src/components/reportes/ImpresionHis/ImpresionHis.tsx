'use client'

import { getData } from "@/components/helper/axiosHelper"
import { useEffect, useRef, useState } from "react"
// @ts-ignore
import html2pdf from "html2pdf.js"
import * as React from 'react';
export const ImpresionHis = ({ idprogramacion }: any) => {
  const [dataAgrupada, setDataAgrupada] = useState<any[]>([])
  const [dataCabeceraHis, setdataCabeceraHis] = useState<any>()

  const getdata = async (id: any) => {
    const data = await getData(`${process.env.apijimmynew}/programacionmedica/apiimpresionhis/${id}`)
    console.log(data)
    const agrupado = agruparPorCuenta(data)
    setDataAgrupada(agrupado)
    console.log(agrupado)
  }

  const getCabecera=async(id:any)=>{
    const dataProgramacion = await getData(`${process.env.apijimmynew}/programacionmedica/${id}`)
    setdataCabeceraHis(dataProgramacion)
  }

  const agruparPorCuenta = (data: any[]) => {
    const map = new Map<number, any>()

    data.forEach((item) => {
      const id = item.IdCuentaAtencion

      // Diagnóstico original del item
      const diagnostico = {
        CodigoCIE10: item.CodigoCIE10?.trim(),
        DiagnosticoDescripcion: item.DiagnosticoDescripcion,
        SubclasificacionDiagnostico: item.SubclasificacionDiagnostico
      }

      // Si hay procedimiento, crear también un "diagnóstico" con su nombre
      const diagnosticoDesdeProcedimiento = item.nombreproc?.trim()
        ? {
          CodigoCIE10: item.codigoproc.trim(),
          DiagnosticoDescripcion: item.nombreproc.trim(),
          SubclasificacionDiagnostico: "Procedimiento"
        }
        : null

      if (!map.has(id)) {
        map.set(id, {
          IdCuentaAtencion: id,
          Sexo: item.Sexo,
          ApellidoPaterno: item.ApellidoPaterno,
          ApellidoMaterno: item.ApellidoMaterno,
          NroDocumento: item.NroDocumento,
          NombresEmpleado: item.NombresEmpleado,
          Servicio: item.Servicio,
          Diagnosticos: [],
          Procedimientos: []
        })
      }

      const paciente = map.get(id)

      // Agregar diagnóstico si no está repetido
      const yaExisteDx = paciente.Diagnosticos.some(
        (dx: any) =>
          dx.CodigoCIE10 === diagnostico.CodigoCIE10 &&
          dx.DiagnosticoDescripcion === diagnostico.DiagnosticoDescripcion &&
          dx.SubclasificacionDiagnostico === diagnostico.SubclasificacionDiagnostico
      )
      if (!yaExisteDx) {
        paciente.Diagnosticos.push(diagnostico)
      }

      // Agregar diagnóstico generado desde procedimiento si no está repetido
      if (diagnosticoDesdeProcedimiento &&
        diagnosticoDesdeProcedimiento.CodigoCIE10 !== "99203") {
        const yaExisteProcComoDx = paciente.Diagnosticos.some(
          (dx: any) =>
            dx.DiagnosticoDescripcion === diagnosticoDesdeProcedimiento.DiagnosticoDescripcion &&
            dx.SubclasificacionDiagnostico === "Procedimiento"
        )
        if (!yaExisteProcComoDx) {
          paciente.Diagnosticos.push(diagnosticoDesdeProcedimiento)
        }
      }

      // Agregar procedimiento a lista normal si no está repetido
      if (
        diagnosticoDesdeProcedimiento?.DiagnosticoDescripcion &&
        !paciente.Procedimientos.includes(diagnosticoDesdeProcedimiento.DiagnosticoDescripcion)
      ) {
        paciente.Procedimientos.push(diagnosticoDesdeProcedimiento.DiagnosticoDescripcion)
      }
    })

    return Array.from(map.values())
  }



  useEffect(() => {
    if (idprogramacion) {
      getdata(idprogramacion)
      getCabecera(idprogramacion)
    }
  }, [idprogramacion])

  const pdfRef = useRef<HTMLDivElement>(null)

  const handleExportPDF = () => {

    if (!pdfRef.current) return

    const opt = {
      margin: 0.3,
      filename: `his_${idprogramacion}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    }

    html2pdf().set(opt).from(pdfRef.current).save()
  }


  return (
    <>
  
      <button
        onClick={handleExportPDF}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hidden"
      >
        Descargar PDF
      </button>
      <div ref={pdfRef}>
      <div className="text-center mb-4">
        <div className="font-bold text-xl">HOSPITAL REGIONAL HERMILIO VALDIZAN</div>
        <div className="font-bold text-lg">Registro Diario de Atención y Otras Actividades de Salud</div>
      </div>
       


        <table className="w-full table-auto border-collapse text-sm mb-4">
          <tbody>
            <tr>
              <td colSpan={2} className="border border-black text-center">FECHA</td>
              <td className="border border-black w-10"></td>
              <td className="border border-black w-10"></td>
              <td className="border border-black text-center">DPTO</td>
              <td className="border border-black text-center">PROV</td>
              <td className="border border-black text-center">DIST</td>
              <td className="border border-black text-center">4 ESTABLEC</td>
              <td colSpan={2} className="border border-black text-center">5 UPS</td>
              <td colSpan={2} className="border border-black text-center">6 RESPONSABLE DE LA ATENCION</td>
            </tr> 
            <tr>
                <td className="border border-black text-center font-bold">2 años</td>
                <td className="border border-black text-center font-bold">3 mes</td>            
                <td colSpan={2} rowSpan={2} className="border border-black text-center w-10"></td>
                <td className="border border-black text-center bg-gray-300" rowSpan={2}>10 (Huanuco)</td>
                <td className="border border-black text-center bg-gray-300" rowSpan={2}>01</td>
                <td className="border border-black text-center bg-gray-300" rowSpan={2}>01</td>
                <td className="border border-black text-center bg-gray-300" rowSpan={2}>00754</td>
                <td className="border border-black text-center" rowSpan={2}>{dataCabeceraHis?.servicio?.nombre} ({dataCabeceraHis?.servicio?.codigoserviciohis})</td>
                <td className="border border-black text-center bg-gray-300 w-10" rowSpan={2}></td>
                <td className="border border-black text-center" rowSpan={2}>{dataCabeceraHis?.medico?.empleado?.nombres} {dataCabeceraHis?.medico?.empleado?.apellidoPaterno} {dataCabeceraHis?.medico?.empleado?.apellidomaterno}</td>
                <td className="border border-black text-center bg-gray-300 w-10" rowSpan={2}></td>
            </tr>           
            <tr>
              <td className="border border-black text-center">{dataCabeceraHis?.fecha?.split('-')[0]}</td>
                 <td className="border border-black text-center">{dataCabeceraHis?.fecha?.split('-')[1]}</td>
            </tr>

         

          </tbody>
        </table>
  <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <td className="border border-black text-center">7 Dia</td>
                <td className="border border-black text-center">8,9 (HISTORIA CLINICA/FICHA FAMILIAR)/(DNI)</td>
                <td className="border border-black text-center">10 FINAN DE SALUD</td>
                <td className="border border-black text-center">11 ETNIA</td>
                <td className="border border-black text-center">12 DISTRITO PROCEDENCIA</td>
                <td className="border border-black text-center">13 EDAD</td>
                <td className="border border-black text-center">14 SEXO</td>
                <td className="border border-black text-center">15 ESTABLECIMIENTO</td>
                <td className="border border-black text-center">16 SERVICIO</td>
                <td className="border border-black text-center">17 DIAGNOSTICO MOTIVO DE CONSULTA Y/O ACTIVIDAD DE SALUD</td>
                <td className="border border-black text-center">18 TIPO DE DIAGNOSTICO</td>
                <td className="border border-black text-center">19 LAB</td>
              </tr>
                </thead>
                <tbody className="space-y-2">
                  {/* Separador visual entre grupos */}
      <tr>
        <td colSpan={4} className="py-1 bg-gray-100"></td>
      </tr>
<pre>
  {JSON.stringify(dataAgrupada, null, 2)}
</pre>
  {dataAgrupada.map((item: any, index: number) => (
    <React.Fragment key={index}>
      {item.Diagnosticos.map((dx: any, i: number) => (
        <tr key={i} className="border-b">
          {/* Fecha (día) */}
          <td className="border border-black text-center">
            {dataCabeceraHis?.fecha?.split('-')[2]}
          </td>

          {/* Documento — solo en la primera fila, con rowspan */}
          {i === 0 && (
            <td
              className="py-1 border border-black text-center align-middle"
              rowSpan={item.Diagnosticos.length}
            >
              {item.NroDocumento}
            </td>
          )}
   {/* FINAN DE SALUD */}
          <td className="py-1 border border-black text-center">
            2
          </td>
           {/* ETNIA */}
           <td className="py-1 border border-black text-center">
            80
          </td>
             {/* DISTRITO PROCEDENCIA */}
          <td className="py-1 border border-black text-center">
            Punchao (Huamalies) (Huanuco)
          </td>
          {/* Diagnóstico */}
          <td className="py-1 border border-black text-center">
            {dx.DiagnosticoDescripcion}
          </td>

          {/* Subclasificación */}
          <td className="border border-black text-center">
            {dx.SubclasificacionDiagnostico}
          </td>

          {/* Código CIE10 */}
          <td className="border border-black text-center font-bold">
            {dx.CodigoCIE10}
          </td>
        </tr>
      ))}

      {/* Separador visual entre grupos */}
      <tr>
        <td colSpan={5} className="py-1 bg-gray-100"></td>
      </tr>
    </React.Fragment>
  ))}


</tbody>

          
              
     </table>
        {dataAgrupada.map((item: any, index: number) => (
          <div key={index} className="border border-black p-2 mb-4">

   
       

            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="border-t border-b">
                  <th className="text-left py-1 w-1/6">DNI:</th>
                  <th className="text-left py-1 w-3/6">Diagnóstico</th>
                  <th className="text-center px-2 w-1/6">Tipo</th>
                  <th className="text-right py-1 w-1/6">CIE10</th>
                </tr>
              </thead>
              <tbody>
                {item.Diagnosticos.map((dx: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="py-1">{item.NroDocumento}</td>
                    <td className="py-1">{dx.DiagnosticoDescripcion}</td>
                    <td className="text-center">{dx.SubclasificacionDiagnostico}</td>
                    <td className="text-right font-bold">{dx.CodigoCIE10}</td>
                  </tr>
                ))}

              </tbody>
            </table>


          </div>
        ))}




      </div>        </>
  )
}
