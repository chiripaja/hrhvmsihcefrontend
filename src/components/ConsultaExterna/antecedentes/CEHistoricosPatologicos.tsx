import { showSuccessAlert } from '@/components/utils/alertHelper';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { TfiWrite } from 'react-icons/tfi'


export const CEHistoricosPatologicos = () => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();

  const FormPatologicoHistoricos: SubmitHandler<any> = async (data: any) => {

    reset();
    showSuccessAlert()

  }
  return (
    <>
      <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="border-l-4 border-teal-500 h-6 mr-2"></span>
          Patologicos
        </h2>
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="mb-4">
            <TfiWrite size={36} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm mb-4">
            No hay vacunas para mostrar para este paciente.
          </p>
          <button aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-offcanvas-rightPatologicos" data-hs-overlay="#hs-offcanvas-rightPatologicos" className="text-blue-500 hover:underline text-sm">
            Registrar Vacunas
          </button>
        </div>
      </div>


      <div id="hs-offcanvas-rightPatologicos" className="hs-overlay hs-overlay-open:translate-x-0 hidden translate-x-full fixed top-0 end-0 transition-all duration-300 transform h-full max-w-lg w-96 z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700" role="dialog" tabIndex={-1} aria-labelledby="hs-offcanvas-rightPatologicos-label">
        <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
          <h3 id="hs-offcanvas-rightPatologicos-label" className="font-bold text-gray-800 dark:text-white">
            Historico Antecedentes Patologicos
          </h3>
          <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-rightPatologicos">
            <span className="sr-only">Close</span>
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit(FormPatologicoHistoricos)}>
            <textarea rows={7} className='inputSelect m-2' {...register('medicamento')} placeholder="Examen" />
            <button type="submit" className="btnprimario m-2">Guardar</button>
          </form>
        </div>
      </div>
    </>
  )
}
