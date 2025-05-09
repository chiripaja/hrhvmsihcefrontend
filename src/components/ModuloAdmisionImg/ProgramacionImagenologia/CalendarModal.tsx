import { ModalProps } from '@/components/ui/ModalProps/ModalProps'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { FaFileMedical } from 'react-icons/fa';
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
registerLocale('es',es)
export const CalendarModal = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
      const { handleSubmit, control, register, formState: { errors }, reset } = useForm();
      const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
      const onSubmitModal = async (data: any) => {
        console.log(startDate)
     };
  return (
    <>
       <ModalProps isOpen={isModalOpen} onClose={closeModal} width="40vw" height="55vh">
  <div className="bg-white shadow p-4 rounded lg:col-span-1">
        <h2 className="text-xl font-bold mb-4">Programar Imagenología</h2>
        <form onSubmit={handleSubmit(onSubmitModal)} className="space-y-4">
        
         
          <div>
            <select className="w-full border p-2 rounded shadow-sm"  {...register('turno')}>
              <option value="1">Turno Mañana</option>
              <option value="2">Turno Tarde</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Hora Inicio</label>
              <input
                type="time"
                {...register('horaInicio', { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.horaInicio && <p className="text-red-500 text-sm">Campo obligatorio</p>}
            </div>

            <div>
              <label className="block font-medium">Hora Fin</label>
              <input
                type="time"
                {...register('horaFin', { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.horaFin && <p className="text-red-500 text-sm">Campo obligatorio</p>}
            </div>
          </div>

        <div>

           <DatePicker 
          
           selected={startDate} 
           onChange={(date) => setStartDate(date)} 
           locale={es}
           />
        </div>


          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar programación
          </button>
        </form>
      </div>

    </ModalProps>
    <h1>hola mundo</h1>
       <button
            className="letraFondo hover:letraFondo flex items-center "
            onClick={openModal}
          >
            <FaFileMedical />
            Formato Medicina Física
          </button>
    </>

  )
}
