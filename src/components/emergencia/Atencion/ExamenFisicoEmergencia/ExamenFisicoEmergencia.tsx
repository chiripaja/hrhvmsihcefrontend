import React from 'react'

export const ExamenFisicoEmergencia = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {/* General */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">General</label>
                <input
                    placeholder='Informacion General...'
                    type="text"
                    className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Respiratorio */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">Respiratorio</label>
                <input
                    placeholder='Informacion Respiratorio...'
                    type="text"
                    className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Cardiovascular */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">Cardiovascular</label>
                <input
                    placeholder='Informacion Cardiovascular...'
                    type="text"
                    className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Abdomen */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">Abdomen</label>
                <input
                    placeholder='Informacion Abdomen...'
                    type="text"
                    className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Neurologico */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">Neurologico</label>
                <input
                    placeholder='Informacion Neurologico...'
                    type="text"
                    className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Genitouriano */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">Genitouriano</label>
                <input
                    placeholder='Informacion Genitouriano...'
                    type="text"
                    className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Locomotor */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">Locomotor</label>
                <input
                    placeholder='Informacion Locomotor...'
                    type="text"
                    className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Otros */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">Otros</label>
                <input
                    placeholder='Informacion Otros...'
                    type="text"
                    className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Botón de continuar */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6 flex justify-end">
                <button
                    type="button"
                    className="w-48 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
