import React from 'react'

export const FormatoInterconsulta = ({ idcuentaatencion }: any) => {
  return (
    <div>FormatoInterconsulta {idcuentaatencion}
    
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
        <tr className=' border border-black'>
          <td colSpan={9}>1. DATOS DEL PACIENTE</td>          
        </tr>
      <tr className='border border-black'>        
          <td>Nombres y Apellidos : </td> 
          <td>N° Historia Clinica : </td>         
        </tr>
        <tr className='border border-black'>
          <td>Fecha de Nacimiento : </td>
          <td>Edad: </td>
          <td>Genero: </td>
          <td>F</td>
          <td></td>
          <td>M</td>
          <td></td>
          <td>DNI (*): </td>
          <td>Tipo de Seguro de Paciente:</td>
        </tr>
      </tbody>
    </table>

    </div>
  )
}
