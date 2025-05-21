import React, { useState } from 'react'
import { ModalProps } from '../ui/ModalProps/ModalProps'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Tooltip } from '../ui/Tooltip';
import { FiFile } from 'react-icons/fi';

export const FormReprogramacion = ({isModalOpenR,setIsModalOpenR,openModalR,closeModalR}:any) => {
   
    const { handleSubmit, control, register, formState: { errors }, reset } = useForm();
 
      const FormRehabilitacion: SubmitHandler<any> = async (data: any) => {
    
      }
    
    return (
        <>
            <ModalProps isOpen={isModalOpenR} onClose={closeModalR} width="40vw" height="55vh">
                 <form  dir="ltr" onSubmit={handleSubmit(FormRehabilitacion)} className="p-4 space-y-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900">Formato de Medicina Física y Rehabilitación</h2>


          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de sesión</label>
            <input
              type="date"
              {...register("fechaSesion", { required: "Fecha requerida" })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Objetivo terapéutico</label>
            <textarea
              {...register("objetivo", { required: "Objetivo requerido" })}
              className="w-full h-24 p-2 border rounded"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea {...register("observaciones")} className="w-full h-24 p-2 border rounded"></textarea>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              type="button"
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={reset}
            >
              Limpiar
            </button>
          </div>
        </form>
            </ModalProps>

          
        </>



    )
}
