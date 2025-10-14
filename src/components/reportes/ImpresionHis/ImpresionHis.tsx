'use client'

import { getData } from "@/components/helper/axiosHelper"
import { useEffect, useRef, useState } from "react"
// @ts-ignore
import html2pdf from "html2pdf.js"
import * as React from 'react';
<style jsx global>{`
  @media print {
    /* Asegura que las tablas internas se alineen por fila */
    td.align-top table {
      table-layout: fixed;
      width: 100%;
    }

    /* Cada fila tendrá una altura fija */
    td.align-top table tr {
      height: 18px; /* ajusta según tu necesidad */
    }

    /* El contenido no debe romper la altura */
    td.align-top table td {
      vertical-align: middle;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`}</style>
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

  const getCabecera = async (id: any) => {
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
              <td colSpan={2} className="border border-black text-center font-bold">FECHA</td>
              <td className="border border-black w-10"></td>
              <td className="border border-black w-10"></td>
              <td className="border border-black text-center font-bold">DPTO</td>
              <td className="border border-black text-center font-bold">PROV</td>
              <td className="border border-black text-center font-bold">DIST</td>
              <td className="border border-black text-center font-bold">4 ESTABLEC</td>
              <td colSpan={2} className="border border-black text-center font-bold">5 UPS</td>
              <td colSpan={2} className="border border-black text-center font-bold">6 RESPONSABLE DE LA ATENCION</td>
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
              <td className="border border-black text-center font-bold">7 Dia</td>
              <td className="border border-black text-center w-6 font-bold">8,9 (HISTORIA CLINICA/FICHA FAMILIAR)/(DNI)</td>
              <td className="border border-black text-center font-bold">10 FINAN DE SALUD</td>
              <td className="border border-black text-center font-bold">11 ETNIA</td>
              <td className="border border-black text-center font-bold">12 DISTRITO PROCEDENCIA</td>
              <td className="border border-black text-center font-bold">13 EDAD</td>
              <td className="border border-black text-center font-bold" colSpan={2}>14 SEXO</td>
              <td className="border border-black text-center w-7 font-bold" colSpan={3}>15 ESTABLECIMIENTO</td>
              <td className="border border-black text-center font-bold" colSpan={3}>16 SERVICIO</td>
              <td className="border border-black text-center font-bold">17 DIAGNOSTICO MOTIVO DE CONSULTA Y/O ACTIVIDAD DE SALUD</td>
              <td className="border border-black text-center font-bold">18 TIPO DE DIAGNOSTICO</td>
              <td className="border border-black text-center font-bold">19 LAB</td>
            </tr>
          </thead>
       <tbody className="space-y-2">
  <tr>
    <td className="border border-black text-center"></td>
    <td className="border border-black text-center"></td>
    <td className="border border-black text-center"></td>
    <td className="border border-black text-center"></td>
    <td className="border border-black text-center"></td>
    <td className="border border-black text-center"></td>
    <td className="border border-black text-center w-4">M</td>
    <td className="border border-black text-center w-4">F</td>
    <td className="border border-black text-center">N</td>
    <td className="border border-black text-center">C</td>
    <td className="border border-black text-center">R</td>
    <td className="border border-black text-center">N</td>
    <td className="border border-black text-center">C</td>
    <td className="border border-black text-center">R</td>
    <td className="border border-black text-center"></td>
    <td className="border border-black text-center"></td>
    <td className="border border-black text-center"></td>
  </tr>

  {dataCabeceraHis?.citas
    ?.filter((cita: any) => cita?.atencion?.atencionesDiagnosticos?.length)
    ?.map((cita: any, index: number) => {
      const diagnosticos = cita?.atencion?.atencionesDiagnosticos || [];
      const totalDx = diagnosticos.length;

      return (
        <React.Fragment key={index}>
          <tr><td colSpan={17} className="h-4"></td></tr>

          {diagnosticos.map((diag: any, idx: number) => (
            <tr key={idx} className="border-b">
              {/* Solo la primera fila muestra los datos generales con rowspan */}
              {idx === 0 && (
                <>
                  <td className="border border-black text-center " rowSpan={totalDx}>
                    {String(new Date(cita.fecha).getDate()).padStart(2, '0')}
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {cita?.atencion?.pacienteDTO?.nroHistoriaClinica || ""}
                    <p>DNI: {cita?.atencion?.pacienteDTO?.nroDocumento || ""}</p>
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {cita?.atencion?.idFormaPago || ""}
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}>80</td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {cita?.atencion?.pacienteDTO?.distrito + " -" || ""} 
                    {cita?.atencion?.pacienteDTO?.provincia + " -" || ""} 
                    {cita?.atencion?.pacienteDTO?.departamento || ""}
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {(() => {
                      const fechaNacimiento = cita?.atencion?.pacienteDTO?.fechaNacimiento;
                      if (!fechaNacimiento) return "";
                      const fecha = new Date(fechaNacimiento);
                      const hoy = new Date();
                      let edad = hoy.getFullYear() - fecha.getFullYear();
                      const mes = hoy.getMonth() - fecha.getMonth();
                      if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) edad--;
                      return edad + " años";
                    })()}
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {cita?.atencion?.pacienteDTO?.idTipoSexo === '1' ? 'X' : ''}
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {cita?.atencion?.pacienteDTO?.idTipoSexo === '2' ? 'X' : ''}
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}></td>
                  <td className="border border-black text-center" rowSpan={totalDx}>X</td>
                  <td className="border border-black text-center" rowSpan={totalDx}></td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {cita?.atencion?.idTipoCondicionAlServicio == '1' ? 'X' : ''}
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {cita?.atencion?.idTipoCondicionAlServicio == '2' ? 'X' : ''}
                  </td>
                  <td className="border border-black text-center" rowSpan={totalDx}>
                    {cita?.atencion?.idTipoCondicionAlServicio == '3' ? 'X' : ''}
                  </td>
                </>
              )}

              {/* Columnas de diagnóstico */}
              <td className="border border-black text-left px-1 py-0.5">
                {diag?.diagnostico?.codigoCIE10} - {diag?.diagnostico?.descripcion}
              </td>
              <td className="border border-black text-center px-1 py-0.5">
                {diag?.subclasificacionDiagnosticos?.codigo}
              </td>
              <td className="border border-black text-center px-1 py-0.5">
                {diag?.labConfHIS}
              </td>
            </tr>
          ))}
        </React.Fragment>
      );
    })}
</tbody>




        </table>




      </div>        </>
  )
}
