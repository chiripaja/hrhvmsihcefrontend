'use client'
import React, { useEffect, useState } from 'react'
import { CEFarmacia } from './CEFarmacia/CEFarmacia';
import { CEImagenes } from './CEImagenes/CEImagenes';
import { CgNotes } from 'react-icons/cg';
import { CELaboratorio } from './CELaboratorio/CELaboratorio';
import { CEOtros } from './CEOtros/CEOtros';
import { CEProcedimientosConsultorio } from './CEProcedimientosConsultorio/CEProcedimientosConsultorio';
import { Loading } from '@/components/utils/Loading';
import { GrFormNextLink } from 'react-icons/gr';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import { getData } from '@/components/helper/axiosHelper';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { ModalGeneric } from '@/components/ui/ModalGeneric/ModalGeneric';
import { CEPaquetes } from './CEPaquetes/CEPaquetes';
export const CEOrdenesGeneral = ({ session, handleTabChange, cuentaDatos }: any) => {
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const DestinoAtencion = () => {
        setIsSubmitting(true)
        ToasterMsj('Correcto', 'success', 'Se pasará a Destino de Atencion.');
        handleTabChange('4')
        setIsSubmitting(false)
    }

    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {!cuentaDatos?.recetaCabezera?.some((receta: any) => receta.idEstado === 2) && (
                <button
                    onClick={openModal}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Kits Medicos
                </button>
            )}

            <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>
                <label className="text-lg font-semibold text-gray-900">Kit Medicos</label>
                <div className="text-sm text-gray-600">
                    <CEPaquetes onClose={closeModal} cuentaDatos={cuentaDatos} session={session} />
                </div>

            </ModalGeneric>
          
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 w-full' >
                <CEFarmacia cuentaDatos={cuentaDatos} />
                <CELaboratorio cuentaDatos={cuentaDatos} />
                <CEImagenes cuentaDatos={cuentaDatos} />
                <CEOtros session={session} cuentaDatos={cuentaDatos} />
                <CEProcedimientosConsultorio session={session} cuentaDatos={cuentaDatos} />
                <div className="flex justify-end mt-6 col-span-2">
                    <button
                        type="button"
                        onClick={DestinoAtencion}
                        disabled={isSubmitting}
                        className={`flex items-center px-4 py-2 rounded focus:outline-none ${isSubmitting ? 'bg-gray-400' : 'colorFondo'} text-white`}
                    >
                        {isSubmitting ? (
                            <Loading />
                        ) : (
                            <>
                                Guardar y continuar
                                <GrFormNextLink className="ml-2" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}
