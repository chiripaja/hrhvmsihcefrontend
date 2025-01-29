import React from 'react'

export const Transferencias = () => {
  return (
    <>
         <div className="p-6 bg-gray-100">
      {/* Formulario */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* Primera fila */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Médico Ordena</label>
            <div className="flex">
              <input
                type="text"
                className="border border-gray-300 rounded-l-md p-2 w-full"
              />
              <button className="bg-gray-300 border-l px-3 rounded-r-md hover:bg-gray-400">
                ...
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Servicio recibe</label>
            <div className="flex">
              <input
                type="text"
                className="border border-gray-300 rounded-l-md p-2 w-full"
              />
              <button className="bg-gray-300 border-l px-3 rounded-r-md hover:bg-gray-400">
                ...
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Médico recibe</label>
            <div className="flex">
              <input
                type="text"
                className="border border-gray-300 rounded-l-md p-2 w-full"
              />
              <button className="bg-gray-300 border-l px-3 rounded-r-md hover:bg-gray-400">
                ...
              </button>
            </div>
          </div>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha recepción</label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <input
                type="time"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Diagnósticos</label>
            <div className="flex">
              <input
                type="text"
                className="border border-gray-300 rounded-l-md p-2 w-full"
              />
              <button className="bg-gray-300 border-l px-3 rounded-r-md hover:bg-gray-400">
                ...
              </button>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          <button className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">
            Agregar
          </button>
          <button className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600">
            Quitar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">Fecha Transf</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Hora</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Nro Cama</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Servicio</th>
              <th className="border border-gray-300 px-4 py-2 text-left">NombreServicio</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Médico Ordena</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">--</td>
              <td className="border border-gray-300 px-4 py-2">--</td>
              <td className="border border-gray-300 px-4 py-2">--</td>
              <td className="border border-gray-300 px-4 py-2">--</td>
              <td className="border border-gray-300 px-4 py-2">--</td>
              <td className="border border-gray-300 px-4 py-2">--</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}
