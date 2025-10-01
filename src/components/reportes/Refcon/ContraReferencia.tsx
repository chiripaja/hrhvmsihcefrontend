import React from 'react'

const ContraReferencia = ({ idcuentaatencion }: { idcuentaatencion: any }) => {
    return (
        <div className='min-h-screen w-full'>
            <h1 className='text-center'>HOJA DE CONTRAREFERENCIA</h1>
            <div className='flex justify-between p-2'>
                <div>
                    1. DATOS GENERALES
                </div>
                <div>
                    140-04614554
                </div>
            </div>

            <div className='flex p-2 items-center'>
                <table className="border-collapse  ml-2">
                    <tbody>
                        <tr>
                            <td rowSpan={2} className='px-2'>Fecha</td>
                            <td className="border border-black text-center px-4">Dia</td>
                            <td className="border border-black text-center px-4">Mes</td>
                            <td className="border border-black text-center px-4">Año</td>
                        </tr>
                        <tr>
                            <td className="border border-black text-center px-4">08</td>
                            <td className="border border-black text-center px-4">08</td>
                            <td className="border border-black text-center px-4">25</td>
                        </tr>
                    </tbody>
                </table>

                <table className="border-collapse ml-2 h-10">
                    <tbody>
                        <tr>   {/* 👈 altura fija en toda la fila */}
                            <td rowSpan={2} className="px-2 text-center align-middle">HORA</td>
                            <td className="border border-black text-center px-2">1</td>
                            <td className="border border-black text-center px-2">0</td>
                            <td className="border border-black text-center px-2">:</td>
                            <td className="border border-black text-center px-2">3</td>
                            <td className="border border-black text-center px-2">2</td>
                        </tr>
                    </tbody>
                </table>


                <table className="border-separate border-spacing-3  ml-2">
                    <tbody>
                        <tr>
                            <td className='px-2'>Asegurado</td>
                            <td className="border border-black text-center px-4">SI</td>
                            <td className="border border-black text-center px-4">NO</td>
                        </tr>
                        <tr>
                            <td className='px-2'>Tipo</td>
                            <td className="text-center px-4 border-b-2 border-dotted border-black" colSpan={2}>SIS</td>
                        </tr>
                    </tbody>
                </table>

            </div>

              {/* Información principal */}
          <div className="flex justify-between items-center mt-4 border-b pb-4">
            <div>
              <p className="font-bold">Apellidos Y Nombres</p>
              <p className="text-lg font-bold">dsadas</p>
            </div>
            <div>
              <p className="font-bold">Nro Historia</p>
              <p className="text-lg font-bold">dasdsa</p>
            </div>
          </div>
        </div>
    )
}

export default ContraReferencia
