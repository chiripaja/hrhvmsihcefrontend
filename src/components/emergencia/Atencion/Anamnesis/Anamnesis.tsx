import React from 'react'
import { FaBookMedical, FaClock, FaFileAlt, FaHeart, FaRegEdit } from 'react-icons/fa'

export const Anamnesis = () => {
    return (
       <>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-6'>
      {/* Motivo Consulta */}
      <div className='flex flex-col space-y-2'>
        <div className='flex items-center space-x-2'>
          <FaRegEdit className='text-blue-600' />
          <p className='font-semibold text-gray-700'>Motivo Consulta</p>
        </div>
        <textarea
          rows={3}
          placeholder='Motivo Consulta...'
          className='p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
      </div>

      {/* Tiempo Enfermedad */}
      <div className='flex flex-col space-y-2'>
        <div className='flex items-center space-x-2'>
          <FaClock className='text-yellow-500' />
          <p className='font-semibold text-gray-700'>Tiempo Enfermedad</p>
        </div>
        <textarea
          rows={3}
          placeholder='Tiempo Enfermedad...'
          className='p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
      </div>

      {/* Relato */}
      <div className='flex flex-col space-y-2'>
        <div className='flex items-center space-x-2'>
          <FaFileAlt className='text-green-600' />
          <p className='font-semibold text-gray-700'>Relato</p>
        </div>
        <textarea
          rows={3}
          placeholder='Relato...'
          className='p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
      </div>

      {/* Antecedentes */}
      <div className='flex flex-col space-y-2'>
        <div className='flex items-center space-x-2'>
          <FaBookMedical className='text-red-600' />
          <p className='font-semibold text-gray-700'>Antecedentes</p>
        </div>
        <textarea
          rows={3}
          placeholder='Antecedentes...'
          className='p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
      </div>

      
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
       </>
    )
}
