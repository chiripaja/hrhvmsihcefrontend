import { ModuloAdmisionProc } from '@/components/ModuloAdmisionProc/ModuloAdmisionProc'
import { ModalGeneric } from '@/components/ui/ModalGeneric/ModalGeneric'
import React from 'react'

export const FormAdmisionProc = ({isModalOpen,closeModal}:any) => {
  return (
    <div>

     <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>
            <ModuloAdmisionProc/>
        
            </ModalGeneric>


    </div>
  )
}
