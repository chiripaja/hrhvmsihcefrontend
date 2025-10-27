'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import TablaRecomendaciones from './TablaRecomendaciones'

export const FormatoTeleconsulta = ({ idcuentaatencion }: any) => {
  const [datapx, setdatapx] = useState<any>()

  const getAtencionData = async (id: string) => {
    const {data}=await axios.get(`${process.env.apijimmynew}/atenciones/cuenta/${id}`)
    setdatapx(data)
  }

  useEffect(() => {
    if(idcuentaatencion){
      getAtencionData(idcuentaatencion)
    }
  }, [idcuentaatencion])
  

  // 🔹 Filtramos solo las recetas de Farmacia
  const recetasFarmacia = datapx?.recetaCabeceras?.filter(
    (data: any) => data.idPuntoCarga === 5
  )

  // 🔹 Si hay recetas, combinamos todos los productos
  const detalles = recetasFarmacia?.flatMap(
    (r: any) => r.recetaDetalles || []
  ) || []
  return (
    <div className="p-2 print-container"> 
   
    <table className='border border-collapse w-full'>
      <tbody>
        <tr className='text-center border border-black'>
          <td>FORMATO DE ATENCION DE TELEINTERCONSULTA N°</td>          
        </tr>
        <tr>
          <td className='text-center border border-black'>RESPUESTA</td>
        </tr>
        <tr>
          <td className='bg-black text-white ml-2'>ATENCION DE TELEINTERCONSULTA (Para ser llenado por el Teleconsultor)</td>
        </tr>
        <tr className='border border-black'>
          <td>Nombre de IPRESS Consultante</td> 
        </tr>
      </tbody>
    </table>
    
    <table className='border border-collapse w-full mt-2'>
      <tbody>
        <tr className='border border-black'>
          <td colSpan={9}>1. DATOS DEL PACIENTE</td>          
        </tr>
      <tr className='border border-black'>        
          <td colSpan={9} className='border border-black'>Nombres y Apellidos : </td> 
          <td colSpan={1}>N° Historia Clinica : </td>         
        </tr>
        <tr className='border border-black'>
          <td className='border border-black' colSpan={2}>Fecha de Nacimiento : </td>
          <td className='border border-black'>Edad: </td>
          <td className='border border-black w-4'>Genero: </td>
          <td className='border border-black w-4'>F</td>
          <td className='border border-black w-4'></td>
          <td className='border border-black w-4'>M</td>
          <td className='border border-black w-4'></td>
          <td className='border border-black'>DNI (*): </td>
          <td>Tipo de Seguro de Paciente:</td>
        </tr>
        <tr>
          <td className='border border-black w-32'>UPS de origen</td>
          <td className='border border-black' colSpan={8}>CE. Cardiologia 1</td>
          <td colSpan={6} className='border border-black'>N° de Seguro de Paciente: </td>
        </tr>
      </tbody>
    </table>

    <table className='w-full border border-black'>
      <tbody>
        <tr>
          <td className='border border-black' colSpan={8}>RESPUESTA DE TELECONSULTA</td>
        </tr>
        <tr>
          <td className='border border-black w-52'>Fecha:</td>
          <td colSpan={4} className='border border-black'>Hora de inicio de la Teleconsulta:</td>
          <td className='border border-black' colSpan={3}>Hora de fin de la Teleconsulta:</td>
        </tr>
        <tr>
          <td className='border border-black'>Modalidad de teleconsulta</td>
          <td className='border border-black'>En linea: Simple</td>
          <td className='border border-black w-4'></td>
          <td className='border border-black'>Telepresencia</td>
          <td className='border border-black w-4'></td>
          <td className='border border-black'>Telejunta</td>
          <td className='border border-black w-4'></td>
          <td className='border border-black'></td>          
        </tr>
        <tr>
          <td colSpan={8}>
            Respuesta a la interconsulta (Descripción de los hallazgos):
          </td>
        </tr> 
        <tr>
          <td colSpan={8} className='h-40'>
            
          </td>
        </tr> 
      </tbody>
    </table>

   <table className='border border-black border-collapse w-full mt-2'>
  <tbody>
    <tr>
      <td className='border border-black text-center font-semibold'>N°</td>
      <td className='border border-black text-center font-semibold'>CIE 10</td>
      <td className='border border-black text-center font-semibold'>DESCRIPCIÓN DE DIAGNÓSTICOS</td>
      <td className='border border-black text-center font-semibold'>P</td>
      <td className='border border-black text-center font-semibold'>D</td>
      <td className='border border-black text-center font-semibold'>R</td>
    </tr>

    {/* 🔹 Mostramos los diagnósticos que vienen del objeto */}
    {datapx?.atencionesDiagnosticos?.map((dx: any, index: number) => (
      <tr key={dx.idAtencionDiagnostico} className="border border-black text-center">
        <td className="border border-black">{index + 1}</td>
        <td className="border border-black">{dx.diagnostico?.codigoCIE10 || ''}</td>
        <td className="border border-black text-left px-1">{dx.diagnostico?.descripcion || ''}</td>

        {/* 🔹 Marcamos la subclasificación (P, D o R) según el código */}
        <td className="border border-black">{dx.subclasificacionDiagnosticos?.codigo === 'P' ? 'X' : ''}</td>
        <td className="border border-black">{dx.subclasificacionDiagnosticos?.codigo === 'D' ? 'X' : ''}</td>
        <td className="border border-black">{dx.subclasificacionDiagnosticos?.codigo === 'R' ? 'X' : ''}</td>
      </tr>
    ))}

    {/* 🔹 Rellenamos las filas vacías hasta llegar a 6 */}
    {[...Array(6 - (datapx?.atencionesDiagnosticos?.length || 0))].map((_, rowIndex) => (
      <tr key={`empty-${rowIndex}`} className="border border-black text-center">
        <td className="border border-black">{(datapx?.atencionesDiagnosticos?.length || 0) + rowIndex + 1}</td>
        <td className="border border-black"></td>
        <td className="border border-black"></td>
        <td className="border border-black"></td>
        <td className="border border-black"></td>
        <td className="border border-black"></td>
      </tr>
    ))}
  </tbody>
</table>



    <TablaRecomendaciones receta={detalles} />

    <table className='w-full border-collapse border-black'>
      <tbody>
        <tr>
          <td  colSpan={3} className='border border-black'>2. DATOS DEL TELECONSULTOR:</td>          
        </tr>
        <tr>
          <td className='border border-black'>Nombres y Apellidos:</td>
          <td className='border border-black text-center'>{datapx?.medico?.empleado?.nombres} {datapx?.medico?.empleado?.apellidoPaterno} {datapx?.medico?.empleado?.apellidomaterno}</td>
          <td rowSpan={3} className='w-56 border border-black'></td>
        </tr>
        <tr>
          <td className='w-1/4 border border-black'>Profesional de Salud / Especialidad / Subespecialidad:</td>
          <td className='border border-black text-center'>{datapx?.medico?.empleado?.tiposEmpleado?.descripcion}</td>           
        </tr>
        <tr>
          <td className='border border-black'>N° Colegio profesional / RNE:</td>
          <td className='border border-black text-center'>{datapx?.medico?.colegiatura}</td>
        </tr>
      </tbody>
    </table>
 <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait; /* o landscape si lo quieres horizontal */
            margin: 10mm;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-container {
            zoom: 0.75; /* 🔹 Ajusta este valor: reduce tamaño global del contenido */
            margin-top: 5mm; /* 🔹 Pequeño margen arriba */
          }

          table {
            page-break-inside: avoid !important;
          }

          td, th {
            font-size: 11px !important; /* 🔹 Texto más pequeño para que entre todo */
            padding: 2px !important;
          }
        }
      `}</style>
    </div>
  )
}
