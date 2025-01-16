'use client'
import { TfiBookmarkAlt, TfiClipboard, TfiRss, TfiWrite } from 'react-icons/tfi'
import { CECabezeraTriaje } from '../CECabezaTriaje/CECabezeraTriaje'
import { FaBriefcaseMedical, FaFileMedical } from 'react-icons/fa'
import { useState } from 'react';
import { CEHistoricosPatologicos } from './CEHistoricosPatologicos';



export const CEAntecedentesGeneralBC = () => {
    return (
        <>



            <div className='grid grid-cols-2 gap-3 mt-4'>
                <CEHistoricosPatologicos />

                <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="border-l-4 border-teal-500 h-6 mr-2"></span>
                        Alergias
                    </h2>
                    <div className="flex flex-col items-center justify-center mt-6">
                        <div className="mb-4">
                            <TfiBookmarkAlt size={36} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                            No hay vacunas para mostrar para este paciente.
                        </p>
                        <button aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-offcanvas-right2" data-hs-overlay="#hs-offcanvas-right2" className="text-blue-500 hover:underline text-sm">
                            Registrar Vacunas
                        </button>
                    </div>
                </div>



                <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="border-l-4 border-teal-500 h-6 mr-2"></span>
                        Quirurgicos
                    </h2>
                    <div className="flex flex-col items-center justify-center mt-6">
                        <div className="mb-4">
                            <TfiRss size={36} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                            No hay vacunas para mostrar para este paciente.
                        </p>
                        <button aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-offcanvas-right2" data-hs-overlay="#hs-offcanvas-right2" className="text-blue-500 hover:underline text-sm">
                            Registrar Vacunas
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="border-l-4 border-teal-500 h-6 mr-2"></span>
                        Familiares
                    </h2>
                    <div className="flex flex-col items-center justify-center mt-6">
                        <div className="mb-4">
                            <TfiClipboard size={36} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                            No hay diagnosticos para mostrar para este paciente.
                        </p>
                        <button aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-offcanvas-right2" data-hs-overlay="#hs-offcanvas-right2" className="text-blue-500 hover:underline text-sm">
                            Registrar Diagnostico
                        </button>
                    </div>
                </div>



            </div>







            <div id="hs-offcanvas-right2" className="hs-overlay hs-overlay-open:translate-x-0 hidden translate-x-full fixed top-0 end-0 transition-all duration-300 transform h-full max-w-lg w-96 z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700" role="dialog" tabIndex={-1} aria-labelledby="hs-offcanvas-right2-label">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                    <h3 id="hs-offcanvas-right2-label" className="font-bold text-gray-800 dark:text-white">
                        Modulo de Antecedentes
                    </h3>
                    <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-right2">
                        <span className="sr-only">Close</span>
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <p className="text-gray-800 dark:text-neutral-400">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis, obcaecati tenetur omnis, sunt neque quidem quae repellat repellendus alias sapiente minus mollitia impedit eligendi commodi provident a quas cum. Doloremque.
                    </p>
                </div>
            </div>

        </>
    )
}
