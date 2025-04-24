import { getData } from '@/components/helper/axiosHelper'
import { ModalGeneric } from '@/components/ui/ModalGeneric/ModalGeneric'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const FormAdmisionImg = ({isModalOpen,closeModal,numCuenta}:any) => {
    const [dataProgramaciones, setdataProgramaciones] = useState<any[]>([])

  const getProgramacion=async()=>{
    const data=await getData(`${process.env.apijimmynew}/programacionordenes`)
    setdataProgramaciones(data)
  }
  useEffect(() => {

    getProgramacion()
  }, [])
  
 
    
     
  return (
    <>
     <ModalGeneric isOpen={isModalOpen} onClose={closeModal} >
         <label className="text-lg font-semibold text-gray-900">Historial del Paciente : {numCuenta}zx </label>
         <div className="text-sm text-gray-600">
           dsds
         </div>
         <div className="mt-6 flex justify-end">
           <button
             className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
             onClick={closeModal}
           >
             Cerrar
           </button>
         </div>
       </ModalGeneric>
    
    </>
      
  )
}
