'use client'
import React from 'react'

export const FormatoInterconsulta = ({ idcuentaatencion }: any) => {
  return (
    <div className="p-2 print-container">FormatoInterconsulta {idcuentaatencion}
    
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
          <td className='border border-black text-center'>N°</td>
          <td className='border border-black text-center'>CIE 10</td>
          <td className='border border-black text-center'>DESCRIPCION DE DIAGNOSTICOS</td>
          <td className='border border-black text-center'>P</td>
          <td className='border border-black text-center'>D</td>
          <td className='border border-black text-center'>R</td>
        </tr>

        {[...Array(6)].map((_, rowIndex) => (
    <tr key={rowIndex} className="border border-black text-center">
      {/* Aquí puedes poner tus <td> manuales o vacíos */}
      <td className="border border-black text-center">{rowIndex+1}</td>
      <td className="border border-black text-center"></td>
      <td className="border border-black text-center"></td>
      <td className="border border-black text-center"></td>
      <td className="border border-black text-center"></td>
      <td className="border border-black text-center"></td>
    </tr>
  ))}
        
      </tbody>
    </table>



    <table className='w-full border-collapse  mt-2'>
      <tbody>
        <tr  className='w-full border-collapse text-center border border-black'>
          <td colSpan={4}>RECOMENDACIONS / PLAN</td>
        </tr>
        <tr>
          <td className='border-r border-l border-black text-center'>1</td>
          <td className=''></td>
          <td className='border-r border-l border-black w-3 text-center'>8</td>
          <td className=' w-96 text-center border-black border-r'></td>
        </tr>
        <tr>
          <td className='border-r border-l border-black w-3 text-center'>2</td>
          <td className=' w-96 text-center'></td>
          <td className='border-black border-r border-l w-3 text-center'>9</td>
          <td className=' w-96 text-center border-black border-r'></td>
        </tr>
        <tr>
          <td className='border-r border-l border-black w-3 text-center'>3</td>
          <td className=' w-96 text-center'></td>
          <td className='border-black border-r border-l w-3 text-center'>10</td>
          <td className=' w-96 text-center border-black border-r'></td>
        </tr>
        <tr>
          <td className='border-r border-l border-black w-3 text-center'>4</td>
          <td className=' w-96 text-center'></td>
          <td className='border-black border-r border-l w-3 text-center'></td>
          <td className=' w-96 text-center border-black border-r'></td>
        </tr>
        <tr>
          <td className='border-r border-l border-black w-3 text-center'>5</td>
          <td className=' w-96 text-center'></td>
          <td className='border-black border-r border-l w-3 text-center'></td>
          <td className=' w-96 text-center border-black border-r'></td>
        </tr>
        <tr>
          <td className='border-r border-l border-black w-3 text-center'>6</td>
          <td className=' w-96 text-center'></td>
          <td className='border-black border-r border-l w-3 text-center'></td>
          <td className=' w-96 text-center border-black border-r'></td>
        </tr>
         <tr>
          <td className='border-r border-l border-b border-black w-3 text-center'>7</td>
          <td className=' w-96 text-center border-b border-black'></td>
          <td className='border-black border-r border-l border-b w-3 text-center'></td>
          <td className=' w-96 text-center border-b border-black border-r'></td>
        </tr>
      </tbody>
    </table>

    <table className='w-full border-collapse border-black'>
      <tbody>
        <tr>
          <td  colSpan={3} className='border border-black'>2. DATOS DEL TELECONSULTOR:</td>          
        </tr>
        <tr>
          <td className='border border-black'>Nombres y Apellidos:</td>
          <td className='border border-black'></td>
          <td rowSpan={3} className='w-56 border border-black'></td>
        </tr>
        <tr>
          <td className='w-1/4 border border-black'>Profesional de Salud / Especialidad / Subespecialidad:</td>
          <td className='border border-black'></td>           
        </tr>
        <tr>
          <td className='border border-black'>N° Colegio profesiona / RNE:</td>
          <td className='border border-black'></td>
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
