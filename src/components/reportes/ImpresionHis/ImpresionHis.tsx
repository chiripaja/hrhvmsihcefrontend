'use client'

import { getData } from "@/components/helper/axiosHelper"
import { useEffect, useRef, useState } from "react"
// @ts-ignore
import html2pdf from "html2pdf.js"
export const ImpresionHis = ({ idprogramacion }: any) => {
  const [dataAgrupada, setDataAgrupada] = useState<any[]>([])

  const getdata = async (id: any) => {
    const data = await getData(`${process.env.apijimmynew}/programacionmedica/apiimpresionhis/${id}`)

    const agrupado = agruparPorCuenta(data)
    setDataAgrupada(agrupado)
    console.log(agrupado)
  }

  const agruparPorCuenta = (data: any[]) => {
    const map = new Map<number, any>()

    data.forEach((item) => {
      const id = item.IdCuentaAtencion

      const diagnostico = {
        CodigoCIE10: item.CodigoCIE10?.trim(),
        DiagnosticoDescripcion: item.DiagnosticoDescripcion,
        SubclasificacionDiagnostico: item.SubclasificacionDiagnostico
      }

      if (map.has(id)) {
        map.get(id).Diagnosticos.push(diagnostico)
      } else {
        map.set(id, {
          IdCuentaAtencion: id,
          Sexo: item.Sexo,
          ApellidoPaterno: item.ApellidoPaterno,
          ApellidoMaterno: item.ApellidoMaterno,
          NroDocumento: item.NroDocumento,
          NombresEmpleado: item.NombresEmpleado,
          Servicio: item.Servicio,
          Diagnosticos: [diagnostico]
        })
      }
    })

    return Array.from(map.values())
  }

  useEffect(() => {
    if (idprogramacion) {
      getdata(idprogramacion)
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

      
            {dataAgrupada.map((item: any, index: any) => (
                <div key={index} className="border border-black p-2 mb-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                        <div>
                            <p>DNI: {item.NroDocumento}</p>
                        </div>
                        <div>
                            <p></p>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                        {item.Servicio}
                    </div>

                    <table className="w-full table-auto border-collapse text-sm">
                        <thead>
                            <tr className="border-t border-b">
                                <th className="text-left py-1">Diagnóstico</th>
                                <th className="text-center px-2">Tipo</th>
                                <th className="text-right py-1">CIE10</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.Diagnosticos.map((dx: any, i: number) => (
                                <tr key={i} className="border-b">
                                    <td className="py-1">{dx.DiagnosticoDescripcion}</td>
                                    <td className="text-center">{dx?.SubclasificacionDiagnostico}</td>
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
