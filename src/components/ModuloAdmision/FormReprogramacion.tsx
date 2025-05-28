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
              <form onSubmit={handleSubmit(FormReprogramacion)} className="p-6 space-y-6 bg-white shadow-lg rounded-lg">
  <h2 className="text-xl font-bold text-gray-800">Formulario de Reprogramación Médica</h2>

  {/* Datos del paciente */}
 


  {/* Fecha de reprogramación */}
  <div>
    <label className="block text-sm font-medium text-gray-700">Nueva Fecha de Atención</label>
    <input
      type="date"
      {...register("fechaReprogramacion", { required: "Fecha requerida" })}
      className="w-full mt-1 p-2 border rounded"
    />
  </div>

  {/* Motivo de reprogramación */}
  <div>
    <label className="block text-sm font-medium text-gray-700">Motivo de Reprogramación</label>
    <textarea
      {...register("motivo", { required: "Motivo requerido" })}
      className="w-full mt-1 p-2 border rounded h-24"
      placeholder="Describa el motivo de la reprogramación"
    ></textarea>
  </div>

  {/* Observaciones */}
  <div>
    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
    <textarea
      {...register("observaciones")}
      className="w-full mt-1 p-2 border rounded h-24"
      placeholder="Observaciones adicionales (opcional)"
    ></textarea>
  </div>

  {/* Botones */}
  <div className="flex justify-end gap-3 pt-1">
    <button
      type="submit"
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
    >
      Guardar Reprogramación
    </button>
    <button
      type="button"
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
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
