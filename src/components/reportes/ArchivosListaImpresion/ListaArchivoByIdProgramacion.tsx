'use client'
import { getData } from '@/components/helper/axiosHelper'
import React, { useEffect, useState } from 'react'

interface Paciente {
  IdCuentaAtencion: number
  Fecha: string
  NroHistoriaClinica: string
  PrimerNombre: string
  SegundoNombre: string | null
  ApellidoPaterno: string
  ApellidoMaterno: string
  NroDocumento: string
  Telefono: string | null
  NombreServicio: string
  NombresMedico: string
  ApellidoPaternoMedico: string
  ApellidoMaternoMedico: string
  HoraInicio: string
}

interface Props {
  idprogramacion: string
}

const ListaArchivoByIdProgramacion: React.FC<Props> = ({ idprogramacion }) => {
  const [listado, setListado] = useState<Paciente[]>([])

const getListaArchivos = async (idprogramacion: string) => {
  try {
    const data = await getData(
      `${process.env.apijimmynew}/programacionmedica/apilistasarchivosbyidprogramacion/${idprogramacion}`
    )
    console.log(data)

    // 🔹 Ordenar correctamente por fecha + hora
    const dataOrdenada = [...data].sort((a, b) => {
      // Combinar la fecha y hora para comparar correctamente
      const fechaA = new Date(`${a.Fecha.split('T')[0]}T${a.HoraInicio}:00`)
      const fechaB = new Date(`${b.Fecha.split('T')[0]}T${b.HoraInicio}:00`)
      return fechaA.getTime() - fechaB.getTime() // ascendente
    })

    setListado(dataOrdenada)
  } catch (error) {
    console.error('Error al obtener los datos:', error)
  }
}

  useEffect(() => {
    if (idprogramacion) getListaArchivos(idprogramacion)
  }, [idprogramacion])

  // 👉 Imprimir automáticamente cuando los datos estén listos
  useEffect(() => {
    if (listado.length > 0) {
      const timer = setTimeout(() => {
        window.print()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [listado])

  const ImpresionHF = (idcuenta:any) => { 
     window.open(
      `/reportes/historiaclinica/${idcuenta}`,
      "_blank"
    );
    console.log(idcuenta)
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0.5cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            zoom: 85%; /* Ajusta el contenido a una sola hoja */
          }
          table {
            font-size: 10px !important;
          }
          th, td {
            padding: 2px 4px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <h1 className="text-2xl font-bold text-center mb-2 uppercase">Lista de Pacientes</h1>

      {listado.length > 0 && (
        <div className="flex justify-between mb-4 text-sm text-gray-600">
          <div>
            <p><strong>Consultorio:</strong> {listado[0].NombreServicio}</p>
          </div>
          <div>
            <p><strong>Médico:</strong> {`${listado[0].ApellidoPaternoMedico} ${listado[0].ApellidoMaternoMedico}, ${listado[0].NombresMedico}`}</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto text-sm">
        <table className="min-w-full border border-gray-400 text-sm">
          <thead className="bg-gray-100 border-b border-gray-400">
            <tr className="text-left">
              <th className="px-3 py-2 border-r border-gray-300">Fecha/hora de Atención</th>
              <th className="px-3 py-2 border-r border-gray-300">N° Historia</th>
              <th className="px-3 py-2 border-r border-gray-300">N° Cuenta</th>
              <th className="px-3 py-2 border-r border-gray-300">Paciente</th>
              <th className="px-3 py-2 border-r border-gray-300">Teléfono</th>
              <th className="px-3 py-2">N° DNI</th>
              <th className="px-3 py-2 print:hidden">HF</th>
            </tr>
          </thead>
          <tbody>
            {listado.map((paciente) => (
              <tr key={paciente.IdCuentaAtencion} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="px-3 py-2 border-r border-gray-300">
                  {paciente.Fecha}
                 
                </td>
                <td className="px-3 py-2 border-r border-gray-300">{paciente.NroHistoriaClinica}</td>
                <td className="px-3 py-2 border-r border-gray-300">{paciente.IdCuentaAtencion}</td>
                <td className="px-3 py-2 border-r border-gray-300">
                  {`${paciente.ApellidoPaterno} ${paciente.ApellidoMaterno} ${paciente.PrimerNombre} ${paciente.SegundoNombre ?? ''}`.trim()}
                </td>
                <td className="px-3 py-2 border-r border-gray-300">{paciente.Telefono ?? '-'}</td>
                <td className="px-3 py-2">{paciente.NroDocumento}</td>
                <td className='px-3 py-2 print:hidden'>
                  <button className='btn bg-cyan-700 text-white p-2 rounded-lg hover:bg-cyan-800 transition' onClick={()=>ImpresionHF(paciente.IdCuentaAtencion)}>
                    🖨️ Hoja Filiacion
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        <strong>N° Pacientes:</strong> {listado.length}
      </div>
    </div>
  )
}

export default ListaArchivoByIdProgramacion
