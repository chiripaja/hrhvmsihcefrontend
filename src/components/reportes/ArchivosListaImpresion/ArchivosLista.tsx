'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ArchivosLista = () => {
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("00:00");
  const [horaFin, setHoraFin] = useState("23:59");
    const [resultados, setResultados] = useState([])
    const [loading, setLoading] = useState(false)
  useEffect(() => {
    // Establecer la fecha actual al cargar el componente
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    setFecha(fechaFormateada);
  }, []);
    const buscarProgramacion = async () => {
        if (!fecha || !horaInicio || !horaFin) {
            alert('Por favor completa todos los campos.')
            return
        }

        try {
            setLoading(true)
            const response = await axios.get(
                `${process.env.apijimmynew}/programacionmedica/buscarProgramacionPorFechaYHora`,
                {
                    params: { fecha, horaInicio, horaFin },
                }
            )
            setResultados(response.data)
        } catch (error) {
            console.error('Error al buscar:', error)
            alert('Ocurrió un error al buscar la programación.')
        } finally {
            setLoading(false)
        }
    }

     function handleHCClick(idProgramacion: any): void {
    const url = `/reportes/listaarchivos/${idProgramacion}`;
    window.open(url, '_blank');
  }

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center" >
                🔍 Buscar Programación Médica
            </h2>

            {/* Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
                    <input
                        type="time"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
                    <input
                        type="time"
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        onClick={buscarProgramacion}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </div>

            {/* Tabla de resultados */}
            {resultados.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2 text-left">ID</th>
                                <th className="border px-3 py-2 text-left">Fecha</th>
                                <th className="border px-3 py-2 text-left">Hora Inicio</th>
                                <th className="border px-3 py-2 text-left">Hora Fin</th>
                                <th className="border px-3 py-2 text-left">Servicio</th>
                                <th className="border px-3 py-2 text-left">Imprimir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((item: any) => (
                                <tr key={item.idProgramacion} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2">{item.idProgramacion}</td>
                                    <td className="border px-3 py-2">{item.fecha}</td>
                                    <td className="border px-3 py-2">{item.horaInicio}</td>
                                    <td className="border px-3 py-2">{item.horaFin}</td>
                                    <td className="border px-3 py-2">
                                        {item.servicio?.nombre || '—'}
                                    </td>
                                    <td className="border px-3 py-2">
                                        <button
                                        onClick={()=>handleHCClick(item.idProgramacion)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-xl border  hover:bg-blue-200 transition-all duration-300 shadow-sm active:scale-95"
                                        >
                                            🖨️
                                            <span>Imprimir</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !loading && (
                    <p className="text-center text-gray-500 mt-6">
                        No hay resultados para los filtros seleccionados.
                    </p>
                )
            )}
        </div>
    )
}

export default ArchivosLista
